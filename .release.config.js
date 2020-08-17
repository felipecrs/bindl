module.exports = {
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        releaseRules: [
          {
            type: "refactor",
            release: "patch",
          },
          {
            type: "build",
            scope: "deps",
            release: "patch",
          },
        ],
      },
    ],
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        tarballDir: "dist",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: [
          "README.md",
          "CHANGELOG.md",
          "package.json",
          "package-lock.json",
          "npm-shrinkwrap.json",
        ],
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: "dist/*.tgz",
      },
    ],
  ],
  preset: "conventionalcommits",
};
