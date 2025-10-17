/**
 * Schema.org vocabulary types
 */

export interface SchemaOrgVocabulary {
  types: SchemaOrgType[]
  properties: SchemaOrgProperty[]
  version: string
  fetchedAt: string
}

export interface SchemaOrgType {
  '@id': string
  '@type': string
  'rdfs:label': string
  'rdfs:comment': string
  'rdfs:subClassOf'?: SchemaOrgReference | SchemaOrgReference[]
  'schema:isPartOf'?: SchemaOrgReference
  'schema:source'?: SchemaOrgReference
}

export interface SchemaOrgProperty {
  '@id': string
  '@type': string
  'rdfs:label': string
  'rdfs:comment': string
  'schema:domainIncludes'?: SchemaOrgReference | SchemaOrgReference[]
  'schema:rangeIncludes'?: SchemaOrgReference | SchemaOrgReference[]
  'schema:isPartOf'?: SchemaOrgReference
  'schema:source'?: SchemaOrgReference
}

export interface SchemaOrgReference {
  '@id': string
}

/**
 * Simplified type representation for easier use
 */
export interface Type {
  id: string
  name: string
  description: string
  parents: string[]
  properties: Property[]
  url: string
}

export interface Property {
  id: string
  name: string
  description: string
  domains: string[] // Types this property applies to
  ranges: string[] // Expected value types
  url: string
}

/**
 * Search and query options
 */
export interface SearchOptions {
  limit?: number
  fuzzy?: boolean
  includeDescriptions?: boolean
}

export interface SearchResult {
  type: Type
  score: number
  matchedOn: 'name' | 'description' | 'both'
}

/**
 * Type hierarchy
 */
export interface TypeHierarchy {
  type: Type
  parents: Type[]
  children: Type[]
  ancestors: Type[] // All ancestors up to Thing
  descendants: Type[] // All descendants
  depth: number // Distance from Thing
}
