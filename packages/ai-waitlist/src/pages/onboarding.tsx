import React from 'react'
import { Onboarding } from '../components/Onboarding'
import { withAuth, User } from '../lib/auth/auth-client'

interface OnboardingPageProps {
  user: User
}

const OnboardingPage = withAuth((props: OnboardingPageProps) => {
  const { user } = props

  return (
    <div className="onboarding-page">
      <h1>Onboarding</h1>
      <Onboarding
        user={user}
        onComplete={(answers) => {
          console.log('Onboarding complete:', answers)
          window.location.href = '/'
        }}
      />
    </div>
  )
})

export default OnboardingPage
