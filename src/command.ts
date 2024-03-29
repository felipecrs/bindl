import { Command, Option } from "clipanion";
import { cosmiconfig } from "cosmiconfig";
import { rimraf } from "rimraf";
import * as download from "download";
import * as Listr from "listr";
// eslint-disable-next-line unicorn/import-style
import * as chalk from "chalk";
import { description } from "../package.json";

export class MainCommand extends Command {
  config = Option.String("-c,--config", {
    description: "Path to the config file",
  });

  static usage = Command.Usage({
    description: description,
    details: `
        The config will be read from any valid config file in the current directory. The configuration file can be defined using all the extensions and names accepted by **cosmiconfig** such as \`bindl.config.cjs\`.
      `,
    examples: [
      [
        "Download binaries looking for the config file in the current directory",
        "$0",
      ],
      [
        "Download binaries looking for the config file at `./dir/bindl.config.cjs`",
        "$0 --config ./dir/bindl.config.cjs",
      ],
    ],
  });

  async execute() {
    // Return early if BINDL_SKIP is set
    if (process.env.BINDL_SKIP) {
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

    const tasks = new Listr({ concurrent: true });

    const plugins = [
      importPlugin("decompress-tar"),
      importPlugin("decompress-tarbz2"),
      importPlugin("decompress-targz"),
      importPlugin("decompress-unzip"),
    ];

    // Load the custom decompressPlugins
    if (
      result.config.decompressPlugins &&
      result.config.decompressPlugins.length > 0
    ) {
      for (const plugin of result.config.decompressPlugins) {
        plugins.push(importPlugin(plugin));
      }
    }

    const downloadDirectory = result.config.downloadDirectory ?? "./binaries";

    for (const binary of result.config.binaries as {
      platform: "linux" | "darwin" | "win32";
      arch: "x64" | "x86";
      url: string;
      files: { source: string; target: string }[];
    }[]) {
      tasks.add({
        title: `downloading and extracting ${chalk.blue.underline(binary.url)}`,
        skip: () => {
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
        task: async () =>
          download(
            binary.url,
            `${downloadDirectory}/${binary.platform}/${binary.arch}`,
            {
              extract: true,
              filter: (file) => {
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
                    }),
                  );
                }

                return true;
              },
              map: (file) => {
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
          ),
      });
    }

    try {
      await rimraf(downloadDirectory);
      await tasks.run();
    } catch {
      return 1;
    }
  }
}

const importPlugin = (plugin: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
  return require(plugin)();
};
