import { Command, Flags } from "@oclif/core";
import { cosmiconfig } from "cosmiconfig";
import * as download from "download";
import * as Listr from "listr";
// eslint-disable-next-line unicorn/import-style
import * as chalk from "chalk";
import * as shell from "shelljs";
require("pkginfo")(module, "description");

export class Bindl extends Command {
  static description = `${module.exports.description}
  The config will be read from any valid config file in the current directory. The configuration file can be defined using all the extensions and names accepted by ${chalk.blue(
    "cosmiconfig"
  )}, such as ${chalk.blue("bindl.config.js")}
  `;

  static flags = {
    version: Flags.version(),
    help: Flags.help(),
    config: Flags.string({
      char: "c",
      description: "Path to the config file",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Bindl);

    // Return early if BINDL_SKIP is set
    if (process.env.BINDL_SKIP) {
      this.log("Skipping download due to the BINDL_SKIP env var being set");
      return;
    }

    const explorer = cosmiconfig(this.config.name);

    const result = flags.config
      ? await explorer.load(flags.config)
      : await explorer.search();

    if (!result) {
      this.error("I was not able to load the configuration file.");
    }

    const tasks = new Listr({ concurrent: true });

    const plugins = [
      require("decompress-tar")(),
      require("decompress-tarbz2")(),
      require("decompress-targz")(),
      require("decompress-unzip")(),
    ];

    // Load the custom decompressPlugins
    if (
      result.config.decompressPlugins &&
      result.config.decompressPlugins.length > 0
    ) {
      for (const plugin of result.config.decompressPlugins) {
        plugins.push(require(plugin)());
      }
    }

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
          download(binary.url, `./binaries/${binary.platform}/${binary.arch}`, {
            extract: true,
            filter: (file) => {
              if (binary.files) {
                return Boolean(
                  binary.files.some((f) => f.source === file.path)
                );
              }

              return true;
            },
            map: (file) => {
              if (binary.files) {
                const f = binary.files.find((f) => f.source === file.path);
                if (f) {
                  file.path = f.target;
                }
              }

              return file;
            },
            plugins,
          }),
      });
    }

    try {
      shell.rm("-rf", "./binaries");
      await tasks.run();
    } catch {
      shell.exit(1);
    }
  }
}
