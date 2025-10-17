/**
 * D2lbrightspace Client
 *
 * Auto-generated Integration client for D2lbrightspace.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/d2lbrightspace
 */

import { ActionExecuteParams } from './types.js'
import { D2lbrightspaceError } from './errors.js'

/**
 * D2lbrightspace client options
 */
export interface D2lbrightspaceClientOptions {
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
 * D2lbrightspace Client
 *
 * D2L Brightspace is a learning management system that provides a comprehensive suite of tools for educators to create, manage, and deliver online courses and learning experiences.
 */
export class D2lbrightspaceClient {
  private options: D2lbrightspaceClientOptions

  /**
   * Action resource
   * Execute D2lbrightspace actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: D2lbrightspaceClientOptions) {
    this.options = {
      baseUrl: 'https://api.d2lbrightspace.com',
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
      throw D2lbrightspaceError.fromError(error)
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
