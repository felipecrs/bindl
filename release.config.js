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
            type: "perf",
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
    [
      "@semantic-release/release-notes-generator",
      {
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "perf", section: "Improvements" },
            { type: "refactor", section: "Improvements" },
            { type: "build", section: "Improvements" },
            { type: "chore", hidden: true },
            { type: "docs", hidden: true },
            { type: "style", hidden: true },
            { type: "test", hidden: true },
          ],
        },
      },
    ],
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
        addReleases: "bottom",
      },
    ],
  ],
  preset: "conventionalcommits",
};
