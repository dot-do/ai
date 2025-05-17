import type { CollectionAfterOperationHook } from 'payload'
import { waitUntil } from '@vercel/functions'

export const onEventCreate: CollectionAfterOperationHook<'events'> = async ({ req, operation, result }) => {
  const { payload } = req

  if (operation !== 'create') return result

  console.log(result)

  if (result.execution) {
    const fn = await payload.findByID({ collection: 'functions', id: result.execution as string, depth: 0 })
    const input = {
      model: fn.model,
      prompt: fn.prompt 
        ? fn.prompt.includes('{input}') 
          ? fn.prompt.replace('{input}', result.input || '') 
          : fn.prompt + '\n\n' + (result.input || '') 
        : result.input || '',
      system: fn.system,
      output: fn.output,
      schema: fn.schema,
      settings: fn.settings,
      object: fn.object,
    }
    const job = await payload.jobs.queue({ task: 'generate', input })
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
        eventId: result.id,
        timeout: 5000,
        memoryLimit: 128,
      },
    })
    console.log(job)
    waitUntil(payload.jobs.run())
  }

  return result
}
