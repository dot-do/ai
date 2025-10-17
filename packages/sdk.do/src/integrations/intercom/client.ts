/**
 * Intercom Client
 *
 * Auto-generated Integration client for Intercom.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/intercom
 */

import Client from '@intercom/intercom-node'
import {
  ContactCreateParams,
  ContactGetParams,
  ContactUpdateParams,
  ContactDeleteParams,
  ContactListParams,
  ConversationCreateParams,
  ConversationGetParams,
  ConversationReplyParams,
  ConversationListParams,
  MessageCreateParams,
  TagCreateParams,
  TagGetParams,
  TagDeleteParams,
  ArticleCreateParams,
  ArticleGetParams,
  ArticleUpdateParams,
  ArticleListParams,
} from './types.js'
import { IntercomError } from './errors.js'

/**
 * Intercom client options
 */
export interface IntercomClientOptions {
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
 * Intercom Client
 *
 * Customer messaging platform for sales, marketing, and support
 */
export class IntercomClient {
  private options: IntercomClientOptions
  private sdk: Client

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
    delete: (params: ContactDeleteParams) => Promise<boolean>
    /** undefined Contact */
    list: (params: ContactListParams) => Promise<Contact[]>
  }

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
    reply: (params: ConversationReplyParams) => Promise<Conversation>
    /** undefined Conversation */
    list: (params: ConversationListParams) => Promise<Conversation[]>
  }

  /**
   * Message resource
   * Send messages to contacts
   */
  public message: {
    /** undefined Message */
    create: (params: MessageCreateParams) => Promise<Message>
  }

  /**
   * Tag resource
   * Manage conversation and contact tags
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
   * Article resource
   * Manage help center articles
   */
  public article: {
    /** undefined Article */
    create: (params: ArticleCreateParams) => Promise<Article>
    /** undefined Article */
    get: (params: ArticleGetParams) => Promise<Article>
    /** undefined Article */
    update: (params: ArticleUpdateParams) => Promise<Article>
    /** undefined Article */
    list: (params: ArticleListParams) => Promise<Article[]>
  }

  constructor(options: IntercomClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Client(this.options.apiKey, {})

    // Initialize resource namespaces
    this.contact = {
      create: this.contactCreate.bind(this),
      get: this.contactGet.bind(this),
      update: this.contactUpdate.bind(this),
      delete: this.contactDelete.bind(this),
      list: this.contactList.bind(this),
    }
    this.conversation = {
      create: this.conversationCreate.bind(this),
      get: this.conversationGet.bind(this),
      reply: this.conversationReply.bind(this),
      list: this.conversationList.bind(this),
    }
    this.message = {
      create: this.messageCreate.bind(this),
    }
    this.tag = {
      create: this.tagCreate.bind(this),
      get: this.tagGet.bind(this),
      list: this.tagList.bind(this),
      delete: this.tagDelete.bind(this),
    }
    this.article = {
      create: this.articleCreate.bind(this),
      get: this.articleGet.bind(this),
      update: this.articleUpdate.bind(this),
      list: this.articleList.bind(this),
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact
   */
  private async contactCreate(params: ContactCreateParams): Promise<Contact> {
    try {
      const result = await this.sdk.contacts.create(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact
   */
  private async contactGet(params: ContactGetParams): Promise<Contact> {
    try {
      const result = await this.sdk.contacts.find(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact
   */
  private async contactUpdate(params: ContactUpdateParams): Promise<Contact> {
    try {
      const result = await this.sdk.contacts.update(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns boolean
   */
  private async contactDelete(params: ContactDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.contacts.delete(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact[]
   */
  private async contactList(params: ContactListParams): Promise<Contact[]> {
    try {
      const result = await this.sdk.contacts.list(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Conversation
   * @param params - Operation parameters
   * @returns Conversation
   */
  private async conversationCreate(params: ConversationCreateParams): Promise<Conversation> {
    try {
      const result = await this.sdk.conversations.create(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Conversation
   * @param params - Operation parameters
   * @returns Conversation
   */
  private async conversationGet(params: ConversationGetParams): Promise<Conversation> {
    try {
      const result = await this.sdk.conversations.find(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Conversation
   * @param params - Operation parameters
   * @returns Conversation
   */
  private async conversationReply(params: ConversationReplyParams): Promise<Conversation> {
    try {
      const result = await this.sdk.conversations.reply(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Conversation
   * @param params - Operation parameters
   * @returns Conversation[]
   */
  private async conversationList(params: ConversationListParams): Promise<Conversation[]> {
    try {
      const result = await this.sdk.conversations.list(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns Message
   */
  private async messageCreate(params: MessageCreateParams): Promise<Message> {
    try {
      const result = await this.sdk.messages.create(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Tag
   * @param params - Operation parameters
   * @returns Tag
   */
  private async tagCreate(params: TagCreateParams): Promise<Tag> {
    try {
      const result = await this.sdk.tags.create(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Tag
   * @param params - Operation parameters
   * @returns Tag
   */
  private async tagGet(params: TagGetParams): Promise<Tag> {
    try {
      const result = await this.sdk.tags.find(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Tag
   * @returns Tag[]
   */
  private async tagList(): Promise<Tag[]> {
    try {
      const result = await this.sdk.tags.list()
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Tag
   * @param params - Operation parameters
   * @returns boolean
   */
  private async tagDelete(params: TagDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.tags.delete(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Article
   * @param params - Operation parameters
   * @returns Article
   */
  private async articleCreate(params: ArticleCreateParams): Promise<Article> {
    try {
      const result = await this.sdk.articles.create(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Article
   * @param params - Operation parameters
   * @returns Article
   */
  private async articleGet(params: ArticleGetParams): Promise<Article> {
    try {
      const result = await this.sdk.articles.find(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Article
   * @param params - Operation parameters
   * @returns Article
   */
  private async articleUpdate(params: ArticleUpdateParams): Promise<Article> {
    try {
      const result = await this.sdk.articles.update(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }

  /**
   * undefined Article
   * @param params - Operation parameters
   * @returns Article[]
   */
  private async articleList(params: ArticleListParams): Promise<Article[]> {
    try {
      const result = await this.sdk.articles.list(params)
      return result
    } catch (error) {
      throw IntercomError.fromError(error)
    }
  }
}
