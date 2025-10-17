/**
 * Intercom Types
 *
 * Auto-generated TypeScript types for Intercom Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/intercom
 */

/**
 * Intercom client options
 */
export interface IntercomClientOptions {
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
 * Contact resource types
 */
/**
 * Parameters for Contact.create
 */
export interface ContactCreateParams {
  /** Contact email */
  email?: string
  /** Contact phone number */
  phone?: string
  /** Contact name */
  name?: string
  /** Custom contact attributes */
  custom_attributes?: Record<string, any>
}

/**
 * Parameters for Contact.get
 */
export interface ContactGetParams {
  /** Contact ID */
  id: string
}

/**
 * Parameters for Contact.update
 */
export interface ContactUpdateParams {
  /** Contact ID */
  id: string
  /** Updated email */
  email?: string
  /** Updated name */
  name?: string
  /** Updated custom attributes */
  custom_attributes?: Record<string, any>
}

/**
 * Parameters for Contact.delete
 */
export interface ContactDeleteParams {
  /** Contact ID */
  id: string
}

/**
 * Parameters for Contact.list
 */
export interface ContactListParams {
  /** Results per page */
  per_page?: number
}

/**
 * Conversation resource types
 */
/**
 * Parameters for Conversation.create
 */
export interface ConversationCreateParams {
  /** From user/contact */
  from: Record<string, any>
  /** Message body */
  body: string
}

/**
 * Parameters for Conversation.get
 */
export interface ConversationGetParams {
  /** Conversation ID */
  id: string
}

/**
 * Parameters for Conversation.reply
 */
export interface ConversationReplyParams {
  /** Conversation ID */
  id: string
  /** Message type (comment, note) */
  message_type: string
  /** Reply body */
  body: string
}

/**
 * Parameters for Conversation.list
 */
export interface ConversationListParams {
  /** Results per page */
  per_page?: number
}

/**
 * Message resource types
 */
/**
 * Parameters for Message.create
 */
export interface MessageCreateParams {
  /** Message type (in_app, email) */
  message_type: string
  /** From admin */
  from: Record<string, any>
  /** To user/contact */
  to: Record<string, any>
  /** Message body */
  body: string
  /** Email subject (for email messages) */
  subject?: string
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
}

/**
 * Parameters for Tag.get
 */
export interface TagGetParams {
  /** Tag ID */
  id: string
}

/**
 * Parameters for Tag.delete
 */
export interface TagDeleteParams {
  /** Tag ID */
  id: string
}

/**
 * Article resource types
 */
/**
 * Parameters for Article.create
 */
export interface ArticleCreateParams {
  /** Article title */
  title: string
  /** Article body (HTML) */
  body: string
  /** Author admin ID */
  author_id: string
}

/**
 * Parameters for Article.get
 */
export interface ArticleGetParams {
  /** Article ID */
  id: string
}

/**
 * Parameters for Article.update
 */
export interface ArticleUpdateParams {
  /** Article ID */
  id: string
  /** Updated title */
  title?: string
  /** Updated body */
  body?: string
}

/**
 * Parameters for Article.list
 */
export interface ArticleListParams {
  /** Results per page */
  per_page?: number
}

/**
 * SDK type re-exports
 */
export type * from '@intercom/intercom-node'
