import { getModels } from 'ai-primitives/lib/ai'

export const revalidate = 600

export const GET = async (request: Request) => {
  const models = await getModels()
  return Response.json({ models })
}
