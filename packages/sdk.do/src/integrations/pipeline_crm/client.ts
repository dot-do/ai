/**
 * Pipeline crm Client
 *
 * Auto-generated Integration client for Pipeline crm.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pipeline_crm
 */

import { ActionExecuteParams } from './types.js'
import { PipelineCrmError } from './errors.js'

/**
 * Pipeline crm client options
 */
export interface PipelineCrmClientOptions {
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
 * Pipeline crm Client
 *
 * Pipeline CRM is a sales-focused customer relationship management tool designed to help teams track leads, manage deals, and streamline workflows.
 */
export class PipelineCrmClient {
  private options: PipelineCrmClientOptions

  /**
   * Action resource
   * Execute Pipeline crm actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: PipelineCrmClientOptions) {
    this.options = {
      baseUrl: 'https://api.pipeline_crm.com',
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
      throw PipelineCrmError.fromError(error)
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
