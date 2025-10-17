/**
 * Api2pdf Client
 *
 * Auto-generated Integration client for Api2pdf.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/api2pdf
 */

import { ActionExecuteParams } from './types.js'
import { Api2pdfError } from './errors.js'

/**
 * Api2pdf client options
 */
export interface Api2pdfClientOptions {
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
 * Api2pdf Client
 *
 * Api2Pdf is a REST API that enables developers to generate PDFs from HTML, URLs, and various document formats using engines like wkhtmltopdf, Headless Chrome, and LibreOffice.
 */
export class Api2pdfClient {
  private options: Api2pdfClientOptions

  /**
   * Action resource
   * Execute Api2pdf actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: Api2pdfClientOptions) {
    this.options = {
      baseUrl: 'https://api.api2pdf.com',
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
      throw Api2pdfError.fromError(error)
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
