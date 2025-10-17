/**
 * OneDrive Types
 *
 * Auto-generated TypeScript types for OneDrive Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/onedrive
 */

/**
 * OneDrive client options
 */
export interface OnedriveClientOptions {
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
 * Drive resource types
 */

/**
 * File resource types
 */
/**
 * Parameters for File.upload
 */
export interface FileUploadParams {
  /** File path in OneDrive */
  file_path: string
  /** File contents */
  content: any
}

/**
 * Parameters for File.get
 */
export interface FileGetParams {
  /** Item ID */
  item_id: string
}

/**
 * Parameters for File.download
 */
export interface FileDownloadParams {
  /** Item ID */
  item_id: string
}

/**
 * Parameters for File.update
 */
export interface FileUpdateParams {
  /** Item ID */
  item_id: string
  /** New file name */
  name?: string
  /** File description */
  description?: string
}

/**
 * Parameters for File.delete
 */
export interface FileDeleteParams {
  /** Item ID */
  item_id: string
}

/**
 * Parameters for File.copy
 */
export interface FileCopyParams {
  /** Item ID */
  item_id: string
  /** Destination folder reference */
  parentReference: Record<string, any>
  /** New file name */
  name?: string
}

/**
 * Parameters for File.move
 */
export interface FileMoveParams {
  /** Item ID */
  item_id: string
  /** New parent folder */
  parentReference: Record<string, any>
  /** New file name */
  name?: string
}

/**
 * Folder resource types
 */
/**
 * Parameters for Folder.create
 */
export interface FolderCreateParams {
  /** Parent folder ID (root for root folder) */
  parent_id: string
  /** Folder name */
  name: string
  /** Folder facet (empty object) */
  folder: Record<string, any>
}

/**
 * Parameters for Folder.get
 */
export interface FolderGetParams {
  /** Folder ID */
  item_id: string
}

/**
 * Parameters for Folder.list
 */
export interface FolderListParams {
  /** Folder ID (root for root folder) */
  item_id: string
}

/**
 * Parameters for Folder.delete
 */
export interface FolderDeleteParams {
  /** Folder ID */
  item_id: string
}

/**
 * SharedLink resource types
 */
/**
 * Parameters for SharedLink.create
 */
export interface SharedLinkCreateParams {
  /** Item ID */
  item_id: string
  /** Link type (view, edit, embed) */
  type: string
  /** Scope (anonymous, organization) */
  scope?: string
}

/**
 * Parameters for SharedLink.list
 */
export interface SharedLinkListParams {
  /** Item ID */
  item_id: string
}

/**
 * Parameters for SharedLink.delete
 */
export interface SharedLinkDeleteParams {
  /** Item ID */
  item_id: string
  /** Permission ID */
  permission_id: string
}

/**
 * Subscription resource types
 */
/**
 * Parameters for Subscription.create
 */
export interface SubscriptionCreateParams {
  /** Change type (created, updated, deleted) */
  changeType: string
  /** Webhook URL */
  notificationUrl: string
  /** Resource path (e.g., /me/drive/root) */
  resource: string
  /** Subscription expiry (max 6 months) */
  expirationDateTime: string
}

/**
 * Parameters for Subscription.get
 */
export interface SubscriptionGetParams {
  /** Subscription ID */
  subscription_id: string
}

/**
 * Parameters for Subscription.update
 */
export interface SubscriptionUpdateParams {
  /** Subscription ID */
  subscription_id: string
  /** New expiry date */
  expirationDateTime: string
}

/**
 * Parameters for Subscription.delete
 */
export interface SubscriptionDeleteParams {
  /** Subscription ID */
  subscription_id: string
}

/**
 * SDK type re-exports
 */
export type * from '@microsoft/microsoft-graph-client'
