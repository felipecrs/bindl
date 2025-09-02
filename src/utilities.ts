import spawn, { type Options } from "nano-spawn";
import { createReadStream } from "node:fs";
import { createHash, randomBytes } from "node:crypto";

export async function execCommand(commandString: string, options?: Options) {
  const [command, ...commandArguments] = parseCommandString(commandString);
  return await spawn(command, commandArguments, options);
}

export function randomString(): string {
  return randomBytes(8).toString("hex");
}

export async function computeSha256(filePath: string): Promise<string> {
  const hash = createHash("sha256");
  const stream = createReadStream(filePath);

  for await (const chunk of stream) {
    hash.update(chunk);
  }

  return hash.digest("hex");
}

// Stolen from https://github.com/sindresorhus/execa/blob/a31fe55782993f2483d30955a8799ab88e20687c/lib/methods/command.js#L18-L43
// Refs https://github.com/sindresorhus/nano-spawn/issues/14#issuecomment-3156519442
// Convert `command` string into an array of file or arguments to pass to $`${...fileOrCommandArguments}`
const parseCommandString = (command: string) => {
  const SPACES_REGEXP = / +/g;

  if (typeof command !== "string") {
    throw new TypeError(`The command must be a string: ${String(command)}.`);
  }

  const trimmedCommand = command.trim();
  if (trimmedCommand === "") {
    return [];
  }

  const tokens: string[] = [];
  for (const token of trimmedCommand.split(SPACES_REGEXP)) {
    // Allow spaces to be escaped by a backslash if not meant as a delimiter
    const previousToken = tokens.at(-1);
    if (previousToken && previousToken.endsWith("\\")) {
      // Merge previous token with current one
      tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
    } else {
      tokens.push(token);
    }
  }

  return tokens;
};
