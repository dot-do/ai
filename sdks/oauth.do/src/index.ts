/**
 * oauth.do - Open-source OAuth and authentication SDK
 *
 * Main entry point - exports client only (no React/JSX dependencies)
 * For React hooks, import from 'oauth.do/react'
 */

export { OAuthClient, createOAuthClient } from './client/index'
export type {
  AuthClient,
  AuthConfig,
  AuthResponse,
  AuthState,
  Session,
  SignInOptions,
  SignOutOptions,
  SignUpOptions,
  User,
} from './types'
