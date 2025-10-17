export default {
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: false, // Disable DTS generation in tsup
  clean: false, // Don't clean to preserve manually generated declaration files
  outExtension: ({ format }) => ({
    js: format === 'cjs' ? '.js' : '.mjs',
  }),
  external: ['ai-management', 'autonomous-agents', 'business-as-code', 'ai-business'],
}
