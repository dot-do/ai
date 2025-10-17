/**
 * HubSpot Types
 *
 * Auto-generated TypeScript types for HubSpot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/hubspot
 */

/**
 * HubSpot client options
 */
export interface HubspotClientOptions {
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
 * Contact resource types
 */
/**
 * Parameters for Contact.create
 */
export interface ContactCreateParams {
  /** Contact creation parameters (email, firstname, lastname, etc.) */
  params: any
}

/**
 * Parameters for Contact.get
 */
export interface ContactGetParams {
  /** Contact ID */
  id: string
  /** Properties to retrieve */
  properties?: any
}

/**
 * Parameters for Contact.update
 */
export interface ContactUpdateParams {
  /** Contact ID */
  id: string
  /** Contact update parameters */
  params: any
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
  /** Number of results per page */
  limit?: number
  /** Cursor for pagination */
  after?: string
  /** Properties to retrieve */
  properties?: any
  /** Properties with historical values */
  propertiesWithHistory?: any
  /** Associated objects to retrieve */
  associations?: any
  /** Include archived contacts */
  archived?: boolean
}

/**
 * Parameters for Contact.search
 */
export interface ContactSearchParams {
  /** Search criteria (filterGroups, sorts, properties) */
  options: any
}

/**
 * Parameters for Contact.batchCreate
 */
export interface ContactBatchCreateParams {
  /** Array of contact creation parameters */
  contacts: any
}

/**
 * Company resource types
 */
/**
 * Parameters for Company.create
 */
export interface CompanyCreateParams {
  /** Company creation parameters (name, domain, industry, etc.) */
  params: any
}

/**
 * Parameters for Company.get
 */
export interface CompanyGetParams {
  /** Company ID */
  id: string
  /** Properties to retrieve */
  properties?: any
}

/**
 * Parameters for Company.update
 */
export interface CompanyUpdateParams {
  /** Company ID */
  id: string
  /** Company update parameters */
  params: any
}

/**
 * Parameters for Company.delete
 */
export interface CompanyDeleteParams {
  /** Company ID */
  id: string
}

/**
 * Parameters for Company.list
 */
export interface CompanyListParams {
  /** Number of results per page */
  limit?: number
  /** Cursor for pagination */
  after?: string
  /** Properties to retrieve */
  properties?: any
  /** Properties with historical values */
  propertiesWithHistory?: any
  /** Associated objects to retrieve */
  associations?: any
  /** Include archived companies */
  archived?: boolean
}

/**
 * Parameters for Company.search
 */
export interface CompanySearchParams {
  /** Search criteria (filterGroups, sorts, properties) */
  options: any
}

/**
 * Deal resource types
 */
/**
 * Parameters for Deal.create
 */
export interface DealCreateParams {
  /** Deal creation parameters (dealname, dealstage, pipeline, amount) */
  params: any
}

/**
 * Parameters for Deal.get
 */
export interface DealGetParams {
  /** Deal ID */
  id: string
  /** Properties to retrieve */
  properties?: any
}

/**
 * Parameters for Deal.update
 */
export interface DealUpdateParams {
  /** Deal ID */
  id: string
  /** Deal update parameters */
  params: any
}

/**
 * Parameters for Deal.delete
 */
export interface DealDeleteParams {
  /** Deal ID */
  id: string
}

/**
 * Parameters for Deal.list
 */
export interface DealListParams {
  /** Number of results per page */
  limit?: number
  /** Cursor for pagination */
  after?: string
  /** Properties to retrieve */
  properties?: any
  /** Properties with historical values */
  propertiesWithHistory?: any
  /** Associated objects to retrieve */
  associations?: any
  /** Include archived deals */
  archived?: boolean
}

/**
 * Parameters for Deal.search
 */
export interface DealSearchParams {
  /** Search criteria (filterGroups, sorts, properties) */
  options: any
}

/**
 * Parameters for Deal.associate
 */
export interface DealAssociateParams {
  /** Deal ID */
  dealId: string
  /** Association parameters (toObjectType, toObjectId, associationType) */
  options: any
}

/**
 * Ticket resource types
 */
/**
 * Parameters for Ticket.create
 */
export interface TicketCreateParams {
  /** Ticket creation parameters (subject, content, priority, pipeline) */
  params: any
}

/**
 * Parameters for Ticket.get
 */
export interface TicketGetParams {
  /** Ticket ID */
  id: string
  /** Properties to retrieve */
  properties?: any
}

/**
 * Parameters for Ticket.update
 */
export interface TicketUpdateParams {
  /** Ticket ID */
  id: string
  /** Ticket update parameters */
  params: any
}

/**
 * Parameters for Ticket.delete
 */
export interface TicketDeleteParams {
  /** Ticket ID */
  id: string
}

/**
 * Parameters for Ticket.list
 */
export interface TicketListParams {
  /** Number of results per page */
  limit?: number
  /** Cursor for pagination */
  after?: string
  /** Properties to retrieve */
  properties?: any
  /** Properties with historical values */
  propertiesWithHistory?: any
  /** Associated objects to retrieve */
  associations?: any
  /** Include archived tickets */
  archived?: boolean
}

/**
 * Note resource types
 */
/**
 * Parameters for Note.create
 */
export interface NoteCreateParams {
  /** Note creation parameters (hs_note_body, hs_timestamp, associations) */
  params: any
}

/**
 * Email resource types
 */
/**
 * Parameters for Email.create
 */
export interface EmailCreateParams {
  /** Email creation parameters (hs_email_subject, hs_email_text, associations) */
  params: any
}

/**
 * Call resource types
 */
/**
 * Parameters for Call.create
 */
export interface CallCreateParams {
  /** Call creation parameters (hs_call_title, hs_call_duration, associations) */
  params: any
}

/**
 * Meeting resource types
 */
/**
 * Parameters for Meeting.create
 */
export interface MeetingCreateParams {
  /** Meeting creation parameters (hs_meeting_title, hs_meeting_start_time, associations) */
  params: any
}

/**
 * Task resource types
 */
/**
 * Parameters for Task.create
 */
export interface TaskCreateParams {
  /** Task creation parameters (hs_task_subject, hs_task_status, associations) */
  params: any
}

/**
 * Property resource types
 */
/**
 * Parameters for Property.getAll
 */
export interface PropertyGetAllParams {
  /** Object type (contacts, companies, deals, tickets) */
  objectType: string
}

/**
 * Parameters for Property.create
 */
export interface PropertyCreateParams {
  /** Object type (contacts, companies, deals, tickets) */
  objectType: string
  /** Property creation parameters (name, label, type, fieldType) */
  options: any
}

/**
 * Workflow resource types
 */
/**
 * Parameters for Workflow.list
 */
export interface WorkflowListParams {
  /** Number of results per page */
  limit?: number
  /** Cursor for pagination */
  after?: string
}

/**
 * SDK type re-exports
 */
export type * from '@hubspot/api-client'
