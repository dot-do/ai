/**
 * Sendbird ai chabot Client
 *
 * Auto-generated Integration client for Sendbird ai chabot.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sendbird_ai_chabot
 */

import { ActionExecuteParams } from './types.js'
import { SendbirdAiChabotError } from './errors.js'

/**
 * Sendbird ai chabot client options
 */
export interface SendbirdAiChabotClientOptions {
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
 * Sendbird ai chabot Client
 *
 * Sendbird's AI Chatbot enables businesses to integrate intelligent, automated conversational agents into their applications, enhancing customer engagement and support.
 */
export class SendbirdAiChabotClient {
  private options: SendbirdAiChabotClientOptions

  /**
   * Action resource
   * Execute Sendbird ai chabot actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: SendbirdAiChabotClientOptions) {
    this.options = {
      baseUrl: 'https://api.sendbird_ai_chabot.com',
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
      throw SendbirdAiChabotError.fromError(error)
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
