/**
 * Agencyzoom Client
 *
 * Auto-generated Integration client for Agencyzoom.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/agencyzoom
 */

import { ActionExecuteParams } from './types.js'
import { AgencyzoomError } from './errors.js'

/**
 * Agencyzoom client options
 */
export interface AgencyzoomClientOptions {
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
 * Agencyzoom Client
 *
 * AgencyZoom is for the P&C insurance agent that's looking to increase sales, boost retention and analyze agency & producer performance.
 */
export class AgencyzoomClient {
  private options: AgencyzoomClientOptions

  /**
   * Action resource
   * Execute Agencyzoom actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: AgencyzoomClientOptions) {
    this.options = {
      baseUrl: 'https://api.agencyzoom.com',
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
      throw AgencyzoomError.fromError(error)
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
      Authorization: this.options.apiKey,
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
