import { readFile } from "fs/promises";
import { join } from "path";

const packageJsonPath = join(import.meta.dirname, "..", "package.json");
const packageJson = await readFile(packageJsonPath, "utf-8");
export const { name, version, description } = JSON.parse(packageJson);
