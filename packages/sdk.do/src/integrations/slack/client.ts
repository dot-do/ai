/**
 * Slack Client
 *
 * Auto-generated Integration client for Slack.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/slack
 */

import WebClient from '@slack/web-api'
import {
  MessagePostParams,
  MessageUpdateParams,
  MessageDeleteParams,
  MessageScheduleMessageParams,
  MessageGetPermalinkParams,
  ChannelListParams,
  ChannelGetParams,
  ChannelCreateParams,
  ChannelArchiveParams,
  ChannelUnarchiveParams,
  ChannelInviteParams,
  ChannelKickParams,
  ChannelHistoryParams,
  ChannelRepliesParams,
  ChannelOpenParams,
  UserListParams,
  UserGetParams,
  UserLookupByEmailParams,
  UserSetPresenceParams,
  FileUploadParams,
  FileGetParams,
  FileDeleteParams,
  ReactionAddParams,
  ReactionRemoveParams,
} from './types.js'
import { SlackError } from './errors.js'

/**
 * Slack client options
 */
export interface SlackClientOptions {
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
 * Slack Client
 *
 * Team collaboration and messaging platform
 */
export class SlackClient {
  private options: SlackClientOptions
  private sdk: WebClient

  /**
   * Message resource
   * Send, update, delete, and schedule messages
   */
  public message: {
    /** undefined Message */
    post: (params: MessagePostParams) => Promise<{ channel: string; ts: string; message: object }>
    /** undefined Message */
    update: (params: MessageUpdateParams) => Promise<{ channel: string; ts: string; text: string }>
    /** undefined Message */
    delete: (params: MessageDeleteParams) => Promise<{ ok: boolean }>
    /** undefined Message */
    scheduleMessage: (params: MessageScheduleMessageParams) => Promise<{ scheduled_message_id: string; channel: string; post_at: number }>
    /** undefined Message */
    getPermalink: (params: MessageGetPermalinkParams) => Promise<string>
  }

  /**
   * Channel resource
   * Create, manage, and archive channels
   */
  public channel: {
    /** undefined Channel */
    list: (params: ChannelListParams) => Promise<{ channels: array }>
    /** undefined Channel */
    get: (params: ChannelGetParams) => Promise<{ channel: object }>
    /** undefined Channel */
    create: (params: ChannelCreateParams) => Promise<{ channel: object }>
    /** undefined Channel */
    archive: (params: ChannelArchiveParams) => Promise<{ ok: boolean }>
    /** undefined Channel */
    unarchive: (params: ChannelUnarchiveParams) => Promise<{ ok: boolean }>
    /** undefined Channel */
    invite: (params: ChannelInviteParams) => Promise<{ ok: boolean }>
    /** undefined Channel */
    kick: (params: ChannelKickParams) => Promise<{ ok: boolean }>
    /** undefined Channel */
    history: (params: ChannelHistoryParams) => Promise<{ messages: array }>
    /** undefined Channel */
    replies: (params: ChannelRepliesParams) => Promise<{ messages: array }>
    /** undefined Channel */
    open: (params: ChannelOpenParams) => Promise<{ channel: object }>
  }

  /**
   * User resource
   * Get information about workspace users
   */
  public user: {
    /** undefined User */
    list: (params: UserListParams) => Promise<{ members: array }>
    /** undefined User */
    get: (params: UserGetParams) => Promise<{ user: object }>
    /** undefined User */
    lookupByEmail: (params: UserLookupByEmailParams) => Promise<{ user: object }>
    /** undefined User */
    setPresence: (params: UserSetPresenceParams) => Promise<{ ok: boolean }>
  }

  /**
   * File resource
   * Upload, share, and manage files
   */
  public file: {
    /** undefined File */
    upload: (params: FileUploadParams) => Promise<{ file: object }>
    /** undefined File */
    get: (params: FileGetParams) => Promise<{ file: object }>
    /** undefined File */
    delete: (params: FileDeleteParams) => Promise<{ ok: boolean }>
  }

  /**
   * Reaction resource
   * Add and remove emoji reactions
   */
  public reaction: {
    /** undefined Reaction */
    add: (params: ReactionAddParams) => Promise<{ ok: boolean }>
    /** undefined Reaction */
    remove: (params: ReactionRemoveParams) => Promise<{ ok: boolean }>
  }

  constructor(options: SlackClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new WebClient(this.options.apiKey, {})

    // Initialize resource namespaces
    this.message = {
      post: this.messagePost.bind(this),
      update: this.messageUpdate.bind(this),
      delete: this.messageDelete.bind(this),
      scheduleMessage: this.messageScheduleMessage.bind(this),
      getPermalink: this.messageGetPermalink.bind(this),
    }
    this.channel = {
      list: this.channelList.bind(this),
      get: this.channelGet.bind(this),
      create: this.channelCreate.bind(this),
      archive: this.channelArchive.bind(this),
      unarchive: this.channelUnarchive.bind(this),
      invite: this.channelInvite.bind(this),
      kick: this.channelKick.bind(this),
      history: this.channelHistory.bind(this),
      replies: this.channelReplies.bind(this),
      open: this.channelOpen.bind(this),
    }
    this.user = {
      list: this.userList.bind(this),
      get: this.userGet.bind(this),
      lookupByEmail: this.userLookupByEmail.bind(this),
      setPresence: this.userSetPresence.bind(this),
    }
    this.file = {
      upload: this.fileUpload.bind(this),
      get: this.fileGet.bind(this),
      delete: this.fileDelete.bind(this),
    }
    this.reaction = {
      add: this.reactionAdd.bind(this),
      remove: this.reactionRemove.bind(this),
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns { channel: string, ts: string, message: object }
   */
  private async messagePost(params: MessagePostParams): Promise<{ channel: string; ts: string; message: object }> {
    try {
      const result = await this.sdk.chat.postMessage(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns { channel: string, ts: string, text: string }
   */
  private async messageUpdate(params: MessageUpdateParams): Promise<{ channel: string; ts: string; text: string }> {
    try {
      const result = await this.sdk.chat.update(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns { ok: boolean }
   */
  private async messageDelete(params: MessageDeleteParams): Promise<{ ok: boolean }> {
    try {
      const result = await this.sdk.chat.delete(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns { scheduled_message_id: string, channel: string, post_at: number }
   */
  private async messageScheduleMessage(params: MessageScheduleMessageParams): Promise<{ scheduled_message_id: string; channel: string; post_at: number }> {
    try {
      const result = await this.sdk.chat.scheduleMessage(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns string
   */
  private async messageGetPermalink(params: MessageGetPermalinkParams): Promise<string> {
    try {
      const result = await this.sdk.chat.getPermalink(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns { channels: array }
   */
  private async channelList(params: ChannelListParams): Promise<{ channels: array }> {
    try {
      const result = await this.sdk.conversations.list(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns { channel: object }
   */
  private async channelGet(params: ChannelGetParams): Promise<{ channel: object }> {
    try {
      const result = await this.sdk.conversations.info(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns { channel: object }
   */
  private async channelCreate(params: ChannelCreateParams): Promise<{ channel: object }> {
    try {
      const result = await this.sdk.conversations.create(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns { ok: boolean }
   */
  private async channelArchive(params: ChannelArchiveParams): Promise<{ ok: boolean }> {
    try {
      const result = await this.sdk.conversations.archive(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns { ok: boolean }
   */
  private async channelUnarchive(params: ChannelUnarchiveParams): Promise<{ ok: boolean }> {
    try {
      const result = await this.sdk.conversations.unarchive(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns { ok: boolean }
   */
  private async channelInvite(params: ChannelInviteParams): Promise<{ ok: boolean }> {
    try {
      const result = await this.sdk.conversations.invite(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns { ok: boolean }
   */
  private async channelKick(params: ChannelKickParams): Promise<{ ok: boolean }> {
    try {
      const result = await this.sdk.conversations.kick(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns { messages: array }
   */
  private async channelHistory(params: ChannelHistoryParams): Promise<{ messages: array }> {
    try {
      const result = await this.sdk.conversations.history(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns { messages: array }
   */
  private async channelReplies(params: ChannelRepliesParams): Promise<{ messages: array }> {
    try {
      const result = await this.sdk.conversations.replies(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Channel
   * @param params - Operation parameters
   * @returns { channel: object }
   */
  private async channelOpen(params: ChannelOpenParams): Promise<{ channel: object }> {
    try {
      const result = await this.sdk.conversations.open(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns { members: array }
   */
  private async userList(params: UserListParams): Promise<{ members: array }> {
    try {
      const result = await this.sdk.users.list(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns { user: object }
   */
  private async userGet(params: UserGetParams): Promise<{ user: object }> {
    try {
      const result = await this.sdk.users.info(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns { user: object }
   */
  private async userLookupByEmail(params: UserLookupByEmailParams): Promise<{ user: object }> {
    try {
      const result = await this.sdk.users.lookupByEmail(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns { ok: boolean }
   */
  private async userSetPresence(params: UserSetPresenceParams): Promise<{ ok: boolean }> {
    try {
      const result = await this.sdk.users.setPresence(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined File
   * @param params - Operation parameters
   * @returns { file: object }
   */
  private async fileUpload(params: FileUploadParams): Promise<{ file: object }> {
    try {
      const result = await this.sdk.files.uploadV2(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined File
   * @param params - Operation parameters
   * @returns { file: object }
   */
  private async fileGet(params: FileGetParams): Promise<{ file: object }> {
    try {
      const result = await this.sdk.files.info(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined File
   * @param params - Operation parameters
   * @returns { ok: boolean }
   */
  private async fileDelete(params: FileDeleteParams): Promise<{ ok: boolean }> {
    try {
      const result = await this.sdk.files.delete(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Reaction
   * @param params - Operation parameters
   * @returns { ok: boolean }
   */
  private async reactionAdd(params: ReactionAddParams): Promise<{ ok: boolean }> {
    try {
      const result = await this.sdk.reactions.add(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }

  /**
   * undefined Reaction
   * @param params - Operation parameters
   * @returns { ok: boolean }
   */
  private async reactionRemove(params: ReactionRemoveParams): Promise<{ ok: boolean }> {
    try {
      const result = await this.sdk.reactions.remove(params)
      return result
    } catch (error) {
      throw SlackError.fromError(error)
    }
  }
}
