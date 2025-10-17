/**
 * Slack Types
 *
 * Auto-generated TypeScript types for Slack Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/slack
 */

/**
 * Slack client options
 */
export interface SlackClientOptions {
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
 * Parameters for Message.post
 */
export interface MessagePostParams {
  /** Channel ID or name (e.g., C1234567890 or */
  channel: string
  /** Message text (required for fallback) */
  text: string
  /** Block Kit blocks for rich formatting */
  blocks?: any[]
  /** Legacy attachments */
  attachments?: any[]
  /** Thread timestamp to reply in a thread */
  thread_ts?: string
  /** Reply to thread and broadcast to channel */
  reply_broadcast?: boolean
  /** Custom username to display */
  username?: string
  /** Emoji to use as the icon */
  icon_emoji?: string
  /** URL to an image for the icon */
  icon_url?: string
  /** Message metadata for app features */
  metadata?: Record<string, any>
}

/**
 * Parameters for Message.update
 */
export interface MessageUpdateParams {
  /** Channel ID */
  channel: string
  /** Message timestamp */
  ts: string
  /** New message text */
  text: string
  /** Updated blocks */
  blocks?: any[]
  /** Updated attachments */
  attachments?: any[]
}

/**
 * Parameters for Message.delete
 */
export interface MessageDeleteParams {
  /** Channel ID */
  channel: string
  /** Message timestamp */
  ts: string
}

/**
 * Parameters for Message.scheduleMessage
 */
export interface MessageScheduleMessageParams {
  /** Channel ID */
  channel: string
  /** Message text */
  text: string
  /** Unix timestamp when to post */
  post_at: number
  /** Block Kit blocks */
  blocks?: any[]
  /** Thread timestamp */
  thread_ts?: string
}

/**
 * Parameters for Message.getPermalink
 */
export interface MessageGetPermalinkParams {
  /** Channel ID */
  channel: string
  /** Message timestamp */
  message_ts: string
}

/**
 * Channel resource types
 */
/**
 * Parameters for Channel.list
 */
export interface ChannelListParams {
  /** Maximum number of channels to return */
  limit?: number
  /** Pagination cursor */
  cursor?: string
  /** Exclude archived channels */
  exclude_archived?: boolean
  /** Comma-separated list of types (public_channel, private_channel, mpim, im) */
  types?: string
}

/**
 * Parameters for Channel.get
 */
export interface ChannelGetParams {
  /** Channel ID */
  channel: string
}

/**
 * Parameters for Channel.create
 */
export interface ChannelCreateParams {
  /** Channel name (lowercase, no spaces, max 80 chars) */
  name: string
  /** Create a private channel */
  is_private?: boolean
  /** Team ID for Enterprise Grid */
  team_id?: string
}

/**
 * Parameters for Channel.archive
 */
export interface ChannelArchiveParams {
  /** Channel ID */
  channel: string
}

/**
 * Parameters for Channel.unarchive
 */
export interface ChannelUnarchiveParams {
  /** Channel ID */
  channel: string
}

/**
 * Parameters for Channel.invite
 */
export interface ChannelInviteParams {
  /** Channel ID */
  channel: string
  /** Comma-separated user IDs */
  users: string
}

/**
 * Parameters for Channel.kick
 */
export interface ChannelKickParams {
  /** Channel ID */
  channel: string
  /** User ID to remove */
  user: string
}

/**
 * Parameters for Channel.history
 */
export interface ChannelHistoryParams {
  /** Channel ID */
  channel: string
  /** End of time range (timestamp) */
  latest?: string
  /** Start of time range (timestamp) */
  oldest?: string
  /** Number of messages to return */
  limit?: number
  /** Pagination cursor */
  cursor?: string
}

/**
 * Parameters for Channel.replies
 */
export interface ChannelRepliesParams {
  /** Channel ID */
  channel: string
  /** Thread parent message timestamp */
  ts: string
}

/**
 * Parameters for Channel.open
 */
export interface ChannelOpenParams {
  /** Comma-separated user IDs */
  users: string
}

/**
 * User resource types
 */
/**
 * Parameters for User.list
 */
export interface UserListParams {
  /** Maximum number of users to return */
  limit?: number
  /** Pagination cursor */
  cursor?: string
  /** Team ID for Enterprise Grid */
  team_id?: string
  /** Include locale information */
  include_locale?: boolean
}

/**
 * Parameters for User.get
 */
export interface UserGetParams {
  /** User ID */
  user: string
}

/**
 * Parameters for User.lookupByEmail
 */
export interface UserLookupByEmailParams {
  /** User email address */
  email: string
}

/**
 * Parameters for User.setPresence
 */
export interface UserSetPresenceParams {
  /** Presence status (auto or away) */
  presence: 'auto' | 'away'
}

/**
 * File resource types
 */
/**
 * Parameters for File.upload
 */
export interface FileUploadParams {
  /** File content */
  content?: any
  /** File path (alternative to content) */
  file?: string
  /** Filename */
  filename?: string
  /** File type identifier */
  filetype?: string
  /** Title of the file */
  title?: string
  /** Initial comment */
  initial_comment?: string
  /** Channel to share the file in */
  channel_id?: string
  /** Thread timestamp */
  thread_ts?: string
}

/**
 * Parameters for File.get
 */
export interface FileGetParams {
  /** File ID */
  file: string
}

/**
 * Parameters for File.delete
 */
export interface FileDeleteParams {
  /** File ID */
  file: string
}

/**
 * Reaction resource types
 */
/**
 * Parameters for Reaction.add
 */
export interface ReactionAddParams {
  /** Channel ID */
  channel: string
  /** Message timestamp */
  timestamp: string
  /** Emoji name (without colons, e.g., thumbsup) */
  name: string
}

/**
 * Parameters for Reaction.remove
 */
export interface ReactionRemoveParams {
  /** Channel ID */
  channel: string
  /** Message timestamp */
  timestamp: string
  /** Emoji name (without colons, e.g., thumbsup) */
  name: string
}

/**
 * SDK type re-exports
 */
export type * from '@slack/web-api'
