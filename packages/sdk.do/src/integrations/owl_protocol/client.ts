/**
 * Owl protocol Client
 *
 * Auto-generated Integration client for Owl protocol.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/owl_protocol
 */

import { ActionExecuteParams } from './types.js'
import { OwlProtocolError } from './errors.js'

/**
 * Owl protocol client options
 */
export interface OwlProtocolClientOptions {
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
 * Owl protocol Client
 *
 * Owl Protocol empowers developers to build feature-rich, user-friendly Web3 applications for mainstream adoption through modular infrastructure that simplifies blockchain development.
 */
export class OwlProtocolClient {
  private options: OwlProtocolClientOptions

  /**
   * Action resource
   * Execute Owl protocol actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: OwlProtocolClientOptions) {
    this.options = {
      baseUrl: 'https://api.owl_protocol.com',
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
      throw OwlProtocolError.fromError(error)
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
