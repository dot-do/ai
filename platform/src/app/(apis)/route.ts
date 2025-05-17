import config from '@/payload.config'
import { getPayload } from 'payload'

export const GET = async () => {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'users',
  })

  return Response.json(data)
}
