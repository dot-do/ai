import type { Triple, TripleMetadata } from '../types/graph.js'
import type { Predicate } from '../types/predicates.js'

/**
 * Triple builder for creating semantic triples
 */
export class TripleBuilder<S = any, P extends string = string, O = any> {
  private triple: Partial<Triple<S, P, O>> = {}

  constructor(subject?: S) {
    if (subject !== undefined) {
      this.triple.subject = subject
    }
  }

  subject(value: S): this {
    this.triple.subject = value
    return this
  }

  predicate(value: P): this {
    this.triple.predicate = value
    return this
  }

  object(value: O): this {
    this.triple.object = value
    return this
  }

  context(value: string): this {
    this.triple.context = value
    return this
  }

  metadata(value: TripleMetadata): this {
    this.triple.metadata = value
    return this
  }

  build(): Triple<S, P, O> {
    if (!this.triple.subject || !this.triple.predicate || this.triple.object === undefined) {
      throw new Error('Triple must have subject, predicate, and object')
    }
    return this.triple as Triple<S, P, O>
  }
}

/**
 * Create a triple using fluent syntax
 */
export function triple<S = any, P extends string = string, O = any>(subject?: S): TripleBuilder<S, P, O> {
  return new TripleBuilder<S, P, O>(subject)
}

/**
 * Create a triple using function syntax
 */
export function createTriple<S = any, P extends string = string, O = any>(
  subject: S,
  predicate: P,
  object: O,
  options?: {
    context?: string
    metadata?: TripleMetadata
  }
): Triple<S, P, O> {
  return {
    subject,
    predicate,
    object,
    context: options?.context,
    metadata: options?.metadata,
  }
}

/**
 * Create a semantic path: $.Subject.predicate.Object
 */
export function path<S = string, P extends Predicate = Predicate, O = string>(subject: S, predicate: P, object: O): string {
  return `$.${String(subject)}.${predicate}.${String(object)}`
}

/**
 * Parse a semantic path back into components
 */
export function parsePath(pathString: string): { subject: string; predicate: string; object: string } | null {
  const match = pathString.match(/^\$\.([^.]+)\.([^.]+)\.([^.]+)$/)
  if (!match) return null

  return {
    subject: match[1],
    predicate: match[2],
    object: match[3],
  }
}
