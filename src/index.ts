/* eslint-disable unicorn/prefer-module */
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
      require("@felipecrs/decompress-tarxz")(),
    ];

    // eslint-disable-next-line unicorn/no-array-for-each
    result.config.binaries.forEach(
      async (binary: {
        platform: "linux" | "darwin" | "win32";
        arch: "x64" | "x86";
        url: string;
        files: { source: string; target: string }[];
      }) => {
        tasks.add({
          title: `downloading and extracting ${chalk.blue.underline(
            binary.url
          )}`,
          task: async () =>
            download(
              binary.url,
              `./binaries/${binary.platform}/${binary.arch}`,
              {
                extract: true,
                filter: (file) =>
                  Boolean(binary.files.some((f) => f.source === file.path)),
                map: (file) => {
                  const f = binary.files.find((f) => f.source === file.path);
                  if (f) {
                    file.path = f.target;
                  }

                  return file;
                },
                plugins,
              }
            ),
        });
      }
    );

    try {
      shell.rm("-rf", "./binaries");
      await tasks.run();
    } catch {
      shell.exit(1);
    }
  }
}

