/**
 * Ashby Client
 *
 * Auto-generated Integration client for Ashby.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ashby
 */

import { ActionExecuteParams } from './types.js'
import { AshbyError } from './errors.js'

/**
 * Ashby client options
 */
export interface AshbyClientOptions {
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
 * Ashby Client
 *
 * Ashby delivers an applicant tracking system for modern teams, offering features like job postings, candidate management, and data-driven hiring insights to streamline the recruitment process
 */
export class AshbyClient {
  private options: AshbyClientOptions

  /**
   * Action resource
   * Execute Ashby actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: AshbyClientOptions) {
    this.options = {
      baseUrl: 'https://api.ashby.com',
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
      throw AshbyError.fromError(error)
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
