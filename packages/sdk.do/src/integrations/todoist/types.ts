/**
 * Todoist Types
 *
 * Auto-generated TypeScript types for Todoist Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/todoist
 */

/**
 * Todoist client options
 */
export interface TodoistClientOptions {
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
