/**
 * Integration Schema
 *
 * Complete TypeScript interface for MDXLD Integration definitions.
 * These types define the structure of Integration metadata extracted
 * from MDX frontmatter.
 */

/**
 * Main Integration interface
 */
export interface Integration {
  $id: string
  $type: 'Integration'
  name: string
  service: string
  category: IntegrationCategory
  description: string
  auth: AuthConfig
  sdkBased?: boolean // If true, uses SDK wrapper pattern instead of REST
  sdkPackage?: string // NPM package name for SDK
  sdkVersion?: string // SDK version constraint
  sdkImport?: string // Default export or named import from SDK
  baseUrl?: string // Base URL for REST APIs (required if !sdkBased)
  apiVersion?: string // API version string
  resources: Resource[]
  rateLimit?: RateLimitConfig
  webhooks?: WebhookConfig
  errors?: ErrorConfig
  tests?: TestConfig
  docs?: DocsConfig
}

/**
 * Integration category types
 */
export type IntegrationCategory =
  | 'payments'
  | 'crm'
  | 'communication'
  | 'storage'
  | 'analytics'
  | 'accounting'
  | 'marketing'
  | 'support'
  | 'developer-tools'
  | 'productivity'
  | 'ecommerce'
  | 'hr'
  | 'logistics'

/**
 * Authentication configuration
 */
export interface AuthConfig {
  type: 'api-key' | 'oauth2' | 'jwt' | 'basic'
  location?: 'header' | 'query' | 'body'
  headerName?: string
  queryParam?: string
  scheme?: string
  oauth2?: OAuth2Config
}

/**
 * OAuth2 configuration
 */
export interface OAuth2Config {
  authorizationUrl: string
  tokenUrl: string
  scopes: string[]
  grantType?: 'authorization_code' | 'client_credentials' | 'password' | 'refresh_token'
}

/**
 * Resource definition
 */
export interface Resource {
  name: string
  plural?: string // Plural form of resource name
  endpoint?: string // REST API endpoint (required if !sdkBased)
  sdkPath?: string // SDK path (e.g., 'customers' for stripe.customers)
  description?: string
  operations: Operation[]
}

/**
 * Operation definition
 */
export interface Operation {
  name: string // Operation name (e.g., 'create', 'retrieve', 'list')
  type?: 'create' | 'retrieve' | 'update' | 'delete' | 'list' | 'custom'
  method?: string // HTTP method (GET/POST/etc) OR SDK method name
  path?: string // REST API path (required if !sdkBased)
  description?: string
  params?: ParamConfig[]
  pagination?: PaginationConfig
  returns?: string // Return type
}

/**
 * Parameter configuration
 */
export interface ParamConfig {
  name: string
  type: string // Primitive (string/number/boolean/object/array) or SDK type (Stripe.Customer)
  required?: boolean
  description?: string
  default?: any
  validation?: {
    min?: number
    max?: number
    pattern?: string
    enum?: string[]
  }
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  type: 'offset' | 'cursor' | 'page'
  limitParam?: string
  offsetParam?: string
  cursorParam?: string
  pageParam?: string
  defaultLimit?: number
  maxLimit?: number
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  requestsPerSecond?: number
  requestsPerMinute?: number
  requestsPerHour?: number
  burstSize?: number
  retryAfterHeader?: string
}

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  enabled: boolean
  signatureHeader?: string
  signatureAlgorithm?: 'sha1' | 'sha256' | 'sha512' | 'md5' | 'ed25519'
  events: WebhookEvent[]
  verificationMethod?: 'signature' | 'secret' | 'none'
}

/**
 * Webhook event definition
 */
export interface WebhookEvent {
  name: string
  type: string
  description?: string
  payloadSchema?: string
}

/**
 * Error configuration
 */
export interface ErrorConfig {
  mapping: ErrorMapping[]
  retryable?: (string | number)[]
  nonRetryable?: (string | number)[]
}

/**
 * Error mapping definition
 */
export interface ErrorMapping {
  code: string | number
  statusCode?: number
  type: 'authentication' | 'authorization' | 'validation' | 'not_found' | 'rate_limit' | 'server' | 'network' | 'unknown'
  message?: string
  retryable?: boolean
}

/**
 * Test configuration
 */
export interface TestConfig {
  enabled: boolean
  scenarios: TestScenario[]
  cleanup?: boolean
}

/**
 * Test scenario definition
 */
export interface TestScenario {
  name: string
  description?: string
  steps: TestStep[]
  skipIf?: string
}

/**
 * Test step definition
 */
export interface TestStep {
  action: 'create' | 'retrieve' | 'update' | 'delete' | 'list' | 'assert' | 'custom'
  resource?: string
  params?: Record<string, any>
  expects?: {
    status?: number
    fields?: Record<string, any>
    count?: number
  }
}

/**
 * Documentation configuration
 */
export interface DocsConfig {
  apiReference?: string
  authentication?: string
  webhooks?: string
  rateLimits?: string
  examples?: string
}
