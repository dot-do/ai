/**
 * Frontmatter parsing hook for Payload
 *
 * Parses MDX frontmatter and validates against schema
 */

import matter from 'gray-matter'
import yaml from 'js-yaml'
import type { z } from 'zod'
import type { MDXBeforeValidate, ParsedFrontmatter } from '../types.js'

/**
 * Parse MDX frontmatter with safe YAML parsing
 *
 * @param mdxContent - MDX content string
 * @returns Parsed frontmatter and content
 *
 * @remarks
 * Uses js-yaml CORE_SCHEMA to safely parse YAML while preventing arbitrary code execution.
 * CORE_SCHEMA supports strings, numbers, booleans, null, arrays, and objects, but blocks
 * dangerous features like custom tags and arbitrary code execution.
 */
export function parseFrontmatter(mdxContent: string): ParsedFrontmatter {
  const parsed = matter(mdxContent, {
    engines: {
      yaml: (s) => yaml.load(s, { schema: yaml.CORE_SCHEMA }) as Record<string, unknown>,
    },
  })

  return {
    data: parsed.data as Record<string, unknown>,
    content: parsed.content,
    frontmatter: parsed.matter || '',
  }
}

/**
 * Create a beforeValidate hook that parses and validates MDX frontmatter
 *
 * @param fieldName - Name of the MDX field
 * @param schema - Optional Zod schema for validation
 * @returns Payload beforeValidate hook
 *
 * @example
 * ```typescript
 * import { createParseFrontmatterHook } from '@mdxdb/payload/hooks'
 * import { z } from 'zod'
 *
 * const PostSchema = z.object({
 *   title: z.string(),
 *   date: z.date(),
 * })
 *
 * export const BlogPosts = {
 *   slug: 'blog-posts',
 *   hooks: {
 *     beforeValidate: [
 *       createParseFrontmatterHook('content', PostSchema),
 *     ],
 *   },
 * }
 * ```
 */
export function createParseFrontmatterHook(fieldName: string, schema?: z.ZodSchema): MDXBeforeValidate {
  return async ({ data }) => {
    const mdxContent = data[fieldName]

    if (typeof mdxContent !== 'string') {
      return data
    }

    try {
      const parsed = parseFrontmatter(mdxContent)

      // Validate frontmatter against schema if provided
      // Only validate if data exists and is not an empty object
      if (schema && parsed.data && Object.keys(parsed.data).length > 0) {
        const result = schema.safeParse(parsed.data)

        if (!result.success) {
          throw new Error(`Field '${fieldName}' frontmatter validation failed: ${result.error.message}`)
        }
      }

      // Store parsed frontmatter in a separate field
      const frontmatterFieldName = `${fieldName}_frontmatter`
      return {
        ...data,
        [frontmatterFieldName]: parsed.data,
      }
    } catch (error) {
      if (error instanceof Error) {
        // If the error already has the field name in it, just re-throw with cause
        if (error.message.includes(`Field '${fieldName}'`)) {
          throw error
        }
        // Otherwise wrap it with field context
        throw new Error(`Field '${fieldName}': Failed to parse frontmatter: ${error.message}`, {
          cause: error,
        })
      }
      throw new Error(`Field '${fieldName}': Failed to parse frontmatter: Unknown error`)
    }
  }
}

/**
 * Create a beforeValidate hook for linked data frontmatter
 *
 * @param fieldName - Name of the MDX field
 * @param schema - Optional Zod schema for validation
 * @returns Payload beforeValidate hook
 *
 * @example
 * ```typescript
 * import { createLinkedDataHook } from '@mdxdb/payload/hooks'
 *
 * export const BlogPosts = {
 *   slug: 'blog-posts',
 *   hooks: {
 *     beforeValidate: [
 *       createLinkedDataHook('content'),
 *     ],
 *   },
 * }
 * ```
 */
export function createLinkedDataHook(fieldName: string, schema?: z.ZodSchema): MDXBeforeValidate {
  return async ({ data }) => {
    const mdxContent = data[fieldName]

    if (typeof mdxContent !== 'string') {
      return data
    }

    try {
      const parsed = parseFrontmatter(mdxContent)

      // Validate $id if present
      if (parsed.data.$id) {
        try {
          new URL(parsed.data.$id as string)
        } catch {
          throw new Error(`Field '${fieldName}': $id must be a valid URL`)
        }
      }

      // Validate $type if present
      if (parsed.data.$type) {
        if (typeof parsed.data.$type !== 'string') {
          throw new Error(`Field '${fieldName}': $type must be a string`)
        }
      }

      // Validate against schema if provided
      // Only validate if data exists and is not an empty object
      if (schema && parsed.data && Object.keys(parsed.data).length > 0) {
        const result = schema.safeParse(parsed.data)

        if (!result.success) {
          throw new Error(`Field '${fieldName}' linked data validation failed: ${result.error.message}`)
        }
      }

      // Store parsed linked data with deep clone to prevent mutation issues
      const linkedDataFieldName = `${fieldName}_linked_data`
      return {
        ...data,
        [linkedDataFieldName]: {
          id: parsed.data.$id,
          type: parsed.data.$type,
          data: structuredClone(parsed.data),
        },
      }
    } catch (error) {
      if (error instanceof Error) {
        // If the error already has the field name in it, just re-throw
        if (error.message.includes(`Field '${fieldName}'`)) {
          throw error
        }
        // Otherwise wrap it with field context
        throw new Error(`Field '${fieldName}': Failed to parse linked data: ${error.message}`, {
          cause: error,
        })
      }
      throw new Error(`Field '${fieldName}': Failed to parse linked data: Unknown error`)
    }
  }
}
