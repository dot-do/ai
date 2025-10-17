import { NextApiRequest, NextApiResponse } from 'next'
import { apiRoutes, withSession } from '../../../lib/auth/api-routes'

export default withSession(async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth } = req.query

  if (!auth || !Array.isArray(auth) || auth.length === 0) {
    return res.status(400).json({ error: 'Invalid auth route' })
  }

  const [route, ...params] = auth

  if (route === 'session') {
    return apiRoutes.session(req, res)
  }

  if (route === 'signin' && params.length > 0) {
    req.query.provider = params[0]
    return apiRoutes.signin(req, res)
  }

  if (route === 'callback' && params.length > 0) {
    req.query.provider = params[0]
    return apiRoutes.callback(req, res)
  }

  if (route === 'signout') {
    return apiRoutes.signout(req, res)
  }

  return res.status(404).json({ error: 'Auth route not found' })
})
