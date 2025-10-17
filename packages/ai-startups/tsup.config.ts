export default {
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outExtension: ({ format }: { format: string }) => ({
    js: format === 'cjs' ? '.js' : '.mjs',
  }),
  tsconfig: './tsconfig.json',
}
