#!/usr/bin/env node

import { Builtins, Cli } from "clipanion";
import packageJson from "../package.json" with { type: "json" };
import { MainCommand } from "./command.js";

const { name, version } = packageJson;

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
