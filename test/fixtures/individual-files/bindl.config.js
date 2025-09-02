// @ts-check

import { defineConfig } from "../../../src/index.ts";

export default defineConfig({
  binaries: [
    {
      platform: "linux",
      arch: "x64",
      url: "https://github.com/mvdan/sh/releases/download/v3.12.0/shfmt_v3.12.0_linux_amd64",
      sha256:
        "d9fbb2a9c33d13f47e7618cf362a914d029d02a6df124064fff04fd688a745ea",
      type: "file",
      filename: "shfmt",
      tests: [
        {
          command: "./shfmt --version",
          expectedOutputContains: "v3.12.0",
        },
      ],
    },
    {
      platform: "linux",
      arch: "x64",
      url: "https://github.com/mvdan/sh/releases/download/v3.12.0/sha256sums.txt",
      type: "file",
      filename: "sha256sums.txt",
      executable: false,
      tests: [
        {
          command: "grep shfmt_v3.12.0_linux_amd64 sha256sums.txt",
          expectedOutputContains: " shfmt_v3.12.0_linux_amd64",
        },
      ],
    },
  ],
});
