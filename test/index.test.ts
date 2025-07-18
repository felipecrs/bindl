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
import { $, cd, fs, tmpdir } from "zx";

const repoDirectory = `${import.meta.dirname}/..`;
const bin = `${repoDirectory}/bindl`;
const configDirectory = `${repoDirectory}/test/res`;
const configPath = `${configDirectory}/bindl.config.js`;

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
    await $`rm -rf ${temporaryDirectory}`;
  });

  it("downloads shellcheck", async () => {
    const result = await execaCommand(
      `${bin} --config ${configDirectory}/bindl.config.js`,
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
      `${bin} --config ${configDirectory}/alternative-directory.bindl.config.js`,
    );
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    expect(
      await fs.exists("./binaries-test/linux/x64/shellcheck"),
    ).toBeTruthy();
  });

  it("downloads shellcheck remapping directory", async () => {
    const result = await execaCommand(
      `${bin} --config ${configDirectory}/remap-directory.bindl.config.js`,
    );
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    expect(
      await fs.exists("./binaries/linux/x64/directory/shellcheck"),
    ).toBeTruthy();
    expect(await fs.exists("./binaries/linux/x64/shellcheck")).toBeTruthy();
  });

  it("downloads only current binary when BINDL_CURRENT_ONLY is set", async () => {
    const result = await execaCommand(`${bin} --config ${configPath}`, {
      env: { BINDL_CURRENT_ONLY: "true" },
    });
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    expect(await fs.exists(`./binaries/linux/x64/shellcheck`)).toBeTruthy();
    expect(await fs.exists("./binaries/linux/arm/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/linux/arm64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/x64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/arm64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/arm64/LICENSE.txt")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/arm64/README.txt")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/x64/shellcheck.exe")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/ia32/shellcheck.exe")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/ia32/LICENSE.txt")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/ia32/README.txt")).toBeFalsy();
  });

  it("downloads only linux-arm64 binary when npm_config_arch is set", async () => {
    const result = await execaCommand(`${bin} --config ${configPath}`, {
      env: { npm_config_arch: "arm64" },
    });
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    expect(await fs.exists(`./binaries/linux/x64/shellcheck`)).toBeFalsy();
    expect(await fs.exists("./binaries/linux/arm/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/linux/arm64/shellcheck")).toBeTruthy();
    expect(await fs.exists("./binaries/darwin/x64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/arm64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/arm64/LICENSE.txt")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/arm64/README.txt")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/x64/shellcheck.exe")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/ia32/shellcheck.exe")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/ia32/LICENSE.txt")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/ia32/README.txt")).toBeFalsy();
  });

  it("downloads nothing when BINDL_SKIP is set", async () => {
    const result = await execaCommand(`${bin} --config ${configPath}`, {
      env: { BINDL_SKIP: "true" },
    });
    expect(result.stdout).toContain(`Skipping`);
    expect(result.exitCode).toBe(0);

    expect(await fs.exists(`./binaries/linux/x64/shellcheck`)).toBeFalsy();
    expect(await fs.exists("./binaries/linux/arm/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/linux/arm64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/x64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/arm64/shellcheck")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/arm64/LICENSE.txt")).toBeFalsy();
    expect(await fs.exists("./binaries/darwin/arm64/README.txt")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/x64/shellcheck.exe")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/ia32/shellcheck.exe")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/ia32/LICENSE.txt")).toBeFalsy();
    expect(await fs.exists("./binaries/win32/ia32/README.txt")).toBeFalsy();
  });
});
