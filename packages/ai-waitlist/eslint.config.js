export default {
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  rules: {
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'max-len': ['error', { code: 160 }],
  },
}
