/**
 * Braintree Client
 *
 * Auto-generated Integration client for Braintree.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/braintree
 */

import BraintreeGateway from 'braintree'
import {
  TransactionCreateParams,
  TransactionGetParams,
  TransactionListParams,
  TransactionRefundParams,
  CustomerCreateParams,
  CustomerGetParams,
  CustomerUpdateParams,
  CustomerDeleteParams,
  SubscriptionCreateParams,
  SubscriptionGetParams,
  SubscriptionUpdateParams,
  SubscriptionCancelParams,
  PlanGetParams,
} from './types.js'
import { BraintreeError } from './errors.js'

/**
 * Braintree client options
 */
export interface BraintreeClientOptions {
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
 * Braintree Client
 *
 * Payment processing platform with fraud protection (PayPal owned)
 */
export class BraintreeClient {
  private options: BraintreeClientOptions
  private sdk: BraintreeGateway

  /**
   * Transaction resource
   * Process payment transactions
   */
  public transaction: {
    /** undefined Transaction */
    create: (params: TransactionCreateParams) => Promise<Transaction>
    /** undefined Transaction */
    get: (params: TransactionGetParams) => Promise<Transaction>
    /** undefined Transaction */
    list: (params: TransactionListParams) => Promise<Transaction[]>
    /** undefined Transaction */
    refund: (params: TransactionRefundParams) => Promise<Transaction>
  }

  /**
   * Customer resource
   * Manage customer profiles
   */
  public customer: {
    /** undefined Customer */
    create: (params: CustomerCreateParams) => Promise<Customer>
    /** undefined Customer */
    get: (params: CustomerGetParams) => Promise<Customer>
    /** undefined Customer */
    update: (params: CustomerUpdateParams) => Promise<Customer>
    /** undefined Customer */
    delete: (params: CustomerDeleteParams) => Promise<boolean>
  }

  /**
   * Subscription resource
   * Manage recurring subscriptions
   */
  public subscription: {
    /** undefined Subscription */
    create: (params: SubscriptionCreateParams) => Promise<Subscription>
    /** undefined Subscription */
    get: (params: SubscriptionGetParams) => Promise<Subscription>
    /** undefined Subscription */
    update: (params: SubscriptionUpdateParams) => Promise<Subscription>
    /** undefined Subscription */
    cancel: (params: SubscriptionCancelParams) => Promise<boolean>
  }

  /**
   * Plan resource
   * Manage subscription plans
   */
  public plan: {
    /** undefined Plan */
    list: () => Promise<Plan[]>
    /** undefined Plan */
    get: (params: PlanGetParams) => Promise<Plan>
  }

  constructor(options: BraintreeClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new BraintreeGateway(this.options.apiKey, {})

    // Initialize resource namespaces
    this.transaction = {
      create: this.transactionCreate.bind(this),
      get: this.transactionGet.bind(this),
      list: this.transactionList.bind(this),
      refund: this.transactionRefund.bind(this),
    }
    this.customer = {
      create: this.customerCreate.bind(this),
      get: this.customerGet.bind(this),
      update: this.customerUpdate.bind(this),
      delete: this.customerDelete.bind(this),
    }
    this.subscription = {
      create: this.subscriptionCreate.bind(this),
      get: this.subscriptionGet.bind(this),
      update: this.subscriptionUpdate.bind(this),
      cancel: this.subscriptionCancel.bind(this),
    }
    this.plan = {
      list: this.planList.bind(this),
      get: this.planGet.bind(this),
    }
  }

  /**
   * undefined Transaction
   * @param params - Operation parameters
   * @returns Transaction
   */
  private async transactionCreate(params: TransactionCreateParams): Promise<Transaction> {
    try {
      const result = await this.sdk.transactions.POST(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Transaction
   * @param params - Operation parameters
   * @returns Transaction
   */
  private async transactionGet(params: TransactionGetParams): Promise<Transaction> {
    try {
      const result = await this.sdk.transactions.GET(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Transaction
   * @param params - Operation parameters
   * @returns Transaction[]
   */
  private async transactionList(params: TransactionListParams): Promise<Transaction[]> {
    try {
      const result = await this.sdk.transactions.GET(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Transaction
   * @param params - Operation parameters
   * @returns Transaction
   */
  private async transactionRefund(params: TransactionRefundParams): Promise<Transaction> {
    try {
      const result = await this.sdk.transactions.POST(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Customer
   */
  private async customerCreate(params: CustomerCreateParams): Promise<Customer> {
    try {
      const result = await this.sdk.customers.POST(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Customer
   */
  private async customerGet(params: CustomerGetParams): Promise<Customer> {
    try {
      const result = await this.sdk.customers.GET(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Customer
   */
  private async customerUpdate(params: CustomerUpdateParams): Promise<Customer> {
    try {
      const result = await this.sdk.customers.PUT(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns boolean
   */
  private async customerDelete(params: CustomerDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.customers.DELETE(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns Subscription
   */
  private async subscriptionCreate(params: SubscriptionCreateParams): Promise<Subscription> {
    try {
      const result = await this.sdk.subscriptions.POST(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns Subscription
   */
  private async subscriptionGet(params: SubscriptionGetParams): Promise<Subscription> {
    try {
      const result = await this.sdk.subscriptions.GET(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns Subscription
   */
  private async subscriptionUpdate(params: SubscriptionUpdateParams): Promise<Subscription> {
    try {
      const result = await this.sdk.subscriptions.PUT(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns boolean
   */
  private async subscriptionCancel(params: SubscriptionCancelParams): Promise<boolean> {
    try {
      const result = await this.sdk.subscriptions.DELETE(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Plan
   * @returns Plan[]
   */
  private async planList(): Promise<Plan[]> {
    try {
      const result = await this.sdk.plans.GET()
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }

  /**
   * undefined Plan
   * @param params - Operation parameters
   * @returns Plan
   */
  private async planGet(params: PlanGetParams): Promise<Plan> {
    try {
      const result = await this.sdk.plans.GET(params)
      return result
    } catch (error) {
      throw BraintreeError.fromError(error)
    }
  }
}
