/**
 * Linked Data frontmatter properties
 * All use $ prefix instead of @ for consistency
 */
export interface LinkedDataFrontmatter {
  /**
   * Unique identifier for this document (JSON-LD @id equivalent)
   */
  $id?: string

  /**
   * The type(s) of this document (JSON-LD @type equivalent)
   */
  $type?: string | string[]

  /**
   * The context for interpreting the data (JSON-LD @context equivalent)
   */
  $context?: string | Record<string, any> | Array<string | Record<string, any>>

  /**
   * Additional properties
   */
  [key: string]: any
}

/**
 * MDX file with parsed frontmatter (nested format)
 */
export interface MDXWithLinkedData {
  content: string
  data: LinkedDataFrontmatter
  isEmpty: boolean
  excerpt?: string
}

/**
 * MDX file with flattened linked data format
 * Separates id, type, and other data for cleaner API
 */
export interface MDXFlattened {
  id?: string
  type?: string | string[]
  context?: string | Record<string, any> | Array<string | Record<string, any>>
  data: Record<string, any>
  content: string
  isEmpty: boolean
  excerpt?: string
}

/**
 * Validation result for linked data
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Options for parsing MDX with linked data
 */
export interface ParseOptions {
  /**
   * Validate $id is a valid URI
   */
  validateId?: boolean

  /**
   * Validate $type is present
   */
  requireType?: boolean

  /**
   * Custom context to merge with document context
   */
  defaultContext?: string | Record<string, any>
}
