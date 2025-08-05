import chalk from "chalk";
import { Command, Option } from "clipanion";
import { cosmiconfig } from "cosmiconfig";
import { execaCommand } from "execa";
import { Listr } from "listr2";
import path from "node:path";
import { chmod, rm } from "node:fs/promises";

// @ts-expect-error
import download from "@xhmikosr/downloader";

import { description } from "./package.js";
import type { BindlConfig } from "./index.js";

export class MainCommand extends Command {
  config = Option.String("-c,--config", {
    description: "Path to the config file",
  });

  static usage = Command.Usage({
    description,
    details: `
        The config will be read from any valid config file in the current directory. The configuration file can be defined using all the extensions and names accepted by **cosmiconfig** such as \`bindl.config.js\`.
      `,
    examples: [
      [
        "Download binaries looking for the config file in the current directory",
        "$0",
      ],
      [
        "Download binaries looking for the config file at `./dir/bindl.config.js`",
        "$0 --config ./dir/bindl.config.js",
      ],
    ],
  });

  async execute() {
    // Return early if BINDL_SKIP is set
    if (process.env.BINDL_SKIP === "true" || process.env.BINDL_SKIP === "1") {
      this.context.stdout.write(
        "Skipping download due to the BINDL_SKIP env var being set",
      );
      return;
    }

    const explorer = cosmiconfig(this.cli.binaryLabel as string, {
      searchStrategy: "global",
    });

    const result = this.config
      ? await explorer.load(this.config)
      : await explorer.search();

    if (!result) {
      throw new Error("Not able to load the configuration file.");
    }

    const config: BindlConfig = result.config;

    const tasks = new Listr([], { concurrent: true });

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
        title: `downloading ${chalk.blue.underline(binary.url)}`,
        skip: () => {
          // If BINDL_CURRENT_ONLY is set, we only download the binary for the
          // current platform and arch.
          if (
            process.env.BINDL_CURRENT_ONLY === "true" ||
            process.env.BINDL_CURRENT_ONLY === "1"
          ) {
            if (process.platform !== binary.platform) {
              return "BINDL_CURRENT_ONLY is set and current platform is different from the binary platform";
            }

            if (process.arch !== binary.arch) {
              return "BINDL_CURRENT_ONLY is set and current arch is different from the binary arch";
            }

            return false;
          }

          // If npm_config_arch is set, we only download the binary for the
          // current platform and the arch set by npm_config_arch.
          if (process.env.npm_config_arch) {
            if (process.env.npm_config_arch !== binary.arch) {
              return "npm_config_arch is set to a different arch";
            }

            // Check if current platform is the same as the binary platform
            if (process.platform !== binary.platform) {
              return "npm_config_arch is set and current platform is different from the binary platform";
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
            throw new Error(
              `Configuration error: 'filename' is required when type is 'file'.`,
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
              const { stdout } = await execaCommand(test.command, {
                cwd: outputDirectory,
              });

              if (!stdout.includes(test.expectedOutputContains)) {
                throw new Error(
                  `Expected output to contain "${test.expectedOutputContains}", but got: ${stdout}`,
                );
              }
            } catch (error) {
              throw new Error(
                `Test failed for command "${test.command}": ${error instanceof Error ? error.message : String(error)}`,
              );
            }
          }
        },
      });
    }

    try {
      await rm(downloadDirectory, { force: true, recursive: true });
      await tasks.run();
    } catch {
      return 1;
    }
  }
}

async function importPlugin(plugin: string) {
  const { default: importedPlugin } = await import(plugin);
  return importedPlugin();
}
