/**
 * Google cloud vision Client
 *
 * Auto-generated Integration client for Google cloud vision.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google_cloud_vision
 */

import { ActionExecuteParams } from './types.js'
import { GoogleCloudVisionError } from './errors.js'

/**
 * Google cloud vision client options
 */
export interface GoogleCloudVisionClientOptions {
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
 * Google cloud vision Client
 *
 * Google Cloud Vision API enables developers to integrate vision detection features into applications, including image labeling, face and landmark detection, optical character recognition (OCR), and explicit content tagging.
 */
export class GoogleCloudVisionClient {
  private options: GoogleCloudVisionClientOptions

  /**
   * Action resource
   * Execute Google cloud vision actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: GoogleCloudVisionClientOptions) {
    this.options = {
      baseUrl: 'https://api.google_cloud_vision.com',
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
      throw GoogleCloudVisionError.fromError(error)
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
