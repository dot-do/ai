/**
 * Utility functions for database operations
 */

import type { Thing } from './types.js'
import { ThingSchema } from './types.js'

/**
 * Generate a unique entity ID
 *
 * @param type - Entity type (e.g., 'Person', 'Organization')
 * @returns Generated ID
 *
 * @example
 * ```typescript
 * const id = generateId('Person') // 'person-abc123def456'
 * ```
 */
export function generateId(type: string): string {
  const prefix = type.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 12)
  return `${prefix}-${timestamp}${random}`
}

/**
 * Validate a Thing entity
 *
 * @param thing - Entity to validate
 * @returns Validated entity
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * try {
 *   const validated = await validateThing(entity)
 * } catch (error) {
 *   console.error('Validation failed:', error)
 * }
 * ```
 */
export async function validateThing(thing: Thing): Promise<Thing> {
  try {
    return ThingSchema.parse(thing)
  } catch (error) {
    throw new Error(`Thing validation failed: ${error}`)
  }
}

/**
 * Extract ID from Thing
 *
 * @param thing - Entity or ID string
 * @returns Entity ID
 *
 * @example
 * ```typescript
 * const id = extractId(person) // 'person-123'
 * const id = extractId('person-123') // 'person-123'
 * ```
 */
export function extractId(thing: Thing | string): string {
  if (typeof thing === 'string') {
    return thing
  }
  return thing['@id'] ?? thing.identifier ?? ''
}

/**
 * Normalize type name to Schema.org format
 *
 * @param type - Type name (e.g., 'person', 'ORGANIZATION')
 * @returns Normalized type name (e.g., 'Person', 'Organization')
 *
 * @example
 * ```typescript
 * const type = normalizeType('person') // 'Person'
 * const type = normalizeType('ORGANIZATION') // 'Organization'
 * ```
 */
export function normalizeType(type: string): string {
  // Capitalize first letter, lowercase rest
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
}

/**
 * Check if value is a Thing
 *
 * @param value - Value to check
 * @returns True if value is a Thing
 *
 * @example
 * ```typescript
 * if (isThing(value)) {
 *   console.log('ID:', value['@id'])
 * }
 * ```
 */
export function isThing(value: unknown): value is Thing {
  return (
    typeof value === 'object' &&
    value !== null &&
    (('@type' in value && typeof value['@type'] === 'string') || ('@id' in value && typeof value['@id'] === 'string'))
  )
}

/**
 * Clone a Thing entity (deep copy)
 *
 * @param thing - Entity to clone
 * @returns Cloned entity
 *
 * @example
 * ```typescript
 * const copy = cloneThing(original)
 * copy.name = 'New Name' // Doesn't affect original
 * ```
 */
export function cloneThing<T extends Thing = Thing>(thing: T): T {
  return JSON.parse(JSON.stringify(thing)) as T
}

/**
 * Merge two Things (second overrides first)
 *
 * @param base - Base entity
 * @param updates - Updates to apply
 * @returns Merged entity
 *
 * @example
 * ```typescript
 * const merged = mergeThings(original, { name: 'New Name' })
 * ```
 */
export function mergeThings<T extends Thing = Thing>(base: T, updates: Partial<T>): T {
  return {
    ...base,
    ...updates,
    // Preserve key fields from base
    '@type': base['@type'],
    '@id': base['@id'],
    identifier: base.identifier,
  }
}

/**
 * Compare two Things for equality
 *
 * @param a - First entity
 * @param b - Second entity
 * @returns True if entities have same ID
 *
 * @example
 * ```typescript
 * if (areThingsEqual(person1, person2)) {
 *   console.log('Same person')
 * }
 * ```
 */
export function areThingsEqual(a: Thing | string, b: Thing | string): boolean {
  const idA = extractId(a)
  const idB = extractId(b)
  return idA === idB && idA !== ''
}

/**
 * Get type from Thing
 *
 * @param thing - Entity
 * @returns Entity type or 'Thing' if not specified
 *
 * @example
 * ```typescript
 * const type = getType(person) // 'Person'
 * ```
 */
export function getType(thing: Thing): string {
  return thing['@type'] ?? 'Thing'
}

/**
 * Check if Thing is of specified type
 *
 * @param thing - Entity to check
 * @param type - Type to check for
 * @returns True if entity is of specified type
 *
 * @example
 * ```typescript
 * if (isType(entity, 'Person')) {
 *   console.log('Entity is a Person')
 * }
 * ```
 */
export function isType(thing: Thing, type: string): boolean {
  return getType(thing) === type
}

/**
 * Format Thing for display
 *
 * @param thing - Entity to format
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * const display = formatThing(person)
 * // 'Person: John Doe (person-123)'
 * ```
 */
export function formatThing(thing: Thing): string {
  const type = getType(thing)
  const name = thing.name ?? thing.identifier ?? thing['@id'] ?? 'Unknown'
  const id = extractId(thing)
  return `${type}: ${name} (${id})`
}

/**
 * Calculate entity size in bytes
 *
 * @param thing - Entity
 * @returns Size in bytes
 *
 * @example
 * ```typescript
 * const size = calculateSize(person)
 * console.log(`Entity size: ${(size / 1024).toFixed(2)} KB`)
 * ```
 */
export function calculateSize(thing: Thing): number {
  return new TextEncoder().encode(JSON.stringify(thing)).length
}

/**
 * Sanitize entity data (remove null/undefined values)
 *
 * @param thing - Entity to sanitize
 * @returns Sanitized entity
 *
 * @example
 * ```typescript
 * const clean = sanitizeThing({
 *   name: 'John',
 *   email: null,
 *   phone: undefined
 * })
 * // { name: 'John' }
 * ```
 */
export function sanitizeThing<T extends Thing = Thing>(thing: T): T {
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(thing)) {
    if (value !== null && value !== undefined) {
      sanitized[key] = value
    }
  }

  return sanitized as T
}

/**
 * Extract metadata from Thing
 *
 * @param thing - Entity
 * @returns Metadata object
 *
 * @example
 * ```typescript
 * const meta = extractMetadata(entity)
 * console.log('Type:', meta.type)
 * console.log('ID:', meta.id)
 * ```
 */
export function extractMetadata(thing: Thing): {
  type: string
  id: string
  name?: string
  description?: string
  url?: string
} {
  return {
    type: getType(thing),
    id: extractId(thing),
    name: thing.name,
    description: thing.description,
    url: thing.url,
  }
}
