/**
 * Blackbaud Client
 *
 * Auto-generated Integration client for Blackbaud.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/blackbaud
 */

import { ActionExecuteParams } from './types.js'
import { BlackbaudError } from './errors.js'

/**
 * Blackbaud client options
 */
export interface BlackbaudClientOptions {
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
 * Blackbaud Client
 *
 * Blackbaud offers cloud-based software for nonprofits, schools, and healthcare institutions, supporting fundraising, financial management, and donor engagement in mission-driven organizations
 */
export class BlackbaudClient {
  private options: BlackbaudClientOptions

  /**
   * Action resource
   * Execute Blackbaud actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: BlackbaudClientOptions) {
    this.options = {
      baseUrl: 'https://api.blackbaud.com',
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
      throw BlackbaudError.fromError(error)
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
