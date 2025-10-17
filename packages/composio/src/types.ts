/**
 * Type definitions for Composio client
 */

/**
 * Composio client configuration
 */
export interface ComposioConfig {
  /**
   * Composio API key (can also be set via COMPOSIO_API_KEY environment variable)
   */
  apiKey?: string

  /**
   * Base URL for Composio API (defaults to https://backend.composio.dev/api/v3)
   */
  baseUrl?: string

  /**
   * Maximum number of retry attempts for failed requests
   * @default 3
   */
  maxRetries?: number

  /**
   * Base delay in milliseconds for exponential backoff
   * @default 1000
   */
  retryDelay?: number

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number
}

/**
 * App/Integration metadata
 */
export interface ComposioApp {
  key: string
  name: string
  description: string
  logo?: string
  categories: string[]
  appId: string
  auth_schemes: string[]
  testConnectors: boolean
  no_auth: boolean
}

/**
 * Action/Tool metadata
 */
export interface ComposioAction {
  name: string
  appName: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
  response: {
    type: 'object'
    properties: Record<string, any>
  }
}

/**
 * Trigger metadata
 */
export interface ComposioTrigger {
  id: string
  name: string
  appName: string
  description: string
  payload?: Record<string, any>
  config?: Record<string, any>
}

/**
 * Connected account
 */
export interface ComposioConnectedAccount {
  id: string
  userId: string
  appName: string
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'REVOKED'
  createdAt: string
  updatedAt: string
}

/**
 * Trigger event payload
 */
export interface ComposioTriggerEvent<T = any> {
  trigger_name: string
  trigger_id: string
  connected_account_id: string
  payload: T
}

/**
 * Pagination info
 */
export interface PageInfo {
  total: number
  page: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

/**
 * List response wrapper
 */
export interface ListResponse<T> {
  items: T[]
  pageInfo: PageInfo
}

/**
 * List filters
 */
export interface ListFilters {
  page?: number
  pageSize?: number
  search?: string
}

/**
 * Action execution options
 */
export interface ExecuteActionOptions {
  actionName: string
  userId?: string
  connectedAccountId?: string
  params: Record<string, any>
  auth?: CustomAuth
}

/**
 * Custom authentication credentials
 */
export interface CustomAuth {
  type: 'api_key' | 'bearer' | 'basic'
  value: string | { username: string; password: string }
}

/**
 * Trigger setup options
 */
export interface SetupTriggerOptions {
  userId: string
  triggerName: string
  config?: Record<string, any>
}

/**
 * Connection initiation options
 */
export interface InitiateConnectionOptions {
  userId: string
  authConfigId: string
  redirectUrl?: string
  allowMultiple?: boolean
}

/**
 * Connection result
 */
export interface ConnectionResult {
  redirectUrl: string
  connectionId: string
}
