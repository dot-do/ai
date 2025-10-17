/**
 * Bigpicture io Client
 *
 * Auto-generated Integration client for Bigpicture io.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bigpicture_io
 */

import { ActionExecuteParams } from './types.js'
import { BigpictureIoError } from './errors.js'

/**
 * Bigpicture io client options
 */
export interface BigpictureIoClientOptions {
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
 * Bigpicture io Client
 *
 * BigPicture.io provides APIs and datasets for accessing comprehensive company data, including information on over 20 million profiles, used in applications like fintech products, cybersecurity, market research, and sales & marketing tools.
 */
export class BigpictureIoClient {
  private options: BigpictureIoClientOptions

  /**
   * Action resource
   * Execute Bigpicture io actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: BigpictureIoClientOptions) {
    this.options = {
      baseUrl: 'https://api.bigpicture_io.com',
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
      throw BigpictureIoError.fromError(error)
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
