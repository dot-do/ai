/**
 * Composio search Client
 *
 * Auto-generated Integration client for Composio search.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/composio_search
 */

import { ActionExecuteParams } from './types.js'
import { ComposioSearchError } from './errors.js'

/**
 * Composio search client options
 */
export interface ComposioSearchClientOptions {
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
 * Composio search Client
 *
 * Composio Search provides comprehensive web search across travel (flights, hotels, events), e-commerce (Amazon, Walmart, shopping), financial markets, news, academic research, images, and location services.
 */
export class ComposioSearchClient {
  private options: ComposioSearchClientOptions

  /**
   * Action resource
   * Execute Composio search actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: ComposioSearchClientOptions) {
    this.options = {
      baseUrl: 'https://api.composio_search.com',
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
      throw ComposioSearchError.fromError(error)
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
