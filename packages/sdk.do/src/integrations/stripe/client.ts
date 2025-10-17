/**
 * Stripe Client
 *
 * Auto-generated Integration client for Stripe.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/stripe
 */

import Stripe from 'stripe'
import {
  CustomerCreateParams,
  CustomerGetParams,
  CustomerUpdateParams,
  CustomerDeleteParams,
  CustomerListParams,
  PaymentIntentCreateParams,
  PaymentIntentGetParams,
  PaymentIntentUpdateParams,
  PaymentIntentConfirmParams,
  PaymentIntentCancelParams,
  PaymentIntentListParams,
  SubscriptionCreateParams,
  SubscriptionGetParams,
  SubscriptionUpdateParams,
  SubscriptionCancelParams,
  SubscriptionListParams,
  ChargeCreateParams,
  ChargeGetParams,
  ChargeListParams,
} from './types.js'
import { StripeError } from './errors.js'

/**
 * Stripe client options
 */
export interface StripeClientOptions {
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
 * Stripe Client
 *
 * Payment processing for internet businesses
 */
export class StripeClient {
  private options: StripeClientOptions
  private sdk: Stripe

  /**
   * Customer resource
   */
  public customer: {
    /** undefined Customer */
    create: (params: CustomerCreateParams) => Promise<Stripe.Customer>
    /** undefined Customer */
    get: (params: CustomerGetParams) => Promise<Stripe.Customer>
    /** undefined Customer */
    update: (params: CustomerUpdateParams) => Promise<Stripe.Customer>
    /** undefined Customer */
    delete: (params: CustomerDeleteParams) => Promise<Stripe.DeletedCustomer>
    /** undefined Customer */
    list: (params: CustomerListParams) => Promise<Stripe.ApiList<Stripe.Customer>>
  }

  /**
   * PaymentIntent resource
   */
  public paymentIntent: {
    /** undefined PaymentIntent */
    create: (params: PaymentIntentCreateParams) => Promise<Stripe.PaymentIntent>
    /** undefined PaymentIntent */
    get: (params: PaymentIntentGetParams) => Promise<Stripe.PaymentIntent>
    /** undefined PaymentIntent */
    update: (params: PaymentIntentUpdateParams) => Promise<Stripe.PaymentIntent>
    /** undefined PaymentIntent */
    confirm: (params: PaymentIntentConfirmParams) => Promise<Stripe.PaymentIntent>
    /** undefined PaymentIntent */
    cancel: (params: PaymentIntentCancelParams) => Promise<Stripe.PaymentIntent>
    /** undefined PaymentIntent */
    list: (params: PaymentIntentListParams) => Promise<Stripe.ApiList<Stripe.PaymentIntent>>
  }

  /**
   * Subscription resource
   */
  public subscription: {
    /** undefined Subscription */
    create: (params: SubscriptionCreateParams) => Promise<Stripe.Subscription>
    /** undefined Subscription */
    get: (params: SubscriptionGetParams) => Promise<Stripe.Subscription>
    /** undefined Subscription */
    update: (params: SubscriptionUpdateParams) => Promise<Stripe.Subscription>
    /** undefined Subscription */
    cancel: (params: SubscriptionCancelParams) => Promise<Stripe.Subscription>
    /** undefined Subscription */
    list: (params: SubscriptionListParams) => Promise<Stripe.ApiList<Stripe.Subscription>>
  }

  /**
   * Charge resource
   */
  public charge: {
    /** undefined Charge */
    create: (params: ChargeCreateParams) => Promise<Stripe.Charge>
    /** undefined Charge */
    get: (params: ChargeGetParams) => Promise<Stripe.Charge>
    /** undefined Charge */
    list: (params: ChargeListParams) => Promise<Stripe.ApiList<Stripe.Charge>>
  }

  constructor(options: StripeClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Stripe(this.options.apiKey, {
      apiVersion: '2024-12-18',
    })

    // Initialize resource namespaces
    this.customer = {
      create: this.customerCreate.bind(this),
      get: this.customerGet.bind(this),
      update: this.customerUpdate.bind(this),
      delete: this.customerDelete.bind(this),
      list: this.customerList.bind(this),
    }
    this.paymentIntent = {
      create: this.paymentIntentCreate.bind(this),
      get: this.paymentIntentGet.bind(this),
      update: this.paymentIntentUpdate.bind(this),
      confirm: this.paymentIntentConfirm.bind(this),
      cancel: this.paymentIntentCancel.bind(this),
      list: this.paymentIntentList.bind(this),
    }
    this.subscription = {
      create: this.subscriptionCreate.bind(this),
      get: this.subscriptionGet.bind(this),
      update: this.subscriptionUpdate.bind(this),
      cancel: this.subscriptionCancel.bind(this),
      list: this.subscriptionList.bind(this),
    }
    this.charge = {
      create: this.chargeCreate.bind(this),
      get: this.chargeGet.bind(this),
      list: this.chargeList.bind(this),
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Stripe.Customer
   */
  private async customerCreate(params: CustomerCreateParams): Promise<Stripe.Customer> {
    try {
      const result = await this.sdk.customers.create(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Stripe.Customer
   */
  private async customerGet(params: CustomerGetParams): Promise<Stripe.Customer> {
    try {
      const result = await this.sdk.customers.retrieve(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Stripe.Customer
   */
  private async customerUpdate(params: CustomerUpdateParams): Promise<Stripe.Customer> {
    try {
      const result = await this.sdk.customers.update(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Stripe.DeletedCustomer
   */
  private async customerDelete(params: CustomerDeleteParams): Promise<Stripe.DeletedCustomer> {
    try {
      const result = await this.sdk.customers.del(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Stripe.ApiList<Stripe.Customer>
   */
  private async customerList(params: CustomerListParams): Promise<Stripe.ApiList<Stripe.Customer>> {
    try {
      const result = await this.sdk.customers.list(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined PaymentIntent
   * @param params - Operation parameters
   * @returns Stripe.PaymentIntent
   */
  private async paymentIntentCreate(params: PaymentIntentCreateParams): Promise<Stripe.PaymentIntent> {
    try {
      const result = await this.sdk.paymentIntents.create(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined PaymentIntent
   * @param params - Operation parameters
   * @returns Stripe.PaymentIntent
   */
  private async paymentIntentGet(params: PaymentIntentGetParams): Promise<Stripe.PaymentIntent> {
    try {
      const result = await this.sdk.paymentIntents.retrieve(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined PaymentIntent
   * @param params - Operation parameters
   * @returns Stripe.PaymentIntent
   */
  private async paymentIntentUpdate(params: PaymentIntentUpdateParams): Promise<Stripe.PaymentIntent> {
    try {
      const result = await this.sdk.paymentIntents.update(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined PaymentIntent
   * @param params - Operation parameters
   * @returns Stripe.PaymentIntent
   */
  private async paymentIntentConfirm(params: PaymentIntentConfirmParams): Promise<Stripe.PaymentIntent> {
    try {
      const result = await this.sdk.paymentIntents.confirm(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined PaymentIntent
   * @param params - Operation parameters
   * @returns Stripe.PaymentIntent
   */
  private async paymentIntentCancel(params: PaymentIntentCancelParams): Promise<Stripe.PaymentIntent> {
    try {
      const result = await this.sdk.paymentIntents.cancel(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined PaymentIntent
   * @param params - Operation parameters
   * @returns Stripe.ApiList<Stripe.PaymentIntent>
   */
  private async paymentIntentList(params: PaymentIntentListParams): Promise<Stripe.ApiList<Stripe.PaymentIntent>> {
    try {
      const result = await this.sdk.paymentIntents.list(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns Stripe.Subscription
   */
  private async subscriptionCreate(params: SubscriptionCreateParams): Promise<Stripe.Subscription> {
    try {
      const result = await this.sdk.subscriptions.create(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns Stripe.Subscription
   */
  private async subscriptionGet(params: SubscriptionGetParams): Promise<Stripe.Subscription> {
    try {
      const result = await this.sdk.subscriptions.retrieve(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns Stripe.Subscription
   */
  private async subscriptionUpdate(params: SubscriptionUpdateParams): Promise<Stripe.Subscription> {
    try {
      const result = await this.sdk.subscriptions.update(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns Stripe.Subscription
   */
  private async subscriptionCancel(params: SubscriptionCancelParams): Promise<Stripe.Subscription> {
    try {
      const result = await this.sdk.subscriptions.cancel(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns Stripe.ApiList<Stripe.Subscription>
   */
  private async subscriptionList(params: SubscriptionListParams): Promise<Stripe.ApiList<Stripe.Subscription>> {
    try {
      const result = await this.sdk.subscriptions.list(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined Charge
   * @param params - Operation parameters
   * @returns Stripe.Charge
   */
  private async chargeCreate(params: ChargeCreateParams): Promise<Stripe.Charge> {
    try {
      const result = await this.sdk.charges.create(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined Charge
   * @param params - Operation parameters
   * @returns Stripe.Charge
   */
  private async chargeGet(params: ChargeGetParams): Promise<Stripe.Charge> {
    try {
      const result = await this.sdk.charges.retrieve(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }

  /**
   * undefined Charge
   * @param params - Operation parameters
   * @returns Stripe.ApiList<Stripe.Charge>
   */
  private async chargeList(params: ChargeListParams): Promise<Stripe.ApiList<Stripe.Charge>> {
    try {
      const result = await this.sdk.charges.list(params)
      return result
    } catch (error) {
      throw StripeError.fromError(error)
    }
  }
}
