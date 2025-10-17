/**
 * Square Client
 *
 * Auto-generated Integration client for Square.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/square
 */

import Client from 'square'
import {
  PaymentCreateParams,
  PaymentGetParams,
  PaymentListParams,
  PaymentCancelParams,
  CustomerCreateParams,
  CustomerGetParams,
  CustomerUpdateParams,
  CustomerDeleteParams,
  CustomerListParams,
  OrderCreateParams,
  OrderGetParams,
  OrderUpdateParams,
  OrderListParams,
  InvoiceCreateParams,
  InvoiceGetParams,
  InvoiceUpdateParams,
  InvoiceDeleteParams,
  InvoiceListParams,
} from './types.js'
import { SquareError } from './errors.js'

/**
 * Square client options
 */
export interface SquareClientOptions {
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
 * Square Client
 *
 * Payment processing and POS platform for businesses
 */
export class SquareClient {
  private options: SquareClientOptions
  private sdk: Client

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
    list: (params: PaymentListParams) => Promise<Payment[]>
    /** undefined Payment */
    cancel: (params: PaymentCancelParams) => Promise<Payment>
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
    /** undefined Customer */
    list: (params: CustomerListParams) => Promise<Customer[]>
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
    update: (params: OrderUpdateParams) => Promise<Order>
    /** undefined Order */
    list: (params: OrderListParams) => Promise<Order[]>
  }

  /**
   * Invoice resource
   * Create and manage invoices
   */
  public invoice: {
    /** undefined Invoice */
    create: (params: InvoiceCreateParams) => Promise<Invoice>
    /** undefined Invoice */
    get: (params: InvoiceGetParams) => Promise<Invoice>
    /** undefined Invoice */
    update: (params: InvoiceUpdateParams) => Promise<Invoice>
    /** undefined Invoice */
    delete: (params: InvoiceDeleteParams) => Promise<boolean>
    /** undefined Invoice */
    list: (params: InvoiceListParams) => Promise<Invoice[]>
  }

  constructor(options: SquareClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Client({
      accessToken: this.options.accessToken,
    })

    // Initialize resource namespaces
    this.payment = {
      create: this.paymentCreate.bind(this),
      get: this.paymentGet.bind(this),
      list: this.paymentList.bind(this),
      cancel: this.paymentCancel.bind(this),
    }
    this.customer = {
      create: this.customerCreate.bind(this),
      get: this.customerGet.bind(this),
      update: this.customerUpdate.bind(this),
      delete: this.customerDelete.bind(this),
      list: this.customerList.bind(this),
    }
    this.order = {
      create: this.orderCreate.bind(this),
      get: this.orderGet.bind(this),
      update: this.orderUpdate.bind(this),
      list: this.orderList.bind(this),
    }
    this.invoice = {
      create: this.invoiceCreate.bind(this),
      get: this.invoiceGet.bind(this),
      update: this.invoiceUpdate.bind(this),
      delete: this.invoiceDelete.bind(this),
      list: this.invoiceList.bind(this),
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
      throw SquareError.fromError(error)
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
      throw SquareError.fromError(error)
    }
  }

  /**
   * undefined Payment
   * @param params - Operation parameters
   * @returns Payment[]
   */
  private async paymentList(params: PaymentListParams): Promise<Payment[]> {
    try {
      const result = await this.sdk.payments.GET(params)
      return result
    } catch (error) {
      throw SquareError.fromError(error)
    }
  }

  /**
   * undefined Payment
   * @param params - Operation parameters
   * @returns Payment
   */
  private async paymentCancel(params: PaymentCancelParams): Promise<Payment> {
    try {
      const result = await this.sdk.payments.POST(params)
      return result
    } catch (error) {
      throw SquareError.fromError(error)
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
      throw SquareError.fromError(error)
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
      throw SquareError.fromError(error)
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
      throw SquareError.fromError(error)
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
      throw SquareError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Customer[]
   */
  private async customerList(params: CustomerListParams): Promise<Customer[]> {
    try {
      const result = await this.sdk.customers.GET(params)
      return result
    } catch (error) {
      throw SquareError.fromError(error)
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
      throw SquareError.fromError(error)
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
      throw SquareError.fromError(error)
    }
  }

  /**
   * undefined Order
   * @param params - Operation parameters
   * @returns Order
   */
  private async orderUpdate(params: OrderUpdateParams): Promise<Order> {
    try {
      const result = await this.sdk.orders.PUT(params)
      return result
    } catch (error) {
      throw SquareError.fromError(error)
    }
  }

  /**
   * undefined Order
   * @param params - Operation parameters
   * @returns Order[]
   */
  private async orderList(params: OrderListParams): Promise<Order[]> {
    try {
      const result = await this.sdk.orders.GET(params)
      return result
    } catch (error) {
      throw SquareError.fromError(error)
    }
  }

  /**
   * undefined Invoice
   * @param params - Operation parameters
   * @returns Invoice
   */
  private async invoiceCreate(params: InvoiceCreateParams): Promise<Invoice> {
    try {
      const result = await this.sdk.invoices.POST(params)
      return result
    } catch (error) {
      throw SquareError.fromError(error)
    }
  }

  /**
   * undefined Invoice
   * @param params - Operation parameters
   * @returns Invoice
   */
  private async invoiceGet(params: InvoiceGetParams): Promise<Invoice> {
    try {
      const result = await this.sdk.invoices.GET(params)
      return result
    } catch (error) {
      throw SquareError.fromError(error)
    }
  }

  /**
   * undefined Invoice
   * @param params - Operation parameters
   * @returns Invoice
   */
  private async invoiceUpdate(params: InvoiceUpdateParams): Promise<Invoice> {
    try {
      const result = await this.sdk.invoices.PUT(params)
      return result
    } catch (error) {
      throw SquareError.fromError(error)
    }
  }

  /**
   * undefined Invoice
   * @param params - Operation parameters
   * @returns boolean
   */
  private async invoiceDelete(params: InvoiceDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.invoices.DELETE(params)
      return result
    } catch (error) {
      throw SquareError.fromError(error)
    }
  }

  /**
   * undefined Invoice
   * @param params - Operation parameters
   * @returns Invoice[]
   */
  private async invoiceList(params: InvoiceListParams): Promise<Invoice[]> {
    try {
      const result = await this.sdk.invoices.GET(params)
      return result
    } catch (error) {
      throw SquareError.fromError(error)
    }
  }
}
