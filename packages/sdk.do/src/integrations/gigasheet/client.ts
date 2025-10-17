/**
 * Gigasheet Client
 *
 * Auto-generated Integration client for Gigasheet.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gigasheet
 */

import { ActionExecuteParams } from './types.js'
import { GigasheetError } from './errors.js'

/**
 * Gigasheet client options
 */
export interface GigasheetClientOptions {
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
 * Gigasheet Client
 *
 * Gigasheet is a big data automation platform that offers a spreadsheet-like interface for analyzing and managing large datasets, enabling users to automate tasks, integrate with various data sources, and streamline data workflows.
 */
export class GigasheetClient {
  private options: GigasheetClientOptions

  /**
   * Action resource
   * Execute Gigasheet actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: GigasheetClientOptions) {
    this.options = {
      baseUrl: 'https://api.gigasheet.com',
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
      throw GigasheetError.fromError(error)
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
