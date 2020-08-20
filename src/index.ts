import { Command, flags } from "@oclif/command";
import { cosmiconfig } from "cosmiconfig";
import * as download from "download";
const decompressTarxz = require("decompress-tarxz");
class Bindl extends Command {
  static description = "describe the command here";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    config: flags.string({
      char: "c",
      description: "the path to the config file",
    }),
  };

  async run() {
    const { flags } = this.parse(Bindl);

    const explorer = cosmiconfig(this.config.name);

    let result;
    if (flags.config) {
      try {
        result = await explorer.load(flags.config);
      } catch (error) {}
    } else {
      result = await explorer.search();
    }

    if (!result) {
      this.error("I was not able to load the configuration file.");
    }
    this.log(`config file passed as ${result.filepath}`);

    const url = result.config.linux.x64.url;
    const files_to_extract = result.config.linux.x64.extract;
    await download(url, "binaries", {
      extract: true,
      filter: (file) => file.path === files_to_extract,
      plugins: [decompressTarxz()],
    });
  }
}

export = Bindl;
