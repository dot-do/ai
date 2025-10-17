/**
 * Google search console Types
 *
 * Auto-generated TypeScript types for Google search console Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google_search_console
 */

/**
 * Google search console client options
 */
export interface GoogleSearchConsoleClientOptions {
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
