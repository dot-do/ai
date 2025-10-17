/**
 * Mailsoftly Client
 *
 * Auto-generated Integration client for Mailsoftly.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mailsoftly
 */

import { ActionExecuteParams } from './types.js'
import { MailsoftlyError } from './errors.js'

/**
 * Mailsoftly client options
 */
export interface MailsoftlyClientOptions {
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
 * Mailsoftly Client
 *
 * Mailsoftly is an intuitive email marketing platform designed to simplify and enhance how businesses communicate with their audiences. Built with user-friendly features and advanced automation tools, Mailsoftly helps organizations to create, schedule, and manage email campaigns easily.
 */
export class MailsoftlyClient {
  private options: MailsoftlyClientOptions

  /**
   * Action resource
   * Execute Mailsoftly actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: MailsoftlyClientOptions) {
    this.options = {
      baseUrl: 'https://api.mailsoftly.com',
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
      throw MailsoftlyError.fromError(error)
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
