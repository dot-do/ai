/**
 * analytics.do SDK - React Integration
 */

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { AnalyticsClient } from '../src/client'
import type { AnalyticsConfig } from '../src/types'

export * from '../src/index'

const AnalyticsContext = createContext<AnalyticsClient | null>(null)

export interface AnalyticsProviderProps {
  children: React.ReactNode
  config: AnalyticsConfig
  autoTrackPageViews?: boolean
}

/**
 * Analytics Provider Component
 */
export function AnalyticsProvider({
  children,
  config,
  autoTrackPageViews = true,
}: AnalyticsProviderProps) {
  const clientRef = useRef<AnalyticsClient>()

  if (!clientRef.current) {
    clientRef.current = new AnalyticsClient(config)
  }

  useEffect(() => {
    if (autoTrackPageViews) {
      clientRef.current?.page()
    }
  }, [autoTrackPageViews])

  // Flush on unmount
  useEffect(() => {
    return () => {
      clientRef.current?.flush()
    }
  }, [])

  return <AnalyticsContext.Provider value={clientRef.current}>{children}</AnalyticsContext.Provider>
}

/**
 * Hook to access analytics client
 */
export function useAnalytics(): AnalyticsClient {
  const client = useContext(AnalyticsContext)
  if (!client) {
    throw new Error('useAnalytics must be used within AnalyticsProvider')
  }
  return client
}

/**
 * Hook to track event on mount
 */
export function useTrackEvent(event: string, properties?: any, deps: any[] = []) {
  const analytics = useAnalytics()

  useEffect(() => {
    analytics.track(event, properties)
  }, [analytics, event, properties, ...deps])
}

/**
 * Hook to track pageview on route change
 */
export function useTrackPageView(name?: string, properties?: any) {
  const analytics = useAnalytics()
  const tracked = useRef(false)

  useEffect(() => {
    if (!tracked.current) {
      analytics.page(name, properties)
      tracked.current = true
    }
  }, [analytics, name, properties])
}

/**
 * Component to track pageview
 */
export interface TrackPageViewProps {
  name?: string
  properties?: any
}

export function TrackPageView({ name, properties }: TrackPageViewProps) {
  useTrackPageView(name, properties)
  return null
}

/**
 * HOC to track component mount
 */
export function withTracking<P extends object>(
  Component: React.ComponentType<P>,
  event: string,
  getProperties?: (props: P) => any
) {
  return function TrackedComponent(props: P) {
    useTrackEvent(event, getProperties?.(props) || {}, [])
    return <Component {...props} />
  }
}

/**
 * Hook to track click events
 */
export function useTrackClick(event: string, properties?: any) {
  const analytics = useAnalytics()

  return () => {
    analytics.track(event, properties)
  }
}
