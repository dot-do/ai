/**
 * Base types for tech.org.ai
 *
 * Provides foundational interfaces for linked data and semantic triples
 */

/**
 * Thing - Base type for all entities (from schema.org.ai pattern)
 */
export interface Thing {
  $context?: string | Record<string, any>
  $type: string | string[]
  $id?: string
  name?: string
  description?: string
  url?: string
  [key: string]: any
}

/**
 * Reference to another entity (semantic relationship)
 */
export interface Ref {
  $id: string
  $type: string
}
