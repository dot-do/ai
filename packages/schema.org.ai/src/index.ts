/**
 * Schema.org vocabulary API
 * Provides access to 817 Schema.org types and 1,518 properties
 */

import type { SchemaOrgVocabulary, Type, Property, TypeHierarchy, SearchOptions, SearchResult } from './types'
import { SchemaOrgCache } from './cache'

export class SchemaOrgAPI {
  private types: Map<string, Type> = new Map()
  private properties: Map<string, Property> = new Map()
  private vocabulary?: SchemaOrgVocabulary
  private initialized = false

  /**
   * Initialize the API (loads vocabulary from cache or fetches)
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    const cache = new SchemaOrgCache()
    this.vocabulary = await cache.load()

    // Build simplified type and property maps
    this.buildTypesMap()
    this.buildPropertiesMap()

    this.initialized = true
    console.log(`Schema.org API initialized: ${this.types.size} types, ${this.properties.size} properties`)
  }

  /**
   * Find type by name
   */
  async findType(name: string): Promise<Type | undefined> {
    await this.initialize()
    return this.types.get(name)
  }

  /**
   * Search types with fuzzy matching
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    await this.initialize()

    const limit = options.limit || 10
    const results: SearchResult[] = []

    for (const type of this.types.values()) {
      let score = 0
      let matchedOn: 'name' | 'description' | 'both' = 'name'

      // Exact match on name
      if (type.name.toLowerCase() === query.toLowerCase()) {
        score = 100
      }
      // Starts with query
      else if (type.name.toLowerCase().startsWith(query.toLowerCase())) {
        score = 80
      }
      // Contains query
      else if (type.name.toLowerCase().includes(query.toLowerCase())) {
        score = 60
      }

      if (score > 0) {
        results.push({ type, score, matchedOn })
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score)

    return results.slice(0, limit)
  }

  /**
   * Get all types
   */
  async getAllTypes(): Promise<Type[]> {
    await this.initialize()
    return Array.from(this.types.values())
  }

  /**
   * Build simplified types map from vocabulary
   */
  private buildTypesMap(): void {
    if (!this.vocabulary) return

    for (const schemaType of this.vocabulary.types) {
      const id = schemaType['@id']
      const name = schemaType['rdfs:label'] || this.extractName(id)

      const parents: string[] = []
      const subClassOf = schemaType['rdfs:subClassOf']
      if (subClassOf) {
        const parentRefs = Array.isArray(subClassOf) ? subClassOf : [subClassOf]
        parents.push(...parentRefs.map((ref) => this.extractName(ref['@id'])))
      }

      const type: Type = {
        id,
        name,
        description: schemaType['rdfs:comment'] || '',
        parents,
        properties: [],
        url: id,
      }

      this.types.set(name, type)
    }
  }

  /**
   * Build simplified properties map from vocabulary
   */
  private buildPropertiesMap(): void {
    if (!this.vocabulary) return

    for (const schemaProp of this.vocabulary.properties) {
      const id = schemaProp['@id']
      const name = schemaProp['rdfs:label'] || this.extractName(id)

      const domains: string[] = []
      const ranges: string[] = []

      const property: Property = {
        id,
        name,
        description: schemaProp['rdfs:comment'] || '',
        domains,
        ranges,
        url: id,
      }

      this.properties.set(name, property)
    }
  }

  /**
   * Extract type/property name from Schema.org URL
   */
  private extractName(url: string): string {
    return url.split('/').pop() || url
  }
}

// Export types
export * from './types'
export { SchemaOrgCache } from './cache'
export { SchemaOrgFetcher } from './fetcher'

// Export singleton instance
export const schemaOrg = new SchemaOrgAPI()
