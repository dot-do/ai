/**
 * analytics.do Next.js App Router Example
 */

'use client'

import React, { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { AnalyticsProvider, useAnalytics } from '@dotdo/analytics.do/react'

// App Layout
export function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider
      config={{
        writeKey: process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY!,
        host: 'https://analytics.do',
        debug: process.env.NODE_ENV === 'development',
        batchSize: 10,
        batchInterval: 2000,
      }}
      autoTrackPageViews={false} // We'll handle manually
    >
      <PageViewTracker />
      {children}
    </AnalyticsProvider>
  )
}

// Track page views on navigation
function PageViewTracker() {
  const analytics = useAnalytics()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    analytics.page(pathname, {
      path: pathname,
      search: searchParams?.toString(),
      url: window.location.href,
    })
  }, [pathname, searchParams, analytics])

  return null
}

// Example Page Component
export default function HomePage() {
  const analytics = useAnalytics()

  return (
    <div>
      <h1>Next.js + analytics.do</h1>

      <button
        onClick={() => {
          analytics.track('button_clicked', {
            button_id: 'cta-hero',
            page: 'home',
          })
        }}
      >
        Track Event
      </button>

      <button
        onClick={async () => {
          await analytics.identify('user-123', {
            email: 'user@example.com',
            name: 'John Doe',
          })
          console.log('User identified')
        }}
      >
        Identify User
      </button>
    </div>
  )
}
