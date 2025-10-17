/**
 * Salesforce Integration E2E Tests
 *
 * End-to-end tests for Salesforce API integration.
 * Tests cover accounts, contacts, leads, opportunities, cases, tasks, queries, bulk operations, and webhooks.
 *
 * Prerequisites:
 * - SALESFORCE_USERNAME environment variable must be set
 * - SALESFORCE_PASSWORD environment variable must be set
 * - SALESFORCE_SECURITY_TOKEN environment variable must be set
 * - SALESFORCE_CLIENT_ID environment variable (Connected App Consumer Key)
 * - SALESFORCE_CLIENT_SECRET environment variable (Connected App Consumer Secret)
 * - SALESFORCE_INSTANCE_URL environment variable (e.g., https://your-instance.salesforce.com)
 * - Salesforce account with appropriate permissions
 *
 * Test Categories:
 * 1. Account Operations (5 tests)
 * 2. Contact Operations (5 tests)
 * 3. Lead Operations (4 tests)
 * 4. Opportunity Operations (4 tests)
 * 5. Case Operations (3 tests)
 * 6. Task Operations (2 tests)
 * 7. Query Operations (3 tests)
 * 8. Bulk Operations (1 test)
 * 9. Webhook Handling (1 test)
 * 10. Error Handling (1 test)
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from '../runner'
import { getTimeout } from '../config'
import crypto from 'crypto'

describe('Salesforce Integration E2E Tests', () => {
  let runner: E2ETestRunner

  // Resource tracking for cleanup
  let createdAccounts: string[] = []
  let createdContacts: string[] = []
  let createdLeads: string[] = []
  let createdOpportunities: string[] = []
  let createdCases: string[] = []
  let createdTasks: string[] = []

  beforeEach(async () => {
    runner = new E2ETestRunner('salesforce')

    // Check for required credentials
    if (!process.env.SALESFORCE_USERNAME) {
      throw new Error('SALESFORCE_USERNAME environment variable is required for Salesforce E2E tests')
    }

    if (!process.env.SALESFORCE_PASSWORD) {
      throw new Error('SALESFORCE_PASSWORD environment variable is required for Salesforce E2E tests')
    }

    if (!process.env.SALESFORCE_SECURITY_TOKEN) {
      throw new Error('SALESFORCE_SECURITY_TOKEN environment variable is required for Salesforce E2E tests')
    }

    if (!process.env.SALESFORCE_CLIENT_ID) {
      throw new Error('SALESFORCE_CLIENT_ID environment variable is required for Salesforce E2E tests')
    }

    if (!process.env.SALESFORCE_CLIENT_SECRET) {
      throw new Error('SALESFORCE_CLIENT_SECRET environment variable is required for Salesforce E2E tests')
    }

    if (!process.env.SALESFORCE_INSTANCE_URL) {
      throw new Error('SALESFORCE_INSTANCE_URL environment variable is required for Salesforce E2E tests')
    }

    // Reset tracking arrays
    createdAccounts = []
    createdContacts = []
    createdLeads = []
    createdOpportunities = []
    createdCases = []
    createdTasks = []
  })

  afterEach(async () => {
    const sdk = runner.getSDK()

    // Clean up resources in reverse dependency order
    // Delete tasks first (no dependencies)
    for (const taskId of createdTasks) {
      try {
        await sdk.api.salesforce.tasks.delete(taskId)
      } catch (error) {
        console.warn(`Failed to delete task ${taskId}:`, error)
      }
    }

    // Delete cases (no dependencies)
    for (const caseId of createdCases) {
      try {
        await sdk.api.salesforce.cases.delete(caseId)
      } catch (error) {
        console.warn(`Failed to delete case ${caseId}:`, error)
      }
    }

    // Delete opportunities (depends on accounts)
    for (const opportunityId of createdOpportunities) {
      try {
        await sdk.api.salesforce.opportunities.delete(opportunityId)
      } catch (error) {
        console.warn(`Failed to delete opportunity ${opportunityId}:`, error)
      }
    }

    // Delete leads (no dependencies)
    for (const leadId of createdLeads) {
      try {
        await sdk.api.salesforce.leads.delete(leadId)
      } catch (error) {
        console.warn(`Failed to delete lead ${leadId}:`, error)
      }
    }

    // Delete contacts (depends on accounts)
    for (const contactId of createdContacts) {
      try {
        await sdk.api.salesforce.contacts.delete(contactId)
      } catch (error) {
        console.warn(`Failed to delete contact ${contactId}:`, error)
      }
    }

    // Delete accounts last (other records depend on it)
    for (const accountId of createdAccounts) {
      try {
        await sdk.api.salesforce.accounts.delete(accountId)
      } catch (error) {
        console.warn(`Failed to delete account ${accountId}:`, error)
      }
    }

    await runner.teardown()
  })

  // =============================================================================
  // 1. Account Operations (5 tests)
  // =============================================================================

  test(
    'should create account',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account - ${runner.testId}`,
        Type: 'Prospect',
        Industry: 'Technology',
        Description: `Test account created by E2E tests - ${runner.testId}`,
        Phone: '415-555-0100',
        Website: 'https://example.com',
        BillingStreet: '123 Test Street',
        BillingCity: 'San Francisco',
        BillingState: 'CA',
        BillingPostalCode: '94105',
        BillingCountry: 'USA',
      })

      expect(account).toBeDefined()
      expect(account.id).toBeTruthy()
      expect(account.id).toMatch(/^001[a-zA-Z0-9]{15}$/)
      expect(account.success).toBe(true)

      // Track for cleanup
      createdAccounts.push(account.id)

      // Verify account was created
      const retrieved = await sdk.api.salesforce.accounts.get(account.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.Id).toBe(account.id)
      expect(retrieved.Name).toBe(`E2E Test Account - ${runner.testId}`)
      expect(retrieved.Type).toBe('Prospect')
      expect(retrieved.Industry).toBe('Technology')
    },
    getTimeout()
  )

  test(
    'should get account by ID',
    async () => {
      const sdk = runner.getSDK()

      // Create account first
      const created = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account Retrieve - ${runner.testId}`,
        Type: 'Customer',
        Industry: 'Healthcare',
      })

      expect(created.success).toBe(true)
      createdAccounts.push(created.id)

      // Wait a moment for record to be indexed
      await runner.wait(1000)

      // Retrieve account
      const account = await sdk.api.salesforce.accounts.get(created.id)

      expect(account).toBeDefined()
      expect(account.Id).toBe(created.id)
      expect(account.Name).toBe(`E2E Test Account Retrieve - ${runner.testId}`)
      expect(account.Type).toBe('Customer')
      expect(account.Industry).toBe('Healthcare')
      expect(account.CreatedDate).toBeTruthy()
      expect(account.LastModifiedDate).toBeTruthy()
    },
    getTimeout()
  )

  test(
    'should update account',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const created = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account Update - ${runner.testId}`,
        Type: 'Prospect',
        Phone: '415-555-0200',
      })

      expect(created.success).toBe(true)
      createdAccounts.push(created.id)

      // Wait for record to be ready
      await runner.wait(1000)

      // Update account
      const updated = await sdk.api.salesforce.accounts.update(created.id, {
        Type: 'Customer',
        Phone: '415-555-0300',
        Industry: 'Finance',
        Description: 'Updated description',
        AnnualRevenue: 5000000,
        NumberOfEmployees: 150,
      })

      expect(updated).toBeDefined()
      expect(updated.success).toBe(true)

      // Verify update
      const retrieved = await sdk.api.salesforce.accounts.get(created.id)
      expect(retrieved.Type).toBe('Customer')
      expect(retrieved.Phone).toBe('415-555-0300')
      expect(retrieved.Industry).toBe('Finance')
      expect(retrieved.Description).toBe('Updated description')
      expect(retrieved.AnnualRevenue).toBe(5000000)
      expect(retrieved.NumberOfEmployees).toBe(150)
    },
    getTimeout()
  )

  test(
    'should list accounts',
    async () => {
      const sdk = runner.getSDK()

      // Create multiple test accounts
      for (let i = 0; i < 3; i++) {
        const account = await sdk.api.salesforce.accounts.create({
          Name: `E2E Test Account List ${i} - ${runner.testId}`,
          Type: 'Prospect',
          Industry: 'Technology',
        })

        expect(account.success).toBe(true)
        createdAccounts.push(account.id)
      }

      // Wait for records to be indexed
      await runner.wait(2000)

      // Query accounts using SOQL
      const query = `SELECT Id, Name, Type, Industry FROM Account WHERE Name LIKE '%${runner.testId}%' ORDER BY Name ASC LIMIT 10`
      const result = await sdk.api.salesforce.query.execute(query)

      expect(result).toBeDefined()
      expect(result.totalSize).toBeGreaterThanOrEqual(3)
      expect(result.records).toBeDefined()
      expect(Array.isArray(result.records)).toBe(true)
      expect(result.records.length).toBeGreaterThanOrEqual(3)

      // Verify account structure
      const account = result.records[0]
      expect(account.Id).toBeTruthy()
      expect(account.Name).toContain(runner.testId)
      expect(account.Type).toBe('Prospect')
      expect(account.Industry).toBe('Technology')
    },
    getTimeout()
  )

  test(
    'should delete account',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account Delete - ${runner.testId}`,
        Type: 'Prospect',
      })

      expect(account.success).toBe(true)

      // Wait for record to be ready
      await runner.wait(1000)

      // Delete account
      const deleted = await sdk.api.salesforce.accounts.delete(account.id)

      expect(deleted).toBeDefined()
      expect(deleted.success).toBe(true)

      // Verify account is deleted (should throw error)
      await expect(sdk.api.salesforce.accounts.get(account.id)).rejects.toThrow()
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

      // Create account first (contacts typically belong to accounts)
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Contact - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create contact
      const contact = await sdk.api.salesforce.contacts.create({
        FirstName: 'John',
        LastName: `TestContact-${runner.testId}`,
        Email: `john.testcontact.${runner.testId}@example.com`,
        Phone: '415-555-0400',
        Title: 'VP of Sales',
        Department: 'Sales',
        AccountId: account.id,
        MailingStreet: '456 Contact Street',
        MailingCity: 'San Francisco',
        MailingState: 'CA',
        MailingPostalCode: '94105',
        MailingCountry: 'USA',
      })

      expect(contact).toBeDefined()
      expect(contact.id).toBeTruthy()
      expect(contact.id).toMatch(/^003[a-zA-Z0-9]{15}$/)
      expect(contact.success).toBe(true)

      // Track for cleanup
      createdContacts.push(contact.id)

      // Verify contact was created
      const retrieved = await sdk.api.salesforce.contacts.get(contact.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.Id).toBe(contact.id)
      expect(retrieved.FirstName).toBe('John')
      expect(retrieved.LastName).toBe(`TestContact-${runner.testId}`)
      expect(retrieved.Email).toBe(`john.testcontact.${runner.testId}@example.com`)
      expect(retrieved.AccountId).toBe(account.id)
    },
    getTimeout()
  )

  test(
    'should get contact by ID',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Contact Get - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create contact
      const created = await sdk.api.salesforce.contacts.create({
        FirstName: 'Jane',
        LastName: `TestContactRetrieve-${runner.testId}`,
        Email: `jane.retrieve.${runner.testId}@example.com`,
        AccountId: account.id,
      })

      expect(created.success).toBe(true)
      createdContacts.push(created.id)

      // Wait for record to be indexed
      await runner.wait(1000)

      // Retrieve contact
      const contact = await sdk.api.salesforce.contacts.get(created.id)

      expect(contact).toBeDefined()
      expect(contact.Id).toBe(created.id)
      expect(contact.FirstName).toBe('Jane')
      expect(contact.LastName).toBe(`TestContactRetrieve-${runner.testId}`)
      expect(contact.Email).toBe(`jane.retrieve.${runner.testId}@example.com`)
      expect(contact.AccountId).toBe(account.id)
      expect(contact.CreatedDate).toBeTruthy()
    },
    getTimeout()
  )

  test(
    'should update contact',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Contact Update - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create contact
      const created = await sdk.api.salesforce.contacts.create({
        FirstName: 'Bob',
        LastName: `TestContactUpdate-${runner.testId}`,
        Email: `bob.update.${runner.testId}@example.com`,
        Phone: '415-555-0500',
        AccountId: account.id,
      })

      expect(created.success).toBe(true)
      createdContacts.push(created.id)

      // Wait for record to be ready
      await runner.wait(1000)

      // Update contact
      const updated = await sdk.api.salesforce.contacts.update(created.id, {
        FirstName: 'Robert',
        Phone: '415-555-0600',
        Title: 'Director of Engineering',
        Department: 'Engineering',
        Email: `robert.updated.${runner.testId}@example.com`,
      })

      expect(updated).toBeDefined()
      expect(updated.success).toBe(true)

      // Verify update
      const retrieved = await sdk.api.salesforce.contacts.get(created.id)
      expect(retrieved.FirstName).toBe('Robert')
      expect(retrieved.Phone).toBe('415-555-0600')
      expect(retrieved.Title).toBe('Director of Engineering')
      expect(retrieved.Department).toBe('Engineering')
      expect(retrieved.Email).toBe(`robert.updated.${runner.testId}@example.com`)
    },
    getTimeout()
  )

  test(
    'should list contacts linked to account',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Contact List - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create multiple contacts for this account
      for (let i = 0; i < 3; i++) {
        const contact = await sdk.api.salesforce.contacts.create({
          FirstName: `Contact${i}`,
          LastName: `TestList-${runner.testId}`,
          Email: `contact${i}.list.${runner.testId}@example.com`,
          AccountId: account.id,
        })

        expect(contact.success).toBe(true)
        createdContacts.push(contact.id)
      }

      // Wait for records to be indexed
      await runner.wait(2000)

      // Query contacts for this account
      const query = `SELECT Id, FirstName, LastName, Email, AccountId FROM Contact WHERE AccountId = '${account.id}' ORDER BY FirstName ASC`
      const result = await sdk.api.salesforce.query.execute(query)

      expect(result).toBeDefined()
      expect(result.totalSize).toBe(3)
      expect(result.records).toBeDefined()
      expect(result.records.length).toBe(3)

      // Verify all contacts belong to the account
      result.records.forEach((contact: any) => {
        expect(contact.AccountId).toBe(account.id)
        expect(contact.LastName).toBe(`TestList-${runner.testId}`)
      })
    },
    getTimeout()
  )

  test(
    'should delete contact',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Contact Delete - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create contact
      const contact = await sdk.api.salesforce.contacts.create({
        FirstName: 'Delete',
        LastName: `TestContactDelete-${runner.testId}`,
        Email: `delete.${runner.testId}@example.com`,
        AccountId: account.id,
      })

      expect(contact.success).toBe(true)

      // Wait for record to be ready
      await runner.wait(1000)

      // Delete contact
      const deleted = await sdk.api.salesforce.contacts.delete(contact.id)

      expect(deleted).toBeDefined()
      expect(deleted.success).toBe(true)

      // Verify contact is deleted
      await expect(sdk.api.salesforce.contacts.get(contact.id)).rejects.toThrow()
    },
    getTimeout()
  )

  // =============================================================================
  // 3. Lead Operations (4 tests)
  // =============================================================================

  test(
    'should create lead',
    async () => {
      const sdk = runner.getSDK()

      // Create lead
      const lead = await sdk.api.salesforce.leads.create({
        FirstName: 'Sarah',
        LastName: `TestLead-${runner.testId}`,
        Company: `Test Company ${runner.testId}`,
        Email: `sarah.lead.${runner.testId}@example.com`,
        Phone: '415-555-0700',
        Title: 'CEO',
        Status: 'Open - Not Contacted',
        LeadSource: 'Web',
        Industry: 'Technology',
        Street: '789 Lead Street',
        City: 'San Francisco',
        State: 'CA',
        PostalCode: '94105',
        Country: 'USA',
      })

      expect(lead).toBeDefined()
      expect(lead.id).toBeTruthy()
      expect(lead.id).toMatch(/^00Q[a-zA-Z0-9]{15}$/)
      expect(lead.success).toBe(true)

      // Track for cleanup
      createdLeads.push(lead.id)

      // Verify lead was created
      const retrieved = await sdk.api.salesforce.leads.get(lead.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.Id).toBe(lead.id)
      expect(retrieved.FirstName).toBe('Sarah')
      expect(retrieved.LastName).toBe(`TestLead-${runner.testId}`)
      expect(retrieved.Company).toBe(`Test Company ${runner.testId}`)
      expect(retrieved.Status).toBe('Open - Not Contacted')
    },
    getTimeout()
  )

  test(
    'should get lead by ID',
    async () => {
      const sdk = runner.getSDK()

      // Create lead
      const created = await sdk.api.salesforce.leads.create({
        FirstName: 'Michael',
        LastName: `TestLeadRetrieve-${runner.testId}`,
        Company: `Retrieve Company ${runner.testId}`,
        Email: `michael.lead.${runner.testId}@example.com`,
        Status: 'Working - Contacted',
      })

      expect(created.success).toBe(true)
      createdLeads.push(created.id)

      // Wait for record to be indexed
      await runner.wait(1000)

      // Retrieve lead
      const lead = await sdk.api.salesforce.leads.get(created.id)

      expect(lead).toBeDefined()
      expect(lead.Id).toBe(created.id)
      expect(lead.FirstName).toBe('Michael')
      expect(lead.LastName).toBe(`TestLeadRetrieve-${runner.testId}`)
      expect(lead.Company).toBe(`Retrieve Company ${runner.testId}`)
      expect(lead.Status).toBe('Working - Contacted')
      expect(lead.CreatedDate).toBeTruthy()
    },
    getTimeout()
  )

  test(
    'should update lead',
    async () => {
      const sdk = runner.getSDK()

      // Create lead
      const created = await sdk.api.salesforce.leads.create({
        FirstName: 'Emily',
        LastName: `TestLeadUpdate-${runner.testId}`,
        Company: `Update Company ${runner.testId}`,
        Email: `emily.lead.${runner.testId}@example.com`,
        Status: 'Open - Not Contacted',
        Phone: '415-555-0800',
      })

      expect(created.success).toBe(true)
      createdLeads.push(created.id)

      // Wait for record to be ready
      await runner.wait(1000)

      // Update lead
      const updated = await sdk.api.salesforce.leads.update(created.id, {
        Status: 'Qualified',
        Phone: '415-555-0900',
        Title: 'VP of Marketing',
        LeadSource: 'Partner Referral',
        Rating: 'Hot',
      })

      expect(updated).toBeDefined()
      expect(updated.success).toBe(true)

      // Verify update
      const retrieved = await sdk.api.salesforce.leads.get(created.id)
      expect(retrieved.Status).toBe('Qualified')
      expect(retrieved.Phone).toBe('415-555-0900')
      expect(retrieved.Title).toBe('VP of Marketing')
      expect(retrieved.LeadSource).toBe('Partner Referral')
      expect(retrieved.Rating).toBe('Hot')
    },
    getTimeout()
  )

  test(
    'should convert lead to account, contact, and opportunity',
    async () => {
      const sdk = runner.getSDK()

      // Create lead
      const lead = await sdk.api.salesforce.leads.create({
        FirstName: 'David',
        LastName: `TestLeadConvert-${runner.testId}`,
        Company: `Convert Company ${runner.testId}`,
        Email: `david.convert.${runner.testId}@example.com`,
        Status: 'Qualified',
        Phone: '415-555-1000',
      })

      expect(lead.success).toBe(true)
      createdLeads.push(lead.id)

      // Wait for lead to be ready
      await runner.wait(1000)

      // Convert lead
      const converted = await sdk.api.salesforce.leads.convert(lead.id, {
        convertedStatus: 'Closed - Converted',
        createOpportunity: true,
        opportunityName: `Converted Opportunity ${runner.testId}`,
      })

      expect(converted).toBeDefined()
      expect(converted.success).toBe(true)
      expect(converted.accountId).toBeTruthy()
      expect(converted.contactId).toBeTruthy()
      expect(converted.opportunityId).toBeTruthy()

      // Track created resources for cleanup
      createdAccounts.push(converted.accountId)
      createdContacts.push(converted.contactId)
      createdOpportunities.push(converted.opportunityId)

      // Verify account was created
      const account = await sdk.api.salesforce.accounts.get(converted.accountId)
      expect(account.Name).toBe(`Convert Company ${runner.testId}`)

      // Verify contact was created
      const contact = await sdk.api.salesforce.contacts.get(converted.contactId)
      expect(contact.FirstName).toBe('David')
      expect(contact.LastName).toBe(`TestLeadConvert-${runner.testId}`)

      // Verify opportunity was created
      const opportunity = await sdk.api.salesforce.opportunities.get(converted.opportunityId)
      expect(opportunity.Name).toBe(`Converted Opportunity ${runner.testId}`)
    },
    getTimeout()
  )

  // =============================================================================
  // 4. Opportunity Operations (4 tests)
  // =============================================================================

  test(
    'should create opportunity',
    async () => {
      const sdk = runner.getSDK()

      // Create account first
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Opportunity - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create opportunity
      const closeDate = new Date()
      closeDate.setMonth(closeDate.getMonth() + 3)

      const opportunity = await sdk.api.salesforce.opportunities.create({
        Name: `E2E Test Opportunity - ${runner.testId}`,
        AccountId: account.id,
        StageName: 'Prospecting',
        CloseDate: closeDate.toISOString().split('T')[0],
        Amount: 50000,
        Probability: 10,
        Type: 'New Customer',
        LeadSource: 'Web',
        Description: `Test opportunity created by E2E tests - ${runner.testId}`,
      })

      expect(opportunity).toBeDefined()
      expect(opportunity.id).toBeTruthy()
      expect(opportunity.id).toMatch(/^006[a-zA-Z0-9]{15}$/)
      expect(opportunity.success).toBe(true)

      // Track for cleanup
      createdOpportunities.push(opportunity.id)

      // Verify opportunity was created
      const retrieved = await sdk.api.salesforce.opportunities.get(opportunity.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.Id).toBe(opportunity.id)
      expect(retrieved.Name).toBe(`E2E Test Opportunity - ${runner.testId}`)
      expect(retrieved.AccountId).toBe(account.id)
      expect(retrieved.StageName).toBe('Prospecting')
      expect(retrieved.Amount).toBe(50000)
    },
    getTimeout()
  )

  test(
    'should get opportunity by ID',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Opportunity Get - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create opportunity
      const closeDate = new Date()
      closeDate.setMonth(closeDate.getMonth() + 2)

      const created = await sdk.api.salesforce.opportunities.create({
        Name: `E2E Test Opportunity Retrieve - ${runner.testId}`,
        AccountId: account.id,
        StageName: 'Qualification',
        CloseDate: closeDate.toISOString().split('T')[0],
        Amount: 75000,
      })

      expect(created.success).toBe(true)
      createdOpportunities.push(created.id)

      // Wait for record to be indexed
      await runner.wait(1000)

      // Retrieve opportunity
      const opportunity = await sdk.api.salesforce.opportunities.get(created.id)

      expect(opportunity).toBeDefined()
      expect(opportunity.Id).toBe(created.id)
      expect(opportunity.Name).toBe(`E2E Test Opportunity Retrieve - ${runner.testId}`)
      expect(opportunity.AccountId).toBe(account.id)
      expect(opportunity.StageName).toBe('Qualification')
      expect(opportunity.Amount).toBe(75000)
      expect(opportunity.CreatedDate).toBeTruthy()
    },
    getTimeout()
  )

  test(
    'should update opportunity stage',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Opportunity Update - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create opportunity
      const closeDate = new Date()
      closeDate.setMonth(closeDate.getMonth() + 3)

      const created = await sdk.api.salesforce.opportunities.create({
        Name: `E2E Test Opportunity Update - ${runner.testId}`,
        AccountId: account.id,
        StageName: 'Prospecting',
        CloseDate: closeDate.toISOString().split('T')[0],
        Amount: 100000,
        Probability: 10,
      })

      expect(created.success).toBe(true)
      createdOpportunities.push(created.id)

      // Wait for record to be ready
      await runner.wait(1000)

      // Update opportunity stage
      const updated = await sdk.api.salesforce.opportunities.update(created.id, {
        StageName: 'Negotiation/Review',
        Probability: 75,
        Amount: 125000,
        Description: 'Progressed to negotiation stage',
      })

      expect(updated).toBeDefined()
      expect(updated.success).toBe(true)

      // Verify update
      const retrieved = await sdk.api.salesforce.opportunities.get(created.id)
      expect(retrieved.StageName).toBe('Negotiation/Review')
      expect(retrieved.Probability).toBe(75)
      expect(retrieved.Amount).toBe(125000)
      expect(retrieved.Description).toBe('Progressed to negotiation stage')
    },
    getTimeout()
  )

  test(
    'should list opportunities for account',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Opportunity List - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create multiple opportunities for this account
      const closeDate = new Date()
      closeDate.setMonth(closeDate.getMonth() + 2)

      for (let i = 0; i < 3; i++) {
        const opportunity = await sdk.api.salesforce.opportunities.create({
          Name: `E2E Test Opportunity List ${i} - ${runner.testId}`,
          AccountId: account.id,
          StageName: 'Prospecting',
          CloseDate: closeDate.toISOString().split('T')[0],
          Amount: 25000 * (i + 1),
        })

        expect(opportunity.success).toBe(true)
        createdOpportunities.push(opportunity.id)
      }

      // Wait for records to be indexed
      await runner.wait(2000)

      // Query opportunities for this account
      const query = `SELECT Id, Name, AccountId, StageName, Amount FROM Opportunity WHERE AccountId = '${account.id}' ORDER BY Amount ASC`
      const result = await sdk.api.salesforce.query.execute(query)

      expect(result).toBeDefined()
      expect(result.totalSize).toBe(3)
      expect(result.records).toBeDefined()
      expect(result.records.length).toBe(3)

      // Verify all opportunities belong to the account
      result.records.forEach((opp: any, index: number) => {
        expect(opp.AccountId).toBe(account.id)
        expect(opp.Name).toContain(runner.testId)
        expect(opp.Amount).toBe(25000 * (index + 1))
      })
    },
    getTimeout()
  )

  // =============================================================================
  // 5. Case Operations (3 tests)
  // =============================================================================

  test(
    'should create case',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Case - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create case
      const caseRecord = await sdk.api.salesforce.cases.create({
        Subject: `E2E Test Case - ${runner.testId}`,
        Description: `Test case created by E2E tests - ${runner.testId}`,
        Status: 'New',
        Origin: 'Web',
        Priority: 'Medium',
        Type: 'Problem',
        AccountId: account.id,
      })

      expect(caseRecord).toBeDefined()
      expect(caseRecord.id).toBeTruthy()
      expect(caseRecord.id).toMatch(/^500[a-zA-Z0-9]{15}$/)
      expect(caseRecord.success).toBe(true)

      // Track for cleanup
      createdCases.push(caseRecord.id)

      // Verify case was created
      const retrieved = await sdk.api.salesforce.cases.get(caseRecord.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.Id).toBe(caseRecord.id)
      expect(retrieved.Subject).toBe(`E2E Test Case - ${runner.testId}`)
      expect(retrieved.Status).toBe('New')
      expect(retrieved.Priority).toBe('Medium')
      expect(retrieved.AccountId).toBe(account.id)
    },
    getTimeout()
  )

  test(
    'should update case status',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Case Update - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create case
      const created = await sdk.api.salesforce.cases.create({
        Subject: `E2E Test Case Update - ${runner.testId}`,
        Description: 'Initial description',
        Status: 'New',
        Priority: 'Low',
        AccountId: account.id,
      })

      expect(created.success).toBe(true)
      createdCases.push(created.id)

      // Wait for record to be ready
      await runner.wait(1000)

      // Update case
      const updated = await sdk.api.salesforce.cases.update(created.id, {
        Status: 'Working',
        Priority: 'High',
        Description: 'Updated description - issue escalated',
      })

      expect(updated).toBeDefined()
      expect(updated.success).toBe(true)

      // Verify update
      const retrieved = await sdk.api.salesforce.cases.get(created.id)
      expect(retrieved.Status).toBe('Working')
      expect(retrieved.Priority).toBe('High')
      expect(retrieved.Description).toBe('Updated description - issue escalated')
    },
    getTimeout()
  )

  test(
    'should get case by ID',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Case Get - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create case
      const created = await sdk.api.salesforce.cases.create({
        Subject: `E2E Test Case Retrieve - ${runner.testId}`,
        Description: 'Test case for retrieval',
        Status: 'New',
        Origin: 'Email',
        Priority: 'High',
        AccountId: account.id,
      })

      expect(created.success).toBe(true)
      createdCases.push(created.id)

      // Wait for record to be indexed
      await runner.wait(1000)

      // Retrieve case
      const caseRecord = await sdk.api.salesforce.cases.get(created.id)

      expect(caseRecord).toBeDefined()
      expect(caseRecord.Id).toBe(created.id)
      expect(caseRecord.Subject).toBe(`E2E Test Case Retrieve - ${runner.testId}`)
      expect(caseRecord.Status).toBe('New')
      expect(caseRecord.Origin).toBe('Email')
      expect(caseRecord.Priority).toBe('High')
      expect(caseRecord.AccountId).toBe(account.id)
      expect(caseRecord.CreatedDate).toBeTruthy()
    },
    getTimeout()
  )

  // =============================================================================
  // 6. Task Operations (2 tests)
  // =============================================================================

  test(
    'should create task',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Task - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create task
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 7)

      const task = await sdk.api.salesforce.tasks.create({
        Subject: `E2E Test Task - ${runner.testId}`,
        Description: `Test task created by E2E tests - ${runner.testId}`,
        Status: 'Not Started',
        Priority: 'Normal',
        ActivityDate: dueDate.toISOString().split('T')[0],
        WhatId: account.id,
      })

      expect(task).toBeDefined()
      expect(task.id).toBeTruthy()
      expect(task.id).toMatch(/^00T[a-zA-Z0-9]{15}$/)
      expect(task.success).toBe(true)

      // Track for cleanup
      createdTasks.push(task.id)

      // Verify task was created
      const retrieved = await sdk.api.salesforce.tasks.get(task.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.Id).toBe(task.id)
      expect(retrieved.Subject).toBe(`E2E Test Task - ${runner.testId}`)
      expect(retrieved.Status).toBe('Not Started')
      expect(retrieved.Priority).toBe('Normal')
      expect(retrieved.WhatId).toBe(account.id)
    },
    getTimeout()
  )

  test(
    'should update task status',
    async () => {
      const sdk = runner.getSDK()

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `E2E Test Account for Task Update - ${runner.testId}`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create task
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 5)

      const created = await sdk.api.salesforce.tasks.create({
        Subject: `E2E Test Task Update - ${runner.testId}`,
        Description: 'Initial description',
        Status: 'Not Started',
        Priority: 'Normal',
        ActivityDate: dueDate.toISOString().split('T')[0],
        WhatId: account.id,
      })

      expect(created.success).toBe(true)
      createdTasks.push(created.id)

      // Wait for record to be ready
      await runner.wait(1000)

      // Update task
      const updated = await sdk.api.salesforce.tasks.update(created.id, {
        Status: 'In Progress',
        Priority: 'High',
        Description: 'Updated description - work started',
      })

      expect(updated).toBeDefined()
      expect(updated.success).toBe(true)

      // Verify update
      const retrieved = await sdk.api.salesforce.tasks.get(created.id)
      expect(retrieved.Status).toBe('In Progress')
      expect(retrieved.Priority).toBe('High')
      expect(retrieved.Description).toBe('Updated description - work started')
    },
    getTimeout()
  )

  // =============================================================================
  // 7. Query Operations (3 tests)
  // =============================================================================

  test(
    'should execute SOQL query for accounts',
    async () => {
      const sdk = runner.getSDK()

      // Create test accounts
      for (let i = 0; i < 3; i++) {
        const account = await sdk.api.salesforce.accounts.create({
          Name: `E2E Query Test ${i} - ${runner.testId}`,
          Type: 'Prospect',
          Industry: 'Technology',
        })

        expect(account.success).toBe(true)
        createdAccounts.push(account.id)
      }

      // Wait for records to be indexed
      await runner.wait(2000)

      // Execute SOQL query
      const query = `SELECT Id, Name, Type, Industry, CreatedDate FROM Account WHERE Name LIKE '%${runner.testId}%'`
      const result = await sdk.api.salesforce.query.execute(query)

      expect(result).toBeDefined()
      expect(result.totalSize).toBeGreaterThanOrEqual(3)
      expect(result.done).toBe(true)
      expect(result.records).toBeDefined()
      expect(Array.isArray(result.records)).toBe(true)
      expect(result.records.length).toBeGreaterThanOrEqual(3)

      // Verify record structure
      const record = result.records[0]
      expect(record.Id).toBeTruthy()
      expect(record.Name).toContain(runner.testId)
      expect(record.Type).toBe('Prospect')
      expect(record.Industry).toBe('Technology')
      expect(record.CreatedDate).toBeTruthy()
    },
    getTimeout()
  )

  test(
    'should query with WHERE clause and ORDER BY',
    async () => {
      const sdk = runner.getSDK()

      // Create test accounts with different annual revenues
      const revenues = [1000000, 5000000, 10000000]

      for (let i = 0; i < 3; i++) {
        const account = await sdk.api.salesforce.accounts.create({
          Name: `E2E Query Filter ${i} - ${runner.testId}`,
          Type: 'Customer',
          Industry: 'Finance',
          AnnualRevenue: revenues[i],
        })

        expect(account.success).toBe(true)
        createdAccounts.push(account.id)
      }

      // Wait for records to be indexed
      await runner.wait(2000)

      // Execute filtered and sorted query
      const query = `SELECT Id, Name, AnnualRevenue FROM Account WHERE Name LIKE '%${runner.testId}%' AND Type = 'Customer' AND Industry = 'Finance' ORDER BY AnnualRevenue DESC`
      const result = await sdk.api.salesforce.query.execute(query)

      expect(result).toBeDefined()
      expect(result.totalSize).toBe(3)
      expect(result.records).toBeDefined()
      expect(result.records.length).toBe(3)

      // Verify records are ordered by revenue descending
      expect(result.records[0].AnnualRevenue).toBe(10000000)
      expect(result.records[1].AnnualRevenue).toBe(5000000)
      expect(result.records[2].AnnualRevenue).toBe(1000000)
    },
    getTimeout()
  )

  test(
    'should execute SOSL search across multiple objects',
    async () => {
      const sdk = runner.getSDK()

      const searchTerm = `SearchTest${runner.testId}`

      // Create account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `${searchTerm} Account`,
        Type: 'Customer',
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Create contact
      const contact = await sdk.api.salesforce.contacts.create({
        FirstName: searchTerm,
        LastName: 'Contact',
        Email: `${searchTerm.toLowerCase()}@example.com`,
        AccountId: account.id,
      })

      expect(contact.success).toBe(true)
      createdContacts.push(contact.id)

      // Wait for records to be indexed for search
      await runner.wait(3000)

      // Execute SOSL search
      const searchQuery = `FIND {${searchTerm}} IN ALL FIELDS RETURNING Account(Id, Name), Contact(Id, FirstName, LastName)`
      const result = await sdk.api.salesforce.search.execute(searchQuery)

      expect(result).toBeDefined()
      expect(result.searchRecords).toBeDefined()
      expect(Array.isArray(result.searchRecords)).toBe(true)
      expect(result.searchRecords.length).toBeGreaterThan(0)

      // Find our account in results
      const accountResult = result.searchRecords.find((r: any) => r.Id === account.id)
      expect(accountResult).toBeDefined()

      // Find our contact in results
      const contactResult = result.searchRecords.find((r: any) => r.Id === contact.id)
      expect(contactResult).toBeDefined()
    },
    getTimeout()
  )

  // =============================================================================
  // 8. Bulk Operations (1 test)
  // =============================================================================

  test(
    'should bulk insert multiple records',
    async () => {
      const sdk = runner.getSDK()

      // Prepare multiple accounts for bulk insert
      const accounts = [
        {
          Name: `E2E Bulk Test 1 - ${runner.testId}`,
          Type: 'Prospect',
          Industry: 'Technology',
        },
        {
          Name: `E2E Bulk Test 2 - ${runner.testId}`,
          Type: 'Customer',
          Industry: 'Healthcare',
        },
        {
          Name: `E2E Bulk Test 3 - ${runner.testId}`,
          Type: 'Prospect',
          Industry: 'Finance',
        },
      ]

      // Execute bulk insert
      const results = await sdk.api.salesforce.bulk.insert('Account', accounts)

      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(3)

      // Verify all inserts succeeded
      results.forEach((result: any, index: number) => {
        expect(result.success).toBe(true)
        expect(result.id).toBeTruthy()
        expect(result.id).toMatch(/^001[a-zA-Z0-9]{15}$/)

        // Track for cleanup
        createdAccounts.push(result.id)
      })

      // Wait for records to be indexed
      await runner.wait(2000)

      // Verify records were created by querying
      const query = `SELECT Id, Name, Type, Industry FROM Account WHERE Name LIKE '%${runner.testId}%' AND Name LIKE '%Bulk Test%'`
      const queryResult = await sdk.api.salesforce.query.execute(query)

      expect(queryResult.totalSize).toBe(3)
      expect(queryResult.records.length).toBe(3)
    },
    getTimeout()
  )

  // =============================================================================
  // 9. Webhook Handling (1 test)
  // =============================================================================

  test(
    'should verify webhook signature',
    async () => {
      const sdk = runner.getSDK()

      // Create webhook payload (simulating Salesforce outbound message)
      const payload = JSON.stringify({
        Notification: {
          Id: 'test-notification-id',
          sObject: {
            type: 'Account',
            Id: '001XXXXXXXXXXXXXXX',
            Name: 'Test Account',
          },
        },
      })

      // Note: Salesforce uses X-Salesforce-Signature header with HMAC-SHA256
      const webhookSecret = process.env.SALESFORCE_WEBHOOK_SECRET || 'test-webhook-secret'

      // Create signature data (URL + payload)
      const url = 'https://myapp.com/webhook/salesforce'
      const signatureData = url + payload

      // Generate signature
      const signature = crypto.createHmac('sha256', webhookSecret).update(signatureData).digest('base64')

      // Verify signature
      const isValid = await sdk.api.salesforce.webhooks.verify({
        payload,
        signature,
        url,
        webhookSecret,
      })

      expect(isValid).toBe(true)

      // Test with invalid signature
      const invalidSignature = 'invalid_signature_value'
      const isInvalid = await sdk.api.salesforce.webhooks.verify({
        payload,
        signature: invalidSignature,
        url,
        webhookSecret,
      })

      expect(isInvalid).toBe(false)
    },
    getTimeout()
  )

  // =============================================================================
  // 10. Error Handling (1 test)
  // =============================================================================

  test(
    'should handle various Salesforce API errors',
    async () => {
      const sdk = runner.getSDK()

      // Test 1: Invalid session (authentication error)
      try {
        const invalidSdk = sdk.api.salesforce.withAccessToken('invalid_access_token')
        await invalidSdk.accounts.list({ limit: 1 })

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.errorCode).toMatch(/INVALID_SESSION|INVALID_AUTH/)
      }

      // Test 2: Invalid field error
      try {
        await sdk.api.salesforce.accounts.create({
          Name: `Error Test - ${runner.testId}`,
          InvalidField: 'This field does not exist',
        })

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.errorCode).toBe('INVALID_FIELD')
      }

      // Test 3: Required field missing
      try {
        await sdk.api.salesforce.accounts.create({
          // Name is required but not provided
          Type: 'Customer',
        })

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.errorCode).toBe('REQUIRED_FIELD_MISSING')
        expect(error.fields).toContain('Name')
      }

      // Test 4: Duplicate value error
      // Create an account
      const account = await sdk.api.salesforce.accounts.create({
        Name: `Duplicate Test - ${runner.testId}`,
        Type: 'Customer',
        Website: `http://duplicate-test-${runner.testId}.com`,
      })

      expect(account.success).toBe(true)
      createdAccounts.push(account.id)

      // Wait for record to be created
      await runner.wait(1000)

      // Try to create duplicate (if unique constraint exists)
      // Note: This test depends on org configuration having unique field constraints
      try {
        // Attempt to create account with same website (if website has unique constraint)
        await sdk.api.salesforce.accounts.create({
          Name: `Duplicate Test 2 - ${runner.testId}`,
          Type: 'Customer',
          Website: `http://duplicate-test-${runner.testId}.com`,
        })

        // This may or may not throw depending on org setup
        // If it succeeds, clean up the duplicate
        const query = `SELECT Id FROM Account WHERE Website = 'http://duplicate-test-${runner.testId}.com' ORDER BY CreatedDate DESC LIMIT 1`
        const result = await sdk.api.salesforce.query.execute(query)

        if (result.records.length > 0) {
          createdAccounts.push(result.records[0].Id)
        }
      } catch (error: any) {
        // If duplicate error occurs, verify it's the expected error
        if (error.errorCode) {
          expect(error.errorCode).toMatch(/DUPLICATE|UNIQUE/)
        }
      }

      // Test 5: Record not found (404 equivalent)
      try {
        await sdk.api.salesforce.accounts.get('001000000000000AAA')

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.errorCode).toMatch(/NOT_FOUND|ENTITY_IS_DELETED/)
      }
    },
    getTimeout()
  )
})
