/**
 * Type definitions for blog components
 */

/**
 * Blog post data structure
 */
export interface BlogPostData {
  slug?: string
  title: string
  description: string
  category: string
  image?: string
  markdown?: string
  readingTime?: string
}

/**
 * Props for the BlogCard component
 */
export interface BlogCardProps {
  post: BlogPostData
  compact?: boolean
}

/**
 * Props for the BlogContent component
 */
export interface BlogContentProps {
  markdown: string
}

/**
 * Props for the BlogPost component
 */
export interface BlogPostProps {
  post: BlogPostData
  showRelatedPosts?: boolean
  relatedPosts?: BlogPostData[]
}

/**
 * Props for the BlogList component
 */
export interface BlogListProps {
  context: any
  filters?: boolean
  search?: boolean
  initialPosts?: BlogPostData[]
}
