import { readFile } from "node:fs/promises";
import path from "node:path";

const packageJsonPath = path.join(import.meta.dirname, "..", "package.json");
const packageJson = await readFile(packageJsonPath, "utf8");
export const { name, version, description } = JSON.parse(packageJson);
