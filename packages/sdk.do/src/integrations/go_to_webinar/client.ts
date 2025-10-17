/**
 * Go to webinar Client
 *
 * Auto-generated Integration client for Go to webinar.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/go_to_webinar
 */

import { ActionExecuteParams } from './types.js'
import { GoToWebinarError } from './errors.js'

/**
 * Go to webinar client options
 */
export interface GoToWebinarClientOptions {
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
 * Go to webinar Client
 *
 * GoToWebinar is a webinar hosting platform that enables businesses to create live and automated online events, engage audiences, and gather analytics for lead nurturing
 */
export class GoToWebinarClient {
  private options: GoToWebinarClientOptions

  /**
   * Action resource
   * Execute Go to webinar actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: GoToWebinarClientOptions) {
    this.options = {
      baseUrl: 'https://api.go_to_webinar.com',
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
      throw GoToWebinarError.fromError(error)
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
