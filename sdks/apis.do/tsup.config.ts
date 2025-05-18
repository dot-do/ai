import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/types.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  skipNodeModulesBundle: true,
  target: 'es2022',
  outDir: 'dist',
  shims: false,
  treeshake: true,
  splitting: true,
  sourcemap: true,
  minify: false,
  esbuildOptions(options) {
    options.banner = {
      js: '// apis.do SDK - https://apis.do',
    }
  },
  onSuccess: 'echo APIs.do SDK built successfully!',
})
