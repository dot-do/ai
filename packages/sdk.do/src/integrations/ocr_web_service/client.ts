/**
 * Ocr web service Client
 *
 * Auto-generated Integration client for Ocr web service.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ocr_web_service
 */

import { ActionExecuteParams } from './types.js'
import { OcrWebServiceError } from './errors.js'

/**
 * Ocr web service client options
 */
export interface OcrWebServiceClientOptions {
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
 * Ocr web service Client
 *
 * OCR Web Service provides SOAP and REST APIs for integrating Optical Character Recognition (OCR) technology into software products, mobile devices, or other web services.
 */
export class OcrWebServiceClient {
  private options: OcrWebServiceClientOptions

  /**
   * Action resource
   * Execute Ocr web service actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: OcrWebServiceClientOptions) {
    this.options = {
      baseUrl: 'https://api.ocr_web_service.com',
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
      throw OcrWebServiceError.fromError(error)
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
