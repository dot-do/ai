/**
 * Cache Service E2E Tests
 *
 * Comprehensive end-to-end tests for the multi-tier cache service (workers/cache).
 * Tests cover KV hot tier, D1 cold tier, TTL expiration, batch operations,
 * pattern invalidation, and cache statistics.
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from '../runner'
import { getTimeout } from '../config'

describe('Cache Service E2E Tests', () => {
  let runner: E2ETestRunner

  beforeEach(() => {
    runner = new E2ETestRunner('cache')
  })

  afterEach(async () => {
    await runner.teardown()
  })

  test(
    'should set and get values from cache',
    async () => {
      const key = runner.createCacheKey('user')
      const sdk = runner.getSDK()

      // Set a value
      await sdk.cache.set(key, { name: 'John Doe', age: 30 }, { ttl: 3600 })

      // Get the value back
      const value = await sdk.cache.get<{ name: string; age: number }>(key)

      expect(value).toBeDefined()
      expect(value?.name).toBe('John Doe')
      expect(value?.age).toBe(30)
    },
    getTimeout()
  )

  test(
    'should return null for non-existent keys',
    async () => {
      const key = runner.createCacheKey('non-existent')
      const sdk = runner.getSDK()

      const value = await sdk.cache.get(key)

      expect(value).toBeNull()
    },
    getTimeout()
  )

  test(
    'should delete cached values',
    async () => {
      const key = runner.createCacheKey('delete-test')
      const sdk = runner.getSDK()

      // Set a value
      await sdk.cache.set(key, { data: 'test' })

      // Verify it exists
      const value = await sdk.cache.get(key)
      expect(value).toBeDefined()

      // Delete it
      const deleted = await sdk.cache.delete(key)
      expect(deleted).toBe(true)

      // Verify it's gone
      const afterDelete = await sdk.cache.get(key)
      expect(afterDelete).toBeNull()
    },
    getTimeout()
  )

  test(
    'should handle TTL expiration',
    async () => {
      const key = runner.createCacheKey('ttl-test')
      const sdk = runner.getSDK()

      // Set with short TTL (2 seconds)
      await sdk.cache.set(key, { data: 'expires-soon' }, { ttl: 2 })

      // Should exist immediately
      const immediate = await sdk.cache.get(key)
      expect(immediate).toBeDefined()

      // Wait for expiration
      await runner.wait(3000)

      // Should be expired
      const expired = await sdk.cache.get(key)
      expect(expired).toBeNull()
    },
    getTimeout()
  )

  test(
    'should perform batch get operations',
    async () => {
      const sdk = runner.getSDK()

      // Create multiple keys
      const key1 = runner.createCacheKey('batch-1')
      const key2 = runner.createCacheKey('batch-2')
      const key3 = runner.createCacheKey('batch-3')
      const key4 = runner.createCacheKey('batch-4-missing')

      // Set some values
      await sdk.cache.set(key1, { id: 1, name: 'Item 1' })
      await sdk.cache.set(key2, { id: 2, name: 'Item 2' })
      await sdk.cache.set(key3, { id: 3, name: 'Item 3' })

      // Batch get (including one missing key)
      const result = await sdk.cache.batch.get({
        keys: [key1, key2, key3, key4],
        promote: true,
      })

      expect(result.entries.size).toBe(3)
      expect(result.entries.get(key1)).toEqual({ id: 1, name: 'Item 1' })
      expect(result.entries.get(key2)).toEqual({ id: 2, name: 'Item 2' })
      expect(result.entries.get(key3)).toEqual({ id: 3, name: 'Item 3' })

      expect(result.missing).toContain(key4)
      expect(result.hitRate).toBeCloseTo(0.75) // 3/4 = 75%
    },
    getTimeout()
  )

  test(
    'should perform batch set operations',
    async () => {
      const sdk = runner.getSDK()

      const key1 = runner.createCacheKey('batch-set-1')
      const key2 = runner.createCacheKey('batch-set-2')
      const key3 = runner.createCacheKey('batch-set-3')

      // Batch set
      await sdk.cache.batch.set({
        entries: [
          { key: key1, value: { data: 'value1' }, ttl: 3600 },
          { key: key2, value: { data: 'value2' }, ttl: 3600 },
          { key: key3, value: { data: 'value3' }, ttl: 3600 },
        ],
      })

      // Verify all values were set
      const value1 = await sdk.cache.get(key1)
      const value2 = await sdk.cache.get(key2)
      const value3 = await sdk.cache.get(key3)

      expect(value1).toEqual({ data: 'value1' })
      expect(value2).toEqual({ data: 'value2' })
      expect(value3).toEqual({ data: 'value3' })
    },
    getTimeout()
  )

  test(
    'should invalidate cache by pattern',
    async () => {
      const sdk = runner.getSDK()

      // Create keys with common prefix
      const prefix = `user_${runner.testId}`
      const key1 = `${prefix}:1`
      const key2 = `${prefix}:2`
      const key3 = `${prefix}:3`
      const otherKey = runner.createCacheKey('other')

      // Register cleanup for these keys
      runner.registerCleanup(async () => {
        await sdk.cache.delete(key1).catch(() => {})
        await sdk.cache.delete(key2).catch(() => {})
        await sdk.cache.delete(key3).catch(() => {})
      })

      // Set values
      await sdk.cache.set(key1, { id: 1 })
      await sdk.cache.set(key2, { id: 2 })
      await sdk.cache.set(key3, { id: 3 })
      await sdk.cache.set(otherKey, { id: 999 })

      // Invalidate by pattern
      const result = await sdk.cache.invalidatePattern(`${prefix}:*`)

      expect(result.count).toBeGreaterThanOrEqual(3)

      // Verify invalidated keys are gone
      const after1 = await sdk.cache.get(key1)
      const after2 = await sdk.cache.get(key2)
      const after3 = await sdk.cache.get(key3)

      expect(after1).toBeNull()
      expect(after2).toBeNull()
      expect(after3).toBeNull()

      // Other key should still exist
      const otherValue = await sdk.cache.get(otherKey)
      expect(otherValue).toEqual({ id: 999 })
    },
    getTimeout()
  )

  test(
    'should get cache statistics',
    async () => {
      const sdk = runner.getSDK()

      // Create some cache entries
      const key1 = runner.createCacheKey('stats-1')
      const key2 = runner.createCacheKey('stats-2')

      await sdk.cache.set(key1, { data: 'test1' }, { tier: 'hot' })
      await sdk.cache.set(key2, { data: 'test2' }, { tier: 'cold' })

      // Get stats
      const stats = await sdk.cache.stats()

      expect(stats).toBeDefined()
      expect(stats.hot).toBeDefined()
      expect(stats.cold).toBeDefined()
      expect(stats.overall).toBeDefined()

      expect(typeof stats.hot.keyCount).toBe('number')
      expect(typeof stats.cold.keyCount).toBe('number')
      expect(typeof stats.overall.totalKeys).toBe('number')
      expect(typeof stats.overall.hitRate).toBe('number')

      expect(stats.overall.hitRate).toBeGreaterThanOrEqual(0)
      expect(stats.overall.hitRate).toBeLessThanOrEqual(1)
    },
    getTimeout()
  )

  test(
    'should support namespaced caching',
    async () => {
      const sdk = runner.getSDK()

      const namespace = await runner.createNamespace('cache-ns')

      const key1 = `${namespace}:item:1`
      const key2 = `${namespace}:item:2`

      // Register cleanup
      runner.registerCleanup(async () => {
        await sdk.cache.delete(key1).catch(() => {})
        await sdk.cache.delete(key2).catch(() => {})
      })

      await sdk.cache.set(key1, { value: 'one' })
      await sdk.cache.set(key2, { value: 'two' })

      const value1 = await sdk.cache.get(key1)
      const value2 = await sdk.cache.get(key2)

      expect(value1).toEqual({ value: 'one' })
      expect(value2).toEqual({ value: 'two' })

      // Invalidate namespace
      await sdk.cache.invalidatePattern(`${namespace}:*`)

      const after1 = await sdk.cache.get(key1)
      const after2 = await sdk.cache.get(key2)

      expect(after1).toBeNull()
      expect(after2).toBeNull()
    },
    getTimeout()
  )

  test(
    'should handle different data types',
    async () => {
      const sdk = runner.getSDK()

      // String
      const stringKey = runner.createCacheKey('string')
      await sdk.cache.set(stringKey, 'hello world')
      const stringValue = await sdk.cache.get<string>(stringKey)
      expect(stringValue).toBe('hello world')

      // Number
      const numberKey = runner.createCacheKey('number')
      await sdk.cache.set(numberKey, 42)
      const numberValue = await sdk.cache.get<number>(numberKey)
      expect(numberValue).toBe(42)

      // Boolean
      const boolKey = runner.createCacheKey('bool')
      await sdk.cache.set(boolKey, true)
      const boolValue = await sdk.cache.get<boolean>(boolKey)
      expect(boolValue).toBe(true)

      // Array
      const arrayKey = runner.createCacheKey('array')
      await sdk.cache.set(arrayKey, [1, 2, 3, 4, 5])
      const arrayValue = await sdk.cache.get<number[]>(arrayKey)
      expect(arrayValue).toEqual([1, 2, 3, 4, 5])

      // Object
      const objectKey = runner.createCacheKey('object')
      const complexObj = {
        id: 1,
        name: 'Test',
        tags: ['a', 'b', 'c'],
        metadata: { created: '2025-01-01', author: 'John' },
      }
      await sdk.cache.set(objectKey, complexObj)
      const objectValue = await sdk.cache.get(objectKey)
      expect(objectValue).toEqual(complexObj)

      // Null value
      const nullKey = runner.createCacheKey('null')
      await sdk.cache.set(nullKey, null)
      const nullValue = await sdk.cache.get(nullKey)
      expect(nullValue).toBe(null)
    },
    getTimeout()
  )

  test(
    'should warm cache with multiple entries',
    async () => {
      const sdk = runner.getSDK()

      const key1 = runner.createCacheKey('warm-1')
      const key2 = runner.createCacheKey('warm-2')
      const key3 = runner.createCacheKey('warm-3')

      // Warm cache
      const result = await sdk.cache.warm({
        entries: [
          { key: key1, value: { id: 1 }, ttl: 3600 },
          { key: key2, value: { id: 2 }, ttl: 3600 },
          { key: key3, value: { id: 3 }, ttl: 3600 },
        ],
        tier: 'hot',
      })

      expect(result.count).toBe(3)
      expect(result.keys).toContain(key1)
      expect(result.keys).toContain(key2)
      expect(result.keys).toContain(key3)

      // Verify entries exist
      const value1 = await sdk.cache.get(key1)
      const value2 = await sdk.cache.get(key2)
      const value3 = await sdk.cache.get(key3)

      expect(value1).toEqual({ id: 1 })
      expect(value2).toEqual({ id: 2 })
      expect(value3).toEqual({ id: 3 })
    },
    getTimeout()
  )

  test(
    'should handle cache tier options',
    async () => {
      const sdk = runner.getSDK()

      const hotKey = runner.createCacheKey('hot-tier')
      const coldKey = runner.createCacheKey('cold-tier')
      const autoKey = runner.createCacheKey('auto-tier')

      // Set with specific tiers
      await sdk.cache.set(hotKey, { data: 'hot' }, { tier: 'hot', ttl: 3600 })
      await sdk.cache.set(coldKey, { data: 'cold' }, { tier: 'cold', ttl: 86400 })
      await sdk.cache.set(autoKey, { data: 'auto' }, { tier: 'auto', ttl: 7200 })

      // Retrieve values
      const hotValue = await sdk.cache.get(hotKey)
      const coldValue = await sdk.cache.get(coldKey, { promote: true })
      const autoValue = await sdk.cache.get(autoKey)

      expect(hotValue).toEqual({ data: 'hot' })
      expect(coldValue).toEqual({ data: 'cold' })
      expect(autoValue).toEqual({ data: 'auto' })
    },
    getTimeout()
  )

  test(
    'should handle cache with metadata',
    async () => {
      const sdk = runner.getSDK()

      const key = runner.createCacheKey('with-metadata')

      await sdk.cache.set(
        key,
        { content: 'test data' },
        {
          ttl: 3600,
          metadata: {
            source: 'api',
            version: '1.0',
            author: 'test-suite',
          },
        }
      )

      const value = await sdk.cache.get(key)
      expect(value).toEqual({ content: 'test data' })

      // Note: Metadata retrieval would require a separate metadata endpoint
      // which may or may not be implemented in the cache service
    },
    getTimeout()
  )

  test(
    'should handle large cache keys',
    async () => {
      const sdk = runner.getSDK()

      // Create a long key
      const longKey = runner.createCacheKey('long-' + 'x'.repeat(200))

      await sdk.cache.set(longKey, { data: 'long key test' })

      const value = await sdk.cache.get(longKey)
      expect(value).toEqual({ data: 'long key test' })
    },
    getTimeout()
  )

  test(
    'should handle error when deleting non-existent key',
    async () => {
      const sdk = runner.getSDK()

      const key = runner.createCacheKey('never-existed')

      // Delete returns false for non-existent keys
      const deleted = await sdk.cache.delete(key)
      expect(deleted).toBe(false)
    },
    getTimeout()
  )
})
