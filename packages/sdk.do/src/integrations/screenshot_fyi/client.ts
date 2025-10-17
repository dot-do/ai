/**
 * Screenshot fyi Client
 *
 * Auto-generated Integration client for Screenshot fyi.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/screenshot_fyi
 */

import { ActionExecuteParams } from './types.js'
import { ScreenshotFyiError } from './errors.js'

/**
 * Screenshot fyi client options
 */
export interface ScreenshotFyiClientOptions {
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
 * Screenshot fyi Client
 *
 * Take stunning, premium quality screenshots of any website with one API call.
 */
export class ScreenshotFyiClient {
  private options: ScreenshotFyiClientOptions

  /**
   * Action resource
   * Execute Screenshot fyi actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: ScreenshotFyiClientOptions) {
    this.options = {
      baseUrl: 'https://api.screenshot_fyi.com',
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
      throw ScreenshotFyiError.fromError(error)
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
