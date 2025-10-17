/**
 * Adrapid Client
 *
 * Auto-generated Integration client for Adrapid.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/adrapid
 */

import { ActionExecuteParams } from './types.js'
import { AdrapidError } from './errors.js'

/**
 * Adrapid client options
 */
export interface AdrapidClientOptions {
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
 * Adrapid Client
 *
 * Adrapid is a tool designed for efficient creation of digital marketing visuals, including banners, images, videos, and HTML5 content, utilizing reusable templates and offering automation through a REST API.
 */
export class AdrapidClient {
  private options: AdrapidClientOptions

  /**
   * Action resource
   * Execute Adrapid actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: AdrapidClientOptions) {
    this.options = {
      baseUrl: 'https://api.adrapid.com',
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
      throw AdrapidError.fromError(error)
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
