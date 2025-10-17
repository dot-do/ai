/**
 * Census bureau Client
 *
 * Auto-generated Integration client for Census bureau.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/census_bureau
 */

import { ActionExecuteParams } from './types.js'
import { CensusBureauError } from './errors.js'

/**
 * Census bureau client options
 */
export interface CensusBureauClientOptions {
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
 * Census bureau Client
 *
 * The Census Bureau Data API provides developers with access to a wide range of statistical data collected by the U.S. Census Bureau, facilitating integration into applications and data visualizations.
 */
export class CensusBureauClient {
  private options: CensusBureauClientOptions

  /**
   * Action resource
   * Execute Census bureau actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: CensusBureauClientOptions) {
    this.options = {
      baseUrl: 'https://api.census_bureau.com',
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
      throw CensusBureauError.fromError(error)
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
      Authorization: 'Bearer ' + this.options.apiKey,
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
