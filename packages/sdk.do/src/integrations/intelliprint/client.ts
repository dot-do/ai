/**
 * Intelliprint Client
 *
 * Auto-generated Integration client for Intelliprint.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/intelliprint
 */

import { ActionExecuteParams } from './types.js'
import { IntelliprintError } from './errors.js'

/**
 * Intelliprint client options
 */
export interface IntelliprintClientOptions {
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
 * Intelliprint Client
 *
 * Intelliprint offers a Hybrid Mail API that enables businesses to automate their letter printing and mailing processes, providing features like same-day printing, secure authentication, and real-time tracking.
 */
export class IntelliprintClient {
  private options: IntelliprintClientOptions

  /**
   * Action resource
   * Execute Intelliprint actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: IntelliprintClientOptions) {
    this.options = {
      baseUrl: 'https://api.intelliprint.com',
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
      throw IntelliprintError.fromError(error)
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
