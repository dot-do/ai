/**
 * Imejis io Client
 *
 * Auto-generated Integration client for Imejis io.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/imejis_io
 */

import { ActionExecuteParams } from './types.js'
import { ImejisIoError } from './errors.js'

/**
 * Imejis io client options
 */
export interface ImejisIoClientOptions {
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
 * Imejis io Client
 *
 * Imejis.io is an API-based image generation platform that enables users to create and customize images seamlessly through a user-friendly interface and a rich library of templates.
 */
export class ImejisIoClient {
  private options: ImejisIoClientOptions

  /**
   * Action resource
   * Execute Imejis io actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: ImejisIoClientOptions) {
    this.options = {
      baseUrl: 'https://api.imejis_io.com',
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
      throw ImejisIoError.fromError(error)
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
