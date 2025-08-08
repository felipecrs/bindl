#!/usr/bin/env node

import { Builtins, Cli } from "clipanion";
import { MainCommand } from "./command.ts";
import { name, version } from "./package.ts";

export * from "./types.ts";

// @ts-expect-error @types/node not updated yet
if (import.meta.main) {
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
}
