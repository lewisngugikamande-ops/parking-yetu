module.exports = [
  {
    files: ['**/*.js'],
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    },
  },
];
