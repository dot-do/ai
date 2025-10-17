/**
 * Front Types
 *
 * Auto-generated TypeScript types for Front Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/front
 */

/**
 * Front client options
 */
export interface FrontClientOptions {
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
  /** Channel ID */
  channel_id: string
  /** Recipient email addresses */
  to: any[]
  /** Email subject */
  subject?: string
  /** Message body (plain text or HTML) */
  body: string
  /** Plain text version */
  text?: string
  /** File attachments */
  attachments?: any[]
}

/**
 * Parameters for Message.get
 */
export interface MessageGetParams {
  /** Message ID */
  message_id: string
}

/**
 * Parameters for Message.list
 */
export interface MessageListParams {
  /** Conversation ID */
  conversation_id: string
}

/**
 * Conversation resource types
 */
/**
 * Parameters for Conversation.get
 */
export interface ConversationGetParams {
  /** Conversation ID */
  conversation_id: string
}

/**
 * Parameters for Conversation.list
 */
export interface ConversationListParams {
  /** Search query */
  q?: string
  /** Results per page */
  limit?: number
}

/**
 * Parameters for Conversation.update
 */
export interface ConversationUpdateParams {
  /** Conversation ID */
  conversation_id: string
  /** Teammate ID to assign */
  assignee_id?: string
  /** Conversation status (archived, deleted, open, spam) */
  status?: string
  /** Tag IDs to apply */
  tag_ids?: any[]
}

/**
 * Contact resource types
 */
/**
 * Parameters for Contact.create
 */
export interface ContactCreateParams {
  /** Contact name */
  name?: string
  /** Contact handles (email, phone, etc.) */
  handles: any[]
  /** Custom field values */
  custom_fields?: Record<string, any>
}

/**
 * Parameters for Contact.get
 */
export interface ContactGetParams {
  /** Contact ID */
  contact_id: string
}

/**
 * Parameters for Contact.update
 */
export interface ContactUpdateParams {
  /** Contact ID */
  contact_id: string
  /** Updated name */
  name?: string
  /** Updated custom fields */
  custom_fields?: Record<string, any>
}

/**
 * Parameters for Contact.list
 */
export interface ContactListParams {
  /** Search query */
  q?: string
  /** Results per page */
  limit?: number
}

/**
 * Tag resource types
 */
/**
 * Parameters for Tag.create
 */
export interface TagCreateParams {
  /** Tag name */
  name: string
  /** Tag description */
  description?: string
}

/**
 * Parameters for Tag.get
 */
export interface TagGetParams {
  /** Tag ID */
  tag_id: string
}

/**
 * Parameters for Tag.delete
 */
export interface TagDeleteParams {
  /** Tag ID */
  tag_id: string
}

/**
 * Comment resource types
 */
/**
 * Parameters for Comment.create
 */
export interface CommentCreateParams {
  /** Conversation ID */
  conversation_id: string
  /** Comment body */
  body: string
  /** Teammate ID */
  author_id: string
}

/**
 * Parameters for Comment.list
 */
export interface CommentListParams {
  /** Conversation ID */
  conversation_id: string
}
