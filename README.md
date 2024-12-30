# bindl

Download and extract binaries from compressed packages.

[![ci](https://github.com/felipecrs/bindl/workflows/ci/badge.svg)](https://github.com/felipecrs/bindl/actions?query=workflow%3Aci)
[![Version](https://img.shields.io/npm/v/bindl.svg)](https://npmjs.org/package/bindl)
[![Downloads/week](https://img.shields.io/npm/dw/bindl.svg)](https://npmjs.org/package/bindl)
[![License](https://img.shields.io/npm/l/bindl.svg)](https://github.com/felipecrs/bindl/blob/master/package.json)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Usage

```sh-session
$ npm install --global bindl

$ bindl --help
Downloads and extracts binaries from compressed packages using a config file

━━━ Usage ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$ bindl

━━━ Options ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  -c,--config #0    Path to the config file

━━━ Details ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The config will be read from any valid config file in the current directory. The
configuration file can be defined using all the extensions and names accepted by
**cosmiconfig** such as `bindl.config.js`.

━━━ Examples ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Download binaries looking for the config file in the current directory
  $ bindl

Download binaries looking for the config file at `./dir/bindl.config.js`
  $ bindl --config ./dir/bindl.config.js
```

You can find an example of a config file [here](./test/res/bindl.config.js).

## Environment variables

When called without any environment variables, `bindl` downloads all packages from the config file, not matter the platform or architecture.

However, some environment variables can be used to tweak the behavior of `bindl`:

### `BINDL_SKIP`

When the `BINDL_SKIP` environment variable is set to a truthy like `1` or `true`, `bindl` will skip downloading anything.

### `npm_config_arch`

When the `npm_config_arch` environment variable is set, `bindl` will only download the packages that match the given architecture for the current architecture.

For example, if you set `npm_config_arch=x64` and you are running on Linux, `bindl` will only download the packages that match the `linux` platform and the `x64` architecture, skipping all other packages.
