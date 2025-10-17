/**
 * Netsuite Client
 *
 * Auto-generated Integration client for Netsuite.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/netsuite
 */

import { ActionExecuteParams } from './types.js'
import { NetsuiteError } from './errors.js'

/**
 * Netsuite client options
 */
export interface NetsuiteClientOptions {
  /** OAuth2 access token */
  accessToken: string
  /** Base URL override */
  baseUrl?: string
  /** Request timeout in ms */
  timeout?: number
  /** Retry attempts */
  retryAttempts?: number
}

/**
 * Netsuite Client
 *
 * NetSuite by Oracle is a cloud-based ERP suite that combines accounting, CRM, e-commerce, and inventory management for comprehensive business oversight
 */
export class NetsuiteClient {
  private options: NetsuiteClientOptions

  /**
   * Action resource
   * Execute Netsuite actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: NetsuiteClientOptions) {
    this.options = {
      baseUrl: 'https://api.netsuite.com',
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
      throw NetsuiteError.fromError(error)
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
      Authorization: 'Bearer ' + this.options.accessToken,
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
