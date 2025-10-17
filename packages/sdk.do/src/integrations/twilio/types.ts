/**
 * Twilio Types
 *
 * Auto-generated TypeScript types for Twilio Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/twilio
 */

/**
 * Twilio client options
 */
export interface TwilioClientOptions {
  /** API key for authentication */
  apiKey: string
  /** Base URL override (optional) */
  baseUrl?: string
  /** Request timeout in milliseconds (optional) */
  timeout?: number
  /** Number of retry attempts (optional) */
  retryAttempts?: number
}

/**
 * Message resource types
 */
/**
 * Parameters for Message.create
 */
export interface MessageCreateParams {
  /** Phone number to send from (E.164 format) */
  from: string
  /** Phone number to send to (E.164 format) */
  to: string
  /** Message body (up to 1600 characters) */
  body: string
  /** Media URLs for MMS */
  mediaUrl?: any
  /** URL to receive status callbacks */
  statusCallback?: string
  /** Messaging Service SID (alternative to from) */
  messagingServiceSid?: string
  /** Maximum price willing to pay for message */
  maxPrice?: number
  /** Number of seconds message is valid */
  validityPeriod?: number
}

/**
 * Parameters for Message.get
 */
export interface MessageGetParams {
  /** Message SID */
  sid: string
}

/**
 * Parameters for Message.list
 */
export interface MessageListParams {
  /** Filter by to phone number */
  to?: string
  /** Filter by from phone number */
  from?: string
  /** Filter by date sent */
  dateSent?: any
  /** Maximum number of messages to return */
  limit?: number
}

/**
 * Parameters for Message.delete
 */
export interface MessageDeleteParams {
  /** Message SID */
  sid: string
}

/**
 * Call resource types
 */
/**
 * Parameters for Call.create
 */
export interface CallCreateParams {
  /** Phone number to call from (E.164 format) */
  from: string
  /** Phone number to call (E.164 format) */
  to: string
  /** TwiML instructions URL */
  url?: string
  /** Inline TwiML instructions */
  twiml?: string
  /** URL to receive call status callbacks */
  statusCallback?: string
  /** Timeout in seconds before call is considered unanswered */
  timeout?: number
  /** Record the call */
  record?: boolean
  /** Machine detection (Enable or DetectMessageEnd) */
  machineDetection?: string
}

/**
 * Parameters for Call.get
 */
export interface CallGetParams {
  /** Call SID */
  sid: string
}

/**
 * Parameters for Call.update
 */
export interface CallUpdateParams {
  /** Call SID */
  sid: string
  /** New TwiML instructions URL */
  url?: string
  /** New TwiML instructions */
  twiml?: string
  /** New call status (canceled or completed) */
  status?: string
}

/**
 * Parameters for Call.list
 */
export interface CallListParams {
  /** Filter by to phone number */
  to?: string
  /** Filter by from phone number */
  from?: string
  /** Filter by call status */
  status?: string
  /** Maximum number of calls to return */
  limit?: number
}

/**
 * PhoneNumber resource types
 */
/**
 * Parameters for PhoneNumber.create
 */
export interface PhoneNumberCreateParams {
  /** Phone number to purchase (E.164 format) */
  phoneNumber: string
  /** Friendly name for the number */
  friendlyName?: string
  /** Voice URL for incoming calls */
  voiceUrl?: string
  /** SMS URL for incoming messages */
  smsUrl?: string
}

/**
 * Parameters for PhoneNumber.get
 */
export interface PhoneNumberGetParams {
  /** Phone number SID */
  sid: string
}

/**
 * Parameters for PhoneNumber.list
 */
export interface PhoneNumberListParams {
  /** Maximum number of phone numbers to return */
  limit?: number
}

/**
 * Parameters for PhoneNumber.delete
 */
export interface PhoneNumberDeleteParams {
  /** Phone number SID */
  sid: string
}

/**
 * MessagingService resource types
 */
/**
 * Parameters for MessagingService.create
 */
export interface MessagingServiceCreateParams {
  /** Friendly name for the service */
  friendlyName: string
  /** URL for inbound message requests */
  inboundRequestUrl?: string
  /** URL for status callbacks */
  statusCallback?: string
}

/**
 * Parameters for MessagingService.get
 */
export interface MessagingServiceGetParams {
  /** Service SID */
  sid: string
}

/**
 * Parameters for MessagingService.list
 */
export interface MessagingServiceListParams {
  /** Maximum number of services to return */
  limit?: number
}

/**
 * Verification resource types
 */
/**
 * Parameters for Verification.sendCode
 */
export interface VerificationSendCodeParams {
  /** Verify service SID */
  serviceSid: string
  /** Phone number to verify (E.164 format) */
  to: string
  /** Verification channel (sms, call, or email) */
  channel: string
  /** Custom code length (4-10 digits) */
  codeLength?: number
  /** Locale for message */
  locale?: string
}

/**
 * Parameters for Verification.checkCode
 */
export interface VerificationCheckCodeParams {
  /** Verify service SID */
  serviceSid: string
  /** Phone number being verified (E.164 format) */
  to: string
  /** Verification code to check */
  code: string
}

/**
 * Conference resource types
 */
/**
 * Parameters for Conference.create
 */
export interface ConferenceCreateParams {
  /** Friendly name for the conference */
  friendlyName: string
  /** Status callback URL */
  statusCallback?: string
  /** Record the conference */
  record?: boolean
}

/**
 * Parameters for Conference.get
 */
export interface ConferenceGetParams {
  /** Conference SID */
  sid: string
}

/**
 * Parameters for Conference.list
 */
export interface ConferenceListParams {
  /** Filter by conference name */
  friendlyName?: string
  /** Filter by conference status */
  status?: string
  /** Maximum number of conferences to return */
  limit?: number
}

/**
 * Parameters for Conference.listParticipants
 */
export interface ConferenceListParticipantsParams {
  /** Conference SID */
  conferenceSid: string
}

/**
 * Recording resource types
 */
/**
 * Parameters for Recording.get
 */
export interface RecordingGetParams {
  /** Recording SID */
  sid: string
}

/**
 * Parameters for Recording.list
 */
export interface RecordingListParams {
  /** Filter by call SID */
  callSid?: string
  /** Filter by conference SID */
  conferenceSid?: string
  /** Maximum number of recordings to return */
  limit?: number
}

/**
 * Parameters for Recording.delete
 */
export interface RecordingDeleteParams {
  /** Recording SID */
  sid: string
}

/**
 * SDK type re-exports
 */
export type * from 'twilio'
