import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const rootConfig = require('../../.eslintrc.js');

export default [
  {
    ...rootConfig,
    ignores: ['dist/**', 'node_modules/**'],
  }
];
