import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

export const { name, version, description } = require("../package.json");
