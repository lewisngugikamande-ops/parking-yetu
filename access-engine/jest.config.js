module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/*.test.js'
  ],
  collectCoverageFrom: [
    'packages/**/src/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  verbose: true,
};
