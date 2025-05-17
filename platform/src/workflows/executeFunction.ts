import { WorkflowConfig } from 'payload'
import { waitUntil } from '@vercel/functions'
import { ai } from 'ai-functions'
import { Events } from '@/collections/Events'
import { model as llm } from '@/lib/ai'
import yaml from 'yaml'
import { generateText } from 'ai'

export const executeFunction: WorkflowConfig<'executeFunction'> = {
  slug: 'executeFunction',
  inputSchema: [...Events.fields, { name: 'id', type: 'text', required: true }],
  handler: async ({ job, tasks, req }) => {
    const { payload } = req
    const { input } = job

    if (input.id) {
      await payload.update({
        collection: 'events',
        id: input.id,
        data: { status: 'Processing' },
      })
    }
  },
}
