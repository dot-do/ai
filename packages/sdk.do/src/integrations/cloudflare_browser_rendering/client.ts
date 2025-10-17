/**
 * Cloudflare browser rendering Client
 *
 * Auto-generated Integration client for Cloudflare browser rendering.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cloudflare_browser_rendering
 */

import { ActionExecuteParams } from './types.js'
import { CloudflareBrowserRenderingError } from './errors.js'

/**
 * Cloudflare browser rendering client options
 */
export interface CloudflareBrowserRenderingClientOptions {
  /** API key for authentication */
  apiKey: string
  /** Base URL override */
  baseUrl?: string
  /** Request timeout in ms */
  timeout?: number
  /** Retry attempts */
  retryAttempts?: number
}

/**
 * Cloudflare browser rendering Client
 *
 * Cloudflare Browser Rendering enables developers to programmatically control and interact with headless browser instances running on Cloudflare’s global network, facilitating tasks such as automating browser interactions, capturing screenshots, generating PDFs, and extracting data from web pages.
 */
export class CloudflareBrowserRenderingClient {
  private options: CloudflareBrowserRenderingClientOptions

  /**
   * Action resource
   * Execute Cloudflare browser rendering actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: CloudflareBrowserRenderingClientOptions) {
    this.options = {
      baseUrl: 'https://api.cloudflare_browser_rendering.com',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize resource namespaces
    this.action = {
      execute: this.actionExecute.bind(this),
    }
  }

  /**
   * undefined Action
   * @param params - Operation parameters
   * @returns object
   */
  private async actionExecute(params: ActionExecuteParams): Promise<object> {
    try {
      const response = await this.request('POST', '/', params)
      return response as object
    } catch (error) {
      throw CloudflareBrowserRenderingError.fromError(error)
    }
  }

  /**
   * Make HTTP request
   * @param method - HTTP method
   * @param path - Request path
   * @param data - Request data
   * @returns Response data
   */
  private async request(method: string, path: string, data?: any): Promise<any> {
    const url = `${this.options.baseUrl}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.options.apiKey,
    }

    const config: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.options.timeout || 30000),
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data)
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }
}
