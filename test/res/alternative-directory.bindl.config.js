const version = "v0.10.0";
const shellcheckReleaseUrl = `https://github.com/koalaman/shellcheck/releases/download/${version}/shellcheck-${version}`;

export default {
  decompressPlugins: ["@felipecrs/decompress-tarxz"],
  downloadDirectory: "binaries-test",
  binaries: [
    {
      platform: "linux",
      arch: "x64",
      url: `${shellcheckReleaseUrl}.linux.x86_64.tar.xz`,
      files: [
        {
          source: `shellcheck-${version}/shellcheck`,
          target: "shellcheck",
        },
      ],
    },
  ],
};
