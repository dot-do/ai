/**
 * Entelligence Client
 *
 * Auto-generated Integration client for Entelligence.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/entelligence
 */

import { ActionExecuteParams } from './types.js'
import { EntelligenceError } from './errors.js'

/**
 * Entelligence client options
 */
export interface EntelligenceClientOptions {
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
 * Entelligence Client
 *
 * Entelligence leverages artificial intelligence to provide insights, recommendations, and predictive analytics for businesses seeking data-driven decision-making capabilities
 */
export class EntelligenceClient {
  private options: EntelligenceClientOptions

  /**
   * Action resource
   * Execute Entelligence actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: EntelligenceClientOptions) {
    this.options = {
      baseUrl: 'https://api.entelligence.com',
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
      throw EntelligenceError.fromError(error)
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
      Authorization: this.options.apiKey,
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
