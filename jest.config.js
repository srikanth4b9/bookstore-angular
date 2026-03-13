module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '^styles/(.*)$': '<rootDir>/src/styles/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
