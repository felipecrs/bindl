import { chmod, rm } from "node:fs/promises";
import path from "node:path";

import { Command, Option, UsageError } from "clipanion";
import { cosmiconfig, type CosmiconfigResult } from "cosmiconfig";
import { Listr } from "listr2";
import pc from "picocolors";

// @ts-expect-error
import download from "@xhmikosr/downloader";

import type { BindlConfig } from "./index.ts";
import { description } from "./package.ts";
import { execCommand } from "./utilities.ts";

export class MainCommand extends Command {
  config = Option.String("-c,--config", {
    description: `Path to the ${pc.bold("configuration file")}`,
  });

  static usage = Command.Usage({
    description,
    details: `
        Downloads binaries as defined in the ${pc.bold("configuration file")}.

        The configuration file can have any of the names and extensions accepted by ${pc.bold("cosmiconfig")} such as ${pc.cyan("bindl.config.js")}.

        When no configuration file is specified, a valid configuration file will be searched in the ${pc.bold("current directory")}.
      `,
    examples: [
      [
        `Download binaries looking for the configuration file in the ${pc.bold("current directory")}`,
        "$0",
      ],
      [
        `Download binaries looking for the configuration file at ${pc.cyan("./dir/bindl.config.js")}`,
        "$0 --config ./dir/bindl.config.js",
      ],
    ],
  });

  async execute() {
    // Return early if BINDL_SKIP is set
    if (process.env.BINDL_SKIP === "true" || process.env.BINDL_SKIP === "1") {
      console.log(
        `Skipping binaries download as ${pc.cyan("BINDL_SKIP")} is set`,
      );
      return;
    }

    const explorer = cosmiconfig(this.cli.binaryLabel as string, {
      searchStrategy: "global",
    });

    let result: CosmiconfigResult;
    try {
      result = this.config
        ? await explorer.load(this.config)
        : await explorer.search();
    } catch (error) {
      throw new UsageError(
        `Unable to load configuration file: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (!result) {
      throw new UsageError("No configuration file found");
    }

    const config: BindlConfig = result.config;

    const tasks = new Listr([], {
      concurrent: true,
      exitOnError: false,
      collectErrors: "minimal",
      rendererOptions: { collapseErrors: false },
    });

    const plugins = [
      await importPlugin("@xhmikosr/decompress-tar"),
      await importPlugin("@xhmikosr/decompress-tarbz2"),
      await importPlugin("@xhmikosr/decompress-targz"),
      await importPlugin("@felipecrs/decompress-tarxz"),
      await importPlugin("@xhmikosr/decompress-unzip"),
    ];

    // Load the custom decompressPlugins
    if (config.decompressPlugins && config.decompressPlugins.length > 0) {
      for (const plugin of config.decompressPlugins) {
        plugins.push(await importPlugin(plugin));
      }
    }

    const downloadDirectory = path.normalize(
      config.downloadDirectory ?? "./binaries",
    );

    for (const binary of config.binaries) {
      tasks.add({
        title: pc.blue(pc.underline(binary.url)),
        skip: () => {
          const platformArch = pc.cyan(`${binary.platform}/${binary.arch}`);

          // If BINDL_CURRENT_ONLY is set, we only download the binary for the
          // current platform and arch.
          if (
            process.env.BINDL_CURRENT_ONLY === "true" ||
            process.env.BINDL_CURRENT_ONLY === "1"
          ) {
            if (process.platform !== binary.platform) {
              return `${platformArch} skipped as ${pc.cyan("BINDL_CURRENT_ONLY")} is set and ${pc.bold("platform")} is different`;
            }

            if (process.arch !== binary.arch) {
              return `${platformArch} skipped as ${pc.cyan("BINDL_CURRENT_ONLY")} is set and ${pc.bold("arch")} is different`;
            }

            return false;
          }

          // If npm_config_arch is set, we only download the binary for the
          // current platform and the arch set by npm_config_arch.
          if (process.env.npm_config_arch) {
            // Check if current platform is the same as the binary platform
            if (process.platform !== binary.platform) {
              return `${platformArch} skipped as ${pc.cyan("npm_config_arch")} is set and ${pc.bold("platform")} is different`;
            }

            if (process.env.npm_config_arch !== binary.arch) {
              return `${platformArch} skipped as ${pc.cyan("npm_config_arch")} is set and ${pc.bold("arch")} is different`;
            }
          }

          return false;
        },
        task: async () => {
          const outputDirectory = path.join(
            downloadDirectory,
            binary.platform,
            binary.arch,
          );

          if (binary.type === "file" && binary.filename === undefined) {
            throw new UsageError(
              `Wrong configuration: ${pc.yellow("filename")} is required when type is ${pc.yellow("file")}`,
            );
          }

          const downloadOptions =
            binary.type === "file"
              ? {
                  filename: binary.filename,
                }
              : {
                  extract: true,
                  decompress: {
                    strip: binary.stripComponents,
                    filter: (file: any) => {
                      if (binary.files) {
                        return Boolean(
                          binary.files.some((f) => {
                            if (f.source === file.path) {
                              return true;
                            }
                            // Compare by path. For example, if source is shellcheck/ and
                            // file is shellcheck/LICENSE.txt, we want to return true.
                            if (
                              f.source.endsWith("/") &&
                              file.path.startsWith(f.source)
                            ) {
                              return true;
                            }
                            return false;
                          }),
                        );
                      }

                      return true;
                    },
                    map: (file: any) => {
                      if (binary.files) {
                        let remapDirectory = false;
                        const f = binary.files.find((f) => {
                          if (f.source === file.path) {
                            return true;
                          }
                          // Compare by path. For example, if source is shellcheck/ and
                          // target is directory/, and file is shellcheck/LICENSE.txt, we
                          // want to map it to directory/LICENSE.txt.
                          if (
                            f.source.endsWith("/") &&
                            file.path.startsWith(f.source)
                          ) {
                            remapDirectory = true;
                            return true;
                          }
                          return false;
                        });
                        if (f) {
                          file.path = remapDirectory
                            ? file.path.replace(f.source, f.target)
                            : f.target;
                        }
                      }

                      return file;
                    },
                    plugins,
                  },
                };

          await download(binary.url, outputDirectory, downloadOptions);

          if (binary.type === "file") {
            const filePath = path.join(outputDirectory, binary.filename);

            // Set executable permissions on non-Windows platforms
            if ((binary.executable ?? true) && process.platform !== "win32") {
              await chmod(filePath, 0o755);
            }
          }

          // Only run tests for the current platform and arch
          if (
            !binary.tests ||
            binary.tests.length === 0 ||
            process.platform !== binary.platform ||
            process.arch !== binary.arch
          ) {
            return;
          }

          for (const test of binary.tests) {
            try {
              const { stdout } = await execCommand(test.command, {
                cwd: outputDirectory,
              });

              if (!stdout.includes(test.expectedOutputContains)) {
                throw new Error(
                  `Expected output to contain ${pc.green(test.expectedOutputContains)}, got:\n${pc.red(stdout)}`,
                );
              }
            } catch (error) {
              throw new Error(
                `Test ${pc.red("failed")} for command ${pc.yellow(test.command)}:\n${error instanceof Error ? error.message : String(error)}`,
              );
            }
          }
        },
      });
    }

    try {
      await rm(downloadDirectory, { force: true, recursive: true });
      await tasks.run();
      if (tasks.errors.length > 0) {
        return 1;
      }
    } catch {
      return 1;
    }
  }
}

async function importPlugin(plugin: string) {
  const { default: importedPlugin } = await import(plugin);
  return importedPlugin();
}
