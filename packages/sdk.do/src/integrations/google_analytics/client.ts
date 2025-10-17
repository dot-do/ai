/**
 * Google Analytics Client
 *
 * Auto-generated Integration client for Google Analytics.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google_analytics
 */

import { ActionExecuteParams } from './types.js'
import { GoogleAnalyticsError } from './errors.js'

/**
 * Google Analytics client options
 */
export interface GoogleAnalyticsClientOptions {
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
 * Google Analytics Client
 *
 * Google Analytics tracks and reports website traffic, user behavior, and conversion data, enabling marketers to optimize online performance and customer journeys
 */
export class GoogleAnalyticsClient {
  private options: GoogleAnalyticsClientOptions

  /**
   * Action resource
   * Execute Google Analytics actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: GoogleAnalyticsClientOptions) {
    this.options = {
      baseUrl: 'https://api.google_analytics.com',
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
      throw GoogleAnalyticsError.fromError(error)
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
