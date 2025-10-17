/**
 * Shared wikilink utilities for all app templates
 * Framework-agnostic - works with HonoX, React Router, etc.
 */

import type { WikilinkMatch, WikilinkConfig } from '../types/wikilinks'

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
export function resolveWikilinkUrl(link: string, config?: WikilinkConfig): string {
  // Check for cross-package reference (contains .org.ai or .sites.as)
  const crossPackageMatch = link.match(/^([a-z]+\.(org\.ai|sites\.as))\/(.+)$/)

  if (crossPackageMatch) {
    const [, domain, , path] = crossPackageMatch
    const slug = path.replace(/\s+/g, '-')
    return config?.baseUrl ? `${config.baseUrl}/${domain}/${slug}` : `https://${domain}/${slug}`
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
 * Check if link is cross-package
 */
export function isCrossPackageLink(link: string): boolean {
  return /^[a-z]+\.(org\.ai|sites\.as)\//.test(link)
}

/**
 * Replace wikilinks in text with HTML links
 */
export function replaceWikilinks(text: string, config?: WikilinkConfig): string {
  return text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, link, alias) => {
    const url = resolveWikilinkUrl(link.trim(), config)
    const displayText = alias?.trim() || link.trim()
    const isCross = isCrossPackageLink(link)

    if (isCross && config?.crossPackageNewTab !== false) {
      return `<a href="${url}" class="wikilink text-primary hover:underline" target="_blank" rel="noopener noreferrer">${displayText}</a>`
    }

    return `<a href="${url}" class="wikilink text-primary hover:underline">${displayText}</a>`
  })
}
