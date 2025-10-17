/**
 * Zendesk Types
 *
 * Auto-generated TypeScript types for Zendesk Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zendesk
 */

/**
 * Zendesk client options
 */
export interface ZendeskClientOptions {
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
 * Ticket resource types
 */
/**
 * Parameters for Ticket.create
 */
export interface TicketCreateParams {
  /** Ticket subject */
  subject: string
  /** Initial comment with body */
  comment: Record<string, any>
  /** Ticket priority (low, normal, high, urgent) */
  priority?: string
  /** Ticket status (new, open, pending, hold, solved, closed) */
  status?: string
  /** Ticket type (problem, incident, question, task) */
  type?: string
  /** Ticket tags */
  tags?: any[]
  /** Requester user ID */
  requester_id?: number
  /** Assignee user ID */
  assignee_id?: number
  /** Group ID */
  group_id?: number
}

/**
 * Parameters for Ticket.get
 */
export interface TicketGetParams {
  /** Ticket ID */
  id: number
}

/**
 * Parameters for Ticket.update
 */
export interface TicketUpdateParams {
  /** Ticket ID */
  id: number
  /** Updated subject */
  subject?: string
  /** Add comment */
  comment?: Record<string, any>
  /** Updated status */
  status?: string
  /** Updated priority */
  priority?: string
}

/**
 * Parameters for Ticket.delete
 */
export interface TicketDeleteParams {
  /** Ticket ID */
  id: number
}

/**
 * Parameters for Ticket.list
 */
export interface TicketListParams {
  /** Page number */
  page?: number
  /** Results per page */
  per_page?: number
}

/**
 * User resource types
 */
/**
 * Parameters for User.create
 */
export interface UserCreateParams {
  /** User name */
  name: string
  /** User email */
  email: string
  /** User role (end-user, agent, admin) */
  role?: string
  /** Organization ID */
  organization_id?: number
}

/**
 * Parameters for User.get
 */
export interface UserGetParams {
  /** User ID */
  id: number
}

/**
 * Parameters for User.update
 */
export interface UserUpdateParams {
  /** User ID */
  id: number
  /** Updated name */
  name?: string
  /** Updated email */
  email?: string
}

/**
 * Parameters for User.list
 */
export interface UserListParams {
  /** Filter by role */
  role?: string
  /** Page number */
  page?: number
}

/**
 * Organization resource types
 */
/**
 * Parameters for Organization.create
 */
export interface OrganizationCreateParams {
  /** Organization name */
  name: string
  /** Domain names for auto-assignment */
  domain_names?: any[]
  /** Organization details */
  details?: string
}

/**
 * Parameters for Organization.get
 */
export interface OrganizationGetParams {
  /** Organization ID */
  id: number
}

/**
 * Parameters for Organization.update
 */
export interface OrganizationUpdateParams {
  /** Organization ID */
  id: number
  /** Updated name */
  name?: string
}

/**
 * Parameters for Organization.list
 */
export interface OrganizationListParams {
  /** Page number */
  page?: number
}

/**
 * Comment resource types
 */
/**
 * Parameters for Comment.list
 */
export interface CommentListParams {
  /** Ticket ID */
  ticket_id: number
}

/**
 * SDK type re-exports
 */
export type * from 'node-zendesk'
