// @ts-check

import { defineConfig } from "../../src/index.js";

export default defineConfig({
  binaries: [
    {
      platform: "linux",
      arch: "x64",
      url: "https://github.com/koalaman/shellcheck/releases/download/v0.10.0/shellcheck-v0.10.0.linux.x86_64.tar.xz",
      files: [
        {
          source: "shellcheck-v0.10.0/",
          target: "directory/",
        },
      ],
    },
    {
      platform: "linux",
      arch: "x64",
      url: "https://github.com/koalaman/shellcheck/releases/download/v0.10.0/shellcheck-v0.10.0.linux.x86_64.tar.xz",
      files: [
        {
          source: "shellcheck-v0.10.0/",
          target: "",
        },
      ],
    },
  ],
});
