/**
 * PayPal Types
 *
 * Auto-generated TypeScript types for PayPal Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/paypal
 */

/**
 * PayPal client options
 */
export interface PaypalClientOptions {
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
 * Payment resource types
 */
/**
 * Parameters for Payment.create
 */
export interface PaymentCreateParams {
  /** Payment intent (CAPTURE or AUTHORIZE) */
  intent: string
  /** Purchase units with amount and breakdown */
  purchase_units: any[]
  /** Payer information */
  payer?: Record<string, any>
}

/**
 * Parameters for Payment.get
 */
export interface PaymentGetParams {
  /** Payment ID */
  payment_id: string
}

/**
 * Parameters for Payment.capture
 */
export interface PaymentCaptureParams {
  /** Authorization ID */
  authorization_id: string
  /** Amount to capture */
  amount?: Record<string, any>
}

/**
 * Order resource types
 */
/**
 * Parameters for Order.create
 */
export interface OrderCreateParams {
  /** Order intent (CAPTURE, AUTHORIZE) */
  intent: string
  /** Purchase units */
  purchase_units: any[]
  /** Payer details */
  payer?: Record<string, any>
}

/**
 * Parameters for Order.get
 */
export interface OrderGetParams {
  /** Order ID */
  order_id: string
}

/**
 * Parameters for Order.capture
 */
export interface OrderCaptureParams {
  /** Order ID */
  order_id: string
}

/**
 * Parameters for Order.authorize
 */
export interface OrderAuthorizeParams {
  /** Order ID */
  order_id: string
}

/**
 * Refund resource types
 */
/**
 * Parameters for Refund.create
 */
export interface RefundCreateParams {
  /** Capture ID */
  capture_id: string
  /** Refund amount */
  amount?: Record<string, any>
  /** Note to payer */
  note_to_payer?: string
}

/**
 * Parameters for Refund.get
 */
export interface RefundGetParams {
  /** Refund ID */
  refund_id: string
}

/**
 * Subscription resource types
 */
/**
 * Parameters for Subscription.create
 */
export interface SubscriptionCreateParams {
  /** Billing plan ID */
  plan_id: string
  /** Subscriber information */
  subscriber?: Record<string, any>
  /** Application context */
  application_context?: Record<string, any>
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
  /** JSON Patch operations */
  operations: any[]
}

/**
 * Parameters for Subscription.cancel
 */
export interface SubscriptionCancelParams {
  /** Subscription ID */
  subscription_id: string
  /** Cancellation reason */
  reason?: string
}

/**
 * SDK type re-exports
 */
export type * from '@paypal/paypal-server-sdk'
