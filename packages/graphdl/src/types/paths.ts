/**
 * Template literal types for semantic paths
 */

import type { Predicate } from './predicates.js'

/**
 * Semantic path pattern: $.Subject.predicate.Object
 */
export type SemanticPath<S extends string = string, P extends string = string, O extends string = string> = `$.${S}.${P}.${O}`

/**
 * Parse semantic path into components
 */
export type ParsePath<T extends string> = T extends `$.${infer S}.${infer P}.${infer O}` ? { subject: S; predicate: P; object: O } : never

/**
 * Predicate path (partial): $.Subject.predicate
 */
export type PredicatePath<S extends string = string, P extends string = string> = `$.${S}.${P}`

/**
 * Subject path (partial): $.Subject
 */
export type SubjectPath<S extends string = string> = `$.${S}`

/**
 * Type-safe semantic path builder
 */
export interface PathBuilder<S extends string = string> {
  /**
   * Build a path with predicate and object
   */
  <P extends Predicate, O extends string>(predicate: P, object: O): SemanticPath<S, P, O>

  /**
   * Create a partial path with just predicate
   */
  <P extends Predicate>(predicate: P): PredicatePath<S, P>
}

/**
 * Path construction helpers
 */
export type PathFrom<S extends string> = {
  [P in Predicate]: {
    [O in string]: SemanticPath<S, P, O>
  }
}
