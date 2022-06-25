const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // NOTE(swimjiy): 새 디렉토리가 추가되면 여기에 함께 추가하기
    "^~/components/(.*)$": "<rootDir>/components/$1",
    "^~/styles/(.*)$": "<rootDir>/styles/$1",
    "^~/pages/(.*)$": "<rootDir>/pages/$1",
    "^~/theme/(.*)$": "<rootDir>/theme/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
