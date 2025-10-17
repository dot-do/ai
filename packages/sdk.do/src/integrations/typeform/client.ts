/**
 * Typeform Client
 *
 * Auto-generated Integration client for Typeform.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/typeform
 */

import createClient from '@typeform/api-client'
import {
  FormCreateParams,
  FormGetParams,
  FormUpdateParams,
  FormDeleteParams,
  FormListParams,
  ResponseGetParams,
  ResponseListParams,
  ResponseDeleteParams,
  WebhookCreateParams,
  WebhookGetParams,
  WebhookDeleteParams,
  ThemeCreateParams,
  ThemeGetParams,
  ThemeUpdateParams,
  ThemeDeleteParams,
  ThemeListParams,
} from './types.js'
import { TypeformError } from './errors.js'

/**
 * Typeform client options
 */
export interface TypeformClientOptions {
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
 * Typeform Client
 *
 * Online form builder for surveys, quizzes, and data collection
 */
export class TypeformClient {
  private options: TypeformClientOptions
  private sdk: createClient

  /**
   * Form resource
   * Create and manage forms
   */
  public form: {
    /** undefined Form */
    create: (params: FormCreateParams) => Promise<Form>
    /** undefined Form */
    get: (params: FormGetParams) => Promise<Form>
    /** undefined Form */
    update: (params: FormUpdateParams) => Promise<Form>
    /** undefined Form */
    delete: (params: FormDeleteParams) => Promise<boolean>
    /** undefined Form */
    list: (params: FormListParams) => Promise<Form[]>
  }

  /**
   * Response resource
   * Retrieve and manage form responses
   */
  public response: {
    /** undefined Response */
    get: (params: ResponseGetParams) => Promise<Response>
    /** undefined Response */
    list: (params: ResponseListParams) => Promise<Response[]>
    /** undefined Response */
    delete: (params: ResponseDeleteParams) => Promise<boolean>
  }

  /**
   * Webhook resource
   * Create and manage webhooks
   */
  public webhook: {
    /** undefined Webhook */
    create: (params: WebhookCreateParams) => Promise<Webhook>
    /** undefined Webhook */
    get: (params: WebhookGetParams) => Promise<Webhook>
    /** undefined Webhook */
    delete: (params: WebhookDeleteParams) => Promise<boolean>
  }

  /**
   * Theme resource
   * Create and manage form themes
   */
  public theme: {
    /** undefined Theme */
    create: (params: ThemeCreateParams) => Promise<Theme>
    /** undefined Theme */
    get: (params: ThemeGetParams) => Promise<Theme>
    /** undefined Theme */
    update: (params: ThemeUpdateParams) => Promise<Theme>
    /** undefined Theme */
    delete: (params: ThemeDeleteParams) => Promise<boolean>
    /** undefined Theme */
    list: (params: ThemeListParams) => Promise<Theme[]>
  }

  constructor(options: TypeformClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new createClient(this.options.apiKey, {})

    // Initialize resource namespaces
    this.form = {
      create: this.formCreate.bind(this),
      get: this.formGet.bind(this),
      update: this.formUpdate.bind(this),
      delete: this.formDelete.bind(this),
      list: this.formList.bind(this),
    }
    this.response = {
      get: this.responseGet.bind(this),
      list: this.responseList.bind(this),
      delete: this.responseDelete.bind(this),
    }
    this.webhook = {
      create: this.webhookCreate.bind(this),
      get: this.webhookGet.bind(this),
      delete: this.webhookDelete.bind(this),
    }
    this.theme = {
      create: this.themeCreate.bind(this),
      get: this.themeGet.bind(this),
      update: this.themeUpdate.bind(this),
      delete: this.themeDelete.bind(this),
      list: this.themeList.bind(this),
    }
  }

  /**
   * undefined Form
   * @param params - Operation parameters
   * @returns Form
   */
  private async formCreate(params: FormCreateParams): Promise<Form> {
    try {
      const result = await this.sdk.forms.POST(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Form
   * @param params - Operation parameters
   * @returns Form
   */
  private async formGet(params: FormGetParams): Promise<Form> {
    try {
      const result = await this.sdk.forms.GET(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Form
   * @param params - Operation parameters
   * @returns Form
   */
  private async formUpdate(params: FormUpdateParams): Promise<Form> {
    try {
      const result = await this.sdk.forms.PUT(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Form
   * @param params - Operation parameters
   * @returns boolean
   */
  private async formDelete(params: FormDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.forms.DELETE(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Form
   * @param params - Operation parameters
   * @returns Form[]
   */
  private async formList(params: FormListParams): Promise<Form[]> {
    try {
      const result = await this.sdk.forms.GET(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Response
   * @param params - Operation parameters
   * @returns Response
   */
  private async responseGet(params: ResponseGetParams): Promise<Response> {
    try {
      const result = await this.sdk.responses.GET(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Response
   * @param params - Operation parameters
   * @returns Response[]
   */
  private async responseList(params: ResponseListParams): Promise<Response[]> {
    try {
      const result = await this.sdk.responses.GET(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Response
   * @param params - Operation parameters
   * @returns boolean
   */
  private async responseDelete(params: ResponseDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.responses.DELETE(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Webhook
   * @param params - Operation parameters
   * @returns Webhook
   */
  private async webhookCreate(params: WebhookCreateParams): Promise<Webhook> {
    try {
      const result = await this.sdk.webhooks.PUT(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Webhook
   * @param params - Operation parameters
   * @returns Webhook
   */
  private async webhookGet(params: WebhookGetParams): Promise<Webhook> {
    try {
      const result = await this.sdk.webhooks.GET(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Webhook
   * @param params - Operation parameters
   * @returns boolean
   */
  private async webhookDelete(params: WebhookDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.webhooks.DELETE(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Theme
   * @param params - Operation parameters
   * @returns Theme
   */
  private async themeCreate(params: ThemeCreateParams): Promise<Theme> {
    try {
      const result = await this.sdk.themes.POST(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Theme
   * @param params - Operation parameters
   * @returns Theme
   */
  private async themeGet(params: ThemeGetParams): Promise<Theme> {
    try {
      const result = await this.sdk.themes.GET(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Theme
   * @param params - Operation parameters
   * @returns Theme
   */
  private async themeUpdate(params: ThemeUpdateParams): Promise<Theme> {
    try {
      const result = await this.sdk.themes.PUT(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Theme
   * @param params - Operation parameters
   * @returns boolean
   */
  private async themeDelete(params: ThemeDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.themes.DELETE(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }

  /**
   * undefined Theme
   * @param params - Operation parameters
   * @returns Theme[]
   */
  private async themeList(params: ThemeListParams): Promise<Theme[]> {
    try {
      const result = await this.sdk.themes.GET(params)
      return result
    } catch (error) {
      throw TypeformError.fromError(error)
    }
  }
}
