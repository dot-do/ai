/**
 * MDX specification data and constants
 */

/**
 * Standard MDX component names
 */
export const STANDARD_COMPONENTS = [
  'a',
  'blockquote',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  'strong',
  'ul',
] as const

/**
 * MDX reserved props
 */
export const RESERVED_PROPS = ['children', 'components', 'key', 'ref'] as const

/**
 * MDX file extensions
 */
export const MDX_EXTENSIONS = ['.mdx', '.md'] as const

/**
 * Common frontmatter fields
 */
export const FRONTMATTER_FIELDS = {
  id: '$id',
  type: '$type',
  context: '$context',
  title: 'title',
  description: 'description',
  author: 'author',
  date: 'date',
  tags: 'tags',
  slug: 'slug',
  draft: 'draft',
  published: 'published',
} as const

/**
 * MDX content types
 */
export const CONTENT_TYPES = {
  document: 'MDXDocument',
  component: 'MDXComponent',
  fragment: 'MDXFragment',
  element: 'MDXElement',
} as const
