/**
 * Base types for tasks.org.ai
 */

/**
 * Thing - Base type for all semantic entities
 */
export interface Thing {
  $type: string
  $id: string
  $context?: string
  name?: string
  description?: string
}

/**
 * Ref - Reference to another Thing by $id
 */
export interface Ref {
  $id: string
  $type?: string
}
