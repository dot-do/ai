/**
 * SendGrid Types
 *
 * Auto-generated TypeScript types for SendGrid Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sendgrid
 */

/**
 * SendGrid client options
 */
export interface SendgridClientOptions {
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
 * Email resource types
 */
/**
 * Parameters for Email.send
 */
export interface EmailSendParams {
  /** Email sending options including from, to, subject, and content */
  options: any
}

/**
 * Parameters for Email.sendBulk
 */
export interface EmailSendBulkParams {
  /** Bulk email with multiple personalizations */
  options: any
}

/**
 * Parameters for Email.sendTemplate
 */
export interface EmailSendTemplateParams {
  /** Template email with dynamic template data */
  options: any
}

/**
 * Parameters for Email.sendDynamicTemplate
 */
export interface EmailSendDynamicTemplateParams {
  /** Dynamic template email with personalizations */
  options: any
}

/**
 * Parameters for Email.validate
 */
export interface EmailValidateParams {
  /** Email address to validate */
  email: string
}

/**
 * Contact resource types
 */
/**
 * Parameters for Contact.create
 */
export interface ContactCreateParams {
  /** Contacts to create or update */
  options: any
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
  /** Contacts to update */
  options: any
}

/**
 * Parameters for Contact.delete
 */
export interface ContactDeleteParams {
  /** Array of contact IDs to delete */
  ids: any
}

/**
 * Parameters for Contact.list
 */
export interface ContactListParams {
  /** List pagination options */
  options?: any
}

/**
 * Parameters for Contact.search
 */
export interface ContactSearchParams {
  /** Search query and pagination */
  options: any
}

/**
 * List resource types
 */
/**
 * Parameters for List.create
 */
export interface ListCreateParams {
  /** List name */
  options: any
}

/**
 * Parameters for List.get
 */
export interface ListGetParams {
  /** List ID */
  id: string
}

/**
 * Parameters for List.update
 */
export interface ListUpdateParams {
  /** List ID */
  id: string
  /** Updated list properties */
  options: any
}

/**
 * Parameters for List.delete
 */
export interface ListDeleteParams {
  /** List ID */
  id: string
}

/**
 * Parameters for List.addContacts
 */
export interface ListAddContactsParams {
  /** List ID */
  listId: string
  /** Array of contact IDs to add */
  contactIds: any
}

/**
 * Parameters for List.removeContacts
 */
export interface ListRemoveContactsParams {
  /** List ID */
  listId: string
  /** Array of contact IDs to remove */
  contactIds: any
}

/**
 * Segment resource types
 */
/**
 * Parameters for Segment.create
 */
export interface SegmentCreateParams {
  /** Segment name and query DSL */
  options: any
}

/**
 * Parameters for Segment.get
 */
export interface SegmentGetParams {
  /** Segment ID */
  id: string
}

/**
 * Parameters for Segment.update
 */
export interface SegmentUpdateParams {
  /** Segment ID */
  id: string
  /** Updated segment properties */
  options: any
}

/**
 * Parameters for Segment.delete
 */
export interface SegmentDeleteParams {
  /** Segment ID */
  id: string
}

/**
 * Template resource types
 */
/**
 * Parameters for Template.create
 */
export interface TemplateCreateParams {
  /** Template name and generation type */
  options: any
}

/**
 * Parameters for Template.get
 */
export interface TemplateGetParams {
  /** Template ID */
  id: string
}

/**
 * Parameters for Template.update
 */
export interface TemplateUpdateParams {
  /** Template ID */
  id: string
  /** Updated template properties */
  options: any
}

/**
 * Parameters for Template.delete
 */
export interface TemplateDeleteParams {
  /** Template ID */
  id: string
}

/**
 * Campaign resource types
 */
/**
 * Parameters for Campaign.create
 */
export interface CampaignCreateParams {
  /** Campaign configuration */
  options: any
}

/**
 * Parameters for Campaign.get
 */
export interface CampaignGetParams {
  /** Campaign ID */
  id: string
}

/**
 * Parameters for Campaign.update
 */
export interface CampaignUpdateParams {
  /** Campaign ID */
  id: string
  /** Updated campaign properties */
  options: any
}

/**
 * Parameters for Campaign.delete
 */
export interface CampaignDeleteParams {
  /** Campaign ID */
  id: string
}

/**
 * Parameters for Campaign.send
 */
export interface CampaignSendParams {
  /** Campaign ID */
  id: string
}

/**
 * Parameters for Campaign.schedule
 */
export interface CampaignScheduleParams {
  /** Campaign ID */
  id: string
  /** Schedule timestamp */
  options: any
}

/**
 * Suppression resource types
 */
/**
 * Parameters for Suppression.addToGroup
 */
export interface SuppressionAddToGroupParams {
  /** Suppression group ID */
  groupId: number
  /** Array of email addresses to suppress */
  emails: any
}

/**
 * Parameters for Suppression.removeFromGroup
 */
export interface SuppressionRemoveFromGroupParams {
  /** Suppression group ID */
  groupId: number
  /** Array of email addresses to remove */
  emails: any
}

/**
 * Stats resource types
 */
/**
 * Parameters for Stats.get
 */
export interface StatsGetParams {
  /** Date range and aggregation options */
  options: any
}

/**
 * Parameters for Stats.getGlobal
 */
export interface StatsGetGlobalParams {
  /** Date range and aggregation options */
  options: any
}

/**
 * Parameters for Stats.getCategory
 */
export interface StatsGetCategoryParams {
  /** Date range, categories, and aggregation options */
  options: any
}

/**
 * SDK type re-exports
 */
export type * from '@sendgrid/mail'
