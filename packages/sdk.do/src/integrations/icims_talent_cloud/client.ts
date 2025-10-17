/**
 * Icims talent cloud Client
 *
 * Auto-generated Integration client for Icims talent cloud.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/icims_talent_cloud
 */

import { ActionExecuteParams } from './types.js'
import { IcimsTalentCloudError } from './errors.js'

/**
 * Icims talent cloud client options
 */
export interface IcimsTalentCloudClientOptions {
  /** OAuth2 access token */
  accessToken: string
  /** Base URL override */
  baseUrl?: string
  /** Request timeout in ms */
  timeout?: number
  /** Retry attempts */
  retryAttempts?: number
}

/**
 * Icims talent cloud Client
 *
 * iCIMS Talent Cloud offers applicant tracking, onboarding, and talent management solutions, empowering organizations to streamline hiring and enhance the candidate experience
 */
export class IcimsTalentCloudClient {
  private options: IcimsTalentCloudClientOptions

  /**
   * Action resource
   * Execute Icims talent cloud actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: IcimsTalentCloudClientOptions) {
    this.options = {
      baseUrl: 'https://api.icims_talent_cloud.com',
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
      throw IcimsTalentCloudError.fromError(error)
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
      Authorization: 'Bearer ' + this.options.accessToken,
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
