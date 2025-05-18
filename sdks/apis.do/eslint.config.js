import { config } from '@repo/eslint-config/base'

/** @type {import("eslint").Linter.Config} */
export default {
  ...config,
  rules: {
    ...config.rules,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  }
}
