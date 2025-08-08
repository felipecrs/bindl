import { access, rm, stat, mkdtemp } from "node:fs/promises";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { execCommand } from "../src/utilities.js";

const repoDirectory = path.normalize(`${import.meta.dirname}/..`);
const binCommand = `node ${path.normalize(`${repoDirectory}/src/index.ts`)}`;
const fixturesDirectory = path.normalize(`${repoDirectory}/test/fixtures`);
const mainConfigPath = path.normalize(
  `${fixturesDirectory}/main/bindl.config.js`,
);

declare module "vitest" {
  export interface TestContext {
    temporaryDirectory: string;
  }
}

describe(
  "bindl",
  {
    timeout: 30_000,
  },
  () => {
    beforeEach(async (context) => {
      context.temporaryDirectory = await mkdtemp(
        path.normalize(`${repoDirectory}/test/temp-`),
      );
      process.chdir(context.temporaryDirectory);
    });

    afterEach(async (context) => {
      process.chdir(repoDirectory);
      await rm(context.temporaryDirectory, { force: true, recursive: true });
    });

    it("downloads shellcheck", async () => {
      const result = await execCommand(
        `${binCommand} --config ${mainConfigPath}`,
      );
      expect(result.stdout).toContain(
        `https://github.com/koalaman/shellcheck/releases/download`,
      );

      expect(await exists(`./binaries/linux/x64/shellcheck`)).toBeTruthy();
      expect(await exists(`./binaries/linux/arm/shellcheck`)).toBeTruthy();
      expect(await exists(`./binaries/linux/arm64/shellcheck`)).toBeTruthy();
      expect(await exists(`./binaries/darwin/x64/shellcheck`)).toBeTruthy();
      expect(await exists(`./binaries/darwin/arm64/shellcheck`)).toBeTruthy();
      expect(await exists(`./binaries/darwin/arm64/LICENSE.txt`)).toBeTruthy();
      expect(await exists(`./binaries/darwin/arm64/README.txt`)).toBeTruthy();
      expect(await exists(`./binaries/win32/x64/shellcheck.exe`)).toBeTruthy();
      expect(
        await exists(`./binaries/win32/arm64/shellcheck.exe`),
      ).toBeTruthy();
      expect(await exists(`./binaries/win32/arm64/LICENSE.txt`)).toBeTruthy();
      expect(await exists(`./binaries/win32/arm64/README.txt`)).toBeTruthy();
    });

    it("downloads shellcheck to alternative directory", async () => {
      const result = await execCommand(
        `${binCommand} --config ${path.normalize(`${fixturesDirectory}/alternative-directory/bindl.config.js`)}`,
      );
      expect(result.stdout).toContain(
        `https://github.com/koalaman/shellcheck/releases/download`,
      );

      expect(await exists("./binaries-test/linux/x64/shellcheck")).toBeTruthy();
    });

    it("downloads shellcheck remapping directory", async () => {
      const result = await execCommand(
        `${binCommand} --config ${path.normalize(`${fixturesDirectory}/remap-directory/bindl.config.js`)}`,
      );
      expect(result.stdout).toContain(
        `https://github.com/koalaman/shellcheck/releases/download`,
      );

      expect(
        await exists("./binaries/linux/x64/directory/shellcheck"),
      ).toBeTruthy();
      expect(await exists("./binaries/linux/x64/shellcheck")).toBeTruthy();
    });

    it("downloads shfmt as a single file", async () => {
      const result = await execCommand(
        `${binCommand} --config ${path.normalize(`${fixturesDirectory}/individual-files/bindl.config.js`)}`,
      );
      expect(result.stdout).toContain(
        `https://github.com/mvdan/sh/releases/download`,
      );

      expect(await exists("./binaries/linux/x64/shfmt")).toBeTruthy();
      expect(await exists("./binaries/linux/x64/sha256sums.txt")).toBeTruthy();
      if (process.platform !== "win32") {
        // expect to have executable permissions
        const stats = await stat("./binaries/linux/x64/shfmt");
        expect(stats.mode & 0o777).toBe(0o755);

        // expect that sha256sums.txt has no executable permissions
        const shaStats = await stat("./binaries/linux/x64/sha256sums.txt");
        expect(shaStats.mode & 0o777).toBe(0o644);
      }
    });

    it("downloads only current binary when BINDL_CURRENT_ONLY is set", async () => {
      const result = await execCommand(
        `${binCommand} --config ${mainConfigPath}`,
        {
          env: { BINDL_CURRENT_ONLY: "true" },
        },
      );
      expect(result.stdout).toContain(
        `https://github.com/koalaman/shellcheck/releases/download`,
      );

      const currentPlatform = process.platform;
      const currentArch = process.arch;
      const expectedBinary =
        currentPlatform === "win32" ? "shellcheck.exe" : "shellcheck";

      // Check that the current platform/arch binary exists
      expect(
        await exists(
          `./binaries/${currentPlatform}/${currentArch}/${expectedBinary}`,
        ),
      ).toBeTruthy();

      // Check that all other platform/arch combinations don't exist
      if (currentPlatform !== "linux" || currentArch !== "x64") {
        expect(await exists("./binaries/linux/x64/shellcheck")).toBeFalsy();
      }
      if (currentPlatform !== "linux" || currentArch !== "arm") {
        expect(await exists("./binaries/linux/arm/shellcheck")).toBeFalsy();
      }
      if (currentPlatform !== "linux" || currentArch !== "arm64") {
        expect(await exists("./binaries/linux/arm64/shellcheck")).toBeFalsy();
      }
      if (currentPlatform !== "darwin" || currentArch !== "x64") {
        expect(await exists("./binaries/darwin/x64/shellcheck")).toBeFalsy();
      }
      if (currentPlatform !== "darwin" || currentArch !== "arm64") {
        expect(await exists("./binaries/darwin/arm64/shellcheck")).toBeFalsy();
        expect(await exists("./binaries/darwin/arm64/LICENSE.txt")).toBeFalsy();
        expect(await exists("./binaries/darwin/arm64/README.txt")).toBeFalsy();
      }
      if (currentPlatform !== "win32" || currentArch !== "x64") {
        expect(await exists("./binaries/win32/x64/shellcheck.exe")).toBeFalsy();
      }
      if (currentPlatform !== "win32" || currentArch !== "arm64") {
        expect(
          await exists("./binaries/win32/arm64/shellcheck.exe"),
        ).toBeFalsy();
        expect(await exists("./binaries/win32/arm64/LICENSE.txt")).toBeFalsy();
        expect(await exists("./binaries/win32/arm64/README.txt")).toBeFalsy();
      }
    });

    it("downloads only arm64 binary when npm_config_arch is arm64", async () => {
      const result = await execCommand(
        `${binCommand} --config ${mainConfigPath}`,
        {
          env: { npm_config_arch: "arm64" },
        },
      );
      expect(result.stdout).toContain(
        `https://github.com/koalaman/shellcheck/releases/download`,
      );

      const currentPlatform = process.platform;
      const expectedBinary =
        currentPlatform === "win32" ? "shellcheck.exe" : "shellcheck";

      expect(await exists(`./binaries/linux/x64/shellcheck`)).toBeFalsy();
      expect(await exists("./binaries/linux/arm/shellcheck")).toBeFalsy();
      expect(await exists("./binaries/darwin/x64/shellcheck")).toBeFalsy();
      expect(await exists("./binaries/win32/x64/shellcheck.exe")).toBeFalsy();

      // Check that arm64 binary exists for current platform
      expect(
        await exists(`./binaries/${currentPlatform}/arm64/${expectedBinary}`),
      ).toBeTruthy();

      // Check that arm64 binaries for other platforms don't exist
      if (currentPlatform !== "linux") {
        expect(await exists("./binaries/linux/arm64/shellcheck")).toBeFalsy();
      }
      if (currentPlatform !== "darwin") {
        expect(await exists("./binaries/darwin/arm64/shellcheck")).toBeFalsy();
        expect(await exists("./binaries/darwin/arm64/LICENSE.txt")).toBeFalsy();
        expect(await exists("./binaries/darwin/arm64/README.txt")).toBeFalsy();
      }
      if (currentPlatform !== "win32") {
        expect(
          await exists("./binaries/win32/arm64/shellcheck.exe"),
        ).toBeFalsy();
        expect(await exists("./binaries/win32/arm64/LICENSE.txt")).toBeFalsy();
        expect(await exists("./binaries/win32/arm64/README.txt")).toBeFalsy();
      }
    });

    it("downloads nothing when BINDL_SKIP is set", async () => {
      const result = await execCommand(
        `${binCommand} --config ${mainConfigPath}`,
        {
          env: { BINDL_SKIP: "true" },
        },
      );
      expect(result.stdout).toContain(`Skipping`);

      // No binaries should exist for any platform/arch combination
      expect(await exists("./binaries/linux/x64/shellcheck")).toBeFalsy();
      expect(await exists("./binaries/linux/arm/shellcheck")).toBeFalsy();
      expect(await exists("./binaries/linux/arm64/shellcheck")).toBeFalsy();
      expect(await exists("./binaries/darwin/x64/shellcheck")).toBeFalsy();
      expect(await exists("./binaries/darwin/arm64/shellcheck")).toBeFalsy();
      expect(await exists("./binaries/win32/x64/shellcheck.exe")).toBeFalsy();
      expect(await exists("./binaries/win32/arm64/shellcheck.exe")).toBeFalsy();

      // Additional files should also not exist
      expect(await exists("./binaries/darwin/arm64/LICENSE.txt")).toBeFalsy();
      expect(await exists("./binaries/darwin/arm64/README.txt")).toBeFalsy();
      expect(await exists("./binaries/win32/arm64/LICENSE.txt")).toBeFalsy();
      expect(await exists("./binaries/win32/arm64/README.txt")).toBeFalsy();
    });
  },
);

async function exists(f: string): Promise<boolean> {
  try {
    await access(f);
    return true;
  } catch {
    return false;
  }
}
