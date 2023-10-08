import { execaCommand } from "execa";
import * as shell from "shelljs";
import * as tmp from "tmp";

const bin = `${process.cwd()}/bindl`;
const configDirectory = `${process.cwd()}/test/res`;
const configPath = `${configDirectory}/bindl.config.cjs`;

jest.setTimeout(30_000);

beforeAll(() => {
  process.env = Object.assign(process.env, { FORCE_COLOR: 0 });
});

describe("bindl", () => {
  let directory: tmp.DirResult;

  beforeEach(async () => {
    directory = tmp.dirSync({ unsafeCleanup: true });
    shell.cd(directory.name);
  });

  afterEach(async () => {
    directory.removeCallback();
  });

  it("downloads shellcheck", async () => {
    const result = await execaCommand(
      `${bin} --config ${configDirectory}/bindl.config.cjs`
    );
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    expect(shell.test("-f", "./binaries/linux/x64/shellcheck")).toBeTruthy();
    expect(shell.test("-f", "./binaries/linux/arm/shellcheck")).toBeTruthy();
    expect(shell.test("-f", "./binaries/linux/arm64/shellcheck")).toBeTruthy();
    expect(shell.test("-f", "./binaries/darwin/x64/shellcheck")).toBeTruthy();
    expect(
      shell.test("-f", "./binaries/win32/x64/shellcheck.exe")
    ).toBeTruthy();
    expect(
      shell.test("-f", "./binaries/win32/ia32/shellcheck.exe")
    ).toBeTruthy();
    expect(shell.test("-f", "./binaries/win32/ia32/LICENSE.txt")).toBeTruthy();
    expect(shell.test("-f", "./binaries/win32/ia32/README.txt")).toBeTruthy();
  });

  it("downloads shellcheck to alternative directory", async () => {
    const result = await execaCommand(
      `${bin} --config ${configDirectory}/alternative-directory.bindl.config.cjs`
    );
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    expect(
      shell.test("-f", "./binaries-test/linux/x64/shellcheck")
    ).toBeTruthy();
  });

  it("downloads shellcheck remapping directory", async () => {
    const result = await execaCommand(
      `${bin} --config ${configDirectory}/remap-directory.bindl.config.cjs`
    );
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    expect(
      shell.test("-f", "./binaries/linux/x64/directory/shellcheck")
    ).toBeTruthy();
    expect(shell.test("-f", "./binaries/linux/x64/shellcheck")).toBeTruthy();
  });

  it("downloads only linux-arm64 binary when npm_config_arch is set", async () => {
    const result = await execaCommand(`${bin} --config ${configPath}`, {
      // eslint-disable-next-line camelcase
      env: { npm_config_arch: "x64" },
    });
    expect(result.stdout).toContain(`downloading and extracting`);
    expect(result.exitCode).toBe(0);

    switch (process.platform) {
      case "linux": {
        expect(
          shell.test("-f", "./binaries/linux/x64/shellcheck")
        ).toBeTruthy();

        break;
      }

      case "darwin": {
        expect(
          shell.test("-f", "./binaries/darwin/x64/shellcheck")
        ).toBeTruthy();

        break;
      }

      case "win32": {
        expect(
          shell.test("-f", "./binaries/win32/x64/shellcheck.exe")
        ).toBeTruthy();

        break;
      }
      // No default
    }

    expect(shell.test("-f", "./binaries/linux/arm/shellcheck")).toBeFalsy();
    expect(shell.test("-f", "./binaries/linux/arm64/shellcheck")).toBeFalsy();
    expect(shell.test("-f", "./binaries/win32/x64/shellcheck.exe")).toBeFalsy();
    expect(
      shell.test("-f", "./binaries/win32/ia32/shellcheck.exe")
    ).toBeFalsy();
    expect(shell.test("-f", "./binaries/win32/ia32/LICENSE.txt")).toBeFalsy();
    expect(shell.test("-f", "./binaries/win32/ia32/README.txt")).toBeFalsy();
  });

  it("downloads nothing when BINDL_SKIP is set", async () => {
    const result = await execaCommand(`${bin} --config ${configPath}`, {
      env: { BINDL_SKIP: "true" },
    });
    expect(result.stdout).toContain(`Skipping`);
    expect(result.exitCode).toBe(0);
  });
});
