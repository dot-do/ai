/**
 * Wikipedia Article type definitions for wikipedia.org.ai
 *
 * Based on wtf_wikipedia structured data extraction
 */

import type { Thing, Ref } from './base.js'

/**
 * Infobox data extracted from Wikipedia articles
 */
export interface Infobox {
  type?: string // Infobox type (e.g., "person", "company", "place")
  data: Record<string, any> // Key-value pairs from infobox
}

/**
 * Wikipedia category
 */
export interface Category {
  name: string
  url?: string
}

/**
 * Wikipedia link (internal or external)
 */
export interface Link {
  text: string
  href: string
  type: 'internal' | 'external' | 'interwiki'
}

/**
 * Wikipedia image
 */
export interface Image {
  file: string
  url?: string
  caption?: string
  thumb?: string
}

/**
 * Wikipedia citation/reference
 */
export interface Citation {
  title?: string
  url?: string
  author?: string
  date?: string
  publisher?: string
}

/**
 * Wikipedia Article - Structured data from a Wikipedia article
 *
 * Represents an entity extracted from Wikipedia with canonical URL
 * Format: https://wikipedia.org.ai/PageTitle
 */
export interface WikipediaArticle extends Thing {
  $type: 'WikipediaArticle'

  // Wikipedia identifiers
  title: string // Article title
  pageId?: number // Wikipedia page ID
  wikiUrl: string // Original Wikipedia URL (e.g., https://en.wikipedia.org/wiki/Anthropic)

  // Content
  summary?: string // First paragraph/lead section
  text?: string // Full plaintext (optional, can be large)
  sections?: Array<{
    title: string
    text: string
    depth: number
  }>

  // Structured data
  infobox?: Infobox // Infobox data
  categories?: Category[] // Wikipedia categories
  images?: Image[] // Images in article
  links?: Link[] // Links to other articles
  citations?: Citation[] // References/citations

  // Metadata
  lang?: string // Language code (default: 'en')
  lastModified?: string // Last modification date (ISO 8601)

  // Semantic relationships (explicit predicates)
  sameAs?: Ref[] // $.WikipediaArticle.sameAs.Thing (e.g., Wikidata, DBpedia)
  about?: Ref[] // $.WikipediaArticle.about.Topic
  mentions?: Ref[] // $.WikipediaArticle.mentions.Entity
  relatedTo?: Ref[] // $.WikipediaArticle.relatedTo.WikipediaArticle
}

/**
 * Wikipedia Entity - Canonical entity reference
 *
 * Used as canonical $id for entities: https://wikipedia.org.ai/EntityName
 */
export interface WikipediaEntity extends Thing {
  $type: string // Actual entity type (Person, Organization, Place, etc.)

  // Wikipedia reference
  wikipediaArticle: string // $id of WikipediaArticle
  wikiUrl: string // Original Wikipedia URL

  // Entity data (extracted from infobox and article)
  infobox?: Infobox
  summary?: string

  // Canonical identifiers
  wikidataId?: string // Wikidata Q-number
  dbpediaUri?: string // DBpedia URI
}
