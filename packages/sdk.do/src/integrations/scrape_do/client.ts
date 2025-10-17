/**
 * Scrape do Client
 *
 * Auto-generated Integration client for Scrape do.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/scrape_do
 */

import { ActionExecuteParams } from './types.js'
import { ScrapeDoError } from './errors.js'

/**
 * Scrape do client options
 */
export interface ScrapeDoClientOptions {
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
 * Scrape do Client
 *
 * Scrape.do is a web scraping API offering rotating residential, data-center, and mobile proxies with headless browser support and session management to bypass anti-bot protections (e.g., Cloudflare, Akamai) and extract data at scale in formats like JSON and HTML.
 */
export class ScrapeDoClient {
  private options: ScrapeDoClientOptions

  /**
   * Action resource
   * Execute Scrape do actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: ScrapeDoClientOptions) {
    this.options = {
      baseUrl: 'https://api.scrape_do.com',
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
      throw ScrapeDoError.fromError(error)
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
