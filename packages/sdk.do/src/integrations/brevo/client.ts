/**
 * Brevo Client
 *
 * Auto-generated Integration client for Brevo.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/brevo
 */

import { ActionExecuteParams } from './types.js'
import { BrevoError } from './errors.js'

/**
 * Brevo client options
 */
export interface BrevoClientOptions {
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
 * Brevo Client
 *
 * Brevo (formerly Sendinblue) is an all-in-one email and SMS marketing platform that provides transactional messaging, marketing automation, contact management, and CRM tools to help businesses communicate and engage with their customers.
 */
export class BrevoClient {
  private options: BrevoClientOptions

  /**
   * Action resource
   * Execute Brevo actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: BrevoClientOptions) {
    this.options = {
      baseUrl: 'https://api.brevo.com',
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
      throw BrevoError.fromError(error)
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
