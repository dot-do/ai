/**
 * Google Analytics Client
 *
 * Auto-generated Integration client for Google Analytics.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/googleanalytics
 */

import { ReportGetParams, PropertyListParams } from './types.js'
import { GoogleanalyticsError } from './errors.js'

/**
 * Google Analytics client options
 */
export interface GoogleanalyticsClientOptions {
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
 * Google Analytics Client
 *
 * Web analytics and reporting platform
 */
export class GoogleanalyticsClient {
  private options: GoogleanalyticsClientOptions

  /**
   * Report resource
   * Access analytics reports
   */
  public report: {
    /** undefined Report */
    get: (params: ReportGetParams) => Promise<Report>
  }

  /**
   * Account resource
   * Access account information
   */
  public account: {
    /** undefined Account */
    list: () => Promise<Account[]>
  }

  /**
   * Property resource
   * Access property information
   */
  public property: {
    /** undefined Property */
    list: (params: PropertyListParams) => Promise<Property[]>
  }

  constructor(options: GoogleanalyticsClientOptions) {
    this.options = {
      baseUrl: 'https://analyticsreporting.googleapis.com/v4',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize resource namespaces
    this.report = {
      get: this.reportGet.bind(this),
    }
    this.account = {
      list: this.accountList.bind(this),
    }
    this.property = {
      list: this.propertyList.bind(this),
    }
  }

  /**
   * undefined Report
   * @param params - Operation parameters
   * @returns Report
   */
  private async reportGet(params: ReportGetParams): Promise<Report> {
    try {
      const response = await this.request('POST', '/reports:batchGet', params)
      return response as Report
    } catch (error) {
      throw GoogleanalyticsError.fromError(error)
    }
  }

  /**
   * undefined Account
   * @returns Account[]
   */
  private async accountList(): Promise<Account[]> {
    try {
      const response = await this.request('GET', '/management/accounts', undefined)
      return response as Account[]
    } catch (error) {
      throw GoogleanalyticsError.fromError(error)
    }
  }

  /**
   * undefined Property
   * @param params - Operation parameters
   * @returns Property[]
   */
  private async propertyList(params: PropertyListParams): Promise<Property[]> {
    try {
      const response = await this.request('GET', '/management/accounts/${params.account_id}/webproperties', params)
      return response as Property[]
    } catch (error) {
      throw GoogleanalyticsError.fromError(error)
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
