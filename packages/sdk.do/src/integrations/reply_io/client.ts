/**
 * Reply io Client
 *
 * Auto-generated Integration client for Reply io.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/reply_io
 */

import { ActionExecuteParams } from './types.js'
import { ReplyIoError } from './errors.js'

/**
 * Reply io client options
 */
export interface ReplyIoClientOptions {
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
 * Reply io Client
 *
 * Reply.io is an AI-powered sales engagement platform that automates and optimizes sales outreach across multiple channels, integrating with various business tools to enhance lead conversion rates and overall sales productivity.
 */
export class ReplyIoClient {
  private options: ReplyIoClientOptions

  /**
   * Action resource
   * Execute Reply io actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: ReplyIoClientOptions) {
    this.options = {
      baseUrl: 'https://api.reply_io.com',
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
      throw ReplyIoError.fromError(error)
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
