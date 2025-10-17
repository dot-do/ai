/**
 * MDX field for Payload CMS
 *
 * Provides a custom field type for MDX content with frontmatter support
 */

import matter from 'gray-matter'
import yaml from 'js-yaml'
import type { Field } from 'payload'
import type { MDXFieldConfig } from '../types.js'

/**
 * Create an MDX field for Payload collections
 *
 * @param config - MDX field configuration
 * @returns Payload field configuration
 *
 * @example
 * ```typescript
 * import { createMDXField } from '@mdxdb/payload'
 * import { z } from 'zod'
 *
 * const BlogPostSchema = z.object({
 *   title: z.string(),
 *   date: z.date(),
 *   tags: z.array(z.string()),
 * })
 *
 * export const BlogPosts = {
 *   slug: 'blog-posts',
 *   fields: [
 *     createMDXField({
 *       name: 'content',
 *       label: 'Blog Content',
 *       required: true,
 *       enableFrontmatter: true,
 *       enableLinkedData: true,
 *       schema: BlogPostSchema,
 *     }),
 *   ],
 * }
 * ```
 */
export function createMDXField(config: MDXFieldConfig): Field {
  const { name, label, required = false, enableFrontmatter = true, enableLinkedData = false, defaultFrontmatter, admin } = config

  // Validate field name
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid field name: '${name}'. Field names must start with a letter or underscore and contain only letters, numbers, and underscores.`)
  }

  return {
    name,
    type: 'code',
    label: label || name,
    required,
    admin: {
      language: 'markdown',
      description: admin?.description || 'MDX content with optional frontmatter',
      readOnly: admin?.readOnly || false,
      ...admin,
    },
    defaultValue: defaultFrontmatter
      ? `---\n${Object.entries(defaultFrontmatter)
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join('\n')}\n---\n\n`
      : '',
    validate: async (value: string | null | undefined) => {
      if (required && !value) {
        return `Field '${name}': MDX content is required`
      }

      if (!value) {
        return true
      }

      // Basic MDX syntax validation
      if (enableFrontmatter && value.startsWith('---')) {
        try {
          // Parse frontmatter using gray-matter with safe YAML parsing
          const parsed = matter(value, {
            engines: {
              yaml: (s) => yaml.load(s, { schema: yaml.CORE_SCHEMA }) as Record<string, unknown>,
            },
          })

          // Allow empty frontmatter - it's valid YAML
          // Schema validation happens in hooks where frontmatter is properly parsed and
          // the validation context has access to the full document

          // Validate linked data if enabled
          if (enableLinkedData) {
            // Validate $id if present
            if (parsed.data.$id) {
              try {
                new URL(parsed.data.$id as string)
              } catch {
                return `Field '${name}': $id must be a valid URL`
              }
            }

            // Validate $type if present
            if (parsed.data.$type && typeof parsed.data.$type !== 'string') {
              return `Field '${name}': $type must be a string`
            }
          }
        } catch (error) {
          return `Field '${name}': Invalid frontmatter - ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      }

      return true
    },
  }
}

/**
 * Create multiple MDX fields with shared configuration
 *
 * @param baseConfig - Base configuration for all fields
 * @param fields - Field-specific configurations
 * @returns Array of Payload field configurations
 *
 * @example
 * ```typescript
 * const fields = createMDXFields(
 *   { enableFrontmatter: true, enableLinkedData: true },
 *   [
 *     { name: 'content', label: 'Main Content', required: true },
 *     { name: 'excerpt', label: 'Excerpt' },
 *   ]
 * )
 * ```
 */
export function createMDXFields(baseConfig: Partial<MDXFieldConfig>, fields: Partial<MDXFieldConfig>[]): Field[] {
  return fields.map((fieldConfig) =>
    createMDXField({
      ...baseConfig,
      ...fieldConfig,
      name: fieldConfig.name || 'content',
    } as MDXFieldConfig)
  )
}
