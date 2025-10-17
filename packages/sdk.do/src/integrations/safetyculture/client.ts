/**
 * Safetyculture Client
 *
 * Auto-generated Integration client for Safetyculture.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/safetyculture
 */

import { ActionExecuteParams } from './types.js'
import { SafetycultureError } from './errors.js'

/**
 * Safetyculture client options
 */
export interface SafetycultureClientOptions {
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
 * Safetyculture Client
 *
 * SafetyCulture is a platform that empowers teams to improve workplace safety, quality, and efficiency through digital inspections and audits.
 */
export class SafetycultureClient {
  private options: SafetycultureClientOptions

  /**
   * Action resource
   * Execute Safetyculture actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: SafetycultureClientOptions) {
    this.options = {
      baseUrl: 'https://api.safetyculture.com',
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
      throw SafetycultureError.fromError(error)
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
