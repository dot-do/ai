import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: true,
    css: false, // Disable CSS processing completely
    root: resolve(__dirname), // Use package directory as root to avoid parent postcss config
    deps: {
      inline: [/.*postcss.*/], // Inline postcss dependencies to avoid loading from parent
    },
  },
})
