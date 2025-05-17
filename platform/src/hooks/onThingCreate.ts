import type { CollectionAfterOperationHook } from 'payload'
import { waitUntil } from '@vercel/functions'

export const onThingCreate: CollectionAfterOperationHook<'things'> = async ({ req, operation, result }) => {
  const { payload } = req

  if (operation !== 'create') return result

  console.log(result)
  const job = await payload.jobs.queue({ workflow: 'executeFunction', input: result })
  console.log(job)
  // const job = await payload.jobs.queue({ workflow: 'generateThing', input: result })
  waitUntil(payload.jobs.run())

  return result
}