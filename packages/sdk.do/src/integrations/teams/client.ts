/**
 * Microsoft Teams Client
 *
 * Auto-generated Integration client for Microsoft Teams.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/teams
 */

import Client from '@microsoft/microsoft-graph-client'
import {
  MessageSendParams,
  MessageGetParams,
  MessageListParams,
  MessageUpdateParams,
  ChannelCreateParams,
  ChannelGetParams,
  ChannelListParams,
  ChannelUpdateParams,
  ChannelDeleteParams,
  TeamCreateParams,
  TeamGetParams,
  TeamUpdateParams,
  MemberAddParams,
  MemberGetParams,
  MemberListParams,
  MemberRemoveParams,
} from './types.js'
import { TeamsError } from './errors.js'

/**
 * Microsoft Teams client options
 */
export interface TeamsClientOptions {
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
 * Microsoft Teams Client
 *
 * Business communication and collaboration platform integrated with Microsoft 365
 */
export class TeamsClient {
  private options: TeamsClientOptions
  private sdk: Client

  /**
   * Message resource
   * Send and manage messages in channels
   */
  public message: {
    /** undefined Message */
    send: (params: MessageSendParams) => Promise<Message>
    /** undefined Message */
    get: (params: MessageGetParams) => Promise<Message>
    /** undefined Message */
    list: (params: MessageListParams) => Promise<Message[]>
    /** undefined Message */
    update: (params: MessageUpdateParams) => Promise<Message>
  }

  /**
   * Channel resource
   * Manage team channels
   */
  public channel: {
    /** undefined Channel */
    create: (params: ChannelCreateParams) => Promise<Channel>
    /** undefined Channel */
    get: (params: ChannelGetParams) => Promise<Channel>
    /** undefined Channel */
    list: (params: ChannelListParams) => Promise<Channel[]>
    /** undefined Channel */
    update: (params: ChannelUpdateParams) => Promise<Channel>
    /** undefined Channel */
    delete: (params: ChannelDeleteParams) => Promise<boolean>
  }

  /**
   * Team resource
   * Manage Microsoft Teams
   */
  public team: {
    /** undefined Team */
    create: (params: TeamCreateParams) => Promise<Team>
    /** undefined Team */
    get: (params: TeamGetParams) => Promise<Team>
    /** undefined Team */
    list: () => Promise<Team[]>
    /** undefined Team */
    update: (params: TeamUpdateParams) => Promise<Team>
  }

  /**
   * Member resource
   * Manage team members
   */
  public member: {
    /** undefined Member */
    add: (params: MemberAddParams) => Promise<Member>
    /** undefined Member */
    get: (params: MemberGetParams) => Promise<Member>
    /** undefined Member */
    list: (params: MemberListParams) => Promise<Member[]>
    /** undefined Member */
    remove: (params: MemberRemoveParams) => Promise<boolean>
  }

  constructor(options: TeamsClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Client({
      accessToken: this.options.accessToken,
    })

    // Initialize resource namespaces
    this.message = {
      send: this.messageSend.bind(this),
      get: this.messageGet.bind(this),
      list: this.messageList.bind(this),
      update: this.messageUpdate.bind(this),
    }
    this.channel = {
      create: this.channelCreate.bind(this),
      get: this.channelGet.bind(this),
      list: this.channelList.bind(this),
      update: this.channelUpdate.bind(this),
      delete: this.channelDelete.bind(this),
    }
    this.team = {
      create: this.teamCreate.bind(this),
      get: this.teamGet.bind(this),
      list: this.teamList.bind(this),
      update: this.teamUpdate.bind(this),
    }
    this.member = {
      add: this.memberAdd.bind(this),
      get: this.memberGet.bind(this),
      list: this.memberList.bind(this),
      remove: this.memberRemove.bind(this),
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns Message
   */
  private async messageSend(params: MessageSendParams): Promise<Message> {
    try {
      const result = (await this.sdk.teams) / { teamId } / channels / { channelId } / messages.post(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns Message
   */
  private async messageGet(params: MessageGetParams): Promise<Message> {
    try {
      const result = (await this.sdk.teams) / { teamId } / channels / { channelId } / messages.get(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns Message[]
   */
  private async messageList(params: MessageListParams): Promise<Message[]> {
    try {
      const result = (await this.sdk.teams) / { teamId } / channels / { channelId } / messages.get(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns Message
   */
  private async messageUpdate(params: MessageUpdateParams): Promise<Message> {
    try {
      const result = (await this.sdk.teams) / { teamId } / channels / { channelId } / messages.patch(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns Channel
   */
  private async channelCreate(params: ChannelCreateParams): Promise<Channel> {
    try {
      const result = (await this.sdk.teams) / { teamId } / channels.post(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns Channel
   */
  private async channelGet(params: ChannelGetParams): Promise<Channel> {
    try {
      const result = (await this.sdk.teams) / { teamId } / channels.get(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns Channel[]
   */
  private async channelList(params: ChannelListParams): Promise<Channel[]> {
    try {
      const result = (await this.sdk.teams) / { teamId } / channels.get(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns Channel
   */
  private async channelUpdate(params: ChannelUpdateParams): Promise<Channel> {
    try {
      const result = (await this.sdk.teams) / { teamId } / channels.patch(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns boolean
   */
  private async channelDelete(params: ChannelDeleteParams): Promise<boolean> {
    try {
      const result = (await this.sdk.teams) / { teamId } / channels.delete(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Team
   * @param params - Operation parameters
   * @returns Team
   */
  private async teamCreate(params: TeamCreateParams): Promise<Team> {
    try {
      const result = await this.sdk.teams.post(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Team
   * @param params - Operation parameters
   * @returns Team
   */
  private async teamGet(params: TeamGetParams): Promise<Team> {
    try {
      const result = await this.sdk.teams.get(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Team
   * @returns Team[]
   */
  private async teamList(): Promise<Team[]> {
    try {
      const result = await this.sdk.teams.get()
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Team
   * @param params - Operation parameters
   * @returns Team
   */
  private async teamUpdate(params: TeamUpdateParams): Promise<Team> {
    try {
      const result = await this.sdk.teams.patch(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns Member
   */
  private async memberAdd(params: MemberAddParams): Promise<Member> {
    try {
      const result = (await this.sdk.teams) / { teamId } / members.post(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns Member
   */
  private async memberGet(params: MemberGetParams): Promise<Member> {
    try {
      const result = (await this.sdk.teams) / { teamId } / members.get(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns Member[]
   */
  private async memberList(params: MemberListParams): Promise<Member[]> {
    try {
      const result = (await this.sdk.teams) / { teamId } / members.get(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns boolean
   */
  private async memberRemove(params: MemberRemoveParams): Promise<boolean> {
    try {
      const result = (await this.sdk.teams) / { teamId } / members.delete(params)
      return result
    } catch (error) {
      throw TeamsError.fromError(error)
    }
  }
}
