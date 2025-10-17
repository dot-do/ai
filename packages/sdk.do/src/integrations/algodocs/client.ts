/**
 * Algodocs Client
 *
 * Auto-generated Integration client for Algodocs.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/algodocs
 */

import { ActionExecuteParams } from './types.js'
import { AlgodocsError } from './errors.js'

/**
 * Algodocs client options
 */
export interface AlgodocsClientOptions {
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
 * Algodocs Client
 *
 * AlgoDocs is an AI-powered platform that automates data extraction from business documents, offering fast, secure, and accurate processing without the need for templates or training.
 */
export class AlgodocsClient {
  private options: AlgodocsClientOptions

  /**
   * Action resource
   * Execute Algodocs actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: AlgodocsClientOptions) {
    this.options = {
      baseUrl: 'https://api.algodocs.com',
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
      throw AlgodocsError.fromError(error)
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
