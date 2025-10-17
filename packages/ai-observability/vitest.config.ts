import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    globals: true,
  },
  resolve: {
    conditions: ['node'],
  },
  css: {
    modules: {
      generateScopedName: '[local]',
    },
    postcss: {
      plugins: [],
    },
  },
  plugins: [
    {
      name: 'mock-css-imports',
      transform(code, id) {
        if (id.match(/\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\?)/)) {
          return {
            code: 'export default {}',
            map: null,
          }
        }
      },
    },
  ],
})
