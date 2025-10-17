import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  serverBuildFile: 'index.js',
  serverModuleFormat: 'esm',
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
  },
} satisfies Config
