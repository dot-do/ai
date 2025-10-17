/**
 * Pdf4me Client
 *
 * Auto-generated Integration client for Pdf4me.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pdf4me
 */

import { ActionExecuteParams } from './types.js'
import { Pdf4meError } from './errors.js'

/**
 * Pdf4me client options
 */
export interface Pdf4meClientOptions {
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
 * Pdf4me Client
 *
 * PDF4me provides robust, secure, and scalable APIs for document generation, manipulation, and management, enabling easy integration and automation across various applications.
 */
export class Pdf4meClient {
  private options: Pdf4meClientOptions

  /**
   * Action resource
   * Execute Pdf4me actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: Pdf4meClientOptions) {
    this.options = {
      baseUrl: 'https://api.pdf4me.com',
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
      throw Pdf4meError.fromError(error)
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
      Authorization: 'Basic ' + this.options.apiKey,
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
