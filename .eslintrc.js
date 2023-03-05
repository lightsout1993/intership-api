module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
  ],
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-shadow': 'off',
    'no-return-await': 'off',
    'no-underscore-dangle': 'off',
    'no-useless-constructor': 'off',

    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': ['error', 'always', { ts: 'never' }],

    'node/no-missing-import': 'off',
    'node/no-unpublished-import': 'off',
    'import/no-extraneous-dependencies': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'class-methods-use-this': 'off',

    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
