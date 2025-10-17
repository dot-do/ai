/**
 * analytics.do SDK - Server-specific Features
 */

import { AnalyticsClient } from '../src/client'
import type { AnalyticsConfig, TrackEvent } from '../src/types'

export * from '../src/index'

export interface ServerConfig extends AnalyticsConfig {
  flushInterval?: number
  maxQueueSize?: number
}

export class ServerAnalytics extends AnalyticsClient {
  private flushInterval?: NodeJS.Timeout
  private maxQueueSize: number

  constructor(config: ServerConfig = {}) {
    // Enable batching by default for server
    super({
      batchSize: 100,
      batchInterval: 5000,
      ...config,
    })
    this.maxQueueSize = config.maxQueueSize || 1000

    // Auto-flush on interval
    if (config.flushInterval) {
      this.flushInterval = setInterval(() => {
        this.flush()
      }, config.flushInterval)
    }
  }

  /**
   * Track multiple events in bulk
   */
  async trackBulk(events: Array<{ event: string; userId?: string; properties?: any }>): Promise<void> {
    const promises = events.map((e) => this.track(e.event, e.properties, { userId: e.userId }))
    await Promise.all(promises)
  }

  /**
   * Graceful shutdown - flush all pending events
   */
  async shutdown(): Promise<void> {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    await this.flush()
  }
}

// Server singleton
let serverClient: ServerAnalytics | null = null

export function init(config: ServerConfig): ServerAnalytics {
  serverClient = new ServerAnalytics(config)
  return serverClient
}

export function getClient(): ServerAnalytics {
  if (!serverClient) {
    throw new Error('Server analytics not initialized. Call init() first.')
  }
  return serverClient
}

export const analytics = {
  init,
  track: (...args: Parameters<ServerAnalytics['track']>) => getClient().track(...args),
  page: (...args: Parameters<ServerAnalytics['page']>) => getClient().page(...args),
  identify: (...args: Parameters<ServerAnalytics['identify']>) => getClient().identify(...args),
  group: (...args: Parameters<ServerAnalytics['group']>) => getClient().group(...args),
  alias: (...args: Parameters<ServerAnalytics['alias']>) => getClient().alias(...args),
  query: (...args: Parameters<ServerAnalytics['query']>) => getClient().query(...args),
  aggregate: (...args: Parameters<ServerAnalytics['aggregate']>) => getClient().aggregate(...args),
  cohort: (...args: Parameters<ServerAnalytics['cohort']>) => getClient().cohort(...args),
  funnel: (...args: Parameters<ServerAnalytics['funnel']>) => getClient().funnel(...args),
  trackBulk: (...args: Parameters<ServerAnalytics['trackBulk']>) => getClient().trackBulk(...args),
  flush: () => getClient().flush(),
  shutdown: () => getClient().shutdown(),
}
