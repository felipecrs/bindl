import { execaCommand } from "execa";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { cd, fs, tmpdir } from "zx";
import path from "node:path";
import { rimraf } from "rimraf";

const repoDirectory = path.normalize(`${import.meta.dirname}/..`);
const binCommand = `tsx ${path.normalize(`${repoDirectory}/src/index.ts`)}`;
const configDirectory = path.normalize(`${repoDirectory}/test/res`);
const configPath = path.normalize(`${configDirectory}/bindl.config.js`);

vi.setConfig({ testTimeout: 30_000 });

beforeAll(() => {
  process.env = Object.assign(process.env, { FORCE_COLOR: 0 });
});

describe("bindl", () => {
  let temporaryDirectory: string;

  beforeEach(async () => {
    temporaryDirectory = tmpdir();
    cd(temporaryDirectory);
  });

  afterEach(async () => {
    cd(repoDirectory);
    await rimraf(temporaryDirectory);
  });

  it("downloads shellcheck", async () => {
    const result = await execaCommand(
      `${binCommand} --config ${path.normalize(`${configDirectory}/bindl.config.js`)}`,
    );
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    expect(await fs.exists(`./binaries/linux/x64/shellcheck`)).toBeTruthy();
    expect(await fs.exists(`./binaries/linux/arm/shellcheck`)).toBeTruthy();
    expect(await fs.exists(`./binaries/linux/arm64/shellcheck`)).toBeTruthy();
    expect(await fs.exists(`./binaries/darwin/x64/shellcheck`)).toBeTruthy();
    expect(await fs.exists(`./binaries/darwin/arm64/shellcheck`)).toBeTruthy();
    expect(await fs.exists(`./binaries/darwin/arm64/LICENSE.txt`)).toBeTruthy();
    expect(await fs.exists(`./binaries/darwin/arm64/README.txt`)).toBeTruthy();
    expect(await fs.exists(`./binaries/win32/x64/shellcheck.exe`)).toBeTruthy();
    expect(
      await fs.exists(`./binaries/win32/arm64/shellcheck.exe`),
    ).toBeTruthy();
    expect(await fs.exists(`./binaries/win32/arm64/LICENSE.txt`)).toBeTruthy();
    expect(await fs.exists(`./binaries/win32/arm64/README.txt`)).toBeTruthy();
  });

  it("downloads shellcheck to alternative directory", async () => {
    const result = await execaCommand(
      `${binCommand} --config ${path.normalize(`${configDirectory}/alternative-directory.bindl.config.js`)}`,
    );
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    expect(
      await fs.exists("./binaries-test/linux/x64/shellcheck"),
    ).toBeTruthy();
  });

  it("downloads shellcheck remapping directory", async () => {
    const result = await execaCommand(
      `${binCommand} --config ${path.normalize(`${configDirectory}/remap-directory.bindl.config.js`)}`,
    );
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    expect(
      await fs.exists("./binaries/linux/x64/directory/shellcheck"),
    ).toBeTruthy();
    expect(await fs.exists("./binaries/linux/x64/shellcheck")).toBeTruthy();
  });

  it("downloads only current binary when BINDL_CURRENT_ONLY is set", async () => {
    const result = await execaCommand(`${binCommand} --config ${configPath}`, {
      env: { BINDL_CURRENT_ONLY: "true" },
    });
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    const currentPlatform = process.platform;
    const currentArch = process.arch;
    const expectedBinary =
      currentPlatform === "win32" ? "shellcheck.exe" : "shellcheck";

    // Check that the current platform/arch binary exists
    expect(
      await fs.exists(
        `./binaries/${currentPlatform}/${currentArch}/${expectedBinary}`,
      ),
    ).toBeTruthy();

    // Check that all other platform/arch combinations don't exist
    if (currentPlatform !== "linux" || currentArch !== "x64") {
      expect(await fs.exists("./binaries/linux/x64/shellcheck")).toBeFalsy();
    }
    if (currentPlatform !== "linux" || currentArch !== "arm") {
      expect(await fs.exists("./binaries/linux/arm/shellcheck")).toBeFalsy();
    }
    if (currentPlatform !== "linux" || currentArch !== "arm64") {
      expect(await fs.exists("./binaries/linux/arm64/shellcheck")).toBeFalsy();
    }
    if (currentPlatform !== "darwin" || currentArch !== "x64") {
      expect(await fs.exists("./binaries/darwin/x64/shellcheck")).toBeFalsy();
    }
    if (currentPlatform !== "darwin" || currentArch !== "arm64") {
      expect(await fs.exists("./binaries/darwin/arm64/shellcheck")).toBeFalsy();
      expect(
        await fs.exists("./binaries/darwin/arm64/LICENSE.txt"),
      ).toBeFalsy();
      expect(await fs.exists("./binaries/darwin/arm64/README.txt")).toBeFalsy();
    }
    if (currentPlatform !== "win32" || currentArch !== "x64") {
      expect(
        await fs.exists("./binaries/win32/x64/shellcheck.exe"),
      ).toBeFalsy();
    }
    if (currentPlatform !== "win32" || currentArch !== "arm64") {
      expect(
        await fs.exists("./binaries/win32/arm64/shellcheck.exe"),
      ).toBeFalsy();
      expect(await fs.exists("./binaries/win32/arm64/LICENSE.txt")).toBeFalsy();
      expect(await fs.exists("./binaries/win32/arm64/README.txt")).toBeFalsy();
    }
  });

  it("downloads only arm64 binary when npm_config_arch is arm64", async () => {
    const result = await execaCommand(`${binCommand} --config ${configPath}`, {
      env: { npm_config_arch: "arm64" },
    });
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    const currentPlatform = process.platform;
    const expectedBinary =
      currentPlatform === "win32" ? "shellcheck.exe" : "shellcheck";

    expect(await fs.exists(`./binaries/linux/x64/shellcheck`)).toBeFalsy();
    expect(await fs.exists("./binaries/linux/arm/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/x64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/x64/shellcheck.exe")).toBeFalsy();

    // Check that arm64 binary exists for current platform
    expect(
      await fs.exists(`./binaries/${currentPlatform}/arm64/${expectedBinary}`),
    ).toBeTruthy();

    // Check that arm64 binaries for other platforms don't exist
    if (currentPlatform !== "linux") {
      expect(await fs.exists("./binaries/linux/arm64/shellcheck")).toBeFalsy();
    }
    if (currentPlatform !== "darwin") {
      expect(await fs.exists("./binaries/darwin/arm64/shellcheck")).toBeFalsy();
      expect(
        await fs.exists("./binaries/darwin/arm64/LICENSE.txt"),
      ).toBeFalsy();
      expect(await fs.exists("./binaries/darwin/arm64/README.txt")).toBeFalsy();
    }
    if (currentPlatform !== "win32") {
      expect(
        await fs.exists("./binaries/win32/arm64/shellcheck.exe"),
      ).toBeFalsy();
      expect(await fs.exists("./binaries/win32/arm64/LICENSE.txt")).toBeFalsy();
      expect(await fs.exists("./binaries/win32/arm64/README.txt")).toBeFalsy();
    }
  });

  it("downloads nothing when BINDL_SKIP is set", async () => {
    const result = await execaCommand(`${binCommand} --config ${configPath}`, {
      env: { BINDL_SKIP: "true" },
    });
    expect(result.stdout).toContain(`Skipping`);
    expect(result.exitCode).toBe(0);

    // No binaries should exist for any platform/arch combination
    expect(await fs.exists("./binaries/linux/x64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/linux/arm/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/linux/arm64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/x64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/arm64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/x64/shellcheck.exe")).toBeFalsy();
    expect(
      await fs.exists("./binaries/win32/arm64/shellcheck.exe"),
    ).toBeFalsy();

    // Additional files should also not exist
    expect(await fs.exists("./binaries/darwin/arm64/LICENSE.txt")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/arm64/README.txt")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/arm64/LICENSE.txt")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/arm64/README.txt")).toBeFalsy();
  });
});
