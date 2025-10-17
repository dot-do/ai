/**
 * Nano nets Client
 *
 * Auto-generated Integration client for Nano nets.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/nano_nets
 */

import { ActionExecuteParams } from './types.js'
import { NanoNetsError } from './errors.js'

/**
 * Nano nets client options
 */
export interface NanoNetsClientOptions {
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
 * Nano nets Client
 *
 * Nanonets provides an AI-driven Intelligent Document Processing API that transforms unstructured documents into structured data, enabling efficient data extraction and workflow automation.
 */
export class NanoNetsClient {
  private options: NanoNetsClientOptions

  /**
   * Action resource
   * Execute Nano nets actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: NanoNetsClientOptions) {
    this.options = {
      baseUrl: 'https://api.nano_nets.com',
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
      throw NanoNetsError.fromError(error)
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
