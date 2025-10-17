import matter from 'gray-matter'
import YAML from 'yaml'
import type { LinkedDataFrontmatter, MDXWithLinkedData, MDXFlattened, ValidationResult, ParseOptions } from './types.js'

export * from './types.js'

/**
 * Parse MDX content and extract linked data frontmatter
 */
export function parseMDXLD(content: string, options: ParseOptions = {}): MDXWithLinkedData {
  const parsed = matter(content)

  const data: LinkedDataFrontmatter = {
    ...parsed.data,
  }

  // Apply default context if provided and no context exists
  if (options.defaultContext && !data.$context) {
    data.$context = options.defaultContext
  }

  return {
    content: parsed.content,
    data,
    isEmpty: parsed.content.trim().length === 0,
    excerpt: parsed.excerpt,
  }
}

/**
 * Parse MDX content and extract linked data frontmatter
 * Alias for parseMDXLD for cleaner API
 */
export function parse(content: string, options: ParseOptions = {}): MDXWithLinkedData {
  return parseMDXLD(content, options)
}

/**
 * Validate linked data frontmatter
 */
export function validateLinkedData(data: LinkedDataFrontmatter, options: ParseOptions = {}): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate $id if requested
  if (options.validateId && data.$id) {
    try {
      new URL(data.$id)
    } catch {
      errors.push(`$id must be a valid URI: ${data.$id}`)
    }
  }

  // Require $type if requested
  if (options.requireType && !data.$type) {
    errors.push('$type is required but not provided')
  }

  // Warn if $type is present but $id is not
  if (data.$type && !data.$id) {
    warnings.push('$type is present but $id is missing - consider adding a unique identifier')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Convert frontmatter to JSON-LD
 * Note: Keeps $ prefix for consistency (non-standard but more readable)
 */
export function toJSONLD(data: LinkedDataFrontmatter): Record<string, any> {
  const jsonld: Record<string, any> = {}

  // Keep $ prefix (our convention)
  if (data.$context) {
    jsonld.$context = data.$context
  }

  if (data.$id) {
    jsonld.$id = data.$id
  }

  if (data.$type) {
    jsonld.$type = data.$type
  }

  // Copy other properties
  Object.keys(data).forEach((key) => {
    if (!key.startsWith('$')) {
      jsonld[key] = data[key]
    }
  })

  return jsonld
}

/**
 * Convert JSON-LD to frontmatter format
 * Handles both @ and $ prefixes
 */
export function fromJSONLD(jsonld: Record<string, any>): LinkedDataFrontmatter {
  const frontmatter: LinkedDataFrontmatter = {}

  // Support both @ and $ prefixes
  if (jsonld['@context'] || jsonld.$context) {
    frontmatter.$context = jsonld['@context'] || jsonld.$context
  }

  if (jsonld['@id'] || jsonld.$id) {
    frontmatter.$id = jsonld['@id'] || jsonld.$id
  }

  if (jsonld['@type'] || jsonld.$type) {
    frontmatter.$type = jsonld['@type'] || jsonld.$type
  }

  // Copy other properties
  Object.keys(jsonld).forEach((key) => {
    if (!key.startsWith('@') && !key.startsWith('$')) {
      frontmatter[key] = jsonld[key]
    }
  })

  return frontmatter
}

/**
 * Stringify frontmatter with linked data back to MDX
 */
export function stringifyMDXLD(content: string, data: LinkedDataFrontmatter, options: { language?: string } = {}): string {
  return matter.stringify(content, data, {
    language: options.language || 'yaml',
  })
}

/**
 * Parse YAML frontmatter to object
 */
export function parseYAMLFrontmatter(yamlString: string): LinkedDataFrontmatter {
  return YAML.parse(yamlString) as LinkedDataFrontmatter
}

/**
 * Stringify object to YAML frontmatter
 */
export function stringifyYAMLFrontmatter(data: LinkedDataFrontmatter): string {
  return YAML.stringify(data)
}

/**
 * Parse MDX string to object (frontmatter + content)
 */
export function mdxToObject(mdxString: string): {
  frontmatter: LinkedDataFrontmatter
  content: string
} {
  const parsed = matter(mdxString)
  return {
    frontmatter: parsed.data as LinkedDataFrontmatter,
    content: parsed.content,
  }
}

/**
 * Convert object back to MDX string
 */
export function objectToMDX(obj: { frontmatter: LinkedDataFrontmatter; content: string }): string {
  return matter.stringify(obj.content, obj.frontmatter)
}

/**
 * Parse MDX to flattened format
 * Separates id, type, and data for cleaner API
 */
export function mdxToFlat(mdxString: string, options: ParseOptions = {}): MDXFlattened {
  const parsed = matter(mdxString)
  const data = { ...parsed.data }

  // Extract special fields
  const id = data.$id
  const type = data.$type
  const context = data.$context || options.defaultContext

  // Remove special fields from data
  delete data.$id
  delete data.$type
  delete data.$context

  return {
    id,
    type,
    context,
    data,
    content: parsed.content,
    isEmpty: parsed.content.trim().length === 0,
    excerpt: parsed.excerpt,
  }
}

/**
 * Convert flattened format back to MDX string
 */
export function flatToMDX(flat: MDXFlattened): string {
  const frontmatter: LinkedDataFrontmatter = {
    ...flat.data,
  }

  if (flat.id) frontmatter.$id = flat.id
  if (flat.type) frontmatter.$type = flat.type
  if (flat.context) frontmatter.$context = flat.context

  return matter.stringify(flat.content, frontmatter)
}

/**
 * Convert flattened to nested format
 */
export function flatToNested(flat: MDXFlattened): MDXWithLinkedData {
  const data: LinkedDataFrontmatter = {
    ...flat.data,
  }

  if (flat.id) data.$id = flat.id
  if (flat.type) data.$type = flat.type
  if (flat.context) data.$context = flat.context

  return {
    data,
    content: flat.content,
    isEmpty: flat.isEmpty,
    excerpt: flat.excerpt,
  }
}

/**
 * Convert nested to flattened format
 */
export function nestedToFlat(nested: MDXWithLinkedData): MDXFlattened {
  const data = { ...nested.data }

  const id = data.$id
  const type = data.$type
  const context = data.$context

  delete data.$id
  delete data.$type
  delete data.$context

  return {
    id,
    type,
    context,
    data,
    content: nested.content,
    isEmpty: nested.isEmpty,
    excerpt: nested.excerpt,
  }
}
