/**
 * Datadog Types
 *
 * Auto-generated TypeScript types for Datadog Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/datadog
 */

/**
 * Datadog client options
 */
export interface DatadogClientOptions {
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
 * Metric resource types
 */
/**
 * Parameters for Metric.submit
 */
export interface MetricSubmitParams {
  /** Array of metric series */
  series: any[]
}

/**
 * Parameters for Metric.query
 */
export interface MetricQueryParams {
  /** Metric query */
  query: string
  /** Start timestamp (seconds) */
  from: number
  /** End timestamp (seconds) */
  to: number
}

/**
 * Parameters for Metric.list
 */
export interface MetricListParams {
  /** Start timestamp */
  from?: number
}

/**
 * Event resource types
 */
/**
 * Parameters for Event.create
 */
export interface EventCreateParams {
  /** Event title */
  title: string
  /** Event text */
  text: string
  /** Event tags */
  tags?: any[]
}

/**
 * Parameters for Event.get
 */
export interface EventGetParams {
  /** Event ID */
  event_id: number
}

/**
 * Parameters for Event.list
 */
export interface EventListParams {
  /** Start timestamp */
  start: number
  /** End timestamp */
  end: number
}

/**
 * Monitor resource types
 */
/**
 * Parameters for Monitor.create
 */
export interface MonitorCreateParams {
  /** Monitor type (metric alert, service check, etc.) */
  type: string
  /** Monitor query */
  query: string
  /** Monitor name */
  name: string
  /** Alert message */
  message?: string
}

/**
 * Parameters for Monitor.get
 */
export interface MonitorGetParams {
  /** Monitor ID */
  monitor_id: number
}

/**
 * Parameters for Monitor.update
 */
export interface MonitorUpdateParams {
  /** Monitor ID */
  monitor_id: number
  /** Updated query */
  query?: string
}

/**
 * Parameters for Monitor.delete
 */
export interface MonitorDeleteParams {
  /** Monitor ID */
  monitor_id: number
}

/**
 * Parameters for Monitor.list
 */
export interface MonitorListParams {
  /** Filter by states (all, alert, warn, no data) */
  group_states?: string
}

/**
 * Dashboard resource types
 */
/**
 * Parameters for Dashboard.create
 */
export interface DashboardCreateParams {
  /** Dashboard title */
  title: string
  /** Layout type (ordered or free) */
  layout_type: string
  /** Dashboard widgets */
  widgets: any[]
}

/**
 * Parameters for Dashboard.get
 */
export interface DashboardGetParams {
  /** Dashboard ID */
  dashboard_id: string
}

/**
 * Parameters for Dashboard.update
 */
export interface DashboardUpdateParams {
  /** Dashboard ID */
  dashboard_id: string
  /** Updated title */
  title?: string
}

/**
 * Parameters for Dashboard.delete
 */
export interface DashboardDeleteParams {
  /** Dashboard ID */
  dashboard_id: string
}

/**
 * SDK type re-exports
 */
export type * from '@datadog/datadog-api-client'
