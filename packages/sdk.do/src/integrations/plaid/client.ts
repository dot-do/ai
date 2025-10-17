/**
 * Plaid Client
 *
 * Auto-generated Integration client for Plaid.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/plaid
 */

import PlaidApi from 'plaid'
import { AccountListParams, AccountBalanceParams, TransactionListParams, TransactionSyncParams, BalanceGetParams, IdentityGetParams } from './types.js'
import { PlaidError } from './errors.js'

/**
 * Plaid client options
 */
export interface PlaidClientOptions {
  /** API key for authentication */
  apiKey: string
  /** Base URL override */
  baseUrl?: string
  /** Request timeout in ms */
  timeout?: number
  /** Retry attempts */
  retryAttempts?: number
}

/**
 * Plaid Client
 *
 * Banking data platform for account linking and transaction data
 */
export class PlaidClient {
  private options: PlaidClientOptions
  private sdk: PlaidApi

  /**
   * Account resource
   * Retrieve bank account information
   */
  public account: {
    /** undefined Account */
    list: (params: AccountListParams) => Promise<Account[]>
    /** undefined Account */
    balance: (params: AccountBalanceParams) => Promise<Account[]>
  }

  /**
   * Transaction resource
   * Retrieve transaction history
   */
  public transaction: {
    /** undefined Transaction */
    list: (params: TransactionListParams) => Promise<Transaction[]>
    /** undefined Transaction */
    sync: (params: TransactionSyncParams) => Promise<Transaction[]>
  }

  /**
   * Balance resource
   * Get real-time balance information
   */
  public balance: {
    /** undefined Balance */
    get: (params: BalanceGetParams) => Promise<Balance>
  }

  /**
   * Identity resource
   * Retrieve identity information
   */
  public identity: {
    /** undefined Identity */
    get: (params: IdentityGetParams) => Promise<Identity>
  }

  constructor(options: PlaidClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new PlaidApi(this.options.apiKey, {})

    // Initialize resource namespaces
    this.account = {
      list: this.accountList.bind(this),
      balance: this.accountBalance.bind(this),
    }
    this.transaction = {
      list: this.transactionList.bind(this),
      sync: this.transactionSync.bind(this),
    }
    this.balance = {
      get: this.balanceGet.bind(this),
    }
    this.identity = {
      get: this.identityGet.bind(this),
    }
  }

  /**
   * undefined Account
   * @param params - Operation parameters
   * @returns Account[]
   */
  private async accountList(params: AccountListParams): Promise<Account[]> {
    try {
      const result = await this.sdk.accounts.POST(params)
      return result
    } catch (error) {
      throw PlaidError.fromError(error)
    }
  }

  /**
   * undefined Account
   * @param params - Operation parameters
   * @returns Account[]
   */
  private async accountBalance(params: AccountBalanceParams): Promise<Account[]> {
    try {
      const result = await this.sdk.accounts.POST(params)
      return result
    } catch (error) {
      throw PlaidError.fromError(error)
    }
  }

  /**
   * undefined Transaction
   * @param params - Operation parameters
   * @returns Transaction[]
   */
  private async transactionList(params: TransactionListParams): Promise<Transaction[]> {
    try {
      const result = await this.sdk.transactions.POST(params)
      return result
    } catch (error) {
      throw PlaidError.fromError(error)
    }
  }

  /**
   * undefined Transaction
   * @param params - Operation parameters
   * @returns Transaction[]
   */
  private async transactionSync(params: TransactionSyncParams): Promise<Transaction[]> {
    try {
      const result = await this.sdk.transactions.POST(params)
      return result
    } catch (error) {
      throw PlaidError.fromError(error)
    }
  }

  /**
   * undefined Balance
   * @param params - Operation parameters
   * @returns Balance
   */
  private async balanceGet(params: BalanceGetParams): Promise<Balance> {
    try {
      const result = await this.sdk.balances.POST(params)
      return result
    } catch (error) {
      throw PlaidError.fromError(error)
    }
  }

  /**
   * undefined Identity
   * @param params - Operation parameters
   * @returns Identity
   */
  private async identityGet(params: IdentityGetParams): Promise<Identity> {
    try {
      const result = await this.sdk.identities.POST(params)
      return result
    } catch (error) {
      throw PlaidError.fromError(error)
    }
  }
}
