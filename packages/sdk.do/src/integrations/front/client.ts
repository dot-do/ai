/**
 * Front Client
 *
 * Auto-generated Integration client for Front.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/front
 */

import {
  MessageSendParams,
  MessageGetParams,
  MessageListParams,
  ConversationGetParams,
  ConversationListParams,
  ConversationUpdateParams,
  ContactCreateParams,
  ContactGetParams,
  ContactUpdateParams,
  ContactListParams,
  TagCreateParams,
  TagGetParams,
  TagDeleteParams,
  CommentCreateParams,
  CommentListParams,
} from './types.js'
import { FrontError } from './errors.js'

/**
 * Front client options
 */
export interface FrontClientOptions {
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
 * Front Client
 *
 * Customer communication hub for teams managing shared inboxes
 */
export class FrontClient {
  private options: FrontClientOptions

  /**
   * Message resource
   * Send and manage messages in conversations
   */
  public message: {
    /** undefined Message */
    send: (params: MessageSendParams) => Promise<Message>
    /** undefined Message */
    get: (params: MessageGetParams) => Promise<Message>
    /** undefined Message */
    list: (params: MessageListParams) => Promise<Message[]>
  }

  /**
   * Conversation resource
   * Manage customer conversations
   */
  public conversation: {
    /** undefined Conversation */
    get: (params: ConversationGetParams) => Promise<Conversation>
    /** undefined Conversation */
    list: (params: ConversationListParams) => Promise<Conversation[]>
    /** undefined Conversation */
    update: (params: ConversationUpdateParams) => Promise<Conversation>
  }

  /**
   * Contact resource
   * Manage customer contacts
   */
  public contact: {
    /** undefined Contact */
    create: (params: ContactCreateParams) => Promise<Contact>
    /** undefined Contact */
    get: (params: ContactGetParams) => Promise<Contact>
    /** undefined Contact */
    update: (params: ContactUpdateParams) => Promise<Contact>
    /** undefined Contact */
    list: (params: ContactListParams) => Promise<Contact[]>
  }

  /**
   * Tag resource
   * Manage conversation tags
   */
  public tag: {
    /** undefined Tag */
    create: (params: TagCreateParams) => Promise<Tag>
    /** undefined Tag */
    get: (params: TagGetParams) => Promise<Tag>
    /** undefined Tag */
    list: () => Promise<Tag[]>
    /** undefined Tag */
    delete: (params: TagDeleteParams) => Promise<boolean>
  }

  /**
   * Comment resource
   * Add comments to conversations
   */
  public comment: {
    /** undefined Comment */
    create: (params: CommentCreateParams) => Promise<Comment>
    /** undefined Comment */
    list: (params: CommentListParams) => Promise<Comment[]>
  }

  constructor(options: FrontClientOptions) {
    this.options = {
      baseUrl: 'https://api2.frontapp.com',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize resource namespaces
    this.message = {
      send: this.messageSend.bind(this),
      get: this.messageGet.bind(this),
      list: this.messageList.bind(this),
    }
    this.conversation = {
      get: this.conversationGet.bind(this),
      list: this.conversationList.bind(this),
      update: this.conversationUpdate.bind(this),
    }
    this.contact = {
      create: this.contactCreate.bind(this),
      get: this.contactGet.bind(this),
      update: this.contactUpdate.bind(this),
      list: this.contactList.bind(this),
    }
    this.tag = {
      create: this.tagCreate.bind(this),
      get: this.tagGet.bind(this),
      list: this.tagList.bind(this),
      delete: this.tagDelete.bind(this),
    }
    this.comment = {
      create: this.commentCreate.bind(this),
      list: this.commentList.bind(this),
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns Message
   */
  private async messageSend(params: MessageSendParams): Promise<Message> {
    try {
      const response = await this.request('POST', '/channels/${params.channel_id}/messages', params)
      return response as Message
    } catch (error) {
      throw FrontError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns Message
   */
  private async messageGet(params: MessageGetParams): Promise<Message> {
    try {
      const response = await this.request('GET', '/messages/${params.message_id}', params)
      return response as Message
    } catch (error) {
      throw FrontError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns Message[]
   */
  private async messageList(params: MessageListParams): Promise<Message[]> {
    try {
      const response = await this.request('GET', '/conversations/${params.conversation_id}/messages', params)
      return response as Message[]
    } catch (error) {
      throw FrontError.fromError(error)
    }
  }

  /**
   * undefined Conversation
   * @param params - Operation parameters
   * @returns Conversation
   */
  private async conversationGet(params: ConversationGetParams): Promise<Conversation> {
    try {
      const response = await this.request('GET', '/conversations/${params.conversation_id}', params)
      return response as Conversation
    } catch (error) {
      throw FrontError.fromError(error)
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
      throw FrontError.fromError(error)
    }
  }

  /**
   * undefined Conversation
   * @param params - Operation parameters
   * @returns Conversation
   */
  private async conversationUpdate(params: ConversationUpdateParams): Promise<Conversation> {
    try {
      const response = await this.request('PATCH', '/conversations/${params.conversation_id}', params)
      return response as Conversation
    } catch (error) {
      throw FrontError.fromError(error)
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
      throw FrontError.fromError(error)
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
      throw FrontError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact
   */
  private async contactUpdate(params: ContactUpdateParams): Promise<Contact> {
    try {
      const response = await this.request('PATCH', '/contacts/${params.contact_id}', params)
      return response as Contact
    } catch (error) {
      throw FrontError.fromError(error)
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
      throw FrontError.fromError(error)
    }
  }

  /**
   * undefined Tag
   * @param params - Operation parameters
   * @returns Tag
   */
  private async tagCreate(params: TagCreateParams): Promise<Tag> {
    try {
      const response = await this.request('POST', '/tags', params)
      return response as Tag
    } catch (error) {
      throw FrontError.fromError(error)
    }
  }

  /**
   * undefined Tag
   * @param params - Operation parameters
   * @returns Tag
   */
  private async tagGet(params: TagGetParams): Promise<Tag> {
    try {
      const response = await this.request('GET', '/tags/${params.tag_id}', params)
      return response as Tag
    } catch (error) {
      throw FrontError.fromError(error)
    }
  }

  /**
   * undefined Tag
   * @returns Tag[]
   */
  private async tagList(): Promise<Tag[]> {
    try {
      const response = await this.request('GET', '/tags', undefined)
      return response as Tag[]
    } catch (error) {
      throw FrontError.fromError(error)
    }
  }

  /**
   * undefined Tag
   * @param params - Operation parameters
   * @returns boolean
   */
  private async tagDelete(params: TagDeleteParams): Promise<boolean> {
    try {
      const response = await this.request('DELETE', '/tags/${params.tag_id}', params)
      return response as boolean
    } catch (error) {
      throw FrontError.fromError(error)
    }
  }

  /**
   * undefined Comment
   * @param params - Operation parameters
   * @returns Comment
   */
  private async commentCreate(params: CommentCreateParams): Promise<Comment> {
    try {
      const response = await this.request('POST', '/conversations/${params.conversation_id}/comments', params)
      return response as Comment
    } catch (error) {
      throw FrontError.fromError(error)
    }
  }

  /**
   * undefined Comment
   * @param params - Operation parameters
   * @returns Comment[]
   */
  private async commentList(params: CommentListParams): Promise<Comment[]> {
    try {
      const response = await this.request('GET', '/conversations/${params.conversation_id}/comments', params)
      return response as Comment[]
    } catch (error) {
      throw FrontError.fromError(error)
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
