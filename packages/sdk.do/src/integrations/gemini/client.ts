/**
 * Gemini Client
 *
 * Auto-generated Integration client for Gemini.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gemini
 */

import { ActionExecuteParams } from './types.js'
import { GeminiError } from './errors.js'

/**
 * Gemini client options
 */
export interface GeminiClientOptions {
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
 * Gemini Client
 *
 * Comprehensive Gemini integration supporting Veo 3 video generation, Gemini Flash text generation (Nano Banana), chat completions, and multimodal AI capabilities via the Google Gemini API.
 */
export class GeminiClient {
  private options: GeminiClientOptions

  /**
   * Action resource
   * Execute Gemini actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: GeminiClientOptions) {
    this.options = {
      baseUrl: 'https://api.gemini.com',
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
      throw GeminiError.fromError(error)
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
