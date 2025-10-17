import { describe, it, expect, beforeAll } from 'vitest'
import { createClient, VerbsClient } from '../../src/index'

const TEST_URL = process.env.TEST_URL || 'https://verbs.do'

describe('E2E Integration Tests', () => {
  let client: VerbsClient

  beforeAll(() => {
    client = createClient({
      baseUrl: TEST_URL,
      timeout: 30000,
    })
  })

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const health = await client.health()
      expect(health.status).toBeDefined()
      expect(health.timestamp).toBeGreaterThan(0)
    })
  })

  describe('List Verbs', () => {
    it('should list verbs without filters', async () => {
      const response = await client.list({ limit: 10 })

      expect(response.verbs).toBeInstanceOf(Array)
      expect(response.total).toBeGreaterThan(0)
      expect(response.limit).toBe(10)
      expect(response.offset).toBe(0)
    })

    it('should list verbs with category filter', async () => {
      const response = await client.list({
        category: 'Communication',
        limit: 5,
      })

      expect(response.verbs).toBeInstanceOf(Array)
      if (response.verbs.length > 0) {
        expect(response.verbs[0].category).toBe('Communication')
      }
    })

    it('should list verbs with source filter', async () => {
      const response = await client.list({
        source: 'onet',
        limit: 5,
      })

      expect(response.verbs).toBeInstanceOf(Array)
      if (response.verbs.length > 0) {
        expect(response.verbs[0].source).toBe('onet')
      }
    })
  })

  describe('Get Verb', () => {
    it('should get a verb by name', async () => {
      // First list to get a verb name
      const { verbs } = await client.list({ limit: 1 })
      if (verbs.length === 0) {
        console.warn('No verbs available for testing')
        return
      }

      const verbName = verbs[0].name
      const verb = await client.get(verbName)

      expect(verb).toBeDefined()
      expect(verb?.name).toBe(verbName)
      expect(verb?.type).toBe('Verb')
      expect(verb?.label).toBeDefined()
      expect(verb?.description).toBeDefined()
      expect(verb?.category).toBeDefined()
      expect(verb?.source).toBeDefined()
    })

    it('should return null for non-existent verb', async () => {
      const verb = await client.get('this-verb-definitely-does-not-exist-12345')
      expect(verb).toBeNull()
    })
  })

  describe('Search Verbs', () => {
    it('should search verbs by query', async () => {
      const response = await client.search({ q: 'manage', limit: 5 })

      expect(response.results).toBeInstanceOf(Array)
      expect(response.query).toBe('manage')
      expect(response.total).toBeGreaterThanOrEqual(0)

      if (response.results.length > 0) {
        expect(response.results[0].name).toBeDefined()
        expect(response.results[0].relevance).toBeGreaterThan(0)
        expect(response.results[0].relevance).toBeLessThanOrEqual(1)
      }
    })

    it('should return empty results for nonsense query', async () => {
      const response = await client.search({ q: 'xyzabc123nonsense', limit: 5 })

      expect(response.results).toBeInstanceOf(Array)
      expect(response.results.length).toBe(0)
    })
  })

  describe('Related Entities', () => {
    it('should get all related entities', async () => {
      // First list to get a verb name
      const { verbs } = await client.list({ limit: 1 })
      if (verbs.length === 0) {
        console.warn('No verbs available for testing')
        return
      }

      const verbName = verbs[0].name
      const response = await client.related(verbName)

      expect(response.verb).toBe(verbName)
      expect(response.related).toBeDefined()
    })

    it('should get only related nouns', async () => {
      const { verbs } = await client.list({ limit: 1 })
      if (verbs.length === 0) {
        console.warn('No verbs available for testing')
        return
      }

      const verbName = verbs[0].name
      const response = await client.related(verbName, 'nouns')

      expect(response.verb).toBe(verbName)
      expect(response.related.nouns).toBeDefined()
    })

    it('should get only related verbs', async () => {
      const { verbs } = await client.list({ limit: 1 })
      if (verbs.length === 0) {
        console.warn('No verbs available for testing')
        return
      }

      const verbName = verbs[0].name
      const response = await client.related(verbName, 'verbs')

      expect(response.verb).toBe(verbName)
      expect(response.related.verbs).toBeDefined()
    })
  })

  describe('Categories', () => {
    it('should list all categories', async () => {
      const response = await client.categories()

      expect(response.categories).toBeInstanceOf(Array)
      expect(response.total).toBeGreaterThan(0)

      if (response.categories.length > 0) {
        const category = response.categories[0]
        expect(category.name).toBeDefined()
        expect(category.count).toBeGreaterThan(0)
        expect(category.description).toBeDefined()
      }
    })
  })

  describe('CRUD Operations', () => {
    const testVerbName = `test-verb-${Date.now()}`

    it('should create, update, and delete a custom verb', async () => {
      // Create
      const created = await client.create({
        name: testVerbName,
        description: 'Test verb for E2E testing',
        category: 'Testing',
        relatedNouns: ['test', 'data'],
        aliases: ['test-action'],
        metadata: {
          test: true,
        },
      })

      expect(created.name).toBe(testVerbName)
      expect(created.description).toBe('Test verb for E2E testing')
      expect(created.category).toBe('Testing')

      // Get
      const fetched = await client.get(testVerbName)
      expect(fetched).toBeDefined()
      expect(fetched?.name).toBe(testVerbName)

      // Update
      const updated = await client.update(testVerbName, {
        description: 'Updated test verb description',
      })
      expect(updated.description).toBe('Updated test verb description')

      // Delete
      await client.delete(testVerbName)

      // Verify deletion
      const deleted = await client.get(testVerbName)
      expect(deleted).toBeNull()
    })
  })

  describe('Error Handling', () => {
    it('should handle timeout gracefully', async () => {
      const shortTimeoutClient = createClient({
        baseUrl: TEST_URL,
        timeout: 1, // 1ms timeout
      })

      await expect(shortTimeoutClient.list()).rejects.toThrow()
    })

    it('should handle 404 errors', async () => {
      const verb = await client.get('this-definitely-does-not-exist')
      expect(verb).toBeNull()
    })
  })
})
