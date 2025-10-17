import React from 'react'
import { useAuth } from '../lib/auth/auth-client'

interface AuthProps {
  redirectUrl?: string
  onSuccess?: (user: any) => void
  onError?: (error: Error) => void
}

export function Auth({ redirectUrl = '/onboarding', onSuccess, onError }: AuthProps) {
  const { signIn, isLoading } = useAuth()

  const handleAuth = async (provider: string) => {
    try {
      await signIn(provider)
    } catch (error) {
      console.error(`Error authenticating with ${provider}:`, error)
      if (onError && error instanceof Error) {
        onError(error)
      }
    }
  }

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <p>Sign in to continue to the waitlist</p>

      <div className="auth-providers">
        <button className="auth-button github" onClick={() => handleAuth('github')} disabled={isLoading}>
          Sign in with GitHub
        </button>
        <button className="auth-button google" onClick={() => handleAuth('google')} disabled={isLoading}>
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

export function setupAuth(app: any) {
  const apiRoutes = {
    '/api/auth/session': async (req: any, res: any) => {
      const user = req.session?.user

      if (user) {
        return res.status(200).json({ user })
      }

      return res.status(200).json({ user: null })
    },

    '/api/auth/signin/:provider': async (req: any, res: any) => {
      const { provider } = req.params

      const redirectUrl = `https://oauth.do/api/auth/signin/${provider}?redirect=${encodeURIComponent(req.headers.referer)}`

      return res.redirect(redirectUrl)
    },

    '/api/auth/callback/:provider': async (req: any, res: any) => {
      const { provider } = req.params

      req.session.user = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        provider,
      }

      return res.redirect('/onboarding')
    },

    '/api/auth/signout': async (req: any, res: any) => {
      req.session = null

      return res.status(200).json({ success: true })
    },
  }

  return {
    getUser: async (req: any) => {
      return req.session?.user || null
    },
    signIn: async (provider: string, redirectUrl: string) => {
      return `/api/auth/signin/${provider}?redirect=${encodeURIComponent(redirectUrl)}`
    },
    signOut: async () => {
      return '/api/auth/signout'
    },
  }
}
