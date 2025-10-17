/**
 * Apex27 Types
 *
 * Auto-generated TypeScript types for Apex27 Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/apex27
 */

/**
 * Apex27 client options
 */
export interface Apex27ClientOptions {
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
