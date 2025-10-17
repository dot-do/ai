/**
 * Mixpanel Types
 *
 * Auto-generated TypeScript types for Mixpanel Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mixpanel
 */

/**
 * Mixpanel client options
 */
export interface MixpanelClientOptions {
  /** API key for authentication */
  apiKey: string
  /** Base URL override (optional) */
  baseUrl?: string
  /** Request timeout in milliseconds (optional) */
  timeout?: number
  /** Number of retry attempts (optional) */
  retryAttempts?: number
}

/**
 * Event resource types
 */
/**
 * Parameters for Event.track
 */
export interface EventTrackParams {
  /** Unique user identifier */
  distinct_id: string
  /** Event name */
  event: string
  /** Event properties */
  properties?: Record<string, any>
  /** IP address for geolocation */
  ip?: string
}

/**
 * Parameters for Event.import
 */
export interface EventImportParams {
  /** Unique user identifier */
  distinct_id: string
  /** Event name */
  event: string
  /** Unix timestamp */
  time: number
  /** Event properties */
  properties?: Record<string, any>
}

/**
 * User resource types
 */
/**
 * Parameters for User.set
 */
export interface UserSetParams {
  /** Unique user identifier */
  distinct_id: string
  /** User properties to set */
  properties: Record<string, any>
  /** IP address */
  ip?: string
}

/**
 * Parameters for User.increment
 */
export interface UserIncrementParams {
  /** Unique user identifier */
  distinct_id: string
  /** Properties to increment */
  properties: Record<string, any>
}

/**
 * Parameters for User.append
 */
export interface UserAppendParams {
  /** Unique user identifier */
  distinct_id: string
  /** Properties to append to lists */
  properties: Record<string, any>
}

/**
 * Parameters for User.delete
 */
export interface UserDeleteParams {
  /** Unique user identifier */
  distinct_id: string
}

/**
 * Cohort resource types
 */
/**
 * Parameters for Cohort.get
 */
export interface CohortGetParams {
  /** Project ID */
  project_id: number
}

/**
 * Parameters for Cohort.list
 */
export interface CohortListParams {
  /** Project ID */
  project_id: number
}

/**
 * Report resource types
 */
/**
 * Parameters for Report.insights
 */
export interface ReportInsightsParams {
  /** Project ID */
  project_id: number
  /** Start date (YYYY-MM-DD) */
  from_date: string
  /** End date (YYYY-MM-DD) */
  to_date: string
  /** Event name */
  event: string
}

/**
 * Parameters for Report.funnels
 */
export interface ReportFunnelsParams {
  /** Project ID */
  project_id: number
  /** Start date (YYYY-MM-DD) */
  from_date: string
  /** End date (YYYY-MM-DD) */
  to_date: string
  /** Funnel ID */
  funnel_id: number
}

/**
 * SDK type re-exports
 */
export type * from 'mixpanel'
