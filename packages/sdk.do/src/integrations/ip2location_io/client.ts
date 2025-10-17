/**
 * Ip2location io Client
 *
 * Auto-generated Integration client for Ip2location io.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ip2location_io
 */

import { ActionExecuteParams } from './types.js'
import { Ip2locationIoError } from './errors.js'

/**
 * Ip2location io client options
 */
export interface Ip2locationIoClientOptions {
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
 * Ip2location io Client
 *
 * IP2Location.io provides a fast and accurate IP Geolocation API tool to determine a user's location and use the geolocation information in different use cases.
 */
export class Ip2locationIoClient {
  private options: Ip2locationIoClientOptions

  /**
   * Action resource
   * Execute Ip2location io actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: Ip2locationIoClientOptions) {
    this.options = {
      baseUrl: 'https://api.ip2location_io.com',
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
      throw Ip2locationIoError.fromError(error)
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
