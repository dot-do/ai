/**
 * Mailchimp Types
 *
 * Auto-generated TypeScript types for Mailchimp Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mailchimp
 */

/**
 * Mailchimp client options
 */
export interface MailchimpClientOptions {
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
 * Campaign resource types
 */
/**
 * Parameters for Campaign.create
 */
export interface CampaignCreateParams {
  /** Campaign type (regular, plaintext, absplit, rss, variate) */
  type: string
  /** List recipients */
  recipients: Record<string, any>
  /** Campaign settings (subject_line, from_name, reply_to) */
  settings: Record<string, any>
}

/**
 * Parameters for Campaign.get
 */
export interface CampaignGetParams {
  /** Campaign ID */
  campaign_id: string
}

/**
 * Parameters for Campaign.update
 */
export interface CampaignUpdateParams {
  /** Campaign ID */
  campaign_id: string
  /** Updated campaign settings */
  settings?: Record<string, any>
}

/**
 * Parameters for Campaign.delete
 */
export interface CampaignDeleteParams {
  /** Campaign ID */
  campaign_id: string
}

/**
 * Parameters for Campaign.list
 */
export interface CampaignListParams {
  /** Number of campaigns to return */
  count?: number
  /** Number of records to skip */
  offset?: number
}

/**
 * List resource types
 */
/**
 * Parameters for List.create
 */
export interface ListCreateParams {
  /** List name */
  name: string
  /** Contact information for the list */
  contact: Record<string, any>
  /** Permission reminder for subscribers */
  permission_reminder: string
  /** Default values for campaigns */
  campaign_defaults: Record<string, any>
  /** Whether the list supports multiple formats */
  email_type_option: boolean
}

/**
 * Parameters for List.get
 */
export interface ListGetParams {
  /** List ID */
  list_id: string
}

/**
 * Parameters for List.update
 */
export interface ListUpdateParams {
  /** List ID */
  list_id: string
  /** Updated list name */
  name?: string
}

/**
 * Parameters for List.delete
 */
export interface ListDeleteParams {
  /** List ID */
  list_id: string
}

/**
 * Parameters for List.list
 */
export interface ListListParams {
  /** Number of lists to return */
  count?: number
}

/**
 * Member resource types
 */
/**
 * Parameters for Member.create
 */
export interface MemberCreateParams {
  /** List ID */
  list_id: string
  /** Member email address */
  email_address: string
  /** Subscription status (subscribed, unsubscribed, cleaned, pending) */
  status: string
  /** Merge field values (FNAME, LNAME, etc.) */
  merge_fields?: Record<string, any>
  /** Member tags */
  tags?: any[]
}

/**
 * Parameters for Member.get
 */
export interface MemberGetParams {
  /** List ID */
  list_id: string
  /** MD5 hash of lowercase email */
  subscriber_hash: string
}

/**
 * Parameters for Member.update
 */
export interface MemberUpdateParams {
  /** List ID */
  list_id: string
  /** MD5 hash of lowercase email */
  subscriber_hash: string
  /** Updated subscription status */
  status?: string
  /** Updated merge fields */
  merge_fields?: Record<string, any>
}

/**
 * Parameters for Member.delete
 */
export interface MemberDeleteParams {
  /** List ID */
  list_id: string
  /** MD5 hash of lowercase email */
  subscriber_hash: string
}

/**
 * Parameters for Member.list
 */
export interface MemberListParams {
  /** List ID */
  list_id: string
  /** Number of members to return */
  count?: number
}

/**
 * Template resource types
 */
/**
 * Parameters for Template.create
 */
export interface TemplateCreateParams {
  /** Template name */
  name: string
  /** Template HTML content */
  html: string
}

/**
 * Parameters for Template.get
 */
export interface TemplateGetParams {
  /** Template ID */
  template_id: string
}

/**
 * Parameters for Template.update
 */
export interface TemplateUpdateParams {
  /** Template ID */
  template_id: string
  /** Updated template name */
  name?: string
  /** Updated HTML content */
  html?: string
}

/**
 * Parameters for Template.delete
 */
export interface TemplateDeleteParams {
  /** Template ID */
  template_id: string
}

/**
 * Parameters for Template.list
 */
export interface TemplateListParams {
  /** Number of templates to return */
  count?: number
}

/**
 * SDK type re-exports
 */
export type * from '@mailchimp/mailchimp_marketing'
