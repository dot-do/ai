import { buildConfig } from 'payload'
import { getDatabaseAdapter } from './lib/database'
import { slateEditor } from '@payloadcms/richtext-slate'

import { Completions, Functions, Executions, Batches, Evals, Experiments } from './collections'

/**
 * Payload CMS configuration with dynamic database adapter selection
 */
export default buildConfig({
  collections: [Completions, Functions, Executions, Batches, Evals, Experiments],
  db: getDatabaseAdapter(process.env.DATABASE_URI),
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- AI Observability',
    },
  },
  editor: slateEditor({}),
  typescript: {
    outputFile: 'types.ts',
  },
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
})
