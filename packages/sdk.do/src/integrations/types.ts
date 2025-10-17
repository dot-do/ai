/**
 * Discord Types
 *
 * Auto-generated TypeScript types for Discord Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/discord
 */

/**
 * Discord client options
 */
export interface DiscordClientOptions {
  /** API key for authentication */
  apiKey: string
  /** Base URL override (optional) */
  baseUrl?: string
  /** Request timeout in milliseconds (optional) */
  timeout?: number
  /** Number of retry attempts (optional) */
  retryAttempts?: number
}

/**
 * Message resource types
 */
/**
 * Parameters for Message.send
 */
export interface MessageSendParams {
  /** Channel ID where message will be sent */
  channelId: string
  /** Message text content */
  content?: string
  /** Rich embed objects for formatted messages */
  embeds?: any[]
  /** Interactive components (buttons, select menus) */
  components?: any[]
  /** File attachments */
  files?: any[]
  /** Message reference for replies */
  reply?: Record<string, any>
  /** Text-to-speech enabled */
  tts?: boolean
}

/**
 * Parameters for Message.edit
 */
export interface MessageEditParams {
  /** Message ID to edit */
  messageId: string
  /** New message content */
  content?: string
  /** Updated embeds */
  embeds?: any[]
  /** Updated components */
  components?: any[]
}

/**
 * Parameters for Message.delete
 */
export interface MessageDeleteParams {
  /** Message ID to delete */
  messageId: string
}

/**
 * Parameters for Message.get
 */
export interface MessageGetParams {
  /** Message ID to retrieve */
  messageId: string
}

/**
 * Channel resource types
 */
/**
 * Parameters for Channel.create
 */
export interface ChannelCreateParams {
  /** Guild (server) ID */
  guildId: string
  /** Channel name (2-100 characters) */
  name: string
  /** Channel type (0=text, 2=voice, 4=category) */
  type?: number
  /** Channel topic (text channels only) */
  topic?: string
  /** Mark channel as NSFW */
  nsfw?: boolean
  /** Parent category ID */
  parentId?: string
}

/**
 * Parameters for Channel.get
 */
export interface ChannelGetParams {
  /** Channel ID */
  channelId: string
}

/**
 * Parameters for Channel.update
 */
export interface ChannelUpdateParams {
  /** Channel ID */
  channelId: string
  /** New channel name */
  name?: string
  /** New channel topic */
  topic?: string
  /** Update NSFW status */
  nsfw?: boolean
}

/**
 * Parameters for Channel.delete
 */
export interface ChannelDeleteParams {
  /** Channel ID */
  channelId: string
}

/**
 * Parameters for Channel.list
 */
export interface ChannelListParams {
  /** Guild (server) ID */
  guildId: string
}

/**
 * Guild resource types
 */
/**
 * Parameters for Guild.get
 */
export interface GuildGetParams {
  /** Guild ID */
  guildId: string
}

/**
 * Parameters for Guild.update
 */
export interface GuildUpdateParams {
  /** Guild ID */
  guildId: string
  /** New guild name */
  name?: string
  /** Base64 encoded icon image */
  icon?: string
  /** Voice region */
  region?: string
}

/**
 * Member resource types
 */
/**
 * Parameters for Member.get
 */
export interface MemberGetParams {
  /** Guild ID */
  guildId: string
  /** User ID */
  userId: string
}

/**
 * Parameters for Member.list
 */
export interface MemberListParams {
  /** Guild ID */
  guildId: string
  /** Max members to return (1-1000) */
  limit?: number
}

/**
 * Parameters for Member.kick
 */
export interface MemberKickParams {
  /** Guild ID */
  guildId: string
  /** User ID to kick */
  userId: string
  /** Reason for kick */
  reason?: string
}

/**
 * Parameters for Member.ban
 */
export interface MemberBanParams {
  /** Guild ID */
  guildId: string
  /** User ID to ban */
  userId: string
  /** Reason for ban */
  reason?: string
  /** Days of message history to delete (0-7) */
  deleteMessageDays?: number
}

/**
 * Role resource types
 */
/**
 * Parameters for Role.create
 */
export interface RoleCreateParams {
  /** Guild ID */
  guildId: string
  /** Role name */
  name: string
  /** Bitwise permission value */
  permissions?: string
  /** RGB color value */
  color?: number
  /** Display separately in member list */
  hoist?: boolean
  /** Allow role to be mentioned */
  mentionable?: boolean
}

/**
 * Parameters for Role.update
 */
export interface RoleUpdateParams {
  /** Role ID */
  roleId: string
  /** New role name */
  name?: string
  /** New permissions */
  permissions?: string
  /** New color */
  color?: number
}

/**
 * Parameters for Role.delete
 */
export interface RoleDeleteParams {
  /** Role ID */
  roleId: string
}

/**
 * Parameters for Role.list
 */
export interface RoleListParams {
  /** Guild ID */
  guildId: string
}

/**
 * SDK type re-exports
 */
export type * from 'discord.js'
