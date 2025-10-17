/**
 * Labs64 netlicensing Client
 *
 * Auto-generated Integration client for Labs64 netlicensing.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/labs64_netlicensing
 */

import { ActionExecuteParams } from './types.js'
import { Labs64NetlicensingError } from './errors.js'

/**
 * Labs64 netlicensing client options
 */
export interface Labs64NetlicensingClientOptions {
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
 * Labs64 netlicensing Client
 *
 * Labs64 NetLicensing is a license management software designed to help software vendors and developers efficiently manage their software licenses and distribution.
 */
export class Labs64NetlicensingClient {
  private options: Labs64NetlicensingClientOptions

  /**
   * Action resource
   * Execute Labs64 netlicensing actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: Labs64NetlicensingClientOptions) {
    this.options = {
      baseUrl: 'https://api.labs64_netlicensing.com',
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
      throw Labs64NetlicensingError.fromError(error)
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
