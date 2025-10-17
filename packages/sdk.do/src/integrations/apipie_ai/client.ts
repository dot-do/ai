/**
 * Apipie ai Client
 *
 * Auto-generated Integration client for Apipie ai.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/apipie_ai
 */

import { ActionExecuteParams } from './types.js'
import { ApipieAiError } from './errors.js'

/**
 * Apipie ai client options
 */
export interface ApipieAiClientOptions {
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
 * Apipie ai Client
 *
 * APIpie.ai is an AI super aggregator providing a unified API to access a vast array of AI models from leading providers, enabling cost-effective and latency-optimized solutions.
 */
export class ApipieAiClient {
  private options: ApipieAiClientOptions

  /**
   * Action resource
   * Execute Apipie ai actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: ApipieAiClientOptions) {
    this.options = {
      baseUrl: 'https://api.apipie_ai.com',
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
      throw ApipieAiError.fromError(error)
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
