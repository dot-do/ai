import { z } from 'zod'
import type { LinkedDataFrontmatter, MDXWithLinkedData, MDXFlattened } from 'mdxld'
import { parseMDXLD } from 'mdxld'
import { LinkedDataFrontmatterSchema } from './utils.js'

// Export core utilities from utils module
export { LinkedDataFrontmatterSchema, createTypedSchema } from './utils.js'

/**
 * Zod schema for MDXWithLinkedData (nested format)
 */
export const MDXWithLinkedDataSchema = z.object({
  content: z.string(),
  data: LinkedDataFrontmatterSchema,
  isEmpty: z.boolean(),
  excerpt: z.string().optional(),
})

/**
 * Zod schema for MDXFlattened (flattened format)
 */
export const MDXFlattenedSchema = z.object({
  id: z.string().url().optional(),
  type: z.union([z.string(), z.array(z.string())]).optional(),
  context: z.union([z.string(), z.record(z.unknown()), z.array(z.union([z.string(), z.record(z.unknown())]))]).optional(),
  data: z.record(z.unknown()),
  content: z.string(),
  isEmpty: z.boolean(),
  excerpt: z.string().optional(),
})

/**
 * Create a schema builder for custom linked data types
 * @param baseSchema Base schema to extend
 * @returns Builder with type-safe methods
 *
 * @example
 * ```typescript
 * const builder = createSchemaBuilder(z.object({
 *   title: z.string()
 * }))
 *
 * const schema = builder
 *   .withId() // Require $id
 *   .withType('Article') // Require $type: 'Article'
 *   .build()
 * ```
 */
export function createSchemaBuilder<T extends z.ZodRawShape>(baseSchema: z.ZodObject<T>) {
  let currentSchema: z.ZodObject<z.ZodRawShape> = LinkedDataFrontmatterSchema.merge(baseSchema)

  return {
    /**
     * Require $id field
     */
    withId() {
      currentSchema = currentSchema.merge(
        z.object({
          $id: z.string().url(),
        })
      )
      return this
    },

    /**
     * Require $type field with specific value
     */
    withType(type: string) {
      currentSchema = currentSchema.merge(
        z.object({
          $type: z.literal(type),
        })
      )
      return this
    },

    /**
     * Require $context field
     */
    withContext(context?: string) {
      if (context) {
        currentSchema = currentSchema.merge(
          z.object({
            $context: z.literal(context),
          })
        )
      } else {
        currentSchema = currentSchema.merge(
          z.object({
            $context: z.union([z.string(), z.record(z.unknown()), z.array(z.union([z.string(), z.record(z.unknown())]))]),
          })
        )
      }
      return this
    },

    /**
     * Build the final schema
     */
    build() {
      return currentSchema
    },
  }
}

/**
 * Validate MDX content against a Zod schema
 * @param content MDX content string
 * @param schema Zod schema to validate against
 * @returns Validation result with typed data or errors
 *
 * @example
 * ```typescript
 * import { parseMDXLD } from 'mdxld'
 * import { validateWithSchema, createTypedSchema } from '@mdxld/zod'
 * import { z } from 'zod'
 *
 * const BlogPostSchema = createTypedSchema('BlogPost', z.object({
 *   title: z.string(),
 *   author: z.string()
 * }))
 *
 * const mdx = parseMDXLD(content)
 * const result = validateWithSchema(mdx.data, BlogPostSchema)
 *
 * if (result.success) {
 *   console.log(result.data.title) // Type-safe!
 * } else {
 *   console.error(result.error.errors)
 * }
 * ```
 */
export function validateWithSchema<T extends z.ZodTypeAny>(data: LinkedDataFrontmatter, schema: T): z.SafeParseReturnType<LinkedDataFrontmatter, z.infer<T>> {
  return schema.safeParse(data)
}

/**
 * Parse and validate MDX content in one step
 * @param content MDX content string
 * @param schema Zod schema to validate against
 * @returns Validation result with parsed and typed data
 *
 * @example
 * ```typescript
 * import { parseAndValidate, createTypedSchema } from '@mdxld/zod'
 * import { z } from 'zod'
 *
 * const BlogPostSchema = createTypedSchema('BlogPost', z.object({
 *   title: z.string(),
 *   author: z.string()
 * }))
 *
 * const result = parseAndValidate(mdxContent, BlogPostSchema)
 *
 * if (result.success) {
 *   console.log(result.data.data.title) // Type-safe frontmatter
 *   console.log(result.data.content) // MDX content
 * }
 * ```
 */
export function parseAndValidate<T extends z.ZodTypeAny>(content: string, schema: T): z.SafeParseReturnType<MDXWithLinkedData, MDXWithLinkedData> {
  const parsed = parseMDXLD(content)

  const frontmatterValidation = schema.safeParse(parsed.data)
  if (!frontmatterValidation.success) {
    return {
      success: false,
      error: frontmatterValidation.error,
    }
  }

  return {
    success: true,
    data: parsed,
  }
}

// Re-export types from mdxld for convenience
export type { LinkedDataFrontmatter, MDXWithLinkedData, MDXFlattened } from 'mdxld'

// Export pre-built schemas
export * from './schemas.js'
