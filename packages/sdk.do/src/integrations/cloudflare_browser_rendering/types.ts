/**
 * Cloudflare browser rendering Types
 *
 * Auto-generated TypeScript types for Cloudflare browser rendering Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cloudflare_browser_rendering
 */

/**
 * Cloudflare browser rendering client options
 */
export interface CloudflareBrowserRenderingClientOptions {
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
