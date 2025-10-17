/**
 * Segment Types
 *
 * Auto-generated TypeScript types for Segment Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/segment
 */

/**
 * Segment client options
 */
export interface SegmentClientOptions {
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
  /** User ID (required if anonymousId not provided) */
  userId?: string
  /** Anonymous ID (required if userId not provided) */
  anonymousId?: string
  /** Event name */
  event: string
  /** Event properties */
  properties?: Record<string, any>
  /** Context information */
  context?: Record<string, any>
  /** Event timestamp (ISO 8601) */
  timestamp?: string
}

/**
 * Parameters for Event.batch
 */
export interface EventBatchParams {
  /** Array of track/identify/group/page events */
  batch: any[]
}

/**
 * Identify resource types
 */
/**
 * Parameters for Identify.identify
 */
export interface IdentifyIdentifyParams {
  /** User ID (required if anonymousId not provided) */
  userId?: string
  /** Anonymous ID (required if userId not provided) */
  anonymousId?: string
  /** User traits (name, email, etc.) */
  traits?: Record<string, any>
  /** Context information */
  context?: Record<string, any>
  /** Event timestamp (ISO 8601) */
  timestamp?: string
}

/**
 * Group resource types
 */
/**
 * Parameters for Group.group
 */
export interface GroupGroupParams {
  /** User ID (required if anonymousId not provided) */
  userId?: string
  /** Anonymous ID (required if userId not provided) */
  anonymousId?: string
  /** Group ID */
  groupId: string
  /** Group traits */
  traits?: Record<string, any>
  /** Context information */
  context?: Record<string, any>
}

/**
 * Page resource types
 */
/**
 * Parameters for Page.page
 */
export interface PagePageParams {
  /** User ID (required if anonymousId not provided) */
  userId?: string
  /** Anonymous ID (required if userId not provided) */
  anonymousId?: string
  /** Page name */
  name?: string
  /** Page category */
  category?: string
  /** Page properties */
  properties?: Record<string, any>
  /** Context information */
  context?: Record<string, any>
}

/**
 * SDK type re-exports
 */
export type * from '@segment/analytics-node'
