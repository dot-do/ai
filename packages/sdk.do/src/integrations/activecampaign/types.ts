/**
 * ActiveCampaign Types
 *
 * Auto-generated TypeScript types for ActiveCampaign Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/activecampaign
 */

/**
 * ActiveCampaign client options
 */
export interface ActivecampaignClientOptions {
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
  email: string
  /** First name */
  firstName?: string
  /** Last name */
  lastName?: string
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
  email?: string
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
  /** Campaign type */
  type: string
}

/**
 * Parameters for Campaign.get
 */
export interface CampaignGetParams {
  /** Campaign ID */
  campaign_id: string
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
}

/**
 * Parameters for List.get
 */
export interface ListGetParams {
  /** List ID */
  list_id: string
}
