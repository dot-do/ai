/**
 * Blazemeter Client
 *
 * Auto-generated Integration client for Blazemeter.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/blazemeter
 */

import { ActionExecuteParams } from './types.js'
import { BlazemeterError } from './errors.js'

/**
 * Blazemeter client options
 */
export interface BlazemeterClientOptions {
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
 * Blazemeter Client
 *
 * BlazeMeter is a continuous testing platform that enables users to create, run, and analyze performance and functional tests for web and mobile applications.
 */
export class BlazemeterClient {
  private options: BlazemeterClientOptions

  /**
   * Action resource
   * Execute Blazemeter actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: BlazemeterClientOptions) {
    this.options = {
      baseUrl: 'https://api.blazemeter.com',
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
      throw BlazemeterError.fromError(error)
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
