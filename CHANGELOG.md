## [4.1.3](https://github.com/felipecrs/bindl/compare/v4.1.2...v4.1.3) (2023-04-29)


### Bug Fixes

* executing `bindl` asks to install `ts-node` ([#327](https://github.com/felipecrs/bindl/issues/327)) ([3287f0d](https://github.com/felipecrs/bindl/commit/3287f0dace07235d292d0f4e6b6e057d2340bb49))

## [4.1.2](https://github.com/felipecrs/bindl/compare/v4.1.1...v4.1.2) (2023-04-29)


### ⚠ BREAKING CHANGES

* Types declarations are no longer included in the
package. I believe no one was using them anyway, but if you were, please
open an issue and I'll add them back.

### Code Refactoring

* migrate from `oclif` to `clipanion` ([#326](https://github.com/felipecrs/bindl/issues/326)) ([1682024](https://github.com/felipecrs/bindl/commit/168202423d9f8288d6dc71f167c6853819915649)), closes [#225](https://github.com/felipecrs/bindl/issues/225)

## [4.1.1](https://github.com/felipecrs/bindl/compare/v4.1.0...v4.1.1) (2023-04-25)


### Dependencies

* **deps:** bump @oclif/command from 1.8.20 to 1.8.24 ([#322](https://github.com/felipecrs/bindl/issues/322)) ([bdcf560](https://github.com/felipecrs/bindl/commit/bdcf56086420ab8ab02cda771f0cb336c04a4c18))
* **deps:** bump @oclif/config from 1.18.6 to 1.18.8 ([#266](https://github.com/felipecrs/bindl/issues/266)) ([8ab86e5](https://github.com/felipecrs/bindl/commit/8ab86e5b1c77315a3fec70f0b7b2e52e89e50ed5))
* **deps:** bump @oclif/plugin-help from 3.3.1 to 5.2.9 ([#310](https://github.com/felipecrs/bindl/issues/310)) ([5270777](https://github.com/felipecrs/bindl/commit/5270777c6cd1a629e767b2014363bffaef134f90))
* **deps:** bump decode-uri-component from 0.2.0 to 0.2.2 ([#293](https://github.com/felipecrs/bindl/issues/293)) ([f0b2fd6](https://github.com/felipecrs/bindl/commit/f0b2fd6e9a590bb2432bd84dcd39c6884335d28e))
* **deps:** bump json5 from 2.2.1 to 2.2.3 ([#294](https://github.com/felipecrs/bindl/issues/294)) ([a2c81cb](https://github.com/felipecrs/bindl/commit/a2c81cb46082c59ba0985927719c7f7b98f28d92))
* **deps:** bump yaml, cosmiconfig, semantic-release and husky ([#321](https://github.com/felipecrs/bindl/issues/321)) ([2a3299e](https://github.com/felipecrs/bindl/commit/2a3299ec7734b5356379425b74db332dc6dd5563))
* **deps:** update `oclif` to latest version and several other dependencies ([#183](https://github.com/felipecrs/bindl/issues/183)) ([a9cf7a8](https://github.com/felipecrs/bindl/commit/a9cf7a82b191e3a5e74ca7586ec22243b350ba83))

## [4.1.0](https://github.com/felipecrs/bindl/compare/v4.0.1...v4.1.0) (2022-12-05)


### Features

* allow to skip download with BINDL_SKIP ([bc69ed8](https://github.com/felipecrs/bindl/commit/bc69ed869f8d701c1513cc42494e92ec36051c6a))

## [4.0.1](https://github.com/felipecrs/bindl/compare/v4.0.0...v4.0.1) (2022-11-17)


### Bug Fixes

* download when no files are specified ([4b2d56d](https://github.com/felipecrs/bindl/commit/4b2d56d38404f0487eb0fafca3e9c56bfd4cbf39))

## [4.0.0](https://github.com/felipecrs/bindl/compare/v3.0.0...v4.0.0) (2022-11-17)


### ⚠ BREAKING CHANGES

* support custom decompress plugins, drop support for xz by default

### Features

* support custom decompress plugins, drop support for xz by default ([492b1ca](https://github.com/felipecrs/bindl/commit/492b1ca4b23d10bec91a5483b27a77b22796728a))

## [3.0.0](https://github.com/felipecrs/bindl/compare/v2.0.0...v3.0.0) (2022-11-16)


### ⚠ BREAKING CHANGES

* honor `npm_config_arch` if set
* **deps:** drop support for node 10 and 12

### Features

* honor `npm_config_arch` if set ([2f505ac](https://github.com/felipecrs/bindl/commit/2f505ac3fbe5b34cf710e4bceef16f417478e6d8))


### Dependencies

* **deps:** drop support for node 10 and 12 ([6883ba6](https://github.com/felipecrs/bindl/commit/6883ba6eb4f5c9111cf76caf0d05e1913c785bfd))
* **deps:** refresh dependencies ([18d9f77](https://github.com/felipecrs/bindl/commit/18d9f7783e277fb26766c2f39e9a3a41d7a310fc))
* **deps:** tidy up dependencies ([afa682a](https://github.com/felipecrs/bindl/commit/afa682a3e9deece69ab0d2a685b34288e8a95442))

## [2.0.0](https://github.com/felipecrs/bindl/compare/v1.1.1...v2.0.0) (2021-08-03)


### ⚠ BREAKING CHANGES

* The minimum version of Node required was bumped from 8
to 10 due to the new dependencies.

### Features

* fix installation on Windows, remove `tslib` ([#131](https://github.com/felipecrs/bindl/issues/131)) ([145c5c0](https://github.com/felipecrs/bindl/commit/145c5c0d779bc8430187f596d64f4fe02371f36c))

### [1.1.1](https://github.com/felipecrs/bindl/compare/v1.1.0...v1.1.1) (2021-06-14)


### Dependencies

* **deps:** upgrade dependencies ([2693f95](https://github.com/felipecrs/bindl/commit/2693f9501d4b40eb6c2388deaee4bf749690387a))

## [1.1.0](https://github.com/felipecrs/bindl/compare/v1.0.3...v1.1.0) (2021-02-07)


### Features

* download binaries parallelly ([#71](https://github.com/felipecrs/bindl/issues/71)) ([84511e5](https://github.com/felipecrs/bindl/commit/84511e585937f18b54e565e6685c7ea2fa11d2b0))


### Dependencies

* **deps:** bump @oclif/plugin-help from 3.2.1 to 3.2.2 ([#70](https://github.com/felipecrs/bindl/issues/70)) ([062fe67](https://github.com/felipecrs/bindl/commit/062fe67b5b01cc804ffa61176911682989ffe50f))
* **deps:** bump tslib from 2.0.3 to 2.1.0 ([#60](https://github.com/felipecrs/bindl/issues/60)) ([b6570bc](https://github.com/felipecrs/bindl/commit/b6570bcb2df133e90bab8335969e19839e209cff))

### [1.0.5](https://github.com/felipecrs/bindl/compare/v1.0.4...v1.0.5) (2021-02-04)


### Dependencies

* **deps:** bump @oclif/plugin-help from 3.2.1 to 3.2.2 ([#70](https://github.com/felipecrs/bindl/issues/70)) ([062fe67](https://github.com/felipecrs/bindl/commit/062fe67b5b01cc804ffa61176911682989ffe50f))

### [1.0.4](https://github.com/felipecrs/bindl/compare/v1.0.3...v1.0.4) (2021-01-19)


### Dependencies

* **deps:** bump tslib from 2.0.3 to 2.1.0 ([#60](https://github.com/felipecrs/bindl/issues/60)) ([b6570bc](https://github.com/felipecrs/bindl/commit/b6570bcb2df133e90bab8335969e19839e209cff))

### [1.0.3](https://github.com/felipecrs/bindl/compare/v1.0.2...v1.0.3) (2020-12-30)


### Dependencies

* **deps:** bump @oclif/plugin-help from 3.2.0 to 3.2.1 ([#54](https://github.com/felipecrs/bindl/issues/54)) ([de8e260](https://github.com/felipecrs/bindl/commit/de8e260b75d59420a3d3bc37a11848ffd1342ee1))

### [1.0.2](https://github.com/felipecrs/bindl/compare/v1.0.1...v1.0.2) (2020-10-12)


### Improvements

* **deps:** bump tslib from 2.0.2 to 2.0.3 ([#34](https://github.com/felipecrs/bindl/issues/34)) ([b8977a1](https://github.com/felipecrs/bindl/commit/b8977a1a72da1370551e1db7828c2155271d6a2b))
* **deps-dev:** bump jest from 26.5.2 to 26.5.3 ([#33](https://github.com/felipecrs/bindl/issues/33)) ([1d260b9](https://github.com/felipecrs/bindl/commit/1d260b9c56d37aeb93453609abb7d4bd006b3fa6))
* **deps-dev:** bump semantic-release from 17.1.2 to 17.2.1 ([#36](https://github.com/felipecrs/bindl/issues/36)) ([9eba368](https://github.com/felipecrs/bindl/commit/9eba3680c8132629cd4e5976e5721f25b0d8f12a))

### [1.0.1](https://github.com/felipecrs/bindl/compare/v1.0.0...v1.0.1) (2020-10-07)
