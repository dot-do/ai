/**
 * Lever sandbox Client
 *
 * Auto-generated Integration client for Lever sandbox.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/lever_sandbox
 */

import { ActionExecuteParams } from './types.js'
import { LeverSandboxError } from './errors.js'

/**
 * Lever sandbox client options
 */
export interface LeverSandboxClientOptions {
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
 * Lever sandbox Client
 *
 * Lever Sandbox is a test environment for Lever's ATS, allowing organizations to experiment with configurations, workflows, and integrations without affecting production data
 */
export class LeverSandboxClient {
  private options: LeverSandboxClientOptions

  /**
   * Action resource
   * Execute Lever sandbox actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: LeverSandboxClientOptions) {
    this.options = {
      baseUrl: 'https://api.lever_sandbox.com',
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
      throw LeverSandboxError.fromError(error)
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
