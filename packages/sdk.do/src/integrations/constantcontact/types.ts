/**
 * Constant Contact Types
 *
 * Auto-generated TypeScript types for Constant Contact Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/constantcontact
 */

/**
 * Constant Contact client options
 */
export interface ConstantcontactClientOptions {
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
  /** Contact email */
  email_address: string
  /** First name */
  first_name?: string
  /** Last name */
  last_name?: string
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
  /** Updated email */
  email_address?: string
}

/**
 * Parameters for Contact.delete
 */
export interface ContactDeleteParams {
  /** Contact ID */
  contact_id: string
}

/**
 * Parameters for Contact.list
 */
export interface ContactListParams {
  /** Results per page */
  limit?: number
}

/**
 * Campaign resource types
 */
/**
 * Parameters for Campaign.create
 */
export interface CampaignCreateParams {
  /** Campaign name */
  name: string
}

/**
 * Parameters for Campaign.get
 */
export interface CampaignGetParams {
  /** Campaign ID */
  campaign_id: string
}
