/**
 * Smtp2go Types
 *
 * Auto-generated TypeScript types for Smtp2go Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/smtp2go
 */

/**
 * Smtp2go client options
 */
export interface Smtp2goClientOptions {
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
