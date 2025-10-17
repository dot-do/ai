/**
 * Fullenrich Client
 *
 * Auto-generated Integration client for Fullenrich.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/fullenrich
 */

import { ActionExecuteParams } from './types.js'
import { FullenrichError } from './errors.js'

/**
 * Fullenrich client options
 */
export interface FullenrichClientOptions {
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
 * Fullenrich Client
 *
 * FullEnrich is a B2B email and phone waterfall enrichment platform that aggregates contact information from over 15 premium vendors to find the emails and phone numbers of leads.
 */
export class FullenrichClient {
  private options: FullenrichClientOptions

  /**
   * Action resource
   * Execute Fullenrich actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: FullenrichClientOptions) {
    this.options = {
      baseUrl: 'https://api.fullenrich.com',
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
      throw FullenrichError.fromError(error)
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
