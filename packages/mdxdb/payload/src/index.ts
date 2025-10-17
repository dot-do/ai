/**
 * @mdxdb/payload - Payload CMS integration for MDX content management
 *
 * Provides Payload field types, hooks, and utilities for managing MDX content
 * with frontmatter, schema validation, and linked data support.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { createMDXField, createParseFrontmatterHook } from '@mdxdb/payload'
 * import { z } from 'zod'
 *
 * const PostSchema = z.object({
 *   title: z.string(),
 *   date: z.date(),
 *   tags: z.array(z.string()),
 * })
 *
 * export const BlogPosts = {
 *   slug: 'blog-posts',
 *   fields: [
 *     {
 *       name: 'title',
 *       type: 'text',
 *       required: true,
 *     },
 *     createMDXField({
 *       name: 'content',
 *       label: 'Content',
 *       required: true,
 *       enableFrontmatter: true,
 *       enableLinkedData: true,
 *       schema: PostSchema,
 *     }),
 *   ],
 *   hooks: {
 *     beforeValidate: [
 *       createParseFrontmatterHook('content', PostSchema),
 *     ],
 *   },
 * }
 * ```
 */

// Types
export type {
  MDXDocument,
  MDXLinkedDocument,
  MDXFieldConfig,
  ParsedFrontmatter,
  ValidationResult,
  ValidationError,
  CompileOptions,
  CompileResult,
  MDXHookContext,
  MDXBeforeValidate,
  MDXAfterRead,
  MDXHooks,
} from './types.js'

// Fields
export { createMDXField, createMDXFields } from './fields/index.js'

// Hooks
export { parseFrontmatter, createParseFrontmatterHook, createLinkedDataHook } from './hooks/index.js'
