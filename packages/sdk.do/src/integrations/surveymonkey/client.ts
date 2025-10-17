/**
 * SurveyMonkey Client
 *
 * Auto-generated Integration client for SurveyMonkey.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/surveymonkey
 */

import {
  SurveyCreateParams,
  SurveyGetParams,
  SurveyUpdateParams,
  SurveyDeleteParams,
  SurveyListParams,
  ResponseGetParams,
  ResponseListParams,
} from './types.js'
import { SurveymonkeyError } from './errors.js'

/**
 * SurveyMonkey client options
 */
export interface SurveymonkeyClientOptions {
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
 * SurveyMonkey Client
 *
 * Online survey creation and analysis platform
 */
export class SurveymonkeyClient {
  private options: SurveymonkeyClientOptions

  /**
   * Survey resource
   * Create and manage surveys
   */
  public survey: {
    /** undefined Survey */
    create: (params: SurveyCreateParams) => Promise<Survey>
    /** undefined Survey */
    get: (params: SurveyGetParams) => Promise<Survey>
    /** undefined Survey */
    update: (params: SurveyUpdateParams) => Promise<Survey>
    /** undefined Survey */
    delete: (params: SurveyDeleteParams) => Promise<boolean>
    /** undefined Survey */
    list: (params: SurveyListParams) => Promise<Survey[]>
  }

  /**
   * Response resource
   * Access survey responses
   */
  public response: {
    /** undefined Response */
    get: (params: ResponseGetParams) => Promise<Response>
    /** undefined Response */
    list: (params: ResponseListParams) => Promise<Response[]>
  }

  constructor(options: SurveymonkeyClientOptions) {
    this.options = {
      baseUrl: 'https://api.surveymonkey.com/v3',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize resource namespaces
    this.survey = {
      create: this.surveyCreate.bind(this),
      get: this.surveyGet.bind(this),
      update: this.surveyUpdate.bind(this),
      delete: this.surveyDelete.bind(this),
      list: this.surveyList.bind(this),
    }
    this.response = {
      get: this.responseGet.bind(this),
      list: this.responseList.bind(this),
    }
  }

  /**
   * undefined Survey
   * @param params - Operation parameters
   * @returns Survey
   */
  private async surveyCreate(params: SurveyCreateParams): Promise<Survey> {
    try {
      const response = await this.request('POST', '/surveys', params)
      return response as Survey
    } catch (error) {
      throw SurveymonkeyError.fromError(error)
    }
  }

  /**
   * undefined Survey
   * @param params - Operation parameters
   * @returns Survey
   */
  private async surveyGet(params: SurveyGetParams): Promise<Survey> {
    try {
      const response = await this.request('GET', '/surveys/${params.survey_id}', params)
      return response as Survey
    } catch (error) {
      throw SurveymonkeyError.fromError(error)
    }
  }

  /**
   * undefined Survey
   * @param params - Operation parameters
   * @returns Survey
   */
  private async surveyUpdate(params: SurveyUpdateParams): Promise<Survey> {
    try {
      const response = await this.request('PATCH', '/surveys/${params.survey_id}', params)
      return response as Survey
    } catch (error) {
      throw SurveymonkeyError.fromError(error)
    }
  }

  /**
   * undefined Survey
   * @param params - Operation parameters
   * @returns boolean
   */
  private async surveyDelete(params: SurveyDeleteParams): Promise<boolean> {
    try {
      const response = await this.request('DELETE', '/surveys/${params.survey_id}', params)
      return response as boolean
    } catch (error) {
      throw SurveymonkeyError.fromError(error)
    }
  }

  /**
   * undefined Survey
   * @param params - Operation parameters
   * @returns Survey[]
   */
  private async surveyList(params: SurveyListParams): Promise<Survey[]> {
    try {
      const response = await this.request('GET', '/surveys', params)
      return response as Survey[]
    } catch (error) {
      throw SurveymonkeyError.fromError(error)
    }
  }

  /**
   * undefined Response
   * @param params - Operation parameters
   * @returns Response
   */
  private async responseGet(params: ResponseGetParams): Promise<Response> {
    try {
      const response = await this.request('GET', '/surveys/${params.survey_id}/responses/${params.response_id}', params)
      return response as Response
    } catch (error) {
      throw SurveymonkeyError.fromError(error)
    }
  }

  /**
   * undefined Response
   * @param params - Operation parameters
   * @returns Response[]
   */
  private async responseList(params: ResponseListParams): Promise<Response[]> {
    try {
      const response = await this.request('GET', '/surveys/${params.survey_id}/responses/bulk', params)
      return response as Response[]
    } catch (error) {
      throw SurveymonkeyError.fromError(error)
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
