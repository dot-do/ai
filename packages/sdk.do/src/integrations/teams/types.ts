/**
 * Microsoft Teams Types
 *
 * Auto-generated TypeScript types for Microsoft Teams Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/teams
 */

/**
 * Microsoft Teams client options
 */
export interface TeamsClientOptions {
  /** OAuth2 access token */
  accessToken: string
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
  /** Team ID */
  teamId: string
  /** Channel ID */
  channelId: string
  /** Message body with content and contentType */
  body: Record<string, any>
  /** Message attachments */
  attachments?: any[]
  /** User mentions */
  mentions?: any[]
}

/**
 * Parameters for Message.get
 */
export interface MessageGetParams {
  /** Team ID */
  teamId: string
  /** Channel ID */
  channelId: string
  /** Message ID */
  messageId: string
}

/**
 * Parameters for Message.list
 */
export interface MessageListParams {
  /** Team ID */
  teamId: string
  /** Channel ID */
  channelId: string
  /** Number of messages to return */
  top?: number
}

/**
 * Parameters for Message.update
 */
export interface MessageUpdateParams {
  /** Team ID */
  teamId: string
  /** Channel ID */
  channelId: string
  /** Message ID */
  messageId: string
  /** Updated message body */
  body: Record<string, any>
}

/**
 * Channel resource types
 */
/**
 * Parameters for Channel.create
 */
export interface ChannelCreateParams {
  /** Team ID */
  teamId: string
  /** Channel display name */
  displayName: string
  /** Channel description */
  description?: string
  /** Channel type (standard or private) */
  membershipType?: string
}

/**
 * Parameters for Channel.get
 */
export interface ChannelGetParams {
  /** Team ID */
  teamId: string
  /** Channel ID */
  channelId: string
}

/**
 * Parameters for Channel.list
 */
export interface ChannelListParams {
  /** Team ID */
  teamId: string
}

/**
 * Parameters for Channel.update
 */
export interface ChannelUpdateParams {
  /** Team ID */
  teamId: string
  /** Channel ID */
  channelId: string
  /** New display name */
  displayName?: string
  /** New description */
  description?: string
}

/**
 * Parameters for Channel.delete
 */
export interface ChannelDeleteParams {
  /** Team ID */
  teamId: string
  /** Channel ID */
  channelId: string
}

/**
 * Team resource types
 */
/**
 * Parameters for Team.create
 */
export interface TeamCreateParams {
  /** Team display name */
  displayName: string
  /** Team description */
  description?: string
  /** Team visibility (public or private) */
  visibility?: string
}

/**
 * Parameters for Team.get
 */
export interface TeamGetParams {
  /** Team ID */
  teamId: string
}

/**
 * Parameters for Team.update
 */
export interface TeamUpdateParams {
  /** Team ID */
  teamId: string
  /** New display name */
  displayName?: string
  /** New description */
  description?: string
}

/**
 * Member resource types
 */
/**
 * Parameters for Member.add
 */
export interface MemberAddParams {
  /** Team ID */
  teamId: string
  /** User ID to add */
  userId: string
  /** Member roles */
  roles?: any[]
}

/**
 * Parameters for Member.get
 */
export interface MemberGetParams {
  /** Team ID */
  teamId: string
  /** Membership ID */
  membershipId: string
}

/**
 * Parameters for Member.list
 */
export interface MemberListParams {
  /** Team ID */
  teamId: string
}

/**
 * Parameters for Member.remove
 */
export interface MemberRemoveParams {
  /** Team ID */
  teamId: string
  /** Membership ID */
  membershipId: string
}

/**
 * SDK type re-exports
 */
export type * from '@microsoft/microsoft-graph-client'
