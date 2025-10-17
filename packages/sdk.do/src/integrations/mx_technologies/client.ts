/**
 * Mx technologies Client
 *
 * Auto-generated Integration client for Mx technologies.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mx_technologies
 */

import { ActionExecuteParams } from './types.js'
import { MxTechnologiesError } from './errors.js'

/**
 * Mx technologies client options
 */
export interface MxTechnologiesClientOptions {
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
 * Mx technologies Client
 *
 * MX Technologies provides a comprehensive API platform for aggregating and enhancing financial data, enabling seamless connections to numerous financial institutions.
 */
export class MxTechnologiesClient {
  private options: MxTechnologiesClientOptions

  /**
   * Action resource
   * Execute Mx technologies actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: MxTechnologiesClientOptions) {
    this.options = {
      baseUrl: 'https://api.mx_technologies.com',
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
      throw MxTechnologiesError.fromError(error)
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
