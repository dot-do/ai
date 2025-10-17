/**
 * Cache Service for SDK.do
 *
 * Provides methods for cache management, metrics, and invalidation.
 * Integrates with Cloudflare Cache API for HTTP caching.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Get cache metrics
 * const metrics = await $.cache.getMetrics()
 * console.log(`Hit rate: ${metrics.summary.hitRatePercent}%`)
 *
 * // Invalidate cache by pattern
 * await $.cache.invalidate('/v1/events/*')
 *
 * // Invalidate collection
 * await $.cache.invalidateCollection('events')
 * ```
 */

// ============================================================================
// TYPES - Layer 3 Integration (workers/cache)
// ============================================================================

export interface CacheSetOptions {
  /**
   * Time-to-live in seconds
   */
  ttl?: number

  /**
   * Cache tier (hot = KV, cold = D1, auto = automatic)
   */
  tier?: 'hot' | 'cold' | 'auto'

  /**
   * Metadata to store with value
   */
  metadata?: Record<string, any>
}

export interface CacheGetOptions {
  /**
   * Whether to promote cold→hot on access
   */
  promote?: boolean

  /**
   * Refresh TTL on access
   */
  refreshTTL?: boolean
}

export interface CacheEntry<T = any> {
  /**
   * Cache key
   */
  key: string

  /**
   * Cached value
   */
  value: T

  /**
   * TTL in seconds
   */
  ttl?: number

  /**
   * Cache tier
   */
  tier?: 'hot' | 'cold' | 'auto'

  /**
   * Metadata
   */
  metadata?: Record<string, any>
}

export interface CacheBatchSetOptions {
  /**
   * Entries to set
   */
  entries: CacheEntry[]
}

export interface CacheBatchGetOptions {
  /**
   * Keys to get
   */
  keys: string[]

  /**
   * Whether to promote cold→hot on access
   */
  promote?: boolean
}

export interface CacheBatchGetResult<T = any> {
  /**
   * Key-value map of results
   */
  entries: Map<string, T>

  /**
   * Keys that were not found
   */
  missing: string[]

  /**
   * Hit rate (0-1)
   */
  hitRate: number
}

export interface CacheWarmOptions {
  /**
   * Entries to warm
   */
  entries: CacheEntry[]

  /**
   * Target tier (hot or auto)
   */
  tier?: 'hot' | 'auto'
}

export interface CacheWarmResult {
  /**
   * Number of entries warmed
   */
  count: number

  /**
   * Successfully warmed keys
   */
  keys: string[]
}

export interface CacheStats {
  /**
   * Hot tier stats (KV)
   */
  hot: {
    /**
     * Number of keys
     */
    keyCount: number

    /**
     * Hit rate
     */
    hitRate?: number

    /**
     * Average TTL
     */
    avgTTL?: number
  }

  /**
   * Cold tier stats (D1)
   */
  cold: {
    /**
     * Number of keys
     */
    keyCount: number

    /**
     * Hit rate
     */
    hitRate?: number

    /**
     * Average TTL
     */
    avgTTL?: number
  }

  /**
   * Overall stats
   */
  overall: {
    /**
     * Total keys
     */
    totalKeys: number

    /**
     * Overall hit rate
     */
    hitRate: number

    /**
     * Promotion rate (cold→hot)
     */
    promotionRate?: number
  }
}

// ============================================================================
// TYPES - HTTP Cache (existing)
// ============================================================================

export interface CacheMetrics {
  hits: number
  misses: number
  hitRate: number
  lastReset: number
}

export interface CacheMetricsResponse {
  metrics: CacheMetrics
  summary: {
    totalRequests: number
    hitRatePercent: number
    uptimeSeconds: number
  }
  timestamp: string
}

export interface CacheCapabilities {
  cache: {
    name: string
    storage: string
    capabilities: string[]
    invalidation: {
      patterns: {
        description: string
        examples: string[]
      }
      collections: {
        description: string
        examples: string[]
      }
    }
  }
  endpoints: {
    metrics: string
    invalidate: string
    invalidateCollection: string
    reset: string
  }
}

export interface HTTPInvalidateResult {
  success: boolean
  invalidated: number
  pattern: string
  timestamp: string
}

export interface InvalidateCollectionResult {
  success: boolean
  invalidated: number
  collection: string
  patterns: string[]
  timestamp: string
}

export interface CacheKey {
  url: string
  path: string
  search: string
  method: string
}

export interface CacheKeysResponse {
  keys: CacheKey[]
  total: number
  limit: number
  truncated: boolean
  timestamp: string
}

export interface ClearResult {
  success: boolean
  cleared: number
  message: string
  timestamp: string
}

export interface ResetResult {
  success: boolean
  message: string
  timestamp: string
}

// ============================================================================
// CACHE SERVICE
// ============================================================================

export class CacheService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://api.do', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Get authorization headers for authenticated requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }

  // ============================================================================
  // LAYER 3 INTEGRATION METHODS (workers/cache)
  // ============================================================================

  /**
   * Get a cached value from multi-tier cache
   *
   * @param key - Cache key
   * @param options - Get options
   * @returns Cached value or null if not found
   *
   * @example
   * ```typescript
   * const user = await $.cache.get<User>('user:123', {
   *   promote: true, // Promote from cold to hot tier
   *   refreshTTL: true // Refresh TTL on access
   * })
   * if (user) {
   *   console.log(user.name)
   * }
   * ```
   */
  async get<T = any>(key: string, options: CacheGetOptions = {}): Promise<T | null> {
    const params = new URLSearchParams()
    if (options.promote !== undefined) params.set('promote', options.promote.toString())
    if (options.refreshTTL !== undefined) params.set('refreshTTL', options.refreshTTL.toString())

    const response = await fetch(`https://cache.do/get/${encodeURIComponent(key)}?${params}`, {
      headers: this.getHeaders(),
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get cache value: ${error}`)
    }

    const result = await response.json()
    return result.value as T
  }

  /**
   * Set a cached value in multi-tier cache
   *
   * @param key - Cache key
   * @param value - Value to cache
   * @param options - Set options
   *
   * @example
   * ```typescript
   * await $.cache.set('user:123', {
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * }, {
   *   ttl: 3600, // 1 hour
   *   tier: 'hot', // Store in hot tier (KV)
   *   metadata: { source: 'api' }
   * })
   * ```
   */
  async set<T = any>(key: string, value: T, options: CacheSetOptions = {}): Promise<void> {
    const response = await fetch(`https://cache.do/set`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        key,
        value,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to set cache value: ${error}`)
    }
  }

  /**
   * Delete a cached value
   *
   * @param key - Cache key
   * @returns True if deleted
   *
   * @example
   * ```typescript
   * await $.cache.delete('user:123')
   * ```
   */
  async delete(key: string): Promise<boolean> {
    const response = await fetch(`https://cache.do/delete/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (response.status === 404) {
      return false
    }

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to delete cache value: ${error}`)
    }

    return true
  }

  /**
   * Batch operations namespace for multi-tier cache
   */
  readonly batch = {
    /**
     * Get multiple cached values
     *
     * @param options - Batch get options
     * @returns Batch get result with entries and missing keys
     *
     * @example
     * ```typescript
     * const result = await $.cache.batch.get({
     *   keys: ['user:1', 'user:2', 'user:3'],
     *   promote: true
     * })
     *
     * result.entries.forEach((value, key) => {
     *   console.log(key, value)
     * })
     * console.log('Hit rate:', result.hitRate)
     * ```
     */
    get: async <T = any>(options: CacheBatchGetOptions): Promise<CacheBatchGetResult<T>> => {
      const response = await fetch(`https://cache.do/batch/get`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to batch get: ${error}`)
      }

      const result = await response.json()
      // Convert entries object to Map
      const entries = new Map<string, T>(Object.entries(result.entries))

      return {
        entries,
        missing: result.missing,
        hitRate: result.hitRate,
      }
    },

    /**
     * Set multiple cached values
     *
     * @param options - Batch set options
     *
     * @example
     * ```typescript
     * await $.cache.batch.set({
     *   entries: [
     *     { key: 'user:1', value: { name: 'Alice' }, ttl: 3600 },
     *     { key: 'user:2', value: { name: 'Bob' }, ttl: 3600 },
     *     { key: 'user:3', value: { name: 'Charlie' }, ttl: 3600 }
     *   ]
     * })
     * ```
     */
    set: async (options: CacheBatchSetOptions): Promise<void> => {
      const response = await fetch(`https://cache.do/batch/set`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to batch set: ${error}`)
      }
    },
  }

  /**
   * Invalidate cache entries by pattern (multi-tier)
   *
   * @param pattern - Pattern to match (supports * wildcard)
   * @returns Invalidation result with count
   *
   * @example
   * ```typescript
   * // Invalidate all user keys
   * const result = await $.cache.invalidatePattern('user:*')
   * console.log(`Invalidated ${result.count} keys`)
   *
   * // Invalidate specific prefix
   * await $.cache.invalidatePattern('session:123:*')
   * ```
   */
  async invalidatePattern(pattern: string): Promise<{ count: number; keys?: string[] }> {
    const response = await fetch(`https://cache.do/invalidate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ pattern }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to invalidate: ${error}`)
    }

    return response.json()
  }

  /**
   * Warm cache with entries (multi-tier)
   *
   * @param options - Warm options
   * @returns Warm result with count and keys
   *
   * @example
   * ```typescript
   * // Pre-warm frequently accessed data
   * const result = await $.cache.warm({
   *   entries: [
   *     { key: 'config:app', value: { theme: 'dark' }, ttl: 86400 },
   *     { key: 'config:features', value: { beta: true }, ttl: 86400 }
   *   ],
   *   tier: 'hot' // Warm into hot tier
   * })
   * console.log(`Warmed ${result.count} keys`)
   * ```
   */
  async warm(options: CacheWarmOptions): Promise<CacheWarmResult> {
    const response = await fetch(`https://cache.do/warm`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to warm cache: ${error}`)
    }

    return response.json()
  }

  /**
   * Get cache statistics (multi-tier)
   *
   * @returns Cache stats for hot, cold, and overall
   *
   * @example
   * ```typescript
   * const stats = await $.cache.stats()
   * console.log('Hot tier:', stats.hot.keyCount, 'keys')
   * console.log('Cold tier:', stats.cold.keyCount, 'keys')
   * console.log('Overall hit rate:', stats.overall.hitRate)
   * console.log('Promotion rate:', stats.overall.promotionRate)
   * ```
   */
  async stats(): Promise<CacheStats> {
    const response = await fetch(`https://cache.do/stats`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get cache stats: ${error}`)
    }

    return response.json()
  }

  // ============================================================================
  // HTTP CACHE METHODS (existing)
  // ============================================================================

  /**
   * Get cache system information and capabilities
   *
   * @returns Cache capabilities and endpoints
   *
   * @example
   * ```typescript
   * const capabilities = await $.cache.getCapabilities()
   * console.log(capabilities.cache.capabilities)
   * // ['HTTP caching with Cache-Control', 'ETag generation', ...]
   * ```
   */
  async getCapabilities(): Promise<CacheCapabilities> {
    const response = await fetch(`${this.baseUrl}/v1/cache`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get cache capabilities: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get cache metrics including hit rate and request counts
   *
   * @returns Cache metrics with summary statistics
   *
   * @example
   * ```typescript
   * const metrics = await $.cache.getMetrics()
   * console.log(`Hit rate: ${metrics.summary.hitRatePercent}%`)
   * console.log(`Total requests: ${metrics.summary.totalRequests}`)
   * console.log(`Uptime: ${metrics.summary.uptimeSeconds}s`)
   * ```
   */
  async getMetrics(): Promise<CacheMetricsResponse> {
    const response = await fetch(`${this.baseUrl}/v1/cache/metrics`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get cache metrics: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Invalidate cache entries by pattern
   *
   * @param pattern - Cache key pattern (supports wildcards)
   * @returns Invalidation result with count
   *
   * @example
   * ```typescript
   * // Invalidate all events
   * await $.cache.invalidate('/v1/events/*')
   *
   * // Invalidate specific search queries
   * await $.cache.invalidate('/v1/search?*order*')
   *
   * // Invalidate admin API
   * await $.cache.invalidate('/admin/api/events/*')
   * ```
   */
  async invalidate(pattern: string): Promise<InvalidateResult> {
    const response = await fetch(`${this.baseUrl}/v1/cache/invalidate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ pattern }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Cache invalidation failed: ${error}`)
    }

    return response.json()
  }

  /**
   * Invalidate all cache entries for a collection
   *
   * @param collection - Collection name to invalidate
   * @returns Invalidation result with patterns cleared
   *
   * @example
   * ```typescript
   * // Invalidate all event-related cache
   * await $.cache.invalidateCollection('events')
   *
   * // Invalidate media cache
   * await $.cache.invalidateCollection('media')
   * ```
   */
  async invalidateCollection(collection: string): Promise<InvalidateCollectionResult> {
    const response = await fetch(`${this.baseUrl}/v1/cache/invalidate/collection`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ collection }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Collection invalidation failed: ${error}`)
    }

    return response.json()
  }

  /**
   * Reset cache metrics (hits, misses, hit rate)
   *
   * @returns Reset confirmation
   *
   * @example
   * ```typescript
   * await $.cache.resetMetrics()
   * console.log('Cache metrics reset')
   * ```
   */
  async resetMetrics(): Promise<ResetResult> {
    const response = await fetch(`${this.baseUrl}/v1/cache/reset`, {
      method: 'POST',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Cache reset failed: ${error}`)
    }

    return response.json()
  }

  /**
   * Clear entire cache (WARNING: clears ALL cached responses)
   *
   * @returns Clear result with count
   *
   * @example
   * ```typescript
   * const result = await $.cache.clear()
   * console.log(`Cleared ${result.cleared} cache entries`)
   * ```
   */
  async clear(): Promise<ClearResult> {
    const response = await fetch(`${this.baseUrl}/v1/cache`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Cache clear failed: ${error}`)
    }

    return response.json()
  }

  /**
   * List all cache keys (for debugging)
   *
   * @param limit - Maximum keys to return (default: 100, max: 1000)
   * @returns List of cache keys
   *
   * @example
   * ```typescript
   * const { keys, total } = await $.cache.listKeys(50)
   * console.log(`Showing ${keys.length} of ${total} cache keys`)
   * keys.forEach(key => console.log(key.path))
   * ```
   */
  async listKeys(limit = 100): Promise<CacheKeysResponse> {
    const params = new URLSearchParams()
    params.set('limit', Math.min(limit, 1000).toString())

    const response = await fetch(`${this.baseUrl}/v1/cache/keys?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to list cache keys: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Helper method to get current hit rate percentage
   *
   * @returns Hit rate as percentage (0-100)
   *
   * @example
   * ```typescript
   * const hitRate = await $.cache.getHitRate()
   * console.log(`Cache hit rate: ${hitRate.toFixed(1)}%`)
   * ```
   */
  async getHitRate(): Promise<number> {
    const metrics = await this.getMetrics()
    return metrics.summary.hitRatePercent
  }

  /**
   * Helper method to check if cache is performing well
   *
   * @param threshold - Minimum acceptable hit rate percentage (default: 80)
   * @returns True if hit rate is above threshold
   *
   * @example
   * ```typescript
   * if (await $.cache.isHealthy()) {
   *   console.log('Cache is performing well')
   * } else {
   *   console.warn('Cache hit rate is low')
   * }
   * ```
   */
  async isHealthy(threshold = 80): Promise<boolean> {
    const hitRate = await this.getHitRate()
    return hitRate >= threshold
  }

  /**
   * Helper method to invalidate multiple patterns at once
   *
   * @param patterns - Array of cache key patterns
   * @returns Array of invalidation results
   *
   * @example
   * ```typescript
   * const results = await $.cache.invalidateMany([
   *   '/v1/events/*',
   *   '/v1/webhooks/*',
   *   '/v1/search?*'
   * ])
   * const total = results.reduce((sum, r) => sum + r.invalidated, 0)
   * console.log(`Invalidated ${total} cache entries`)
   * ```
   */
  async invalidateMany(patterns: string[]): Promise<InvalidateResult[]> {
    const promises = patterns.map((pattern) => this.invalidate(pattern))
    return Promise.all(promises)
  }

  /**
   * Helper method to warm up cache by prefetching URLs
   *
   * @param urls - Array of URLs to fetch and cache
   * @returns Number of URLs successfully cached
   *
   * @example
   * ```typescript
   * const warmed = await $.cache.warmup([
   *   'https://api.do/v1/events',
   *   'https://api.do/v1/media',
   *   'https://api.do/v1/users'
   * ])
   * console.log(`Warmed ${warmed} cache entries`)
   * ```
   */
  async warmup(urls: string[]): Promise<number> {
    let warmed = 0

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          headers: this.getHeaders(),
        })
        if (response.ok) {
          warmed++
        }
      } catch (error) {
        // Continue on error
        console.warn(`Failed to warm cache for ${url}:`, error)
      }
    }

    return warmed
  }
}

/**
 * Create cache service instance
 */
export function createCacheService(baseUrl?: string, apiKey?: string): CacheService {
  return new CacheService(baseUrl, apiKey)
}

/**
 * Default cache service instance
 */
export const cache = createCacheService()
