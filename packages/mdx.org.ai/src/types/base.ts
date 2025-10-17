/**
 * Base MDX types with $ prefix for consistency with mdxld
 */

/**
 * MDX Document metadata
 */
export interface MDXDocument {
  $context?: string | Record<string, any>
  $type: 'MDXDocument'
  $id?: string
  content: string
  frontmatter?: Record<string, any>
  components?: MDXComponent[]
  imports?: MDXImport[]
  exports?: MDXExport[]
}

/**
 * MDX Component definition
 */
export interface MDXComponent {
  name: string
  type: 'function' | 'class' | 'builtin'
  props?: ComponentProp[]
  children?: boolean
  description?: string
}

/**
 * Component property definition
 */
export interface ComponentProp {
  name: string
  type: string
  required?: boolean
  default?: any
  description?: string
}

/**
 * MDX Import statement
 */
export interface MDXImport {
  source: string
  specifiers: ImportSpecifier[]
  type?: 'static' | 'dynamic'
}

/**
 * Import specifier
 */
export interface ImportSpecifier {
  imported: string
  local: string
  type: 'default' | 'named' | 'namespace'
}

/**
 * MDX Export statement
 */
export interface MDXExport {
  name: string
  type: 'default' | 'named'
  value?: any
}

/**
 * MDX Element (JSX element in MDX)
 */
export interface MDXElement {
  type: string
  props?: Record<string, any>
  children?: (MDXElement | string)[]
}

/**
 * MDX Frontmatter schema
 */
export interface Frontmatter {
  $id?: string
  $type?: string | string[]
  $context?: string | Record<string, any>
  title?: string
  description?: string
  author?: string
  date?: string
  tags?: string[]
  [key: string]: any
}

/**
 * MDX AST Node types
 */
export type MDXNodeType =
  | 'root'
  | 'paragraph'
  | 'heading'
  | 'text'
  | 'emphasis'
  | 'strong'
  | 'link'
  | 'image'
  | 'code'
  | 'inlineCode'
  | 'list'
  | 'listItem'
  | 'blockquote'
  | 'thematicBreak'
  | 'html'
  | 'mdxJsxFlowElement'
  | 'mdxJsxTextElement'

/**
 * MDX AST Node
 */
export interface MDXNode {
  type: MDXNodeType
  children?: MDXNode[]
  value?: string
  depth?: number
  ordered?: boolean
  url?: string
  alt?: string
  lang?: string
  meta?: string
  name?: string
  attributes?: MDXAttribute[]
}

/**
 * MDX JSX Attribute
 */
export interface MDXAttribute {
  type: 'mdxJsxAttribute' | 'mdxJsxExpressionAttribute'
  name: string
  value?: string | MDXAttributeValue
}

/**
 * MDX Attribute value types
 */
export interface MDXAttributeValue {
  type: 'mdxJsxAttributeValueExpression'
  value: string
}
