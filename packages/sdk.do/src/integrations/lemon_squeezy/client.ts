/**
 * Lemon squeezy Client
 *
 * Auto-generated Integration client for Lemon squeezy.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/lemon_squeezy
 */

import { ActionExecuteParams } from './types.js'
import { LemonSqueezyError } from './errors.js'

/**
 * Lemon squeezy client options
 */
export interface LemonSqueezyClientOptions {
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
 * Lemon squeezy Client
 *
 * Lemon Squeezy is a platform designed to simplify payments, taxes, and subscriptions for software companies, offering a powerful API and webhooks for seamless integration.
 */
export class LemonSqueezyClient {
  private options: LemonSqueezyClientOptions

  /**
   * Action resource
   * Execute Lemon squeezy actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: LemonSqueezyClientOptions) {
    this.options = {
      baseUrl: 'https://api.lemon_squeezy.com',
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
      throw LemonSqueezyError.fromError(error)
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
