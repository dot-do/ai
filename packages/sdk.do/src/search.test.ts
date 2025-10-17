/**
 * Tests for Search Service
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { SearchService, createSearchService } from './search'
import type { SearchResponse, SuggestResponse, CollectionsResponse, SearchStats, SearchResult } from './search'

describe('SearchService', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let service: SearchService

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    service = new SearchService('https://test.search.do', 'test-api-key')
  })

  describe('constructor', () => {
    test('creates service with default baseUrl', () => {
      const defaultService = new SearchService()
      expect(defaultService).toBeInstanceOf(SearchService)
    })

    test('creates service with custom baseUrl and apiKey', () => {
      expect(service).toBeInstanceOf(SearchService)
    })
  })

  describe('query()', () => {
    test('searches with basic query', async () => {
      const mockResponse: SearchResponse = {
        results: [
          {
            id: 'evt_123',
            collection: 'events',
            title: 'Order created',
            description: 'Order created event',
            score: 0.95,
          },
          {
            id: 'evt_456',
            collection: 'events',
            title: 'Order updated',
            description: 'Order updated event',
            score: 0.85,
          },
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 2,
          totalPages: 1,
        },
        query: {
          q: 'order',
        },
        duration: 45,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.query('order')

      expect(mockFetch).toHaveBeenCalledWith('https://test.search.do/v1/search?q=order', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result.results).toHaveLength(2)
      expect(result.pagination.total).toBe(2)
    })

    test('searches with collections filter', async () => {
      const mockResponse: SearchResponse = {
        results: [{ id: 'evt_123', collection: 'events', title: 'Order created', score: 0.95 }],
        pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
        query: { q: 'order', collections: ['events', 'webhooks'] },
        duration: 30,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.query('order', {
        collections: ['events', 'webhooks'],
      })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('q=order')
      expect(callUrl).toContain('collections=events')
      expect(callUrl).toContain('collections=webhooks')
    })

    test('searches with pagination options', async () => {
      const mockResponse: SearchResponse = {
        results: [],
        pagination: { page: 2, limit: 20, total: 100, totalPages: 5 },
        query: { q: 'order' },
        duration: 25,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.query('order', {
        page: 2,
        limit: 20,
      })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('page=2')
      expect(callUrl).toContain('limit=20')
      expect(result.pagination.page).toBe(2)
      expect(result.pagination.limit).toBe(20)
    })

    test('searches with sort and order options', async () => {
      const mockResponse: SearchResponse = {
        results: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
        query: { q: 'order' },
        duration: 20,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await service.query('order', {
        sort: 'date',
        order: 'asc',
      })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('sort=date')
      expect(callUrl).toContain('order=asc')
    })

    test('searches with filters', async () => {
      const mockResponse: SearchResponse = {
        results: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
        query: { q: 'order', filters: { status: 'completed' } },
        duration: 30,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await service.query('order', {
        filters: { status: 'completed' },
      })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('filters=')
      expect(callUrl).toContain(encodeURIComponent(JSON.stringify({ status: 'completed' })))
    })

    test('searches with facets', async () => {
      const mockResponse: SearchResponse = {
        results: [],
        facets: {
          collection: [
            { value: 'events', count: 50 },
            { value: 'webhooks', count: 30 },
          ],
          status: [
            { value: 'completed', count: 40 },
            { value: 'pending', count: 20 },
          ],
        },
        pagination: { page: 1, limit: 50, total: 80, totalPages: 2 },
        query: { q: 'order' },
        duration: 35,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.query('order', {
        facets: ['collection', 'status'],
      })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('facets=collection')
      expect(callUrl).toContain('facets=status')
      expect(result.facets?.collection).toHaveLength(2)
      expect(result.facets?.status).toHaveLength(2)
    })

    test('searches with semantic option', async () => {
      const mockResponse: SearchResponse = {
        results: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
        query: { q: 'order' },
        duration: 50,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await service.query('order', {
        semantic: true,
      })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('semantic=true')
    })

    test('throws error on search failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid query',
      })

      await expect(service.query('')).rejects.toThrow('Search failed: Invalid query')
    })
  })

  describe('suggest()', () => {
    test('gets autocomplete suggestions', async () => {
      const mockResponse: SuggestResponse = {
        suggestions: ['Order', 'Order.created', 'Order.updated', 'Order.cancelled'],
        query: 'ord',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.suggest('ord')

      expect(mockFetch).toHaveBeenCalledWith('https://test.search.do/v1/search/suggest?q=ord', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result.suggestions).toHaveLength(4)
      expect(result.query).toBe('ord')
    })

    test('gets suggestions with limit', async () => {
      const mockResponse: SuggestResponse = {
        suggestions: ['Order', 'Order.created'],
        query: 'ord',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.suggest('ord', { limit: 2 })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('limit=2')
      expect(result.suggestions).toHaveLength(2)
    })

    test('gets suggestions with collections filter', async () => {
      const mockResponse: SuggestResponse = {
        suggestions: ['Order.created', 'Order.updated'],
        query: 'ord',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await service.suggest('ord', {
        collections: ['events'],
      })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('collections=events')
    })

    test('throws error on suggest failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(service.suggest('ord')).rejects.toThrow('Search suggest failed: Internal Server Error')
    })
  })

  describe('getCollections()', () => {
    test('retrieves searchable collections', async () => {
      const mockResponse: CollectionsResponse = {
        collections: [
          {
            name: 'events',
            searchFields: ['type', 'data'],
            titleField: 'type',
            descriptionField: 'data',
            dateField: 'timestamp',
          },
          {
            name: 'media',
            searchFields: ['filename', 'alt', 'title'],
            titleField: 'filename',
            descriptionField: 'description',
            dateField: 'uploaded',
          },
        ],
        count: 2,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.getCollections()

      expect(result.collections).toHaveLength(2)
      expect(result.count).toBe(2)
      expect(result.collections[0].name).toBe('events')
    })

    test('throws error on failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(service.getCollections()).rejects.toThrow('Failed to get collections: Internal Server Error')
    })
  })

  describe('getStats()', () => {
    test('retrieves search statistics', async () => {
      const mockStats: SearchStats = {
        total: 1500,
        byCollection: [
          { collection: 'events', count: 800 },
          { collection: 'media', count: 400 },
          { collection: 'webhooks', count: 300 },
        ],
        collections: 3,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })

      const result = await service.getStats()

      expect(result.total).toBe(1500)
      expect(result.byCollection).toHaveLength(3)
      expect(result.collections).toBe(3)
    })

    test('throws error on failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(service.getStats()).rejects.toThrow('Failed to get search stats: Internal Server Error')
    })
  })

  describe('searchCollection()', () => {
    test('searches a specific collection', async () => {
      const mockResponse: SearchResponse = {
        results: [{ id: 'evt_123', collection: 'events', title: 'Order created', score: 0.95 }],
        pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
        query: { q: 'order', collections: ['events'] },
        duration: 25,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.searchCollection('events', 'order')

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('q=order')
      expect(callUrl).toContain('collections=events')
      expect(result.results[0].collection).toBe('events')
    })

    test('searches collection with additional options', async () => {
      const mockResponse: SearchResponse = {
        results: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        query: { q: 'order', collections: ['events'] },
        duration: 20,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await service.searchCollection('events', 'order', {
        limit: 20,
        sort: 'date',
      })

      const callUrl = mockFetch.mock.calls[0][0]
      expect(callUrl).toContain('limit=20')
      expect(callUrl).toContain('sort=date')
    })
  })

  describe('hasResults()', () => {
    test('returns true when results found', async () => {
      const mockResponse: SearchResponse = {
        results: [{ id: 'evt_123', collection: 'events', title: 'Order', score: 0.95 }],
        pagination: { page: 1, limit: 1, total: 100, totalPages: 100 },
        query: { q: 'order' },
        duration: 15,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.hasResults('order')

      expect(result).toBe(true)
    })

    test('returns false when no results found', async () => {
      const mockResponse: SearchResponse = {
        results: [],
        pagination: { page: 1, limit: 1, total: 0, totalPages: 0 },
        query: { q: 'nonexistent' },
        duration: 10,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.hasResults('nonexistent')

      expect(result).toBe(false)
    })
  })

  describe('findFirst()', () => {
    test('returns first search result', async () => {
      const mockResult: SearchResult = {
        id: 'evt_123',
        collection: 'events',
        title: 'Order created',
        score: 0.95,
      }

      const mockResponse: SearchResponse = {
        results: [mockResult],
        pagination: { page: 1, limit: 1, total: 100, totalPages: 100 },
        query: { q: 'order' },
        duration: 15,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.findFirst('order')

      expect(result).toEqual(mockResult)
      expect(result?.id).toBe('evt_123')
    })

    test('returns null when no results', async () => {
      const mockResponse: SearchResponse = {
        results: [],
        pagination: { page: 1, limit: 1, total: 0, totalPages: 0 },
        query: { q: 'nonexistent' },
        duration: 10,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.findFirst('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('count()', () => {
    test('returns total result count', async () => {
      const mockResponse: SearchResponse = {
        results: [],
        pagination: { page: 1, limit: 1, total: 250, totalPages: 250 },
        query: { q: 'order' },
        duration: 15,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.count('order')

      expect(result).toBe(250)
    })

    test('returns 0 when no results', async () => {
      const mockResponse: SearchResponse = {
        results: [],
        pagination: { page: 1, limit: 1, total: 0, totalPages: 0 },
        query: { q: 'nonexistent' },
        duration: 10,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.count('nonexistent')

      expect(result).toBe(0)
    })
  })

  describe('createSearchService', () => {
    test('creates service instance with factory function', () => {
      const factoryService = createSearchService('https://test.do', 'test-key')
      expect(factoryService).toBeInstanceOf(SearchService)
    })
  })
})
