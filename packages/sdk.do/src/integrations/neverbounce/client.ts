/**
 * Neverbounce Client
 *
 * Auto-generated Integration client for Neverbounce.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/neverbounce
 */

import { ActionExecuteParams } from './types.js'
import { NeverbounceError } from './errors.js'

/**
 * Neverbounce client options
 */
export interface NeverbounceClientOptions {
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
 * Neverbounce Client
 *
 * NeverBounce provides email verification services to ensure the validity of email addresses, enhancing deliverability and reducing bounce rates.
 */
export class NeverbounceClient {
  private options: NeverbounceClientOptions

  /**
   * Action resource
   * Execute Neverbounce actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: NeverbounceClientOptions) {
    this.options = {
      baseUrl: 'https://api.neverbounce.com',
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
      throw NeverbounceError.fromError(error)
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
