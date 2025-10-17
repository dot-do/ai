/**
 * Turbot pipes Client
 *
 * Auto-generated Integration client for Turbot pipes.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/turbot_pipes
 */

import { ActionExecuteParams } from './types.js'
import { TurbotPipesError } from './errors.js'

/**
 * Turbot pipes client options
 */
export interface TurbotPipesClientOptions {
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
 * Turbot pipes Client
 *
 * Turbot Pipes is an intelligence, automation, and security platform built specifically for DevOps, offering hosted Steampipe database instances, shared dashboards, snapshots, and more.
 */
export class TurbotPipesClient {
  private options: TurbotPipesClientOptions

  /**
   * Action resource
   * Execute Turbot pipes actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: TurbotPipesClientOptions) {
    this.options = {
      baseUrl: 'https://api.turbot_pipes.com',
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
      throw TurbotPipesError.fromError(error)
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
