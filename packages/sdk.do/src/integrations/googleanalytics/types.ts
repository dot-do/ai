/**
 * Google Analytics Types
 *
 * Auto-generated TypeScript types for Google Analytics Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/googleanalytics
 */

/**
 * Google Analytics client options
 */
export interface GoogleanalyticsClientOptions {
  /** OAuth2 access token */
  accessToken: string
  /** Base URL override (optional) */
  baseUrl?: string
  /** Request timeout in milliseconds (optional) */
  timeout?: number
  /** Number of retry attempts (optional) */
  retryAttempts?: number
}

/**
 * Report resource types
 */
/**
 * Parameters for Report.get
 */
export interface ReportGetParams {
  /** View (Profile) ID */
  viewId: string
  /** Date ranges */
  dateRanges: any[]
  /** Metrics to query */
  metrics: any[]
  /** Dimensions to query */
  dimensions?: any[]
}

/**
 * Account resource types
 */

/**
 * Property resource types
 */
/**
 * Parameters for Property.list
 */
export interface PropertyListParams {
  /** Account ID */
  account_id: string
}
