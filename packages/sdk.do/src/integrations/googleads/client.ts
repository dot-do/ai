/**
 * Google Ads Client
 *
 * Auto-generated Integration client for Google Ads.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/googleads
 */

import { ActionExecuteParams } from './types.js'
import { GoogleadsError } from './errors.js'

/**
 * Google Ads client options
 */
export interface GoogleadsClientOptions {
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
 * Google Ads Client
 *
 * Google Ads, is an online advertising platform developed by Google, where advertisers bid to display brief advertisements, service offerings, product listings, and videos to web users.
 */
export class GoogleadsClient {
  private options: GoogleadsClientOptions

  /**
   * Action resource
   * Execute Google Ads actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: GoogleadsClientOptions) {
    this.options = {
      baseUrl: 'https://api.googleads.com',
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
      throw GoogleadsError.fromError(error)
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
