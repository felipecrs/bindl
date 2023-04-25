const version = "v0.8.0";
const shellcheckReleaseUrl = `https://github.com/koalaman/shellcheck/releases/download/${version}/shellcheck-${version}`;

module.exports = {
  decompressPlugins: [
    "@felipecrs/decompress-tarxz"
  ],
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
    {
      platform: "linux",
      arch: "arm",
      url: `${shellcheckReleaseUrl}.linux.armv6hf.tar.xz`,
      files: [
        {
          source: `shellcheck-${version}/shellcheck`,
          target: "shellcheck",
        },
      ],
    },
    {
      platform: "linux",
      arch: "arm64",
      url: `${shellcheckReleaseUrl}.linux.aarch64.tar.xz`,
      files: [
        {
          source: `shellcheck-${version}/shellcheck`,
          target: "shellcheck",
        },
      ],
    },
    {
      platform: "darwin",
      arch: "x64",
      url: `${shellcheckReleaseUrl}.darwin.x86_64.tar.xz`,
      files: [
        {
          source: `shellcheck-${version}/shellcheck`,
          target: "shellcheck",
        },
      ],
    },
    {
      platform: "win32",
      arch: "ia32",
      url: `${shellcheckReleaseUrl}.zip`,
    },
    {
      platform: "win32",
      arch: "x64",
      url: `${shellcheckReleaseUrl}.zip`,
      files: [{ source: `shellcheck.exe`, target: "shellcheck.exe" }],
    },
  ],
};
