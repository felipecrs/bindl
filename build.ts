import { glob, rm } from "node:fs/promises";
import process from "node:process";

import { execCommand } from "./src/utilities.ts";

const outDirectory = "lib";

await rm(outDirectory, { force: true, recursive: true });
await execCommand("./node_modules/.bin/tsc", { stdio: "inherit" });

process.chdir(outDirectory);
for await (const dtsFile of glob("**/*.d.ts", {
  exclude: ["index.d.ts"],
})) {
  await rm(dtsFile, { force: true });
}
