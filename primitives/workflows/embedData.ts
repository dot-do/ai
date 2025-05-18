import { WorkflowConfig } from 'payload'
import { waitUntil } from '@vercel/functions'

export const embedData: WorkflowConfig<'embedData'> = {
  slug: 'embedData',
  handler: async ({ req }) => {
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
