/**
 * Guru Client
 *
 * Auto-generated Integration client for Guru.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/guru
 */

import { ActionExecuteParams } from './types.js'
import { GuruError } from './errors.js'

/**
 * Guru client options
 */
export interface GuruClientOptions {
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
 * Guru Client
 *
 * Guru is a knowledge management solution that captures, organizes, and shares company information, enabling teams to access expert-verified insights and reduce repetitive questions
 */
export class GuruClient {
  private options: GuruClientOptions

  /**
   * Action resource
   * Execute Guru actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: GuruClientOptions) {
    this.options = {
      baseUrl: 'https://api.guru.com',
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
      throw GuruError.fromError(error)
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
