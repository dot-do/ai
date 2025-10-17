/**
 * Stripe Types
 *
 * Auto-generated TypeScript types for Stripe Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/stripe
 */

/**
 * Stripe client options
 */
export interface StripeClientOptions {
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
 * Customer resource types
 */
/**
 * Parameters for Customer.create
 */
export interface CustomerCreateParams {
  /** Customer creation parameters */
  params: any
}

/**
 * Parameters for Customer.get
 */
export interface CustomerGetParams {
  /** Customer ID */
  id: string
}

/**
 * Parameters for Customer.update
 */
export interface CustomerUpdateParams {
  /** Customer ID */
  id: string
  /** Update parameters */
  params: any
}

/**
 * Parameters for Customer.delete
 */
export interface CustomerDeleteParams {
  /** Customer ID */
  id: string
}

/**
 * Parameters for Customer.list
 */
export interface CustomerListParams {
  /** List parameters */
  params?: any
}

/**
 * PaymentIntent resource types
 */
/**
 * Parameters for PaymentIntent.create
 */
export interface PaymentIntentCreateParams {
  /** Payment intent creation parameters (amount, currency, etc.) */
  params: any
}

/**
 * Parameters for PaymentIntent.get
 */
export interface PaymentIntentGetParams {
  /** Payment intent ID */
  id: string
}

/**
 * Parameters for PaymentIntent.update
 */
export interface PaymentIntentUpdateParams {
  /** Payment intent ID */
  id: string
  /** Update parameters */
  params: any
}

/**
 * Parameters for PaymentIntent.confirm
 */
export interface PaymentIntentConfirmParams {
  /** Payment intent ID */
  id: string
  /** Confirmation parameters */
  params?: any
}

/**
 * Parameters for PaymentIntent.cancel
 */
export interface PaymentIntentCancelParams {
  /** Payment intent ID */
  id: string
}

/**
 * Parameters for PaymentIntent.list
 */
export interface PaymentIntentListParams {
  /** List parameters */
  params?: any
}

/**
 * Subscription resource types
 */
/**
 * Parameters for Subscription.create
 */
export interface SubscriptionCreateParams {
  /** Subscription creation parameters */
  params: any
}

/**
 * Parameters for Subscription.get
 */
export interface SubscriptionGetParams {
  /** Subscription ID */
  id: string
}

/**
 * Parameters for Subscription.update
 */
export interface SubscriptionUpdateParams {
  /** Subscription ID */
  id: string
  /** Update parameters */
  params: any
}

/**
 * Parameters for Subscription.cancel
 */
export interface SubscriptionCancelParams {
  /** Subscription ID */
  id: string
}

/**
 * Parameters for Subscription.list
 */
export interface SubscriptionListParams {
  /** List parameters */
  params?: any
}

/**
 * Charge resource types
 */
/**
 * Parameters for Charge.create
 */
export interface ChargeCreateParams {
  /** Charge creation parameters */
  params: any
}

/**
 * Parameters for Charge.get
 */
export interface ChargeGetParams {
  /** Charge ID */
  id: string
}

/**
 * Parameters for Charge.list
 */
export interface ChargeListParams {
  /** List parameters */
  params?: any
}

/**
 * SDK type re-exports
 */
export type * from 'stripe'
