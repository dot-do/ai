/**
 * Anchor browser Types
 *
 * Auto-generated TypeScript types for Anchor browser Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/anchor_browser
 */

/**
 * Anchor browser client options
 */
export interface AnchorBrowserClientOptions {
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
