/**
 * Services-as-Software core types and abstractions
 */

/**
 * Service definition
 */
export interface Service {
  /**
   * Unique service identifier
   */
  id: string

  /**
   * Service name
   */
  name: string

  /**
   * Description
   */
  description?: string

  /**
   * Service version
   */
  version: string

  /**
   * Service endpoints/operations
   */
  operations: ServiceOperation[]

  /**
   * Service dependencies
   */
  dependencies?: string[]

  /**
   * Service configuration
   */
  config?: Record<string, any>

  /**
   * Metadata
   */
  metadata?: ServiceMetadata
}

/**
 * Service operation (endpoint)
 */
export interface ServiceOperation {
  /**
   * Operation name
   */
  name: string

  /**
   * HTTP method
   */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

  /**
   * URL path
   */
  path: string

  /**
   * Input schema
   */
  input?: Record<string, any>

  /**
   * Output schema
   */
  output?: Record<string, any>

  /**
   * Operation handler
   */
  handler?: (input: any) => Promise<any> | any

  /**
   * Authentication required
   */
  auth?: boolean

  /**
   * Rate limiting
   */
  rateLimit?: {
    requests: number
    window: string
  }
}

/**
 * Service metadata
 */
export interface ServiceMetadata {
  /**
   * Owner/team
   */
  owner?: string

  /**
   * Tags
   */
  tags?: string[]

  /**
   * Documentation URL
   */
  docs?: string

  /**
   * Health check endpoint
   */
  healthCheck?: string

  /**
   * SLA
   */
  sla?: {
    uptime: number // percentage
    responseTime: number // milliseconds
  }
}

/**
 * Service deployment
 */
export interface ServiceDeployment {
  /**
   * Deployment identifier
   */
  id: string

  /**
   * Service being deployed
   */
  serviceId: string

  /**
   * Environment
   */
  environment: 'development' | 'staging' | 'production'

  /**
   * Deployment status
   */
  status: 'pending' | 'deploying' | 'deployed' | 'failed' | 'rolled_back'

  /**
   * Base URL where service is deployed
   */
  url?: string

  /**
   * When deployed
   */
  deployedAt?: string

  /**
   * Deployment configuration
   */
  config?: {
    region?: string
    replicas?: number
    resources?: {
      cpu?: string
      memory?: string
    }
  }
}

/**
 * Service request
 */
export interface ServiceRequest<T = any> {
  /**
   * Request identifier
   */
  id: string

  /**
   * Service operation
   */
  operation: string

  /**
   * Request input
   */
  input: T

  /**
   * Request metadata
   */
  metadata?: {
    userId?: string
    sessionId?: string
    timestamp?: string
    [key: string]: any
  }
}

/**
 * Service response
 */
export interface ServiceResponse<T = any> {
  /**
   * Request identifier
   */
  requestId: string

  /**
   * Response status
   */
  status: 'success' | 'error'

  /**
   * Response data
   */
  data?: T

  /**
   * Error information
   */
  error?: {
    code: string
    message: string
    details?: any
  }

  /**
   * Response metadata
   */
  metadata?: {
    timestamp?: string
    duration?: number
    [key: string]: any
  }
}

/**
 * Service integration
 */
export interface ServiceIntegration {
  /**
   * Integration identifier
   */
  id: string

  /**
   * Source service
   */
  source: string

  /**
   * Target service
   */
  target: string

  /**
   * Integration type
   */
  type: 'sync' | 'async' | 'event' | 'webhook'

  /**
   * Mapping configuration
   */
  mapping?: {
    input?: Record<string, string>
    output?: Record<string, string>
  }

  /**
   * Status
   */
  enabled: boolean
}

/**
 * Service registry entry
 */
export interface ServiceRegistryEntry {
  /**
   * Service identifier
   */
  serviceId: string

  /**
   * Service name
   */
  name: string

  /**
   * Service version
   */
  version: string

  /**
   * Base URL
   */
  url: string

  /**
   * Health status
   */
  health: 'healthy' | 'unhealthy' | 'unknown'

  /**
   * When registered
   */
  registeredAt: string

  /**
   * Last heartbeat
   */
  lastHeartbeat?: string
}

/**
 * Service mesh configuration
 */
export interface ServiceMesh {
  /**
   * Services in the mesh
   */
  services: string[]

  /**
   * Service communication policies
   */
  policies?: {
    retry?: {
      attempts: number
      backoff: string
    }
    timeout?: number
    circuitBreaker?: {
      threshold: number
      timeout: number
    }
  }

  /**
   * Service discovery
   */
  discovery?: {
    enabled: boolean
    registry?: string
  }

  /**
   * Observability
   */
  observability?: {
    tracing?: boolean
    metrics?: boolean
    logging?: boolean
  }
}

/**
 * API Gateway route
 */
export interface GatewayRoute {
  /**
   * Route path
   */
  path: string

  /**
   * HTTP method
   */
  method: string

  /**
   * Target service
   */
  service: string

  /**
   * Target operation
   */
  operation: string

  /**
   * Authentication
   */
  auth?: {
    required: boolean
    type?: 'bearer' | 'apikey' | 'oauth2'
  }

  /**
   * Rate limiting
   */
  rateLimit?: {
    requests: number
    window: string
  }

  /**
   * Caching
   */
  cache?: {
    ttl: number
    key?: string
  }
}
