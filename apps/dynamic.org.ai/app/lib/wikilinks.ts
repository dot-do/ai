/**
 * Wikilinks Parser and Resolver for React Router
 * Handles [[wikilink]] syntax for internal cross-references
 */

export interface WikilinkMatch {
  raw: string
  link: string
  alias?: string
  url: string
}

/**
 * Parse wikilink syntax: [[link]] or [[link|alias]]
 */
export function parseWikilink(text: string): WikilinkMatch | null {
  const match = text.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$/)
  if (!match) return null

  const [raw, link, alias] = match
  return {
    raw,
    link: link.trim(),
    alias: alias?.trim(),
    url: resolveWikilinkUrl(link.trim()),
  }
}

/**
 * Resolve wikilink to URL
 * Supports both internal and cross-package links:
 * - [[Python]] → /Python (same package)
 * - [[soc.org.ai/Software Developer]] → https://soc.org.ai/Software-Developer
 * - [[tech.org.ai/Python]] → https://tech.org.ai/Python
 */
export function resolveWikilinkUrl(link: string, currentPackage?: string): string {
  // Check for cross-package reference (contains .org.ai or .sites.as)
  const crossPackageMatch = link.match(/^([a-z]+\.(org\.ai|sites\.as))\/(.+)$/)

  if (crossPackageMatch) {
    const [, domain, , path] = crossPackageMatch
    const slug = path.replace(/\s+/g, '-')
    return `https://${domain}/${slug}`
  }

  // Internal link - convert spaces to hyphens
  const slug = link.replace(/\s+/g, '-')
  return `/${slug}`
}

/**
 * Find all wikilinks in text
 */
export function findWikilinks(text: string): WikilinkMatch[] {
  const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
  const matches: WikilinkMatch[] = []

  let match
  while ((match = regex.exec(text)) !== null) {
    const [raw, link, alias] = match
    matches.push({
      raw,
      link: link.trim(),
      alias: alias?.trim(),
      url: resolveWikilinkUrl(link.trim()),
    })
  }

  return matches
}

/**
 * Replace wikilinks in text with React Router Link components (as JSX string)
 */
export function replaceWikilinks(text: string): string {
  return text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, link, alias) => {
    const url = resolveWikilinkUrl(link.trim())
    const displayText = alias?.trim() || link.trim()
    const isCrossPackage = link.includes('.org.ai') || link.includes('.sites.as')

    if (isCrossPackage) {
      return `<a href="${url}" class="wikilink text-primary hover:underline" target="_blank" rel="noopener noreferrer">${displayText}</a>`
    }

    return `<a href="${url}" class="wikilink text-primary hover:underline">${displayText}</a>`
  })
}

/**
 * Extract backlinks from content
 * Returns array of pages that link to the given page
 */
export interface Backlink {
  from: string
  context: string
}

export function extractBacklinks(content: string, targetSlug: string): Backlink[] {
  // This would be implemented with R2 SQL or Vectorize search
  // For now, return empty array (to be implemented)
  return []
}
