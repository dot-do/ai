/**
 * Mixpanel Client
 *
 * Auto-generated Integration client for Mixpanel.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mixpanel
 */

import init from 'mixpanel'
import {
  EventTrackParams,
  EventImportParams,
  UserSetParams,
  UserIncrementParams,
  UserAppendParams,
  UserDeleteParams,
  CohortGetParams,
  CohortListParams,
  ReportInsightsParams,
  ReportFunnelsParams,
} from './types.js'
import { MixpanelError } from './errors.js'

/**
 * Mixpanel client options
 */
export interface MixpanelClientOptions {
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
 * Mixpanel Client
 *
 * Product analytics platform for tracking user behavior and engagement
 */
export class MixpanelClient {
  private options: MixpanelClientOptions
  private sdk: init

  /**
   * Event resource
   * Track user events
   */
  public event: {
    /** undefined Event */
    track: (params: EventTrackParams) => Promise<Event>
    /** undefined Event */
    import: (params: EventImportParams) => Promise<Event>
  }

  /**
   * User resource
   * Manage user profiles
   */
  public user: {
    /** undefined User */
    set: (params: UserSetParams) => Promise<User>
    /** undefined User */
    increment: (params: UserIncrementParams) => Promise<User>
    /** undefined User */
    append: (params: UserAppendParams) => Promise<User>
    /** undefined User */
    delete: (params: UserDeleteParams) => Promise<boolean>
  }

  /**
   * Cohort resource
   * Manage user cohorts
   */
  public cohort: {
    /** undefined Cohort */
    get: (params: CohortGetParams) => Promise<Cohort[]>
    /** undefined Cohort */
    list: (params: CohortListParams) => Promise<Cohort[]>
  }

  /**
   * Report resource
   * Query analytics reports
   */
  public report: {
    /** undefined Report */
    insights: (params: ReportInsightsParams) => Promise<Report>
    /** undefined Report */
    funnels: (params: ReportFunnelsParams) => Promise<Report>
  }

  constructor(options: MixpanelClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new init(this.options.apiKey, {})

    // Initialize resource namespaces
    this.event = {
      track: this.eventTrack.bind(this),
      import: this.eventImport.bind(this),
    }
    this.user = {
      set: this.userSet.bind(this),
      increment: this.userIncrement.bind(this),
      append: this.userAppend.bind(this),
      delete: this.userDelete.bind(this),
    }
    this.cohort = {
      get: this.cohortGet.bind(this),
      list: this.cohortList.bind(this),
    }
    this.report = {
      insights: this.reportInsights.bind(this),
      funnels: this.reportFunnels.bind(this),
    }
  }

  /**
   * undefined Event
   * @param params - Operation parameters
   * @returns Event
   */
  private async eventTrack(params: EventTrackParams): Promise<Event> {
    try {
      const result = await this.sdk.events.POST(params)
      return result
    } catch (error) {
      throw MixpanelError.fromError(error)
    }
  }

  /**
   * undefined Event
   * @param params - Operation parameters
   * @returns Event
   */
  private async eventImport(params: EventImportParams): Promise<Event> {
    try {
      const result = await this.sdk.events.POST(params)
      return result
    } catch (error) {
      throw MixpanelError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns User
   */
  private async userSet(params: UserSetParams): Promise<User> {
    try {
      const result = await this.sdk.users.POST(params)
      return result
    } catch (error) {
      throw MixpanelError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns User
   */
  private async userIncrement(params: UserIncrementParams): Promise<User> {
    try {
      const result = await this.sdk.users.POST(params)
      return result
    } catch (error) {
      throw MixpanelError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns User
   */
  private async userAppend(params: UserAppendParams): Promise<User> {
    try {
      const result = await this.sdk.users.POST(params)
      return result
    } catch (error) {
      throw MixpanelError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns boolean
   */
  private async userDelete(params: UserDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.users.POST(params)
      return result
    } catch (error) {
      throw MixpanelError.fromError(error)
    }
  }

  /**
   * undefined Cohort
   * @param params - Operation parameters
   * @returns Cohort[]
   */
  private async cohortGet(params: CohortGetParams): Promise<Cohort[]> {
    try {
      const result = await this.sdk.cohorts.GET(params)
      return result
    } catch (error) {
      throw MixpanelError.fromError(error)
    }
  }

  /**
   * undefined Cohort
   * @param params - Operation parameters
   * @returns Cohort[]
   */
  private async cohortList(params: CohortListParams): Promise<Cohort[]> {
    try {
      const result = await this.sdk.cohorts.GET(params)
      return result
    } catch (error) {
      throw MixpanelError.fromError(error)
    }
  }

  /**
   * undefined Report
   * @param params - Operation parameters
   * @returns Report
   */
  private async reportInsights(params: ReportInsightsParams): Promise<Report> {
    try {
      const result = await this.sdk.reports.GET(params)
      return result
    } catch (error) {
      throw MixpanelError.fromError(error)
    }
  }

  /**
   * undefined Report
   * @param params - Operation parameters
   * @returns Report
   */
  private async reportFunnels(params: ReportFunnelsParams): Promise<Report> {
    try {
      const result = await this.sdk.reports.GET(params)
      return result
    } catch (error) {
      throw MixpanelError.fromError(error)
    }
  }
}
