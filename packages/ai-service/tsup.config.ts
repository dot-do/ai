import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Disable TypeScript declaration file generation to avoid the incremental option error
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
})
