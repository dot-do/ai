/**
 * Braintree Types
 *
 * Auto-generated TypeScript types for Braintree Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/braintree
 */

/**
 * Braintree client options
 */
export interface BraintreeClientOptions {
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
 * Transaction resource types
 */
/**
 * Parameters for Transaction.create
 */
export interface TransactionCreateParams {
  /** Transaction amount */
  amount: string
  /** Payment method nonce from client */
  payment_method_nonce: string
  /** Customer ID */
  customer_id?: string
  /** Transaction options */
  options?: Record<string, any>
}

/**
 * Parameters for Transaction.get
 */
export interface TransactionGetParams {
  /** Transaction ID */
  transaction_id: string
}

/**
 * Parameters for Transaction.list
 */
export interface TransactionListParams {
  /** Search criteria */
  query?: Record<string, any>
}

/**
 * Parameters for Transaction.refund
 */
export interface TransactionRefundParams {
  /** Transaction ID */
  transaction_id: string
  /** Refund amount */
  amount?: string
}

/**
 * Customer resource types
 */
/**
 * Parameters for Customer.create
 */
export interface CustomerCreateParams {
  /** Customer first name */
  first_name?: string
  /** Customer last name */
  last_name?: string
  /** Customer email */
  email?: string
  /** Customer phone */
  phone?: string
}

/**
 * Parameters for Customer.get
 */
export interface CustomerGetParams {
  /** Customer ID */
  customer_id: string
}

/**
 * Parameters for Customer.update
 */
export interface CustomerUpdateParams {
  /** Customer ID */
  customer_id: string
  /** Updated first name */
  first_name?: string
  /** Updated email */
  email?: string
}

/**
 * Parameters for Customer.delete
 */
export interface CustomerDeleteParams {
  /** Customer ID */
  customer_id: string
}

/**
 * Subscription resource types
 */
/**
 * Parameters for Subscription.create
 */
export interface SubscriptionCreateParams {
  /** Subscription plan ID */
  plan_id: string
  /** Payment method token */
  payment_method_token: string
  /** Subscription price */
  price?: string
}

/**
 * Parameters for Subscription.get
 */
export interface SubscriptionGetParams {
  /** Subscription ID */
  subscription_id: string
}

/**
 * Parameters for Subscription.update
 */
export interface SubscriptionUpdateParams {
  /** Subscription ID */
  subscription_id: string
  /** Updated price */
  price?: string
}

/**
 * Parameters for Subscription.cancel
 */
export interface SubscriptionCancelParams {
  /** Subscription ID */
  subscription_id: string
}

/**
 * Plan resource types
 */
/**
 * Parameters for Plan.get
 */
export interface PlanGetParams {
  /** Plan ID */
  plan_id: string
}

/**
 * SDK type re-exports
 */
export type * from 'braintree'
