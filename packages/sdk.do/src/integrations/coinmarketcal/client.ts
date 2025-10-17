/**
 * Coinmarketcal Client
 *
 * Auto-generated Integration client for Coinmarketcal.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/coinmarketcal
 */

import { ActionExecuteParams } from './types.js'
import { CoinmarketcalError } from './errors.js'

/**
 * Coinmarketcal client options
 */
export interface CoinmarketcalClientOptions {
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
 * Coinmarketcal Client
 *
 * CoinMarketCal is a community-driven crypto calendar, highlighting upcoming events, announcements, and releases, helping traders and enthusiasts track market-impacting developments in the cryptocurrency space
 */
export class CoinmarketcalClient {
  private options: CoinmarketcalClientOptions

  /**
   * Action resource
   * Execute Coinmarketcal actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: CoinmarketcalClientOptions) {
    this.options = {
      baseUrl: 'https://api.coinmarketcal.com',
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
      throw CoinmarketcalError.fromError(error)
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
