import { payload } from 'ai-primitives'

export const GET = async (request: Request) => {
  const { headers } = request
  const { origin } = new URL(request.url)

  const { user } = await payload.auth({ headers })

  // const data = await payload.find({ collection: 'users' })

  const api = {
    name: 'apis.do',
    site: 'https://apis.do',
    home: origin,
    docs: `${origin}/docs`,
    admin: `${origin}/admin`,
  }

  return Response.json({ api, user })
}
