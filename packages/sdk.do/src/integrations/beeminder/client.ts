/**
 * Beeminder Client
 *
 * Auto-generated Integration client for Beeminder.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/beeminder
 */

import { ActionExecuteParams } from './types.js'
import { BeeminderError } from './errors.js'

/**
 * Beeminder client options
 */
export interface BeeminderClientOptions {
  /** OAuth2 access token */
  accessToken: string
  /** Base URL override */
  baseUrl?: string
  /** Request timeout in ms */
  timeout?: number
  /** Retry attempts */
  retryAttempts?: number
}

/**
 * Beeminder Client
 *
 * Beeminder is an online goal-tracking service that uses financial incentives—pledge money on your objectives and forfeit it if you don’t keep up—to help you achieve your goals.
 */
export class BeeminderClient {
  private options: BeeminderClientOptions

  /**
   * Action resource
   * Execute Beeminder actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: BeeminderClientOptions) {
    this.options = {
      baseUrl: 'https://api.beeminder.com',
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
      throw BeeminderError.fromError(error)
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
      Authorization: 'Bearer ' + this.options.accessToken,
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
