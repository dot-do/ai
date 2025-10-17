/**
 * Discord Client
 *
 * Auto-generated Integration client for Discord.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/discord
 */

import Client from 'discord.js'
import {
  MessageSendParams,
  MessageEditParams,
  MessageDeleteParams,
  MessageGetParams,
  ChannelCreateParams,
  ChannelGetParams,
  ChannelUpdateParams,
  ChannelDeleteParams,
  ChannelListParams,
  GuildGetParams,
  GuildUpdateParams,
  MemberGetParams,
  MemberListParams,
  MemberKickParams,
  MemberBanParams,
  RoleCreateParams,
  RoleUpdateParams,
  RoleDeleteParams,
  RoleListParams,
} from './types.js'
import { DiscordError } from './errors.js'

/**
 * Discord client options
 */
export interface DiscordClientOptions {
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
 * Discord Client
 *
 * Voice, video, and text communication platform for communities
 */
export class DiscordClient {
  private options: DiscordClientOptions
  private sdk: Client

  /**
   * Message resource
   * Send, edit, and delete messages in channels
   */
  public message: {
    /** undefined Message */
    send: (params: MessageSendParams) => Promise<Message>
    /** undefined Message */
    edit: (params: MessageEditParams) => Promise<Message>
    /** undefined Message */
    delete: (params: MessageDeleteParams) => Promise<boolean>
    /** undefined Message */
    get: (params: MessageGetParams) => Promise<Message>
  }

  /**
   * Channel resource
   * Manage text, voice, and category channels
   */
  public channel: {
    /** undefined Channel */
    create: (params: ChannelCreateParams) => Promise<Channel>
    /** undefined Channel */
    get: (params: ChannelGetParams) => Promise<Channel>
    /** undefined Channel */
    update: (params: ChannelUpdateParams) => Promise<Channel>
    /** undefined Channel */
    delete: (params: ChannelDeleteParams) => Promise<boolean>
    /** undefined Channel */
    list: (params: ChannelListParams) => Promise<Channel[]>
  }

  /**
   * Guild resource
   * Manage Discord servers (guilds)
   */
  public guild: {
    /** undefined Guild */
    get: (params: GuildGetParams) => Promise<Guild>
    /** undefined Guild */
    list: () => Promise<Guild[]>
    /** undefined Guild */
    update: (params: GuildUpdateParams) => Promise<Guild>
  }

  /**
   * Member resource
   * Manage guild members
   */
  public member: {
    /** undefined Member */
    get: (params: MemberGetParams) => Promise<Member>
    /** undefined Member */
    list: (params: MemberListParams) => Promise<Member[]>
    /** undefined Member */
    kick: (params: MemberKickParams) => Promise<boolean>
    /** undefined Member */
    ban: (params: MemberBanParams) => Promise<boolean>
  }

  /**
   * Role resource
   * Manage guild roles and permissions
   */
  public role: {
    /** undefined Role */
    create: (params: RoleCreateParams) => Promise<Role>
    /** undefined Role */
    update: (params: RoleUpdateParams) => Promise<Role>
    /** undefined Role */
    delete: (params: RoleDeleteParams) => Promise<boolean>
    /** undefined Role */
    list: (params: RoleListParams) => Promise<Role[]>
  }

  constructor(options: DiscordClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Client(this.options.apiKey, {})

    // Initialize resource namespaces
    this.message = {
      send: this.messageSend.bind(this),
      edit: this.messageEdit.bind(this),
      delete: this.messageDelete.bind(this),
      get: this.messageGet.bind(this),
    }
    this.channel = {
      create: this.channelCreate.bind(this),
      get: this.channelGet.bind(this),
      update: this.channelUpdate.bind(this),
      delete: this.channelDelete.bind(this),
      list: this.channelList.bind(this),
    }
    this.guild = {
      get: this.guildGet.bind(this),
      list: this.guildList.bind(this),
      update: this.guildUpdate.bind(this),
    }
    this.member = {
      get: this.memberGet.bind(this),
      list: this.memberList.bind(this),
      kick: this.memberKick.bind(this),
      ban: this.memberBan.bind(this),
    }
    this.role = {
      create: this.roleCreate.bind(this),
      update: this.roleUpdate.bind(this),
      delete: this.roleDelete.bind(this),
      list: this.roleList.bind(this),
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns Message
   */
  private async messageSend(params: MessageSendParams): Promise<Message> {
    try {
      const result = await this.sdk.channels.messages.send(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns Message
   */
  private async messageEdit(params: MessageEditParams): Promise<Message> {
    try {
      const result = await this.sdk.channels.messages.edit(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns boolean
   */
  private async messageDelete(params: MessageDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.channels.messages.delete(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns Message
   */
  private async messageGet(params: MessageGetParams): Promise<Message> {
    try {
      const result = await this.sdk.channels.messages.fetch(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns Channel
   */
  private async channelCreate(params: ChannelCreateParams): Promise<Channel> {
    try {
      const result = await this.sdk.channels.create(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns Channel
   */
  private async channelGet(params: ChannelGetParams): Promise<Channel> {
    try {
      const result = await this.sdk.channels.fetch(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns Channel
   */
  private async channelUpdate(params: ChannelUpdateParams): Promise<Channel> {
    try {
      const result = await this.sdk.channels.edit(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns boolean
   */
  private async channelDelete(params: ChannelDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.channels.delete(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns Channel[]
   */
  private async channelList(params: ChannelListParams): Promise<Channel[]> {
    try {
      const result = await this.sdk.channels.fetch(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Guild
   * @param params - Operation parameters
   * @returns Guild
   */
  private async guildGet(params: GuildGetParams): Promise<Guild> {
    try {
      const result = await this.sdk.guilds.fetch(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Guild
   * @returns Guild[]
   */
  private async guildList(): Promise<Guild[]> {
    try {
      const result = await this.sdk.guilds.fetch()
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Guild
   * @param params - Operation parameters
   * @returns Guild
   */
  private async guildUpdate(params: GuildUpdateParams): Promise<Guild> {
    try {
      const result = await this.sdk.guilds.edit(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns Member
   */
  private async memberGet(params: MemberGetParams): Promise<Member> {
    try {
      const result = await this.sdk.guilds.members.fetch(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns Member[]
   */
  private async memberList(params: MemberListParams): Promise<Member[]> {
    try {
      const result = await this.sdk.guilds.members.fetch(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns boolean
   */
  private async memberKick(params: MemberKickParams): Promise<boolean> {
    try {
      const result = await this.sdk.guilds.members.kick(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns boolean
   */
  private async memberBan(params: MemberBanParams): Promise<boolean> {
    try {
      const result = await this.sdk.guilds.members.ban(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Role
   * @param params - Operation parameters
   * @returns Role
   */
  private async roleCreate(params: RoleCreateParams): Promise<Role> {
    try {
      const result = await this.sdk.guilds.roles.create(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Role
   * @param params - Operation parameters
   * @returns Role
   */
  private async roleUpdate(params: RoleUpdateParams): Promise<Role> {
    try {
      const result = await this.sdk.guilds.roles.edit(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Role
   * @param params - Operation parameters
   * @returns boolean
   */
  private async roleDelete(params: RoleDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.guilds.roles.delete(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }

  /**
   * undefined Role
   * @param params - Operation parameters
   * @returns Role[]
   */
  private async roleList(params: RoleListParams): Promise<Role[]> {
    try {
      const result = await this.sdk.guilds.roles.fetch(params)
      return result
    } catch (error) {
      throw DiscordError.fromError(error)
    }
  }
}
