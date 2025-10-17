/**
 * Onesignal rest api Client
 *
 * Auto-generated Integration client for Onesignal rest api.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/onesignal_rest_api
 */

import { ActionExecuteParams } from './types.js'
import { OnesignalRestApiError } from './errors.js'

/**
 * Onesignal rest api client options
 */
export interface OnesignalRestApiClientOptions {
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
 * Onesignal rest api Client
 *
 * The OneSignal REST API enables developers to programmatically send push notifications, emails, and SMS, manage users and subscriptions, and configure apps.
 */
export class OnesignalRestApiClient {
  private options: OnesignalRestApiClientOptions

  /**
   * Action resource
   * Execute Onesignal rest api actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: OnesignalRestApiClientOptions) {
    this.options = {
      baseUrl: 'https://api.onesignal_rest_api.com',
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
      throw OnesignalRestApiError.fromError(error)
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
      Authorization: 'Basic ' + this.options.apiKey,
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
