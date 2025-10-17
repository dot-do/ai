/**
 * Sentry Client
 *
 * Auto-generated Integration client for Sentry.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sentry
 */

import Sentry from '@sentry/node'
import {
  EventGetParams,
  EventListParams,
  IssueGetParams,
  IssueUpdateParams,
  IssueDeleteParams,
  IssueListParams,
  ProjectCreateParams,
  ProjectGetParams,
  ProjectUpdateParams,
  ProjectDeleteParams,
  ProjectListParams,
  ReleaseCreateParams,
  ReleaseGetParams,
  ReleaseUpdateParams,
  ReleaseDeleteParams,
  ReleaseListParams,
} from './types.js'
import { SentryError } from './errors.js'

/**
 * Sentry client options
 */
export interface SentryClientOptions {
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
 * Sentry Client
 *
 * Error tracking and performance monitoring platform
 */
export class SentryClient {
  private options: SentryClientOptions
  private sdk: Sentry

  /**
   * Event resource
   * Error and exception events
   */
  public event: {
    /** undefined Event */
    get: (params: EventGetParams) => Promise<Event>
    /** undefined Event */
    list: (params: EventListParams) => Promise<Event[]>
  }

  /**
   * Issue resource
   * Grouped error events
   */
  public issue: {
    /** undefined Issue */
    get: (params: IssueGetParams) => Promise<Issue>
    /** undefined Issue */
    update: (params: IssueUpdateParams) => Promise<Issue>
    /** undefined Issue */
    delete: (params: IssueDeleteParams) => Promise<boolean>
    /** undefined Issue */
    list: (params: IssueListParams) => Promise<Issue[]>
  }

  /**
   * Project resource
   * Sentry projects
   */
  public project: {
    /** undefined Project */
    create: (params: ProjectCreateParams) => Promise<Project>
    /** undefined Project */
    get: (params: ProjectGetParams) => Promise<Project>
    /** undefined Project */
    update: (params: ProjectUpdateParams) => Promise<Project>
    /** undefined Project */
    delete: (params: ProjectDeleteParams) => Promise<boolean>
    /** undefined Project */
    list: (params: ProjectListParams) => Promise<Project[]>
  }

  /**
   * Release resource
   * Release tracking and deploys
   */
  public release: {
    /** undefined Release */
    create: (params: ReleaseCreateParams) => Promise<Release>
    /** undefined Release */
    get: (params: ReleaseGetParams) => Promise<Release>
    /** undefined Release */
    update: (params: ReleaseUpdateParams) => Promise<Release>
    /** undefined Release */
    delete: (params: ReleaseDeleteParams) => Promise<boolean>
    /** undefined Release */
    list: (params: ReleaseListParams) => Promise<Release[]>
  }

  constructor(options: SentryClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Sentry(this.options.apiKey, {})

    // Initialize resource namespaces
    this.event = {
      get: this.eventGet.bind(this),
      list: this.eventList.bind(this),
    }
    this.issue = {
      get: this.issueGet.bind(this),
      update: this.issueUpdate.bind(this),
      delete: this.issueDelete.bind(this),
      list: this.issueList.bind(this),
    }
    this.project = {
      create: this.projectCreate.bind(this),
      get: this.projectGet.bind(this),
      update: this.projectUpdate.bind(this),
      delete: this.projectDelete.bind(this),
      list: this.projectList.bind(this),
    }
    this.release = {
      create: this.releaseCreate.bind(this),
      get: this.releaseGet.bind(this),
      update: this.releaseUpdate.bind(this),
      delete: this.releaseDelete.bind(this),
      list: this.releaseList.bind(this),
    }
  }

  /**
   * undefined Event
   * @param params - Operation parameters
   * @returns Event
   */
  private async eventGet(params: EventGetParams): Promise<Event> {
    try {
      const result = await this.sdk.events.GET(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Event
   * @param params - Operation parameters
   * @returns Event[]
   */
  private async eventList(params: EventListParams): Promise<Event[]> {
    try {
      const result = await this.sdk.events.GET(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueGet(params: IssueGetParams): Promise<Issue> {
    try {
      const result = await this.sdk.issues.GET(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueUpdate(params: IssueUpdateParams): Promise<Issue> {
    try {
      const result = await this.sdk.issues.PUT(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns boolean
   */
  private async issueDelete(params: IssueDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.issues.DELETE(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue[]
   */
  private async issueList(params: IssueListParams): Promise<Issue[]> {
    try {
      const result = await this.sdk.issues.GET(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Project
   * @param params - Operation parameters
   * @returns Project
   */
  private async projectCreate(params: ProjectCreateParams): Promise<Project> {
    try {
      const result = await this.sdk.projects.POST(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Project
   * @param params - Operation parameters
   * @returns Project
   */
  private async projectGet(params: ProjectGetParams): Promise<Project> {
    try {
      const result = await this.sdk.projects.GET(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Project
   * @param params - Operation parameters
   * @returns Project
   */
  private async projectUpdate(params: ProjectUpdateParams): Promise<Project> {
    try {
      const result = await this.sdk.projects.PUT(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Project
   * @param params - Operation parameters
   * @returns boolean
   */
  private async projectDelete(params: ProjectDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.projects.DELETE(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Project
   * @param params - Operation parameters
   * @returns Project[]
   */
  private async projectList(params: ProjectListParams): Promise<Project[]> {
    try {
      const result = await this.sdk.projects.GET(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Release
   * @param params - Operation parameters
   * @returns Release
   */
  private async releaseCreate(params: ReleaseCreateParams): Promise<Release> {
    try {
      const result = await this.sdk.releases.POST(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Release
   * @param params - Operation parameters
   * @returns Release
   */
  private async releaseGet(params: ReleaseGetParams): Promise<Release> {
    try {
      const result = await this.sdk.releases.GET(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Release
   * @param params - Operation parameters
   * @returns Release
   */
  private async releaseUpdate(params: ReleaseUpdateParams): Promise<Release> {
    try {
      const result = await this.sdk.releases.PUT(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Release
   * @param params - Operation parameters
   * @returns boolean
   */
  private async releaseDelete(params: ReleaseDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.releases.DELETE(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }

  /**
   * undefined Release
   * @param params - Operation parameters
   * @returns Release[]
   */
  private async releaseList(params: ReleaseListParams): Promise<Release[]> {
    try {
      const result = await this.sdk.releases.GET(params)
      return result
    } catch (error) {
      throw SentryError.fromError(error)
    }
  }
}
