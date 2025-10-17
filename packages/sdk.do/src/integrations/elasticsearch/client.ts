/**
 * Elasticsearch Client
 *
 * Auto-generated Integration client for Elasticsearch.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/elasticsearch
 */

import { ActionExecuteParams } from './types.js'
import { ElasticsearchError } from './errors.js'

/**
 * Elasticsearch client options
 */
export interface ElasticsearchClientOptions {
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
 * Elasticsearch Client
 *
 * Elasticsearch is a distributed, RESTful search and analytics engine capable of addressing a growing number of use cases. It provides real-time search and analytics for all types of data.
 */
export class ElasticsearchClient {
  private options: ElasticsearchClientOptions

  /**
   * Action resource
   * Execute Elasticsearch actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: ElasticsearchClientOptions) {
    this.options = {
      baseUrl: 'https://api.elasticsearch.com',
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
      throw ElasticsearchError.fromError(error)
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
