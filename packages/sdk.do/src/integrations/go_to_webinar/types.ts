/**
 * Go to webinar Types
 *
 * Auto-generated TypeScript types for Go to webinar Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/go_to_webinar
 */

/**
 * Go to webinar client options
 */
export interface GoToWebinarClientOptions {
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
