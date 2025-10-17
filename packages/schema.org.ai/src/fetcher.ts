/**
 * Fetches Schema.org vocabulary from schema.org
 */

import type { SchemaOrgVocabulary, SchemaOrgType, SchemaOrgProperty } from './types'

export class SchemaOrgFetcher {
  private readonly SCHEMA_ORG_URL = 'https://schema.org/version/latest/schemaorg-current-https.jsonld'

  /**
   * Fetch Schema.org vocabulary
   */
  async fetchVocabulary(): Promise<SchemaOrgVocabulary> {
    console.log('Fetching Schema.org vocabulary...')

    const response = await fetch(this.SCHEMA_ORG_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch Schema.org vocabulary: ${response.statusText}`)
    }

    const data = await response.json()
    return this.parseJsonLD(data)
  }

  /**
   * Parse JSON-LD data into structured vocabulary
   */
  private parseJsonLD(data: any): SchemaOrgVocabulary {
    const graph = data['@graph'] || []

    const types = graph.filter((node: any) => {
      const type = node['@type']
      return type === 'rdfs:Class' || type === 'schema:Class'
    }) as SchemaOrgType[]

    const properties = graph.filter((node: any) => {
      const type = node['@type']
      return type === 'rdf:Property' || type === 'schema:Property'
    }) as SchemaOrgProperty[]

    console.log(`Parsed ${types.length} types and ${properties.length} properties`)

    return {
      types,
      properties,
      version: data['schema:version'] || 'latest',
      fetchedAt: new Date().toISOString(),
    }
  }
}
