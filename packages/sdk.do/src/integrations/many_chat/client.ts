/**
 * Many chat Client
 *
 * Auto-generated Integration client for Many chat.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/many_chat
 */

import { ActionExecuteParams } from './types.js'
import { ManyChatError } from './errors.js'

/**
 * Many chat client options
 */
export interface ManyChatClientOptions {
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
 * Many chat Client
 *
 * ManyChat is a platform that enables businesses to automate interactive conversations across various messaging channels, including Instagram Direct Messages, Facebook Messenger, and SMS, to enhance customer engagement and drive growth.
 */
export class ManyChatClient {
  private options: ManyChatClientOptions

  /**
   * Action resource
   * Execute Many chat actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: ManyChatClientOptions) {
    this.options = {
      baseUrl: 'https://api.many_chat.com',
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
      throw ManyChatError.fromError(error)
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
