import { Command, flags } from "@oclif/command";

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

    const config = flags.config ?? "cosmic-config";
    this.log(`config file passed as ${config}`);
  }
}

export = Bindl;
