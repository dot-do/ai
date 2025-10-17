/**
 * Hackerrank work Client
 *
 * Auto-generated Integration client for Hackerrank work.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/hackerrank_work
 */

import { ActionExecuteParams } from './types.js'
import { HackerrankWorkError } from './errors.js'

/**
 * Hackerrank work client options
 */
export interface HackerrankWorkClientOptions {
  /** Basic auth username */
  username: string
  /** Basic auth password */
  password: string
  /** Base URL override */
  baseUrl?: string
  /** Request timeout in ms */
  timeout?: number
  /** Retry attempts */
  retryAttempts?: number
}

/**
 * Hackerrank work Client
 *
 * HackerRank Work enables coding interviews and technical assessments, providing developers with challenges and real-time collaboration for data-driven hiring decisions
 */
export class HackerrankWorkClient {
  private options: HackerrankWorkClientOptions

  /**
   * Action resource
   * Execute Hackerrank work actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: HackerrankWorkClientOptions) {
    this.options = {
      baseUrl: 'https://api.hackerrank_work.com',
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
      throw HackerrankWorkError.fromError(error)
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
