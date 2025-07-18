import { defineConfig } from "../../src/index.js";

const version = "0.10.0";
const shellcheckReleaseUrl = `https://github.com/koalaman/shellcheck/releases/download/v${version}/shellcheck-v${version}`;

export default defineConfig({
  binaries: [
    {
      platform: "linux",
      arch: "x64",
      url: `${shellcheckReleaseUrl}.linux.x86_64.tar.xz`,
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
      url: `${shellcheckReleaseUrl}.linux.armv6hf.tar.xz`,
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
      url: `${shellcheckReleaseUrl}.linux.aarch64.tar.xz`,
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
      url: `${shellcheckReleaseUrl}.darwin.x86_64.tar.xz`,
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
      url: `${shellcheckReleaseUrl}.darwin.aarch64.tar.xz`,
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
      url: `${shellcheckReleaseUrl}.zip`,
      files: [{ source: `shellcheck.exe`, target: "shellcheck.exe" }],
      tests: [
        {
          command: "./shellcheck.exe --version",
          expectedOutputContains: `version: ${version}`,
        },
      ],
    },
    {
      platform: "win32",
      arch: "arm64",
      url: `${shellcheckReleaseUrl}.zip`,
      // not using "files" to exercise a test
      tests: [
        {
          command: "./shellcheck.exe --version",
          expectedOutputContains: `version: ${version}`,
        },
      ],
    },
  ],
});
