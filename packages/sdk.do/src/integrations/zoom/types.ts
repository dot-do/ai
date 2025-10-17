/**
 * Zoom Types
 *
 * Auto-generated TypeScript types for Zoom Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zoom
 */

/**
 * Zoom client options
 */
export interface ZoomClientOptions {
  /** OAuth2 access token */
  accessToken: string
  /** Base URL override (optional) */
  baseUrl?: string
  /** Request timeout in milliseconds (optional) */
  timeout?: number
  /** Number of retry attempts (optional) */
  retryAttempts?: number
}

/**
 * Meeting resource types
 */
/**
 * Parameters for Meeting.create
 */
export interface MeetingCreateParams {
  /** User ID or 'me' */
  userId: string
  /** Meeting topic */
  topic: string
  /** Meeting type (1=instant, 2=scheduled, 3=recurring, 8=recurring with fixed time) */
  type?: number
  /** Meeting start time (ISO 8601) */
  start_time?: string
  /** Meeting duration in minutes */
  duration?: number
  /** Timezone (e.g., America/New_York) */
  timezone?: string
  /** Meeting password */
  password?: string
  /** Meeting agenda */
  agenda?: string
  /** Meeting settings */
  settings?: Record<string, any>
}

/**
 * Parameters for Meeting.get
 */
export interface MeetingGetParams {
  /** Meeting ID */
  meetingId: string
}

/**
 * Parameters for Meeting.update
 */
export interface MeetingUpdateParams {
  /** Meeting ID */
  meetingId: string
  /** New meeting topic */
  topic?: string
  /** New start time */
  start_time?: string
  /** New duration */
  duration?: number
}

/**
 * Parameters for Meeting.delete
 */
export interface MeetingDeleteParams {
  /** Meeting ID */
  meetingId: string
}

/**
 * Parameters for Meeting.list
 */
export interface MeetingListParams {
  /** User ID or 'me' */
  userId: string
  /** Meeting type (scheduled, live, upcoming) */
  type?: string
  /** Number of records per page */
  page_size?: number
}

/**
 * Webinar resource types
 */
/**
 * Parameters for Webinar.create
 */
export interface WebinarCreateParams {
  /** User ID or 'me' */
  userId: string
  /** Webinar topic */
  topic: string
  /** Webinar type (5=webinar, 6=recurring, 9=recurring with fixed time) */
  type: number
  /** Webinar start time */
  start_time?: string
  /** Duration in minutes */
  duration?: number
  /** Webinar agenda */
  agenda?: string
}

/**
 * Parameters for Webinar.get
 */
export interface WebinarGetParams {
  /** Webinar ID */
  webinarId: string
}

/**
 * Parameters for Webinar.update
 */
export interface WebinarUpdateParams {
  /** Webinar ID */
  webinarId: string
  /** New webinar topic */
  topic?: string
}

/**
 * Parameters for Webinar.delete
 */
export interface WebinarDeleteParams {
  /** Webinar ID */
  webinarId: string
}

/**
 * User resource types
 */
/**
 * Parameters for User.get
 */
export interface UserGetParams {
  /** User ID or email */
  userId: string
}

/**
 * Parameters for User.list
 */
export interface UserListParams {
  /** User status (active, inactive, pending) */
  status?: string
  /** Number of users per page */
  page_size?: number
}

/**
 * Recording resource types
 */
/**
 * Parameters for Recording.list
 */
export interface RecordingListParams {
  /** User ID or 'me' */
  userId: string
  /** Start date (YYYY-MM-DD) */
  from?: string
  /** End date (YYYY-MM-DD) */
  to?: string
}

/**
 * Parameters for Recording.get
 */
export interface RecordingGetParams {
  /** Meeting ID */
  meetingId: string
}

/**
 * Parameters for Recording.delete
 */
export interface RecordingDeleteParams {
  /** Meeting ID */
  meetingId: string
}
