/**
 * Tests for Cache Service
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { CacheService, createCacheService } from './cache'
import type {
  CacheCapabilities,
  CacheMetricsResponse,
  InvalidateResult,
  InvalidateCollectionResult,
  ClearResult,
  ResetResult,
  CacheKeysResponse,
} from './cache'

describe('CacheService', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let service: CacheService

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    service = new CacheService('https://test.cache.do', 'test-api-key')
  })

  describe('constructor', () => {
    test('creates service with default baseUrl', () => {
      const defaultService = new CacheService()
      expect(defaultService).toBeInstanceOf(CacheService)
    })

    test('creates service with custom baseUrl and apiKey', () => {
      expect(service).toBeInstanceOf(CacheService)
    })
  })

  describe('getCapabilities()', () => {
    test('retrieves cache capabilities', async () => {
      const mockCapabilities: CacheCapabilities = {
        cache: {
          name: 'Cloudflare Cache API',
          storage: 'edge',
          capabilities: ['HTTP caching with Cache-Control', 'ETag generation'],
          invalidation: {
            patterns: {
              description: 'Invalidate by URL pattern',
              examples: ['/v1/events/*', '/admin/api/*'],
            },
            collections: {
              description: 'Invalidate by collection name',
              examples: ['events', 'media'],
            },
          },
        },
        endpoints: {
          metrics: '/v1/cache/metrics',
          invalidate: '/v1/cache/invalidate',
          invalidateCollection: '/v1/cache/invalidate/collection',
          reset: '/v1/cache/reset',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCapabilities,
      })

      const result = await service.getCapabilities()

      expect(mockFetch).toHaveBeenCalledWith('https://test.cache.do/v1/cache', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result.cache.name).toBe('Cloudflare Cache API')
      expect(result.endpoints.metrics).toBe('/v1/cache/metrics')
    })
  })

  describe('getMetrics()', () => {
    test('retrieves cache metrics', async () => {
      const mockMetrics: CacheMetricsResponse = {
        metrics: {
          hits: 1000,
          misses: 200,
          hitRate: 0.833,
          lastReset: Date.now(),
        },
        summary: {
          totalRequests: 1200,
          hitRatePercent: 83.3,
          uptimeSeconds: 3600,
        },
        timestamp: '2025-10-11T16:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetrics,
      })

      const result = await service.getMetrics()

      expect(result.metrics.hits).toBe(1000)
      expect(result.metrics.misses).toBe(200)
      expect(result.summary.hitRatePercent).toBeCloseTo(83.3)
      expect(result.summary.totalRequests).toBe(1200)
    })
  })

  describe('invalidate()', () => {
    test('invalidates cache by pattern', async () => {
      const mockResult: InvalidateResult = {
        success: true,
        pattern: '/api/*',
        invalidated: 42,
        timestamp: '2025-10-11T16:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await service.invalidate('/api/*')

      expect(mockFetch).toHaveBeenCalledWith('https://test.cache.do/v1/cache/invalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: JSON.stringify({ pattern: '/api/*' }),
      })

      expect(result.success).toBe(true)
      expect(result.invalidated).toBe(42)
    })

    test('throws error on invalidation failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Invalid pattern',
      })

      await expect(service.invalidate('invalid')).rejects.toThrow('Cache invalidation failed: Invalid pattern')
    })
  })

  describe('invalidateCollection()', () => {
    test('invalidates cache collection', async () => {
      const mockResult: InvalidateCollectionResult = {
        success: true,
        collection: 'users',
        invalidated: 150,
        patterns: ['/v1/users/*', '/admin/api/users/*'],
        timestamp: '2025-10-11T16:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await service.invalidateCollection('users')

      expect(result.success).toBe(true)
      expect(result.collection).toBe('users')
      expect(result.invalidated).toBe(150)
      expect(result.patterns).toHaveLength(2)
    })
  })

  describe('resetMetrics()', () => {
    test('resets cache metrics', async () => {
      const mockResult: ResetResult = {
        success: true,
        timestamp: '2025-10-11T16:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await service.resetMetrics()

      expect(result.success).toBe(true)
      expect(result.timestamp).toBeDefined()
    })
  })

  describe('clear()', () => {
    test('clears entire cache', async () => {
      const mockResult: ClearResult = {
        success: true,
        cleared: 500,
        message: 'Cache cleared successfully',
        timestamp: '2025-10-11T16:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await service.clear()

      expect(mockFetch).toHaveBeenCalledWith('https://test.cache.do/v1/cache', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result.success).toBe(true)
      expect(result.cleared).toBe(500)
    })
  })

  describe('listKeys()', () => {
    test('lists cache keys', async () => {
      const mockResponse: CacheKeysResponse = {
        keys: [
          { url: 'https://api.do/v1/events', path: '/v1/events', search: '', method: 'GET' },
          { url: 'https://api.do/v1/users', path: '/v1/users', search: '', method: 'GET' },
          { url: 'https://api.do/v1/media', path: '/v1/media', search: '', method: 'GET' },
        ],
        total: 3,
        limit: 100,
        truncated: false,
        timestamp: '2025-10-11T16:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.listKeys(100)

      expect(result.keys).toHaveLength(3)
      expect(result.total).toBe(3)
      expect(result.keys[0].path).toBe('/v1/events')
    })

    test('uses default limit', async () => {
      const mockResponse: CacheKeysResponse = {
        keys: [],
        total: 0,
        limit: 100,
        truncated: false,
        timestamp: '2025-10-11T16:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await service.listKeys()

      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('getHitRate()', () => {
    test('calculates hit rate', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: {
            hits: 800,
            misses: 200,
            hitRate: 0.8,
            lastReset: Date.now(),
          },
          summary: {
            totalRequests: 1000,
            hitRatePercent: 80,
            uptimeSeconds: 3600,
          },
          timestamp: '2025-10-11T16:00:00Z',
        }),
      })

      const hitRate = await service.getHitRate()

      expect(hitRate).toBe(80)
    })
  })

  describe('isHealthy()', () => {
    test('checks if cache is healthy with default threshold', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: {
            hits: 900,
            misses: 100,
            hitRate: 0.9,
            lastReset: Date.now(),
          },
          summary: {
            totalRequests: 1000,
            hitRatePercent: 90,
            uptimeSeconds: 3600,
          },
          timestamp: '2025-10-11T16:00:00Z',
        }),
      })

      const isHealthy = await service.isHealthy()

      expect(isHealthy).toBe(true)
    })

    test('checks if cache is healthy with custom threshold', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: {
            hits: 700,
            misses: 300,
            hitRate: 0.7,
            lastReset: Date.now(),
          },
          summary: {
            totalRequests: 1000,
            hitRatePercent: 70,
            uptimeSeconds: 3600,
          },
          timestamp: '2025-10-11T16:00:00Z',
        }),
      })

      const isHealthy = await service.isHealthy(75)

      expect(isHealthy).toBe(false)
    })
  })

  describe('invalidateMany()', () => {
    test('invalidates multiple patterns', async () => {
      const pattern1 = { success: true, pattern: '/api/*', invalidated: 10, timestamp: '2025-10-11T16:00:00Z' }
      const pattern2 = { success: true, pattern: '/images/*', invalidated: 20, timestamp: '2025-10-11T16:00:00Z' }

      // Mock two separate calls since invalidateMany calls invalidate() for each pattern
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => pattern1,
      })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => pattern2,
      })

      const results = await service.invalidateMany(['/api/*', '/images/*'])

      expect(results).toHaveLength(2)
      expect(results[0].invalidated).toBe(10)
      expect(results[1].invalidated).toBe(20)
    })
  })

  describe('warmup()', () => {
    test('warms up cache with URLs', async () => {
      // Mock 3 successful fetch calls for warming cache
      mockFetch.mockResolvedValueOnce({ ok: true })
      mockFetch.mockResolvedValueOnce({ ok: true })
      mockFetch.mockResolvedValueOnce({ ok: true })

      const count = await service.warmup(['https://example.com/page1', 'https://example.com/page2', 'https://example.com/page3'])

      expect(count).toBe(3)
    })
  })

  describe('createCacheService', () => {
    test('creates service instance with factory function', () => {
      const factoryService = createCacheService('https://test.do', 'test-key')
      expect(factoryService).toBeInstanceOf(CacheService)
    })
  })
})
