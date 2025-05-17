import { WorkflowConfig } from 'payload'
import { waitUntil } from '@vercel/functions'

export const embedData: WorkflowConfig<'embedData'> = {
  slug: 'embedData',
  handler: async ({ job, tasks, req }) => {
    const { payload } = req

    waitUntil(
      payload.create({
        collection: 'roles',
        data: {
          id: 'admin',
          // defaultAccess: 'Allow',
        },
      })
    )
  },
}
