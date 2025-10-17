/**
 * Platerecognizer Client
 *
 * Auto-generated Integration client for Platerecognizer.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/platerecognizer
 */

import { ActionExecuteParams } from './types.js'
import { PlaterecognizerError } from './errors.js'

/**
 * Platerecognizer client options
 */
export interface PlaterecognizerClientOptions {
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
 * Platerecognizer Client
 *
 * Plate Recognizer offers Automatic License Plate Recognition (ALPR) solutions for processing images and videos to detect and decode vehicle license plates.
 */
export class PlaterecognizerClient {
  private options: PlaterecognizerClientOptions

  /**
   * Action resource
   * Execute Platerecognizer actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: PlaterecognizerClientOptions) {
    this.options = {
      baseUrl: 'https://api.platerecognizer.com',
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
      throw PlaterecognizerError.fromError(error)
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
