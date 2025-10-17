/**
 * Notion Types
 *
 * Auto-generated TypeScript types for Notion Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/notion
 */

/**
 * Notion client options
 */
export interface NotionClientOptions {
  /** OAuth2 access token */
  accessToken: string
  /** Base URL override (optional) */
  baseUrl?: string
  /** Request timeout in milliseconds (optional) */
  timeout?: number
  /** Number of retry attempts (optional) */
  retryAttempts?: number
}

/**
 * Page resource types
 */
/**
 * Parameters for Page.create
 */
export interface PageCreateParams {
  /** Page creation parameters (parent, properties, children) */
  params: any
}

/**
 * Parameters for Page.get
 */
export interface PageGetParams {
  /** Page ID */
  pageId: string
}

/**
 * Parameters for Page.update
 */
export interface PageUpdateParams {
  /** Page ID */
  pageId: string
  /** Page update parameters (properties, archived, icon, cover) */
  params: any
}

/**
 * Parameters for Page.archive
 */
export interface PageArchiveParams {
  /** Page ID */
  pageId: string
}

/**
 * Parameters for Page.list
 */
export interface PageListParams {
  /** List options (pagination) */
  options?: any
}

/**
 * Parameters for Page.search
 */
export interface PageSearchParams {
  /** Search query text */
  query?: string
  /** Search options (filter, sort, pagination) */
  options?: any
}

/**
 * Database resource types
 */
/**
 * Parameters for Database.create
 */
export interface DatabaseCreateParams {
  /** Database creation parameters (parent, title, properties) */
  params: any
}

/**
 * Parameters for Database.get
 */
export interface DatabaseGetParams {
  /** Database ID */
  databaseId: string
}

/**
 * Parameters for Database.update
 */
export interface DatabaseUpdateParams {
  /** Database ID */
  databaseId: string
  /** Database update parameters (title, description, properties) */
  params: any
}

/**
 * Parameters for Database.query
 */
export interface DatabaseQueryParams {
  /** Database ID */
  databaseId: string
  /** Query parameters (filter, sorts, pagination) */
  params?: any
}

/**
 * Parameters for Database.archive
 */
export interface DatabaseArchiveParams {
  /** Database ID */
  databaseId: string
}

/**
 * Block resource types
 */
/**
 * Parameters for Block.get
 */
export interface BlockGetParams {
  /** Block ID */
  blockId: string
}

/**
 * Parameters for Block.update
 */
export interface BlockUpdateParams {
  /** Block ID */
  blockId: string
  /** Block update parameters */
  params: any
}

/**
 * Parameters for Block.delete
 */
export interface BlockDeleteParams {
  /** Block ID */
  blockId: string
}

/**
 * Parameters for Block.append
 */
export interface BlockAppendParams {
  /** Parent block or page ID */
  blockId: string
  /** Blocks to append (children array) */
  params: any
}

/**
 * Parameters for Block.getChildren
 */
export interface BlockGetChildrenParams {
  /** Parent block ID */
  blockId: string
  /** List options (pagination) */
  options?: any
}

/**
 * User resource types
 */
/**
 * Parameters for User.get
 */
export interface UserGetParams {
  /** User ID */
  userId: string
}

/**
 * Parameters for User.list
 */
export interface UserListParams {
  /** List options (pagination) */
  options?: any
}

/**
 * Comment resource types
 */
/**
 * Parameters for Comment.create
 */
export interface CommentCreateParams {
  /** Comment creation parameters (parent, rich_text) */
  params: any
}

/**
 * Parameters for Comment.list
 */
export interface CommentListParams {
  /** Page or discussion ID */
  blockId: string
  /** List options (pagination) */
  options?: any
}

/**
 * Search resource types
 */
/**
 * Parameters for Search.query
 */
export interface SearchQueryParams {
  /** Search options (query, filter, sort, pagination) */
  options?: any
}

/**
 * SDK type re-exports
 */
export type * from '@notionhq/client'
