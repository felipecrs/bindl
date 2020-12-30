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
            {
              type: "feat",
              section: "Features",
            },
            {
              type: "fix",
              section: "Bug Fixes",
            },
            {
              type: "perf",
              section: "Performance Improvements",
            },
            {
              type: "revert",
              section: "Reverts",
            },
            {
              type: "refactor",
              section: "Code Refactoring",
            },
            {
              type: "build",
              scope: "deps",
              section: "Dependencies",
            },
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
