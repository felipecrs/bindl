import * as execa from "execa";
import * as shell from "shelljs";
import * as tmp from "tmp";

const bin = `${process.cwd()}/bin/dev`;

const configPath = `${process.cwd()}/test/res/bindl.config.js`;

jest.setTimeout(30_000);

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
    expect(shell.test("-f", "./binaries/darwin/x64/shellcheck")).toBeTruthy();
    expect(
      shell.test("-f", "./binaries/win32/x64/shellcheck.exe")
    ).toBeTruthy();
  });
});
