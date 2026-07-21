module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/packages/domain_legacy/'
  ],
  collectCoverageFrom: [
    'packages/**/src/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!packages/domain_legacy/**'
  ],
  verbose: true,
};
