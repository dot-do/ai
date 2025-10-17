/**
 * DB Service Integration Tests
 *
 * These tests run against actual DB service endpoints with real database operations.
 * Requires DB_TEST_API_KEY environment variable.
 *
 * Run with: pnpm test:integration db.integration.test.ts
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { RPCClient } from './client'
import type { DBService } from './types'

const DB_BASE_URL = process.env.DB_BASE_URL || 'https://apis.do'
const DB_TEST_API_KEY = process.env.DB_TEST_API_KEY

// Skip all tests if no API key provided
const describeIfApiKey = DB_TEST_API_KEY ? describe : describe.skip

// Test cleanup tracking
const createdIds: string[] = []

describeIfApiKey('DB Service - Integration Tests', () => {
  let client: RPCClient
  let db: DBService

  beforeAll(() => {
    if (!DB_TEST_API_KEY) {
      throw new Error('DB_TEST_API_KEY environment variable is required for integration tests')
    }
    client = new RPCClient({
      baseUrl: DB_BASE_URL,
      apiKey: DB_TEST_API_KEY,
    })
    db = client.db
  })

  afterAll(async () => {
    // Clean up test data
    if (createdIds.length > 0) {
      try {
        await db.batchDelete('TestEntity', createdIds)
      } catch (error) {
        console.warn('Failed to clean up test data:', error)
      }
    }
  })

  describe('CRUD Operations', () => {
    test('creates a new entity', async () => {
      const entity = await db.create('TestEntity', {
        name: 'Integration Test Entity',
        description: 'Created by integration tests',
        status: 'active',
        metadata: {
          testRun: true,
          timestamp: new Date().toISOString(),
        },
      })

      expect(entity).toBeDefined()
      expect(entity.id).toBeDefined()
      expect(entity.name).toBe('Integration Test Entity')
      expect(entity.status).toBe('active')

      createdIds.push(entity.id)
    }, 10000)

    test('reads an existing entity', async () => {
      // Create entity first
      const created = await db.create('TestEntity', {
        name: 'Read Test Entity',
        status: 'active',
      })
      createdIds.push(created.id)

      // Read it back
      const entity = await db.read('TestEntity', created.id)

      expect(entity).toBeDefined()
      expect(entity.id).toBe(created.id)
      expect(entity.name).toBe('Read Test Entity')
    }, 10000)

    test('updates an existing entity', async () => {
      // Create entity first
      const created = await db.create('TestEntity', {
        name: 'Update Test Entity',
        status: 'pending',
      })
      createdIds.push(created.id)

      // Update it
      const updated = await db.update('TestEntity', created.id, {
        status: 'completed',
        updatedAt: new Date().toISOString(),
      })

      expect(updated).toBeDefined()
      expect(updated.id).toBe(created.id)
      expect(updated.status).toBe('completed')
      expect(updated.name).toBe('Update Test Entity') // Preserved
    }, 10000)

    test('deletes an entity', async () => {
      // Create entity first
      const created = await db.create('TestEntity', {
        name: 'Delete Test Entity',
        status: 'active',
      })

      // Delete it
      await db.delete('TestEntity', created.id)

      // Verify deletion
      await expect(db.read('TestEntity', created.id)).rejects.toThrow()
    }, 10000)
  })

  describe('List and Search Operations', () => {
    test('lists entities without filters', async () => {
      // Create test entities
      const entity1 = await db.create('TestEntity', { name: 'List Test 1', status: 'active' })
      const entity2 = await db.create('TestEntity', { name: 'List Test 2', status: 'active' })
      createdIds.push(entity1.id, entity2.id)

      const results = await db.list('TestEntity', {
        limit: 10,
      })

      expect(results).toBeDefined()
      expect(results.items).toBeDefined()
      expect(Array.isArray(results.items)).toBe(true)
      expect(results.items.length).toBeGreaterThan(0)
      expect(results.total).toBeGreaterThanOrEqual(results.items.length)
    }, 10000)

    test('filters entities by status', async () => {
      // Create entities with different statuses
      const active = await db.create('TestEntity', { name: 'Active Entity', status: 'active' })
      const pending = await db.create('TestEntity', { name: 'Pending Entity', status: 'pending' })
      createdIds.push(active.id, pending.id)

      const results = await db.list('TestEntity', {
        filter: { status: 'active' },
        limit: 10,
      })

      expect(results.items).toBeDefined()
      expect(results.items.every((item) => item.status === 'active')).toBe(true)
    }, 10000)

    test('searches entities with text query', async () => {
      // Create searchable entity
      const entity = await db.create('TestEntity', {
        name: 'Searchable Integration Test Entity',
        description: 'This entity contains unique searchable text for testing',
        status: 'active',
      })
      createdIds.push(entity.id)

      // Wait briefly for indexing
      await new Promise((resolve) => setTimeout(resolve, 500))

      const results = await db.search('TestEntity', 'unique searchable text', {
        limit: 5,
      })

      expect(results).toBeDefined()
      expect(results.items).toBeDefined()
      expect(Array.isArray(results.items)).toBe(true)

      if (results.items.length > 0) {
        // Verify search results contain our entity
        const found = results.items.some((item) => item.id === entity.id)
        expect(found).toBe(true)
      }
    }, 10000)
  })

  describe('Pagination', () => {
    test('uses cursor-based pagination', async () => {
      // Create multiple entities
      const entities = await Promise.all(
        Array.from({ length: 5 }, (_, i) =>
          db.create('TestEntity', {
            name: `Pagination Test ${i}`,
            status: 'active',
          })
        )
      )
      createdIds.push(...entities.map((e) => e.id))

      // Get first page
      const page1 = await db.list('TestEntity', {
        limit: 2,
      })

      expect(page1.items.length).toBeLessThanOrEqual(2)
      expect(page1.hasMore).toBeDefined()

      if (page1.hasMore && page1.cursor) {
        // Get second page
        const page2 = await db.list('TestEntity', {
          limit: 2,
          cursor: page1.cursor,
        })

        expect(page2.items.length).toBeGreaterThan(0)
        // Ensure no overlap between pages
        const page1Ids = page1.items.map((item) => item.id)
        const page2Ids = page2.items.map((item) => item.id)
        const overlap = page1Ids.some((id) => page2Ids.includes(id))
        expect(overlap).toBe(false)
      }
    }, 15000)
  })

  describe('Batch Operations', () => {
    test('batch creates multiple entities', async () => {
      const entities = [
        { name: 'Batch Entity 1', status: 'active' },
        { name: 'Batch Entity 2', status: 'active' },
        { name: 'Batch Entity 3', status: 'pending' },
      ]

      const results = await db.batchCreate('TestEntity', entities)

      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(3)
      results.forEach((entity) => {
        expect(entity.id).toBeDefined()
        createdIds.push(entity.id)
      })
    }, 15000)

    test('batch updates multiple entities', async () => {
      // Create entities first
      const created = await db.batchCreate('TestEntity', [
        { name: 'Update 1', status: 'pending' },
        { name: 'Update 2', status: 'pending' },
      ])
      const ids = created.map((e) => e.id)
      createdIds.push(...ids)

      // Batch update
      const updates = ids.map((id) => ({
        id,
        data: { status: 'completed' },
      }))

      const results = await db.batchUpdate('TestEntity', updates)

      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      results.forEach((entity) => {
        expect(entity.status).toBe('completed')
      })
    }, 15000)

    test('batch deletes multiple entities', async () => {
      // Create entities first
      const created = await db.batchCreate('TestEntity', [
        { name: 'Delete 1', status: 'active' },
        { name: 'Delete 2', status: 'active' },
        { name: 'Delete 3', status: 'active' },
      ])
      const ids = created.map((e) => e.id)

      // Batch delete
      await db.batchDelete('TestEntity', ids)

      // Verify deletions
      for (const id of ids) {
        await expect(db.read('TestEntity', id)).rejects.toThrow()
      }
    }, 15000)
  })

  describe('Relationship Management', () => {
    test('creates and queries relationships', async () => {
      // Create two entities
      const parent = await db.create('TestEntity', { name: 'Parent Entity', status: 'active' })
      const child = await db.create('TestEntity', { name: 'Child Entity', status: 'active' })
      createdIds.push(parent.id, child.id)

      // Create relationship
      await db.relate('TestEntity', parent.id, 'children', child.id)

      // Query relationships
      const relationships = await db.queryRelationships('TestEntity', parent.id, 'children')

      expect(relationships).toBeDefined()
      expect(Array.isArray(relationships)).toBe(true)
      expect(relationships.some((rel) => rel.id === child.id)).toBe(true)
    }, 15000)

    test('removes relationships', async () => {
      // Create entities and relationship
      const parent = await db.create('TestEntity', { name: 'Parent 2', status: 'active' })
      const child = await db.create('TestEntity', { name: 'Child 2', status: 'active' })
      createdIds.push(parent.id, child.id)

      await db.relate('TestEntity', parent.id, 'children', child.id)

      // Remove relationship
      await db.unrelate('TestEntity', parent.id, 'children', child.id)

      // Verify removal
      const relationships = await db.queryRelationships('TestEntity', parent.id, 'children')
      expect(relationships.some((rel) => rel.id === child.id)).toBe(false)
    }, 15000)
  })

  describe('Complex Queries', () => {
    test('queries with MongoDB-style operators', async () => {
      // Create entities with numeric fields
      const entities = await db.batchCreate('TestEntity', [
        { name: 'Item 1', status: 'active', priority: 1 },
        { name: 'Item 2', status: 'active', priority: 5 },
        { name: 'Item 3', status: 'pending', priority: 10 },
      ])
      createdIds.push(...entities.map((e) => e.id))

      // Query with $gte operator
      const results = await db.list('TestEntity', {
        filter: {
          priority: { $gte: 5 },
        },
      })

      expect(results.items).toBeDefined()
      expect(results.items.length).toBeGreaterThanOrEqual(2)
      results.items.forEach((item) => {
        if (item.priority !== undefined) {
          expect(item.priority).toBeGreaterThanOrEqual(5)
        }
      })
    }, 15000)

    test('queries with $in operator', async () => {
      // Create entities with different statuses
      const entities = await db.batchCreate('TestEntity', [
        { name: 'Active 1', status: 'active' },
        { name: 'Pending 1', status: 'pending' },
        { name: 'Completed 1', status: 'completed' },
      ])
      createdIds.push(...entities.map((e) => e.id))

      // Query with $in operator
      const results = await db.list('TestEntity', {
        filter: {
          status: { $in: ['active', 'pending'] },
        },
      })

      expect(results.items).toBeDefined()
      results.items.forEach((item) => {
        expect(['active', 'pending']).toContain(item.status)
      })
    }, 15000)
  })

  describe('Error Handling', () => {
    test('handles non-existent entity', async () => {
      await expect(db.read('TestEntity', 'non-existent-id-12345')).rejects.toThrow()
    }, 10000)

    test('handles invalid entity type', async () => {
      await expect(db.create('NonExistentType', { name: 'Test' })).rejects.toThrow()
    }, 10000)

    test('handles invalid API key', async () => {
      const invalidClient = new RPCClient({
        baseUrl: DB_BASE_URL,
        apiKey: 'invalid-key-12345',
      })

      await expect(invalidClient.db.list('TestEntity')).rejects.toThrow()
    }, 10000)

    test('handles network errors', async () => {
      const offlineClient = new RPCClient({
        baseUrl: 'https://nonexistent-db.do',
        apiKey: DB_TEST_API_KEY,
      })

      await expect(offlineClient.db.list('TestEntity')).rejects.toThrow()
    }, 10000)
  })
})

describeIfApiKey('DB Service - Load Testing', () => {
  let client: RPCClient
  let db: DBService
  const loadTestIds: string[] = []

  beforeAll(() => {
    client = new RPCClient({
      baseUrl: DB_BASE_URL,
      apiKey: DB_TEST_API_KEY!,
    })
    db = client.db
  })

  afterAll(async () => {
    // Clean up load test data
    if (loadTestIds.length > 0) {
      try {
        await db.batchDelete('TestEntity', loadTestIds)
      } catch (error) {
        console.warn('Failed to clean up load test data:', error)
      }
    }
  })

  test('handles concurrent creates', async () => {
    const promises = Array.from({ length: 10 }, (_, i) =>
      db.create('TestEntity', {
        name: `Concurrent Create ${i}`,
        status: 'active',
      })
    )

    const results = await Promise.allSettled(promises)

    const successful = results.filter((r) => r.status === 'fulfilled')
    expect(successful.length).toBeGreaterThan(0)

    successful.forEach((result) => {
      if (result.status === 'fulfilled') {
        loadTestIds.push(result.value.id)
      }
    })
  }, 30000)

  test('handles concurrent reads', async () => {
    // Create test entity
    const entity = await db.create('TestEntity', {
      name: 'Concurrent Read Test',
      status: 'active',
    })
    loadTestIds.push(entity.id)

    // Perform concurrent reads
    const promises = Array.from({ length: 10 }, () => db.read('TestEntity', entity.id))

    const results = await Promise.allSettled(promises)

    const successful = results.filter((r) => r.status === 'fulfilled').length
    expect(successful).toBe(10) // All reads should succeed
  }, 30000)

  test('handles concurrent updates', async () => {
    // Create test entity
    const entity = await db.create('TestEntity', {
      name: 'Concurrent Update Test',
      status: 'active',
      counter: 0,
    })
    loadTestIds.push(entity.id)

    // Perform concurrent updates
    const promises = Array.from({ length: 10 }, (_, i) =>
      db.update('TestEntity', entity.id, {
        counter: i,
        updatedAt: new Date().toISOString(),
      })
    )

    const results = await Promise.allSettled(promises)

    const successful = results.filter((r) => r.status === 'fulfilled').length
    expect(successful).toBeGreaterThan(0)
  }, 30000)

  test('handles concurrent list operations', async () => {
    const promises = Array.from({ length: 10 }, () =>
      db.list('TestEntity', {
        limit: 10,
      })
    )

    const results = await Promise.all(promises)

    results.forEach((result) => {
      expect(result).toBeDefined()
      expect(result.items).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)
    })
  }, 30000)
})
