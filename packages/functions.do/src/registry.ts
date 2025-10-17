/**
 * Function Registry - Central registry for all functions
 *
 * Singleton registry that stores and manages function definitions
 */

import type { FunctionDefinition, RegistryEntry, FunctionType, FunctionStatus } from './types'

/**
 * Function Registry
 */
export class FunctionRegistry {
  private static instance: FunctionRegistry
  private functions = new Map<string, RegistryEntry>()

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance
   */
  static getInstance(): FunctionRegistry {
    if (!FunctionRegistry.instance) {
      FunctionRegistry.instance = new FunctionRegistry()
    }
    return FunctionRegistry.instance
  }

  /**
   * Register a function
   */
  register<TInput = any, TOutput = any>(func: FunctionDefinition<TInput, TOutput>): void {
    const entry: RegistryEntry<TInput, TOutput> = {
      function: func,
      registeredAt: new Date(),
      executions: 0,
      successes: 0,
      failures: 0,
      avgDuration: 0,
    }

    this.functions.set(func.id, entry)
  }

  /**
   * Unregister a function
   */
  unregister(id: string): boolean {
    return this.functions.delete(id)
  }

  /**
   * Get a function by ID
   */
  get<TInput = any, TOutput = any>(id: string): FunctionDefinition<TInput, TOutput> | undefined {
    const entry = this.functions.get(id)
    return entry?.function as FunctionDefinition<TInput, TOutput> | undefined
  }

  /**
   * Get registry entry (includes stats)
   */
  getEntry<TInput = any, TOutput = any>(id: string): RegistryEntry<TInput, TOutput> | undefined {
    return this.functions.get(id) as RegistryEntry<TInput, TOutput> | undefined
  }

  /**
   * Check if function exists
   */
  has(id: string): boolean {
    return this.functions.has(id)
  }

  /**
   * List all functions
   */
  list(filter?: { type?: FunctionType; status?: FunctionStatus; tags?: string[] }): FunctionDefinition[] {
    let functions = Array.from(this.functions.values()).map((entry) => entry.function)

    if (filter) {
      if (filter.type) {
        functions = functions.filter((f) => f.type === filter.type)
      }
      if (filter.status) {
        functions = functions.filter((f) => f.status === filter.status)
      }
      if (filter.tags) {
        functions = functions.filter((f) => filter.tags!.some((tag) => f.metadata.tags?.includes(tag)))
      }
    }

    return functions
  }

  /**
   * Update function status
   */
  updateStatus(id: string, status: FunctionStatus): void {
    const entry = this.functions.get(id)
    if (entry) {
      entry.function.status = status
    }
  }

  /**
   * Record execution stats
   */
  recordExecution(id: string, success: boolean, duration: number): void {
    const entry = this.functions.get(id)
    if (!entry) return

    entry.executions++
    if (success) {
      entry.successes++
    } else {
      entry.failures++
    }

    // Update average duration
    entry.avgDuration = (entry.avgDuration * (entry.executions - 1) + duration) / entry.executions

    entry.lastExecutedAt = new Date()
  }

  /**
   * Get function stats
   */
  getStats(id: string) {
    const entry = this.functions.get(id)
    if (!entry) return null

    return {
      executions: entry.executions,
      successes: entry.successes,
      failures: entry.failures,
      successRate: entry.executions > 0 ? entry.successes / entry.executions : 0,
      avgDuration: entry.avgDuration,
      lastExecutedAt: entry.lastExecutedAt,
    }
  }

  /**
   * Clear all functions (for testing)
   */
  clear(): void {
    this.functions.clear()
  }

  /**
   * Get total count
   */
  get count(): number {
    return this.functions.size
  }
}

/**
 * Get singleton registry instance
 */
export function getRegistry(): FunctionRegistry {
  return FunctionRegistry.getInstance()
}

/**
 * Register a function (convenience method)
 */
export function registerFunction<TInput = any, TOutput = any>(func: FunctionDefinition<TInput, TOutput>): void {
  getRegistry().register(func)
}

/**
 * Unregister a function (convenience method)
 */
export function unregisterFunction(id: string): boolean {
  return getRegistry().unregister(id)
}

/**
 * Get a function (convenience method)
 */
export function getFunction<TInput = any, TOutput = any>(id: string): FunctionDefinition<TInput, TOutput> | undefined {
  return getRegistry().get<TInput, TOutput>(id)
}

/**
 * List functions (convenience method)
 */
export function listFunctions(filter?: { type?: FunctionType; status?: FunctionStatus; tags?: string[] }): FunctionDefinition[] {
  return getRegistry().list(filter)
}
