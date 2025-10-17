import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { GoogleWorkspaceClient } from '../../../src/integrations/google-workspace'
import { E2ETestRunner } from '../e2e-test-runner'

// Environment variables for testing
const credentials = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
  private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  project_id: process.env.GOOGLE_PROJECT_ID!,
}
const testEmail = process.env.GOOGLE_TEST_EMAIL! // For sending test emails
const testCalendarId = process.env.GOOGLE_TEST_CALENDAR_ID || 'primary'

describe('Google Workspace Integration E2E Tests', () => {
  let client: GoogleWorkspaceClient
  let runner: E2ETestRunner
  const cleanup: Array<() => Promise<void>> = []

  beforeAll(async () => {
    runner = new E2ETestRunner('google-workspace')

    client = new GoogleWorkspaceClient({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/contacts',
      ],
    })

    await runner.setup()
  })

  afterEach(async () => {
    for (const cleanupFn of cleanup) {
      await cleanupFn().catch(console.error)
    }
    cleanup.length = 0
  })

  // Gmail Tests (8 scenarios)
  describe('Gmail Operations', () => {
    it('should send an email', async () => {
      await runner.run('send-email', async () => {
        const message = await client.gmail.sendEmail({
          to: testEmail,
          subject: 'Test Email from E2E Tests',
          text: 'This is a test email.',
          html: '<p>This is a <strong>test</strong> email.</p>',
        })

        expect(message.id).toBeDefined()
        expect(message.threadId).toBeDefined()
        expect(message.labelIds).toBeDefined()

        cleanup.push(async () => {
          await client.gmail.deleteMessage(message.id)
        })
      })
    })

    it('should list messages', async () => {
      await runner.run('list-messages', async () => {
        const messages = await client.gmail.listMessages({ maxResults: 10 })

        expect(Array.isArray(messages.messages)).toBe(true)
        expect(messages.resultSizeEstimate).toBeDefined()

        if (messages.messages && messages.messages.length > 0) {
          expect(messages.messages[0]).toHaveProperty('id')
          expect(messages.messages[0]).toHaveProperty('threadId')
        }
      })
    })

    it('should get a message by ID', async () => {
      await runner.run('get-message', async () => {
        const messages = await client.gmail.listMessages({ maxResults: 1 })

        if (messages.messages && messages.messages.length > 0) {
          const message = await client.gmail.getMessage(messages.messages[0].id)

          expect(message.id).toBe(messages.messages[0].id)
          expect(message.threadId).toBeDefined()
          expect(message.payload).toBeDefined()
          expect(message.payload.headers).toBeDefined()
          expect(Array.isArray(message.payload.headers)).toBe(true)
        }
      })
    })

    it('should create and manage labels', async () => {
      await runner.run('manage-labels', async () => {
        const labelName = `Test-${Date.now()}`
        const label = await client.gmail.createLabel(labelName)

        expect(label.id).toBeDefined()
        expect(label.name).toBe(labelName)
        expect(label.type).toBe('user')

        cleanup.push(async () => {
          await client.gmail.deleteLabel(label.id)
        })

        const labels = await client.gmail.listLabels()
        expect(Array.isArray(labels)).toBe(true)
        expect(labels.some((l) => l.id === label.id)).toBe(true)

        const labelWithName = labels.find((l) => l.id === label.id)
        expect(labelWithName?.name).toBe(labelName)
      })
    })

    it('should create and send a draft', async () => {
      await runner.run('draft-operations', async () => {
        const draft = await client.gmail.createDraft({
          to: testEmail,
          subject: 'Draft Email from E2E Tests',
          text: 'This is a draft email.',
          html: '<p>This is a <strong>draft</strong> email.</p>',
        })

        expect(draft.id).toBeDefined()
        expect(draft.message).toBeDefined()
        expect(draft.message.id).toBeDefined()

        const message = await client.gmail.sendDraft(draft.id)

        expect(message.id).toBeDefined()
        expect(message.threadId).toBeDefined()

        cleanup.push(async () => {
          await client.gmail.deleteMessage(message.id)
        })
      })
    })

    it('should modify message labels', async () => {
      await runner.run('modify-message', async () => {
        const messages = await client.gmail.listMessages({ maxResults: 1 })

        if (messages.messages && messages.messages.length > 0) {
          const messageId = messages.messages[0].id
          const originalMessage = await client.gmail.getMessage(messageId)
          const originalLabels = originalMessage.labelIds || []

          const modified = await client.gmail.modifyMessage(messageId, ['UNREAD'], [])

          expect(modified.id).toBe(messageId)
          expect(modified.labelIds).toBeDefined()
          expect(modified.labelIds?.includes('UNREAD')).toBe(true)

          // Restore original state
          cleanup.push(async () => {
            await client.gmail.modifyMessage(messageId, originalLabels, modified.labelIds || [])
          })
        }
      })
    })

    it('should batch delete messages', async () => {
      await runner.run('batch-delete', async () => {
        const ids: string[] = []

        // Create 3 test messages
        for (let i = 0; i < 3; i++) {
          const msg = await client.gmail.sendEmail({
            to: testEmail,
            subject: `Batch Delete Test ${i}`,
            text: `This is test message ${i} to be deleted`,
          })
          ids.push(msg.id)
        }

        expect(ids).toHaveLength(3)

        // Wait a moment for messages to be fully created
        await new Promise((resolve) => setTimeout(resolve, 2000))

        await client.gmail.batchDelete(ids)

        // Verify deletion - messages should no longer exist
        await new Promise((resolve) => setTimeout(resolve, 1000))

        for (const id of ids) {
          await expect(client.gmail.getMessage(id)).rejects.toThrow()
        }
      })
    })

    it('should handle email with attachments', async () => {
      await runner.run('email-attachments', async () => {
        const attachmentContent = 'This is test attachment content for E2E testing.'
        const message = await client.gmail.sendEmail({
          to: testEmail,
          subject: 'Email with Attachment from E2E Tests',
          text: 'Please see the attached file.',
          html: '<p>Please see the <strong>attached file</strong>.</p>',
          attachments: [
            {
              filename: 'test.txt',
              content: Buffer.from(attachmentContent),
              contentType: 'text/plain',
            },
          ],
        })

        expect(message.id).toBeDefined()
        expect(message.threadId).toBeDefined()

        // Get the full message to verify attachment
        const fullMessage = await client.gmail.getMessage(message.id)
        expect(fullMessage.payload.parts).toBeDefined()

        const attachment = fullMessage.payload.parts?.find((part) => part.filename === 'test.txt')
        expect(attachment).toBeDefined()
        expect(attachment?.mimeType).toBe('text/plain')

        cleanup.push(async () => {
          await client.gmail.deleteMessage(message.id)
        })
      })
    })
  })

  // Calendar Tests (7 scenarios)
  describe('Calendar Operations', () => {
    it('should create an event', async () => {
      await runner.run('create-event', async () => {
        const startTime = new Date(Date.now() + 86400000) // Tomorrow
        const endTime = new Date(Date.now() + 90000000) // Tomorrow + 1 hour

        const event = await client.calendar.createEvent(testCalendarId, {
          summary: 'E2E Test Event',
          description: 'Created by automated tests',
          start: { dateTime: startTime.toISOString() },
          end: { dateTime: endTime.toISOString() },
          location: 'Test Location',
        })

        expect(event.id).toBeDefined()
        expect(event.summary).toBe('E2E Test Event')
        expect(event.description).toBe('Created by automated tests')
        expect(event.start.dateTime).toBeDefined()
        expect(event.end.dateTime).toBeDefined()

        cleanup.push(async () => {
          await client.calendar.deleteEvent(testCalendarId, event.id)
        })
      })
    })

    it('should get an event by ID', async () => {
      await runner.run('get-event', async () => {
        const startTime = new Date(Date.now() + 86400000)
        const endTime = new Date(Date.now() + 90000000)

        const created = await client.calendar.createEvent(testCalendarId, {
          summary: 'Get Event Test',
          description: 'Test event for retrieval',
          start: { dateTime: startTime.toISOString() },
          end: { dateTime: endTime.toISOString() },
        })

        const event = await client.calendar.getEvent(testCalendarId, created.id)

        expect(event.id).toBe(created.id)
        expect(event.summary).toBe('Get Event Test')
        expect(event.description).toBe('Test event for retrieval')
        expect(event.start.dateTime).toBeDefined()
        expect(event.end.dateTime).toBeDefined()

        cleanup.push(async () => {
          await client.calendar.deleteEvent(testCalendarId, created.id)
        })
      })
    })

    it('should update an event', async () => {
      await runner.run('update-event', async () => {
        const startTime = new Date(Date.now() + 86400000)
        const endTime = new Date(Date.now() + 90000000)

        const created = await client.calendar.createEvent(testCalendarId, {
          summary: 'Original Summary',
          description: 'Original description',
          start: { dateTime: startTime.toISOString() },
          end: { dateTime: endTime.toISOString() },
        })

        const updated = await client.calendar.updateEvent(testCalendarId, created.id, {
          summary: 'Updated Summary',
          description: 'Updated description',
          location: 'New Location',
        })

        expect(updated.id).toBe(created.id)
        expect(updated.summary).toBe('Updated Summary')
        expect(updated.description).toBe('Updated description')
        expect(updated.location).toBe('New Location')

        cleanup.push(async () => {
          await client.calendar.deleteEvent(testCalendarId, updated.id)
        })
      })
    })

    it('should list events', async () => {
      await runner.run('list-events', async () => {
        const events = await client.calendar.listEvents(testCalendarId, { maxResults: 10 })

        expect(events).toBeDefined()
        expect(Array.isArray(events.items)).toBe(true)
        expect(events.kind).toBe('calendar#events')

        if (events.items.length > 0) {
          expect(events.items[0]).toHaveProperty('id')
          expect(events.items[0]).toHaveProperty('summary')
        }
      })
    })

    it('should quick add an event', async () => {
      await runner.run('quick-add-event', async () => {
        const event = await client.calendar.quickAdd(testCalendarId, 'Team meeting tomorrow at 3pm for 1 hour')

        expect(event.id).toBeDefined()
        expect(event.summary).toBeDefined()
        expect(event.start).toBeDefined()
        expect(event.end).toBeDefined()

        cleanup.push(async () => {
          await client.calendar.deleteEvent(testCalendarId, event.id)
        })
      })
    })

    it('should check free/busy times', async () => {
      await runner.run('free-busy', async () => {
        const timeMin = new Date()
        const timeMax = new Date(Date.now() + 86400000 * 7) // Next 7 days

        const result = await client.calendar.freeBusy({
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          items: [{ id: testCalendarId }],
        })

        expect(result.kind).toBe('calendar#freeBusy')
        expect(result.calendars).toBeDefined()
        expect(result.calendars[testCalendarId]).toBeDefined()
        expect(Array.isArray(result.calendars[testCalendarId].busy)).toBe(true)
      })
    })

    it('should manage calendars', async () => {
      await runner.run('manage-calendars', async () => {
        const calendarName = `Test Calendar ${Date.now()}`
        const calendar = await client.calendar.createCalendar(calendarName, 'Created by E2E tests for testing purposes')

        expect(calendar.id).toBeDefined()
        expect(calendar.summary).toBe(calendarName)
        expect(calendar.description).toBe('Created by E2E tests for testing purposes')

        cleanup.push(async () => {
          await client.calendar.deleteCalendar(calendar.id)
        })

        const calendars = await client.calendar.listCalendars()

        expect(calendars).toBeDefined()
        expect(Array.isArray(calendars.items)).toBe(true)
        expect(calendars.items.some((c) => c.id === calendar.id)).toBe(true)

        const foundCalendar = calendars.items.find((c) => c.id === calendar.id)
        expect(foundCalendar?.summary).toBe(calendarName)
      })
    })
  })

  // Drive Tests (8 scenarios)
  describe('Drive Operations', () => {
    it('should create a file', async () => {
      await runner.run('create-file', async () => {
        const fileName = `test-file-${Date.now()}.txt`
        const fileContent = 'This is test content for E2E testing.'

        const file = await client.drive.createFile({
          name: fileName,
          mimeType: 'text/plain',
          content: Buffer.from(fileContent),
        })

        expect(file.id).toBeDefined()
        expect(file.name).toBe(fileName)
        expect(file.mimeType).toBe('text/plain')

        cleanup.push(async () => {
          await client.drive.deleteFile(file.id)
        })
      })
    })

    it('should create a folder', async () => {
      await runner.run('create-folder', async () => {
        const folderName = `Test-Folder-${Date.now()}`
        const folder = await client.drive.createFolder(folderName)

        expect(folder.id).toBeDefined()
        expect(folder.name).toBe(folderName)
        expect(folder.mimeType).toBe('application/vnd.google-apps.folder')

        cleanup.push(async () => {
          await client.drive.deleteFile(folder.id)
        })
      })
    })

    it('should get file metadata', async () => {
      await runner.run('get-file', async () => {
        const fileName = `metadata-test-${Date.now()}.txt`
        const created = await client.drive.createFile({
          name: fileName,
          mimeType: 'text/plain',
          content: Buffer.from('Test content for metadata'),
        })

        const file = await client.drive.getFile(created.id)

        expect(file.id).toBe(created.id)
        expect(file.name).toBe(fileName)
        expect(file.mimeType).toBe('text/plain')
        expect(file.createdTime).toBeDefined()
        expect(file.modifiedTime).toBeDefined()

        cleanup.push(async () => {
          await client.drive.deleteFile(created.id)
        })
      })
    })

    it('should list files', async () => {
      await runner.run('list-files', async () => {
        const files = await client.drive.listFiles({ pageSize: 10 })

        expect(files).toBeDefined()
        expect(Array.isArray(files.files)).toBe(true)

        if (files.files.length > 0) {
          expect(files.files[0]).toHaveProperty('id')
          expect(files.files[0]).toHaveProperty('name')
          expect(files.files[0]).toHaveProperty('mimeType')
        }
      })
    })

    it('should search files', async () => {
      await runner.run('search-files', async () => {
        const results = await client.drive.searchFiles('mimeType="text/plain"', { pageSize: 5 })

        expect(results).toBeDefined()
        expect(Array.isArray(results.files)).toBe(true)

        if (results.files.length > 0) {
          results.files.forEach((file) => {
            expect(file.mimeType).toBe('text/plain')
          })
        }
      })
    })

    it('should copy a file', async () => {
      await runner.run('copy-file', async () => {
        const originalName = `original-${Date.now()}.txt`
        const copyName = `copy-${Date.now()}.txt`

        const original = await client.drive.createFile({
          name: originalName,
          mimeType: 'text/plain',
          content: Buffer.from('Original content to be copied'),
        })

        const copy = await client.drive.copyFile(original.id, copyName)

        expect(copy.id).not.toBe(original.id)
        expect(copy.name).toBe(copyName)
        expect(copy.mimeType).toBe('text/plain')

        cleanup.push(async () => {
          await client.drive.deleteFile(original.id)
          await client.drive.deleteFile(copy.id)
        })
      })
    })

    it('should share a file', async () => {
      await runner.run('share-file', async () => {
        const fileName = `shared-file-${Date.now()}.txt`
        const file = await client.drive.createFile({
          name: fileName,
          mimeType: 'text/plain',
          content: Buffer.from('Shared content for E2E testing'),
        })

        const permission = await client.drive.shareFile(file.id, {
          type: 'anyone',
          role: 'reader',
        })

        expect(permission.id).toBeDefined()
        expect(permission.type).toBe('anyone')
        expect(permission.role).toBe('reader')

        cleanup.push(async () => {
          await client.drive.deleteFile(file.id)
        })
      })
    })

    it('should update file metadata', async () => {
      await runner.run('update-file', async () => {
        const originalName = `before-update-${Date.now()}.txt`
        const updatedName = `after-update-${Date.now()}.txt`

        const file = await client.drive.createFile({
          name: originalName,
          mimeType: 'text/plain',
          content: Buffer.from('Content to be updated'),
        })

        const updated = await client.drive.updateFile(file.id, {
          name: updatedName,
          description: 'Updated description from E2E tests',
        })

        expect(updated.id).toBe(file.id)
        expect(updated.name).toBe(updatedName)
        expect(updated.description).toBe('Updated description from E2E tests')

        cleanup.push(async () => {
          await client.drive.deleteFile(updated.id)
        })
      })
    })
  })

  // Docs Tests (4 scenarios)
  describe('Docs Operations', () => {
    it('should create a document', async () => {
      await runner.run('create-document', async () => {
        const docTitle = `E2E Test Document ${Date.now()}`
        const doc = await client.docs.createDocument(docTitle)

        expect(doc.documentId).toBeDefined()
        expect(doc.title).toBe(docTitle)
        expect(doc.body).toBeDefined()
        expect(doc.revisionId).toBeDefined()

        cleanup.push(async () => {
          await client.drive.deleteFile(doc.documentId)
        })
      })
    })

    it('should insert text into a document', async () => {
      await runner.run('insert-text', async () => {
        const docTitle = `Text Insert Test ${Date.now()}`
        const doc = await client.docs.createDocument(docTitle)

        const textToInsert = 'Hello, World! This is inserted text from E2E tests.'
        await client.docs.insertText(doc.documentId, textToInsert, 1)

        const updated = await client.docs.getDocument(doc.documentId)

        expect(updated.body).toBeDefined()
        expect(updated.body.content).toBeDefined()
        expect(updated.revisionId).not.toBe(doc.revisionId)

        cleanup.push(async () => {
          await client.drive.deleteFile(doc.documentId)
        })
      })
    })

    it('should replace text in a document', async () => {
      await runner.run('replace-text', async () => {
        const docTitle = `Replace Test ${Date.now()}`
        const doc = await client.docs.createDocument(docTitle)

        await client.docs.insertText(doc.documentId, 'Hello, World! World is great!', 1)
        await client.docs.replaceText(doc.documentId, 'World', 'Universe')

        const updated = await client.docs.getDocument(doc.documentId)
        expect(updated.body).toBeDefined()

        cleanup.push(async () => {
          await client.drive.deleteFile(doc.documentId)
        })
      })
    })

    it('should batch update a document', async () => {
      await runner.run('batch-update-doc', async () => {
        const docTitle = `Batch Update Test ${Date.now()}`
        const doc = await client.docs.createDocument(docTitle)

        await client.docs.batchUpdate(doc.documentId, [
          {
            insertText: {
              location: { index: 1 },
              text: 'First line of content\n',
            },
          },
          {
            insertText: {
              location: { index: 23 },
              text: 'Second line of content\n',
            },
          },
          {
            insertText: {
              location: { index: 46 },
              text: 'Third line of content\n',
            },
          },
        ])

        const updated = await client.docs.getDocument(doc.documentId)
        expect(updated.body).toBeDefined()
        expect(updated.revisionId).not.toBe(doc.revisionId)

        cleanup.push(async () => {
          await client.drive.deleteFile(doc.documentId)
        })
      })
    })
  })

  // Sheets Tests (6 scenarios)
  describe('Sheets Operations', () => {
    it('should create a spreadsheet', async () => {
      await runner.run('create-spreadsheet', async () => {
        const sheetTitle = `E2E Test Sheet ${Date.now()}`
        const sheet = await client.sheets.createSpreadsheet(sheetTitle)

        expect(sheet.spreadsheetId).toBeDefined()
        expect(sheet.properties).toBeDefined()
        expect(sheet.properties.title).toBe(sheetTitle)
        expect(Array.isArray(sheet.sheets)).toBe(true)
        expect(sheet.sheets.length).toBeGreaterThan(0)

        cleanup.push(async () => {
          await client.drive.deleteFile(sheet.spreadsheetId)
        })
      })
    })

    it('should update values in a spreadsheet', async () => {
      await runner.run('update-values', async () => {
        const sheetTitle = `Update Test ${Date.now()}`
        const sheet = await client.sheets.createSpreadsheet(sheetTitle)

        const values = [
          ['Header 1', 'Header 2', 'Header 3'],
          ['Value 1A', 'Value 1B', 'Value 1C'],
          ['Value 2A', 'Value 2B', 'Value 2C'],
        ]

        await client.sheets.updateValues(sheet.spreadsheetId, 'Sheet1!A1:C3', values)

        const result = await client.sheets.getValues(sheet.spreadsheetId, 'Sheet1!A1:C3')

        expect(result.values).toBeDefined()
        expect(result.values).toHaveLength(3)
        expect(result.values[0]).toEqual(['Header 1', 'Header 2', 'Header 3'])

        cleanup.push(async () => {
          await client.drive.deleteFile(sheet.spreadsheetId)
        })
      })
    })

    it('should append values to a spreadsheet', async () => {
      await runner.run('append-values', async () => {
        const sheetTitle = `Append Test ${Date.now()}`
        const sheet = await client.sheets.createSpreadsheet(sheetTitle)

        const values = [['Row 1'], ['Row 2'], ['Row 3'], ['Row 4'], ['Row 5']]

        await client.sheets.appendValues(sheet.spreadsheetId, 'Sheet1!A1', values)

        const result = await client.sheets.getValues(sheet.spreadsheetId, 'Sheet1!A1:A5')

        expect(result.values).toBeDefined()
        expect(result.values).toHaveLength(5)
        expect(result.values[0]).toEqual(['Row 1'])
        expect(result.values[4]).toEqual(['Row 5'])

        cleanup.push(async () => {
          await client.drive.deleteFile(sheet.spreadsheetId)
        })
      })
    })

    it('should add a new sheet', async () => {
      await runner.run('add-sheet', async () => {
        const sheetTitle = `Multi-Sheet Test ${Date.now()}`
        const sheet = await client.sheets.createSpreadsheet(sheetTitle)

        expect(sheet.sheets).toHaveLength(1)

        const newSheetName = 'New Sheet Tab'
        await client.sheets.addSheet(sheet.spreadsheetId, newSheetName)

        const updated = await client.sheets.getSpreadsheet(sheet.spreadsheetId)

        expect(updated.sheets).toHaveLength(2)
        expect(updated.sheets.some((s) => s.properties.title === newSheetName)).toBe(true)

        cleanup.push(async () => {
          await client.drive.deleteFile(sheet.spreadsheetId)
        })
      })
    })

    it('should clear values in a range', async () => {
      await runner.run('clear-values', async () => {
        const sheetTitle = `Clear Test ${Date.now()}`
        const sheet = await client.sheets.createSpreadsheet(sheetTitle)

        await client.sheets.updateValues(sheet.spreadsheetId, 'Sheet1!A1:B2', [
          ['Data 1', 'Data 2'],
          ['Data 3', 'Data 4'],
        ])

        // Verify data was written
        const beforeClear = await client.sheets.getValues(sheet.spreadsheetId, 'Sheet1!A1:B2')
        expect(beforeClear.values).toHaveLength(2)

        await client.sheets.clearValues(sheet.spreadsheetId, 'Sheet1!A1:B2')

        const afterClear = await client.sheets.getValues(sheet.spreadsheetId, 'Sheet1!A1:B2')
        expect(afterClear.values).toBeUndefined()

        cleanup.push(async () => {
          await client.drive.deleteFile(sheet.spreadsheetId)
        })
      })
    })

    it('should batch get values from multiple ranges', async () => {
      await runner.run('batch-get-values', async () => {
        const sheetTitle = `Batch Get Test ${Date.now()}`
        const sheet = await client.sheets.createSpreadsheet(sheetTitle)

        await client.sheets.updateValues(sheet.spreadsheetId, 'Sheet1!A1:A3', [['1'], ['2'], ['3']])
        await client.sheets.updateValues(sheet.spreadsheetId, 'Sheet1!C1:C3', [['A'], ['B'], ['C']])

        const result = await client.sheets.batchGetValues(sheet.spreadsheetId, ['Sheet1!A1:A3', 'Sheet1!C1:C3'])

        expect(result.valueRanges).toBeDefined()
        expect(result.valueRanges).toHaveLength(2)
        expect(result.valueRanges[0].values).toEqual([['1'], ['2'], ['3']])
        expect(result.valueRanges[1].values).toEqual([['A'], ['B'], ['C']])

        cleanup.push(async () => {
          await client.drive.deleteFile(sheet.spreadsheetId)
        })
      })
    })
  })

  // Contacts Tests (4 scenarios)
  describe('Contacts Operations', () => {
    it('should create a contact', async () => {
      await runner.run('create-contact', async () => {
        const contact = await client.contacts.createContact({
          names: [
            {
              givenName: 'John',
              familyName: 'Doe',
              displayName: 'John Doe',
            },
          ],
          emailAddresses: [
            {
              value: 'john.doe@example.com',
              type: 'work',
            },
          ],
          phoneNumbers: [
            {
              value: '+1234567890',
              type: 'mobile',
            },
          ],
        })

        expect(contact.resourceName).toBeDefined()
        expect(contact.etag).toBeDefined()
        expect(contact.names).toBeDefined()
        expect(contact.names[0].givenName).toBe('John')
        expect(contact.names[0].familyName).toBe('Doe')

        cleanup.push(async () => {
          await client.contacts.deleteContact(contact.resourceName)
        })
      })
    })

    it('should get a contact by resource name', async () => {
      await runner.run('get-contact', async () => {
        const created = await client.contacts.createContact({
          names: [
            {
              givenName: 'Jane',
              familyName: 'Smith',
              displayName: 'Jane Smith',
            },
          ],
          emailAddresses: [
            {
              value: 'jane.smith@example.com',
            },
          ],
        })

        const contact = await client.contacts.getContact(created.resourceName)

        expect(contact.resourceName).toBe(created.resourceName)
        expect(contact.names).toBeDefined()
        expect(contact.names[0].givenName).toBe('Jane')
        expect(contact.names[0].familyName).toBe('Smith')
        expect(contact.emailAddresses).toBeDefined()

        cleanup.push(async () => {
          await client.contacts.deleteContact(created.resourceName)
        })
      })
    })

    it('should update a contact', async () => {
      await runner.run('update-contact', async () => {
        const created = await client.contacts.createContact({
          names: [
            {
              givenName: 'Bob',
              familyName: 'Jones',
              displayName: 'Bob Jones',
            },
          ],
        })

        const updated = await client.contacts.updateContact(created.resourceName, {
          phoneNumbers: [
            {
              value: '+1234567890',
              type: 'work',
            },
          ],
          organizations: [
            {
              name: 'Example Corp',
              title: 'Software Engineer',
            },
          ],
        })

        expect(updated.resourceName).toBe(created.resourceName)
        expect(updated.phoneNumbers).toBeDefined()
        expect(updated.phoneNumbers[0].value).toBe('+1234567890')
        expect(updated.organizations).toBeDefined()
        expect(updated.organizations[0].name).toBe('Example Corp')

        cleanup.push(async () => {
          await client.contacts.deleteContact(updated.resourceName)
        })
      })
    })

    it('should list contacts', async () => {
      await runner.run('list-contacts', async () => {
        const contacts = await client.contacts.listContacts({ pageSize: 10 })

        expect(contacts).toBeDefined()
        expect(Array.isArray(contacts.connections)).toBe(true)

        if (contacts.connections && contacts.connections.length > 0) {
          expect(contacts.connections[0]).toHaveProperty('resourceName')
          expect(contacts.connections[0]).toHaveProperty('etag')
        }
      })
    })
  })

  // Error Handling Test (1 scenario)
  describe('Error Handling', () => {
    it('should handle authentication errors', async () => {
      await runner.run('handle-auth-error', async () => {
        const invalidClient = new GoogleWorkspaceClient({
          credentials: {
            ...credentials,
            private_key: 'invalid-key-that-will-cause-auth-failure',
          },
          scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
        })

        await expect(invalidClient.gmail.listMessages()).rejects.toThrow()
      })
    })
  })
})
