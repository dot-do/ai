/**
 * Sms alert Client
 *
 * Auto-generated Integration client for Sms alert.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sms_alert
 */

import { ActionExecuteParams } from './types.js'
import { SmsAlertError } from './errors.js'

/**
 * Sms alert client options
 */
export interface SmsAlertClientOptions {
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
 * Sms alert Client
 *
 * SMS Alert is a versatile multi-channel communication platform enabling businesses to engage with customers through SMS, RCS, Telegram, and WhatsApp via a unified REST API.
 */
export class SmsAlertClient {
  private options: SmsAlertClientOptions

  /**
   * Action resource
   * Execute Sms alert actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: SmsAlertClientOptions) {
    this.options = {
      baseUrl: 'https://api.sms_alert.com',
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
      throw SmsAlertError.fromError(error)
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
