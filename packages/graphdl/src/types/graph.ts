/**
 * Semantic Graph Types
 */

/**
 * Triple representing Subject-Predicate-Object
 */
export interface Triple<S = any, P extends string = string, O = any> {
  subject: S
  predicate: P
  object: O
  context?: string
  metadata?: TripleMetadata
}

/**
 * Metadata about a triple
 */
export interface TripleMetadata {
  source?: string
  confidence?: number
  timestamp?: string
  provenance?: string
  [key: string]: any
}

/**
 * Graph node
 */
export interface Node {
  id: string
  type: string | string[]
  properties: Record<string, any>
}

/**
 * Graph edge
 */
export interface Edge {
  id?: string
  source: string
  target: string
  predicate: string
  properties?: Record<string, any>
}

/**
 * Semantic graph
 * Uses $ prefix for consistency with linked data
 */
export interface Graph {
  $context?: string | Record<string, any>
  nodes: Node[]
  edges: Edge[]
  metadata?: GraphMetadata
}

/**
 * Graph metadata
 */
export interface GraphMetadata {
  created?: string
  modified?: string
  source?: string
  description?: string
  [key: string]: any
}

/**
 * Query pattern for semantic graphs
 */
export interface QueryPattern {
  subject?: string | PatternConstraint
  predicate?: string | PatternConstraint
  object?: string | PatternConstraint
  context?: string
}

/**
 * Pattern constraint for queries
 */
export interface PatternConstraint {
  type?: string | string[]
  value?: any
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'matches'
  [key: string]: any
}

/**
 * Path pattern for graph traversal
 */
export interface PathPattern {
  start: string | PatternConstraint
  path: string[] // Array of predicates
  end?: string | PatternConstraint
  maxDepth?: number
}

/**
 * Query result
 */
export interface QueryResult<T = any> {
  results: T[]
  count: number
  metadata?: {
    executionTime?: number
    [key: string]: any
  }
}
