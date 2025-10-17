/**
 * Google Workspace Types
 *
 * Auto-generated TypeScript types for Google Workspace Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google-workspace
 */

/**
 * Google Workspace client options
 */
export interface GoogleWorkspaceClientOptions {
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
 * GmailMessage resource types
 */
/**
 * Parameters for GmailMessage.send
 */
export interface GmailMessageSendParams {
  /** User's email address (use 'me' for authenticated user) */
  userId: string
  /** Message to send (raw RFC 2822 format) */
  requestBody: Record<string, any>
}

/**
 * Parameters for GmailMessage.get
 */
export interface GmailMessageGetParams {
  /** User's email address */
  userId: string
  /** Message ID */
  id: string
  /** Message format (minimal, full, raw, metadata) */
  format?: string
}

/**
 * Parameters for GmailMessage.list
 */
export interface GmailMessageListParams {
  /** User's email address */
  userId: string
  /** Gmail search query */
  q?: string
  /** Filter by label IDs */
  labelIds?: any
  /** Maximum results per page */
  maxResults?: number
  /** Page token for pagination */
  pageToken?: string
}

/**
 * Parameters for GmailMessage.delete
 */
export interface GmailMessageDeleteParams {
  /** User's email address */
  userId: string
  /** Message ID */
  id: string
}

/**
 * Parameters for GmailMessage.modify
 */
export interface GmailMessageModifyParams {
  /** User's email address */
  userId: string
  /** Message ID */
  id: string
  /** Label modifications */
  requestBody: Record<string, any>
}

/**
 * Parameters for GmailMessage.batchDelete
 */
export interface GmailMessageBatchDeleteParams {
  /** User's email address */
  userId: string
  /** Batch delete request with message IDs */
  requestBody: Record<string, any>
}

/**
 * GmailLabel resource types
 */
/**
 * Parameters for GmailLabel.get
 */
export interface GmailLabelGetParams {
  /** User's email address */
  userId: string
  /** Label ID */
  id: string
}

/**
 * Parameters for GmailLabel.list
 */
export interface GmailLabelListParams {
  /** User's email address */
  userId: string
}

/**
 * Parameters for GmailLabel.create
 */
export interface GmailLabelCreateParams {
  /** User's email address */
  userId: string
  /** Label details */
  requestBody: Record<string, any>
}

/**
 * Parameters for GmailLabel.delete
 */
export interface GmailLabelDeleteParams {
  /** User's email address */
  userId: string
  /** Label ID */
  id: string
}

/**
 * GmailDraft resource types
 */
/**
 * Parameters for GmailDraft.create
 */
export interface GmailDraftCreateParams {
  /** User's email address */
  userId: string
  /** Draft message */
  requestBody: Record<string, any>
}

/**
 * Parameters for GmailDraft.get
 */
export interface GmailDraftGetParams {
  /** User's email address */
  userId: string
  /** Draft ID */
  id: string
}

/**
 * Parameters for GmailDraft.send
 */
export interface GmailDraftSendParams {
  /** User's email address */
  userId: string
  /** Draft to send */
  requestBody: Record<string, any>
}

/**
 * Parameters for GmailDraft.delete
 */
export interface GmailDraftDeleteParams {
  /** User's email address */
  userId: string
  /** Draft ID */
  id: string
}

/**
 * GmailAttachment resource types
 */
/**
 * Parameters for GmailAttachment.get
 */
export interface GmailAttachmentGetParams {
  /** User's email address */
  userId: string
  /** Message ID */
  messageId: string
  /** Attachment ID */
  id: string
}

/**
 * CalendarEvent resource types
 */
/**
 * Parameters for CalendarEvent.insert
 */
export interface CalendarEventInsertParams {
  /** Calendar ID (use 'primary' for primary calendar) */
  calendarId: string
  /** Event details */
  requestBody: Record<string, any>
}

/**
 * Parameters for CalendarEvent.get
 */
export interface CalendarEventGetParams {
  /** Calendar ID */
  calendarId: string
  /** Event ID */
  eventId: string
}

/**
 * Parameters for CalendarEvent.patch
 */
export interface CalendarEventPatchParams {
  /** Calendar ID */
  calendarId: string
  /** Event ID */
  eventId: string
  /** Event updates */
  requestBody: Record<string, any>
}

/**
 * Parameters for CalendarEvent.delete
 */
export interface CalendarEventDeleteParams {
  /** Calendar ID */
  calendarId: string
  /** Event ID */
  eventId: string
}

/**
 * Parameters for CalendarEvent.list
 */
export interface CalendarEventListParams {
  /** Calendar ID */
  calendarId: string
  /** Maximum results per page */
  maxResults?: number
  /** Page token for pagination */
  pageToken?: string
  /** Sort order (startTime, updated) */
  orderBy?: string
}

/**
 * Parameters for CalendarEvent.move
 */
export interface CalendarEventMoveParams {
  /** Source calendar ID */
  calendarId: string
  /** Event ID */
  eventId: string
  /** Destination calendar ID */
  destination: string
}

/**
 * Parameters for CalendarEvent.quickAdd
 */
export interface CalendarEventQuickAddParams {
  /** Calendar ID */
  calendarId: string
  /** Natural language event description */
  text: string
}

/**
 * Calendar resource types
 */
/**
 * Parameters for Calendar.get
 */
export interface CalendarGetParams {
  /** Calendar ID */
  calendarId: string
}

/**
 * Parameters for Calendar.insert
 */
export interface CalendarInsertParams {
  /** Calendar details */
  requestBody: Record<string, any>
}

/**
 * Parameters for Calendar.delete
 */
export interface CalendarDeleteParams {
  /** Calendar ID */
  calendarId: string
}

/**
 * CalendarList resource types
 */
/**
 * Parameters for CalendarList.list
 */
export interface CalendarListListParams {
  /** Maximum results per page */
  maxResults?: number
  /** Page token for pagination */
  pageToken?: string
}

/**
 * FreeBusy resource types
 */
/**
 * Parameters for FreeBusy.query
 */
export interface FreeBusyQueryParams {
  /** Free/busy query */
  requestBody: Record<string, any>
}

/**
 * DriveFile resource types
 */
/**
 * Parameters for DriveFile.get
 */
export interface DriveFileGetParams {
  /** File ID */
  fileId: string
  /** Fields to include */
  fields?: string
  /** Support shared drives */
  supportsAllDrives?: boolean
}

/**
 * Parameters for DriveFile.list
 */
export interface DriveFileListParams {
  /** Maximum results per page */
  pageSize?: number
  /** Page token for pagination */
  pageToken?: string
  /** Search query */
  q?: string
  /** Sort order */
  orderBy?: string
  /** Fields to include */
  fields?: string
  /** Support shared drives */
  supportsAllDrives?: boolean
}

/**
 * Parameters for DriveFile.create
 */
export interface DriveFileCreateParams {
  /** File metadata */
  requestBody: Record<string, any>
  /** File content */
  media?: Record<string, any>
  /** Fields to include */
  fields?: string
  /** Support shared drives */
  supportsAllDrives?: boolean
}

/**
 * Parameters for DriveFile.update
 */
export interface DriveFileUpdateParams {
  /** File ID */
  fileId: string
  /** File metadata updates */
  requestBody: Record<string, any>
  /** Fields to include */
  fields?: string
  /** Support shared drives */
  supportsAllDrives?: boolean
}

/**
 * Parameters for DriveFile.delete
 */
export interface DriveFileDeleteParams {
  /** File ID */
  fileId: string
  /** Support shared drives */
  supportsAllDrives?: boolean
}

/**
 * Parameters for DriveFile.copy
 */
export interface DriveFileCopyParams {
  /** Source file ID */
  fileId: string
  /** Destination file metadata */
  requestBody: Record<string, any>
  /** Fields to include */
  fields?: string
  /** Support shared drives */
  supportsAllDrives?: boolean
}

/**
 * Parameters for DriveFile.export
 */
export interface DriveFileExportParams {
  /** File ID */
  fileId: string
  /** Export MIME type */
  mimeType: string
}

/**
 * DrivePermission resource types
 */
/**
 * Parameters for DrivePermission.create
 */
export interface DrivePermissionCreateParams {
  /** File ID */
  fileId: string
  /** Permission details */
  requestBody: Record<string, any>
  /** Support shared drives */
  supportsAllDrives?: boolean
}

/**
 * Parameters for DrivePermission.list
 */
export interface DrivePermissionListParams {
  /** File ID */
  fileId: string
  /** Fields to include */
  fields?: string
  /** Support shared drives */
  supportsAllDrives?: boolean
}

/**
 * Parameters for DrivePermission.delete
 */
export interface DrivePermissionDeleteParams {
  /** File ID */
  fileId: string
  /** Permission ID */
  permissionId: string
  /** Support shared drives */
  supportsAllDrives?: boolean
}

/**
 * Document resource types
 */
/**
 * Parameters for Document.get
 */
export interface DocumentGetParams {
  /** Document ID */
  documentId: string
}

/**
 * Parameters for Document.create
 */
export interface DocumentCreateParams {
  /** Document details */
  requestBody: Record<string, any>
}

/**
 * Parameters for Document.batchUpdate
 */
export interface DocumentBatchUpdateParams {
  /** Document ID */
  documentId: string
  /** Batch update requests */
  requestBody: Record<string, any>
}

/**
 * Spreadsheet resource types
 */
/**
 * Parameters for Spreadsheet.get
 */
export interface SpreadsheetGetParams {
  /** Spreadsheet ID */
  spreadsheetId: string
}

/**
 * Parameters for Spreadsheet.create
 */
export interface SpreadsheetCreateParams {
  /** Spreadsheet details */
  requestBody: Record<string, any>
}

/**
 * Parameters for Spreadsheet.batchUpdate
 */
export interface SpreadsheetBatchUpdateParams {
  /** Spreadsheet ID */
  spreadsheetId: string
  /** Batch update requests */
  requestBody: Record<string, any>
}

/**
 * SpreadsheetValues resource types
 */
/**
 * Parameters for SpreadsheetValues.get
 */
export interface SpreadsheetValuesGetParams {
  /** Spreadsheet ID */
  spreadsheetId: string
  /** A1 notation range (e.g., Sheet1!A1:C10) */
  range: string
}

/**
 * Parameters for SpreadsheetValues.update
 */
export interface SpreadsheetValuesUpdateParams {
  /** Spreadsheet ID */
  spreadsheetId: string
  /** A1 notation range */
  range: string
  /** How values should be interpreted */
  valueInputOption: string
  /** Values to update */
  requestBody: Record<string, any>
}

/**
 * Parameters for SpreadsheetValues.append
 */
export interface SpreadsheetValuesAppendParams {
  /** Spreadsheet ID */
  spreadsheetId: string
  /** A1 notation range */
  range: string
  /** How values should be interpreted */
  valueInputOption: string
  /** Values to append */
  requestBody: Record<string, any>
}

/**
 * Parameters for SpreadsheetValues.clear
 */
export interface SpreadsheetValuesClearParams {
  /** Spreadsheet ID */
  spreadsheetId: string
  /** A1 notation range */
  range: string
}

/**
 * Parameters for SpreadsheetValues.batchGet
 */
export interface SpreadsheetValuesBatchGetParams {
  /** Spreadsheet ID */
  spreadsheetId: string
  /** A1 notation ranges */
  ranges: any
}

/**
 * Contact resource types
 */
/**
 * Parameters for Contact.get
 */
export interface ContactGetParams {
  /** Contact resource name */
  resourceName: string
  /** Fields to include */
  personFields: string
}

/**
 * Parameters for Contact.createContact
 */
export interface ContactCreateContactParams {
  /** Contact details */
  requestBody: Record<string, any>
}

/**
 * Parameters for Contact.updateContact
 */
export interface ContactUpdateContactParams {
  /** Contact resource name */
  resourceName: string
  /** Fields to update */
  updatePersonFields: string
  /** Contact updates */
  requestBody: Record<string, any>
}

/**
 * Parameters for Contact.deleteContact
 */
export interface ContactDeleteContactParams {
  /** Contact resource name */
  resourceName: string
}

/**
 * Parameters for Contact.searchContacts
 */
export interface ContactSearchContactsParams {
  /** Search query */
  query: string
  /** Maximum results per page */
  pageSize?: number
  /** Fields to include */
  readMask?: string
}

/**
 * ContactConnections resource types
 */
/**
 * Parameters for ContactConnections.list
 */
export interface ContactConnectionsListParams {
  /** Resource name (use 'people/me') */
  resourceName: string
  /** Maximum results per page */
  pageSize?: number
  /** Page token for pagination */
  pageToken?: string
  /** Fields to include */
  personFields: string
}

/**
 * SDK type re-exports
 */
export type * from 'googleapis'
