/**
 * Cleanup Helpers
 *
 * Utility functions for cleaning up test resources.
 */

import type { DatabaseService } from '../../src/db'
import type { CacheService } from '../../src/cache'
import type { StorageService } from '../../src/storage'

/**
 * Delete all documents in a namespace
 */
export async function cleanupNamespace(db: DatabaseService, namespace: string): Promise<void> {
  try {
    const { documents } = await db.list(namespace, { limit: 1000 })
    for (const doc of documents) {
      await db.delete(namespace, doc.id, true) // Hard delete
    }
  } catch (error) {
    console.warn(`Failed to cleanup namespace ${namespace}:`, error)
  }
}

/**
 * Delete cache keys matching pattern
 */
export async function cleanupCachePattern(cache: CacheService, pattern: string): Promise<void> {
  try {
    await cache.invalidate(pattern)
  } catch (error) {
    console.warn(`Failed to cleanup cache pattern ${pattern}:`, error)
  }
}

/**
 * Delete storage keys with prefix
 */
export async function cleanupStoragePrefix(storage: StorageService, prefix: string): Promise<void> {
  try {
    const { objects } = await storage.list({ prefix, limit: 1000 })
    for (const obj of objects) {
      await storage.delete(obj.key)
    }
  } catch (error) {
    console.warn(`Failed to cleanup storage prefix ${prefix}:`, error)
  }
}

/**
 * Wait for operation to complete
 */
export async function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retry operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    factor?: number
  } = {}
): Promise<T> {
  const { maxRetries = 3, initialDelay = 100, maxDelay = 5000, factor = 2 } = options

  let lastError: Error | undefined
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < maxRetries) {
        await waitFor(delay)
        delay = Math.min(delay * factor, maxDelay)
      }
    }
  }

  throw lastError || new Error('Retry failed with unknown error')
}
