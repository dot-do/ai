/**
 * Ip2proxy Client
 *
 * Auto-generated Integration client for Ip2proxy.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ip2proxy
 */

import { ActionExecuteParams } from './types.js'
import { Ip2proxyError } from './errors.js'

/**
 * Ip2proxy client options
 */
export interface Ip2proxyClientOptions {
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
 * Ip2proxy Client
 *
 * IP2Proxy is a proxy detection web service that identifies anonymous proxies, VPNs, TOR exit nodes, search engine robots, and residential proxies by IP address.
 */
export class Ip2proxyClient {
  private options: Ip2proxyClientOptions

  /**
   * Action resource
   * Execute Ip2proxy actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: Ip2proxyClientOptions) {
    this.options = {
      baseUrl: 'https://api.ip2proxy.com',
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
      throw Ip2proxyError.fromError(error)
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
