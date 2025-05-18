import { WorkflowConfig } from 'payload'

export const generateDatabase: WorkflowConfig<'generateDatabase'> = {
  slug: 'generateDatabase',
  handler: async ({ req }) => {
    const { payload } = req
    return payload
  },
}
