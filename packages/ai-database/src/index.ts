/**
 * @dotdo/ai-database - Semantic database operations with $.Subject.predicate.Object patterns
 *
 * Provides open-source implementation of database.do SDK interface.
 * Enables semantic CRUD operations, relationship management, and graph queries.
 *
 * @packageDocumentation
 */

export * from './types.js'
export * from './crud.js'
export * from './relationships.js'
export * from './utils.js'

// Payload CMS integration (import from ai-database/payload)
// Export only the types from main package, users should import from 'ai-database/payload' for the implementations
export type {
  DatabaseMetadata,
  PayloadConfig,
  PayloadInitOptions,
  PayloadInstance,
  MetadataFetchOptions,
  MetadataFetchResult,
  PayloadEnv,
} from './payload/types.js'

// Re-export key functions for convenience
export { create, get, list, update, deleteEntity as delete, exists, count, batchCreate, batchUpdate, batchDelete } from './crud.js'

export {
  createRelationship,
  getRelationships,
  relationshipExists,
  deleteRelationships,
  getOutgoingRelationships,
  getIncomingRelationships,
  getRelated,
  getRelatedBy,
  batchCreateRelationships,
  countRelationships,
} from './relationships.js'

export { generateId, validateThing, extractId, normalizeType, isThing, cloneThing, mergeThings, areThingsEqual, getType, isType, formatThing } from './utils.js'

/**
 * Convenience namespace for semantic patterns
 *
 * @example
 * ```typescript
 * import { db } from '@dotdo/ai-database'
 *
 * // Create entity
 * const person = await db.create({
 *   type: 'Person',
 *   data: { name: 'John Doe' }
 * })
 *
 * // Create relationship: $.Person.worksFor.Organization
 * await db.relate(person, 'worksFor', organization)
 *
 * // Query
 * const people = await db.list('Person', { limit: 10 })
 * ```
 */
export const db = {
  // CRUD operations
  create,
  get,
  list,
  update,
  delete: deleteEntity,
  exists,
  count,

  // Batch operations
  batchCreate,
  batchUpdate,
  batchDelete,

  // Relationships (semantic triples)
  relate: createRelationship,
  getRelationships,
  relationshipExists,
  deleteRelationships,
  getOutgoing: getOutgoingRelationships,
  getIncoming: getIncomingRelationships,
  getRelated,
  getRelatedBy,
  batchRelate: batchCreateRelationships,
  countRelationships,

  // Utilities
  generateId,
  validateThing,
  extractId,
  normalizeType,
  isThing,
  cloneThing,
  mergeThings,
  areThingsEqual,
  getType,
  isType,
  formatThing,
}

// Named imports
import { create, get, list, update, deleteEntity, exists, count, batchCreate, batchUpdate, batchDelete } from './crud.js'

import {
  createRelationship,
  getRelationships,
  relationshipExists,
  deleteRelationships,
  getOutgoingRelationships,
  getIncomingRelationships,
  getRelated,
  getRelatedBy,
  batchCreateRelationships,
  countRelationships,
} from './relationships.js'

import { generateId, validateThing, extractId, normalizeType, isThing, cloneThing, mergeThings, areThingsEqual, getType, isType, formatThing } from './utils.js'
