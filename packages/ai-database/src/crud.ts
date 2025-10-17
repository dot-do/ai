/**
 * CRUD operations - Create, Read, Update, Delete for semantic entities
 */

import type { Thing, CreateInput, UpdateInput, DeleteOptions, QueryOptions, QueryResult } from './types.js'
import { CreateInputSchema, UpdateInputSchema } from './types.js'
import { generateId, validateThing } from './utils.js'
import { createRelationship, deleteRelationships } from './relationships.js'

/**
 * In-memory entity store
 * In production, this would be backed by Postgres/Hyperdrive + Vectorize
 */
const entities = new Map<string, Thing>()

/**
 * Clear all entities from the in-memory store
 * Useful for testing
 *
 * @example
 * ```typescript
 * import { clearEntities } from '@dotdo/ai-database'
 *
 * // Clear all entities before tests
 * beforeEach(() => {
 *   clearEntities()
 * })
 * ```
 */
export function clearEntities(): void {
  entities.clear()
}

/**
 * Create a new entity
 *
 * @param input - Entity type, data, and optional relationships
 * @returns Created entity
 *
 * @example
 * ```typescript
 * import $ from 'graphdl'
 *
 * const person = await create({
 *   type: 'Person',
 *   data: {
 *     name: 'John Doe',
 *     email: 'john@example.com'
 *   },
 *   relate: [
 *     { predicate: 'worksFor', object: 'org-123' }
 *   ]
 * })
 * ```
 */
export async function create<T extends Thing = Thing>(input: CreateInput<T>): Promise<T> {
  // Validate input
  const validated = CreateInputSchema.parse(input)

  // Generate ID if not provided
  const id = (validated.data['@id'] as string | undefined) ?? (validated.data.identifier as string | undefined) ?? generateId(validated.type)

  // Create entity with type information
  const entity: Thing = {
    '@type': validated.type,
    '@id': id,
    identifier: id,
    ...validated.data,
  }

  // Validate entity
  await validateThing(entity)

  // Store entity
  entities.set(id, entity)

  // Create relationships if specified
  if (validated.relate) {
    for (const rel of validated.relate) {
      const objectId = typeof rel.object === 'string' ? rel.object : (rel.object['@id'] ?? rel.object.identifier)
      if (objectId) {
        await createRelationship(entity, rel.predicate, objectId)
      }
    }
  }

  return entity as T
}

/**
 * Get an entity by ID
 *
 * @param id - Entity identifier
 * @param options - Query options (include relationships, etc.)
 * @returns Entity or null if not found
 *
 * @example
 * ```typescript
 * const person = await get('person-123', {
 *   include: ['worksFor', 'knows']
 * })
 * ```
 */
export async function get<T extends Thing = Thing>(id: string, options?: QueryOptions): Promise<T | null> {
  const entity = entities.get(id)
  if (!entity) {
    return null
  }

  // Clone to avoid mutations
  let result = { ...entity }

  // Include relationships if requested
  if (options?.include && options.include.length > 0) {
    // In production, fetch related entities from database
    // For now, just return the entity
    result = { ...result }
  }

  return result as T
}

/**
 * List entities by type with optional filters
 *
 * @param type - Entity type (e.g., 'Person', 'Organization')
 * @param options - Query options (filters, pagination, sorting)
 * @returns Query result with entities and pagination
 *
 * @example
 * ```typescript
 * const results = await list('Person', {
 *   where: { role: 'engineer' },
 *   limit: 10,
 *   offset: 0,
 *   sortBy: 'name',
 *   sortOrder: 'asc'
 * })
 * ```
 */
export async function list<T extends Thing = Thing>(type: string, options?: QueryOptions): Promise<QueryResult<T>> {
  // Filter by type
  let items = Array.from(entities.values()).filter((entity) => entity['@type'] === type)

  // Apply where filters
  if (options?.where) {
    items = items.filter((entity) => {
      for (const [key, value] of Object.entries(options.where!)) {
        if (entity[key] !== value) {
          return false
        }
      }
      return true
    })
  }

  const total = items.length

  // Apply sorting
  if (options?.sortBy) {
    const sortField = options.sortBy
    const sortOrder = options.sortOrder ?? 'asc'
    items.sort((a, b) => {
      const aVal = a[sortField] as any
      const bVal = b[sortField] as any
      if (aVal === bVal) return 0

      // Type guard for comparable values
      const isComparable = (val: unknown): val is string | number | boolean => {
        return typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean'
      }

      // Handle null/undefined
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      // Only compare if both values are comparable types
      if (isComparable(aVal) && isComparable(bVal)) {
        const comparison = aVal < bVal ? -1 : 1
        return sortOrder === 'asc' ? comparison : -comparison
      }

      // For non-comparable types (objects, arrays, etc.), maintain original order
      // String() conversion would produce "[object Object]" which isn't meaningful
      return 0
    })
  }

  // Apply pagination
  const offset = options?.offset ?? 0
  const limit = options?.limit ?? 100
  items = items.slice(offset, offset + limit)

  return {
    items: items as T[],
    total,
    limit,
    offset,
  }
}

/**
 * Update an entity
 *
 * @param input - Entity ID, updated data, and relationship changes
 * @returns Updated entity or null if not found
 *
 * @example
 * ```typescript
 * const updated = await update({
 *   id: 'person-123',
 *   data: {
 *     name: 'Jane Doe',
 *     email: 'jane@example.com'
 *   },
 *   addRelations: [
 *     { predicate: 'knows', object: 'person-456' }
 *   ]
 * })
 * ```
 */
export async function update<T extends Thing = Thing>(input: UpdateInput<T>): Promise<T | null> {
  // Validate input
  const validated = UpdateInputSchema.parse(input)

  // Get existing entity
  const existing = entities.get(validated.id)
  if (!existing) {
    return null
  }

  // Merge updates
  const updated: Thing = {
    ...existing,
    ...validated.data,
    '@id': existing['@id'], // Preserve ID
    '@type': existing['@type'], // Preserve type
    identifier: existing.identifier, // Preserve identifier
  }

  // Validate updated entity
  await validateThing(updated)

  // Store updated entity
  entities.set(validated.id, updated)

  // Handle relationship changes
  if (validated.addRelations) {
    for (const rel of validated.addRelations) {
      const objectId = typeof rel.object === 'string' ? rel.object : (rel.object['@id'] ?? rel.object.identifier)
      if (objectId) {
        await createRelationship(updated, rel.predicate, objectId)
      }
    }
  }

  if (validated.removeRelations) {
    for (const rel of validated.removeRelations) {
      const objectId = typeof rel.object === 'string' ? rel.object : (rel.object['@id'] ?? rel.object.identifier)
      if (objectId) {
        await deleteRelationships({
          subject: updated,
          predicate: rel.predicate,
          object: objectId,
        })
      }
    }
  }

  return updated as T
}

/**
 * Delete an entity
 *
 * @param id - Entity identifier
 * @param options - Delete options (cascade, soft delete)
 * @returns True if deleted, false if not found
 *
 * @example
 * ```typescript
 * // Hard delete
 * await deleteEntity('person-123')
 *
 * // Cascade delete (also delete relationships)
 * await deleteEntity('person-123', { cascade: true })
 *
 * // Soft delete (mark as deleted)
 * await deleteEntity('person-123', { soft: true })
 * ```
 */
export async function deleteEntity(id: string, options?: DeleteOptions): Promise<boolean> {
  const entity = entities.get(id)
  if (!entity) {
    return false
  }

  // Soft delete - just mark as deleted
  if (options?.soft) {
    const deleted: Thing = {
      ...entity,
      deleted: true,
      deletedAt: new Date().toISOString(),
    }
    entities.set(id, deleted)
    return true
  }

  // Hard delete
  entities.delete(id)

  // Cascade delete relationships
  if (options?.cascade) {
    await deleteRelationships({ subject: entity })
    await deleteRelationships({ object: entity })
  }

  return true
}

/**
 * Check if an entity exists
 *
 * @param id - Entity identifier
 * @returns True if exists
 *
 * @example
 * ```typescript
 * if (await exists('person-123')) {
 *   console.log('Person exists')
 * }
 * ```
 */
export async function exists(id: string): Promise<boolean> {
  return entities.has(id)
}

/**
 * Count entities by type
 *
 * @param type - Entity type
 * @param options - Optional where filters
 * @returns Count of entities
 *
 * @example
 * ```typescript
 * const personCount = await count('Person')
 * const engineerCount = await count('Person', { where: { role: 'engineer' } })
 * ```
 */
export async function count(type: string, options?: Pick<QueryOptions, 'where'>): Promise<number> {
  let items = Array.from(entities.values()).filter((entity) => entity['@type'] === type)

  // Apply where filters
  if (options?.where) {
    items = items.filter((entity) => {
      for (const [key, value] of Object.entries(options.where!)) {
        if (entity[key] !== value) {
          return false
        }
      }
      return true
    })
  }

  return items.length
}

/**
 * Batch create entities
 *
 * @param inputs - Array of create inputs
 * @returns Array of created entities
 * @throws Will throw an error with details if all operations fail
 *
 * @example
 * ```typescript
 * const people = await batchCreate([
 *   { type: 'Person', data: { name: 'John' } },
 *   { type: 'Person', data: { name: 'Jane' } }
 * ])
 * ```
 */
export async function batchCreate<T extends Thing = Thing>(inputs: CreateInput<T>[]): Promise<T[]> {
  const results: T[] = []
  const errors: Array<{ index: number; error: unknown }> = []

  for (let i = 0; i < inputs.length; i++) {
    try {
      const entity = await create<T>(inputs[i])
      results.push(entity)
    } catch (error) {
      errors.push({ index: i, error })
      // Continue with next item
    }
  }

  // If all operations failed, throw an error
  if (results.length === 0 && errors.length > 0) {
    const firstError = errors[0].error
    const errorMsg = firstError instanceof Error ? firstError.message : String(firstError)
    throw new Error(`Batch create failed: ${errors.length} operations failed. First error: ${errorMsg}`)
  }

  return results
}

/**
 * Batch update entities
 *
 * @param inputs - Array of update inputs
 * @returns Array of updated entities (null for not found)
 * @throws Will throw an error with details if all operations fail
 *
 * @example
 * ```typescript
 * const updated = await batchUpdate([
 *   { id: 'person-1', data: { status: 'active' } },
 *   { id: 'person-2', data: { status: 'active' } }
 * ])
 * ```
 */
export async function batchUpdate<T extends Thing = Thing>(inputs: UpdateInput<T>[]): Promise<Array<T | null>> {
  const results: Array<T | null> = []
  const errors: Array<{ index: number; error: unknown }> = []

  for (let i = 0; i < inputs.length; i++) {
    try {
      const entity = await update<T>(inputs[i])
      results.push(entity)
    } catch (error) {
      errors.push({ index: i, error })
      results.push(null)
    }
  }

  // If all operations failed, throw an error
  if (results.every((r) => r === null) && errors.length > 0) {
    const firstError = errors[0].error
    const errorMsg = firstError instanceof Error ? firstError.message : String(firstError)
    throw new Error(`Batch update failed: ${errors.length} operations failed. First error: ${errorMsg}`)
  }

  return results
}

/**
 * Batch delete entities
 *
 * @param ids - Array of entity IDs
 * @param options - Delete options
 * @returns Array of success flags
 * @throws Will throw an error with details if all operations fail
 *
 * @example
 * ```typescript
 * const results = await batchDelete(['person-1', 'person-2'])
 * ```
 */
export async function batchDelete(ids: string[], options?: DeleteOptions): Promise<boolean[]> {
  const results: boolean[] = []
  const errors: Array<{ index: number; error: unknown }> = []

  for (let i = 0; i < ids.length; i++) {
    try {
      const success = await deleteEntity(ids[i], options)
      results.push(success)
    } catch (error) {
      errors.push({ index: i, error })
      results.push(false)
    }
  }

  // If all operations failed, throw an error
  if (results.every((r) => !r) && errors.length > 0) {
    const firstError = errors[0].error
    const errorMsg = firstError instanceof Error ? firstError.message : String(firstError)
    throw new Error(`Batch delete failed: ${errors.length} operations failed. First error: ${errorMsg}`)
  }

  return results
}
