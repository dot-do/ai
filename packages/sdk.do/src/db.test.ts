/**
 * Tests for Database Service
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { RPCClient } from './client'
import type { DBService } from './types'

describe('Database Service', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let client: RPCClient
  let db: DBService

  beforeEach(() => {
    // Mock global fetch
    mockFetch = vi.fn()
    global.fetch = mockFetch

    // Create client with test configuration
    client = new RPCClient({
      apiKey: 'test-key',
      baseUrl: 'https://test.apis.do',
    })

    db = client.db
  })

  describe('query()', () => {
    test('executes SQL query with parameters', async () => {
      const mockResult = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: mockResult }),
      })

      const result = await db.query('SELECT * FROM users WHERE id = ?', ['1'])

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/db/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: ['SELECT * FROM users WHERE id = ?', ['1']] }),
      })

      expect(result).toEqual(mockResult)
    })

    test('executes query without parameters', async () => {
      const mockResult = [{ count: 42 }]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: mockResult }),
      })

      const result = await db.query('SELECT COUNT(*) as count FROM users')

      expect(result).toEqual(mockResult)
    })

    test('handles empty result set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [] }),
      })

      const result = await db.query('SELECT * FROM users WHERE id = ?', ['999'])

      expect(result).toEqual([])
    })

    test('throws error on invalid SQL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: { message: 'SQL syntax error near "SELEC"' },
        }),
      })

      await expect(db.query('SELEC * FROM users')).rejects.toThrow('SQL syntax error')
    })
  })

  describe('get()', () => {
    test('retrieves entity by namespace and ID', async () => {
      const mockUser = {
        id: 'user_123',
        name: 'Alice',
        email: 'alice@example.com',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: mockUser }),
      })

      const result = await db.get('users', 'user_123')

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/db/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: ['users', 'user_123'] }),
      })

      expect(result).toEqual(mockUser)
    })

    test('returns null for non-existent entity', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: null }),
      })

      const result = await db.get('users', 'nonexistent')

      expect(result).toBeNull()
    })

    test('handles different namespaces', async () => {
      const namespaces = ['users', 'orders', 'products', 'organizations']

      for (const ns of namespaces) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { id: '123', ns } }),
        })

        const result = await db.get(ns, '123')
        expect(result.ns).toBe(ns)
      }
    })
  })

  describe('list()', () => {
    test('lists entities in namespace', async () => {
      const mockUsers = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Charlie' },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: mockUsers }),
      })

      const result = await db.list('users')

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/db/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: ['users'] }),
      })

      expect(result).toEqual(mockUsers)
    })

    test('supports pagination with limit and offset', async () => {
      const mockUsers = [{ id: '11', name: 'User 11' }]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: mockUsers }),
      })

      const result = await db.list('users', { limit: 10, offset: 10 })

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/db/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: ['users', { limit: 10, offset: 10 }] }),
      })

      expect(result).toEqual(mockUsers)
    })

    test('supports filtering', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [] }),
      })

      await db.list('users', { filter: { status: 'active' } })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/db/list',
        expect.objectContaining({
          body: JSON.stringify({ params: ['users', { filter: { status: 'active' } }] }),
        })
      )
    })

    test('supports sorting', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [] }),
      })

      await db.list('users', { orderBy: 'createdAt', order: 'desc' })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/db/list',
        expect.objectContaining({
          body: JSON.stringify({ params: ['users', { orderBy: 'createdAt', order: 'desc' }] }),
        })
      )
    })

    test('returns empty array for empty namespace', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [] }),
      })

      const result = await db.list('empty_namespace')

      expect(result).toEqual([])
    })
  })

  describe('upsert()', () => {
    test('creates new entity', async () => {
      const newUser = {
        id: 'user_new',
        name: 'New User',
        email: 'new@example.com',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: newUser }),
      })

      const result = await db.upsert('users', 'user_new', { name: 'New User', email: 'new@example.com' })

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/db/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: ['users', 'user_new', { name: 'New User', email: 'new@example.com' }] }),
      })

      expect(result).toEqual(newUser)
    })

    test('updates existing entity', async () => {
      const updatedUser = {
        id: 'user_123',
        name: 'Updated Name',
        email: 'updated@example.com',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: updatedUser }),
      })

      const result = await db.upsert('users', 'user_123', { name: 'Updated Name' })

      expect(result).toEqual(updatedUser)
    })

    test('handles nested objects', async () => {
      const complexData = {
        id: 'order_123',
        customer: { id: 'cust_1', name: 'Alice' },
        items: [
          { id: 'item_1', quantity: 2 },
          { id: 'item_2', quantity: 1 },
        ],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: complexData }),
      })

      const result = await db.upsert('orders', 'order_123', complexData)

      expect(result).toEqual(complexData)
    })
  })

  describe('delete()', () => {
    test('deletes entity by namespace and ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await db.delete('users', 'user_123')

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/db/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: ['users', 'user_123'] }),
      })
    })

    test('succeeds even if entity does not exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await expect(db.delete('users', 'nonexistent')).resolves.toBeUndefined()
    })

    test('throws error on database failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: { message: 'Database connection failed' },
        }),
      })

      await expect(db.delete('users', 'user_123')).rejects.toThrow('Database connection failed')
    })
  })

  describe('search()', () => {
    test('performs vector/text search', async () => {
      const mockResults = [
        { id: '1', name: 'Result 1', score: 0.95 },
        { id: '2', name: 'Result 2', score: 0.85 },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: mockResults }),
      })

      const result = await db.search('products', 'wireless headphones')

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/db/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: ['products', 'wireless headphones'] }),
      })

      expect(result).toEqual(mockResults)
    })

    test('supports search options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [] }),
      })

      await db.search('products', 'laptop', {
        limit: 10,
        fields: ['name', 'description'],
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/db/search',
        expect.objectContaining({
          body: JSON.stringify({ params: ['products', 'laptop', { limit: 10, fields: ['name', 'description'] }] }),
        })
      )
    })

    test('returns empty array for no matches', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [] }),
      })

      const result = await db.search('products', 'nonexistent product query')

      expect(result).toEqual([])
    })

    test('supports semantic vector search', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [{ id: '1', score: 0.9 }] }),
      })

      await db.search('documents', 'climate change research', {
        limit: 5,
        offset: 0,
      })

      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(db.get('users', 'user_123')).rejects.toThrow('Network error')
    })

    test('handles HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(db.get('users', 'user_123')).rejects.toThrow('HTTP 500')
    })

    test('handles RPC error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: {
            message: 'Invalid namespace',
            code: 'INVALID_NAMESPACE',
          },
        }),
      })

      await expect(db.get('invalid ns', 'id')).rejects.toThrow('Invalid namespace')
    })

    test('handles malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(db.get('users', 'user_123')).rejects.toThrow('Invalid JSON')
    })
  })

  describe('Request Deduplication', () => {
    test('deduplicates identical concurrent requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { id: 'user_123' } }),
      })

      // Make three identical concurrent requests
      const [result1, result2, result3] = await Promise.all([db.get('users', 'user_123'), db.get('users', 'user_123'), db.get('users', 'user_123')])

      // Should only make one network request
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // All results should be the same
      expect(result1).toEqual(result2)
      expect(result2).toEqual(result3)
    })

    test('does not deduplicate different requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: {} }),
      })

      await Promise.all([db.get('users', 'user_1'), db.get('users', 'user_2'), db.get('users', 'user_3')])

      // Should make three separate network requests
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    test('cleans up pending requests after completion', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { id: 'user_123' } }),
      })

      // First request
      await db.get('users', 'user_123')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { id: 'user_123' } }),
      })

      // Second request after first completes - should NOT be deduplicated
      await db.get('users', 'user_123')

      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('Type Safety', () => {
    test('query returns any[] type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [] }),
      })

      const result = await db.query('SELECT * FROM users')

      // Type assertion
      const rows: any[] = result
      expect(Array.isArray(rows)).toBe(true)
    })

    test('get returns any type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { id: '1' } }),
      })

      const result = await db.get('users', '1')

      // Type assertion
      const entity: any = result
      expect(entity).toBeDefined()
    })

    test('list returns any[] type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [] }),
      })

      const result = await db.list('users')

      // Type assertion
      const entities: any[] = result
      expect(Array.isArray(entities)).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    test('handles empty string namespace', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: { message: 'Invalid namespace' },
        }),
      })

      await expect(db.get('', 'id')).rejects.toThrow()
    })

    test('handles empty string ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: null }),
      })

      const result = await db.get('users', '')

      expect(result).toBeNull()
    })

    test('handles special characters in namespace', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [] }),
      })

      await db.list('user-profiles')

      expect(mockFetch).toHaveBeenCalled()
    })

    test('handles unicode in data', async () => {
      const unicodeData = {
        name: 'Test 测试 テスト',
        emoji: '🚀💻🎉',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: unicodeData }),
      })

      const result = await db.upsert('users', 'unicode_test', unicodeData)

      expect(result).toEqual(unicodeData)
    })

    test('handles null values in data', async () => {
      const dataWithNulls = {
        name: 'Test',
        optionalField: null,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: dataWithNulls }),
      })

      const result = await db.upsert('users', 'test', dataWithNulls)

      expect(result.optionalField).toBeNull()
    })

    test('handles large result sets', async () => {
      const largeResultSet = Array.from({ length: 10000 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }))

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: largeResultSet }),
      })

      const result = await db.list('users')

      expect(result).toHaveLength(10000)
    })
  })

  describe('Complex Queries', () => {
    test('handles JOIN queries', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [] }),
      })

      await db.query('SELECT u.*, o.* FROM users u JOIN orders o ON u.id = o.user_id')

      expect(mockFetch).toHaveBeenCalled()
    })

    test('handles aggregation queries', async () => {
      const aggregateResult = [{ total_orders: 42, total_revenue: 10000 }]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: aggregateResult }),
      })

      const result = await db.query('SELECT COUNT(*) as total_orders, SUM(amount) as total_revenue FROM orders')

      expect(result).toEqual(aggregateResult)
    })

    test('handles subqueries', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [] }),
      })

      await db.query('SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE status = ?)', ['completed'])

      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('forEach()', () => {
    describe('Edge Cases', () => {
      test('handles empty namespace (0 documents)', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 0 } }),
        })

        const result = await db.forEach('empty_namespace', async () => {})

        expect(result.processed).toBe(0)
        expect(result.success).toBe(0)
        expect(result.failed).toBe(0)
        expect(mockFetch).toHaveBeenCalledTimes(1) // Only total count call
      })

      test('handles single document', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 1 } }),
        })

        // Mock batch fetch call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            result: { documents: [{ id: '1', namespace: 'items', data: { name: 'Item 1' } }], total: 1 },
          }),
        })

        let callCount = 0
        const result = await db.forEach('items', async () => {
          callCount++
        })

        expect(result.processed).toBe(1)
        expect(result.success).toBe(1)
        expect(callCount).toBe(1)
      })

      test('handles exact batch size boundary (100 documents with default batchSize)', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 100 } }),
        })

        // Mock batch fetch call (all 100 at once)
        const docs = Array.from({ length: 100 }, (_, i) => ({
          id: String(i + 1),
          namespace: 'items',
          data: { name: `Item ${i + 1}` },
        }))
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: docs, total: 100 } }),
        })

        let callCount = 0
        const result = await db.forEach('items', async () => {
          callCount++
        })

        expect(result.processed).toBe(100)
        expect(result.success).toBe(100)
        expect(callCount).toBe(100)
      })

      test('handles batch size + 1 documents (101 documents with default batchSize)', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 101 } }),
        })

        // Mock first batch (100 docs)
        const batch1 = Array.from({ length: 100 }, (_, i) => ({
          id: String(i + 1),
          namespace: 'items',
          data: { name: `Item ${i + 1}` },
        }))
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: batch1, total: 101 } }),
        })

        // Mock second batch (1 doc)
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            result: { documents: [{ id: '101', namespace: 'items', data: { name: 'Item 101' } }], total: 101 },
          }),
        })

        let callCount = 0
        const result = await db.forEach('items', async () => {
          callCount++
        })

        expect(result.processed).toBe(101)
        expect(result.success).toBe(101)
        expect(callCount).toBe(101)
      })

      test('handles custom small batch size (batchSize: 1)', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 3 } }),
        })

        // Mock 3 separate batch calls (1 doc each)
        for (let i = 1; i <= 3; i++) {
          mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              success: true,
              result: { documents: [{ id: String(i), namespace: 'items', data: { name: `Item ${i}` } }], total: 3 },
            }),
          })
        }

        const result = await db.forEach('items', async () => {}, { batchSize: 1 })

        expect(result.processed).toBe(3)
        expect(mockFetch).toHaveBeenCalledTimes(4) // 1 total count + 3 batch calls
      })

      test('handles large batch size (batchSize: 1000)', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 500 } }),
        })

        // Mock single batch fetch (all 500 docs)
        const docs = Array.from({ length: 500 }, (_, i) => ({
          id: String(i + 1),
          namespace: 'items',
          data: { name: `Item ${i + 1}` },
        }))
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: docs, total: 500 } }),
        })

        const result = await db.forEach('items', async () => {}, { batchSize: 1000 })

        expect(result.processed).toBe(500)
        expect(mockFetch).toHaveBeenCalledTimes(2) // 1 total count + 1 batch call
      })
    })

    describe('Concurrency Control', () => {
      test('handles concurrency: 1 (sequential)', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 5 } }),
        })

        // Mock batch fetch
        const docs = Array.from({ length: 5 }, (_, i) => ({
          id: String(i + 1),
          namespace: 'items',
          data: { name: `Item ${i + 1}` },
        }))
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: docs, total: 5 } }),
        })

        const callOrder: number[] = []
        const result = await db.forEach(
          'items',
          async (doc) => {
            callOrder.push(parseInt(doc.id))
            await new Promise((resolve) => setTimeout(resolve, 10))
          },
          { concurrency: 1 }
        )

        expect(result.processed).toBe(5)
        expect(callOrder).toEqual([1, 2, 3, 4, 5]) // Sequential order
      })

      test('handles high concurrency (concurrency: 10)', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 10 } }),
        })

        // Mock batch fetch
        const docs = Array.from({ length: 10 }, (_, i) => ({
          id: String(i + 1),
          namespace: 'items',
          data: { name: `Item ${i + 1}` },
        }))
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: docs, total: 10 } }),
        })

        const callTimestamps: number[] = []
        const result = await db.forEach(
          'items',
          async () => {
            callTimestamps.push(Date.now())
            await new Promise((resolve) => setTimeout(resolve, 10))
          },
          { concurrency: 10 }
        )

        expect(result.processed).toBe(10)
        expect(result.success).toBe(10)
        // With high concurrency, all calls should start around the same time
        const timeSpread = callTimestamps[callTimestamps.length - 1] - callTimestamps[0]
        expect(timeSpread).toBeLessThan(50) // Should all start within 50ms
      })
    })

    describe('Error Handling', () => {
      test('stops on first error when continueOnError: false', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 5 } }),
        })

        // Mock batch fetch
        const docs = Array.from({ length: 5 }, (_, i) => ({
          id: String(i + 1),
          namespace: 'items',
          data: { name: `Item ${i + 1}` },
        }))
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: docs, total: 5 } }),
        })

        let processCount = 0
        await expect(
          db.forEach(
            'items',
            async (doc) => {
              processCount++
              if (doc.id === '3') {
                throw new Error('Processing failed')
              }
            },
            { continueOnError: false }
          )
        ).rejects.toThrow('Processing failed')

        expect(processCount).toBe(3) // Should stop at doc 3
      })

      test('continues on error when continueOnError: true', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 5 } }),
        })

        // Mock batch fetch
        const docs = Array.from({ length: 5 }, (_, i) => ({
          id: String(i + 1),
          namespace: 'items',
          data: { name: `Item ${i + 1}` },
        }))
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: docs, total: 5 } }),
        })

        const result = await db.forEach(
          'items',
          async (doc) => {
            if (doc.id === '2' || doc.id === '4') {
              throw new Error(`Failed on ${doc.id}`)
            }
          },
          { continueOnError: true }
        )

        expect(result.processed).toBe(5)
        expect(result.success).toBe(3)
        expect(result.failed).toBe(2)
        expect(result.errors).toHaveLength(2)
        expect(result.errors[0].documentId).toBe('2')
        expect(result.errors[1].documentId).toBe('4')
      })

      test('calls onError callback for each error', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 3 } }),
        })

        // Mock batch fetch
        const docs = Array.from({ length: 3 }, (_, i) => ({
          id: String(i + 1),
          namespace: 'items',
          data: { name: `Item ${i + 1}` },
        }))
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: docs, total: 3 } }),
        })

        const errorLog: Array<{ error: Error; doc: any }> = []
        const result = await db.forEach(
          'items',
          async (doc) => {
            if (doc.id === '2') {
              throw new Error('Failed on 2')
            }
          },
          {
            continueOnError: true,
            onError: (error, doc) => {
              errorLog.push({ error, doc })
            },
          }
        )

        expect(result.failed).toBe(1)
        expect(errorLog).toHaveLength(1)
        expect(errorLog[0].error.message).toBe('Failed on 2')
        expect(errorLog[0].doc.id).toBe('2')
      })

      test('handles async errors correctly', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 3 } }),
        })

        // Mock batch fetch
        const docs = Array.from({ length: 3 }, (_, i) => ({
          id: String(i + 1),
          namespace: 'items',
          data: { name: `Item ${i + 1}` },
        }))
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: docs, total: 3 } }),
        })

        const result = await db.forEach(
          'items',
          async (doc) => {
            await new Promise((resolve) => setTimeout(resolve, 10))
            if (doc.id === '2') {
              throw new Error('Async error')
            }
          },
          { continueOnError: true }
        )

        expect(result.success).toBe(2)
        expect(result.failed).toBe(1)
        expect(result.errors[0].error).toContain('Async error')
      })
    })

    describe('Progress Tracking', () => {
      test('calls onProgress callback after each batch', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 10 } }),
        })

        // Mock batch fetch
        const docs = Array.from({ length: 10 }, (_, i) => ({
          id: String(i + 1),
          namespace: 'items',
          data: { name: `Item ${i + 1}` },
        }))
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: docs, total: 10 } }),
        })

        const progressUpdates: Array<{ processed: number; total: number }> = []
        const result = await db.forEach('items', async () => {}, {
          onProgress: (processed, total) => {
            progressUpdates.push({ processed, total })
          },
        })

        expect(result.processed).toBe(10)
        expect(progressUpdates.length).toBeGreaterThan(0)
        expect(progressUpdates[progressUpdates.length - 1]).toEqual({ processed: 10, total: 10 })
      })

      test('onProgress shows incremental progress', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 10 } }),
        })

        // Mock batch fetch
        const docs = Array.from({ length: 10 }, (_, i) => ({
          id: String(i + 1),
          namespace: 'items',
          data: { name: `Item ${i + 1}` },
        }))
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: docs, total: 10 } }),
        })

        const progressUpdates: number[] = []
        await db.forEach('items', async () => {}, {
          onProgress: (processed) => {
            progressUpdates.push(processed)
          },
        })

        // Progress should be increasing
        for (let i = 1; i < progressUpdates.length; i++) {
          expect(progressUpdates[i]).toBeGreaterThanOrEqual(progressUpdates[i - 1])
        }
      })
    })

    describe('Queue Mode', () => {
      test('falls back to sync mode when useQueue: true (not implemented)', async () => {
        // Mock total count call
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: [], total: 2 } }),
        })

        // Mock batch fetch
        const docs = Array.from({ length: 2 }, (_, i) => ({
          id: String(i + 1),
          namespace: 'items',
          data: { name: `Item ${i + 1}` },
        }))
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, result: { documents: docs, total: 2 } }),
        })

        const result = await db.forEach('items', async () => {}, { useQueue: true })

        expect(result.processed).toBe(2)
        expect(result.success).toBe(2)
        expect(result.jobId).toBeUndefined() // No job ID in fallback mode
      })
    })
  })
})
