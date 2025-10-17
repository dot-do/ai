/**
 * Help Scout Types
 *
 * Auto-generated TypeScript types for Help Scout Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/helpscout
 */

/**
 * Help Scout client options
 */
export interface HelpscoutClientOptions {
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
 * Conversation resource types
 */
/**
 * Parameters for Conversation.create
 */
export interface ConversationCreateParams {
  /** Conversation subject */
  subject: string
  /** Conversation type (email, chat, phone) */
  type: string
  /** Mailbox ID */
  mailboxId: number
  /** Customer object */
  customer: Record<string, any>
  /** Initial thread(s) */
  threads: any[]
  /** Conversation status (active, pending, closed) */
  status?: string
}

/**
 * Parameters for Conversation.get
 */
export interface ConversationGetParams {
  /** Conversation ID */
  id: number
}

/**
 * Parameters for Conversation.list
 */
export interface ConversationListParams {
  /** Filter by mailbox ID */
  mailbox?: number
  /** Filter by status */
  status?: string
  /** Page number */
  page?: number
}

/**
 * Parameters for Conversation.update
 */
export interface ConversationUpdateParams {
  /** Conversation ID */
  id: number
  /** Updated status */
  status?: string
  /** Updated subject */
  subject?: string
}

/**
 * Customer resource types
 */
/**
 * Parameters for Customer.create
 */
export interface CustomerCreateParams {
  /** Customer first name */
  firstName: string
  /** Customer last name */
  lastName?: string
  /** Email addresses */
  emails: any[]
  /** Phone numbers */
  phones?: any[]
}

/**
 * Parameters for Customer.get
 */
export interface CustomerGetParams {
  /** Customer ID */
  id: number
}

/**
 * Parameters for Customer.update
 */
export interface CustomerUpdateParams {
  /** Customer ID */
  id: number
  /** Updated first name */
  firstName?: string
  /** Updated last name */
  lastName?: string
}

/**
 * Parameters for Customer.list
 */
export interface CustomerListParams {
  /** Search query */
  query?: string
  /** Page number */
  page?: number
}

/**
 * Mailbox resource types
 */
/**
 * Parameters for Mailbox.get
 */
export interface MailboxGetParams {
  /** Mailbox ID */
  id: number
}

/**
 * Parameters for Mailbox.list
 */
export interface MailboxListParams {
  /** Page number */
  page?: number
}

/**
 * Tag resource types
 */
/**
 * Parameters for Tag.list
 */
export interface TagListParams {
  /** Page number */
  page?: number
}
