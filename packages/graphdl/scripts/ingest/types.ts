/**
 * Shared types for data ingestion scripts
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export interface IngestionResult {
  source: string
  totalRecords: number
  successCount: number
  errorCount: number
  errors: string[]
  duration: number
}

/**
 * Type-safe frontmatter value types with depth limit to prevent circular references
 */
export type FrontmatterValue = string | number | boolean | null | FrontmatterValue[] | { [key: string]: string | number | boolean | null | string[] | number[] }

export interface MDXDocument {
  frontmatter: Record<string, FrontmatterValue>
  content: string
}

export interface NAICSCode {
  code: string
  title: string
  description: string
  parent: string | null
  children: string[]
  level: number
}

export interface APQCProcess {
  id: string
  code: string
  title: string
  description: string
  category: string
  parent: string | null
  children: string[]
  level: number
}

export interface UNEDIMessage {
  code: string
  name: string
  description: string
  version: string
  category: string
  segments: string[]
}

export interface ZapierApp {
  key: string
  name: string
  description: string
  category: string
  imageUrl: string
  url: string
  triggers: string[]
  actions: string[]
  searches?: string[]
}

export interface N8nNode {
  name: string
  displayName: string
  description: string
  category: string
  version: number
  credentials?: string[]
  operations: N8nOperation[]
  icon?: string
  documentationUrl?: string
}

export interface N8nOperation {
  name: string
  displayName: string
  description: string
  type: 'trigger' | 'action'
  properties: N8nProperty[]
}

export interface N8nProperty {
  displayName: string
  name: string
  type: string
  required: boolean
  default?: unknown
  description?: string
  options?: Array<{ name: string; value: string }>
}

export interface ONetTool {
  code: string
  name: string
  description: string
  category: 'Software' | 'Technology' | 'Tools' | 'Equipment'
  occupations: string[]
  vendor?: string
}

/**
 * Validates a frontmatter key to prevent YAML injection
 */
function validateFrontmatterKey(key: string): void {
  // Prevent YAML directive injection and special characters
  if (
    key.includes(':') ||
    key.includes('#') ||
    key.includes('!') ||
    key.includes('&') ||
    key.includes('*') ||
    key.includes('[') ||
    key.includes(']') ||
    key.includes('{') ||
    key.includes('}') ||
    key.includes('|') ||
    key.includes('>') ||
    key.includes('\n') ||
    key.includes('\r')
  ) {
    throw new Error(`Invalid frontmatter key (contains YAML special characters): ${key}`)
  }

  // Prevent keys that could be YAML directives
  if (key.startsWith('%') || key.startsWith('-')) {
    throw new Error(`Invalid frontmatter key (looks like YAML directive): ${key}`)
  }

  // Ensure key is not empty
  if (key.trim().length === 0) {
    throw new Error('Frontmatter key cannot be empty')
  }
}

/**
 * Converts a data object to MDX format with frontmatter
 */
export function toMDX(frontmatter: Record<string, FrontmatterValue>, content: string): string {
  const frontmatterLines = ['---']

  for (const [key, value] of Object.entries(frontmatter)) {
    // Validate key before processing
    validateFrontmatterKey(key)
    if (value === null || value === undefined) {
      frontmatterLines.push(`${key}: null`)
    } else if (typeof value === 'string') {
      // Use JSON.stringify for proper escaping, or YAML literal block for multiline
      if (value.includes('\n')) {
        frontmatterLines.push(`${key}: |`)
        value.split('\n').forEach((line) => {
          frontmatterLines.push(`  ${line}`)
        })
      } else {
        // JSON.stringify handles all escaping correctly
        frontmatterLines.push(`${key}: ${JSON.stringify(value)}`)
      }
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        frontmatterLines.push(`${key}: []`)
      } else {
        frontmatterLines.push(`${key}:`)
        value.forEach((item) => {
          if (typeof item === 'string') {
            frontmatterLines.push(`  - ${JSON.stringify(item)}`)
          } else {
            frontmatterLines.push(`  - ${JSON.stringify(item)}`)
          }
        })
      }
    } else if (typeof value === 'object') {
      // Add depth limit check for nested objects to prevent serialization issues
      const serialized = JSON.stringify(value)
      if (serialized.length > 10000) {
        throw new Error(`Frontmatter value too large for key "${key}" (${serialized.length} chars). Maximum 10000 chars allowed.`)
      }
      frontmatterLines.push(`${key}: ${serialized}`)
    } else {
      frontmatterLines.push(`${key}: ${value}`)
    }
  }

  frontmatterLines.push('---')
  frontmatterLines.push('')

  return frontmatterLines.join('\n') + content
}

/**
 * Creates a safe filename from a string
 */
export function toFilename(str: string): string {
  // Prevent path traversal attacks
  if (str.includes('..') || str.includes('/') || str.includes('\\')) {
    throw new Error(`Invalid filename (path traversal detected): ${str}`)
  }

  // Prevent null byte injection
  if (str.includes('\0')) {
    throw new Error(`Invalid filename (null byte detected): ${str}`)
  }

  const sanitized = str
    .toLowerCase()
    .replace(/[^a-z0-9-_.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  // Ensure result is not empty after sanitization
  if (sanitized.length === 0) {
    throw new Error(`Invalid filename (empty after sanitization): ${str}`)
  }

  // Prevent hidden files (starting with dot)
  if (sanitized.startsWith('.')) {
    throw new Error(`Invalid filename (would create hidden file): ${str}`)
  }

  return sanitized
}

/**
 * Writes an MDX file to the specified directory
 * @param outputDir - Directory to write the file to
 * @param filename - Name of the file (should end in .mdx)
 * @param frontmatter - Frontmatter object
 * @param content - MDX content
 * @throws Error if file cannot be written
 */
export function writeMDXFile(outputDir: string, filename: string, frontmatter: Record<string, FrontmatterValue>, content: string): void {
  // Ensure output directory exists (handle potential race condition in parallel execution)
  try {
    mkdirSync(outputDir, { recursive: true })
  } catch (error) {
    // Ignore EEXIST errors from parallel directory creation attempts
    if (error instanceof Error && !error.message.includes('EEXIST')) {
      throw error
    }
  }

  const filepath = join(outputDir, filename)
  const mdx = toMDX(frontmatter, content)

  writeFileSync(filepath, mdx, 'utf-8')
}

/**
 * Logs ingestion results
 */
export function logResult(result: IngestionResult): void {
  console.log(`\n=== ${result.source} Ingestion Results ===`)
  console.log(`Total Records: ${result.totalRecords}`)
  console.log(`Success: ${result.successCount}`)
  console.log(`Errors: ${result.errorCount}`)
  console.log(`Duration: ${result.duration}ms`)

  if (result.errors.length > 0) {
    console.log('\nErrors:')
    result.errors.forEach((error) => console.log(`  - ${error}`))
  }

  console.log('===================================\n')
}
