/**
 * Zendesk Client
 *
 * Auto-generated Integration client for Zendesk.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zendesk
 */

import createClient from 'node-zendesk'
import {
  TicketCreateParams,
  TicketGetParams,
  TicketUpdateParams,
  TicketDeleteParams,
  TicketListParams,
  UserCreateParams,
  UserGetParams,
  UserUpdateParams,
  UserListParams,
  OrganizationCreateParams,
  OrganizationGetParams,
  OrganizationUpdateParams,
  OrganizationListParams,
  CommentListParams,
} from './types.js'
import { ZendeskError } from './errors.js'

/**
 * Zendesk client options
 */
export interface ZendeskClientOptions {
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
 * Zendesk Client
 *
 * Customer support and ticketing platform
 */
export class ZendeskClient {
  private options: ZendeskClientOptions
  private sdk: createClient

  /**
   * Ticket resource
   * Manage support tickets
   */
  public ticket: {
    /** undefined Ticket */
    create: (params: TicketCreateParams) => Promise<Ticket>
    /** undefined Ticket */
    get: (params: TicketGetParams) => Promise<Ticket>
    /** undefined Ticket */
    update: (params: TicketUpdateParams) => Promise<Ticket>
    /** undefined Ticket */
    delete: (params: TicketDeleteParams) => Promise<boolean>
    /** undefined Ticket */
    list: (params: TicketListParams) => Promise<Ticket[]>
  }

  /**
   * User resource
   * Manage users (customers, agents, admins)
   */
  public user: {
    /** undefined User */
    create: (params: UserCreateParams) => Promise<User>
    /** undefined User */
    get: (params: UserGetParams) => Promise<User>
    /** undefined User */
    update: (params: UserUpdateParams) => Promise<User>
    /** undefined User */
    list: (params: UserListParams) => Promise<User[]>
  }

  /**
   * Organization resource
   * Manage customer organizations
   */
  public organization: {
    /** undefined Organization */
    create: (params: OrganizationCreateParams) => Promise<Organization>
    /** undefined Organization */
    get: (params: OrganizationGetParams) => Promise<Organization>
    /** undefined Organization */
    update: (params: OrganizationUpdateParams) => Promise<Organization>
    /** undefined Organization */
    list: (params: OrganizationListParams) => Promise<Organization[]>
  }

  /**
   * Comment resource
   * Manage ticket comments
   */
  public comment: {
    /** undefined Comment */
    list: (params: CommentListParams) => Promise<Comment[]>
  }

  constructor(options: ZendeskClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new createClient(this.options.apiKey, {})

    // Initialize resource namespaces
    this.ticket = {
      create: this.ticketCreate.bind(this),
      get: this.ticketGet.bind(this),
      update: this.ticketUpdate.bind(this),
      delete: this.ticketDelete.bind(this),
      list: this.ticketList.bind(this),
    }
    this.user = {
      create: this.userCreate.bind(this),
      get: this.userGet.bind(this),
      update: this.userUpdate.bind(this),
      list: this.userList.bind(this),
    }
    this.organization = {
      create: this.organizationCreate.bind(this),
      get: this.organizationGet.bind(this),
      update: this.organizationUpdate.bind(this),
      list: this.organizationList.bind(this),
    }
    this.comment = {
      list: this.commentList.bind(this),
    }
  }

  /**
   * undefined Ticket
   * @param params - Operation parameters
   * @returns Ticket
   */
  private async ticketCreate(params: TicketCreateParams): Promise<Ticket> {
    try {
      const result = await this.sdk.tickets.POST(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined Ticket
   * @param params - Operation parameters
   * @returns Ticket
   */
  private async ticketGet(params: TicketGetParams): Promise<Ticket> {
    try {
      const result = await this.sdk.tickets.GET(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined Ticket
   * @param params - Operation parameters
   * @returns Ticket
   */
  private async ticketUpdate(params: TicketUpdateParams): Promise<Ticket> {
    try {
      const result = await this.sdk.tickets.PUT(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined Ticket
   * @param params - Operation parameters
   * @returns boolean
   */
  private async ticketDelete(params: TicketDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.tickets.DELETE(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined Ticket
   * @param params - Operation parameters
   * @returns Ticket[]
   */
  private async ticketList(params: TicketListParams): Promise<Ticket[]> {
    try {
      const result = await this.sdk.tickets.GET(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns User
   */
  private async userCreate(params: UserCreateParams): Promise<User> {
    try {
      const result = await this.sdk.users.POST(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns User
   */
  private async userGet(params: UserGetParams): Promise<User> {
    try {
      const result = await this.sdk.users.GET(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns User
   */
  private async userUpdate(params: UserUpdateParams): Promise<User> {
    try {
      const result = await this.sdk.users.PUT(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns User[]
   */
  private async userList(params: UserListParams): Promise<User[]> {
    try {
      const result = await this.sdk.users.GET(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined Organization
   * @param params - Operation parameters
   * @returns Organization
   */
  private async organizationCreate(params: OrganizationCreateParams): Promise<Organization> {
    try {
      const result = await this.sdk.organizations.POST(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined Organization
   * @param params - Operation parameters
   * @returns Organization
   */
  private async organizationGet(params: OrganizationGetParams): Promise<Organization> {
    try {
      const result = await this.sdk.organizations.GET(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined Organization
   * @param params - Operation parameters
   * @returns Organization
   */
  private async organizationUpdate(params: OrganizationUpdateParams): Promise<Organization> {
    try {
      const result = await this.sdk.organizations.PUT(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined Organization
   * @param params - Operation parameters
   * @returns Organization[]
   */
  private async organizationList(params: OrganizationListParams): Promise<Organization[]> {
    try {
      const result = await this.sdk.organizations.GET(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }

  /**
   * undefined Comment
   * @param params - Operation parameters
   * @returns Comment[]
   */
  private async commentList(params: CommentListParams): Promise<Comment[]> {
    try {
      const result = await this.sdk.comments.GET(params)
      return result
    } catch (error) {
      throw ZendeskError.fromError(error)
    }
  }
}
