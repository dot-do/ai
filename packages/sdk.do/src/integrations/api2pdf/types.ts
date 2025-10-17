/**
 * Api2pdf Types
 *
 * Auto-generated TypeScript types for Api2pdf Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/api2pdf
 */

/**
 * Api2pdf client options
 */
export interface Api2pdfClientOptions {
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
 * Action resource types
 */
/**
 * Parameters for Action.execute
 */
export interface ActionExecuteParams {
  /** Action name to execute */
  action: string
  /** Action parameters */
  parameters?: Record<string, any>
}
