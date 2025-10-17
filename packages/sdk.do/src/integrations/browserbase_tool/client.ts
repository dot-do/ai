/**
 * Browserbase tool Client
 *
 * Auto-generated Integration client for Browserbase tool.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/browserbase_tool
 */

import { ActionExecuteParams } from './types.js'
import { BrowserbaseToolError } from './errors.js'

/**
 * Browserbase tool client options
 */
export interface BrowserbaseToolClientOptions {
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
 * Browserbase tool Client
 *
 * Browserbase is a serverless platform that enables developers to run, manage, and monitor headless browsers at scale, offering seamless integration with tools like Playwright, Puppeteer, and Selenium.
 */
export class BrowserbaseToolClient {
  private options: BrowserbaseToolClientOptions

  /**
   * Action resource
   * Execute Browserbase tool actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: BrowserbaseToolClientOptions) {
    this.options = {
      baseUrl: 'https://api.browserbase_tool.com',
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
      throw BrowserbaseToolError.fromError(error)
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
