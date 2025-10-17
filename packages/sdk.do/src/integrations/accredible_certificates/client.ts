/**
 * Accredible certificates Client
 *
 * Auto-generated Integration client for Accredible certificates.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/accredible_certificates
 */

import { ActionExecuteParams } from './types.js'
import { AccredibleCertificatesError } from './errors.js'

/**
 * Accredible certificates client options
 */
export interface AccredibleCertificatesClientOptions {
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
 * Accredible certificates Client
 *
 * Accredible Certificates is a platform that enables organizations to create, manage, and distribute digital certificates, open badges, and blockchain credentials.
 */
export class AccredibleCertificatesClient {
  private options: AccredibleCertificatesClientOptions

  /**
   * Action resource
   * Execute Accredible certificates actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: AccredibleCertificatesClientOptions) {
    this.options = {
      baseUrl: 'https://api.accredible_certificates.com',
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
      throw AccredibleCertificatesError.fromError(error)
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
