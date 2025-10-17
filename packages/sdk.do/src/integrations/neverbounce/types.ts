/**
 * Neverbounce Types
 *
 * Auto-generated TypeScript types for Neverbounce Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/neverbounce
 */

/**
 * Neverbounce client options
 */
export interface NeverbounceClientOptions {
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
