/**
 * Tests for Database Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DatabaseService, createDatabaseService } from './database'
import type { BusinessContext } from './types'

// Mock fetch globally
global.fetch = vi.fn()

// Mock BusinessContext
const mockClient = {} as BusinessContext

describe('DatabaseService', () => {
  let db: DatabaseService

  beforeEach(() => {
    vi.clearAllMocks()
    db = new DatabaseService(mockClient, {
      apiUrl: 'https://test.database.do',
      apiKey: 'test-key',
    })
  })

  describe('get', () => {
    it('should get a document by id', async () => {
      const mockDoc = { id: 'user-123', name: 'Alice' }
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ document: mockDoc }),
      })

      const result = await db.get('users', 'user-123')

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/users/user-123', {
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        }),
      })
      expect(result).toEqual(mockDoc)
    })

    it('should return null for 404', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await db.get('users', 'nonexistent')

      expect(result).toBeNull()
    })

    it('should throw error for other failures', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(db.get('users', 'user-123')).rejects.toThrow('Failed to get document')
    })
  })

  describe('list', () => {
    it('should list documents with pagination', async () => {
      const mockDocs = [
        { id: 'user-1', name: 'Alice' },
        { id: 'user-2', name: 'Bob' },
      ]
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: mockDocs,
          total: 100,
          hasMore: true,
        }),
      })

      const result = await db.list('users', { limit: 2, offset: 0 })

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://test.database.do/users?'), expect.anything())
      expect(result.items).toEqual(mockDocs)
      expect(result.total).toBe(100)
      expect(result.hasMore).toBe(true)
    })

    it('should support query options', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ documents: [], total: 0, hasMore: false }),
      })

      await db.list('users', {
        limit: 10,
        offset: 20,
        sortBy: 'name',
        sortOrder: 'asc',
        where: { status: 'active' },
        select: ['id', 'name'],
      })

      const url = (fetch as any).mock.calls[0][0]
      expect(url).toContain('limit=10')
      expect(url).toContain('offset=20')
      expect(url).toContain('sortBy=name')
      expect(url).toContain('sortOrder=asc')
      expect(url).toContain('where=')
      expect(url).toContain('select=id%2Cname')
    })
  })

  describe('create', () => {
    it('should create a document', async () => {
      const mockDoc = { id: 'user-123', name: 'Alice', email: 'alice@example.com' }
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ document: mockDoc }),
      })

      const result = await db.create('users', { name: 'Alice', email: 'alice@example.com' })

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/users', {
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ data: { name: 'Alice', email: 'alice@example.com' } }),
      })
      expect(result).toEqual(mockDoc)
    })

    it('should throw error on failure', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Validation failed' }),
      })

      await expect(db.create('users', { invalid: 'data' })).rejects.toThrow('Validation failed')
    })
  })

  describe('update', () => {
    it('should update a document', async () => {
      const mockDoc = { id: 'user-123', name: 'Alice Smith' }
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ document: mockDoc }),
      })

      const result = await db.update('users', 'user-123', { name: 'Alice Smith' })

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/users/user-123', {
        method: 'PATCH',
        headers: expect.anything(),
        body: JSON.stringify({ data: { name: 'Alice Smith' } }),
      })
      expect(result).toEqual(mockDoc)
    })
  })

  describe('delete', () => {
    it('should delete a document', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await db.delete('users', 'user-123')

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/users/user-123', {
        method: 'DELETE',
        headers: expect.anything(),
      })
    })

    it('should not throw on 404', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(db.delete('users', 'nonexistent')).resolves.not.toThrow()
    })
  })

  describe('search', () => {
    it('should search documents', async () => {
      const mockResults = [{ id: 'user-1', name: 'Alice' }]
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: mockResults,
          total: 1,
          hasMore: false,
        }),
      })

      const result = await db.search('users', 'alice', {
        fuzzy: true,
        limit: 10,
        fields: ['name', 'email'],
      })

      const url = (fetch as any).mock.calls[0][0]
      expect(url).toContain('/search?')
      expect(url).toContain('q=alice')
      expect(url).toContain('fuzzy=true')
      expect(url).toContain('fields=name%2Cemail')
      expect(result.items).toEqual(mockResults)
    })

    it('should support vector search', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [], total: 0, hasMore: false }),
      })

      await db.search('users', 'query', {
        vector: true,
        minScore: 0.8,
      })

      const url = (fetch as any).mock.calls[0][0]
      expect(url).toContain('vector=true')
      expect(url).toContain('minScore=0.8')
    })
  })

  describe('relate', () => {
    it('should create a relationship', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await db.relate('users', 'user-123', 'organizations', 'org-456', {
        metadata: { role: 'admin' },
        type: 'member',
      })

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/users/user-123/relationships', {
        method: 'POST',
        headers: expect.anything(),
        body: JSON.stringify({
          toCollection: 'organizations',
          toId: 'org-456',
          metadata: { role: 'admin' },
          type: 'member',
          bidirectional: undefined,
        }),
      })
    })
  })

  describe('getRelated', () => {
    it('should get related documents', async () => {
      const mockOrgs = [{ id: 'org-1', name: 'Acme Inc' }]
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: mockOrgs,
          total: 1,
          hasMore: false,
        }),
      })

      const result = await db.getRelated('users', 'user-123', 'organizations')

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/users/user-123/relationships/organizations'), expect.anything())
      expect(result.items).toEqual(mockOrgs)
    })
  })

  describe('unrelate', () => {
    it('should remove a relationship', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await db.unrelate('users', 'user-123', 'organizations', 'org-456')

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/users/user-123/relationships/organizations/org-456', {
        method: 'DELETE',
        headers: expect.anything(),
      })
    })
  })

  describe('batch operations', () => {
    it('should batch create documents', async () => {
      const docs = [{ name: 'Alice' }, { name: 'Bob' }]
      const mockResult = {
        success: [
          { id: 'user-1', name: 'Alice' },
          { id: 'user-2', name: 'Bob' },
        ],
        failed: [],
      }
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await db.batchCreate('users', docs)

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/users/batch', {
        method: 'POST',
        headers: expect.anything(),
        body: JSON.stringify({ documents: docs }),
      })
      expect(result.success).toEqual(mockResult.success)
      expect(result.total).toBe(2)
    })

    it('should batch update documents', async () => {
      const updates = [
        { id: 'user-1', data: { name: 'Alice Smith' } },
        { id: 'user-2', data: { name: 'Bob Jones' } },
      ]
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: [], failed: [] }),
      })

      await db.batchUpdate('users', updates)

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/users/batch', {
        method: 'PATCH',
        headers: expect.anything(),
        body: JSON.stringify({ updates }),
      })
    })

    it('should batch delete documents', async () => {
      const ids = ['user-1', 'user-2']
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: ids, failed: [] }),
      })

      const result = await db.batchDelete('users', ids)

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/users/batch', {
        method: 'DELETE',
        headers: expect.anything(),
        body: JSON.stringify({ ids }),
      })
      expect(result.success).toEqual(ids)
    })
  })

  describe('transaction', () => {
    it('should execute a transaction and commit', async () => {
      // Mock transaction start
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ transactionId: 'tx-123' }),
      })
      // Mock create operation
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ document: { id: 'user-1', name: 'Alice' } }),
      })
      // Mock commit
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      const result = await db.transaction(async (tx) => {
        const user = await tx.create('users', { name: 'Alice' })
        return user
      })

      expect(result.name).toBe('Alice')
      // Verify commit was called
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/transactions/tx-123/commit'), expect.objectContaining({ method: 'POST' }))
    })

    it('should rollback on error', async () => {
      // Mock transaction start
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ transactionId: 'tx-123' }),
      })
      // Mock failed operation
      ;(fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Validation Error',
      })
      // Mock rollback
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await expect(
        db.transaction(async (tx) => {
          await tx.create('users', { invalid: 'data' })
        })
      ).rejects.toThrow()

      // Verify rollback was called
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/transactions/tx-123/rollback'), expect.objectContaining({ method: 'POST' }))
    })

    it('should support transaction operations', async () => {
      // Mock transaction start
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ transactionId: 'tx-123' }),
      })
      // Mock get
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ document: { id: 'user-1', name: 'Alice' } }),
      })
      // Mock update
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ document: { id: 'user-1', name: 'Alice Smith' } }),
      })
      // Mock commit
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await db.transaction(async (tx) => {
        const user = await tx.get('users', 'user-1')
        await tx.update('users', 'user-1', { name: 'Alice Smith' })
      })

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('transactionId=tx-123'), expect.anything())
    })
  })

  describe('collections', () => {
    it('should list collections', async () => {
      const mockCollections = [
        { name: 'users', count: 10, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
        { name: 'posts', count: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
      ]
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ collections: mockCollections }),
      })

      const result = await db.collections()

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/collections', {
        method: 'GET',
        headers: expect.anything(),
      })
      expect(result).toEqual(mockCollections)
    })

    it('should create a collection', async () => {
      const schema = {
        name: 'products',
        fields: {
          name: { type: 'string' as const, required: true },
          price: { type: 'number' as const, required: true },
        },
      }
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          collection: { name: 'products', count: 0, schema, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
        }),
      })

      const result = await db.createCollection('products', schema)

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/collections', {
        method: 'POST',
        headers: expect.anything(),
        body: JSON.stringify({ name: 'products', schema }),
      })
      expect(result.name).toBe('products')
    })

    it('should delete a collection', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await db.deleteCollection('products')

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/collections/products', {
        method: 'DELETE',
        headers: expect.anything(),
      })
    })
  })

  describe('schema operations', () => {
    it('should get collection schema', async () => {
      const mockSchema = {
        name: 'users',
        fields: {
          name: { type: 'string' as const, required: true },
        },
      }
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ schema: mockSchema }),
      })

      const result = await db.getSchema('users')

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/collections/users/schema', {
        method: 'GET',
        headers: expect.anything(),
      })
      expect(result).toEqual(mockSchema)
    })

    it('should return null for non-existent schema', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await db.getSchema('nonexistent')

      expect(result).toBeNull()
    })

    it('should update collection schema', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      await db.updateSchema('users', {
        fields: {
          email: { type: 'string', required: true },
        },
      })

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/collections/users/schema', {
        method: 'PATCH',
        headers: expect.anything(),
        body: expect.anything(),
      })
    })
  })

  describe('validation', () => {
    it('should validate document', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ valid: true }),
      })

      const result = await db.validate('users', { name: 'Alice', email: 'alice@example.com' })

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/collections/users/validate', {
        method: 'POST',
        headers: expect.anything(),
        body: JSON.stringify({ data: { name: 'Alice', email: 'alice@example.com' } }),
      })
      expect(result.valid).toBe(true)
    })

    it('should return validation errors', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          valid: false,
          errors: ['name is required', 'email is invalid'],
        }),
      })

      const result = await db.validate('users', { invalid: 'data' })

      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(2)
    })
  })

  describe('count', () => {
    it('should count documents', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ count: 42 }),
      })

      const result = await db.count('users')

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/users/count'), expect.anything())
      expect(result).toBe(42)
    })

    it('should count with where filter', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ count: 10 }),
      })

      const result = await db.count('users', { where: { status: 'active' } })

      const url = (fetch as any).mock.calls[0][0]
      expect(url).toContain('where=')
      expect(result).toBe(10)
    })
  })

  describe('exists', () => {
    it('should return true if document exists', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
      })

      const result = await db.exists('users', 'user-123')

      expect(fetch).toHaveBeenCalledWith('https://test.database.do/users/user-123/exists', {
        method: 'HEAD',
        headers: expect.anything(),
      })
      expect(result).toBe(true)
    })

    it('should return false if document does not exist', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await db.exists('users', 'nonexistent')

      expect(result).toBe(false)
    })
  })

  describe('migrations', () => {
    it('should run migrations', async () => {
      const createCollectionMock = vi.spyOn(db, 'createCollection').mockResolvedValue({
        name: 'products',
        count: 0,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      })

      const migrations = [
        {
          version: '1.0.0',
          name: 'add-products',
          up: async (db: DatabaseService) => {
            await db.createCollection('products')
          },
          down: async (db: DatabaseService) => {
            await db.deleteCollection('products')
          },
        },
      ]

      await db.migrate(migrations)

      expect(createCollectionMock).toHaveBeenCalled()
    })

    it('should throw on migration failure', async () => {
      const migrations = [
        {
          version: '1.0.0',
          name: 'failing-migration',
          up: async () => {
            throw new Error('Migration failed')
          },
          down: async () => {},
        },
      ]

      await expect(db.migrate(migrations)).rejects.toThrow('Migration failed')
    })
  })

  describe('createDatabaseService', () => {
    it('should create a DatabaseService instance', () => {
      const service = createDatabaseService(mockClient, {
        apiUrl: 'https://custom.database.do',
      })

      expect(service).toBeInstanceOf(DatabaseService)
    })
  })
})
