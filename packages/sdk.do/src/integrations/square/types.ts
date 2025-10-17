/**
 * Square Types
 *
 * Auto-generated TypeScript types for Square Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/square
 */

/**
 * Square client options
 */
export interface SquareClientOptions {
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
  /** Payment source ID (card nonce) */
  source_id: string
  /** Unique idempotency key */
  idempotency_key: string
  /** Amount with currency */
  amount_money: Record<string, any>
  /** Customer ID */
  customer_id?: string
  /** Location ID */
  location_id?: string
  /** Reference ID */
  reference_id?: string
  /** Payment note */
  note?: string
}

/**
 * Parameters for Payment.get
 */
export interface PaymentGetParams {
  /** Payment ID */
  payment_id: string
}

/**
 * Parameters for Payment.list
 */
export interface PaymentListParams {
  /** Start time (RFC 3339) */
  begin_time?: string
  /** End time (RFC 3339) */
  end_time?: string
  /** Filter by location */
  location_id?: string
}

/**
 * Parameters for Payment.cancel
 */
export interface PaymentCancelParams {
  /** Payment ID */
  payment_id: string
}

/**
 * Customer resource types
 */
/**
 * Parameters for Customer.create
 */
export interface CustomerCreateParams {
  /** Customer first name */
  given_name?: string
  /** Customer last name */
  family_name?: string
  /** Customer email */
  email_address?: string
  /** Customer phone */
  phone_number?: string
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
  given_name?: string
  /** Updated email */
  email_address?: string
}

/**
 * Parameters for Customer.delete
 */
export interface CustomerDeleteParams {
  /** Customer ID */
  customer_id: string
}

/**
 * Parameters for Customer.list
 */
export interface CustomerListParams {
  /** Results per page */
  limit?: number
}

/**
 * Order resource types
 */
/**
 * Parameters for Order.create
 */
export interface OrderCreateParams {
  /** Location ID */
  location_id: string
  /** Order line items */
  line_items?: any[]
  /** Customer ID */
  customer_id?: string
}

/**
 * Parameters for Order.get
 */
export interface OrderGetParams {
  /** Order ID */
  order_id: string
}

/**
 * Parameters for Order.update
 */
export interface OrderUpdateParams {
  /** Order ID */
  order_id: string
  /** Updated order data */
  order: Record<string, any>
}

/**
 * Parameters for Order.list
 */
export interface OrderListParams {
  /** Location IDs to search */
  location_ids: any[]
  /** Results per page */
  limit?: number
}

/**
 * Invoice resource types
 */
/**
 * Parameters for Invoice.create
 */
export interface InvoiceCreateParams {
  /** Invoice data */
  invoice: Record<string, any>
  /** Unique idempotency key */
  idempotency_key: string
}

/**
 * Parameters for Invoice.get
 */
export interface InvoiceGetParams {
  /** Invoice ID */
  invoice_id: string
}

/**
 * Parameters for Invoice.update
 */
export interface InvoiceUpdateParams {
  /** Invoice ID */
  invoice_id: string
  /** Updated invoice data */
  invoice: Record<string, any>
}

/**
 * Parameters for Invoice.delete
 */
export interface InvoiceDeleteParams {
  /** Invoice ID */
  invoice_id: string
}

/**
 * Parameters for Invoice.list
 */
export interface InvoiceListParams {
  /** Location ID */
  location_id: string
  /** Results per page */
  limit?: number
}

/**
 * SDK type re-exports
 */
export type * from 'square'
