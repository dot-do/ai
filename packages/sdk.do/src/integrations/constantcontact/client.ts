/**
 * Constant Contact Client
 *
 * Auto-generated Integration client for Constant Contact.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/constantcontact
 */

import {
  ContactCreateParams,
  ContactGetParams,
  ContactUpdateParams,
  ContactDeleteParams,
  ContactListParams,
  CampaignCreateParams,
  CampaignGetParams,
} from './types.js'
import { ConstantcontactError } from './errors.js'

/**
 * Constant Contact client options
 */
export interface ConstantcontactClientOptions {
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
 * Constant Contact Client
 *
 * Email marketing and campaign management platform
 */
export class ConstantcontactClient {
  private options: ConstantcontactClientOptions

  /**
   * Contact resource
   * Manage email contacts
   */
  public contact: {
    /** undefined Contact */
    create: (params: ContactCreateParams) => Promise<Contact>
    /** undefined Contact */
    get: (params: ContactGetParams) => Promise<Contact>
    /** undefined Contact */
    update: (params: ContactUpdateParams) => Promise<Contact>
    /** undefined Contact */
    delete: (params: ContactDeleteParams) => Promise<boolean>
    /** undefined Contact */
    list: (params: ContactListParams) => Promise<Contact[]>
  }

  /**
   * Campaign resource
   * Manage email campaigns
   */
  public campaign: {
    /** undefined Campaign */
    create: (params: CampaignCreateParams) => Promise<Campaign>
    /** undefined Campaign */
    get: (params: CampaignGetParams) => Promise<Campaign>
    /** undefined Campaign */
    list: () => Promise<Campaign[]>
  }

  constructor(options: ConstantcontactClientOptions) {
    this.options = {
      baseUrl: 'https://api.cc.email/v3',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize resource namespaces
    this.contact = {
      create: this.contactCreate.bind(this),
      get: this.contactGet.bind(this),
      update: this.contactUpdate.bind(this),
      delete: this.contactDelete.bind(this),
      list: this.contactList.bind(this),
    }
    this.campaign = {
      create: this.campaignCreate.bind(this),
      get: this.campaignGet.bind(this),
      list: this.campaignList.bind(this),
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact
   */
  private async contactCreate(params: ContactCreateParams): Promise<Contact> {
    try {
      const response = await this.request('POST', '/contacts', params)
      return response as Contact
    } catch (error) {
      throw ConstantcontactError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact
   */
  private async contactGet(params: ContactGetParams): Promise<Contact> {
    try {
      const response = await this.request('GET', '/contacts/${params.contact_id}', params)
      return response as Contact
    } catch (error) {
      throw ConstantcontactError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact
   */
  private async contactUpdate(params: ContactUpdateParams): Promise<Contact> {
    try {
      const response = await this.request('PUT', '/contacts/${params.contact_id}', params)
      return response as Contact
    } catch (error) {
      throw ConstantcontactError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns boolean
   */
  private async contactDelete(params: ContactDeleteParams): Promise<boolean> {
    try {
      const response = await this.request('DELETE', '/contacts/${params.contact_id}', params)
      return response as boolean
    } catch (error) {
      throw ConstantcontactError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact[]
   */
  private async contactList(params: ContactListParams): Promise<Contact[]> {
    try {
      const response = await this.request('GET', '/contacts', params)
      return response as Contact[]
    } catch (error) {
      throw ConstantcontactError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns Campaign
   */
  private async campaignCreate(params: CampaignCreateParams): Promise<Campaign> {
    try {
      const response = await this.request('POST', '/emails', params)
      return response as Campaign
    } catch (error) {
      throw ConstantcontactError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns Campaign
   */
  private async campaignGet(params: CampaignGetParams): Promise<Campaign> {
    try {
      const response = await this.request('GET', '/emails/${params.campaign_id}', params)
      return response as Campaign
    } catch (error) {
      throw ConstantcontactError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @returns Campaign[]
   */
  private async campaignList(): Promise<Campaign[]> {
    try {
      const response = await this.request('GET', '/emails', undefined)
      return response as Campaign[]
    } catch (error) {
      throw ConstantcontactError.fromError(error)
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
