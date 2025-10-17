/**
 * analytics.do SDK - Main Entry Point
 */

export * from './types'
export * from './client'
export * from './utils'

import { AnalyticsClient } from './client'
import type { AnalyticsConfig } from './types'

// Singleton instance for convenience
let defaultClient: AnalyticsClient | null = null

/**
 * Initialize the default analytics client
 */
export function init(config: AnalyticsConfig): AnalyticsClient {
  defaultClient = new AnalyticsClient(config)
  return defaultClient
}

/**
 * Get the default analytics client
 */
export function getClient(): AnalyticsClient {
  if (!defaultClient) {
    throw new Error('Analytics client not initialized. Call init() first.')
  }
  return defaultClient
}

/**
 * Convenience functions using default client
 */
export const analytics = {
  init,
  track: (...args: Parameters<AnalyticsClient['track']>) => getClient().track(...args),
  page: (...args: Parameters<AnalyticsClient['page']>) => getClient().page(...args),
  identify: (...args: Parameters<AnalyticsClient['identify']>) => getClient().identify(...args),
  group: (...args: Parameters<AnalyticsClient['group']>) => getClient().group(...args),
  alias: (...args: Parameters<AnalyticsClient['alias']>) => getClient().alias(...args),
  query: (...args: Parameters<AnalyticsClient['query']>) => getClient().query(...args),
  aggregate: (...args: Parameters<AnalyticsClient['aggregate']>) => getClient().aggregate(...args),
  cohort: (...args: Parameters<AnalyticsClient['cohort']>) => getClient().cohort(...args),
  funnel: (...args: Parameters<AnalyticsClient['funnel']>) => getClient().funnel(...args),
  flush: () => getClient().flush(),
}
