/**
 * Wufoo Types
 *
 * Auto-generated TypeScript types for Wufoo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/wufoo
 */

/**
 * Wufoo client options
 */
export interface WufooClientOptions {
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
 * Parameters for Form.get
 */
export interface FormGetParams {
  /** Form ID */
  form_id: string
}

/**
 * Entry resource types
 */
/**
 * Parameters for Entry.get
 */
export interface EntryGetParams {
  /** Form ID */
  form_id: string
  /** Entry ID */
  entry_id: string
}

/**
 * Parameters for Entry.list
 */
export interface EntryListParams {
  /** Form ID */
  form_id: string
}

/**
 * Parameters for Entry.create
 */
export interface EntryCreateParams {
  /** Form ID */
  form_id: string
  /** Form field values */
  fields: Record<string, any>
}
