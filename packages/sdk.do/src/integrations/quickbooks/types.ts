/**
 * QuickBooks Types
 *
 * Auto-generated TypeScript types for QuickBooks Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/quickbooks
 */

/**
 * QuickBooks client options
 */
export interface QuickbooksClientOptions {
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
 * Invoice resource types
 */
/**
 * Parameters for Invoice.create
 */
export interface InvoiceCreateParams {
  /** Company realm ID */
  realmId: string
  /** Invoice line items */
  Line: any[]
  /** Customer reference */
  CustomerRef: Record<string, any>
  /** Due date (YYYY-MM-DD) */
  DueDate?: string
}

/**
 * Parameters for Invoice.get
 */
export interface InvoiceGetParams {
  /** Company realm ID */
  realmId: string
  /** Invoice ID */
  invoice_id: string
}

/**
 * Parameters for Invoice.update
 */
export interface InvoiceUpdateParams {
  /** Company realm ID */
  realmId: string
  /** Invoice ID */
  Id: string
  /** Sync token for optimistic locking */
  SyncToken: string
  /** Partial update if true */
  sparse?: boolean
}

/**
 * Parameters for Invoice.delete
 */
export interface InvoiceDeleteParams {
  /** Company realm ID */
  realmId: string
  /** Invoice ID */
  Id: string
  /** Sync token */
  SyncToken: string
}

/**
 * Parameters for Invoice.list
 */
export interface InvoiceListParams {
  /** Company realm ID */
  realmId: string
  /** SQL-like query (e.g., "SELECT * FROM Invoice") */
  query: string
}

/**
 * Customer resource types
 */
/**
 * Parameters for Customer.create
 */
export interface CustomerCreateParams {
  /** Company realm ID */
  realmId: string
  /** Display name */
  DisplayName: string
  /** First name */
  GivenName?: string
  /** Last name */
  FamilyName?: string
  /** Email address */
  PrimaryEmailAddr?: Record<string, any>
}

/**
 * Parameters for Customer.get
 */
export interface CustomerGetParams {
  /** Company realm ID */
  realmId: string
  /** Customer ID */
  customer_id: string
}

/**
 * Parameters for Customer.update
 */
export interface CustomerUpdateParams {
  /** Company realm ID */
  realmId: string
  /** Customer ID */
  Id: string
  /** Sync token */
  SyncToken: string
  /** Partial update if true */
  sparse?: boolean
}

/**
 * Parameters for Customer.list
 */
export interface CustomerListParams {
  /** Company realm ID */
  realmId: string
  /** SQL-like query (e.g., "SELECT * FROM Customer") */
  query: string
}

/**
 * Payment resource types
 */
/**
 * Parameters for Payment.create
 */
export interface PaymentCreateParams {
  /** Company realm ID */
  realmId: string
  /** Total payment amount */
  TotalAmt: number
  /** Customer reference */
  CustomerRef: Record<string, any>
  /** Payment line items (invoice links) */
  Line?: any[]
}

/**
 * Parameters for Payment.get
 */
export interface PaymentGetParams {
  /** Company realm ID */
  realmId: string
  /** Payment ID */
  payment_id: string
}

/**
 * Parameters for Payment.update
 */
export interface PaymentUpdateParams {
  /** Company realm ID */
  realmId: string
  /** Payment ID */
  Id: string
  /** Sync token */
  SyncToken: string
}

/**
 * Parameters for Payment.list
 */
export interface PaymentListParams {
  /** Company realm ID */
  realmId: string
  /** SQL-like query (e.g., "SELECT * FROM Payment") */
  query: string
}

/**
 * Expense resource types
 */
/**
 * Parameters for Expense.create
 */
export interface ExpenseCreateParams {
  /** Company realm ID */
  realmId: string
  /** Payment type (Cash, Check, CreditCard) */
  PaymentType: string
  /** Account reference */
  AccountRef: Record<string, any>
  /** Expense line items */
  Line: any[]
}

/**
 * Parameters for Expense.get
 */
export interface ExpenseGetParams {
  /** Company realm ID */
  realmId: string
  /** Expense ID */
  expense_id: string
}

/**
 * Parameters for Expense.update
 */
export interface ExpenseUpdateParams {
  /** Company realm ID */
  realmId: string
  /** Expense ID */
  Id: string
  /** Sync token */
  SyncToken: string
}

/**
 * Parameters for Expense.list
 */
export interface ExpenseListParams {
  /** Company realm ID */
  realmId: string
  /** SQL-like query (e.g., "SELECT * FROM Purchase") */
  query: string
}
