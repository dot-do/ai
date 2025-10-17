/**
 * Piloterr Client
 *
 * Auto-generated Integration client for Piloterr.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/piloterr
 */

import { ActionExecuteParams } from './types.js'
import { PiloterrError } from './errors.js'

/**
 * Piloterr client options
 */
export interface PiloterrClientOptions {
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
 * Piloterr Client
 *
 * Piloterr is a developer-first platform offering over 50 ready-to-use APIs for web scraping and data extraction, enabling businesses to efficiently gather and integrate web data into their systems.
 */
export class PiloterrClient {
  private options: PiloterrClientOptions

  /**
   * Action resource
   * Execute Piloterr actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: PiloterrClientOptions) {
    this.options = {
      baseUrl: 'https://api.piloterr.com',
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
      throw PiloterrError.fromError(error)
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
