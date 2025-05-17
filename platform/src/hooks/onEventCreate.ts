import type { CollectionAfterOperationHook } from 'payload'
import { waitUntil } from '@vercel/functions'

export const onEventCreate: CollectionAfterOperationHook<'events'> = async ({ req, operation, result }) => {
  const { payload } = req

  if (operation !== 'create') return result

  console.log(result)
  
  if (result.execution) {
    const job = await payload.jobs.queue({ workflow: 'executeFunction', input: result })
    console.log(job)
    waitUntil(payload.jobs.run())
  }
  
  const workflowId = (result as any).workflow
  if (workflowId) {
    const job = await payload.jobs.queue({ 
      workflow: 'executeWorkflow', 
      input: { 
        workflowId, 
        input: result.input ? JSON.parse(result.input) : undefined,
        eventId: result.id 
      } 
    })
    console.log(job)
    waitUntil(payload.jobs.run())
  }

  return result
}
