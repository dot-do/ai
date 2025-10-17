import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['**/*.css', '**/*.scss', '**/*.sass', '**/*.less', '**/*.styl'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
