/**
 * Codeinterpreter Client
 *
 * Auto-generated Integration client for Codeinterpreter.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/codeinterpreter
 */

import { ActionExecuteParams } from './types.js'
import { CodeinterpreterError } from './errors.js'

/**
 * Codeinterpreter client options
 */
export interface CodeinterpreterClientOptions {
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
 * Codeinterpreter Client
 *
 * CodeInterpreter extends Python-based coding environments with integrated data analysis, enabling developers to run scripts, visualize results, and prototype solutions inside supported platforms
 */
export class CodeinterpreterClient {
  private options: CodeinterpreterClientOptions

  /**
   * Action resource
   * Execute Codeinterpreter actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: CodeinterpreterClientOptions) {
    this.options = {
      baseUrl: 'https://api.codeinterpreter.com',
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
      throw CodeinterpreterError.fromError(error)
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
      Authorization: this.options.apiKey,
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
