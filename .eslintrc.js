module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: ['standard', 'plugin:react/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'filenames',
    'flowtype',
    'react',
  ],
  rules: {
    'comma-dangle': [ 'error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
    'filenames/no-index': 'error',
    'filenames/match-regex': ['error', '^[a-z-.]+$', true],
    'flowtype/require-valid-file-annotation': 'error',
    // This rule should allow global types to not trigger undefined identifier
    // errors.
    'flowtype/define-flow-type': 'warn',
    'flowtype/no-dupe-keys': 'error',
    // This rule should allow global types to not trigger undefined identifier
    // errors.
    'flowtype/use-flow-type': 1,
    'flowtype/delimiter-dangle': ['error', 'always-multiline'],
    'flowtype/semi': ['error', 'never'],
    indent: ['error', 2, {
      SwitchCase: 1,
    }],
    'max-len': ['error', 80, {
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreTemplateLiterals: true,
      ignorePattern: '\\s*<',
     }],
    'react/prop-types': 'off',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'flowtype/require-valid-file-annotation': ['error', 'always'],
    'flowtype/type-id-match': ['error', '^[A-Z][a-zA-Z0-9$]+$'],
    'sort-keys': ['error', 'asc', {'caseSensitive': false, 'natural': true}],
    'flowtype/sort-keys': ['error', 'asc', {'caseSensitive': false, 'natural': true}],
  },
}
