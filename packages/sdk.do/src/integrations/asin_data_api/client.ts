/**
 * Asin data api Client
 *
 * Auto-generated Integration client for Asin data api.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/asin_data_api
 */

import { ActionExecuteParams } from './types.js'
import { AsinDataApiError } from './errors.js'

/**
 * Asin data api client options
 */
export interface AsinDataApiClientOptions {
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
 * Asin data api Client
 *
 * ASIN Data API provides detailed product data from Amazon, including price, rank, reviews, and more, enabling real-time insights for e-commerce professionals, marketers, and data analysts.
 */
export class AsinDataApiClient {
  private options: AsinDataApiClientOptions

  /**
   * Action resource
   * Execute Asin data api actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: AsinDataApiClientOptions) {
    this.options = {
      baseUrl: 'https://api.asin_data_api.com',
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
      throw AsinDataApiError.fromError(error)
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
