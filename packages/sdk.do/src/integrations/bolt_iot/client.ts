/**
 * Bolt iot Client
 *
 * Auto-generated Integration client for Bolt iot.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bolt_iot
 */

import { ActionExecuteParams } from './types.js'
import { BoltIotError } from './errors.js'

/**
 * Bolt iot client options
 */
export interface BoltIotClientOptions {
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
 * Bolt iot Client
 *
 * Bolt IoT is an integrated platform that enables users to build IoT projects by connecting sensors and actuators to the internet, offering cloud-based control and monitoring capabilities.
 */
export class BoltIotClient {
  private options: BoltIotClientOptions

  /**
   * Action resource
   * Execute Bolt iot actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: BoltIotClientOptions) {
    this.options = {
      baseUrl: 'https://api.bolt_iot.com',
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
      throw BoltIotError.fromError(error)
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
