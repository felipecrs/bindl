import { getBinPathSync } from "get-bin-path";
import * as execa from "execa";
import * as shell from "shelljs";
import * as tmp from "tmp";

const bin = getBinPathSync();

const configPath = `${process.cwd()}/test/res/bindl.config.js`;

jest.setTimeout(30000);

beforeAll(() => {
  process.env = Object.assign(process.env, { FORCE_COLOR: 0 });
});

describe("bindl", () => {
  let dir: tmp.DirResult;

  beforeEach(async () => {
    dir = tmp.dirSync({ unsafeCleanup: true });
    shell.cd(dir.name);
  });

  afterEach(async () => {
    dir.removeCallback();
  });

  it("downloads shellcheck", async () => {
    const result = await execa.command(`${bin} --config ${configPath}`);
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    expect(shell.test("-f", "./binaries/linux/x64/shellcheck")).toBeTruthy();
    expect(shell.test("-f", "./binaries/linux/arm/shellcheck")).toBeTruthy();
    expect(shell.test("-f", "./binaries/linux/arm64/shellcheck")).toBeTruthy();
    expect(shell.test("-f", "./binaries/darwin/x64/shellcheck")).toBeTruthy();
    expect(shell.test("-f", "./binaries/darwin/arm64/shellcheck")).toBeTruthy();
    expect(
      shell.test("-f", "./binaries/win32/x32/shellcheck.exe")
    ).toBeTruthy();
    expect(
      shell.test("-f", "./binaries/win32/x64/shellcheck.exe")
    ).toBeTruthy();
  });

  it("downloads only linux-arm64 binary when npm_config_arch is set", async () => {
    const result = await execa.command(`${bin} --config ${configPath}`, {
      // eslint-disable-next-line camelcase
      env: { npm_config_arch: "x64" },
    });
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    if (process.platform === "linux") {
      expect(shell.test("-f", "./binaries/linux/x64/shellcheck")).toBeTruthy();
    } else if (process.platform === "darwin") {
      expect(shell.test("-f", "./binaries/darwin/x64/shellcheck")).toBeTruthy();
    } else if (process.platform === "win32") {
      expect(
        shell.test("-f", "./binaries/win32/x64/shellcheck.exe")
      ).toBeTruthy();
    }
    expect(shell.test("-f", "./binaries/linux/arm/shellcheck")).toBeFalsy();
    expect(shell.test("-f", "./binaries/linux/arm64/shellcheck")).toBeFalsy();
    expect(shell.test("-f", "./binaries/darwin/arm64/shellcheck")).toBeFalsy();
    expect(shell.test("-f", "./binaries/win32/x32/shellcheck.exe")).toBeFalsy();
  });
});
