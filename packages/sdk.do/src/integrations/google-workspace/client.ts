/**
 * Google Workspace Client
 *
 * Auto-generated Integration client for Google Workspace.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google-workspace
 */

import google from 'googleapis'
import {
  GmailMessageSendParams,
  GmailMessageGetParams,
  GmailMessageListParams,
  GmailMessageDeleteParams,
  GmailMessageModifyParams,
  GmailMessageBatchDeleteParams,
  GmailLabelGetParams,
  GmailLabelListParams,
  GmailLabelCreateParams,
  GmailLabelDeleteParams,
  GmailDraftCreateParams,
  GmailDraftGetParams,
  GmailDraftSendParams,
  GmailDraftDeleteParams,
  GmailAttachmentGetParams,
  CalendarEventInsertParams,
  CalendarEventGetParams,
  CalendarEventPatchParams,
  CalendarEventDeleteParams,
  CalendarEventListParams,
  CalendarEventMoveParams,
  CalendarEventQuickAddParams,
  CalendarGetParams,
  CalendarInsertParams,
  CalendarDeleteParams,
  CalendarListListParams,
  FreeBusyQueryParams,
  DriveFileGetParams,
  DriveFileListParams,
  DriveFileCreateParams,
  DriveFileUpdateParams,
  DriveFileDeleteParams,
  DriveFileCopyParams,
  DriveFileExportParams,
  DrivePermissionCreateParams,
  DrivePermissionListParams,
  DrivePermissionDeleteParams,
  DocumentGetParams,
  DocumentCreateParams,
  DocumentBatchUpdateParams,
  SpreadsheetGetParams,
  SpreadsheetCreateParams,
  SpreadsheetBatchUpdateParams,
  SpreadsheetValuesGetParams,
  SpreadsheetValuesUpdateParams,
  SpreadsheetValuesAppendParams,
  SpreadsheetValuesClearParams,
  SpreadsheetValuesBatchGetParams,
  ContactGetParams,
  ContactCreateContactParams,
  ContactUpdateContactParams,
  ContactDeleteContactParams,
  ContactSearchContactsParams,
  ContactConnectionsListParams,
} from './types.js'
import { GoogleWorkspaceError } from './errors.js'

/**
 * Google Workspace client options
 */
export interface GoogleWorkspaceClientOptions {
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
 * Google Workspace Client
 *
 * Comprehensive Google Workspace integration for Gmail, Calendar, Drive, Docs, Sheets, and Contacts
 */
export class GoogleWorkspaceClient {
  private options: GoogleWorkspaceClientOptions
  private sdk: google

  /**
   * GmailMessage resource
   * Gmail email messages
   */
  public gmailMessage: {
    /** undefined GmailMessage */
    send: (params: GmailMessageSendParams) => Promise<gmail_v1.Schema$Message>
    /** undefined GmailMessage */
    get: (params: GmailMessageGetParams) => Promise<gmail_v1.Schema$Message>
    /** undefined GmailMessage */
    list: (params: GmailMessageListParams) => Promise<gmail_v1.Schema$ListMessagesResponse>
    /** undefined GmailMessage */
    delete: (params: GmailMessageDeleteParams) => Promise<void>
    /** undefined GmailMessage */
    modify: (params: GmailMessageModifyParams) => Promise<gmail_v1.Schema$Message>
    /** undefined GmailMessage */
    batchDelete: (params: GmailMessageBatchDeleteParams) => Promise<void>
  }

  /**
   * GmailLabel resource
   * Gmail labels for organizing messages
   */
  public gmailLabel: {
    /** undefined GmailLabel */
    get: (params: GmailLabelGetParams) => Promise<gmail_v1.Schema$Label>
    /** undefined GmailLabel */
    list: (params: GmailLabelListParams) => Promise<gmail_v1.Schema$ListLabelsResponse>
    /** undefined GmailLabel */
    create: (params: GmailLabelCreateParams) => Promise<gmail_v1.Schema$Label>
    /** undefined GmailLabel */
    delete: (params: GmailLabelDeleteParams) => Promise<void>
  }

  /**
   * GmailDraft resource
   * Gmail draft messages
   */
  public gmailDraft: {
    /** undefined GmailDraft */
    create: (params: GmailDraftCreateParams) => Promise<gmail_v1.Schema$Draft>
    /** undefined GmailDraft */
    get: (params: GmailDraftGetParams) => Promise<gmail_v1.Schema$Draft>
    /** undefined GmailDraft */
    send: (params: GmailDraftSendParams) => Promise<gmail_v1.Schema$Message>
    /** undefined GmailDraft */
    delete: (params: GmailDraftDeleteParams) => Promise<void>
  }

  /**
   * GmailAttachment resource
   * Gmail message attachments
   */
  public gmailAttachment: {
    /** undefined GmailAttachment */
    get: (params: GmailAttachmentGetParams) => Promise<gmail_v1.Schema$MessagePartBody>
  }

  /**
   * CalendarEvent resource
   * Calendar events
   */
  public calendarEvent: {
    /** undefined CalendarEvent */
    insert: (params: CalendarEventInsertParams) => Promise<calendar_v3.Schema$Event>
    /** undefined CalendarEvent */
    get: (params: CalendarEventGetParams) => Promise<calendar_v3.Schema$Event>
    /** undefined CalendarEvent */
    patch: (params: CalendarEventPatchParams) => Promise<calendar_v3.Schema$Event>
    /** undefined CalendarEvent */
    delete: (params: CalendarEventDeleteParams) => Promise<void>
    /** undefined CalendarEvent */
    list: (params: CalendarEventListParams) => Promise<calendar_v3.Schema$Events>
    /** undefined CalendarEvent */
    move: (params: CalendarEventMoveParams) => Promise<calendar_v3.Schema$Event>
    /** undefined CalendarEvent */
    quickAdd: (params: CalendarEventQuickAddParams) => Promise<calendar_v3.Schema$Event>
  }

  /**
   * Calendar resource
   * Calendar resources
   */
  public calendar: {
    /** undefined Calendar */
    get: (params: CalendarGetParams) => Promise<calendar_v3.Schema$Calendar>
    /** undefined Calendar */
    insert: (params: CalendarInsertParams) => Promise<calendar_v3.Schema$Calendar>
    /** undefined Calendar */
    delete: (params: CalendarDeleteParams) => Promise<void>
  }

  /**
   * CalendarList resource
   * Calendar list entries
   */
  public calendarList: {
    /** undefined CalendarList */
    list: (params: CalendarListListParams) => Promise<calendar_v3.Schema$CalendarList>
  }

  /**
   * FreeBusy resource
   * Free/busy information
   */
  public freeBusy: {
    /** undefined FreeBusy */
    query: (params: FreeBusyQueryParams) => Promise<calendar_v3.Schema$FreeBusyResponse>
  }

  /**
   * DriveFile resource
   * Google Drive files and folders
   */
  public driveFile: {
    /** undefined DriveFile */
    get: (params: DriveFileGetParams) => Promise<drive_v3.Schema$File>
    /** undefined DriveFile */
    list: (params: DriveFileListParams) => Promise<drive_v3.Schema$FileList>
    /** undefined DriveFile */
    create: (params: DriveFileCreateParams) => Promise<drive_v3.Schema$File>
    /** undefined DriveFile */
    update: (params: DriveFileUpdateParams) => Promise<drive_v3.Schema$File>
    /** undefined DriveFile */
    delete: (params: DriveFileDeleteParams) => Promise<void>
    /** undefined DriveFile */
    copy: (params: DriveFileCopyParams) => Promise<drive_v3.Schema$File>
    /** undefined DriveFile */
    export: (params: DriveFileExportParams) => Promise<string>
  }

  /**
   * DrivePermission resource
   * Drive file permissions
   */
  public drivePermission: {
    /** undefined DrivePermission */
    create: (params: DrivePermissionCreateParams) => Promise<drive_v3.Schema$Permission>
    /** undefined DrivePermission */
    list: (params: DrivePermissionListParams) => Promise<drive_v3.Schema$PermissionList>
    /** undefined DrivePermission */
    delete: (params: DrivePermissionDeleteParams) => Promise<void>
  }

  /**
   * Document resource
   * Google Docs documents
   */
  public document: {
    /** undefined Document */
    get: (params: DocumentGetParams) => Promise<docs_v1.Schema$Document>
    /** undefined Document */
    create: (params: DocumentCreateParams) => Promise<docs_v1.Schema$Document>
    /** undefined Document */
    batchUpdate: (params: DocumentBatchUpdateParams) => Promise<docs_v1.Schema$BatchUpdateDocumentResponse>
  }

  /**
   * Spreadsheet resource
   * Google Sheets spreadsheets
   */
  public spreadsheet: {
    /** undefined Spreadsheet */
    get: (params: SpreadsheetGetParams) => Promise<sheets_v4.Schema$Spreadsheet>
    /** undefined Spreadsheet */
    create: (params: SpreadsheetCreateParams) => Promise<sheets_v4.Schema$Spreadsheet>
    /** undefined Spreadsheet */
    batchUpdate: (params: SpreadsheetBatchUpdateParams) => Promise<sheets_v4.Schema$BatchUpdateSpreadsheetResponse>
  }

  /**
   * SpreadsheetValues resource
   * Spreadsheet cell values
   */
  public spreadsheetValues: {
    /** undefined SpreadsheetValues */
    get: (params: SpreadsheetValuesGetParams) => Promise<sheets_v4.Schema$ValueRange>
    /** undefined SpreadsheetValues */
    update: (params: SpreadsheetValuesUpdateParams) => Promise<sheets_v4.Schema$UpdateValuesResponse>
    /** undefined SpreadsheetValues */
    append: (params: SpreadsheetValuesAppendParams) => Promise<sheets_v4.Schema$AppendValuesResponse>
    /** undefined SpreadsheetValues */
    clear: (params: SpreadsheetValuesClearParams) => Promise<sheets_v4.Schema$ClearValuesResponse>
    /** undefined SpreadsheetValues */
    batchGet: (params: SpreadsheetValuesBatchGetParams) => Promise<sheets_v4.Schema$BatchGetValuesResponse>
  }

  /**
   * Contact resource
   * Contacts from People API
   */
  public contact: {
    /** undefined Contact */
    get: (params: ContactGetParams) => Promise<people_v1.Schema$Person>
    /** undefined Contact */
    createContact: (params: ContactCreateContactParams) => Promise<people_v1.Schema$Person>
    /** undefined Contact */
    updateContact: (params: ContactUpdateContactParams) => Promise<people_v1.Schema$Person>
    /** undefined Contact */
    deleteContact: (params: ContactDeleteContactParams) => Promise<void>
    /** undefined Contact */
    searchContacts: (params: ContactSearchContactsParams) => Promise<people_v1.Schema$SearchContactsResponse>
  }

  /**
   * ContactConnections resource
   * Contact connections (contact list)
   */
  public contactConnections: {
    /** undefined ContactConnections */
    list: (params: ContactConnectionsListParams) => Promise<people_v1.Schema$ListConnectionsResponse>
  }

  constructor(options: GoogleWorkspaceClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new google({
      accessToken: this.options.accessToken,
    })

    // Initialize resource namespaces
    this.gmailMessage = {
      send: this.gmailMessageSend.bind(this),
      get: this.gmailMessageGet.bind(this),
      list: this.gmailMessageList.bind(this),
      delete: this.gmailMessageDelete.bind(this),
      modify: this.gmailMessageModify.bind(this),
      batchDelete: this.gmailMessageBatchDelete.bind(this),
    }
    this.gmailLabel = {
      get: this.gmailLabelGet.bind(this),
      list: this.gmailLabelList.bind(this),
      create: this.gmailLabelCreate.bind(this),
      delete: this.gmailLabelDelete.bind(this),
    }
    this.gmailDraft = {
      create: this.gmailDraftCreate.bind(this),
      get: this.gmailDraftGet.bind(this),
      send: this.gmailDraftSend.bind(this),
      delete: this.gmailDraftDelete.bind(this),
    }
    this.gmailAttachment = {
      get: this.gmailAttachmentGet.bind(this),
    }
    this.calendarEvent = {
      insert: this.calendarEventInsert.bind(this),
      get: this.calendarEventGet.bind(this),
      patch: this.calendarEventPatch.bind(this),
      delete: this.calendarEventDelete.bind(this),
      list: this.calendarEventList.bind(this),
      move: this.calendarEventMove.bind(this),
      quickAdd: this.calendarEventQuickAdd.bind(this),
    }
    this.calendar = {
      get: this.calendarGet.bind(this),
      insert: this.calendarInsert.bind(this),
      delete: this.calendarDelete.bind(this),
    }
    this.calendarList = {
      list: this.calendarListList.bind(this),
    }
    this.freeBusy = {
      query: this.freeBusyQuery.bind(this),
    }
    this.driveFile = {
      get: this.driveFileGet.bind(this),
      list: this.driveFileList.bind(this),
      create: this.driveFileCreate.bind(this),
      update: this.driveFileUpdate.bind(this),
      delete: this.driveFileDelete.bind(this),
      copy: this.driveFileCopy.bind(this),
      export: this.driveFileExport.bind(this),
    }
    this.drivePermission = {
      create: this.drivePermissionCreate.bind(this),
      list: this.drivePermissionList.bind(this),
      delete: this.drivePermissionDelete.bind(this),
    }
    this.document = {
      get: this.documentGet.bind(this),
      create: this.documentCreate.bind(this),
      batchUpdate: this.documentBatchUpdate.bind(this),
    }
    this.spreadsheet = {
      get: this.spreadsheetGet.bind(this),
      create: this.spreadsheetCreate.bind(this),
      batchUpdate: this.spreadsheetBatchUpdate.bind(this),
    }
    this.spreadsheetValues = {
      get: this.spreadsheetValuesGet.bind(this),
      update: this.spreadsheetValuesUpdate.bind(this),
      append: this.spreadsheetValuesAppend.bind(this),
      clear: this.spreadsheetValuesClear.bind(this),
      batchGet: this.spreadsheetValuesBatchGet.bind(this),
    }
    this.contact = {
      get: this.contactGet.bind(this),
      createContact: this.contactCreateContact.bind(this),
      updateContact: this.contactUpdateContact.bind(this),
      deleteContact: this.contactDeleteContact.bind(this),
      searchContacts: this.contactSearchContacts.bind(this),
    }
    this.contactConnections = {
      list: this.contactConnectionsList.bind(this),
    }
  }

  /**
   * undefined GmailMessage
   * @param params - Operation parameters
   * @returns gmail_v1.Schema$Message
   */
  private async gmailMessageSend(params: GmailMessageSendParams): Promise<gmail_v1.Schema$Message> {
    try {
      const result = await this.sdk.gmail.users.messages.send(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailMessage
   * @param params - Operation parameters
   * @returns gmail_v1.Schema$Message
   */
  private async gmailMessageGet(params: GmailMessageGetParams): Promise<gmail_v1.Schema$Message> {
    try {
      const result = await this.sdk.gmail.users.messages.get(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailMessage
   * @param params - Operation parameters
   * @returns gmail_v1.Schema$ListMessagesResponse
   */
  private async gmailMessageList(params: GmailMessageListParams): Promise<gmail_v1.Schema$ListMessagesResponse> {
    try {
      const result = await this.sdk.gmail.users.messages.list(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailMessage
   * @param params - Operation parameters
   * @returns void
   */
  private async gmailMessageDelete(params: GmailMessageDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.gmail.users.messages.delete(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailMessage
   * @param params - Operation parameters
   * @returns gmail_v1.Schema$Message
   */
  private async gmailMessageModify(params: GmailMessageModifyParams): Promise<gmail_v1.Schema$Message> {
    try {
      const result = await this.sdk.gmail.users.messages.modify(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailMessage
   * @param params - Operation parameters
   * @returns void
   */
  private async gmailMessageBatchDelete(params: GmailMessageBatchDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.gmail.users.messages.batchDelete(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailLabel
   * @param params - Operation parameters
   * @returns gmail_v1.Schema$Label
   */
  private async gmailLabelGet(params: GmailLabelGetParams): Promise<gmail_v1.Schema$Label> {
    try {
      const result = await this.sdk.gmail.users.labels.get(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailLabel
   * @param params - Operation parameters
   * @returns gmail_v1.Schema$ListLabelsResponse
   */
  private async gmailLabelList(params: GmailLabelListParams): Promise<gmail_v1.Schema$ListLabelsResponse> {
    try {
      const result = await this.sdk.gmail.users.labels.list(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailLabel
   * @param params - Operation parameters
   * @returns gmail_v1.Schema$Label
   */
  private async gmailLabelCreate(params: GmailLabelCreateParams): Promise<gmail_v1.Schema$Label> {
    try {
      const result = await this.sdk.gmail.users.labels.create(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailLabel
   * @param params - Operation parameters
   * @returns void
   */
  private async gmailLabelDelete(params: GmailLabelDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.gmail.users.labels.delete(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailDraft
   * @param params - Operation parameters
   * @returns gmail_v1.Schema$Draft
   */
  private async gmailDraftCreate(params: GmailDraftCreateParams): Promise<gmail_v1.Schema$Draft> {
    try {
      const result = await this.sdk.gmail.users.drafts.create(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailDraft
   * @param params - Operation parameters
   * @returns gmail_v1.Schema$Draft
   */
  private async gmailDraftGet(params: GmailDraftGetParams): Promise<gmail_v1.Schema$Draft> {
    try {
      const result = await this.sdk.gmail.users.drafts.get(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailDraft
   * @param params - Operation parameters
   * @returns gmail_v1.Schema$Message
   */
  private async gmailDraftSend(params: GmailDraftSendParams): Promise<gmail_v1.Schema$Message> {
    try {
      const result = await this.sdk.gmail.users.drafts.send(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailDraft
   * @param params - Operation parameters
   * @returns void
   */
  private async gmailDraftDelete(params: GmailDraftDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.gmail.users.drafts.delete(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined GmailAttachment
   * @param params - Operation parameters
   * @returns gmail_v1.Schema$MessagePartBody
   */
  private async gmailAttachmentGet(params: GmailAttachmentGetParams): Promise<gmail_v1.Schema$MessagePartBody> {
    try {
      const result = await this.sdk.gmail.users.messages.attachments.get(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined CalendarEvent
   * @param params - Operation parameters
   * @returns calendar_v3.Schema$Event
   */
  private async calendarEventInsert(params: CalendarEventInsertParams): Promise<calendar_v3.Schema$Event> {
    try {
      const result = await this.sdk.calendar.events.insert(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined CalendarEvent
   * @param params - Operation parameters
   * @returns calendar_v3.Schema$Event
   */
  private async calendarEventGet(params: CalendarEventGetParams): Promise<calendar_v3.Schema$Event> {
    try {
      const result = await this.sdk.calendar.events.get(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined CalendarEvent
   * @param params - Operation parameters
   * @returns calendar_v3.Schema$Event
   */
  private async calendarEventPatch(params: CalendarEventPatchParams): Promise<calendar_v3.Schema$Event> {
    try {
      const result = await this.sdk.calendar.events.patch(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined CalendarEvent
   * @param params - Operation parameters
   * @returns void
   */
  private async calendarEventDelete(params: CalendarEventDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.calendar.events.delete(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined CalendarEvent
   * @param params - Operation parameters
   * @returns calendar_v3.Schema$Events
   */
  private async calendarEventList(params: CalendarEventListParams): Promise<calendar_v3.Schema$Events> {
    try {
      const result = await this.sdk.calendar.events.list(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined CalendarEvent
   * @param params - Operation parameters
   * @returns calendar_v3.Schema$Event
   */
  private async calendarEventMove(params: CalendarEventMoveParams): Promise<calendar_v3.Schema$Event> {
    try {
      const result = await this.sdk.calendar.events.move(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined CalendarEvent
   * @param params - Operation parameters
   * @returns calendar_v3.Schema$Event
   */
  private async calendarEventQuickAdd(params: CalendarEventQuickAddParams): Promise<calendar_v3.Schema$Event> {
    try {
      const result = await this.sdk.calendar.events.quickAdd(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Calendar
   * @param params - Operation parameters
   * @returns calendar_v3.Schema$Calendar
   */
  private async calendarGet(params: CalendarGetParams): Promise<calendar_v3.Schema$Calendar> {
    try {
      const result = await this.sdk.calendar.calendars.get(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Calendar
   * @param params - Operation parameters
   * @returns calendar_v3.Schema$Calendar
   */
  private async calendarInsert(params: CalendarInsertParams): Promise<calendar_v3.Schema$Calendar> {
    try {
      const result = await this.sdk.calendar.calendars.insert(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Calendar
   * @param params - Operation parameters
   * @returns void
   */
  private async calendarDelete(params: CalendarDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.calendar.calendars.delete(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined CalendarList
   * @param params - Operation parameters
   * @returns calendar_v3.Schema$CalendarList
   */
  private async calendarListList(params: CalendarListListParams): Promise<calendar_v3.Schema$CalendarList> {
    try {
      const result = await this.sdk.calendar.calendarList.list(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined FreeBusy
   * @param params - Operation parameters
   * @returns calendar_v3.Schema$FreeBusyResponse
   */
  private async freeBusyQuery(params: FreeBusyQueryParams): Promise<calendar_v3.Schema$FreeBusyResponse> {
    try {
      const result = await this.sdk.calendar.freebusy.query(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined DriveFile
   * @param params - Operation parameters
   * @returns drive_v3.Schema$File
   */
  private async driveFileGet(params: DriveFileGetParams): Promise<drive_v3.Schema$File> {
    try {
      const result = await this.sdk.drive.files.get(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined DriveFile
   * @param params - Operation parameters
   * @returns drive_v3.Schema$FileList
   */
  private async driveFileList(params: DriveFileListParams): Promise<drive_v3.Schema$FileList> {
    try {
      const result = await this.sdk.drive.files.list(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined DriveFile
   * @param params - Operation parameters
   * @returns drive_v3.Schema$File
   */
  private async driveFileCreate(params: DriveFileCreateParams): Promise<drive_v3.Schema$File> {
    try {
      const result = await this.sdk.drive.files.create(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined DriveFile
   * @param params - Operation parameters
   * @returns drive_v3.Schema$File
   */
  private async driveFileUpdate(params: DriveFileUpdateParams): Promise<drive_v3.Schema$File> {
    try {
      const result = await this.sdk.drive.files.update(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined DriveFile
   * @param params - Operation parameters
   * @returns void
   */
  private async driveFileDelete(params: DriveFileDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.drive.files.delete(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined DriveFile
   * @param params - Operation parameters
   * @returns drive_v3.Schema$File
   */
  private async driveFileCopy(params: DriveFileCopyParams): Promise<drive_v3.Schema$File> {
    try {
      const result = await this.sdk.drive.files.copy(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined DriveFile
   * @param params - Operation parameters
   * @returns string
   */
  private async driveFileExport(params: DriveFileExportParams): Promise<string> {
    try {
      const result = await this.sdk.drive.files.export(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined DrivePermission
   * @param params - Operation parameters
   * @returns drive_v3.Schema$Permission
   */
  private async drivePermissionCreate(params: DrivePermissionCreateParams): Promise<drive_v3.Schema$Permission> {
    try {
      const result = await this.sdk.drive.permissions.create(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined DrivePermission
   * @param params - Operation parameters
   * @returns drive_v3.Schema$PermissionList
   */
  private async drivePermissionList(params: DrivePermissionListParams): Promise<drive_v3.Schema$PermissionList> {
    try {
      const result = await this.sdk.drive.permissions.list(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined DrivePermission
   * @param params - Operation parameters
   * @returns void
   */
  private async drivePermissionDelete(params: DrivePermissionDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.drive.permissions.delete(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Document
   * @param params - Operation parameters
   * @returns docs_v1.Schema$Document
   */
  private async documentGet(params: DocumentGetParams): Promise<docs_v1.Schema$Document> {
    try {
      const result = await this.sdk.docs.documents.get(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Document
   * @param params - Operation parameters
   * @returns docs_v1.Schema$Document
   */
  private async documentCreate(params: DocumentCreateParams): Promise<docs_v1.Schema$Document> {
    try {
      const result = await this.sdk.docs.documents.create(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Document
   * @param params - Operation parameters
   * @returns docs_v1.Schema$BatchUpdateDocumentResponse
   */
  private async documentBatchUpdate(params: DocumentBatchUpdateParams): Promise<docs_v1.Schema$BatchUpdateDocumentResponse> {
    try {
      const result = await this.sdk.docs.documents.batchUpdate(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Spreadsheet
   * @param params - Operation parameters
   * @returns sheets_v4.Schema$Spreadsheet
   */
  private async spreadsheetGet(params: SpreadsheetGetParams): Promise<sheets_v4.Schema$Spreadsheet> {
    try {
      const result = await this.sdk.sheets.spreadsheets.get(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Spreadsheet
   * @param params - Operation parameters
   * @returns sheets_v4.Schema$Spreadsheet
   */
  private async spreadsheetCreate(params: SpreadsheetCreateParams): Promise<sheets_v4.Schema$Spreadsheet> {
    try {
      const result = await this.sdk.sheets.spreadsheets.create(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Spreadsheet
   * @param params - Operation parameters
   * @returns sheets_v4.Schema$BatchUpdateSpreadsheetResponse
   */
  private async spreadsheetBatchUpdate(params: SpreadsheetBatchUpdateParams): Promise<sheets_v4.Schema$BatchUpdateSpreadsheetResponse> {
    try {
      const result = await this.sdk.sheets.spreadsheets.batchUpdate(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined SpreadsheetValues
   * @param params - Operation parameters
   * @returns sheets_v4.Schema$ValueRange
   */
  private async spreadsheetValuesGet(params: SpreadsheetValuesGetParams): Promise<sheets_v4.Schema$ValueRange> {
    try {
      const result = await this.sdk.sheets.spreadsheets.values.get(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined SpreadsheetValues
   * @param params - Operation parameters
   * @returns sheets_v4.Schema$UpdateValuesResponse
   */
  private async spreadsheetValuesUpdate(params: SpreadsheetValuesUpdateParams): Promise<sheets_v4.Schema$UpdateValuesResponse> {
    try {
      const result = await this.sdk.sheets.spreadsheets.values.update(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined SpreadsheetValues
   * @param params - Operation parameters
   * @returns sheets_v4.Schema$AppendValuesResponse
   */
  private async spreadsheetValuesAppend(params: SpreadsheetValuesAppendParams): Promise<sheets_v4.Schema$AppendValuesResponse> {
    try {
      const result = await this.sdk.sheets.spreadsheets.values.append(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined SpreadsheetValues
   * @param params - Operation parameters
   * @returns sheets_v4.Schema$ClearValuesResponse
   */
  private async spreadsheetValuesClear(params: SpreadsheetValuesClearParams): Promise<sheets_v4.Schema$ClearValuesResponse> {
    try {
      const result = await this.sdk.sheets.spreadsheets.values.clear(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined SpreadsheetValues
   * @param params - Operation parameters
   * @returns sheets_v4.Schema$BatchGetValuesResponse
   */
  private async spreadsheetValuesBatchGet(params: SpreadsheetValuesBatchGetParams): Promise<sheets_v4.Schema$BatchGetValuesResponse> {
    try {
      const result = await this.sdk.sheets.spreadsheets.values.batchGet(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns people_v1.Schema$Person
   */
  private async contactGet(params: ContactGetParams): Promise<people_v1.Schema$Person> {
    try {
      const result = await this.sdk.people.people.get(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns people_v1.Schema$Person
   */
  private async contactCreateContact(params: ContactCreateContactParams): Promise<people_v1.Schema$Person> {
    try {
      const result = await this.sdk.people.people.createContact(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns people_v1.Schema$Person
   */
  private async contactUpdateContact(params: ContactUpdateContactParams): Promise<people_v1.Schema$Person> {
    try {
      const result = await this.sdk.people.people.updateContact(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns void
   */
  private async contactDeleteContact(params: ContactDeleteContactParams): Promise<void> {
    try {
      const result = await this.sdk.people.people.deleteContact(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns people_v1.Schema$SearchContactsResponse
   */
  private async contactSearchContacts(params: ContactSearchContactsParams): Promise<people_v1.Schema$SearchContactsResponse> {
    try {
      const result = await this.sdk.people.people.searchContacts(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }

  /**
   * undefined ContactConnections
   * @param params - Operation parameters
   * @returns people_v1.Schema$ListConnectionsResponse
   */
  private async contactConnectionsList(params: ContactConnectionsListParams): Promise<people_v1.Schema$ListConnectionsResponse> {
    try {
      const result = await this.sdk.people.people.connections.list(params)
      return result
    } catch (error) {
      throw GoogleWorkspaceError.fromError(error)
    }
  }
}
