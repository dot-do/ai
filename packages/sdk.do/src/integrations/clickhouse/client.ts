/**
 * Clickhouse Client
 *
 * Auto-generated Integration client for Clickhouse.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/clickhouse
 */

import { ActionExecuteParams } from './types.js'
import { ClickhouseError } from './errors.js'

/**
 * Clickhouse client options
 */
export interface ClickhouseClientOptions {
  /** Basic auth username */
  username: string
  /** Basic auth password */
  password: string
  /** Base URL override */
  baseUrl?: string
  /** Request timeout in ms */
  timeout?: number
  /** Retry attempts */
  retryAttempts?: number
}

/**
 * Clickhouse Client
 *
 * ClickHouse is a fast open-source column-oriented database management system for real-time analytics and big data processing with SQL support
 */
export class ClickhouseClient {
  private options: ClickhouseClientOptions

  /**
   * Action resource
   * Execute Clickhouse actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: ClickhouseClientOptions) {
    this.options = {
      baseUrl: 'https://api.clickhouse.com',
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
      throw ClickhouseError.fromError(error)
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
