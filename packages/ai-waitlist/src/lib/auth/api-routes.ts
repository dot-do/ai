import { NextApiRequest, NextApiResponse } from 'next'

interface Session {
  user?: {
    id: string
    name?: string
    email?: string
    image?: string
    provider?: string
  }
}

export interface AuthApiRequest extends NextApiRequest {
  session?: Session
}

export const apiRoutes = {
  session: async (req: AuthApiRequest, res: NextApiResponse) => {
    const user = req.session?.user

    if (user) {
      return res.status(200).json({ user })
    }

    return res.status(200).json({ user: null })
  },

  signin: async (req: AuthApiRequest, res: NextApiResponse) => {
    const { provider } = req.query

    if (!provider || Array.isArray(provider)) {
      return res.status(400).json({ error: 'Invalid provider' })
    }

    const redirect = req.query.redirect || req.headers.referer || '/'

    const redirectUrl = `https://oauth.do/api/auth/signin/${provider}?redirect=${encodeURIComponent(typeof redirect === 'string' ? redirect : '/')}`

    return res.redirect(redirectUrl)
  },

  callback: async (req: AuthApiRequest, res: NextApiResponse) => {
    const { provider } = req.query

    if (!provider || Array.isArray(provider)) {
      return res.status(400).json({ error: 'Invalid provider' })
    }

    if (!req.session) {
      req.session = {}
    }

    req.session.user = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      provider,
    }

    const redirect = req.query.redirect || '/onboarding'

    return res.redirect(typeof redirect === 'string' ? redirect : '/onboarding')
  },

  signout: async (req: AuthApiRequest, res: NextApiResponse) => {
    if (req.session) {
      req.session = {}
    }

    return res.status(200).json({ success: true })
  },
}

export const withSession = (handler: (req: AuthApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: AuthApiRequest, res: NextApiResponse) => {
    if (!req.session) {
      req.session = {}
    }

    return handler(req, res)
  }
}

export const withAuth = (handler: (req: AuthApiRequest, res: NextApiResponse) => Promise<void | any>) => {
  return async (req: AuthApiRequest, res: NextApiResponse) => {
    if (!req.session?.user) {
      return res.redirect(`/auth?redirect=${encodeURIComponent(req.url || '/')}`)
    }

    return handler(req, res)
  }
}
