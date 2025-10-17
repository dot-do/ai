/**
 * mdxdb - MDX-powered database with schema validation and linked data
 *
 * Core database functionality for managing MDX content with:
 * - Schema validation (Zod)
 * - Frontmatter parsing (gray-matter)
 * - Linked data support (MDXLD)
 * - CMS integration (Payload)
 */

import matter from 'gray-matter'
import { z } from 'zod'

/**
 * MDX Document interface
 */
export interface MDXDocument {
  id: string
  content: string
  frontmatter: Record<string, any>
  schema?: z.ZodSchema
  linkedData?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Database configuration
 */
export interface MDXDBConfig {
  schemas?: Record<string, z.ZodSchema>
  validateOnWrite?: boolean
  autoTimestamps?: boolean
}

/**
 * Parse MDX document with frontmatter
 */
export function parseMDX(content: string): { data: Record<string, any>; content: string } {
  const { data, content: body } = matter(content)
  return { data, content: body }
}

/**
 * Validate document against schema
 */
export function validateDocument(
  document: MDXDocument,
  schema: z.ZodSchema
): { valid: boolean; errors?: z.ZodError } {
  try {
    schema.parse(document.frontmatter)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, errors: error }
    }
    throw error
  }
}

/**
 * Create MDX document
 */
export async function createDocument(content: string, config?: MDXDBConfig): Promise<MDXDocument> {
  const { data, content: body } = parseMDX(content)

  const document: MDXDocument = {
    id: crypto.randomUUID(),
    content: body,
    frontmatter: data,
    createdAt: config?.autoTimestamps ? new Date() : undefined,
    updatedAt: config?.autoTimestamps ? new Date() : undefined,
  }

  // Validate if schema provided
  if (config?.validateOnWrite && config?.schemas) {
    const schemaName = data.type || data.schema
    if (schemaName && config.schemas[schemaName]) {
      const validation = validateDocument(document, config.schemas[schemaName])
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors?.message}`)
      }
    }
  }

  return document
}

/**
 * Update MDX document
 */
export async function updateDocument(
  id: string,
  content: string,
  config?: MDXDBConfig
): Promise<MDXDocument> {
  const { data, content: body } = parseMDX(content)

  const document: MDXDocument = {
    id,
    content: body,
    frontmatter: data,
    updatedAt: config?.autoTimestamps ? new Date() : undefined,
  }

  // Validate if schema provided
  if (config?.validateOnWrite && config?.schemas) {
    const schemaName = data.type || data.schema
    if (schemaName && config.schemas[schemaName]) {
      const validation = validateDocument(document, config.schemas[schemaName])
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors?.message}`)
      }
    }
  }

  return document
}

/**
 * Query documents (placeholder - implement with actual storage)
 */
export async function queryDocuments(filter?: Record<string, any>): Promise<MDXDocument[]> {
  // TODO: Implement with actual storage backend
  throw new Error('Not implemented - connect to storage backend')
}

/**
 * Get document by ID (placeholder)
 */
export async function getDocument(id: string): Promise<MDXDocument | null> {
  // TODO: Implement with actual storage backend
  throw new Error('Not implemented - connect to storage backend')
}

/**
 * Delete document (placeholder)
 */
export async function deleteDocument(id: string): Promise<void> {
  // TODO: Implement with actual storage backend
  throw new Error('Not implemented - connect to storage backend')
}

// Re-export types and utilities
export { z } from 'zod'
export { matter }
