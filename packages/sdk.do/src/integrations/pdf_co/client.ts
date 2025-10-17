/**
 * Pdf co Client
 *
 * Auto-generated Integration client for Pdf co.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pdf_co
 */

import { ActionExecuteParams } from './types.js'
import { PdfCoError } from './errors.js'

/**
 * Pdf co client options
 */
export interface PdfCoClientOptions {
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
 * Pdf co Client
 *
 * PDF.co is a secure, cost-effective, and scalable API platform offering a suite of web APIs for tasks such as PDF extraction, generation, editing, splitting, merging, form filling, and barcode processing.
 */
export class PdfCoClient {
  private options: PdfCoClientOptions

  /**
   * Action resource
   * Execute Pdf co actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: PdfCoClientOptions) {
    this.options = {
      baseUrl: 'https://api.pdf_co.com',
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
      throw PdfCoError.fromError(error)
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
