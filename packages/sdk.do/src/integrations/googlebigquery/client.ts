/**
 * Google BigQuery Client
 *
 * Auto-generated Integration client for Google BigQuery.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/googlebigquery
 */

import { ActionExecuteParams } from './types.js'
import { GooglebigqueryError } from './errors.js'

/**
 * Google BigQuery client options
 */
export interface GooglebigqueryClientOptions {
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
 * Google BigQuery Client
 *
 * Google BigQuery is a fully managed data warehouse for large-scale data analytics, offering fast SQL queries and machine learning capabilities on massive datasets
 */
export class GooglebigqueryClient {
  private options: GooglebigqueryClientOptions

  /**
   * Action resource
   * Execute Google BigQuery actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: GooglebigqueryClientOptions) {
    this.options = {
      baseUrl: 'https://api.googlebigquery.com',
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
      throw GooglebigqueryError.fromError(error)
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
