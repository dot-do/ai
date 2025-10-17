/**
 * analytics.do React Example
 */

import React from 'react'
import { AnalyticsProvider, useAnalytics, useTrackClick, TrackPageView } from '@dotdo/analytics.do/react'

function App() {
  return (
    <AnalyticsProvider
      config={{
        writeKey: 'YOUR_WRITE_KEY',
        host: 'https://analytics.do',
        debug: true,
      }}
      autoTrackPageViews={true}
    >
      <HomePage />
    </AnalyticsProvider>
  )
}

function HomePage() {
  const analytics = useAnalytics()
  const trackSignup = useTrackClick('signup_clicked', { page: 'home' })

  return (
    <div>
      <TrackPageView name="Home" properties={{ section: 'landing' }} />

      <h1>Welcome</h1>

      <button
        onClick={() => {
          analytics.track('cta_clicked', {
            button_text: 'Get Started',
            location: 'hero',
          })
        }}
      >
        Get Started
      </button>

      <button onClick={trackSignup}>Sign Up</button>

      <button
        onClick={() => {
          analytics.identify('user-123', {
            email: 'user@example.com',
            plan: 'pro',
          })
        }}
      >
        Identify
      </button>
    </div>
  )
}

export default App
