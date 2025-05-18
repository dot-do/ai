import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  skipNodeModulesBundle: true,
  target: 'es2022',
  outDir: 'dist',
  shims: false,
  treeshake: true,
  splitting: true,
  sourcemap: true,
})
