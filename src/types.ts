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

export interface BindlBinaryTest {
  /**
   * The command to run for testing the binary.
   * This command will be executed within the binary's output directory.
   */
  command: string;
  /**
   * Expected text that should be contained in the command output
   */
  expectedOutputContains: string;
}

interface BindlBinaryBase {
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
   * Optional array of tests to run after extracting the binary.
   * Tests will only be executed if the current platform and architecture matches the binary's platform and architecture.
   */
  tests?: BindlBinaryTest[];
}

interface BindlBinaryFile extends BindlBinaryBase {
  /**
   * The type of download: "file" - Download a single file directly
   */
  type: "file";
  /**
   * The output filename for the downloaded file
   * Path is relative to the binary's platform/arch directory
   */
  filename: string;
  /**
   * Whether to make the downloaded file executable (only applicable on non-Windows platforms)
   * @default true
   */
  executable?: boolean;
}

interface BindlBinaryArchive extends BindlBinaryBase {
  /**
   * The type of download: "archive" - Download and extract an archive (tar.gz, zip, etc.)
   */
  type?: "archive";
  /**
   * The output directory for the extracted archive
   * Path is relative to the binary's platform/arch directory
   */
  filename?: string;
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

export type BindlBinary = BindlBinaryFile | BindlBinaryArchive;

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
