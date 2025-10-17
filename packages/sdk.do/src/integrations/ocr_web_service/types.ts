/**
 * Ocr web service Types
 *
 * Auto-generated TypeScript types for Ocr web service Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ocr_web_service
 */

/**
 * Ocr web service client options
 */
export interface OcrWebServiceClientOptions {
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
