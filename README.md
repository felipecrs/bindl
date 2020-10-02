# bindl

Download and extract binaries from compressed packages.

[![ci](https://github.com/felipecrs/bindl/workflows/ci/badge.svg)](https://github.com/felipecrs/bindl/actions?query=workflow%3Aci)
[![Version](https://img.shields.io/npm/v/bindl.svg)](https://npmjs.org/package/bindl)
[![Downloads/week](https://img.shields.io/npm/dw/bindl.svg)](https://npmjs.org/package/bindl)
[![License](https://img.shields.io/npm/l/bindl.svg)](https://github.com/felipecassiors/bindl/blob/master/package.json)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

<!-- toc -->
* [bindl](#bindl)
* [Usage](#usage)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g bindl
$ bindl COMMAND
running command...
$ bindl (-v|--version|version)
bindl/1.0.0 linux-x64 node-v12.18.4
$ bindl --help [COMMAND]
USAGE
  $ bindl COMMAND
...
```
<!-- usagestop -->

```sh-session
$ bindl --help
Downloads and extracts binaries from compressed packages using a config file

USAGE
  $ bindl

OPTIONS
  -c, --config=config  Path to the config file
  -h, --help           show CLI help
  --version            show CLI version

DESCRIPTION
  The config will be read from any valid config file in the current directory. The configuration file can be
  defined using all the extensions and names accepted by cosmiconfig, such as bindl.config.js
```

You can find an example of config file [here](./test/res/bindl.config.js).

<!-- commands -->

<!-- commandsstop -->
