/**
 * Aero workflow Client
 *
 * Auto-generated Integration client for Aero workflow.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/aero_workflow
 */

import { ActionExecuteParams } from './types.js'
import { AeroWorkflowError } from './errors.js'

/**
 * Aero workflow client options
 */
export interface AeroWorkflowClientOptions {
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
 * Aero workflow Client
 *
 * Aero Workflow is a practice management tool for accounting firms, offering task tracking, time billing, and client collaboration in a centralized workspace
 */
export class AeroWorkflowClient {
  private options: AeroWorkflowClientOptions

  /**
   * Action resource
   * Execute Aero workflow actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: AeroWorkflowClientOptions) {
    this.options = {
      baseUrl: 'https://api.aero_workflow.com',
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
      throw AeroWorkflowError.fromError(error)
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
