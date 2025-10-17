/**
 * Relationship management - Semantic triples using $.Subject.predicate.Object patterns
 */

import type { Thing, Triple, RelationshipQuery, RelationshipResult } from './types.js'
import { TripleSchema } from './types.js'
import { get } from './crud.js'

/**
 * In-memory triple store
 * In production, this would be backed by a graph database or semantic triple store
 */
const triples = new Map<string, Triple>()

/**
 * Clear all triples from the in-memory store
 * Useful for testing
 *
 * @example
 * ```typescript
 * import { clearRelationships } from '@dotdo/ai-database'
 *
 * // Clear all relationships before tests
 * beforeEach(() => {
 *   clearRelationships()
 * })
 * ```
 */
export function clearRelationships(): void {
  triples.clear()
}

/**
 * Generate a unique triple ID
 */
function generateTripleId(subject: string, predicate: string, object: string): string {
  return `${subject}:${predicate}:${object}`
}

/**
 * Create a semantic relationship (triple)
 *
 * @param subject - Subject entity (Thing or ID)
 * @param predicate - Relationship name (e.g., 'worksFor', 'knows', 'owns')
 * @param object - Object entity (Thing or ID)
 * @param metadata - Optional metadata (timestamp, source, confidence)
 * @returns Created triple
 *
 * @example
 * ```typescript
 * import $ from 'graphdl'
 *
 * // Create: $.Person.worksFor.Organization
 * const triple = await createRelationship(
 *   person,
 *   'worksFor',
 *   organization
 * )
 *
 * // Or with IDs:
 * const triple = await createRelationship(
 *   'person-123',
 *   'worksFor',
 *   'org-456'
 * )
 * ```
 */
export async function createRelationship(subject: Thing | string, predicate: string, object: Thing | string, metadata?: Triple['metadata']): Promise<Triple> {
  // Resolve subject
  let subjectThing: Thing
  if (typeof subject === 'string') {
    const found = await get(subject)
    if (!found) {
      throw new Error(`Subject not found: ${subject}`)
    }
    subjectThing = found
  } else {
    subjectThing = subject
  }

  // Resolve object
  let objectThing: Thing
  if (typeof object === 'string') {
    const found = await get(object)
    if (!found) {
      throw new Error(`Object not found: ${object}`)
    }
    objectThing = found
  } else {
    objectThing = object
  }

  // Create triple
  const triple: Triple = {
    subject: subjectThing,
    predicate,
    object: objectThing,
    metadata: metadata ?? {
      createdAt: new Date().toISOString(),
    },
  }

  // Validate triple
  TripleSchema.parse(triple)

  // Generate ID and store
  const subjectId = subjectThing['@id'] ?? subjectThing.identifier ?? ''
  const objectId = objectThing['@id'] ?? objectThing.identifier ?? ''
  const tripleId = generateTripleId(subjectId, predicate, objectId)

  triples.set(tripleId, triple)

  return triple
}

/**
 * Get relationships matching query
 *
 * @param query - Relationship query (subject, predicate, object filters)
 * @returns Matching triples
 *
 * @example
 * ```typescript
 * // Get all relationships for a subject
 * const rels = await getRelationships({ subject: 'person-123' })
 *
 * // Get specific relationship type
 * const worksFor = await getRelationships({
 *   subject: 'person-123',
 *   predicate: 'worksFor'
 * })
 *
 * // Get all who work for an organization
 * const employees = await getRelationships({
 *   predicate: 'worksFor',
 *   object: 'org-456'
 * })
 * ```
 */
export async function getRelationships(query: RelationshipQuery): Promise<RelationshipResult> {
  let results = Array.from(triples.values())

  // Filter by subject
  if (query.subject) {
    const subjectId = typeof query.subject === 'string' ? query.subject : (query.subject['@id'] ?? query.subject.identifier)
    results = results.filter((triple) => {
      const id = triple.subject['@id'] ?? triple.subject.identifier
      return id === subjectId
    })
  }

  // Filter by predicate
  if (query.predicate) {
    results = results.filter((triple) => triple.predicate === query.predicate)
  }

  // Filter by object
  if (query.object) {
    const objectId = typeof query.object === 'string' ? query.object : (query.object['@id'] ?? query.object.identifier)
    results = results.filter((triple) => {
      const id = triple.object['@id'] ?? triple.object.identifier
      return id === objectId
    })
  }

  const total = results.length

  // Apply pagination
  const offset = query.offset ?? 0
  const limit = query.limit ?? 100
  results = results.slice(offset, offset + limit)

  return {
    triples: results,
    total,
    limit,
    offset,
  }
}

/**
 * Check if a relationship exists
 *
 * @param subject - Subject entity (Thing or ID)
 * @param predicate - Relationship name
 * @param object - Object entity (Thing or ID)
 * @returns True if relationship exists
 *
 * @example
 * ```typescript
 * if (await relationshipExists('person-123', 'worksFor', 'org-456')) {
 *   console.log('Person works for organization')
 * }
 * ```
 */
export async function relationshipExists(subject: Thing | string, predicate: string, object: Thing | string): Promise<boolean> {
  const subjectId = typeof subject === 'string' ? subject : (subject['@id'] ?? subject.identifier ?? '')
  const objectId = typeof object === 'string' ? object : (object['@id'] ?? object.identifier ?? '')
  const tripleId = generateTripleId(subjectId, predicate, objectId)
  return triples.has(tripleId)
}

/**
 * Delete relationships matching query
 *
 * @param query - Relationship query to match triples to delete
 * @returns Number of deleted triples
 *
 * @example
 * ```typescript
 * // Delete all relationships for a subject
 * await deleteRelationships({ subject: 'person-123' })
 *
 * // Delete specific relationship
 * await deleteRelationships({
 *   subject: 'person-123',
 *   predicate: 'worksFor',
 *   object: 'org-456'
 * })
 * ```
 */
export async function deleteRelationships(query: RelationshipQuery): Promise<number> {
  const matching = await getRelationships(query)
  let deleted = 0

  for (const triple of matching.triples) {
    const subjectId = triple.subject['@id'] ?? triple.subject.identifier ?? ''
    const objectId = triple.object['@id'] ?? triple.object.identifier ?? ''
    const tripleId = generateTripleId(subjectId, triple.predicate, objectId)

    if (triples.delete(tripleId)) {
      deleted++
    }
  }

  return deleted
}

/**
 * Get all outgoing relationships from a subject
 *
 * @param subject - Subject entity (Thing or ID)
 * @param predicate - Optional predicate filter
 * @returns Matching triples
 *
 * @example
 * ```typescript
 * // Get all relationships from person
 * const outgoing = await getOutgoingRelationships('person-123')
 *
 * // Get only 'knows' relationships
 * const knows = await getOutgoingRelationships('person-123', 'knows')
 * ```
 */
export async function getOutgoingRelationships(subject: Thing | string, predicate?: string): Promise<Triple[]> {
  const query: RelationshipQuery = { subject }
  if (predicate) {
    query.predicate = predicate
  }

  const result = await getRelationships(query)
  return result.triples
}

/**
 * Get all incoming relationships to an object
 *
 * @param object - Object entity (Thing or ID)
 * @param predicate - Optional predicate filter
 * @returns Matching triples
 *
 * @example
 * ```typescript
 * // Get all relationships to organization
 * const incoming = await getIncomingRelationships('org-456')
 *
 * // Get only 'worksFor' relationships
 * const employees = await getIncomingRelationships('org-456', 'worksFor')
 * ```
 */
export async function getIncomingRelationships(object: Thing | string, predicate?: string): Promise<Triple[]> {
  const query: RelationshipQuery = { object }
  if (predicate) {
    query.predicate = predicate
  }

  const result = await getRelationships(query)
  return result.triples
}

/**
 * Get related entities (follows relationships)
 *
 * @param subject - Subject entity (Thing or ID)
 * @param predicate - Relationship to follow
 * @returns Array of related entities
 *
 * @example
 * ```typescript
 * // Get all organizations person works for
 * const orgs = await getRelated('person-123', 'worksFor')
 *
 * // Get all people person knows
 * const connections = await getRelated('person-123', 'knows')
 * ```
 */
export async function getRelated<T extends Thing = Thing>(subject: Thing | string, predicate: string): Promise<T[]> {
  const relationships = await getOutgoingRelationships(subject, predicate)
  return relationships.map((triple) => triple.object as T)
}

/**
 * Get entities related by incoming relationships
 *
 * @param object - Object entity (Thing or ID)
 * @param predicate - Relationship to follow backwards
 * @returns Array of related entities
 *
 * @example
 * ```typescript
 * // Get all people who work for organization
 * const employees = await getRelatedBy('org-456', 'worksFor')
 *
 * // Get all people who know person
 * const knownBy = await getRelatedBy('person-123', 'knows')
 * ```
 */
export async function getRelatedBy<T extends Thing = Thing>(object: Thing | string, predicate: string): Promise<T[]> {
  const relationships = await getIncomingRelationships(object, predicate)
  return relationships.map((triple) => triple.subject as T)
}

/**
 * Batch create relationships
 *
 * @param relationships - Array of relationship definitions
 * @returns Array of created triples
 *
 * @example
 * ```typescript
 * const triples = await batchCreateRelationships([
 *   { subject: 'person-1', predicate: 'knows', object: 'person-2' },
 *   { subject: 'person-1', predicate: 'worksFor', object: 'org-1' }
 * ])
 * ```
 */
export async function batchCreateRelationships(
  relationships: Array<{
    subject: Thing | string
    predicate: string
    object: Thing | string
    metadata?: Triple['metadata']
  }>
): Promise<Triple[]> {
  const results: Triple[] = []
  const errors: Array<{ index: number; error: unknown }> = []

  for (let i = 0; i < relationships.length; i++) {
    try {
      const rel = relationships[i]
      const triple = await createRelationship(rel.subject, rel.predicate, rel.object, rel.metadata)
      results.push(triple)
    } catch (error) {
      errors.push({ index: i, error })
      // Continue with next relationship
    }
  }

  // If all operations failed, throw an error
  if (results.length === 0 && errors.length > 0) {
    const firstError = errors[0].error
    const errorMsg = firstError instanceof Error ? firstError.message : String(firstError)
    throw new Error(`Batch create relationships failed: ${errors.length} operations failed. First error: ${errorMsg}`)
  }

  return results
}

/**
 * Count relationships matching query
 *
 * @param query - Relationship query
 * @returns Count of matching triples
 *
 * @example
 * ```typescript
 * const relationshipCount = await countRelationships({
 *   subject: 'person-123',
 *   predicate: 'knows'
 * })
 * ```
 */
export async function countRelationships(query: RelationshipQuery): Promise<number> {
  const result = await getRelationships(query)
  return result.total
}
