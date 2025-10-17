/**
 * SendGrid Integration E2E Tests
 *
 * End-to-end tests for SendGrid API integration.
 * Tests cover emails, contacts, lists, segments, templates, suppressions, and webhooks.
 *
 * Prerequisites:
 * - SENDGRID_API_KEY environment variable must be set
 * - SENDGRID_FROM_EMAIL environment variable (verified sender email)
 * - SENDGRID_TO_EMAIL environment variable (email to send test messages to)
 * - SendGrid account with verified sender
 *
 * Test Categories:
 * 1. Email Operations (6 tests)
 * 2. Contact Operations (5 tests)
 * 3. List Operations (4 tests)
 * 4. Segment Operations (3 tests)
 * 5. Template Operations (3 tests)
 * 6. Suppression Operations (2 tests)
 * 7. Webhook Handling (1 test)
 * 8. Error Handling (1 test)
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from '../runner'
import { getTimeout } from '../config'
import crypto from 'crypto'

describe('SendGrid Integration E2E Tests', () => {
  let runner: E2ETestRunner
  let fromEmail: string
  let toEmail: string

  // Resource tracking for cleanup
  let createdContacts: string[] = []
  let createdLists: string[] = []
  let createdSegments: string[] = []
  let createdTemplates: string[] = []

  beforeEach(async () => {
    runner = new E2ETestRunner('sendgrid')

    // Check for required credentials
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY environment variable is required for SendGrid E2E tests')
    }

    if (!process.env.SENDGRID_FROM_EMAIL) {
      throw new Error('SENDGRID_FROM_EMAIL environment variable is required for SendGrid E2E tests')
    }

    if (!process.env.SENDGRID_TO_EMAIL) {
      throw new Error('SENDGRID_TO_EMAIL environment variable is required for SendGrid E2E tests')
    }

    fromEmail = process.env.SENDGRID_FROM_EMAIL
    toEmail = process.env.SENDGRID_TO_EMAIL

    // Reset tracking arrays
    createdContacts = []
    createdLists = []
    createdSegments = []
    createdTemplates = []
  })

  afterEach(async () => {
    const sdk = runner.getSDK()

    // Clean up templates
    for (const templateId of createdTemplates) {
      try {
        await sdk.api.sendgrid.templates.delete(templateId)
      } catch (error) {
        console.warn(`Failed to delete template ${templateId}:`, error)
      }
    }

    // Clean up segments
    for (const segmentId of createdSegments) {
      try {
        await sdk.api.sendgrid.segments.delete(segmentId)
      } catch (error) {
        console.warn(`Failed to delete segment ${segmentId}:`, error)
      }
    }

    // Clean up lists (this also removes contacts from lists)
    for (const listId of createdLists) {
      try {
        await sdk.api.sendgrid.lists.delete(listId)
      } catch (error) {
        console.warn(`Failed to delete list ${listId}:`, error)
      }
    }

    // Clean up contacts
    for (const contactId of createdContacts) {
      try {
        await sdk.api.sendgrid.contacts.delete(contactId)
      } catch (error) {
        console.warn(`Failed to delete contact ${contactId}:`, error)
      }
    }

    await runner.teardown()
  })

  // =============================================================================
  // 1. Email Operations (6 tests)
  // =============================================================================

  test(
    'should send simple email',
    async () => {
      const sdk = runner.getSDK()

      // Send email
      const result = await sdk.api.sendgrid.mail.send({
        from: fromEmail,
        to: toEmail,
        subject: `E2E Test: Simple Email - ${runner.testId}`,
        text: `This is a test email sent by E2E tests.\n\nTest ID: ${runner.testId}`,
        html: `<p>This is a test email sent by E2E tests.</p><p>Test ID: ${runner.testId}</p>`,
      })

      expect(result).toBeDefined()
      expect(result.statusCode).toBe(202)
      expect(result.headers).toBeDefined()
      expect(result.headers['x-message-id']).toBeTruthy()
    },
    getTimeout()
  )

  test(
    'should send email with attachments',
    async () => {
      const sdk = runner.getSDK()

      // Create attachment
      const attachmentContent = Buffer.from('This is a test attachment').toString('base64')

      // Send email with attachment
      const result = await sdk.api.sendgrid.mail.send({
        from: fromEmail,
        to: toEmail,
        subject: `E2E Test: Email with Attachment - ${runner.testId}`,
        text: 'This email has an attachment',
        attachments: [
          {
            content: attachmentContent,
            filename: `test-${runner.testId}.txt`,
            type: 'text/plain',
            disposition: 'attachment',
          },
        ],
      })

      expect(result).toBeDefined()
      expect(result.statusCode).toBe(202)
      expect(result.headers['x-message-id']).toBeTruthy()
    },
    getTimeout()
  )

  test(
    'should send email with CC and BCC',
    async () => {
      const sdk = runner.getSDK()

      // Note: Using same email for CC/BCC for testing
      const result = await sdk.api.sendgrid.mail.send({
        from: fromEmail,
        to: toEmail,
        cc: [{ email: toEmail, name: 'CC Recipient' }],
        bcc: [{ email: toEmail, name: 'BCC Recipient' }],
        subject: `E2E Test: CC and BCC - ${runner.testId}`,
        text: 'This email has CC and BCC recipients',
        html: '<p>This email has CC and BCC recipients</p>',
      })

      expect(result).toBeDefined()
      expect(result.statusCode).toBe(202)
    },
    getTimeout()
  )

  test(
    'should send bulk emails',
    async () => {
      const sdk = runner.getSDK()

      // Send multiple emails in batch
      const emails = [
        {
          from: fromEmail,
          to: toEmail,
          subject: `E2E Test: Bulk Email 1 - ${runner.testId}`,
          text: 'Bulk email 1',
        },
        {
          from: fromEmail,
          to: toEmail,
          subject: `E2E Test: Bulk Email 2 - ${runner.testId}`,
          text: 'Bulk email 2',
        },
        {
          from: fromEmail,
          to: toEmail,
          subject: `E2E Test: Bulk Email 3 - ${runner.testId}`,
          text: 'Bulk email 3',
        },
      ]

      const result = await sdk.api.sendgrid.mail.sendMultiple(emails)

      expect(result).toBeDefined()
      expect(result.statusCode).toBe(202)
    },
    getTimeout()
  )

  test(
    'should send template email',
    async () => {
      const sdk = runner.getSDK()

      // Create a simple template first
      const template = await sdk.api.sendgrid.templates.create({
        name: `E2E Test Template - ${runner.testId}`,
        generation: 'dynamic',
      })

      expect(template).toBeDefined()
      expect(template.id).toBeTruthy()
      createdTemplates.push(template.id)

      // Create a version for the template
      const version = await sdk.api.sendgrid.templates.createVersion(template.id, {
        name: 'Test Version',
        subject: 'Test Subject',
        html_content: '<p>Hello {{name}}</p>',
        plain_content: 'Hello {{name}}',
        active: 1,
      })

      expect(version).toBeDefined()

      // Wait for template to be active
      await runner.wait(2000)

      // Send email using template
      const result = await sdk.api.sendgrid.mail.send({
        from: fromEmail,
        to: toEmail,
        templateId: template.id,
      })

      expect(result).toBeDefined()
      expect(result.statusCode).toBe(202)
    },
    getTimeout()
  )

  test(
    'should send dynamic template email with substitutions',
    async () => {
      const sdk = runner.getSDK()

      // Create dynamic template
      const template = await sdk.api.sendgrid.templates.create({
        name: `E2E Test Dynamic Template - ${runner.testId}`,
        generation: 'dynamic',
      })

      expect(template).toBeDefined()
      createdTemplates.push(template.id)

      // Create version with dynamic data
      const version = await sdk.api.sendgrid.templates.createVersion(template.id, {
        name: 'Dynamic Version',
        subject: 'Hello {{name}}!',
        html_content: '<p>Hello {{name}}, your test ID is {{testId}}</p>',
        plain_content: 'Hello {{name}}, your test ID is {{testId}}',
        active: 1,
      })

      expect(version).toBeDefined()

      // Wait for template to be ready
      await runner.wait(2000)

      // Send email with dynamic data
      const result = await sdk.api.sendgrid.mail.send({
        from: fromEmail,
        to: toEmail,
        templateId: template.id,
        dynamicTemplateData: {
          name: 'Test User',
          testId: runner.testId,
        },
      })

      expect(result).toBeDefined()
      expect(result.statusCode).toBe(202)
    },
    getTimeout()
  )

  // =============================================================================
  // 2. Contact Operations (5 tests)
  // =============================================================================

  test(
    'should create contact',
    async () => {
      const sdk = runner.getSDK()

      // Create contact
      const result = await sdk.api.sendgrid.contacts.create({
        email: `test_${runner.testId}@example.com`,
        first_name: 'Test',
        last_name: 'User',
        custom_fields: {
          e2e_test_id: runner.testId,
        },
      })

      expect(result).toBeDefined()
      expect(result.job_id).toBeTruthy()

      // Wait for contact to be created
      await runner.wait(3000)

      // Search for the contact to get ID
      const search = await sdk.api.sendgrid.contacts.search({
        query: `email = 'test_${runner.testId}@example.com'`,
      })

      expect(search.result).toBeDefined()
      expect(search.result.length).toBeGreaterThan(0)

      const contact = search.result[0]
      expect(contact.id).toBeTruthy()
      expect(contact.email).toBe(`test_${runner.testId}@example.com`)
      expect(contact.first_name).toBe('Test')
      expect(contact.last_name).toBe('User')

      createdContacts.push(contact.id)
    },
    getTimeout()
  )

  test(
    'should get contact by ID',
    async () => {
      const sdk = runner.getSDK()

      // Create contact first
      await sdk.api.sendgrid.contacts.create({
        email: `test_retrieve_${runner.testId}@example.com`,
        first_name: 'Retrieve',
        last_name: 'Test',
      })

      // Wait for contact to be created
      await runner.wait(3000)

      // Search for contact to get ID
      const search = await sdk.api.sendgrid.contacts.search({
        query: `email = 'test_retrieve_${runner.testId}@example.com'`,
      })

      expect(search.result.length).toBeGreaterThan(0)
      const contactId = search.result[0].id
      createdContacts.push(contactId)

      // Retrieve contact by ID
      const contact = await sdk.api.sendgrid.contacts.get(contactId)

      expect(contact).toBeDefined()
      expect(contact.id).toBe(contactId)
      expect(contact.email).toBe(`test_retrieve_${runner.testId}@example.com`)
      expect(contact.first_name).toBe('Retrieve')
      expect(contact.last_name).toBe('Test')
    },
    getTimeout()
  )

  test(
    'should update contact',
    async () => {
      const sdk = runner.getSDK()

      // Create contact
      await sdk.api.sendgrid.contacts.create({
        email: `test_update_${runner.testId}@example.com`,
        first_name: 'Original',
        last_name: 'Name',
      })

      // Wait for contact to be created
      await runner.wait(3000)

      // Search for contact
      const search = await sdk.api.sendgrid.contacts.search({
        query: `email = 'test_update_${runner.testId}@example.com'`,
      })

      expect(search.result.length).toBeGreaterThan(0)
      const contactId = search.result[0].id
      createdContacts.push(contactId)

      // Update contact
      const result = await sdk.api.sendgrid.contacts.update({
        email: `test_update_${runner.testId}@example.com`,
        first_name: 'Updated',
        last_name: 'User',
        custom_fields: {
          updated: 'true',
        },
      })

      expect(result).toBeDefined()
      expect(result.job_id).toBeTruthy()

      // Wait for update to process
      await runner.wait(3000)

      // Verify update
      const updated = await sdk.api.sendgrid.contacts.get(contactId)
      expect(updated.first_name).toBe('Updated')
      expect(updated.last_name).toBe('User')
    },
    getTimeout()
  )

  test(
    'should list contacts',
    async () => {
      const sdk = runner.getSDK()

      // Create multiple contacts
      for (let i = 0; i < 3; i++) {
        await sdk.api.sendgrid.contacts.create({
          email: `test_list_${i}_${runner.testId}@example.com`,
          first_name: `Test${i}`,
          last_name: 'List',
        })
      }

      // Wait for contacts to be created
      await runner.wait(3000)

      // List contacts
      const result = await sdk.api.sendgrid.contacts.list({
        page_size: 50,
      })

      expect(result).toBeDefined()
      expect(result.result).toBeDefined()
      expect(Array.isArray(result.result)).toBe(true)
      expect(result.result.length).toBeGreaterThan(0)

      // Verify contact structure
      const contact = result.result[0]
      expect(contact.id).toBeTruthy()
      expect(contact.email).toBeTruthy()

      // Find and track our test contacts
      const testContacts = result.result.filter((c: any) => c.email.includes(runner.testId))
      testContacts.forEach((c: any) => createdContacts.push(c.id))
    },
    getTimeout()
  )

  test(
    'should search contacts by email',
    async () => {
      const sdk = runner.getSDK()

      const testEmail = `test_search_${runner.testId}@example.com`

      // Create contact
      await sdk.api.sendgrid.contacts.create({
        email: testEmail,
        first_name: 'Search',
        last_name: 'Test',
      })

      // Wait for contact to be indexed
      await runner.wait(3000)

      // Search for contact
      const result = await sdk.api.sendgrid.contacts.search({
        query: `email = '${testEmail}'`,
      })

      expect(result).toBeDefined()
      expect(result.result).toBeDefined()
      expect(Array.isArray(result.result)).toBe(true)
      expect(result.result.length).toBeGreaterThan(0)

      const contact = result.result[0]
      expect(contact.email).toBe(testEmail)
      expect(contact.first_name).toBe('Search')
      expect(contact.last_name).toBe('Test')

      createdContacts.push(contact.id)
    },
    getTimeout()
  )

  // =============================================================================
  // 3. List Operations (4 tests)
  // =============================================================================

  test(
    'should create contact list',
    async () => {
      const sdk = runner.getSDK()

      // Create list
      const list = await sdk.api.sendgrid.lists.create({
        name: `E2E Test List - ${runner.testId}`,
      })

      expect(list).toBeDefined()
      expect(list.id).toBeTruthy()
      expect(list.name).toBe(`E2E Test List - ${runner.testId}`)
      expect(list.contact_count).toBe(0)

      createdLists.push(list.id)
    },
    getTimeout()
  )

  test(
    'should add contacts to list',
    async () => {
      const sdk = runner.getSDK()

      // Create list
      const list = await sdk.api.sendgrid.lists.create({
        name: `E2E Test List - ${runner.testId}`,
      })

      expect(list).toBeDefined()
      createdLists.push(list.id)

      // Create contacts
      const emails = [`list_test_1_${runner.testId}@example.com`, `list_test_2_${runner.testId}@example.com`]

      for (const email of emails) {
        await sdk.api.sendgrid.contacts.create({
          email,
          first_name: 'List',
          last_name: 'Member',
          list_ids: [list.id],
        })
      }

      // Wait for contacts to be added
      await runner.wait(3000)

      // Verify contacts were added by searching
      for (const email of emails) {
        const search = await sdk.api.sendgrid.contacts.search({
          query: `email = '${email}'`,
        })

        expect(search.result.length).toBeGreaterThan(0)
        const contact = search.result[0]
        expect(contact.list_ids).toContain(list.id)
        createdContacts.push(contact.id)
      }
    },
    getTimeout()
  )

  test(
    'should get list details',
    async () => {
      const sdk = runner.getSDK()

      // Create list
      const created = await sdk.api.sendgrid.lists.create({
        name: `E2E Test List Details - ${runner.testId}`,
      })

      expect(created).toBeDefined()
      createdLists.push(created.id)

      // Wait for list to be fully created
      await runner.wait(1000)

      // Get list details
      const list = await sdk.api.sendgrid.lists.get(created.id)

      expect(list).toBeDefined()
      expect(list.id).toBe(created.id)
      expect(list.name).toBe(`E2E Test List Details - ${runner.testId}`)
      expect(list.contact_count).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should delete list',
    async () => {
      const sdk = runner.getSDK()

      // Create list
      const list = await sdk.api.sendgrid.lists.create({
        name: `E2E Test List Delete - ${runner.testId}`,
      })

      expect(list).toBeDefined()
      expect(list.id).toBeTruthy()

      // Wait for list to be created
      await runner.wait(1000)

      // Delete list
      await sdk.api.sendgrid.lists.delete(list.id)

      // Verify list is deleted (should throw 404)
      await expect(sdk.api.sendgrid.lists.get(list.id)).rejects.toThrow()
    },
    getTimeout()
  )

  // =============================================================================
  // 4. Segment Operations (3 tests)
  // =============================================================================

  test(
    'should create segment',
    async () => {
      const sdk = runner.getSDK()

      // Create segment with query
      const segment = await sdk.api.sendgrid.segments.create({
        name: `E2E Test Segment - ${runner.testId}`,
        query_dsl: JSON.stringify({
          and: [
            {
              field: 'last_name',
              value: 'Test',
              operator: 'eq',
            },
          ],
        }),
      })

      expect(segment).toBeDefined()
      expect(segment.id).toBeTruthy()
      expect(segment.name).toBe(`E2E Test Segment - ${runner.testId}`)
      expect(segment.query_dsl).toBeTruthy()
      expect(segment.contacts_count).toBeDefined()

      createdSegments.push(segment.id)
    },
    getTimeout()
  )

  test(
    'should get segment details',
    async () => {
      const sdk = runner.getSDK()

      // Create segment
      const created = await sdk.api.sendgrid.segments.create({
        name: `E2E Test Segment Details - ${runner.testId}`,
        query_dsl: JSON.stringify({
          and: [
            {
              field: 'email',
              value: '@example.com',
              operator: 'contains',
            },
          ],
        }),
      })

      expect(created).toBeDefined()
      createdSegments.push(created.id)

      // Wait for segment to be fully created
      await runner.wait(1000)

      // Get segment details
      const segment = await sdk.api.sendgrid.segments.get(created.id)

      expect(segment).toBeDefined()
      expect(segment.id).toBe(created.id)
      expect(segment.name).toBe(`E2E Test Segment Details - ${runner.testId}`)
      expect(segment.query_dsl).toBeTruthy()
      expect(segment.contacts_count).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should list segments',
    async () => {
      const sdk = runner.getSDK()

      // Create a test segment
      const segment = await sdk.api.sendgrid.segments.create({
        name: `E2E Test Segment List - ${runner.testId}`,
        query_dsl: JSON.stringify({
          and: [
            {
              field: 'first_name',
              value: 'Test',
              operator: 'eq',
            },
          ],
        }),
      })

      expect(segment).toBeDefined()
      createdSegments.push(segment.id)

      // Wait for segment to be indexed
      await runner.wait(1000)

      // List segments
      const result = await sdk.api.sendgrid.segments.list()

      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBeGreaterThan(0)

      // Find our test segment
      const testSegment = result.results.find((s: any) => s.id === segment.id)
      expect(testSegment).toBeDefined()
      expect(testSegment.name).toBe(`E2E Test Segment List - ${runner.testId}`)
    },
    getTimeout()
  )

  // =============================================================================
  // 5. Template Operations (3 tests)
  // =============================================================================

  test(
    'should create template',
    async () => {
      const sdk = runner.getSDK()

      // Create template
      const template = await sdk.api.sendgrid.templates.create({
        name: `E2E Test Template - ${runner.testId}`,
        generation: 'dynamic',
      })

      expect(template).toBeDefined()
      expect(template.id).toBeTruthy()
      expect(template.name).toBe(`E2E Test Template - ${runner.testId}`)
      expect(template.generation).toBe('dynamic')

      createdTemplates.push(template.id)
    },
    getTimeout()
  )

  test(
    'should get template',
    async () => {
      const sdk = runner.getSDK()

      // Create template
      const created = await sdk.api.sendgrid.templates.create({
        name: `E2E Test Template Get - ${runner.testId}`,
        generation: 'dynamic',
      })

      expect(created).toBeDefined()
      createdTemplates.push(created.id)

      // Wait for template to be created
      await runner.wait(1000)

      // Get template
      const template = await sdk.api.sendgrid.templates.get(created.id)

      expect(template).toBeDefined()
      expect(template.id).toBe(created.id)
      expect(template.name).toBe(`E2E Test Template Get - ${runner.testId}`)
      expect(template.generation).toBe('dynamic')
      expect(template.versions).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should list templates',
    async () => {
      const sdk = runner.getSDK()

      // Create a test template
      const template = await sdk.api.sendgrid.templates.create({
        name: `E2E Test Template List - ${runner.testId}`,
        generation: 'dynamic',
      })

      expect(template).toBeDefined()
      createdTemplates.push(template.id)

      // Wait for template to be indexed
      await runner.wait(1000)

      // List templates
      const result = await sdk.api.sendgrid.templates.list({
        generations: 'dynamic',
        page_size: 50,
      })

      expect(result).toBeDefined()
      expect(result.result).toBeDefined()
      expect(Array.isArray(result.result)).toBe(true)
      expect(result.result.length).toBeGreaterThan(0)

      // Find our test template
      const testTemplate = result.result.find((t: any) => t.id === template.id)
      expect(testTemplate).toBeDefined()
      expect(testTemplate.name).toBe(`E2E Test Template List - ${runner.testId}`)
    },
    getTimeout()
  )

  // =============================================================================
  // 6. Suppression Operations (2 tests)
  // =============================================================================

  test(
    'should add email to suppression group',
    async () => {
      const sdk = runner.getSDK()

      // Note: This test requires a suppression group ID
      const suppressionGroupId = process.env.SENDGRID_SUPPRESSION_GROUP_ID

      if (!suppressionGroupId) {
        console.log('Skipping test: SENDGRID_SUPPRESSION_GROUP_ID not set')
        return
      }

      const testEmail = `suppression_${runner.testId}@example.com`

      // Add email to suppression group
      const result = await sdk.api.sendgrid.suppressions.addToGroup(parseInt(suppressionGroupId), {
        recipient_emails: [testEmail],
      })

      expect(result).toBeDefined()
      expect(result.recipient_emails).toBeDefined()
      expect(result.recipient_emails).toContain(testEmail)

      // Clean up - remove from suppression group
      await sdk.api.sendgrid.suppressions.removeFromGroup(parseInt(suppressionGroupId), testEmail)
    },
    getTimeout()
  )

  test(
    'should list suppression groups',
    async () => {
      const sdk = runner.getSDK()

      // List all suppression groups
      const result = await sdk.api.sendgrid.suppressions.listGroups()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)

      // If groups exist, verify structure
      if (result.length > 0) {
        const group = result[0]
        expect(group.id).toBeTruthy()
        expect(group.name).toBeTruthy()
        expect(group.description).toBeDefined()
        expect(group.is_default).toBeDefined()
      }
    },
    getTimeout()
  )

  // =============================================================================
  // 7. Webhook Handling (1 test)
  // =============================================================================

  test(
    'should verify webhook signature',
    async () => {
      const sdk = runner.getSDK()

      // Create test webhook payload
      const payload = JSON.stringify({
        email: 'test@example.com',
        timestamp: Math.floor(Date.now() / 1000),
        event: 'delivered',
        sg_message_id: 'test-message-id',
      })

      // Note: SendGrid uses ECDSA signature verification
      // For testing, we'll use a simplified HMAC approach
      const webhookKey = process.env.SENDGRID_WEBHOOK_KEY || 'test-webhook-key'

      // Generate signature
      const signature = crypto.createHmac('sha256', webhookKey).update(payload).digest('base64')

      // Verify signature
      const isValid = await sdk.api.sendgrid.webhooks.verify({
        payload,
        signature,
        webhookKey,
      })

      expect(isValid).toBe(true)

      // Test with invalid signature
      const invalidSignature = 'invalid_signature_value'
      const isInvalid = await sdk.api.sendgrid.webhooks.verify({
        payload,
        signature: invalidSignature,
        webhookKey,
      })

      expect(isInvalid).toBe(false)
    },
    getTimeout()
  )

  // =============================================================================
  // 8. Error Handling (1 test)
  // =============================================================================

  test(
    'should handle various SendGrid API errors',
    async () => {
      const sdk = runner.getSDK()

      // Test 1: Invalid API key
      try {
        const invalidSdk = sdk.api.sendgrid.withApiKey('invalid_api_key')
        await invalidSdk.contacts.list({ page_size: 10 })

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.message.toLowerCase()).toMatch(/auth|invalid|unauthorized/)
      }

      // Test 2: Invalid email address
      try {
        await sdk.api.sendgrid.mail.send({
          from: fromEmail,
          to: 'invalid-email',
          subject: 'Test',
          text: 'Test',
        })

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.message.toLowerCase()).toMatch(/email|invalid/)
      }

      // Test 3: Rate limit handling
      // Note: Difficult to test without hitting actual rate limits
      // In production, implement exponential backoff retry logic

      // Test 4: Resource not found
      try {
        await sdk.api.sendgrid.contacts.get('non-existent-contact-id')

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.message.toLowerCase()).toMatch(/not found|does not exist/)
      }
    },
    getTimeout()
  )
})
