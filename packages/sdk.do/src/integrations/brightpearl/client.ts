/**
 * Brightpearl Client
 *
 * Auto-generated Integration client for Brightpearl.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/brightpearl
 */

import { ActionExecuteParams } from './types.js'
import { BrightpearlError } from './errors.js'

/**
 * Brightpearl client options
 */
export interface BrightpearlClientOptions {
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
 * Brightpearl Client
 *
 * Brightpearl is a retail operations platform offering inventory management, accounting, CRM, and order fulfillment to help merchants handle multichannel sales more efficiently
 */
export class BrightpearlClient {
  private options: BrightpearlClientOptions

  /**
   * Action resource
   * Execute Brightpearl actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: BrightpearlClientOptions) {
    this.options = {
      baseUrl: 'https://api.brightpearl.com',
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
      throw BrightpearlError.fromError(error)
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
