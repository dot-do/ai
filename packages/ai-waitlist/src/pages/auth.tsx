import React from 'react'
import { Auth } from '../components/Auth'
import { AuthProvider } from '../lib/auth/auth-client'

const AuthPage: React.FC = () => {
  return (
    <div className="auth-page">
      <h1>Sign In</h1>
      <p>Sign in to join the waitlist</p>
      <Auth redirectUrl="/onboarding" />
    </div>
  )
}

export default AuthPage
