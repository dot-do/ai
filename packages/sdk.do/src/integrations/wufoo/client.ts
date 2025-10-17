/**
 * Wufoo Client
 *
 * Auto-generated Integration client for Wufoo.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/wufoo
 */

import { FormGetParams, EntryGetParams, EntryListParams, EntryCreateParams } from './types.js'
import { WufooError } from './errors.js'

/**
 * Wufoo client options
 */
export interface WufooClientOptions {
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
 * Wufoo Client
 *
 * Online form builder and data collection platform
 */
export class WufooClient {
  private options: WufooClientOptions

  /**
   * Form resource
   * Access form definitions
   */
  public form: {
    /** undefined Form */
    get: (params: FormGetParams) => Promise<Form>
    /** undefined Form */
    list: () => Promise<Form[]>
  }

  /**
   * Entry resource
   * Access form submissions
   */
  public entry: {
    /** undefined Entry */
    get: (params: EntryGetParams) => Promise<Entry>
    /** undefined Entry */
    list: (params: EntryListParams) => Promise<Entry[]>
    /** undefined Entry */
    create: (params: EntryCreateParams) => Promise<Entry>
  }

  constructor(options: WufooClientOptions) {
    this.options = {
      baseUrl: 'https://{subdomain}.wufoo.com/api/v3',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize resource namespaces
    this.form = {
      get: this.formGet.bind(this),
      list: this.formList.bind(this),
    }
    this.entry = {
      get: this.entryGet.bind(this),
      list: this.entryList.bind(this),
      create: this.entryCreate.bind(this),
    }
  }

  /**
   * undefined Form
   * @param params - Operation parameters
   * @returns Form
   */
  private async formGet(params: FormGetParams): Promise<Form> {
    try {
      const response = await this.request('GET', '/forms/${params.form_id}', params)
      return response as Form
    } catch (error) {
      throw WufooError.fromError(error)
    }
  }

  /**
   * undefined Form
   * @returns Form[]
   */
  private async formList(): Promise<Form[]> {
    try {
      const response = await this.request('GET', '/forms', undefined)
      return response as Form[]
    } catch (error) {
      throw WufooError.fromError(error)
    }
  }

  /**
   * undefined Entry
   * @param params - Operation parameters
   * @returns Entry
   */
  private async entryGet(params: EntryGetParams): Promise<Entry> {
    try {
      const response = await this.request('GET', '/forms/${params.form_id}/entries/${params.entry_id}', params)
      return response as Entry
    } catch (error) {
      throw WufooError.fromError(error)
    }
  }

  /**
   * undefined Entry
   * @param params - Operation parameters
   * @returns Entry[]
   */
  private async entryList(params: EntryListParams): Promise<Entry[]> {
    try {
      const response = await this.request('GET', '/forms/${params.form_id}/entries', params)
      return response as Entry[]
    } catch (error) {
      throw WufooError.fromError(error)
    }
  }

  /**
   * undefined Entry
   * @param params - Operation parameters
   * @returns Entry
   */
  private async entryCreate(params: EntryCreateParams): Promise<Entry> {
    try {
      const response = await this.request('POST', '/forms/${params.form_id}/entries', params)
      return response as Entry
    } catch (error) {
      throw WufooError.fromError(error)
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
