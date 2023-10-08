import { Builtins, Cli } from "clipanion";
import { MainCommand } from "./command.js";
import { name, version } from "./package.js";

const cli = new Cli({
  binaryLabel: name,
  binaryName: name,
  binaryVersion: version,
});

cli.register(MainCommand);
cli.register(Builtins.HelpCommand);
cli.register(Builtins.VersionCommand);

const processArguments = process.argv.slice(2);

cli.runExit(processArguments);
