import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  preset: "ts-jest",
  // https://github.com/kulshekhar/ts-jest/issues/1173#issuecomment-1404142039
  transform: {
    "^.+\\.(ts|tsx)?$": [
      "ts-jest",
      { diagnostics: { ignoreCodes: ["TS151001"] } },
    ],
  },
};

export default config;
