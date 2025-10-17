/**
 * HubSpot Integration E2E Tests
 *
 * End-to-end tests for HubSpot CRM API integration.
 * Tests cover contacts, companies, deals, tickets, engagements, lists, properties, and webhooks.
 *
 * Prerequisites:
 * - HUBSPOT_ACCESS_TOKEN environment variable must be set (private app access token)
 * - Token requires scopes: crm.objects.contacts, crm.objects.companies, crm.objects.deals,
 *   crm.objects.tickets, crm.objects.lists, crm.schemas.contacts.read
 * - HubSpot account with appropriate permissions
 *
 * Test Categories:
 * 1. Contact Operations (6 tests)
 * 2. Company Operations (5 tests)
 * 3. Deal Operations (4 tests)
 * 4. Ticket Operations (3 tests)
 * 5. Engagement Operations (3 tests)
 * 6. List Operations (2 tests)
 * 7. Property Operations (2 tests)
 * 8. Webhook Handling (1 test)
 * 9. Error Handling (1 test)
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from '../runner'
import { getTimeout } from '../config'
import crypto from 'crypto'

describe('HubSpot Integration E2E Tests', () => {
  let runner: E2ETestRunner

  // Resource tracking for cleanup
  let createdContacts: string[] = []
  let createdCompanies: string[] = []
  let createdDeals: string[] = []
  let createdTickets: string[] = []
  let createdLists: string[] = []

  beforeEach(async () => {
    runner = new E2ETestRunner('hubspot')

    // Check for required credentials
    if (!process.env.HUBSPOT_ACCESS_TOKEN) {
      throw new Error('HUBSPOT_ACCESS_TOKEN environment variable is required for HubSpot E2E tests')
    }

    // Reset tracking arrays
    createdContacts = []
    createdCompanies = []
    createdDeals = []
    createdTickets = []
    createdLists = []
  })

  afterEach(async () => {
    const sdk = runner.getSDK()

    // Clean up resources in reverse dependency order
    // Delete deals first (depend on companies and contacts)
    for (const dealId of createdDeals) {
      try {
        await sdk.api.hubspot.deals.delete(dealId)
      } catch (error) {
        console.warn(`Failed to delete deal ${dealId}:`, error)
      }
    }

    // Delete tickets (no dependencies)
    for (const ticketId of createdTickets) {
      try {
        await sdk.api.hubspot.tickets.delete(ticketId)
      } catch (error) {
        console.warn(`Failed to delete ticket ${ticketId}:`, error)
      }
    }

    // Delete contacts (depend on companies)
    for (const contactId of createdContacts) {
      try {
        await sdk.api.hubspot.contacts.delete(contactId)
      } catch (error) {
        console.warn(`Failed to delete contact ${contactId}:`, error)
      }
    }

    // Delete companies last (other records depend on it)
    for (const companyId of createdCompanies) {
      try {
        await sdk.api.hubspot.companies.delete(companyId)
      } catch (error) {
        console.warn(`Failed to delete company ${companyId}:`, error)
      }
    }

    // Delete lists
    for (const listId of createdLists) {
      try {
        await sdk.api.hubspot.lists.delete(listId)
      } catch (error) {
        console.warn(`Failed to delete list ${listId}:`, error)
      }
    }

    await runner.teardown()
  })

  // =============================================================================
  // 1. Contact Operations (6 tests)
  // =============================================================================

  test(
    'should create contact with email and properties',
    async () => {
      const sdk = runner.getSDK()

      // Create contact
      const contact = await sdk.api.hubspot.contacts.create({
        properties: {
          email: `test_${runner.testId}@example.com`,
          firstname: 'John',
          lastname: 'TestContact',
          phone: '415-555-1001',
          company: `Test Company ${runner.testId}`,
          website: 'https://example.com',
          city: 'San Francisco',
          state: 'California',
          country: 'United States',
          jobtitle: 'Software Engineer',
        },
      })

      expect(contact).toBeDefined()
      expect(contact.id).toBeTruthy()
      expect(contact.properties).toBeDefined()
      expect(contact.properties.email).toBe(`test_${runner.testId}@example.com`)
      expect(contact.properties.firstname).toBe('John')
      expect(contact.properties.lastname).toBe('TestContact')
      expect(contact.properties.phone).toBe('415-555-1001')
      expect(contact.createdAt).toBeTruthy()

      // Track for cleanup
      createdContacts.push(contact.id)

      // Verify contact was created
      const retrieved = await sdk.api.hubspot.contacts.get(contact.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(contact.id)
      expect(retrieved.properties.email).toBe(`test_${runner.testId}@example.com`)
    },
    getTimeout()
  )

  test(
    'should get contact by ID',
    async () => {
      const sdk = runner.getSDK()

      // Create contact first
      const created = await sdk.api.hubspot.contacts.create({
        properties: {
          email: `test_retrieve_${runner.testId}@example.com`,
          firstname: 'Jane',
          lastname: 'TestRetrieve',
          phone: '415-555-1002',
        },
      })

      expect(created.id).toBeTruthy()
      createdContacts.push(created.id)

      // Wait for record to be indexed
      await runner.wait(1000)

      // Retrieve contact
      const contact = await sdk.api.hubspot.contacts.get(created.id)

      expect(contact).toBeDefined()
      expect(contact.id).toBe(created.id)
      expect(contact.properties.email).toBe(`test_retrieve_${runner.testId}@example.com`)
      expect(contact.properties.firstname).toBe('Jane')
      expect(contact.properties.lastname).toBe('TestRetrieve')
      expect(contact.properties.phone).toBe('415-555-1002')
      expect(contact.createdAt).toBeTruthy()
      expect(contact.updatedAt).toBeTruthy()
    },
    getTimeout()
  )

  test(
    'should update contact properties',
    async () => {
      const sdk = runner.getSDK()

      // Create contact
      const created = await sdk.api.hubspot.contacts.create({
        properties: {
          email: `test_update_${runner.testId}@example.com`,
          firstname: 'Bob',
          lastname: 'TestUpdate',
          phone: '415-555-1003',
        },
      })

      expect(created.id).toBeTruthy()
      createdContacts.push(created.id)

      // Wait for record to be ready
      await runner.wait(1000)

      // Update contact
      const updated = await sdk.api.hubspot.contacts.update(created.id, {
        properties: {
          firstname: 'Robert',
          phone: '415-555-1004',
          jobtitle: 'Senior Engineer',
          city: 'Oakland',
          state: 'California',
        },
      })

      expect(updated).toBeDefined()
      expect(updated.id).toBe(created.id)
      expect(updated.properties.firstname).toBe('Robert')
      expect(updated.properties.phone).toBe('415-555-1004')
      expect(updated.properties.jobtitle).toBe('Senior Engineer')
      expect(updated.properties.city).toBe('Oakland')

      // Verify update
      const retrieved = await sdk.api.hubspot.contacts.get(created.id)
      expect(retrieved.properties.firstname).toBe('Robert')
      expect(retrieved.properties.phone).toBe('415-555-1004')
      expect(retrieved.properties.jobtitle).toBe('Senior Engineer')
    },
    getTimeout()
  )

  test(
    'should list contacts',
    async () => {
      const sdk = runner.getSDK()

      // Create multiple test contacts
      for (let i = 0; i < 3; i++) {
        const contact = await sdk.api.hubspot.contacts.create({
          properties: {
            email: `test_list_${i}_${runner.testId}@example.com`,
            firstname: `Contact${i}`,
            lastname: `TestList`,
            phone: `415-555-10${10 + i}`,
          },
        })

        expect(contact.id).toBeTruthy()
        createdContacts.push(contact.id)
      }

      // Wait for records to be indexed
      await runner.wait(2000)

      // List contacts
      const result = await sdk.api.hubspot.contacts.list({
        limit: 10,
      })

      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBeGreaterThan(0)
      expect(result.results.length).toBeLessThanOrEqual(10)

      // Verify contact structure
      const contact = result.results[0]
      expect(contact.id).toBeTruthy()
      expect(contact.properties).toBeDefined()
      expect(contact.properties.email).toBeTruthy()
      expect(contact.createdAt).toBeTruthy()

      // Verify at least some of our test contacts are in the list
      const testContacts = result.results.filter((c) => c.properties.email?.includes(runner.testId))
      expect(testContacts.length).toBeGreaterThan(0)
    },
    getTimeout()
  )

  test(
    'should search contacts by email',
    async () => {
      const sdk = runner.getSDK()

      const searchEmail = `test_search_${runner.testId}@example.com`

      // Create contact
      const created = await sdk.api.hubspot.contacts.create({
        properties: {
          email: searchEmail,
          firstname: 'Search',
          lastname: 'TestContact',
          phone: '415-555-1020',
        },
      })

      expect(created.id).toBeTruthy()
      createdContacts.push(created.id)

      // Wait for indexing
      await runner.wait(2000)

      // Search by email
      const result = await sdk.api.hubspot.contacts.search({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: searchEmail,
              },
            ],
          },
        ],
        properties: ['email', 'firstname', 'lastname', 'phone'],
      })

      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(result.results.length).toBeGreaterThan(0)

      // Find our contact
      const contact = result.results.find((c) => c.id === created.id)
      expect(contact).toBeDefined()
      expect(contact?.properties.email).toBe(searchEmail)
      expect(contact?.properties.firstname).toBe('Search')
      expect(contact?.properties.lastname).toBe('TestContact')
    },
    getTimeout()
  )

  test(
    'should batch create multiple contacts',
    async () => {
      const sdk = runner.getSDK()

      // Prepare batch of contacts
      const contacts = [
        {
          properties: {
            email: `test_batch_1_${runner.testId}@example.com`,
            firstname: 'Batch1',
            lastname: 'TestContact',
          },
        },
        {
          properties: {
            email: `test_batch_2_${runner.testId}@example.com`,
            firstname: 'Batch2',
            lastname: 'TestContact',
          },
        },
        {
          properties: {
            email: `test_batch_3_${runner.testId}@example.com`,
            firstname: 'Batch3',
            lastname: 'TestContact',
          },
        },
      ]

      // Batch create
      const result = await sdk.api.hubspot.contacts.batchCreate(contacts)

      expect(result).toBeDefined()
      expect(result.status).toBe('COMPLETE')
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBe(3)

      // Track for cleanup
      result.results.forEach((contact: any) => {
        expect(contact.id).toBeTruthy()
        createdContacts.push(contact.id)
      })

      // Verify first contact
      expect(result.results[0].properties.email).toBe(`test_batch_1_${runner.testId}@example.com`)
      expect(result.results[0].properties.firstname).toBe('Batch1')
    },
    getTimeout()
  )

  // =============================================================================
  // 2. Company Operations (5 tests)
  // =============================================================================

  test(
    'should create company with domain and properties',
    async () => {
      const sdk = runner.getSDK()

      // Create company
      const company = await sdk.api.hubspot.companies.create({
        properties: {
          name: `Test Company ${runner.testId}`,
          domain: `testcompany${runner.testId}.com`,
          city: 'San Francisco',
          state: 'California',
          country: 'United States',
          industry: 'Technology',
          phone: '415-555-2001',
          website: `https://testcompany${runner.testId}.com`,
          description: `E2E test company - ${runner.testId}`,
          numberofemployees: 50,
          annualrevenue: '5000000',
        },
      })

      expect(company).toBeDefined()
      expect(company.id).toBeTruthy()
      expect(company.properties).toBeDefined()
      expect(company.properties.name).toBe(`Test Company ${runner.testId}`)
      expect(company.properties.domain).toBe(`testcompany${runner.testId}.com`)
      expect(company.properties.industry).toBe('Technology')
      expect(company.createdAt).toBeTruthy()

      // Track for cleanup
      createdCompanies.push(company.id)

      // Verify company was created
      const retrieved = await sdk.api.hubspot.companies.get(company.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(company.id)
      expect(retrieved.properties.name).toBe(`Test Company ${runner.testId}`)
    },
    getTimeout()
  )

  test(
    'should get company by ID',
    async () => {
      const sdk = runner.getSDK()

      // Create company first
      const created = await sdk.api.hubspot.companies.create({
        properties: {
          name: `Test Company Retrieve ${runner.testId}`,
          domain: `retrieve${runner.testId}.com`,
          city: 'Oakland',
          industry: 'Healthcare',
        },
      })

      expect(created.id).toBeTruthy()
      createdCompanies.push(created.id)

      // Wait for record to be indexed
      await runner.wait(1000)

      // Retrieve company
      const company = await sdk.api.hubspot.companies.get(created.id)

      expect(company).toBeDefined()
      expect(company.id).toBe(created.id)
      expect(company.properties.name).toBe(`Test Company Retrieve ${runner.testId}`)
      expect(company.properties.domain).toBe(`retrieve${runner.testId}.com`)
      expect(company.properties.industry).toBe('Healthcare')
      expect(company.createdAt).toBeTruthy()
      expect(company.updatedAt).toBeTruthy()
    },
    getTimeout()
  )

  test(
    'should update company properties',
    async () => {
      const sdk = runner.getSDK()

      // Create company
      const created = await sdk.api.hubspot.companies.create({
        properties: {
          name: `Test Company Update ${runner.testId}`,
          domain: `update${runner.testId}.com`,
          city: 'San Jose',
          numberofemployees: 25,
        },
      })

      expect(created.id).toBeTruthy()
      createdCompanies.push(created.id)

      // Wait for record to be ready
      await runner.wait(1000)

      // Update company
      const updated = await sdk.api.hubspot.companies.update(created.id, {
        properties: {
          city: 'Palo Alto',
          state: 'California',
          numberofemployees: 100,
          annualrevenue: '10000000',
          industry: 'Software',
          description: 'Updated company description',
        },
      })

      expect(updated).toBeDefined()
      expect(updated.id).toBe(created.id)
      expect(updated.properties.city).toBe('Palo Alto')
      expect(updated.properties.numberofemployees).toBe('100')
      expect(updated.properties.annualrevenue).toBe('10000000')

      // Verify update
      const retrieved = await sdk.api.hubspot.companies.get(created.id)
      expect(retrieved.properties.city).toBe('Palo Alto')
      expect(retrieved.properties.numberofemployees).toBe('100')
      expect(retrieved.properties.industry).toBe('Software')
    },
    getTimeout()
  )

  test(
    'should list companies',
    async () => {
      const sdk = runner.getSDK()

      // Create multiple test companies
      for (let i = 0; i < 3; i++) {
        const company = await sdk.api.hubspot.companies.create({
          properties: {
            name: `Test Company List ${i} - ${runner.testId}`,
            domain: `list${i}${runner.testId}.com`,
            industry: 'Technology',
          },
        })

        expect(company.id).toBeTruthy()
        createdCompanies.push(company.id)
      }

      // Wait for records to be indexed
      await runner.wait(2000)

      // List companies
      const result = await sdk.api.hubspot.companies.list({
        limit: 10,
      })

      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBeGreaterThan(0)
      expect(result.results.length).toBeLessThanOrEqual(10)

      // Verify company structure
      const company = result.results[0]
      expect(company.id).toBeTruthy()
      expect(company.properties).toBeDefined()
      expect(company.properties.name).toBeTruthy()
      expect(company.createdAt).toBeTruthy()

      // Verify at least some of our test companies are in the list
      const testCompanies = result.results.filter((c) => c.properties.name?.includes(runner.testId))
      expect(testCompanies.length).toBeGreaterThan(0)
    },
    getTimeout()
  )

  test(
    'should search companies by domain',
    async () => {
      const sdk = runner.getSDK()

      const searchDomain = `search${runner.testId}.com`

      // Create company
      const created = await sdk.api.hubspot.companies.create({
        properties: {
          name: `Search Test Company ${runner.testId}`,
          domain: searchDomain,
          industry: 'Technology',
        },
      })

      expect(created.id).toBeTruthy()
      createdCompanies.push(created.id)

      // Wait for indexing
      await runner.wait(2000)

      // Search by domain
      const result = await sdk.api.hubspot.companies.search({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'domain',
                operator: 'EQ',
                value: searchDomain,
              },
            ],
          },
        ],
        properties: ['name', 'domain', 'industry'],
      })

      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(result.results.length).toBeGreaterThan(0)

      // Find our company
      const company = result.results.find((c) => c.id === created.id)
      expect(company).toBeDefined()
      expect(company?.properties.domain).toBe(searchDomain)
      expect(company?.properties.name).toBe(`Search Test Company ${runner.testId}`)
    },
    getTimeout()
  )

  // =============================================================================
  // 3. Deal Operations (4 tests)
  // =============================================================================

  test(
    'should create deal with amount and stage',
    async () => {
      const sdk = runner.getSDK()

      // Create company first
      const company = await sdk.api.hubspot.companies.create({
        properties: {
          name: `Deal Test Company ${runner.testId}`,
          domain: `dealtest${runner.testId}.com`,
        },
      })

      expect(company.id).toBeTruthy()
      createdCompanies.push(company.id)

      // Create deal
      const closeDate = new Date()
      closeDate.setMonth(closeDate.getMonth() + 3)

      const deal = await sdk.api.hubspot.deals.create({
        properties: {
          dealname: `Test Deal ${runner.testId}`,
          dealstage: 'appointmentscheduled',
          amount: '50000',
          closedate: closeDate.toISOString(),
          pipeline: 'default',
          dealtype: 'newbusiness',
          description: `E2E test deal - ${runner.testId}`,
        },
      })

      expect(deal).toBeDefined()
      expect(deal.id).toBeTruthy()
      expect(deal.properties).toBeDefined()
      expect(deal.properties.dealname).toBe(`Test Deal ${runner.testId}`)
      expect(deal.properties.dealstage).toBe('appointmentscheduled')
      expect(deal.properties.amount).toBe('50000')
      expect(deal.createdAt).toBeTruthy()

      // Track for cleanup
      createdDeals.push(deal.id)

      // Associate deal with company
      await sdk.api.hubspot.deals.associate(deal.id, 'company', company.id)

      // Verify deal was created
      const retrieved = await sdk.api.hubspot.deals.get(deal.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(deal.id)
      expect(retrieved.properties.dealname).toBe(`Test Deal ${runner.testId}`)
    },
    getTimeout()
  )

  test(
    'should get deal by ID',
    async () => {
      const sdk = runner.getSDK()

      // Create deal first
      const created = await sdk.api.hubspot.deals.create({
        properties: {
          dealname: `Test Deal Retrieve ${runner.testId}`,
          dealstage: 'qualifiedtobuy',
          amount: '75000',
          pipeline: 'default',
        },
      })

      expect(created.id).toBeTruthy()
      createdDeals.push(created.id)

      // Wait for record to be indexed
      await runner.wait(1000)

      // Retrieve deal
      const deal = await sdk.api.hubspot.deals.get(created.id)

      expect(deal).toBeDefined()
      expect(deal.id).toBe(created.id)
      expect(deal.properties.dealname).toBe(`Test Deal Retrieve ${runner.testId}`)
      expect(deal.properties.dealstage).toBe('qualifiedtobuy')
      expect(deal.properties.amount).toBe('75000')
      expect(deal.createdAt).toBeTruthy()
      expect(deal.updatedAt).toBeTruthy()
    },
    getTimeout()
  )

  test(
    'should update deal stage and amount',
    async () => {
      const sdk = runner.getSDK()

      // Create deal
      const created = await sdk.api.hubspot.deals.create({
        properties: {
          dealname: `Test Deal Update ${runner.testId}`,
          dealstage: 'appointmentscheduled',
          amount: '100000',
          pipeline: 'default',
        },
      })

      expect(created.id).toBeTruthy()
      createdDeals.push(created.id)

      // Wait for record to be ready
      await runner.wait(1000)

      // Update deal
      const updated = await sdk.api.hubspot.deals.update(created.id, {
        properties: {
          dealstage: 'presentationscheduled',
          amount: '125000',
          description: 'Deal progressed to presentation stage',
        },
      })

      expect(updated).toBeDefined()
      expect(updated.id).toBe(created.id)
      expect(updated.properties.dealstage).toBe('presentationscheduled')
      expect(updated.properties.amount).toBe('125000')

      // Verify update
      const retrieved = await sdk.api.hubspot.deals.get(created.id)
      expect(retrieved.properties.dealstage).toBe('presentationscheduled')
      expect(retrieved.properties.amount).toBe('125000')
      expect(retrieved.properties.description).toBe('Deal progressed to presentation stage')
    },
    getTimeout()
  )

  test(
    'should associate deal with contact and company',
    async () => {
      const sdk = runner.getSDK()

      // Create company
      const company = await sdk.api.hubspot.companies.create({
        properties: {
          name: `Associate Test Company ${runner.testId}`,
          domain: `associate${runner.testId}.com`,
        },
      })

      expect(company.id).toBeTruthy()
      createdCompanies.push(company.id)

      // Create contact
      const contact = await sdk.api.hubspot.contacts.create({
        properties: {
          email: `test_associate_${runner.testId}@example.com`,
          firstname: 'Associate',
          lastname: 'TestContact',
        },
      })

      expect(contact.id).toBeTruthy()
      createdContacts.push(contact.id)

      // Create deal
      const deal = await sdk.api.hubspot.deals.create({
        properties: {
          dealname: `Associate Test Deal ${runner.testId}`,
          dealstage: 'appointmentscheduled',
          amount: '50000',
        },
      })

      expect(deal.id).toBeTruthy()
      createdDeals.push(deal.id)

      // Wait for records to be ready
      await runner.wait(1000)

      // Associate deal with company
      const companyAssociation = await sdk.api.hubspot.deals.associate(deal.id, 'company', company.id)
      expect(companyAssociation).toBeDefined()

      // Associate deal with contact
      const contactAssociation = await sdk.api.hubspot.deals.associate(deal.id, 'contact', contact.id)
      expect(contactAssociation).toBeDefined()

      // Verify associations
      const associations = await sdk.api.hubspot.deals.getAssociations(deal.id)
      expect(associations).toBeDefined()
      expect(associations.companies).toBeDefined()
      expect(associations.companies.some((c: any) => c.id === company.id)).toBe(true)
      expect(associations.contacts).toBeDefined()
      expect(associations.contacts.some((c: any) => c.id === contact.id)).toBe(true)
    },
    getTimeout()
  )

  // =============================================================================
  // 4. Ticket Operations (3 tests)
  // =============================================================================

  test(
    'should create ticket with subject and priority',
    async () => {
      const sdk = runner.getSDK()

      // Create ticket
      const ticket = await sdk.api.hubspot.tickets.create({
        properties: {
          subject: `Test Ticket ${runner.testId}`,
          content: `E2E test ticket created by automated tests - ${runner.testId}`,
          hs_pipeline: 'support',
          hs_pipeline_stage: '1',
          hs_ticket_priority: 'MEDIUM',
          source_type: 'API',
        },
      })

      expect(ticket).toBeDefined()
      expect(ticket.id).toBeTruthy()
      expect(ticket.properties).toBeDefined()
      expect(ticket.properties.subject).toBe(`Test Ticket ${runner.testId}`)
      expect(ticket.properties.hs_ticket_priority).toBe('MEDIUM')
      expect(ticket.createdAt).toBeTruthy()

      // Track for cleanup
      createdTickets.push(ticket.id)

      // Verify ticket was created
      const retrieved = await sdk.api.hubspot.tickets.get(ticket.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(ticket.id)
      expect(retrieved.properties.subject).toBe(`Test Ticket ${runner.testId}`)
    },
    getTimeout()
  )

  test(
    'should update ticket status',
    async () => {
      const sdk = runner.getSDK()

      // Create ticket
      const created = await sdk.api.hubspot.tickets.create({
        properties: {
          subject: `Test Ticket Update ${runner.testId}`,
          content: 'Initial ticket content',
          hs_pipeline: 'support',
          hs_pipeline_stage: '1',
          hs_ticket_priority: 'LOW',
        },
      })

      expect(created.id).toBeTruthy()
      createdTickets.push(created.id)

      // Wait for record to be ready
      await runner.wait(1000)

      // Update ticket
      const updated = await sdk.api.hubspot.tickets.update(created.id, {
        properties: {
          hs_pipeline_stage: '2',
          hs_ticket_priority: 'HIGH',
          content: 'Updated ticket content - issue escalated',
        },
      })

      expect(updated).toBeDefined()
      expect(updated.id).toBe(created.id)
      expect(updated.properties.hs_pipeline_stage).toBe('2')
      expect(updated.properties.hs_ticket_priority).toBe('HIGH')

      // Verify update
      const retrieved = await sdk.api.hubspot.tickets.get(created.id)
      expect(retrieved.properties.hs_pipeline_stage).toBe('2')
      expect(retrieved.properties.hs_ticket_priority).toBe('HIGH')
      expect(retrieved.properties.content).toBe('Updated ticket content - issue escalated')
    },
    getTimeout()
  )

  test(
    'should get ticket by ID',
    async () => {
      const sdk = runner.getSDK()

      // Create ticket first
      const created = await sdk.api.hubspot.tickets.create({
        properties: {
          subject: `Test Ticket Retrieve ${runner.testId}`,
          content: 'Test ticket for retrieval',
          hs_pipeline: 'support',
          hs_pipeline_stage: '1',
          hs_ticket_priority: 'HIGH',
        },
      })

      expect(created.id).toBeTruthy()
      createdTickets.push(created.id)

      // Wait for record to be indexed
      await runner.wait(1000)

      // Retrieve ticket
      const ticket = await sdk.api.hubspot.tickets.get(created.id)

      expect(ticket).toBeDefined()
      expect(ticket.id).toBe(created.id)
      expect(ticket.properties.subject).toBe(`Test Ticket Retrieve ${runner.testId}`)
      expect(ticket.properties.content).toBe('Test ticket for retrieval')
      expect(ticket.properties.hs_ticket_priority).toBe('HIGH')
      expect(ticket.createdAt).toBeTruthy()
      expect(ticket.updatedAt).toBeTruthy()
    },
    getTimeout()
  )

  // =============================================================================
  // 5. Engagement Operations (3 tests)
  // =============================================================================

  test(
    'should create note for contact',
    async () => {
      const sdk = runner.getSDK()

      // Create contact first
      const contact = await sdk.api.hubspot.contacts.create({
        properties: {
          email: `test_note_${runner.testId}@example.com`,
          firstname: 'Note',
          lastname: 'TestContact',
        },
      })

      expect(contact.id).toBeTruthy()
      createdContacts.push(contact.id)

      // Create note
      const note = await sdk.api.hubspot.engagements.createNote({
        properties: {
          hs_note_body: `Test note created by E2E tests - ${runner.testId}`,
          hs_timestamp: new Date().toISOString(),
        },
        associations: [
          {
            to: { id: contact.id },
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }],
          },
        ],
      })

      expect(note).toBeDefined()
      expect(note.id).toBeTruthy()
      expect(note.properties).toBeDefined()
      expect(note.properties.hs_note_body).toContain(runner.testId)
      expect(note.createdAt).toBeTruthy()

      // Verify note was created
      const retrieved = await sdk.api.hubspot.engagements.getNote(note.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(note.id)
    },
    getTimeout()
  )

  test(
    'should create email engagement',
    async () => {
      const sdk = runner.getSDK()

      // Create contact first
      const contact = await sdk.api.hubspot.contacts.create({
        properties: {
          email: `test_email_${runner.testId}@example.com`,
          firstname: 'Email',
          lastname: 'TestContact',
        },
      })

      expect(contact.id).toBeTruthy()
      createdContacts.push(contact.id)

      // Create email engagement
      const email = await sdk.api.hubspot.engagements.createEmail({
        properties: {
          hs_email_subject: `Test Email ${runner.testId}`,
          hs_email_text: `This is a test email created by E2E tests - ${runner.testId}`,
          hs_email_direction: 'EMAIL',
          hs_timestamp: new Date().toISOString(),
        },
        associations: [
          {
            to: { id: contact.id },
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 198 }],
          },
        ],
      })

      expect(email).toBeDefined()
      expect(email.id).toBeTruthy()
      expect(email.properties).toBeDefined()
      expect(email.properties.hs_email_subject).toBe(`Test Email ${runner.testId}`)
      expect(email.createdAt).toBeTruthy()

      // Verify email was created
      const retrieved = await sdk.api.hubspot.engagements.getEmail(email.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(email.id)
    },
    getTimeout()
  )

  test(
    'should create task with due date',
    async () => {
      const sdk = runner.getSDK()

      // Create contact first
      const contact = await sdk.api.hubspot.contacts.create({
        properties: {
          email: `test_task_${runner.testId}@example.com`,
          firstname: 'Task',
          lastname: 'TestContact',
        },
      })

      expect(contact.id).toBeTruthy()
      createdContacts.push(contact.id)

      // Create task
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 7)

      const task = await sdk.api.hubspot.engagements.createTask({
        properties: {
          hs_task_subject: `Test Task ${runner.testId}`,
          hs_task_body: `Test task created by E2E tests - ${runner.testId}`,
          hs_task_status: 'NOT_STARTED',
          hs_task_priority: 'MEDIUM',
          hs_timestamp: dueDate.toISOString(),
        },
        associations: [
          {
            to: { id: contact.id },
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 204 }],
          },
        ],
      })

      expect(task).toBeDefined()
      expect(task.id).toBeTruthy()
      expect(task.properties).toBeDefined()
      expect(task.properties.hs_task_subject).toBe(`Test Task ${runner.testId}`)
      expect(task.properties.hs_task_status).toBe('NOT_STARTED')
      expect(task.properties.hs_task_priority).toBe('MEDIUM')
      expect(task.createdAt).toBeTruthy()

      // Verify task was created
      const retrieved = await sdk.api.hubspot.engagements.getTask(task.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(task.id)
    },
    getTimeout()
  )

  // =============================================================================
  // 6. List Operations (2 tests)
  // =============================================================================

  test(
    'should create contact list',
    async () => {
      const sdk = runner.getSDK()

      // Create list
      const list = await sdk.api.hubspot.lists.create({
        name: `Test List ${runner.testId}`,
        processingType: 'MANUAL',
        objectTypeId: '0-1', // Contacts
      })

      expect(list).toBeDefined()
      expect(list.listId).toBeTruthy()
      expect(list.name).toBe(`Test List ${runner.testId}`)
      expect(list.processingType).toBe('MANUAL')

      // Track for cleanup
      createdLists.push(list.listId)

      // Verify list was created
      const retrieved = await sdk.api.hubspot.lists.get(list.listId)
      expect(retrieved).toBeDefined()
      expect(retrieved.listId).toBe(list.listId)
      expect(retrieved.name).toBe(`Test List ${runner.testId}`)
    },
    getTimeout()
  )

  test(
    'should add contacts to list',
    async () => {
      const sdk = runner.getSDK()

      // Create list
      const list = await sdk.api.hubspot.lists.create({
        name: `Test List Add Contacts ${runner.testId}`,
        processingType: 'MANUAL',
        objectTypeId: '0-1',
      })

      expect(list.listId).toBeTruthy()
      createdLists.push(list.listId)

      // Create contacts
      const contact1 = await sdk.api.hubspot.contacts.create({
        properties: {
          email: `test_list_contact1_${runner.testId}@example.com`,
          firstname: 'ListContact1',
          lastname: 'Test',
        },
      })

      const contact2 = await sdk.api.hubspot.contacts.create({
        properties: {
          email: `test_list_contact2_${runner.testId}@example.com`,
          firstname: 'ListContact2',
          lastname: 'Test',
        },
      })

      expect(contact1.id).toBeTruthy()
      expect(contact2.id).toBeTruthy()
      createdContacts.push(contact1.id, contact2.id)

      // Wait for records to be ready
      await runner.wait(1000)

      // Add contacts to list
      const result = await sdk.api.hubspot.lists.addContacts(list.listId, [contact1.id, contact2.id])

      expect(result).toBeDefined()
      expect(result.updated).toBeGreaterThan(0)

      // Verify contacts were added
      const listContacts = await sdk.api.hubspot.lists.getContacts(list.listId)
      expect(listContacts).toBeDefined()
      expect(listContacts.length).toBeGreaterThanOrEqual(2)

      const contactIds = listContacts.map((c: any) => c.id)
      expect(contactIds).toContain(contact1.id)
      expect(contactIds).toContain(contact2.id)
    },
    getTimeout()
  )

  // =============================================================================
  // 7. Property Operations (2 tests)
  // =============================================================================

  test(
    'should get contact properties',
    async () => {
      const sdk = runner.getSDK()

      // Get contact properties
      const properties = await sdk.api.hubspot.properties.getContactProperties()

      expect(properties).toBeDefined()
      expect(Array.isArray(properties)).toBe(true)
      expect(properties.length).toBeGreaterThan(0)

      // Verify standard properties exist
      const emailProperty = properties.find((p: any) => p.name === 'email')
      expect(emailProperty).toBeDefined()
      expect(emailProperty?.type).toBe('string')
      expect(emailProperty?.fieldType).toBe('text')

      const firstnameProperty = properties.find((p: any) => p.name === 'firstname')
      expect(firstnameProperty).toBeDefined()
      expect(firstnameProperty?.type).toBe('string')

      const lastnameProperty = properties.find((p: any) => p.name === 'lastname')
      expect(lastnameProperty).toBeDefined()
      expect(lastnameProperty?.type).toBe('string')
    },
    getTimeout()
  )

  test(
    'should create custom property',
    async () => {
      const sdk = runner.getSDK()

      const propertyName = `test_custom_${runner.testId}`

      // Create custom property
      const property = await sdk.api.hubspot.properties.createContactProperty({
        name: propertyName,
        label: `Test Custom Property ${runner.testId}`,
        type: 'string',
        fieldType: 'text',
        groupName: 'contactinformation',
        description: `Custom property created by E2E tests - ${runner.testId}`,
      })

      expect(property).toBeDefined()
      expect(property.name).toBe(propertyName)
      expect(property.label).toBe(`Test Custom Property ${runner.testId}`)
      expect(property.type).toBe('string')
      expect(property.fieldType).toBe('text')

      // Verify property was created
      const properties = await sdk.api.hubspot.properties.getContactProperties()
      const createdProperty = properties.find((p: any) => p.name === propertyName)
      expect(createdProperty).toBeDefined()

      // Clean up custom property
      runner.registerCleanup(async () => {
        try {
          await sdk.api.hubspot.properties.deleteContactProperty(propertyName)
        } catch (error) {
          console.warn(`Failed to delete custom property ${propertyName}:`, error)
        }
      })
    },
    getTimeout()
  )

  // =============================================================================
  // 8. Webhook Handling (1 test)
  // =============================================================================

  test(
    'should verify webhook signature',
    async () => {
      const sdk = runner.getSDK()

      // Create webhook payload (simulating HubSpot webhook)
      const payload = JSON.stringify({
        objectId: 12345,
        propertyName: 'firstname',
        propertyValue: 'John',
        changeSource: 'CRM',
        eventId: 1,
        subscriptionId: 12345,
        portalId: 12345,
        occurredAt: Date.now(),
      })

      // Note: HubSpot uses X-HubSpot-Signature header with SHA-256 HMAC
      const webhookSecret = process.env.HUBSPOT_WEBHOOK_SECRET || 'test-webhook-secret'

      // Create signature data (client secret + request body)
      const signatureData = webhookSecret + payload

      // Generate signature
      const signature = crypto.createHash('sha256').update(signatureData).digest('hex')

      // Verify signature
      const isValid = await sdk.api.hubspot.webhooks.verify({
        payload,
        signature,
        webhookSecret,
      })

      expect(isValid).toBe(true)

      // Test with invalid signature
      const invalidSignature = 'invalid_signature_value'
      const isInvalid = await sdk.api.hubspot.webhooks.verify({
        payload,
        signature: invalidSignature,
        webhookSecret,
      })

      expect(isInvalid).toBe(false)
    },
    getTimeout()
  )

  // =============================================================================
  // 9. Error Handling (1 test)
  // =============================================================================

  test(
    'should handle various HubSpot API errors',
    async () => {
      const sdk = runner.getSDK()

      // Test 1: Invalid API key (authentication error)
      try {
        const invalidSdk = sdk.api.hubspot.withAccessToken('invalid_access_token')
        await invalidSdk.contacts.list({ limit: 1 })

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.status).toBe(401)
      }

      // Test 2: Rate limit error (simulated)
      try {
        // Make many rapid requests to potentially trigger rate limit
        const promises = []
        for (let i = 0; i < 10; i++) {
          promises.push(sdk.api.hubspot.contacts.list({ limit: 1 }))
        }
        await Promise.all(promises)

        // If rate limit not hit, this test passes
        expect(true).toBe(true)
      } catch (error: any) {
        // If rate limit hit, verify error structure
        if (error.status === 429) {
          expect(error).toBeDefined()
          expect(error.message).toBeTruthy()
          expect(error.status).toBe(429)
        }
      }

      // Test 3: Property not found error
      try {
        await sdk.api.hubspot.contacts.create({
          properties: {
            email: `test_error_${runner.testId}@example.com`,
            invalid_property_name: 'This property does not exist',
          },
        })

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.status).toBe(400)
      }

      // Test 4: Object not found (404 equivalent)
      try {
        await sdk.api.hubspot.contacts.get('99999999999')

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.status).toBe(404)
      }
    },
    getTimeout()
  )
})
