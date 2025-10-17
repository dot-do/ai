/**
 * Brilliant directories Client
 *
 * Auto-generated Integration client for Brilliant directories.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/brilliant_directories
 */

import { ActionExecuteParams } from './types.js'
import { BrilliantDirectoriesError } from './errors.js'

/**
 * Brilliant directories client options
 */
export interface BrilliantDirectoriesClientOptions {
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
 * Brilliant directories Client
 *
 * Brilliant Directories is an all-in-one platform that enables users to create and manage online membership communities and business directories.
 */
export class BrilliantDirectoriesClient {
  private options: BrilliantDirectoriesClientOptions

  /**
   * Action resource
   * Execute Brilliant directories actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: BrilliantDirectoriesClientOptions) {
    this.options = {
      baseUrl: 'https://api.brilliant_directories.com',
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
      throw BrilliantDirectoriesError.fromError(error)
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
