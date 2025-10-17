/**
 * Kit Types
 *
 * Auto-generated TypeScript types for Kit Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/kit
 */

/**
 * Kit client options
 */
export interface KitClientOptions {
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
