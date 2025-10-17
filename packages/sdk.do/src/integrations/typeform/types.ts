/**
 * Typeform Types
 *
 * Auto-generated TypeScript types for Typeform Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/typeform
 */

/**
 * Typeform client options
 */
export interface TypeformClientOptions {
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
 * Form resource types
 */
/**
 * Parameters for Form.create
 */
export interface FormCreateParams {
  /** Form title */
  title: string
  /** Form fields */
  fields?: any[]
  /** Form settings */
  settings?: Record<string, any>
}

/**
 * Parameters for Form.get
 */
export interface FormGetParams {
  /** Form ID */
  form_id: string
}

/**
 * Parameters for Form.update
 */
export interface FormUpdateParams {
  /** Form ID */
  form_id: string
  /** Updated form title */
  title?: string
  /** Updated form fields */
  fields?: any[]
}

/**
 * Parameters for Form.delete
 */
export interface FormDeleteParams {
  /** Form ID */
  form_id: string
}

/**
 * Parameters for Form.list
 */
export interface FormListParams {
  /** Page number */
  page?: number
  /** Results per page */
  page_size?: number
}

/**
 * Response resource types
 */
/**
 * Parameters for Response.get
 */
export interface ResponseGetParams {
  /** Form ID */
  form_id: string
  /** Response ID */
  response_id: string
}

/**
 * Parameters for Response.list
 */
export interface ResponseListParams {
  /** Form ID */
  form_id: string
  /** Results per page (max 1000) */
  page_size?: number
  /** Start date (ISO 8601) */
  since?: string
  /** End date (ISO 8601) */
  until?: string
  /** Response token for pagination */
  after?: string
  /** Response token for pagination */
  before?: string
}

/**
 * Parameters for Response.delete
 */
export interface ResponseDeleteParams {
  /** Form ID */
  form_id: string
  /** Response IDs to delete */
  included_response_ids: any[]
}

/**
 * Webhook resource types
 */
/**
 * Parameters for Webhook.create
 */
export interface WebhookCreateParams {
  /** Form ID */
  form_id: string
  /** Webhook tag/identifier */
  tag: string
  /** Webhook URL */
  url: string
  /** Enable webhook */
  enabled?: boolean
  /** Secret for signature verification */
  secret?: string
}

/**
 * Parameters for Webhook.get
 */
export interface WebhookGetParams {
  /** Form ID */
  form_id: string
  /** Webhook tag */
  tag: string
}

/**
 * Parameters for Webhook.delete
 */
export interface WebhookDeleteParams {
  /** Form ID */
  form_id: string
  /** Webhook tag */
  tag: string
}

/**
 * Theme resource types
 */
/**
 * Parameters for Theme.create
 */
export interface ThemeCreateParams {
  /** Theme name */
  name: string
  /** Theme colors */
  colors?: Record<string, any>
  /** Theme font */
  font?: string
}

/**
 * Parameters for Theme.get
 */
export interface ThemeGetParams {
  /** Theme ID */
  theme_id: string
}

/**
 * Parameters for Theme.update
 */
export interface ThemeUpdateParams {
  /** Theme ID */
  theme_id: string
  /** Updated theme name */
  name?: string
  /** Updated theme colors */
  colors?: Record<string, any>
}

/**
 * Parameters for Theme.delete
 */
export interface ThemeDeleteParams {
  /** Theme ID */
  theme_id: string
}

/**
 * Parameters for Theme.list
 */
export interface ThemeListParams {
  /** Page number */
  page?: number
  /** Results per page */
  page_size?: number
}

/**
 * SDK type re-exports
 */
export type * from '@typeform/api-client'
