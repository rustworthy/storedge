module.exports = {
  plugins: ['prettier', 'unused-imports', 'import'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: ['plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'array-bracket-spacing': 'error',
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': 'error',
    camelcase: 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-duplicate-case': 'error',
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
    ],
    'no-undef': ['error', { typeof: true }],
    'object-curly-spacing': ['error', 'always'],
    'prefer-const': 'error',
    semi: ['error', 'always'],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        'newlines-between': 'always',
      },
    ],
    'comma-spacing': ['error', { before: false, after: true }],
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: true,
        arrowParens: 'always',
        endOfLine: 'auto',
      },
    ],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: false,
        allowTemplateLiterals: true,
      },
    ],
    'unused-imports/no-unused-imports': 'error',
  },
};
