export * from './types/index.js'
export * from './builders/index.js'
export * from './utils/index.js'
export type { TypedPathProxy } from './types/complete.js'

/**
 * Proxy-based semantic path builder with type support
 * Usage: $.Subject.predicate.Object
 */
interface PathProxy {
  readonly path: string
  toString(): string
  valueOf(): string
  readonly [key: string]: PathProxy | string | (() => string)
}

const handler: ProxyHandler<{ path: string }> = {
  get(target, prop): any {
    // Handle introspection
    if (prop === Symbol.toStringTag || prop === 'toJSON') {
      return target.path
    }
    if (prop === 'toString' || prop === 'valueOf') {
      return () => target.path
    }
    if (prop === 'path') {
      return target.path
    }
    if (typeof prop === 'symbol') {
      return undefined
    }

    const newPath = target.path ? `${target.path}.${String(prop)}` : String(prop)
    return new Proxy({ path: newPath }, handler)
  },
}

/**
 * $ - Semantic path builder
 *
 * Type-safe semantic path construction using proxy with full type inference
 * from all ontologies (Schema.org, GS1/EPCIS, O*NET, NAICS, APQC, EDI, Zapier).
 *
 * @example
 * ```typescript
 * import $ from 'graphdl'
 * import type { TypedPathProxy } from 'graphdl'
 *
 * // Create paths with type hints
 * $.Person.worksFor.Organization      // "$.Person.worksFor.Organization"
 * $.John.hasSkill.TypeScript          // "$.John.hasSkill.TypeScript"
 * $.Product.locatedAt.Warehouse       // "$.Product.locatedAt.Warehouse"
 * $.Shipment.inTransit.Container      // "$.Shipment.inTransit.Container"
 *
 * // Convert to string
 * String($.Person.hasOccupation.SoftwareDeveloper)
 *
 * // Use TypedPathProxy for autocomplete (optional)
 * const typedProxy = $ as unknown as TypedPathProxy
 * typedProxy.Person      // Full autocomplete for all entities
 * ```
 *
 * The proxy supports:
 * - Arbitrary property access chains
 * - Automatic string conversion
 * - Type hints from imported vocabularies
 * - Integration with Schema.org, GS1, and O*NET types
 * - Optional TypedPathProxy for full autocomplete
 */
export const $ = new Proxy({ path: '$' }, handler) as PathProxy & {
  [subject: string]: PathProxy & {
    [predicate: string]: PathProxy & {
      [object: string]: PathProxy
    }
  }
}

export default $
