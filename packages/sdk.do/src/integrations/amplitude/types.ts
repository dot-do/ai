/**
 * Amplitude Types
 *
 * Auto-generated TypeScript types for Amplitude Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/amplitude
 */

/**
 * Amplitude client options
 */
export interface AmplitudeClientOptions {
  /** Username for basic authentication */
  username: string
  /** Password for basic authentication */
  password: string
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
