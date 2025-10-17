/**
 * Tripadvisor content api Client
 *
 * Auto-generated Integration client for Tripadvisor content api.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/tripadvisor_content_api
 */

import { ActionExecuteParams } from './types.js'
import { TripadvisorContentApiError } from './errors.js'

/**
 * Tripadvisor content api client options
 */
export interface TripadvisorContentApiClientOptions {
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
 * Tripadvisor content api Client
 *
 * The Tripadvisor Content API provides developers with access to Tripadvisor’s extensive data set, including over 7.5 million locations, 1 billion reviews and opinions, and support for 29 languages.
 */
export class TripadvisorContentApiClient {
  private options: TripadvisorContentApiClientOptions

  /**
   * Action resource
   * Execute Tripadvisor content api actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: TripadvisorContentApiClientOptions) {
    this.options = {
      baseUrl: 'https://api.tripadvisor_content_api.com',
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
      throw TripadvisorContentApiError.fromError(error)
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
