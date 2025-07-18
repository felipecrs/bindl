#!/usr/bin/env node

import { realpath } from "node:fs/promises";
import { Builtins, Cli } from "clipanion";
import { MainCommand } from "./command.js";
import { name, version } from "./package.js";

export interface BindlArchiveFile {
  /**
   * The source path of the file in the archive
   */
  source: string;
  /**
   * The target path where the file should be extracted
   */
  target: string;
}

export interface BindlBinary {
  /**
   * The target platform for this binary
   */
  platform: "linux" | "darwin" | "win32";
  /**
   * The target architecture for this binary
   */
  arch: "x64" | "x86" | "arm" | "arm64";
  /**
   * The URL to download the binary from
   */
  url: string;
  /**
   * Optional array of files to extract from the archive.
   * If not specified, all files will be extracted.
   */
  files?: BindlArchiveFile[];
  /**
   * Number of leading components to strip from file names when extracting.
   * Useful when the archive contains a top-level directory that you want to remove.
   */
  stripComponents?: number;
}

export interface BindlConfig {
  /**
   * Directory where binaries will be downloaded and extracted.
   * @default "./binaries"
   */
  downloadDirectory?: string;
  /**
   * Array of binaries to download
   */
  binaries: BindlBinary[];
  /**
   * Optional array of custom decompress plugins to use in addition to the built-in ones.
   * These should be npm package names that export decompress plugins.
   */
  decompressPlugins?: string[];
}

/**
 * Define a bindl configuration
 *
 * @param config The bindl configuration object
 * @returns The same configuration object
 *
 * @example
 * ```typescript
 * import { defineConfig } from 'bindl';
 *
 * export default defineConfig({
 *   binaries: [
 *     {
 *       platform: "linux",
 *       arch: "x64",
 *       url: "https://example.com/binary.tar.gz",
 *       stripComponents: 1,
 *     }
 *   ]
 * });
 * ```
 */
export function defineConfig(config: BindlConfig): BindlConfig {
  return config;
}

// Only run the CLI if this file is being executed directly
// TODO: use import.meta.main when available
// https://nodejs.org/docs/latest-v24.x/api/esm.html#importmetamain
const thisModule = await realpath(process.argv[1]);
if (import.meta.url === `file://${thisModule}`) {
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
