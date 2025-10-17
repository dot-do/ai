/**
 * Freshdesk Client
 *
 * Auto-generated Integration client for Freshdesk.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/freshdesk
 */

import { ActionExecuteParams } from './types.js'
import { FreshdeskError } from './errors.js'

/**
 * Freshdesk client options
 */
export interface FreshdeskClientOptions {
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
 * Freshdesk Client
 *
 * Freshdesk provides customer support software with ticketing, knowledge base, and automation features for efficient helpdesk operations and better customer experiences
 */
export class FreshdeskClient {
  private options: FreshdeskClientOptions

  /**
   * Action resource
   * Execute Freshdesk actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: FreshdeskClientOptions) {
    this.options = {
      baseUrl: 'https://api.freshdesk.com',
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
      throw FreshdeskError.fromError(error)
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
