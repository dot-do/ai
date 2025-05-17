import { WorkflowConfig } from 'payload'
import { waitUntil } from '@vercel/functions'

export const generateDatabase: WorkflowConfig<'generateDatabase'> = {
  slug: 'generateDatabase',
  handler: async ({ job, tasks, req }) => {
    const { payload } = req


    
  },
}