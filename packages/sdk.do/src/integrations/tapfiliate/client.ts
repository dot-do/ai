/**
 * Tapfiliate Client
 *
 * Auto-generated Integration client for Tapfiliate.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/tapfiliate
 */

import { ActionExecuteParams } from './types.js'
import { TapfiliateError } from './errors.js'

/**
 * Tapfiliate client options
 */
export interface TapfiliateClientOptions {
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
 * Tapfiliate Client
 *
 * Tapfiliate is an affiliate and referral tracking platform that enables businesses to create, track, and scale their affiliate programs efficiently.
 */
export class TapfiliateClient {
  private options: TapfiliateClientOptions

  /**
   * Action resource
   * Execute Tapfiliate actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: TapfiliateClientOptions) {
    this.options = {
      baseUrl: 'https://api.tapfiliate.com',
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
      throw TapfiliateError.fromError(error)
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
