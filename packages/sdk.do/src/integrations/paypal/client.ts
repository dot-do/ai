/**
 * PayPal Client
 *
 * Auto-generated Integration client for PayPal.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/paypal
 */

import PayPalServerSDK from '@paypal/paypal-server-sdk'
import {
  PaymentCreateParams,
  PaymentGetParams,
  PaymentCaptureParams,
  OrderCreateParams,
  OrderGetParams,
  OrderCaptureParams,
  OrderAuthorizeParams,
  RefundCreateParams,
  RefundGetParams,
  SubscriptionCreateParams,
  SubscriptionGetParams,
  SubscriptionUpdateParams,
  SubscriptionCancelParams,
} from './types.js'
import { PaypalError } from './errors.js'

/**
 * PayPal client options
 */
export interface PaypalClientOptions {
  /** OAuth2 access token */
  accessToken: string
  /** Base URL override */
  baseUrl?: string
  /** Request timeout in ms */
  timeout?: number
  /** Retry attempts */
  retryAttempts?: number
}

/**
 * PayPal Client
 *
 * Payment processing platform for online transactions
 */
export class PaypalClient {
  private options: PaypalClientOptions
  private sdk: PayPalServerSDK

  /**
   * Payment resource
   * Process payment transactions
   */
  public payment: {
    /** undefined Payment */
    create: (params: PaymentCreateParams) => Promise<Payment>
    /** undefined Payment */
    get: (params: PaymentGetParams) => Promise<Payment>
    /** undefined Payment */
    capture: (params: PaymentCaptureParams) => Promise<Payment>
  }

  /**
   * Order resource
   * Create and manage orders
   */
  public order: {
    /** undefined Order */
    create: (params: OrderCreateParams) => Promise<Order>
    /** undefined Order */
    get: (params: OrderGetParams) => Promise<Order>
    /** undefined Order */
    capture: (params: OrderCaptureParams) => Promise<Order>
    /** undefined Order */
    authorize: (params: OrderAuthorizeParams) => Promise<Order>
  }

  /**
   * Refund resource
   * Issue refunds for captured payments
   */
  public refund: {
    /** undefined Refund */
    create: (params: RefundCreateParams) => Promise<Refund>
    /** undefined Refund */
    get: (params: RefundGetParams) => Promise<Refund>
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

  constructor(options: PaypalClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new PayPalServerSDK({
      accessToken: this.options.accessToken,
    })

    // Initialize resource namespaces
    this.payment = {
      create: this.paymentCreate.bind(this),
      get: this.paymentGet.bind(this),
      capture: this.paymentCapture.bind(this),
    }
    this.order = {
      create: this.orderCreate.bind(this),
      get: this.orderGet.bind(this),
      capture: this.orderCapture.bind(this),
      authorize: this.orderAuthorize.bind(this),
    }
    this.refund = {
      create: this.refundCreate.bind(this),
      get: this.refundGet.bind(this),
    }
    this.subscription = {
      create: this.subscriptionCreate.bind(this),
      get: this.subscriptionGet.bind(this),
      update: this.subscriptionUpdate.bind(this),
      cancel: this.subscriptionCancel.bind(this),
    }
  }

  /**
   * undefined Payment
   * @param params - Operation parameters
   * @returns Payment
   */
  private async paymentCreate(params: PaymentCreateParams): Promise<Payment> {
    try {
      const result = await this.sdk.payments.POST(params)
      return result
    } catch (error) {
      throw PaypalError.fromError(error)
    }
  }

  /**
   * undefined Payment
   * @param params - Operation parameters
   * @returns Payment
   */
  private async paymentGet(params: PaymentGetParams): Promise<Payment> {
    try {
      const result = await this.sdk.payments.GET(params)
      return result
    } catch (error) {
      throw PaypalError.fromError(error)
    }
  }

  /**
   * undefined Payment
   * @param params - Operation parameters
   * @returns Payment
   */
  private async paymentCapture(params: PaymentCaptureParams): Promise<Payment> {
    try {
      const result = await this.sdk.payments.POST(params)
      return result
    } catch (error) {
      throw PaypalError.fromError(error)
    }
  }

  /**
   * undefined Order
   * @param params - Operation parameters
   * @returns Order
   */
  private async orderCreate(params: OrderCreateParams): Promise<Order> {
    try {
      const result = await this.sdk.orders.POST(params)
      return result
    } catch (error) {
      throw PaypalError.fromError(error)
    }
  }

  /**
   * undefined Order
   * @param params - Operation parameters
   * @returns Order
   */
  private async orderGet(params: OrderGetParams): Promise<Order> {
    try {
      const result = await this.sdk.orders.GET(params)
      return result
    } catch (error) {
      throw PaypalError.fromError(error)
    }
  }

  /**
   * undefined Order
   * @param params - Operation parameters
   * @returns Order
   */
  private async orderCapture(params: OrderCaptureParams): Promise<Order> {
    try {
      const result = await this.sdk.orders.POST(params)
      return result
    } catch (error) {
      throw PaypalError.fromError(error)
    }
  }

  /**
   * undefined Order
   * @param params - Operation parameters
   * @returns Order
   */
  private async orderAuthorize(params: OrderAuthorizeParams): Promise<Order> {
    try {
      const result = await this.sdk.orders.POST(params)
      return result
    } catch (error) {
      throw PaypalError.fromError(error)
    }
  }

  /**
   * undefined Refund
   * @param params - Operation parameters
   * @returns Refund
   */
  private async refundCreate(params: RefundCreateParams): Promise<Refund> {
    try {
      const result = await this.sdk.refunds.POST(params)
      return result
    } catch (error) {
      throw PaypalError.fromError(error)
    }
  }

  /**
   * undefined Refund
   * @param params - Operation parameters
   * @returns Refund
   */
  private async refundGet(params: RefundGetParams): Promise<Refund> {
    try {
      const result = await this.sdk.refunds.GET(params)
      return result
    } catch (error) {
      throw PaypalError.fromError(error)
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
      throw PaypalError.fromError(error)
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
      throw PaypalError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns Subscription
   */
  private async subscriptionUpdate(params: SubscriptionUpdateParams): Promise<Subscription> {
    try {
      const result = await this.sdk.subscriptions.PATCH(params)
      return result
    } catch (error) {
      throw PaypalError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns boolean
   */
  private async subscriptionCancel(params: SubscriptionCancelParams): Promise<boolean> {
    try {
      const result = await this.sdk.subscriptions.POST(params)
      return result
    } catch (error) {
      throw PaypalError.fromError(error)
    }
  }
}
