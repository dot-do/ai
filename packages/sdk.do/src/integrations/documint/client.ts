/**
 * Documint Client
 *
 * Auto-generated Integration client for Documint.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/documint
 */

import { ActionExecuteParams } from './types.js'
import { DocumintError } from './errors.js'

/**
 * Documint client options
 */
export interface DocumintClientOptions {
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
 * Documint Client
 *
 * Template description for documint
 */
export class DocumintClient {
  private options: DocumintClientOptions

  /**
   * Action resource
   * Execute Documint actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: DocumintClientOptions) {
    this.options = {
      baseUrl: 'https://api.documint.com',
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
      throw DocumintError.fromError(error)
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
