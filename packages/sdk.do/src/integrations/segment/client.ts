/**
 * Segment Client
 *
 * Auto-generated Integration client for Segment.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/segment
 */

import Analytics from '@segment/analytics-node'
import { EventTrackParams, EventBatchParams, IdentifyIdentifyParams, GroupGroupParams, PagePageParams } from './types.js'
import { SegmentError } from './errors.js'

/**
 * Segment client options
 */
export interface SegmentClientOptions {
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
 * Segment Client
 *
 * Customer data platform for collecting, cleaning, and controlling data
 */
export class SegmentClient {
  private options: SegmentClientOptions
  private sdk: Analytics

  /**
   * Event resource
   * Track user events and actions
   */
  public event: {
    /** undefined Event */
    track: (params: EventTrackParams) => Promise<Event>
    /** undefined Event */
    batch: (params: EventBatchParams) => Promise<boolean>
  }

  /**
   * Identify resource
   * Identify users and their traits
   */
  public identify: {
    /** undefined Identify */
    identify: (params: IdentifyIdentifyParams) => Promise<Identify>
  }

  /**
   * Group resource
   * Associate users with groups
   */
  public group: {
    /** undefined Group */
    group: (params: GroupGroupParams) => Promise<Group>
  }

  /**
   * Page resource
   * Track page views
   */
  public page: {
    /** undefined Page */
    page: (params: PagePageParams) => Promise<Page>
  }

  constructor(options: SegmentClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Analytics(this.options.apiKey, {})

    // Initialize resource namespaces
    this.event = {
      track: this.eventTrack.bind(this),
      batch: this.eventBatch.bind(this),
    }
    this.identify = {
      identify: this.identifyIdentify.bind(this),
    }
    this.group = {
      group: this.groupGroup.bind(this),
    }
    this.page = {
      page: this.pagePage.bind(this),
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
      throw SegmentError.fromError(error)
    }
  }

  /**
   * undefined Event
   * @param params - Operation parameters
   * @returns boolean
   */
  private async eventBatch(params: EventBatchParams): Promise<boolean> {
    try {
      const result = await this.sdk.events.POST(params)
      return result
    } catch (error) {
      throw SegmentError.fromError(error)
    }
  }

  /**
   * undefined Identify
   * @param params - Operation parameters
   * @returns Identify
   */
  private async identifyIdentify(params: IdentifyIdentifyParams): Promise<Identify> {
    try {
      const result = await this.sdk.identifies.POST(params)
      return result
    } catch (error) {
      throw SegmentError.fromError(error)
    }
  }

  /**
   * undefined Group
   * @param params - Operation parameters
   * @returns Group
   */
  private async groupGroup(params: GroupGroupParams): Promise<Group> {
    try {
      const result = await this.sdk.groups.POST(params)
      return result
    } catch (error) {
      throw SegmentError.fromError(error)
    }
  }

  /**
   * undefined Page
   * @param params - Operation parameters
   * @returns Page
   */
  private async pagePage(params: PagePageParams): Promise<Page> {
    try {
      const result = await this.sdk.pages.POST(params)
      return result
    } catch (error) {
      throw SegmentError.fromError(error)
    }
  }
}
