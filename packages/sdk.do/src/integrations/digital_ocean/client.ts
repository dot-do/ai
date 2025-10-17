/**
 * Digital ocean Client
 *
 * Auto-generated Integration client for Digital ocean.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/digital_ocean
 */

import { ActionExecuteParams } from './types.js'
import { DigitalOceanError } from './errors.js'

/**
 * Digital ocean client options
 */
export interface DigitalOceanClientOptions {
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
 * Digital ocean Client
 *
 * DigitalOcean is a cloud infrastructure provider offering scalable compute platforms with a user-friendly interface.
 */
export class DigitalOceanClient {
  private options: DigitalOceanClientOptions

  /**
   * Action resource
   * Execute Digital ocean actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: DigitalOceanClientOptions) {
    this.options = {
      baseUrl: 'https://api.digital_ocean.com',
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
      throw DigitalOceanError.fromError(error)
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
