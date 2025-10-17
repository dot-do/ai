import { z } from 'zod'

/**
 * Zod schema for LinkedDataFrontmatter
 * Validates the core linked data properties with $ prefix
 */
export const LinkedDataFrontmatterSchema = z
  .object({
    /**
     * Unique identifier for this document (JSON-LD @id equivalent)
     */
    $id: z.string().url().optional(),

    /**
     * The type(s) of this document (JSON-LD @type equivalent)
     */
    $type: z.union([z.string(), z.array(z.string())]).optional(),

    /**
     * The context for interpreting the data (JSON-LD @context equivalent)
     */
    $context: z.union([z.string(), z.record(z.unknown()), z.array(z.union([z.string(), z.record(z.unknown())]))]).optional(),
  })
  .passthrough() // Allow additional properties

/**
 * Create a typed frontmatter schema with required type
 * @param type The required $type value
 * @param schema Additional properties schema
 * @returns Zod schema with type validation
 *
 * @example
 * ```typescript
 * const BlogPostSchema = createTypedSchema('BlogPost', z.object({
 *   title: z.string(),
 *   author: z.string(),
 *   publishedAt: z.string().datetime()
 * }))
 * ```
 */
export function createTypedSchema<T extends z.ZodRawShape>(type: string, schema: z.ZodObject<T>) {
  return LinkedDataFrontmatterSchema.merge(
    z.object({
      $type: z.literal(type),
    })
  ).merge(schema)
}
