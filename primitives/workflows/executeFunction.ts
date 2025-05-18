import { WorkflowConfig } from 'payload'
import { Events } from '../collections/Events'

export const executeFunction: WorkflowConfig<'executeFunction'> = {
  slug: 'executeFunction',
  inputSchema: [...Events.fields, { name: 'id', type: 'text', required: true }],
  handler: async ({ job }) => {
    const { input } = job

    if (input.id) {
      // await payload.update({
      //   collection: 'events',
      //   id: input.id,
      //   data: { status: 'Processing' },
      // })
    }
  },
}
