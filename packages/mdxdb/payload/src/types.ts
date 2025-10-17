/**
 * Type definitions for @mdxdb/payload
 *
 * Provides TypeScript types for MDX content management in Payload CMS
 */

import type { z } from 'zod'

/**
 * MDX document with frontmatter and content
 */
export interface MDXDocument {
  /** Frontmatter data */
  readonly data: Readonly<Record<string, unknown>>
  /** MDX content body */
  readonly content: string
  /** Optional compiled MDX output */
  readonly compiled?: string
  /** Optional excerpt */
  readonly excerpt?: string
}

/**
 * MDX document with linked data
 */
export interface MDXLinkedDocument extends MDXDocument {
  data: {
    /** Unique identifier (URI) */
    $id?: string
    /** Schema.org type */
    $type?: string
    [key: string]: unknown
  }
}

/**
 * MDX field configuration for Payload
 *
 * @remarks
 * When enableLinkedData is true, frontmatter should include `$id` (a valid URL) and
 * optionally `$type` (a Schema.org type string). If using a schema, consider requiring
 * these fields in your Zod schema when enableLinkedData is enabled.
 *
 * @example
 * ```typescript
 * const LinkedDataSchema = z.object({
 *   $id: z.string().url(),
 *   $type: z.string(),
 *   title: z.string(),
 * })
 * ```
 */
export interface MDXFieldConfig {
  /** Field name - must be a valid identifier (letters, numbers, underscores, starting with letter or underscore) */
  name: string
  /** Field label displayed in admin UI */
  label?: string
  /** Whether the field is required */
  required?: boolean
  /** Enable frontmatter parsing and editing */
  enableFrontmatter?: boolean
  /**
   * Enable linked data support (requires $id and optionally $type in frontmatter)
   * When enabled, validates that $id is a valid URL if present
   */
  enableLinkedData?: boolean
  /**
   * Zod schema for frontmatter validation
   * Validation occurs in hooks where the full document context is available
   * Consider requiring $id and $type when enableLinkedData is true
   */
  schema?: z.ZodSchema
  /** Default frontmatter values to populate new documents */
  defaultFrontmatter?: Record<string, unknown>
  /** Admin UI configuration */
  admin?: {
    /** Field description shown in admin UI */
    description?: string
    /** Editor language for syntax highlighting */
    language?: string
    /** Whether the field is read-only */
    readOnly?: boolean
  }
}

/**
 * Parsed MDX frontmatter
 *
 * @remarks
 * Result of parsing MDX content with gray-matter. The data object contains
 * the parsed YAML frontmatter, content is the MDX body without frontmatter,
 * and frontmatter is the raw YAML string.
 */
export interface ParsedFrontmatter {
  /** Parsed frontmatter data as key-value pairs */
  data: Record<string, unknown>
  /** MDX content without the frontmatter block */
  content: string
  /** Raw frontmatter string (YAML) */
  frontmatter: string
}

/**
 * MDX validation result
 */
export interface ValidationResult {
  /** Is MDX valid */
  readonly valid: boolean
  /** Validation errors */
  readonly errors: readonly ValidationError[]
}

/**
 * Validation error
 */
export interface ValidationError {
  /** Error message */
  readonly message: string
  /** Field path */
  readonly path?: readonly string[]
  /** Error code */
  readonly code?: string
}

/**
 * Plugin type from unified ecosystem
 * Represents a plugin that can be used with remark or rehype
 */
export type Pluggable = unknown

/**
 * MDX compilation options
 */
export interface CompileOptions {
  /** MDX source */
  readonly source: string
  /** Remark plugins for processing Markdown AST */
  readonly remarkPlugins?: readonly Pluggable[]
  /** Rehype plugins for processing HTML AST */
  readonly rehypePlugins?: readonly Pluggable[]
  /** Output format */
  readonly outputFormat?: 'function-body' | 'program'
}

/**
 * MDX compilation result
 */
export interface CompileResult {
  /** Compiled code */
  readonly code: string
  /** Source map (if generated) */
  readonly map?: unknown
  /** Frontmatter extracted from MDX */
  readonly frontmatter?: Readonly<Record<string, unknown>>
}

/**
 * MDX hook context
 */
export interface MDXHookContext {
  /** Original MDX value */
  value: string
  /** Parsed frontmatter */
  frontmatter?: Record<string, unknown>
  /** Compiled MDX */
  compiled?: string
  /** Parent document */
  doc?: Record<string, unknown>
}

/**
 * MDX before validate hook
 */
export type MDXBeforeValidate = (args: {
  data: Record<string, unknown>
  originalDoc?: Record<string, unknown>
}) => Record<string, unknown> | Promise<Record<string, unknown>>

/**
 * MDX after read hook
 */
export type MDXAfterRead = (args: { value: string; doc: Record<string, unknown> }) => string | Promise<string>

/**
 * MDX hooks configuration
 */
export interface MDXHooks {
  beforeValidate?: MDXBeforeValidate[]
  afterRead?: MDXAfterRead[]
}
