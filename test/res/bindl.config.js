// @ts-check

import { defineConfig } from "../../src/index.js";

const version = "0.10.0";
const urlPrefix = `https://github.com/koalaman/shellcheck/releases/download/v${version}/shellcheck-v${version}`;

export default defineConfig({
  binaries: [
    {
      platform: "linux",
      arch: "x64",
      url: `${urlPrefix}.linux.x86_64.tar.xz`,
      files: [
        {
          source: `shellcheck-v${version}/shellcheck`,
          target: "shellcheck",
        },
      ],
      tests: [
        {
          command: "./shellcheck --version",
          expectedOutputContains: `version: ${version}`,
        },
      ],
    },
    {
      platform: "linux",
      arch: "arm",
      url: `${urlPrefix}.linux.armv6hf.tar.xz`,
      files: [
        {
          source: `shellcheck-v${version}/shellcheck`,
          target: "shellcheck",
        },
      ],
      // not using "tests" to exercise a test
    },
    {
      platform: "linux",
      arch: "arm64",
      url: `${urlPrefix}.linux.aarch64.tar.xz`,
      files: [
        {
          source: `shellcheck-v${version}/shellcheck`,
          target: "shellcheck",
        },
      ],
      tests: [
        {
          command: "./shellcheck --version",
          expectedOutputContains: `version: ${version}`,
        },
      ],
    },
    {
      platform: "darwin",
      arch: "x64",
      url: `${urlPrefix}.darwin.x86_64.tar.xz`,
      files: [
        {
          source: `shellcheck-v${version}/shellcheck`,
          target: "shellcheck",
        },
      ],
      tests: [
        {
          command: "./shellcheck --version",
          expectedOutputContains: `version: ${version}`,
        },
      ],
    },
    {
      platform: "darwin",
      arch: "arm64",
      url: `${urlPrefix}.darwin.aarch64.tar.xz`,
      stripComponents: 1,
      tests: [
        {
          command: "./shellcheck --version",
          expectedOutputContains: `version: ${version}`,
        },
      ],
    },
    {
      platform: "win32",
      arch: "x64",
      url: `${urlPrefix}.zip`,
      files: [{ source: `shellcheck.exe`, target: "shellcheck.exe" }],
      tests: [
        {
          command: String.raw`.\shellcheck.exe --version`,
          expectedOutputContains: `version: ${version}`,
        },
        {
          command: "./shellcheck.exe --version",
          expectedOutputContains: `version: ${version}`,
        },
      ],
    },
    {
      platform: "win32",
      arch: "arm64",
      url: `${urlPrefix}.zip`,
      // not using "files" to exercise a test
      tests: [
        {
          command: String.raw`.\shellcheck.exe --version`,
          expectedOutputContains: `version: ${version}`,
        },
        {
          command: "./shellcheck.exe --version",
          expectedOutputContains: `version: ${version}`,
        },
      ],
    },
  ],
});
