/**
 * Doppler marketing automation Client
 *
 * Auto-generated Integration client for Doppler marketing automation.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/doppler_marketing_automation
 */

import { ActionExecuteParams } from './types.js'
import { DopplerMarketingAutomationError } from './errors.js'

/**
 * Doppler marketing automation client options
 */
export interface DopplerMarketingAutomationClientOptions {
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
 * Doppler marketing automation Client
 *
 * Doppler is a marketing automation platform that enables users to create, send, and analyze email campaigns, manage subscriber lists, and integrate with various tools to enhance marketing efforts.
 */
export class DopplerMarketingAutomationClient {
  private options: DopplerMarketingAutomationClientOptions

  /**
   * Action resource
   * Execute Doppler marketing automation actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: DopplerMarketingAutomationClientOptions) {
    this.options = {
      baseUrl: 'https://api.doppler_marketing_automation.com',
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
      throw DopplerMarketingAutomationError.fromError(error)
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
