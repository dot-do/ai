/**
 * ActiveCampaign Client
 *
 * Auto-generated Integration client for ActiveCampaign.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/activecampaign
 */

import {
  ContactCreateParams,
  ContactGetParams,
  ContactUpdateParams,
  ContactDeleteParams,
  ContactListParams,
  CampaignCreateParams,
  CampaignGetParams,
  ListCreateParams,
  ListGetParams,
} from './types.js'
import { ActivecampaignError } from './errors.js'

/**
 * ActiveCampaign client options
 */
export interface ActivecampaignClientOptions {
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
 * ActiveCampaign Client
 *
 * Marketing automation and CRM platform
 */
export class ActivecampaignClient {
  private options: ActivecampaignClientOptions

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

  /**
   * List resource
   * Manage contact lists
   */
  public list: {
    /** undefined List */
    create: (params: ListCreateParams) => Promise<List>
    /** undefined List */
    get: (params: ListGetParams) => Promise<List>
    /** undefined List */
    list: () => Promise<List[]>
  }

  constructor(options: ActivecampaignClientOptions) {
    this.options = {
      baseUrl: 'https://youraccountname.api-us1.com/api/3',
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
    this.list = {
      create: this.listCreate.bind(this),
      get: this.listGet.bind(this),
      list: this.listList.bind(this),
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
      throw ActivecampaignError.fromError(error)
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
      throw ActivecampaignError.fromError(error)
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
      throw ActivecampaignError.fromError(error)
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
      throw ActivecampaignError.fromError(error)
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
      throw ActivecampaignError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns Campaign
   */
  private async campaignCreate(params: CampaignCreateParams): Promise<Campaign> {
    try {
      const response = await this.request('POST', '/campaigns', params)
      return response as Campaign
    } catch (error) {
      throw ActivecampaignError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns Campaign
   */
  private async campaignGet(params: CampaignGetParams): Promise<Campaign> {
    try {
      const response = await this.request('GET', '/campaigns/${params.campaign_id}', params)
      return response as Campaign
    } catch (error) {
      throw ActivecampaignError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @returns Campaign[]
   */
  private async campaignList(): Promise<Campaign[]> {
    try {
      const response = await this.request('GET', '/campaigns', undefined)
      return response as Campaign[]
    } catch (error) {
      throw ActivecampaignError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns List
   */
  private async listCreate(params: ListCreateParams): Promise<List> {
    try {
      const response = await this.request('POST', '/lists', params)
      return response as List
    } catch (error) {
      throw ActivecampaignError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns List
   */
  private async listGet(params: ListGetParams): Promise<List> {
    try {
      const response = await this.request('GET', '/lists/${params.list_id}', params)
      return response as List
    } catch (error) {
      throw ActivecampaignError.fromError(error)
    }
  }

  /**
   * undefined List
   * @returns List[]
   */
  private async listList(): Promise<List[]> {
    try {
      const response = await this.request('GET', '/lists', undefined)
      return response as List[]
    } catch (error) {
      throw ActivecampaignError.fromError(error)
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
      'Api-Token': this.options.apiKey,
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
