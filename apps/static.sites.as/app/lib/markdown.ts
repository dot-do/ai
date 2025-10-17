/**
 * Markdown parser with wikilinks support
 */

import { fromMarkdown } from 'mdast-util-from-markdown'
import { toHast } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import { visit } from 'unist-util-visit'
import matter from 'gray-matter'
import { replaceWikilinks } from './wikilinks'

export interface ParsedMarkdown {
  html: string
  frontmatter: Record<string, any>
  toc: TOCItem[]
  wikilinks: string[]
}

export interface TOCItem {
  id: string
  text: string
  level: number
}

/**
 * Parse markdown with frontmatter and wikilinks
 */
export function parseMarkdown(content: string): ParsedMarkdown {
  // Extract frontmatter
  const { data: frontmatter, content: markdown } = matter(content)

  // Parse markdown to MDAST
  const tree = fromMarkdown(markdown)

  // Collect TOC items
  const toc: TOCItem[] = []

  // Collect wikilinks
  const wikilinks: string[] = []

  // Process tree
  visit(tree, (node: any) => {
    // Extract headings for TOC
    if (node.type === 'heading' && node.depth >= 2 && node.depth <= 3) {
      const text = extractText(node)
      const id = slugify(text)
      toc.push({ id, text, level: node.depth })
    }

    // Extract wikilinks
    if (node.type === 'text' && node.value) {
      const matches = node.value.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)
      if (matches) {
        matches.forEach((match: string) => {
          const linkMatch = match.match(/\[\[([^\]|]+)/)
          if (linkMatch) {
            wikilinks.push(linkMatch[1].trim())
          }
        })
      }
    }
  })

  // Add IDs to headings
  visit(tree, 'heading', (node: any) => {
    if (node.depth >= 2 && node.depth <= 3) {
      const text = extractText(node)
      const id = slugify(text)
      node.data = node.data || {}
      node.data.hProperties = { id }
    }
  })

  // Convert MDAST to HAST
  const hast = toHast(tree)

  // Convert HAST to HTML
  let html = toHtml(hast)

  // Replace wikilinks with HTML links
  html = replaceWikilinks(html)

  return {
    html,
    frontmatter,
    toc,
    wikilinks: [...new Set(wikilinks)],
  }
}

/**
 * Extract plain text from MDAST node
 */
function extractText(node: any): string {
  if (node.type === 'text') {
    return node.value
  }

  if (node.children) {
    return node.children.map(extractText).join('')
  }

  return ''
}

/**
 * Convert text to URL-safe slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
