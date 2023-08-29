/* eslint-env node */

const version = "v0.8.0";
const shellcheckReleaseUrl = `https://github.com/koalaman/shellcheck/releases/download/${version}/shellcheck-${version}`;

module.exports = {
  decompressPlugins: ["@felipecrs/decompress-tarxz"],
  binaries: [
    {
      platform: "linux",
      arch: "x64",
      url: `${shellcheckReleaseUrl}.linux.x86_64.tar.xz`,
      files: [
        {
          source: `shellcheck-${version}/`,
          target: "directory/",
        },
      ],
    },
    {
      platform: "linux",
      arch: "x64",
      url: `${shellcheckReleaseUrl}.linux.x86_64.tar.xz`,
      files: [
        {
          source: `shellcheck-${version}/`,
          target: "",
        },
      ],
    },
  ],
};
