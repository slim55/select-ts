module.exports = {
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'prettier',
  ],
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:eslint-comments/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  env: {
    node: false,
    browser: true,
    jest: true,
  },
  parserOptions: {
    project: './tsconfig.json',
    extraFileExtensions: ['scss'],
  },
  ignorePatterns: [
    '**/*.scss',
    '**/*.css',
  ],
};
