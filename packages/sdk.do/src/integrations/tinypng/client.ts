/**
 * Tinypng Client
 *
 * Auto-generated Integration client for Tinypng.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/tinypng
 */

import { ActionExecuteParams } from './types.js'
import { TinypngError } from './errors.js'

/**
 * Tinypng client options
 */
export interface TinypngClientOptions {
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
 * Tinypng Client
 *
 * TinyPNG uses smart lossy compression techniques to reduce the file size of your WebP, JPEG, and PNG files.
 */
export class TinypngClient {
  private options: TinypngClientOptions

  /**
   * Action resource
   * Execute Tinypng actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: TinypngClientOptions) {
    this.options = {
      baseUrl: 'https://api.tinypng.com',
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
      throw TinypngError.fromError(error)
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
