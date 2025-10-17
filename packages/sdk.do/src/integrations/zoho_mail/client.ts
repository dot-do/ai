/**
 * Zoho mail Client
 *
 * Auto-generated Integration client for Zoho mail.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zoho_mail
 */

import { ActionExecuteParams } from './types.js'
import { ZohoMailError } from './errors.js'

/**
 * Zoho mail client options
 */
export interface ZohoMailClientOptions {
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
 * Zoho mail Client
 *
 * Zoho Mail is a secure and ad-free email hosting platform with collaboration tools, calendar integration, and extensive administrative controls
 */
export class ZohoMailClient {
  private options: ZohoMailClientOptions

  /**
   * Action resource
   * Execute Zoho mail actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: ZohoMailClientOptions) {
    this.options = {
      baseUrl: 'https://api.zoho_mail.com',
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
      throw ZohoMailError.fromError(error)
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
