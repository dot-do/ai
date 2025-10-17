/**
 * Plaid Types
 *
 * Auto-generated TypeScript types for Plaid Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/plaid
 */

/**
 * Plaid client options
 */
export interface PlaidClientOptions {
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
 * Account resource types
 */
/**
 * Parameters for Account.list
 */
export interface AccountListParams {
  /** Access token for bank account */
  access_token: string
}

/**
 * Parameters for Account.balance
 */
export interface AccountBalanceParams {
  /** Access token */
  access_token: string
}

/**
 * Transaction resource types
 */
/**
 * Parameters for Transaction.list
 */
export interface TransactionListParams {
  /** Access token */
  access_token: string
  /** Start date (YYYY-MM-DD) */
  start_date: string
  /** End date (YYYY-MM-DD) */
  end_date: string
}

/**
 * Parameters for Transaction.sync
 */
export interface TransactionSyncParams {
  /** Access token */
  access_token: string
  /** Cursor for pagination */
  cursor?: string
}

/**
 * Balance resource types
 */
/**
 * Parameters for Balance.get
 */
export interface BalanceGetParams {
  /** Access token */
  access_token: string
}

/**
 * Identity resource types
 */
/**
 * Parameters for Identity.get
 */
export interface IdentityGetParams {
  /** Access token */
  access_token: string
}

/**
 * SDK type re-exports
 */
export type * from 'plaid'
