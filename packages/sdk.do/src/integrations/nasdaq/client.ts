/**
 * Nasdaq Client
 *
 * Auto-generated Integration client for Nasdaq.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/nasdaq
 */

import { ActionExecuteParams } from './types.js'
import { NasdaqError } from './errors.js'

/**
 * Nasdaq client options
 */
export interface NasdaqClientOptions {
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
 * Nasdaq Client
 *
 * Nasdaq Data Link provides a modern and efficient method of delivering real-time exchange data and other financial information through a suite of APIs, enabling seamless integration and rapid deployment of data-driven applications.
 */
export class NasdaqClient {
  private options: NasdaqClientOptions

  /**
   * Action resource
   * Execute Nasdaq actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: NasdaqClientOptions) {
    this.options = {
      baseUrl: 'https://api.nasdaq.com',
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
      throw NasdaqError.fromError(error)
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
