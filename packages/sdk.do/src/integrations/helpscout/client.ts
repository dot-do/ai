/**
 * Help Scout Client
 *
 * Auto-generated Integration client for Help Scout.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/helpscout
 */

import {
  ConversationCreateParams,
  ConversationGetParams,
  ConversationListParams,
  ConversationUpdateParams,
  CustomerCreateParams,
  CustomerGetParams,
  CustomerUpdateParams,
  CustomerListParams,
  MailboxGetParams,
  MailboxListParams,
  TagListParams,
} from './types.js'
import { HelpscoutError } from './errors.js'

/**
 * Help Scout client options
 */
export interface HelpscoutClientOptions {
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
 * Help Scout Client
 *
 * Customer support platform with shared inbox and knowledge base
 */
export class HelpscoutClient {
  private options: HelpscoutClientOptions

  /**
   * Conversation resource
   * Manage customer conversations
   */
  public conversation: {
    /** undefined Conversation */
    create: (params: ConversationCreateParams) => Promise<Conversation>
    /** undefined Conversation */
    get: (params: ConversationGetParams) => Promise<Conversation>
    /** undefined Conversation */
    list: (params: ConversationListParams) => Promise<Conversation[]>
    /** undefined Conversation */
    update: (params: ConversationUpdateParams) => Promise<Conversation>
  }

  /**
   * Customer resource
   * Manage customer profiles
   */
  public customer: {
    /** undefined Customer */
    create: (params: CustomerCreateParams) => Promise<Customer>
    /** undefined Customer */
    get: (params: CustomerGetParams) => Promise<Customer>
    /** undefined Customer */
    update: (params: CustomerUpdateParams) => Promise<Customer>
    /** undefined Customer */
    list: (params: CustomerListParams) => Promise<Customer[]>
  }

  /**
   * Mailbox resource
   * Manage mailboxes
   */
  public mailbox: {
    /** undefined Mailbox */
    get: (params: MailboxGetParams) => Promise<Mailbox>
    /** undefined Mailbox */
    list: (params: MailboxListParams) => Promise<Mailbox[]>
  }

  /**
   * Tag resource
   * Manage conversation tags
   */
  public tag: {
    /** undefined Tag */
    list: (params: TagListParams) => Promise<Tag[]>
  }

  constructor(options: HelpscoutClientOptions) {
    this.options = {
      baseUrl: 'https://api.helpscout.net/v2',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize resource namespaces
    this.conversation = {
      create: this.conversationCreate.bind(this),
      get: this.conversationGet.bind(this),
      list: this.conversationList.bind(this),
      update: this.conversationUpdate.bind(this),
    }
    this.customer = {
      create: this.customerCreate.bind(this),
      get: this.customerGet.bind(this),
      update: this.customerUpdate.bind(this),
      list: this.customerList.bind(this),
    }
    this.mailbox = {
      get: this.mailboxGet.bind(this),
      list: this.mailboxList.bind(this),
    }
    this.tag = {
      list: this.tagList.bind(this),
    }
  }

  /**
   * undefined Conversation
   * @param params - Operation parameters
   * @returns Conversation
   */
  private async conversationCreate(params: ConversationCreateParams): Promise<Conversation> {
    try {
      const response = await this.request('POST', '/conversations', params)
      return response as Conversation
    } catch (error) {
      throw HelpscoutError.fromError(error)
    }
  }

  /**
   * undefined Conversation
   * @param params - Operation parameters
   * @returns Conversation
   */
  private async conversationGet(params: ConversationGetParams): Promise<Conversation> {
    try {
      const response = await this.request('GET', '/conversations/${params.id}', params)
      return response as Conversation
    } catch (error) {
      throw HelpscoutError.fromError(error)
    }
  }

  /**
   * undefined Conversation
   * @param params - Operation parameters
   * @returns Conversation[]
   */
  private async conversationList(params: ConversationListParams): Promise<Conversation[]> {
    try {
      const response = await this.request('GET', '/conversations', params)
      return response as Conversation[]
    } catch (error) {
      throw HelpscoutError.fromError(error)
    }
  }

  /**
   * undefined Conversation
   * @param params - Operation parameters
   * @returns Conversation
   */
  private async conversationUpdate(params: ConversationUpdateParams): Promise<Conversation> {
    try {
      const response = await this.request('PATCH', '/conversations/${params.id}', params)
      return response as Conversation
    } catch (error) {
      throw HelpscoutError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Customer
   */
  private async customerCreate(params: CustomerCreateParams): Promise<Customer> {
    try {
      const response = await this.request('POST', '/customers', params)
      return response as Customer
    } catch (error) {
      throw HelpscoutError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Customer
   */
  private async customerGet(params: CustomerGetParams): Promise<Customer> {
    try {
      const response = await this.request('GET', '/customers/${params.id}', params)
      return response as Customer
    } catch (error) {
      throw HelpscoutError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Customer
   */
  private async customerUpdate(params: CustomerUpdateParams): Promise<Customer> {
    try {
      const response = await this.request('PUT', '/customers/${params.id}', params)
      return response as Customer
    } catch (error) {
      throw HelpscoutError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Customer[]
   */
  private async customerList(params: CustomerListParams): Promise<Customer[]> {
    try {
      const response = await this.request('GET', '/customers', params)
      return response as Customer[]
    } catch (error) {
      throw HelpscoutError.fromError(error)
    }
  }

  /**
   * undefined Mailbox
   * @param params - Operation parameters
   * @returns Mailbox
   */
  private async mailboxGet(params: MailboxGetParams): Promise<Mailbox> {
    try {
      const response = await this.request('GET', '/mailboxes/${params.id}', params)
      return response as Mailbox
    } catch (error) {
      throw HelpscoutError.fromError(error)
    }
  }

  /**
   * undefined Mailbox
   * @param params - Operation parameters
   * @returns Mailbox[]
   */
  private async mailboxList(params: MailboxListParams): Promise<Mailbox[]> {
    try {
      const response = await this.request('GET', '/mailboxes', params)
      return response as Mailbox[]
    } catch (error) {
      throw HelpscoutError.fromError(error)
    }
  }

  /**
   * undefined Tag
   * @param params - Operation parameters
   * @returns Tag[]
   */
  private async tagList(params: TagListParams): Promise<Tag[]> {
    try {
      const response = await this.request('GET', '/tags', params)
      return response as Tag[]
    } catch (error) {
      throw HelpscoutError.fromError(error)
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
