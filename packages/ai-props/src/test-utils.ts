import { vi } from 'vitest'

const responseCache = new Map<string, any>()

/**
 * Clear the response cache
 */
export function clearResponseCache(): void {
  responseCache.clear()
}

/**
 * Generate a cache key from function arguments
 * @param args Function arguments
 * @returns A string cache key
 */
export function generateCacheKey(...args: any[]): string {
  return JSON.stringify(args)
}

/**
 * Create a cached version of a function
 * @param fn The function to cache
 * @returns A cached function
 */
export function createCachedFunction<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return (async (...args: Parameters<T>) => {
    const key = generateCacheKey(...args)

    if (responseCache.has(key)) {
      return responseCache.get(key)
    }

    const result = await fn(...args)
    responseCache.set(key, result)
    return result
  }) as T
}

/**
 * Create a cached function spy
 * @param fn The function to spy on and cache
 * @returns A spy function with caching
 */
export function createCachedFunctionSpy<T extends (...args: any[]) => Promise<any>>(fn: T): T & { calls: any[][] } {
  const calls: any[][] = []
  const cachedFn = createCachedFunction(fn)

  const spy = (async (...args: Parameters<T>) => {
    calls.push([...args])
    return cachedFn(...args)
  }) as T & { calls: any[][] }

  spy.calls = calls
  return spy
}

/**
 * Default mock response for generateObject
 */
export const defaultMockResponse = {
  object: {
    title: 'Test Title',
    content: 'Test Content',
  },
}
