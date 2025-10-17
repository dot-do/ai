/**
 * Zoom Client
 *
 * Auto-generated Integration client for Zoom.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zoom
 */

import {
  MeetingCreateParams,
  MeetingGetParams,
  MeetingUpdateParams,
  MeetingDeleteParams,
  MeetingListParams,
  WebinarCreateParams,
  WebinarGetParams,
  WebinarUpdateParams,
  WebinarDeleteParams,
  UserGetParams,
  UserListParams,
  RecordingListParams,
  RecordingGetParams,
  RecordingDeleteParams,
} from './types.js'
import { ZoomError } from './errors.js'

/**
 * Zoom client options
 */
export interface ZoomClientOptions {
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
 * Zoom Client
 *
 * Video conferencing and virtual meeting platform
 */
export class ZoomClient {
  private options: ZoomClientOptions

  /**
   * Meeting resource
   * Schedule and manage Zoom meetings
   */
  public meeting: {
    /** undefined Meeting */
    create: (params: MeetingCreateParams) => Promise<Meeting>
    /** undefined Meeting */
    get: (params: MeetingGetParams) => Promise<Meeting>
    /** undefined Meeting */
    update: (params: MeetingUpdateParams) => Promise<Meeting>
    /** undefined Meeting */
    delete: (params: MeetingDeleteParams) => Promise<boolean>
    /** undefined Meeting */
    list: (params: MeetingListParams) => Promise<Meeting[]>
  }

  /**
   * Webinar resource
   * Create and manage webinars
   */
  public webinar: {
    /** undefined Webinar */
    create: (params: WebinarCreateParams) => Promise<Webinar>
    /** undefined Webinar */
    get: (params: WebinarGetParams) => Promise<Webinar>
    /** undefined Webinar */
    update: (params: WebinarUpdateParams) => Promise<Webinar>
    /** undefined Webinar */
    delete: (params: WebinarDeleteParams) => Promise<boolean>
  }

  /**
   * User resource
   * Manage Zoom users
   */
  public user: {
    /** undefined User */
    get: (params: UserGetParams) => Promise<User>
    /** undefined User */
    list: (params: UserListParams) => Promise<User[]>
  }

  /**
   * Recording resource
   * Manage cloud recordings
   */
  public recording: {
    /** undefined Recording */
    list: (params: RecordingListParams) => Promise<Recording[]>
    /** undefined Recording */
    get: (params: RecordingGetParams) => Promise<Recording>
    /** undefined Recording */
    delete: (params: RecordingDeleteParams) => Promise<boolean>
  }

  constructor(options: ZoomClientOptions) {
    this.options = {
      baseUrl: 'https://api.zoom.us/v2',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize resource namespaces
    this.meeting = {
      create: this.meetingCreate.bind(this),
      get: this.meetingGet.bind(this),
      update: this.meetingUpdate.bind(this),
      delete: this.meetingDelete.bind(this),
      list: this.meetingList.bind(this),
    }
    this.webinar = {
      create: this.webinarCreate.bind(this),
      get: this.webinarGet.bind(this),
      update: this.webinarUpdate.bind(this),
      delete: this.webinarDelete.bind(this),
    }
    this.user = {
      get: this.userGet.bind(this),
      list: this.userList.bind(this),
    }
    this.recording = {
      list: this.recordingList.bind(this),
      get: this.recordingGet.bind(this),
      delete: this.recordingDelete.bind(this),
    }
  }

  /**
   * undefined Meeting
   * @param params - Operation parameters
   * @returns Meeting
   */
  private async meetingCreate(params: MeetingCreateParams): Promise<Meeting> {
    try {
      const response = await this.request('POST', '/users/${params.userId}/meetings', params)
      return response as Meeting
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined Meeting
   * @param params - Operation parameters
   * @returns Meeting
   */
  private async meetingGet(params: MeetingGetParams): Promise<Meeting> {
    try {
      const response = await this.request('GET', '/meetings/${params.meetingId}', params)
      return response as Meeting
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined Meeting
   * @param params - Operation parameters
   * @returns Meeting
   */
  private async meetingUpdate(params: MeetingUpdateParams): Promise<Meeting> {
    try {
      const response = await this.request('PATCH', '/meetings/${params.meetingId}', params)
      return response as Meeting
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined Meeting
   * @param params - Operation parameters
   * @returns boolean
   */
  private async meetingDelete(params: MeetingDeleteParams): Promise<boolean> {
    try {
      const response = await this.request('DELETE', '/meetings/${params.meetingId}', params)
      return response as boolean
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined Meeting
   * @param params - Operation parameters
   * @returns Meeting[]
   */
  private async meetingList(params: MeetingListParams): Promise<Meeting[]> {
    try {
      const response = await this.request('GET', '/users/${params.userId}/meetings', params)
      return response as Meeting[]
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined Webinar
   * @param params - Operation parameters
   * @returns Webinar
   */
  private async webinarCreate(params: WebinarCreateParams): Promise<Webinar> {
    try {
      const response = await this.request('POST', '/users/${params.userId}/webinars', params)
      return response as Webinar
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined Webinar
   * @param params - Operation parameters
   * @returns Webinar
   */
  private async webinarGet(params: WebinarGetParams): Promise<Webinar> {
    try {
      const response = await this.request('GET', '/webinars/${params.webinarId}', params)
      return response as Webinar
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined Webinar
   * @param params - Operation parameters
   * @returns Webinar
   */
  private async webinarUpdate(params: WebinarUpdateParams): Promise<Webinar> {
    try {
      const response = await this.request('PATCH', '/webinars/${params.webinarId}', params)
      return response as Webinar
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined Webinar
   * @param params - Operation parameters
   * @returns boolean
   */
  private async webinarDelete(params: WebinarDeleteParams): Promise<boolean> {
    try {
      const response = await this.request('DELETE', '/webinars/${params.webinarId}', params)
      return response as boolean
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns User
   */
  private async userGet(params: UserGetParams): Promise<User> {
    try {
      const response = await this.request('GET', '/users/${params.userId}', params)
      return response as User
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns User[]
   */
  private async userList(params: UserListParams): Promise<User[]> {
    try {
      const response = await this.request('GET', '/users', params)
      return response as User[]
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined Recording
   * @param params - Operation parameters
   * @returns Recording[]
   */
  private async recordingList(params: RecordingListParams): Promise<Recording[]> {
    try {
      const response = await this.request('GET', '/users/${params.userId}/recordings', params)
      return response as Recording[]
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined Recording
   * @param params - Operation parameters
   * @returns Recording
   */
  private async recordingGet(params: RecordingGetParams): Promise<Recording> {
    try {
      const response = await this.request('GET', '/meetings/${params.meetingId}/recordings', params)
      return response as Recording
    } catch (error) {
      throw ZoomError.fromError(error)
    }
  }

  /**
   * undefined Recording
   * @param params - Operation parameters
   * @returns boolean
   */
  private async recordingDelete(params: RecordingDeleteParams): Promise<boolean> {
    try {
      const response = await this.request('DELETE', '/meetings/${params.meetingId}/recordings', params)
      return response as boolean
    } catch (error) {
      throw ZoomError.fromError(error)
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
