/**
 * React Hook for OAuth Authentication
 */

import { useCallback, useEffect, useState } from 'react'
import type { OAuthClient } from '../client'
import type { AuthState, SignInOptions, SignOutOptions, SignUpOptions } from '../types'

export function useAuth(client: OAuthClient) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  })

  // Load initial session
  useEffect(() => {
    let mounted = true

    async function loadSession() {
      try {
        const [session, user] = await Promise.all([client.getSession(), client.getUser()])

        if (mounted) {
          setState({
            user,
            session,
            isLoading: false,
            isAuthenticated: !!session && !!user,
            error: null,
          })
        }
      } catch (error) {
        if (mounted) {
          setState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            error: error instanceof Error ? error : new Error('Failed to load session'),
          })
        }
      }
    }

    loadSession()

    return () => {
      mounted = false
    }
  }, [client])

  const signIn = useCallback(
    async (options: SignInOptions) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const session = await client.signIn(options)
        const user = await client.getUser()

        setState({
          user,
          session,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        })

        return session
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Sign in failed'),
        }))
        throw error
      }
    },
    [client]
  )

  const signUp = useCallback(
    async (options: SignUpOptions) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const session = await client.signUp(options)
        const user = await client.getUser()

        setState({
          user,
          session,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        })

        return session
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Sign up failed'),
        }))
        throw error
      }
    },
    [client]
  )

  const signOut = useCallback(
    async (options?: SignOutOptions) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        await client.signOut(options)

        setState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        })
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Sign out failed'),
        }))
        throw error
      }
    },
    [client]
  )

  const refreshSession = useCallback(async () => {
    try {
      const session = await client.refreshSession()

      if (session) {
        const user = await client.getUser()
        setState((prev) => ({
          ...prev,
          user,
          session,
          isAuthenticated: true,
        }))
      }
    } catch (error) {
      console.error('Failed to refresh session:', error)
    }
  }, [client])

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshSession,
  }
}
