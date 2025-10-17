/**
 * Opengraph io Client
 *
 * Auto-generated Integration client for Opengraph io.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/opengraph_io
 */

import { ActionExecuteParams } from './types.js'
import { OpengraphIoError } from './errors.js'

/**
 * Opengraph io client options
 */
export interface OpengraphIoClientOptions {
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
 * Opengraph io Client
 *
 * OpenGraph.io provides a simple API to retrieve Open Graph data from websites, even those without properly defined Open Graph tags.
 */
export class OpengraphIoClient {
  private options: OpengraphIoClientOptions

  /**
   * Action resource
   * Execute Opengraph io actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: OpengraphIoClientOptions) {
    this.options = {
      baseUrl: 'https://api.opengraph_io.com',
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
      throw OpengraphIoError.fromError(error)
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
