/**
 * Tripadvisor content api Types
 *
 * Auto-generated TypeScript types for Tripadvisor content api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/tripadvisor_content_api
 */

/**
 * Tripadvisor content api client options
 */
export interface TripadvisorContentApiClientOptions {
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
