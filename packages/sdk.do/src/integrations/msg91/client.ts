/**
 * Msg91 Client
 *
 * Auto-generated Integration client for Msg91.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/msg91
 */

import { ActionExecuteParams } from './types.js'
import { Msg91Error } from './errors.js'

/**
 * Msg91 client options
 */
export interface Msg91ClientOptions {
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
 * Msg91 Client
 *
 * MSG91 is a cloud communication platform offering secure and robust APIs for SMS, WhatsApp, Email, Voice, and more, enabling businesses to connect with their customers across multiple channels.
 */
export class Msg91Client {
  private options: Msg91ClientOptions

  /**
   * Action resource
   * Execute Msg91 actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: Msg91ClientOptions) {
    this.options = {
      baseUrl: 'https://api.msg91.com',
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
      throw Msg91Error.fromError(error)
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
