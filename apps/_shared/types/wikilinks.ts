/**
 * Shared wikilink types for all app templates
 */

export interface WikilinkMatch {
  raw: string
  link: string
  alias?: string
  url: string
}

export interface Backlink {
  from: string
  title: string
  href: string
  excerpt: string
  context?: string
}

export interface WikilinkConfig {
  currentPackage?: string
  baseUrl?: string
  crossPackageNewTab?: boolean
}

export type WikilinkResolver = (link: string, config?: WikilinkConfig) => string
