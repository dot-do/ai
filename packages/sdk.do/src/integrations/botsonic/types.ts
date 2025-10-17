/**
 * Botsonic Types
 *
 * Auto-generated TypeScript types for Botsonic Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/botsonic
 */

/**
 * Botsonic client options
 */
export interface BotsonicClientOptions {
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
