/**
 * Rosette text analytics Client
 *
 * Auto-generated Integration client for Rosette text analytics.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/rosette_text_analytics
 */

import { ActionExecuteParams } from './types.js'
import { RosetteTextAnalyticsError } from './errors.js'

/**
 * Rosette text analytics client options
 */
export interface RosetteTextAnalyticsClientOptions {
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
 * Rosette text analytics Client
 *
 * Rosette Text Analytics is a platform that uses natural language processing, statistical modeling, and machine learning to analyze unstructured and semi-structured text across 364 language-encoding-script combinations, revealing valuable information and actionable data.
 */
export class RosetteTextAnalyticsClient {
  private options: RosetteTextAnalyticsClientOptions

  /**
   * Action resource
   * Execute Rosette text analytics actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: RosetteTextAnalyticsClientOptions) {
    this.options = {
      baseUrl: 'https://api.rosette_text_analytics.com',
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
      throw RosetteTextAnalyticsError.fromError(error)
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
