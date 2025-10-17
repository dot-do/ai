/**
 * Function registry - Registration, versioning, and discovery
 */

import type { FunctionDefinition, FunctionRegistryEntry, FunctionSearchQuery, FunctionSearchResult, FunctionMetadata } from './types.js'
import { FunctionDefinitionSchema } from './types.js'
import { generateFunctionId, validateFunctionDefinition } from './utils.js'

/**
 * In-memory function registry
 * In production, this would be backed by a database (Postgres, D1, etc.)
 */
const registry = new Map<string, FunctionRegistryEntry>()

/**
 * Register a new function or update existing function
 *
 * @param definition - Function definition with metadata and source
 * @returns Function registry entry
 *
 * @example
 * ```typescript
 * const func = await registerFunction({
 *   metadata: {
 *     id: 'my-function',
 *     name: 'My Function',
 *     version: '1.0.0',
 *     createdAt: new Date().toISOString(),
 *     updatedAt: new Date().toISOString()
 *   },
 *   source: {
 *     code: 'export default (input) => input',
 *     language: 'typescript'
 *   }
 * })
 * ```
 */
export async function registerFunction(definition: FunctionDefinition): Promise<FunctionRegistryEntry> {
  // Validate function definition
  const validated = await validateFunctionDefinition(definition)

  // Check if function exists
  const existing = registry.get(validated.metadata.id)

  const entry: FunctionRegistryEntry = {
    definition: validated,
    status: existing?.status ?? 'draft',
    deployedAt: existing?.deployedAt,
    endpoint: existing?.endpoint,
  }

  // Store in registry
  registry.set(validated.metadata.id, entry)

  return entry
}

/**
 * Get a function by ID
 *
 * @param id - Function identifier
 * @returns Function registry entry or null
 *
 * @example
 * ```typescript
 * const func = await getFunction('my-function')
 * if (func) {
 *   console.log(func.definition.metadata.name)
 * }
 * ```
 */
export async function getFunction(id: string): Promise<FunctionRegistryEntry | null> {
  return registry.get(id) ?? null
}

/**
 * List all functions with optional filters
 *
 * @param filters - Optional search query filters
 * @returns Array of function registry entries
 *
 * @example
 * ```typescript
 * // Get all deployed functions
 * const deployed = await listFunctions({ status: 'deployed' })
 *
 * // Get functions by author
 * const myFunctions = await listFunctions({ author: 'john@example.com' })
 * ```
 */
export async function listFunctions(filters?: Partial<FunctionSearchQuery>): Promise<FunctionRegistryEntry[]> {
  let functions = Array.from(registry.values())

  // Apply filters
  if (filters?.status) {
    functions = functions.filter((f) => f.status === filters.status)
  }

  if (filters?.author) {
    functions = functions.filter((f) => f.definition.metadata.author === filters.author)
  }

  if (filters?.runtime) {
    functions = functions.filter((f) => f.definition.metadata.runtime === filters.runtime)
  }

  if (filters?.tags && filters.tags.length > 0) {
    functions = functions.filter((f) => {
      const funcTags = f.definition.metadata.tags ?? []
      return filters.tags!.some((tag) => funcTags.includes(tag))
    })
  }

  // Apply pagination
  const offset = filters?.offset ?? 0
  const limit = filters?.limit ?? 100

  return functions.slice(offset, offset + limit)
}

/**
 * Search functions by name, tags, or other criteria
 *
 * @param query - Search query with filters
 * @returns Search result with matching functions
 *
 * @example
 * ```typescript
 * const results = await searchFunctions({
 *   name: 'process',
 *   tags: ['data', 'transform'],
 *   limit: 10
 * })
 * ```
 */
export async function searchFunctions(query: FunctionSearchQuery): Promise<FunctionSearchResult> {
  let functions = Array.from(registry.values())

  // Search by name (case-insensitive partial match)
  if (query.name) {
    const searchName = query.name.toLowerCase()
    functions = functions.filter((f) => f.definition.metadata.name.toLowerCase().includes(searchName))
  }

  // Filter by tags
  if (query.tags && query.tags.length > 0) {
    functions = functions.filter((f) => {
      const funcTags = f.definition.metadata.tags ?? []
      return query.tags!.some((tag) => funcTags.includes(tag))
    })
  }

  // Filter by author
  if (query.author) {
    functions = functions.filter((f) => f.definition.metadata.author === query.author)
  }

  // Filter by runtime
  if (query.runtime) {
    functions = functions.filter((f) => f.definition.metadata.runtime === query.runtime)
  }

  // Filter by status
  if (query.status) {
    functions = functions.filter((f) => f.status === query.status)
  }

  const total = functions.length

  // Apply pagination
  const offset = query.offset ?? 0
  const limit = query.limit ?? 100
  functions = functions.slice(offset, offset + limit)

  return {
    functions,
    total,
    limit,
    offset,
  }
}

/**
 * Update function metadata
 *
 * @param id - Function identifier
 * @param updates - Partial metadata updates
 * @returns Updated function registry entry or null
 *
 * @example
 * ```typescript
 * await updateFunction('my-function', {
 *   description: 'Updated description',
 *   tags: ['new', 'tags']
 * })
 * ```
 */
export async function updateFunction(id: string, updates: Partial<FunctionMetadata>): Promise<FunctionRegistryEntry | null> {
  const existing = registry.get(id)
  if (!existing) {
    return null
  }

  // Merge updates
  const updated: FunctionRegistryEntry = {
    ...existing,
    definition: {
      ...existing.definition,
      metadata: {
        ...existing.definition.metadata,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    },
  }

  registry.set(id, updated)
  return updated
}

/**
 * Delete a function from the registry
 *
 * @param id - Function identifier
 * @returns True if deleted, false if not found
 *
 * @example
 * ```typescript
 * const deleted = await deleteFunction('my-function')
 * ```
 */
export async function deleteFunction(id: string): Promise<boolean> {
  return registry.delete(id)
}

/**
 * Deploy a function (mark as deployed with endpoint)
 *
 * @param id - Function identifier
 * @param endpoint - Deployment endpoint URL
 * @returns Updated function registry entry or null
 *
 * @example
 * ```typescript
 * await deployFunction('my-function', 'https://functions.do/my-function')
 * ```
 */
export async function deployFunction(id: string, endpoint: string): Promise<FunctionRegistryEntry | null> {
  const existing = registry.get(id)
  if (!existing) {
    return null
  }

  const deployed: FunctionRegistryEntry = {
    ...existing,
    status: 'deployed',
    deployedAt: new Date().toISOString(),
    endpoint,
  }

  registry.set(id, deployed)
  return deployed
}

/**
 * Archive a function (mark as archived, keeping it in registry but not searchable)
 *
 * @param id - Function identifier
 * @returns Updated function registry entry or null
 *
 * @example
 * ```typescript
 * await archiveFunction('my-function')
 * ```
 */
export async function archiveFunction(id: string): Promise<FunctionRegistryEntry | null> {
  const existing = registry.get(id)
  if (!existing) {
    return null
  }

  const archived: FunctionRegistryEntry = {
    ...existing,
    status: 'archived',
  }

  registry.set(id, archived)
  return archived
}
