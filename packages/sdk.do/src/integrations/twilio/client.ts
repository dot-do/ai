/**
 * Twilio Client
 *
 * Auto-generated Integration client for Twilio.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/twilio
 */

import Twilio from 'twilio'
import {
  MessageCreateParams,
  MessageGetParams,
  MessageListParams,
  MessageDeleteParams,
  CallCreateParams,
  CallGetParams,
  CallUpdateParams,
  CallListParams,
  PhoneNumberCreateParams,
  PhoneNumberGetParams,
  PhoneNumberListParams,
  PhoneNumberDeleteParams,
  MessagingServiceCreateParams,
  MessagingServiceGetParams,
  MessagingServiceListParams,
  VerificationSendCodeParams,
  VerificationCheckCodeParams,
  ConferenceCreateParams,
  ConferenceGetParams,
  ConferenceListParams,
  ConferenceListParticipantsParams,
  RecordingGetParams,
  RecordingListParams,
  RecordingDeleteParams,
} from './types.js'
import { TwilioError } from './errors.js'

/**
 * Twilio client options
 */
export interface TwilioClientOptions {
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
 * Twilio Client
 *
 * Cloud communications platform for SMS, voice, video, and authentication
 */
export class TwilioClient {
  private options: TwilioClientOptions
  private sdk: Twilio

  /**
   * Message resource
   * Send and receive SMS and MMS messages
   */
  public message: {
    /** undefined Message */
    create: (params: MessageCreateParams) => Promise<SMSMessage>
    /** undefined Message */
    get: (params: MessageGetParams) => Promise<SMSMessage>
    /** undefined Message */
    list: (params: MessageListParams) => Promise<SMSMessage[]>
    /** undefined Message */
    delete: (params: MessageDeleteParams) => Promise<boolean>
  }

  /**
   * Call resource
   * Make and manage voice calls
   */
  public call: {
    /** undefined Call */
    create: (params: CallCreateParams) => Promise<Call>
    /** undefined Call */
    get: (params: CallGetParams) => Promise<Call>
    /** undefined Call */
    update: (params: CallUpdateParams) => Promise<Call>
    /** undefined Call */
    list: (params: CallListParams) => Promise<Call[]>
  }

  /**
   * PhoneNumber resource
   * Manage phone numbers in your account
   */
  public phoneNumber: {
    /** undefined PhoneNumber */
    create: (params: PhoneNumberCreateParams) => Promise<PhoneNumber>
    /** undefined PhoneNumber */
    get: (params: PhoneNumberGetParams) => Promise<PhoneNumber>
    /** undefined PhoneNumber */
    list: (params: PhoneNumberListParams) => Promise<PhoneNumber[]>
    /** undefined PhoneNumber */
    delete: (params: PhoneNumberDeleteParams) => Promise<boolean>
  }

  /**
   * MessagingService resource
   * Manage messaging services for scaled SMS operations
   */
  public messagingService: {
    /** undefined MessagingService */
    create: (params: MessagingServiceCreateParams) => Promise<MessagingService>
    /** undefined MessagingService */
    get: (params: MessagingServiceGetParams) => Promise<MessagingService>
    /** undefined MessagingService */
    list: (params: MessagingServiceListParams) => Promise<MessagingService[]>
  }

  /**
   * Verification resource
   * Send and verify codes for two-factor authentication
   */
  public verification: {
    /** undefined Verification */
    sendCode: (params: VerificationSendCodeParams) => Promise<any>
    /** undefined Verification */
    checkCode: (params: VerificationCheckCodeParams) => Promise<VerificationCheck>
  }

  /**
   * Conference resource
   * Manage conference calls
   */
  public conference: {
    /** undefined Conference */
    create: (params: ConferenceCreateParams) => Promise<Conference>
    /** undefined Conference */
    get: (params: ConferenceGetParams) => Promise<Conference>
    /** undefined Conference */
    list: (params: ConferenceListParams) => Promise<Conference[]>
    /** undefined Conference */
    listParticipants: (params: ConferenceListParticipantsParams) => Promise<ConferenceParticipant[]>
  }

  /**
   * Recording resource
   * Manage call and conference recordings
   */
  public recording: {
    /** undefined Recording */
    get: (params: RecordingGetParams) => Promise<Recording>
    /** undefined Recording */
    list: (params: RecordingListParams) => Promise<Recording[]>
    /** undefined Recording */
    delete: (params: RecordingDeleteParams) => Promise<boolean>
  }

  constructor(options: TwilioClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Twilio(this.options.apiKey, {})

    // Initialize resource namespaces
    this.message = {
      create: this.messageCreate.bind(this),
      get: this.messageGet.bind(this),
      list: this.messageList.bind(this),
      delete: this.messageDelete.bind(this),
    }
    this.call = {
      create: this.callCreate.bind(this),
      get: this.callGet.bind(this),
      update: this.callUpdate.bind(this),
      list: this.callList.bind(this),
    }
    this.phoneNumber = {
      create: this.phoneNumberCreate.bind(this),
      get: this.phoneNumberGet.bind(this),
      list: this.phoneNumberList.bind(this),
      delete: this.phoneNumberDelete.bind(this),
    }
    this.messagingService = {
      create: this.messagingServiceCreate.bind(this),
      get: this.messagingServiceGet.bind(this),
      list: this.messagingServiceList.bind(this),
    }
    this.verification = {
      sendCode: this.verificationSendCode.bind(this),
      checkCode: this.verificationCheckCode.bind(this),
    }
    this.conference = {
      create: this.conferenceCreate.bind(this),
      get: this.conferenceGet.bind(this),
      list: this.conferenceList.bind(this),
      listParticipants: this.conferenceListParticipants.bind(this),
    }
    this.recording = {
      get: this.recordingGet.bind(this),
      list: this.recordingList.bind(this),
      delete: this.recordingDelete.bind(this),
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns SMSMessage
   */
  private async messageCreate(params: MessageCreateParams): Promise<SMSMessage> {
    try {
      const result = await this.sdk.messages.create(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns SMSMessage
   */
  private async messageGet(params: MessageGetParams): Promise<SMSMessage> {
    try {
      const result = await this.sdk.messages.fetch(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns SMSMessage[]
   */
  private async messageList(params: MessageListParams): Promise<SMSMessage[]> {
    try {
      const result = await this.sdk.messages.list(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Message
   * @param params - Operation parameters
   * @returns boolean
   */
  private async messageDelete(params: MessageDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.messages.remove(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Call
   * @param params - Operation parameters
   * @returns Call
   */
  private async callCreate(params: CallCreateParams): Promise<Call> {
    try {
      const result = await this.sdk.calls.create(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Call
   * @param params - Operation parameters
   * @returns Call
   */
  private async callGet(params: CallGetParams): Promise<Call> {
    try {
      const result = await this.sdk.calls.fetch(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Call
   * @param params - Operation parameters
   * @returns Call
   */
  private async callUpdate(params: CallUpdateParams): Promise<Call> {
    try {
      const result = await this.sdk.calls.update(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Call
   * @param params - Operation parameters
   * @returns Call[]
   */
  private async callList(params: CallListParams): Promise<Call[]> {
    try {
      const result = await this.sdk.calls.list(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined PhoneNumber
   * @param params - Operation parameters
   * @returns PhoneNumber
   */
  private async phoneNumberCreate(params: PhoneNumberCreateParams): Promise<PhoneNumber> {
    try {
      const result = await this.sdk.incomingPhoneNumbers.create(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined PhoneNumber
   * @param params - Operation parameters
   * @returns PhoneNumber
   */
  private async phoneNumberGet(params: PhoneNumberGetParams): Promise<PhoneNumber> {
    try {
      const result = await this.sdk.incomingPhoneNumbers.fetch(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined PhoneNumber
   * @param params - Operation parameters
   * @returns PhoneNumber[]
   */
  private async phoneNumberList(params: PhoneNumberListParams): Promise<PhoneNumber[]> {
    try {
      const result = await this.sdk.incomingPhoneNumbers.list(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined PhoneNumber
   * @param params - Operation parameters
   * @returns boolean
   */
  private async phoneNumberDelete(params: PhoneNumberDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.incomingPhoneNumbers.remove(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined MessagingService
   * @param params - Operation parameters
   * @returns MessagingService
   */
  private async messagingServiceCreate(params: MessagingServiceCreateParams): Promise<MessagingService> {
    try {
      const result = await this.sdk.messaging.v1.services.create(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined MessagingService
   * @param params - Operation parameters
   * @returns MessagingService
   */
  private async messagingServiceGet(params: MessagingServiceGetParams): Promise<MessagingService> {
    try {
      const result = await this.sdk.messaging.v1.services.fetch(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined MessagingService
   * @param params - Operation parameters
   * @returns MessagingService[]
   */
  private async messagingServiceList(params: MessagingServiceListParams): Promise<MessagingService[]> {
    try {
      const result = await this.sdk.messaging.v1.services.list(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Verification
   * @param params - Operation parameters
   * @returns any
   */
  private async verificationSendCode(params: VerificationSendCodeParams): Promise<any> {
    try {
      const result = await this.sdk.verify.v2.services.verifications.create(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Verification
   * @param params - Operation parameters
   * @returns VerificationCheck
   */
  private async verificationCheckCode(params: VerificationCheckCodeParams): Promise<VerificationCheck> {
    try {
      const result = await this.sdk.verify.v2.services.verificationChecks.create(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Conference
   * @param params - Operation parameters
   * @returns Conference
   */
  private async conferenceCreate(params: ConferenceCreateParams): Promise<Conference> {
    try {
      const result = await this.sdk.conferences.create(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Conference
   * @param params - Operation parameters
   * @returns Conference
   */
  private async conferenceGet(params: ConferenceGetParams): Promise<Conference> {
    try {
      const result = await this.sdk.conferences.fetch(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Conference
   * @param params - Operation parameters
   * @returns Conference[]
   */
  private async conferenceList(params: ConferenceListParams): Promise<Conference[]> {
    try {
      const result = await this.sdk.conferences.list(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Conference
   * @param params - Operation parameters
   * @returns ConferenceParticipant[]
   */
  private async conferenceListParticipants(params: ConferenceListParticipantsParams): Promise<ConferenceParticipant[]> {
    try {
      const result = await this.sdk.conferences.participants.list(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Recording
   * @param params - Operation parameters
   * @returns Recording
   */
  private async recordingGet(params: RecordingGetParams): Promise<Recording> {
    try {
      const result = await this.sdk.recordings.fetch(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Recording
   * @param params - Operation parameters
   * @returns Recording[]
   */
  private async recordingList(params: RecordingListParams): Promise<Recording[]> {
    try {
      const result = await this.sdk.recordings.list(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }

  /**
   * undefined Recording
   * @param params - Operation parameters
   * @returns boolean
   */
  private async recordingDelete(params: RecordingDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.recordings.remove(params)
      return result
    } catch (error) {
      throw TwilioError.fromError(error)
    }
  }
}
