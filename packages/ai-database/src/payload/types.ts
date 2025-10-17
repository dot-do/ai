/**
 * Payload CMS integration types for ai-database
 *
 * These types support Payload CMS running on Cloudflare Durable Objects
 * with the @payloadcms/db-do-sqlite adapter.
 */

// Type imports - these will be available at runtime in Cloudflare Workers
type DurableObjectState = import('@cloudflare/workers-types').DurableObjectState
type Fetcher = import('@cloudflare/workers-types').Fetcher

/**
 * Database metadata from central Payload CMS
 */
export interface DatabaseMetadata {
  id: string
  name: string
  slug: string
  type: string
  status: string
  tenant: {
    type: string
    tenantId: string
  }
  durableObject: {
    doId: string
    namespace: string
    endpoint: string
  }
  payload?: PayloadConfig
}

/**
 * Payload CMS configuration for a database
 */
export interface PayloadConfig {
  enabled: boolean
  collections: Array<{
    slug: string
    enabled: boolean
  }>
  adminPath: string
  apiPath: string
}

/**
 * Payload initialization options
 */
export interface PayloadInitOptions {
  /** Durable Object state */
  state: DurableObjectState
  /** Payload secret for encryption */
  secret: string
  /** Database metadata */
  metadata: DatabaseMetadata
  /** Enable debug logging */
  debug?: boolean
}

/**
 * Payload instance wrapper
 */
export interface PayloadInstance {
  /** The initialized Payload instance */
  payload: any
  /** Whether Payload is enabled */
  enabled: boolean
  /** Configuration used */
  config: PayloadConfig
  /** Handle HTTP requests */
  handleRequest: (request: Request) => Promise<Response>
}

/**
 * Metadata fetch options
 */
export interface MetadataFetchOptions {
  /** Payload admin binding */
  payloadBinding: Fetcher
  /** Durable Object ID */
  doId: string
  /** Cache TTL in seconds (default: no cache) */
  cacheTtl?: number
}

/**
 * Metadata fetch result
 */
export interface MetadataFetchResult {
  /** Fetched metadata */
  metadata: DatabaseMetadata
  /** Whether metadata was fetched from cache */
  fromCache: boolean
}

/**
 * Payload environment bindings
 */
export interface PayloadEnv {
  /** Central Payload CMS binding */
  PAYLOAD: Fetcher
  /** Payload secret */
  PAYLOAD_SECRET: string
  /** API worker for authentication */
  API?: Fetcher
  /** Pipeline worker for events */
  PIPELINE?: Fetcher
}
