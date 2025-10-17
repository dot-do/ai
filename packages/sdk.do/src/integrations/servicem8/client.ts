/**
 * Servicem8 Client
 *
 * Auto-generated Integration client for Servicem8.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/servicem8
 */

import { ActionExecuteParams } from './types.js'
import { Servicem8Error } from './errors.js'

/**
 * Servicem8 client options
 */
export interface Servicem8ClientOptions {
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
 * Servicem8 Client
 *
 * ServiceM8 helps field service businesses schedule jobs, send quotes, and manage invoices, offering staff mobile apps and real-time job status tracking
 */
export class Servicem8Client {
  private options: Servicem8ClientOptions

  /**
   * Action resource
   * Execute Servicem8 actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: Servicem8ClientOptions) {
    this.options = {
      baseUrl: 'https://api.servicem8.com',
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
      throw Servicem8Error.fromError(error)
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
