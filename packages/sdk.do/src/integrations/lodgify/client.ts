/**
 * Lodgify Client
 *
 * Auto-generated Integration client for Lodgify.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/lodgify
 */

import { ActionExecuteParams } from './types.js'
import { LodgifyError } from './errors.js'

/**
 * Lodgify client options
 */
export interface LodgifyClientOptions {
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
 * Lodgify Client
 *
 * Lodgify is an all-in-one vacation rental software that enables property owners and managers to create bookable websites, synchronize property data across multiple channels, and manage guest reservations and communications from a single platform.
 */
export class LodgifyClient {
  private options: LodgifyClientOptions

  /**
   * Action resource
   * Execute Lodgify actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: LodgifyClientOptions) {
    this.options = {
      baseUrl: 'https://api.lodgify.com',
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
      throw LodgifyError.fromError(error)
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
