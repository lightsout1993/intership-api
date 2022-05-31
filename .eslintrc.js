module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin', 'simple-import-sort', 'import'
  ],
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
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
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "import/order": "off",
    "simple-import-sort/imports": ["error", {
      "groups": [
        // Types from Nest
        // from other packages
        // alias types
        // other types
        [
          "^@nest\\w.*\\u0000$",
          "^\\w.*\\u0000$",
          "^@.*\\u0000$",
          "\\u0000$"
        ],
        // Nest
        // other packages
        // side effect imports
        // alias imports
        // other not matched in another group (not css, pictures or types)
        // pictures
        // CSS
        [
          "^@nest\\w.*(?<!(\\.jpg)|(\\.jpeg)|(\\.png)|(\\.svg)|(\\.css)|(\\u0000))$",
          "^\\w.*(?<!(\\.jpg)|(\\.jpeg)|(\\.png)|(\\.svg)|(\\.css)|(\\u0000))$",
          "^\\u0000.*(?<!(\\.jpg)|(\\.jpeg)|(\\.png)|(\\.svg)|(\\.css)|(\\u0000))$",
          "^@.*(?<!(\\.jpg)|(\\.jpeg)|(\\.png)|(\\.svg)|(\\.css)|(\\u0000))$",
          "^\\..*(?<!(\\.jpg)|(\\.jpeg)|(\\.png)|(\\.svg)|(\\.css)|(\\u0000))$",
          "\\.jpg$",
          "\\.jpeg$",
          "\\.png$",
          "\\.svg$",
          "\\.css$"]
      ]
    }],
  },
};
