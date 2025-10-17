/**
 * Chaser Client
 *
 * Auto-generated Integration client for Chaser.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/chaser
 */

import { ActionExecuteParams } from './types.js'
import { ChaserError } from './errors.js'

/**
 * Chaser client options
 */
export interface ChaserClientOptions {
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
 * Chaser Client
 *
 * Chaser is an accounts receivable automation software that helps businesses automate invoice reminders and get paid faster.
 */
export class ChaserClient {
  private options: ChaserClientOptions

  /**
   * Action resource
   * Execute Chaser actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: ChaserClientOptions) {
    this.options = {
      baseUrl: 'https://api.chaser.com',
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
      throw ChaserError.fromError(error)
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
      Authorization: 'Basic ' + this.options.apiKey,
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
