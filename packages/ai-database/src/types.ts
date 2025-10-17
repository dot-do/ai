import { z } from 'zod'

/**
 * Schema.org Thing interface (simplified)
 * Full types available from 'schema.org.ai' package
 */
export interface Thing {
  '@type'?: string
  '@id'?: string
  identifier?: string
  name?: string
  description?: string
  url?: string
  image?: string
  [key: string]: unknown
}

/**
 * Semantic triple: $.Subject.predicate.Object
 */
export interface Triple {
  /** Subject (Thing) */
  subject: Thing
  /** Predicate (relationship name) */
  predicate: string
  /** Object (Thing) */
  object: Thing
  /** Metadata */
  metadata?: {
    createdAt: string
    createdBy?: string
    source?: string
    confidence?: number
  }
}

/**
 * Database query options
 */
export interface QueryOptions {
  /** Limit results */
  limit?: number
  /** Offset for pagination */
  offset?: number
  /** Sort field */
  sortBy?: string
  /** Sort direction */
  sortOrder?: 'asc' | 'desc'
  /** Include related entities */
  include?: string[]
  /** Filter conditions */
  where?: Record<string, unknown>
}

/**
 * Database query result
 */
export interface QueryResult<T = Thing> {
  /** Result items */
  items: T[]
  /** Total count (before pagination) */
  total: number
  /** Query limit */
  limit: number
  /** Query offset */
  offset: number
  /** Cursor for next page */
  nextCursor?: string
}

/**
 * Create operation input
 */
export interface CreateInput<T extends Thing = Thing> {
  /** Entity type */
  type: string
  /** Entity data */
  data: Partial<T>
  /** Relationships to create */
  relate?: Array<{
    predicate: string
    object: string | Thing
  }>
}

/**
 * Update operation input
 */
export interface UpdateInput<T extends Thing = Thing> {
  /** Entity ID */
  id: string
  /** Updated data */
  data: Partial<T>
  /** Relationships to add */
  addRelations?: Array<{
    predicate: string
    object: string | Thing
  }>
  /** Relationships to remove */
  removeRelations?: Array<{
    predicate: string
    object: string | Thing
  }>
}

/**
 * Delete operation options
 */
export interface DeleteOptions {
  /** Also delete relationships */
  cascade?: boolean
  /** Soft delete (mark as deleted) */
  soft?: boolean
}

/**
 * Relationship query
 */
export interface RelationshipQuery {
  /** Subject ID or Thing */
  subject?: string | Thing
  /** Predicate name */
  predicate?: string
  /** Object ID or Thing */
  object?: string | Thing
  /** Pagination */
  limit?: number
  offset?: number
}

/**
 * Relationship result
 */
export interface RelationshipResult {
  /** Matching triples */
  triples: Triple[]
  /** Total count */
  total: number
  /** Query limit */
  limit: number
  /** Query offset */
  offset: number
}

/**
 * Batch operation
 */
export interface BatchOperation {
  /** Operation type */
  type: 'create' | 'update' | 'delete' | 'relate'
  /** Operation data */
  data: unknown
}

/**
 * Batch operation result
 */
export interface BatchResult {
  /** Success status */
  success: boolean
  /** Results for each operation */
  results: Array<{
    success: boolean
    data?: unknown
    error?: string
  }>
  /** Total operations */
  total: number
  /** Successful operations */
  succeeded: number
  /** Failed operations */
  failed: number
}

/**
 * Migration definition
 */
export interface Migration {
  /** Migration ID */
  id: string
  /** Migration name */
  name: string
  /** Migration description */
  description?: string
  /** Up SQL or function */
  up: string | (() => Promise<void>)
  /** Down SQL or function */
  down: string | (() => Promise<void>)
  /** Created timestamp */
  createdAt: string
}

/**
 * Migration status
 */
export interface MigrationStatus {
  /** Migration ID */
  id: string
  /** Applied status */
  applied: boolean
  /** Applied timestamp */
  appliedAt?: string
  /** Error if failed */
  error?: string
}

/**
 * Zod schemas for validation
 */
export const ThingSchema = z.object({
  '@type': z.string().optional(),
  '@id': z.string().optional(),
  identifier: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  image: z.string().url().optional(),
})

export const TripleSchema = z.object({
  subject: ThingSchema,
  predicate: z.string().min(1),
  object: ThingSchema,
  metadata: z
    .object({
      createdAt: z.string(),
      createdBy: z.string().optional(),
      source: z.string().optional(),
      confidence: z.number().min(0).max(1).optional(),
    })
    .optional(),
})

export const QueryOptionsSchema = z.object({
  limit: z.number().positive().optional(),
  offset: z.number().nonnegative().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  include: z.array(z.string()).optional(),
  where: z.record(z.string(), z.unknown()).optional(),
})

export const CreateInputSchema = z.object({
  type: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
  relate: z
    .array(
      z.object({
        predicate: z.string().min(1),
        object: z.union([z.string(), ThingSchema]),
      })
    )
    .optional(),
})

export const UpdateInputSchema = z.object({
  id: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
  addRelations: z
    .array(
      z.object({
        predicate: z.string().min(1),
        object: z.union([z.string(), ThingSchema]),
      })
    )
    .optional(),
  removeRelations: z
    .array(
      z.object({
        predicate: z.string().min(1),
        object: z.union([z.string(), ThingSchema]),
      })
    )
    .optional(),
})
