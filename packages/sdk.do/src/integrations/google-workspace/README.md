# Google Workspace Integration

Comprehensive Google Workspace integration for Gmail, Calendar, Drive, Docs, Sheets, and Contacts

**Category**: productivity
**Service**: GoogleWorkspace
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/google-workspace](https://integrations.do/google-workspace)

## Installation

```bash
npm install @dotdo/integration-google-workspace
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-google-workspace
```

## Quick Start

```typescript
import { GoogleWorkspaceClient } from '@dotdo/integration-google-workspace'

// Initialize client
const client = new GoogleWorkspaceClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GoogleWorkspaceClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

**OAuth2 Configuration:**

- Authorization URL: https://accounts.google.com/o/oauth2/v2/auth
- Token URL: https://oauth2.googleapis.com/token
- Scopes: https://mail.google.com/, https://www.googleapis.com/auth/gmail.readonly, https://www.googleapis.com/auth/gmail.send, https://www.googleapis.com/auth/gmail.modify, https://www.googleapis.com/auth/calendar, https://www.googleapis.com/auth/calendar.readonly, https://www.googleapis.com/auth/calendar.events, https://www.googleapis.com/auth/drive, https://www.googleapis.com/auth/drive.readonly, https://www.googleapis.com/auth/drive.file, https://www.googleapis.com/auth/documents, https://www.googleapis.com/auth/documents.readonly, https://www.googleapis.com/auth/spreadsheets, https://www.googleapis.com/auth/spreadsheets.readonly, https://www.googleapis.com/auth/contacts, https://www.googleapis.com/auth/contacts.readonly

## Resources

### GmailMessage

Gmail email messages

#### `gmailMessage.send()`

```typescript
const result = await client.gmailMessage.send({
  userId: 'me', // User's email address (use 'me' for authenticated user)
  requestBody: {}, // Message to send (raw RFC 2822 format)
})
```

#### `gmailMessage.get()`

```typescript
const result = await client.gmailMessage.get({
  userId: 'me', // User's email address
  id: 'example', // Message ID
  format: 'full', // Message format (minimal, full, raw, metadata)
})
```

#### `gmailMessage.list()`

```typescript
const result = await client.gmailMessage.list({
  userId: 'me', // User's email address
  q: 'example', // Gmail search query
  labelIds: value, // Filter by label IDs
  maxResults: 100, // Maximum results per page
  pageToken: 'example', // Page token for pagination
})
```

#### `gmailMessage.delete()`

```typescript
const result = await client.gmailMessage.delete({
  userId: 'me', // User's email address
  id: 'example', // Message ID
})
```

#### `gmailMessage.modify()`

```typescript
const result = await client.gmailMessage.modify({
  userId: 'me', // User's email address
  id: 'example', // Message ID
  requestBody: {}, // Label modifications
})
```

#### `gmailMessage.batchDelete()`

```typescript
const result = await client.gmailMessage.batchDelete({
  userId: 'me', // User's email address
  requestBody: {}, // Batch delete request with message IDs
})
```

### GmailLabel

Gmail labels for organizing messages

#### `gmailLabel.get()`

```typescript
const result = await client.gmailLabel.get({
  userId: 'me', // User's email address
  id: 'example', // Label ID
})
```

#### `gmailLabel.list()`

```typescript
const result = await client.gmailLabel.list({
  userId: 'me', // User's email address
})
```

#### `gmailLabel.create()`

```typescript
const result = await client.gmailLabel.create({
  userId: 'me', // User's email address
  requestBody: {}, // Label details
})
```

#### `gmailLabel.delete()`

```typescript
const result = await client.gmailLabel.delete({
  userId: 'me', // User's email address
  id: 'example', // Label ID
})
```

### GmailDraft

Gmail draft messages

#### `gmailDraft.create()`

```typescript
const result = await client.gmailDraft.create({
  userId: 'me', // User's email address
  requestBody: {}, // Draft message
})
```

#### `gmailDraft.get()`

```typescript
const result = await client.gmailDraft.get({
  userId: 'me', // User's email address
  id: 'example', // Draft ID
})
```

#### `gmailDraft.send()`

```typescript
const result = await client.gmailDraft.send({
  userId: 'me', // User's email address
  requestBody: {}, // Draft to send
})
```

#### `gmailDraft.delete()`

```typescript
const result = await client.gmailDraft.delete({
  userId: 'me', // User's email address
  id: 'example', // Draft ID
})
```

### GmailAttachment

Gmail message attachments

#### `gmailAttachment.get()`

```typescript
const result = await client.gmailAttachment.get({
  userId: 'me', // User's email address
  messageId: 'example', // Message ID
  id: 'example', // Attachment ID
})
```

### CalendarEvent

Calendar events

#### `calendarEvent.insert()`

```typescript
const result = await client.calendarEvent.insert({
  calendarId: 'example', // Calendar ID (use 'primary' for primary calendar)
  requestBody: {}, // Event details
})
```

#### `calendarEvent.get()`

```typescript
const result = await client.calendarEvent.get({
  calendarId: 'example', // Calendar ID
  eventId: 'example', // Event ID
})
```

#### `calendarEvent.patch()`

```typescript
const result = await client.calendarEvent.patch({
  calendarId: 'example', // Calendar ID
  eventId: 'example', // Event ID
  requestBody: {}, // Event updates
})
```

#### `calendarEvent.delete()`

```typescript
const result = await client.calendarEvent.delete({
  calendarId: 'example', // Calendar ID
  eventId: 'example', // Event ID
})
```

#### `calendarEvent.list()`

```typescript
const result = await client.calendarEvent.list({
  calendarId: 'example', // Calendar ID
  maxResults: 100, // Maximum results per page
  pageToken: 'example', // Page token for pagination
  orderBy: 'example', // Sort order (startTime, updated)
})
```

#### `calendarEvent.move()`

```typescript
const result = await client.calendarEvent.move({
  calendarId: 'example', // Source calendar ID
  eventId: 'example', // Event ID
  destination: 'example', // Destination calendar ID
})
```

#### `calendarEvent.quickAdd()`

```typescript
const result = await client.calendarEvent.quickAdd({
  calendarId: 'example', // Calendar ID
  text: 'example', // Natural language event description
})
```

### Calendar

Calendar resources

#### `calendar.get()`

```typescript
const result = await client.calendar.get({
  calendarId: 'example', // Calendar ID
})
```

#### `calendar.insert()`

```typescript
const result = await client.calendar.insert({
  requestBody: {}, // Calendar details
})
```

#### `calendar.delete()`

```typescript
const result = await client.calendar.delete({
  calendarId: 'example', // Calendar ID
})
```

### CalendarList

Calendar list entries

#### `calendarList.list()`

```typescript
const result = await client.calendarList.list({
  maxResults: 100, // Maximum results per page
  pageToken: 'example', // Page token for pagination
})
```

### FreeBusy

Free/busy information

#### `freeBusy.query()`

```typescript
const result = await client.freeBusy.query({
  requestBody: {}, // Free/busy query
})
```

### DriveFile

Google Drive files and folders

#### `driveFile.get()`

```typescript
const result = await client.driveFile.get({
  fileId: 'example', // File ID
  fields: '*', // Fields to include
  supportsAllDrives: true, // Support shared drives
})
```

#### `driveFile.list()`

```typescript
const result = await client.driveFile.list({
  pageSize: 100, // Maximum results per page
  pageToken: 'example', // Page token for pagination
  q: 'example', // Search query
  orderBy: 'example', // Sort order
  fields: 'nextPageToken, files(*)', // Fields to include
  supportsAllDrives: true, // Support shared drives
})
```

#### `driveFile.create()`

```typescript
const result = await client.driveFile.create({
  requestBody: {}, // File metadata
  media: {}, // File content
  fields: '*', // Fields to include
  supportsAllDrives: true, // Support shared drives
})
```

#### `driveFile.update()`

```typescript
const result = await client.driveFile.update({
  fileId: 'example', // File ID
  requestBody: {}, // File metadata updates
  fields: '*', // Fields to include
  supportsAllDrives: true, // Support shared drives
})
```

#### `driveFile.delete()`

```typescript
const result = await client.driveFile.delete({
  fileId: 'example', // File ID
  supportsAllDrives: true, // Support shared drives
})
```

#### `driveFile.copy()`

```typescript
const result = await client.driveFile.copy({
  fileId: 'example', // Source file ID
  requestBody: {}, // Destination file metadata
  fields: '*', // Fields to include
  supportsAllDrives: true, // Support shared drives
})
```

#### `driveFile.export()`

```typescript
const result = await client.driveFile.export({
  fileId: 'example', // File ID
  mimeType: 'example', // Export MIME type
})
```

### DrivePermission

Drive file permissions

#### `drivePermission.create()`

```typescript
const result = await client.drivePermission.create({
  fileId: 'example', // File ID
  requestBody: {}, // Permission details
  supportsAllDrives: true, // Support shared drives
})
```

#### `drivePermission.list()`

```typescript
const result = await client.drivePermission.list({
  fileId: 'example', // File ID
  fields: '*', // Fields to include
  supportsAllDrives: true, // Support shared drives
})
```

#### `drivePermission.delete()`

```typescript
const result = await client.drivePermission.delete({
  fileId: 'example', // File ID
  permissionId: 'example', // Permission ID
  supportsAllDrives: true, // Support shared drives
})
```

### Document

Google Docs documents

#### `document.get()`

```typescript
const result = await client.document.get({
  documentId: 'example', // Document ID
})
```

#### `document.create()`

```typescript
const result = await client.document.create({
  requestBody: {}, // Document details
})
```

#### `document.batchUpdate()`

```typescript
const result = await client.document.batchUpdate({
  documentId: 'example', // Document ID
  requestBody: {}, // Batch update requests
})
```

### Spreadsheet

Google Sheets spreadsheets

#### `spreadsheet.get()`

```typescript
const result = await client.spreadsheet.get({
  spreadsheetId: 'example', // Spreadsheet ID
})
```

#### `spreadsheet.create()`

```typescript
const result = await client.spreadsheet.create({
  requestBody: {}, // Spreadsheet details
})
```

#### `spreadsheet.batchUpdate()`

```typescript
const result = await client.spreadsheet.batchUpdate({
  spreadsheetId: 'example', // Spreadsheet ID
  requestBody: {}, // Batch update requests
})
```

### SpreadsheetValues

Spreadsheet cell values

#### `spreadsheetValues.get()`

```typescript
const result = await client.spreadsheetValues.get({
  spreadsheetId: 'example', // Spreadsheet ID
  range: 'example', // A1 notation range (e.g., Sheet1!A1:C10)
})
```

#### `spreadsheetValues.update()`

```typescript
const result = await client.spreadsheetValues.update({
  spreadsheetId: 'example', // Spreadsheet ID
  range: 'example', // A1 notation range
  valueInputOption: 'USER_ENTERED', // How values should be interpreted
  requestBody: {}, // Values to update
})
```

#### `spreadsheetValues.append()`

```typescript
const result = await client.spreadsheetValues.append({
  spreadsheetId: 'example', // Spreadsheet ID
  range: 'example', // A1 notation range
  valueInputOption: 'USER_ENTERED', // How values should be interpreted
  requestBody: {}, // Values to append
})
```

#### `spreadsheetValues.clear()`

```typescript
const result = await client.spreadsheetValues.clear({
  spreadsheetId: 'example', // Spreadsheet ID
  range: 'example', // A1 notation range
})
```

#### `spreadsheetValues.batchGet()`

```typescript
const result = await client.spreadsheetValues.batchGet({
  spreadsheetId: 'example', // Spreadsheet ID
  ranges: value, // A1 notation ranges
})
```

### Contact

Contacts from People API

#### `contact.get()`

```typescript
const result = await client.contact.get({
  resourceName: 'example', // Contact resource name
  personFields: 'names,emailAddresses,phoneNumbers,addresses,organizations,birthdays,photos', // Fields to include
})
```

#### `contact.createContact()`

```typescript
const result = await client.contact.createContact({
  requestBody: {}, // Contact details
})
```

#### `contact.updateContact()`

```typescript
const result = await client.contact.updateContact({
  resourceName: 'example', // Contact resource name
  updatePersonFields: 'example', // Fields to update
  requestBody: {}, // Contact updates
})
```

#### `contact.deleteContact()`

```typescript
const result = await client.contact.deleteContact({
  resourceName: 'example', // Contact resource name
})
```

#### `contact.searchContacts()`

```typescript
const result = await client.contact.searchContacts({
  query: 'example', // Search query
  pageSize: 100, // Maximum results per page
  readMask: 'names,emailAddresses,phoneNumbers', // Fields to include
})
```

### ContactConnections

Contact connections (contact list)

#### `contactConnections.list()`

```typescript
const result = await client.contactConnections.list({
  resourceName: 'people/me', // Resource name (use 'people/me')
  pageSize: 100, // Maximum results per page
  pageToken: 'example', // Page token for pagination
  personFields: 'names,emailAddresses,phoneNumbers,addresses,organizations,birthdays,photos', // Fields to include
})
```

## Error Handling

All errors are thrown as `GoogleWorkspaceError` instances with additional metadata:

```typescript
try {
  const result = await client.gmailMessage.list()
} catch (error) {
  if (error instanceof GoogleWorkspaceError) {
    console.error('Error type:', error.type)
    console.error('Error code:', error.code)
    console.error('Status code:', error.statusCode)
    console.error('Retryable:', error.isRetriable())
  }
}
```

**Error Types:**

- `authentication` - Authentication failed
- `authorization` - Insufficient permissions
- `validation` - Invalid parameters
- `not_found` - Resource not found
- `rate_limit` - Rate limit exceeded
- `server` - Server error
- `network` - Network error
- `unknown` - Unknown error

## Webhooks

This Integration supports webhooks for real-time event notifications.

```typescript
import { GoogleWorkspaceWebhookHandler, WebhookEventRouter } from '@dotdo/integration-google-workspace'

// Initialize webhook handler
const handler = new GoogleWorkspaceWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onGmailMessageReceived(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `gmail.messageReceived` - Occurs when a new Gmail message is received
- `gmail.historyChanged` - Occurs when Gmail history changes (message added/deleted/labeled)
- `calendar.eventCreated` - Occurs when a calendar event is created
- `calendar.eventUpdated` - Occurs when a calendar event is updated
- `calendar.eventDeleted` - Occurs when a calendar event is deleted
- `drive.fileChanged` - Occurs when a Drive file is changed
- `drive.fileTrashed` - Occurs when a Drive file is trashed
- `drive.fileUntrashed` - Occurs when a Drive file is restored from trash
- `drive.fileDeleted` - Occurs when a Drive file is permanently deleted

## License

MIT
