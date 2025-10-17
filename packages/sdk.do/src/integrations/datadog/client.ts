/**
 * Datadog Client
 *
 * Auto-generated Integration client for Datadog.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/datadog
 */

import client from '@datadog/datadog-api-client'
import {
  MetricSubmitParams,
  MetricQueryParams,
  MetricListParams,
  EventCreateParams,
  EventGetParams,
  EventListParams,
  MonitorCreateParams,
  MonitorGetParams,
  MonitorUpdateParams,
  MonitorDeleteParams,
  MonitorListParams,
  DashboardCreateParams,
  DashboardGetParams,
  DashboardUpdateParams,
  DashboardDeleteParams,
} from './types.js'
import { DatadogError } from './errors.js'

/**
 * Datadog client options
 */
export interface DatadogClientOptions {
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
 * Datadog Client
 *
 * Infrastructure monitoring, APM, and log management platform
 */
export class DatadogClient {
  private options: DatadogClientOptions
  private sdk: client

  /**
   * Metric resource
   * Submit and query metrics data
   */
  public metric: {
    /** undefined Metric */
    submit: (params: MetricSubmitParams) => Promise<Metric>
    /** undefined Metric */
    query: (params: MetricQueryParams) => Promise<Metric[]>
    /** undefined Metric */
    list: (params: MetricListParams) => Promise<Metric[]>
  }

  /**
   * Event resource
   * Post and retrieve events
   */
  public event: {
    /** undefined Event */
    create: (params: EventCreateParams) => Promise<Event>
    /** undefined Event */
    get: (params: EventGetParams) => Promise<Event>
    /** undefined Event */
    list: (params: EventListParams) => Promise<Event[]>
  }

  /**
   * Monitor resource
   * Create and manage monitors
   */
  public monitor: {
    /** undefined Monitor */
    create: (params: MonitorCreateParams) => Promise<Monitor>
    /** undefined Monitor */
    get: (params: MonitorGetParams) => Promise<Monitor>
    /** undefined Monitor */
    update: (params: MonitorUpdateParams) => Promise<Monitor>
    /** undefined Monitor */
    delete: (params: MonitorDeleteParams) => Promise<boolean>
    /** undefined Monitor */
    list: (params: MonitorListParams) => Promise<Monitor[]>
  }

  /**
   * Dashboard resource
   * Create and manage dashboards
   */
  public dashboard: {
    /** undefined Dashboard */
    create: (params: DashboardCreateParams) => Promise<Dashboard>
    /** undefined Dashboard */
    get: (params: DashboardGetParams) => Promise<Dashboard>
    /** undefined Dashboard */
    update: (params: DashboardUpdateParams) => Promise<Dashboard>
    /** undefined Dashboard */
    delete: (params: DashboardDeleteParams) => Promise<boolean>
    /** undefined Dashboard */
    list: () => Promise<Dashboard[]>
  }

  constructor(options: DatadogClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new client(this.options.apiKey, {})

    // Initialize resource namespaces
    this.metric = {
      submit: this.metricSubmit.bind(this),
      query: this.metricQuery.bind(this),
      list: this.metricList.bind(this),
    }
    this.event = {
      create: this.eventCreate.bind(this),
      get: this.eventGet.bind(this),
      list: this.eventList.bind(this),
    }
    this.monitor = {
      create: this.monitorCreate.bind(this),
      get: this.monitorGet.bind(this),
      update: this.monitorUpdate.bind(this),
      delete: this.monitorDelete.bind(this),
      list: this.monitorList.bind(this),
    }
    this.dashboard = {
      create: this.dashboardCreate.bind(this),
      get: this.dashboardGet.bind(this),
      update: this.dashboardUpdate.bind(this),
      delete: this.dashboardDelete.bind(this),
      list: this.dashboardList.bind(this),
    }
  }

  /**
   * undefined Metric
   * @param params - Operation parameters
   * @returns Metric
   */
  private async metricSubmit(params: MetricSubmitParams): Promise<Metric> {
    try {
      const result = await this.sdk.metrics.POST(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Metric
   * @param params - Operation parameters
   * @returns Metric[]
   */
  private async metricQuery(params: MetricQueryParams): Promise<Metric[]> {
    try {
      const result = await this.sdk.metrics.GET(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Metric
   * @param params - Operation parameters
   * @returns Metric[]
   */
  private async metricList(params: MetricListParams): Promise<Metric[]> {
    try {
      const result = await this.sdk.metrics.GET(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Event
   * @param params - Operation parameters
   * @returns Event
   */
  private async eventCreate(params: EventCreateParams): Promise<Event> {
    try {
      const result = await this.sdk.events.POST(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
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
      throw DatadogError.fromError(error)
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
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Monitor
   * @param params - Operation parameters
   * @returns Monitor
   */
  private async monitorCreate(params: MonitorCreateParams): Promise<Monitor> {
    try {
      const result = await this.sdk.monitors.POST(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Monitor
   * @param params - Operation parameters
   * @returns Monitor
   */
  private async monitorGet(params: MonitorGetParams): Promise<Monitor> {
    try {
      const result = await this.sdk.monitors.GET(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Monitor
   * @param params - Operation parameters
   * @returns Monitor
   */
  private async monitorUpdate(params: MonitorUpdateParams): Promise<Monitor> {
    try {
      const result = await this.sdk.monitors.PUT(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Monitor
   * @param params - Operation parameters
   * @returns boolean
   */
  private async monitorDelete(params: MonitorDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.monitors.DELETE(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Monitor
   * @param params - Operation parameters
   * @returns Monitor[]
   */
  private async monitorList(params: MonitorListParams): Promise<Monitor[]> {
    try {
      const result = await this.sdk.monitors.GET(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Dashboard
   * @param params - Operation parameters
   * @returns Dashboard
   */
  private async dashboardCreate(params: DashboardCreateParams): Promise<Dashboard> {
    try {
      const result = await this.sdk.dashboards.POST(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Dashboard
   * @param params - Operation parameters
   * @returns Dashboard
   */
  private async dashboardGet(params: DashboardGetParams): Promise<Dashboard> {
    try {
      const result = await this.sdk.dashboards.GET(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Dashboard
   * @param params - Operation parameters
   * @returns Dashboard
   */
  private async dashboardUpdate(params: DashboardUpdateParams): Promise<Dashboard> {
    try {
      const result = await this.sdk.dashboards.PUT(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Dashboard
   * @param params - Operation parameters
   * @returns boolean
   */
  private async dashboardDelete(params: DashboardDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.dashboards.DELETE(params)
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }

  /**
   * undefined Dashboard
   * @returns Dashboard[]
   */
  private async dashboardList(): Promise<Dashboard[]> {
    try {
      const result = await this.sdk.dashboards.GET()
      return result
    } catch (error) {
      throw DatadogError.fromError(error)
    }
  }
}
