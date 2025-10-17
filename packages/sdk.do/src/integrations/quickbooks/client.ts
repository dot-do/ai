/**
 * QuickBooks Client
 *
 * Auto-generated Integration client for QuickBooks.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/quickbooks
 */

import {
  InvoiceCreateParams,
  InvoiceGetParams,
  InvoiceUpdateParams,
  InvoiceDeleteParams,
  InvoiceListParams,
  CustomerCreateParams,
  CustomerGetParams,
  CustomerUpdateParams,
  CustomerListParams,
  PaymentCreateParams,
  PaymentGetParams,
  PaymentUpdateParams,
  PaymentListParams,
  ExpenseCreateParams,
  ExpenseGetParams,
  ExpenseUpdateParams,
  ExpenseListParams,
} from './types.js'
import { QuickbooksError } from './errors.js'

/**
 * QuickBooks client options
 */
export interface QuickbooksClientOptions {
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
 * QuickBooks Client
 *
 * Accounting software for small business financial management
 */
export class QuickbooksClient {
  private options: QuickbooksClientOptions

  /**
   * Invoice resource
   * Sales forms for customer payments
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

  /**
   * Customer resource
   * Consumers of services or products
   */
  public customer: {
    /** undefined Customer */
    create: (params: CustomerCreateParams) => Promise<Customer>
    /** undefined Customer */
    get: (params: CustomerGetParams) => Promise<Customer>
    /** undefined Customer */
    update: (params: CustomerUpdateParams) => Promise<Customer>
    /** undefined Customer */
    list: (params: CustomerListParams) => Promise<Customer[]>
  }

  /**
   * Payment resource
   * Payment transactions from customers
   */
  public payment: {
    /** undefined Payment */
    create: (params: PaymentCreateParams) => Promise<Payment>
    /** undefined Payment */
    get: (params: PaymentGetParams) => Promise<Payment>
    /** undefined Payment */
    update: (params: PaymentUpdateParams) => Promise<Payment>
    /** undefined Payment */
    list: (params: PaymentListParams) => Promise<Payment[]>
  }

  /**
   * Expense resource
   * Expense transactions and purchases
   */
  public expense: {
    /** undefined Expense */
    create: (params: ExpenseCreateParams) => Promise<Expense>
    /** undefined Expense */
    get: (params: ExpenseGetParams) => Promise<Expense>
    /** undefined Expense */
    update: (params: ExpenseUpdateParams) => Promise<Expense>
    /** undefined Expense */
    list: (params: ExpenseListParams) => Promise<Expense[]>
  }

  constructor(options: QuickbooksClientOptions) {
    this.options = {
      baseUrl: 'https://quickbooks.api.intuit.com',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize resource namespaces
    this.invoice = {
      create: this.invoiceCreate.bind(this),
      get: this.invoiceGet.bind(this),
      update: this.invoiceUpdate.bind(this),
      delete: this.invoiceDelete.bind(this),
      list: this.invoiceList.bind(this),
    }
    this.customer = {
      create: this.customerCreate.bind(this),
      get: this.customerGet.bind(this),
      update: this.customerUpdate.bind(this),
      list: this.customerList.bind(this),
    }
    this.payment = {
      create: this.paymentCreate.bind(this),
      get: this.paymentGet.bind(this),
      update: this.paymentUpdate.bind(this),
      list: this.paymentList.bind(this),
    }
    this.expense = {
      create: this.expenseCreate.bind(this),
      get: this.expenseGet.bind(this),
      update: this.expenseUpdate.bind(this),
      list: this.expenseList.bind(this),
    }
  }

  /**
   * undefined Invoice
   * @param params - Operation parameters
   * @returns Invoice
   */
  private async invoiceCreate(params: InvoiceCreateParams): Promise<Invoice> {
    try {
      const response = await this.request('POST', '/v3/company/${params.realmId}/invoice', params)
      return response as Invoice
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Invoice
   * @param params - Operation parameters
   * @returns Invoice
   */
  private async invoiceGet(params: InvoiceGetParams): Promise<Invoice> {
    try {
      const response = await this.request('GET', '/v3/company/${params.realmId}/invoice/${params.invoice_id}', params)
      return response as Invoice
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Invoice
   * @param params - Operation parameters
   * @returns Invoice
   */
  private async invoiceUpdate(params: InvoiceUpdateParams): Promise<Invoice> {
    try {
      const response = await this.request('POST', '/v3/company/${params.realmId}/invoice', params)
      return response as Invoice
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Invoice
   * @param params - Operation parameters
   * @returns boolean
   */
  private async invoiceDelete(params: InvoiceDeleteParams): Promise<boolean> {
    try {
      const response = await this.request('POST', '/v3/company/${params.realmId}/invoice', params)
      return response as boolean
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Invoice
   * @param params - Operation parameters
   * @returns Invoice[]
   */
  private async invoiceList(params: InvoiceListParams): Promise<Invoice[]> {
    try {
      const response = await this.request('GET', '/v3/company/${params.realmId}/query', params)
      return response as Invoice[]
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Customer
   */
  private async customerCreate(params: CustomerCreateParams): Promise<Customer> {
    try {
      const response = await this.request('POST', '/v3/company/${params.realmId}/customer', params)
      return response as Customer
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Customer
   */
  private async customerGet(params: CustomerGetParams): Promise<Customer> {
    try {
      const response = await this.request('GET', '/v3/company/${params.realmId}/customer/${params.customer_id}', params)
      return response as Customer
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Customer
   */
  private async customerUpdate(params: CustomerUpdateParams): Promise<Customer> {
    try {
      const response = await this.request('POST', '/v3/company/${params.realmId}/customer', params)
      return response as Customer
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Customer
   * @param params - Operation parameters
   * @returns Customer[]
   */
  private async customerList(params: CustomerListParams): Promise<Customer[]> {
    try {
      const response = await this.request('GET', '/v3/company/${params.realmId}/query', params)
      return response as Customer[]
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Payment
   * @param params - Operation parameters
   * @returns Payment
   */
  private async paymentCreate(params: PaymentCreateParams): Promise<Payment> {
    try {
      const response = await this.request('POST', '/v3/company/${params.realmId}/payment', params)
      return response as Payment
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Payment
   * @param params - Operation parameters
   * @returns Payment
   */
  private async paymentGet(params: PaymentGetParams): Promise<Payment> {
    try {
      const response = await this.request('GET', '/v3/company/${params.realmId}/payment/${params.payment_id}', params)
      return response as Payment
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Payment
   * @param params - Operation parameters
   * @returns Payment
   */
  private async paymentUpdate(params: PaymentUpdateParams): Promise<Payment> {
    try {
      const response = await this.request('POST', '/v3/company/${params.realmId}/payment', params)
      return response as Payment
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Payment
   * @param params - Operation parameters
   * @returns Payment[]
   */
  private async paymentList(params: PaymentListParams): Promise<Payment[]> {
    try {
      const response = await this.request('GET', '/v3/company/${params.realmId}/query', params)
      return response as Payment[]
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Expense
   * @param params - Operation parameters
   * @returns Expense
   */
  private async expenseCreate(params: ExpenseCreateParams): Promise<Expense> {
    try {
      const response = await this.request('POST', '/v3/company/${params.realmId}/purchase', params)
      return response as Expense
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Expense
   * @param params - Operation parameters
   * @returns Expense
   */
  private async expenseGet(params: ExpenseGetParams): Promise<Expense> {
    try {
      const response = await this.request('GET', '/v3/company/${params.realmId}/purchase/${params.expense_id}', params)
      return response as Expense
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Expense
   * @param params - Operation parameters
   * @returns Expense
   */
  private async expenseUpdate(params: ExpenseUpdateParams): Promise<Expense> {
    try {
      const response = await this.request('POST', '/v3/company/${params.realmId}/purchase', params)
      return response as Expense
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * undefined Expense
   * @param params - Operation parameters
   * @returns Expense[]
   */
  private async expenseList(params: ExpenseListParams): Promise<Expense[]> {
    try {
      const response = await this.request('GET', '/v3/company/${params.realmId}/query', params)
      return response as Expense[]
    } catch (error) {
      throw QuickbooksError.fromError(error)
    }
  }

  /**
   * Make HTTP request
   * @param method - HTTP method
   * @param path - Request path
   * @param data - Request data
   * @returns Response data
   */
  private async request(method: string, path: string, data?: any): Promise<any> {
    const url = `${this.options.baseUrl}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.options.accessToken,
    }

    const config: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.options.timeout || 30000),
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data)
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }
}
