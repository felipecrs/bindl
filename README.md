# bindl

Downloads binaries directly or from archives as defined in a config file.

[![ci](https://github.com/felipecrs/bindl/workflows/ci/badge.svg)](https://github.com/felipecrs/bindl/actions?query=workflow%3Aci)
[![Version](https://img.shields.io/npm/v/bindl.svg)](https://npmjs.org/package/bindl)
[![Downloads/week](https://img.shields.io/npm/dw/bindl.svg)](https://npmjs.org/package/bindl)
[![License](https://img.shields.io/npm/l/bindl.svg)](https://github.com/felipecrs/bindl/blob/master/package.json)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Usage

```sh-session
$ npm install -D bindl

$ npx bindl --help
Downloads binaries directly or from archives as defined in a config file

━━━ Usage ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$ bindl

━━━ Options ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  -c,--config #0    Path to the configuration file

━━━ Details ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Downloads binaries as defined in the configuration file.

The configuration file can have any of the names and extensions accepted by
cosmiconfig such as bindl.config.js.

When no configuration file is specified, a valid configuration file will be
searched in the current directory.

━━━ Examples ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Download binaries looking for the configuration file in the current directory
  $ bindl

Download binaries looking for the configuration file at ./dir/bindl.config.js
  $ bindl --config ./dir/bindl.config.js
```

## Configuration

`bindl` supports two types of binary downloads:

### Archive Downloads (default)

Download and extract files from archives like `.tar.gz`, `.zip`, etc.:

```javascript
import { defineConfig } from "bindl";

export default defineConfig({
  binaries: [
    {
      platform: "linux",
      arch: "x64",
      url: "https://example.com/tool.tar.gz",
      // Optional: extract or remap specific files
      files: [
        {
          source: "tool-v1.0.0/bin/tool",
          target: "tool",
        },
      ],
      // Optional: strip directory components
      stripComponents: 1,
      // Optional: validate the downloaded binary
      tests: [
        {
          command: "./tool --version",
          expectedOutputContains: "v1.0.0",
        },
      ],
    },
  ],
});
```

Supported archive formats include `.tar.gz`, `.tar.bz2`, `.tar.xz`, `.tar`, and `.zip`.

### Single File Downloads

Download single executable files directly:

```javascript
import { defineConfig } from "bindl";

export default defineConfig({
  binaries: [
    {
      platform: "linux",
      arch: "x64",
      url: "https://example.com/tool-linux-amd64",
      type: "file",
      // Required for single file downloads
      filename: "tool",
      // Optional: set executable permissions on non-Windows platforms (default: true)
      executable: true,
      // Optional: validate the downloaded binary
      tests: [
        {
          command: "./tool --version",
          expectedOutputContains: "v1.0.0",
        },
      ],
    },
  ],
});
```

## Environment variables

When called without any environment variables, `bindl` downloads all binaries from the config file, regardless of the platform or architecture.

However, some environment variables can be used to tweak the behavior of `bindl`:

### `BINDL_SKIP`

When the `BINDL_SKIP` environment variable is set to a truthy value like `1` or `true`, `bindl` will skip downloading anything.

### `BINDL_CURRENT_PLATFORM`

When the `BINDL_CURRENT_ONLY` environment variable is set to a truthy value like `1` or `true`, `bindl` will only download the binaries that match the current platform and architecture.

### `npm_config_arch`

When the `npm_config_arch` environment variable is set, `bindl` will only download the binaries that match the given architecture for the current platform.

For example, if you set `npm_config_arch=x64` and you are running on Linux, `bindl` will only download the binaries that match the `linux` platform and the `x64` architecture, skipping all other binaries.
