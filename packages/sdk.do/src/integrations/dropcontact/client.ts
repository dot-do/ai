/**
 * Dropcontact Client
 *
 * Auto-generated Integration client for Dropcontact.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dropcontact
 */

import { ActionExecuteParams } from './types.js'
import { DropcontactError } from './errors.js'

/**
 * Dropcontact client options
 */
export interface DropcontactClientOptions {
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
 * Dropcontact Client
 *
 * Dropcontact is a B2B email finder and data enrichment service that provides verified professional email addresses and enriches contact information.
 */
export class DropcontactClient {
  private options: DropcontactClientOptions

  /**
   * Action resource
   * Execute Dropcontact actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: DropcontactClientOptions) {
    this.options = {
      baseUrl: 'https://api.dropcontact.com',
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
      throw DropcontactError.fromError(error)
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
