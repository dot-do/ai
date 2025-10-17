/**
 * SDK Types for .do platform
 */

import type $ from 'graphdl'
import type { OnService } from './on'
import type { HTTPClient } from './http'

export type { OnService }

export interface RPCClientOptions {
  baseUrl?: string
  apiKey?: string
  headers?: Record<string, string>
  env?: any // Cloudflare Workers env binding
}

export interface RPCRequest {
  service: string
  method: string
  params?: any
}

export interface RPCResponse<T = unknown> {
  success: boolean
  result?: T
  error?: {
    message: string
    code?: string
    stack?: string
  }
}

/**
 * Service interfaces matching the workers
 */

// DBService is now fully implemented in db.ts
// Import { DatabaseService } from './db' for the complete implementation

// AIService is now fully implemented in ai.ts
// Import { AIService } from './ai' for the complete implementation

export interface AuthService {
  validateToken(token: string): Promise<{ valid: boolean; user?: any }>
  createSession(userId: string): Promise<any>
  createApiKey(name: string, permissions?: string[]): Promise<any>
  checkPermission(permission: string): Promise<boolean>
}

export type DateString = string & { readonly __brand: 'DateString' }

/**
 * Validates if a string is a valid ISO 8601 date
 * @param date - The string to validate
 * @returns True if the date is valid ISO 8601 format with valid date/time values
 *
 * Accepts ISO 8601 formats:
 * - YYYY-MM-DDTHH:MM:SSZ
 * - YYYY-MM-DDTHH:MM:SS.sssZ (with milliseconds)
 * - YYYY-MM-DDTHH:MM:SS±HH:MM (with timezone offset)
 * - YYYY-MM-DDTHH:MM:SS.sss±HH:MM (with both)
 */
export function isValidDateString(date: string): date is DateString {
  // Check format with regex (accepts optional milliseconds and timezone)
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/.test(date)) return false

  // Parse the date
  const parsed = Date.parse(date)
  if (isNaN(parsed)) return false

  // Validate the parsed date can be reconstructed to the same date
  // This ensures that dates like 2025-02-30 (which JavaScript auto-corrects to March 2)
  // are rejected as invalid
  const parsedDate = new Date(parsed)
  const isoString = parsedDate.toISOString()

  // Extract the date components from the original string
  const [datePart] = date.split('T')
  const [isoDatePart] = isoString.split('T')

  // Compare just the date portion (YYYY-MM-DD) to catch invalid dates
  return datePart === isoDatePart
}

/**
 * Creates a DateString from a Date object
 * @param date - The Date object to convert
 * @returns ISO 8601 DateString
 */
export function toDateString(date: Date = new Date()): DateString {
  return date.toISOString() as DateString
}

/**
 * Semantic Event Service - Event Publishing
 *
 * Pattern: send.[Object].[action](payload)
 *
 * ⚠️ Type Safety Note: This interface uses index signatures to support
 * dynamic event patterns. IDE autocomplete will not suggest available
 * objects/actions. Refer to your schema definitions or documentation
 * for valid event names.
 *
 * ## Naming Conventions
 * - **Object**: PascalCase (Customer, Order, Invoice)
 * - **Action**: lowercase past tense verb (created, subscribed, sent)
 * - Irregular verbs: sent (not sended), built (not builded), made (not maked)
 * - Must start with a letter, contain only alphanumeric and underscores
 * - Maximum length: 100 characters per part
 *
 * ## Type Safety Enhancement
 * You can extend this interface with your specific event types for IDE autocomplete:
 *
 * ```typescript
 * // In your types file:
 * declare module 'sdk.do' {
 *   interface SendService {
 *     Customer: {
 *       created: (payload: { customerId: string; email: string; name: string }) => Promise<void>
 *       subscribed: (payload: { customerId: string; plan: string; billingCycle: string }) => Promise<void>
 *       updated: (payload: { customerId: string; changes: Record<string, any> }) => Promise<void>
 *     }
 *     Order: {
 *       created: (payload: { orderId: string; customerId: string; total: number }) => Promise<void>
 *       shipped: (payload: { orderId: string; trackingNumber: string; carrier: string }) => Promise<void>
 *       delivered: (payload: { orderId: string; deliveredAt: string; signature?: string }) => Promise<void>
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Send customer subscribed event
 * await $.send.Customer.subscribed({ email: 'user@example.com', plan: 'pro' })
 *
 * // Send order created event
 * await $.send.Order.created({ orderId: '123', total: 99.99 })
 *
 * // Array payloads are preserved
 * await $.send.Batch.processed([item1, item2, item3])
 * ```
 */
export interface SendService {
  [object: string]: {
    [action: string]: <TPayload = unknown>(payload?: TPayload) => Promise<void>
  }
}

/**
 * Note: OnService is defined in ./on.ts and provides comprehensive
 * event listener functionality with pattern matching, filters, and
 * semantic BusinessEvent support. See ./on.ts for full documentation.
 */
// OnService is exported at the top of this file

/**
 * Validates if a string is a valid ID format (non-empty, reasonable length)
 * @param id - The ID string to validate
 * @param fieldName - Name of the field for error messages
 * @throws Error if the ID is invalid
 */
export function validateId(id: string, fieldName: string = 'id'): void {
  if (!id || typeof id !== 'string') {
    throw new Error(`Invalid ${fieldName}: must be a non-empty string`)
  }
  if (id.trim().length === 0) {
    throw new Error(`Invalid ${fieldName}: cannot be empty or whitespace`)
  }
  if (id.length > 255) {
    throw new Error(`Invalid ${fieldName}: exceeds maximum length of 255 characters`)
  }
  // Check for SQL injection patterns
  const dangerousPatterns = /['";\\]|--|\*|\/\*|\*\/|xp_|sp_|exec|execute|drop|union|select|insert|update|delete/i
  if (dangerousPatterns.test(id)) {
    throw new Error(`Invalid ${fieldName}: contains forbidden characters or SQL keywords`)
  }
}

/**
 * Validates if a permission string follows the "resource.action" format
 * @param permission - The permission string to validate
 * @returns True if the permission is valid
 */
export function isValidPermission(permission: string): permission is Permission {
  return /^[a-z0-9_]+\.[a-z0-9_]+$/i.test(permission)
}

/**
 * Error codes for UserService operations
 */
export type UserServiceErrorCode = 'UNAUTHORIZED' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'INVALID_INPUT' | 'FORBIDDEN'

/**
 * Custom error class for UserService operations
 */
export class UserServiceError extends Error {
  constructor(
    public code: UserServiceErrorCode,
    message: string
  ) {
    super(message)
    this.name = 'UserServiceError'
  }
}

/**
 * Permission string format: "resource.action" (e.g., "posts.edit", "users.manage")
 * Follows the pattern: {resource}.{action}
 * Template literal type ensures compile-time validation of the pattern
 */
export type Permission = `${string}.${string}`

/**
 * Paginated response wrapper for list operations
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  hasMore: boolean
  limit?: number
  offset?: number
}

/**
 * Organization entity
 */
export interface Organization {
  id: string
  name: string
  slug?: string
  image?: string
  /** @format date-time */
  createdAt: DateString
  /** @format date-time */
  updatedAt: DateString
  metadata?: Record<string, any>
}

/**
 * User types for multi-tenant authentication and authorization
 * Generic TMetadata allows for type-safe custom metadata
 */
export interface User<TMetadata = Record<string, any>> {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified?: boolean

  // Multi-tenant support
  organizations?: OrganizationMembership[]
  currentOrganization?: string // organizationId

  // Metadata
  /** @format date-time */
  createdAt: DateString
  /** @format date-time */
  updatedAt: DateString
  /** @format date-time */
  lastLoginAt?: DateString

  // Extensible metadata for custom fields
  metadata?: TMetadata
}

/**
 * Safe subset of User fields that can be updated by the user
 * Generic TMetadata allows for type-safe custom metadata updates
 */
export interface UserUpdateInput<TMetadata = Record<string, any>> {
  name?: string
  image?: string
  metadata?: TMetadata
}

export interface OrganizationMembership {
  id: string
  organizationId: string
  role: string
  permissions?: Permission[]
  status: 'active' | 'invited' | 'suspended'
  /** @format date-time */
  createdAt: DateString
  /** @format date-time */
  updatedAt: DateString
}

/**
 * User session (public interface - does not expose token)
 */
export interface Session {
  id: string
  userId: string
  /** @format date-time */
  expiresAt: DateString
  /** @format date-time */
  createdAt: DateString
  userAgent?: string
  ipAddress?: string
}

export interface Activity {
  id: string
  userId: string
  type: string
  description: string
  metadata?: Record<string, any>
  /** @format date-time */
  createdAt: DateString
}

export interface UserAnalytics {
  userId: string
  loginCount: number
  /** @format date-time */
  lastLogin?: DateString
  totalSessions: number
  activeSessions: number
  organizationCount: number
  // Extensible for additional metrics
  metrics?: Record<string, any>
}

export interface AnalyticsOptions {
  /** @format date-time */
  startDate?: DateString
  /** @format date-time */
  endDate?: DateString
  metrics?: string[]
}

export interface ActivityOptions {
  /** Maximum number of items to return (default: 50, max: 1000) */
  limit?: number
  /** Number of items to skip (default: 0) */
  offset?: number
  type?: string
  /** @format date-time */
  startDate?: DateString
  /** @format date-time */
  endDate?: DateString
}

export interface SessionOptions {
  /** Maximum number of items to return (default: 50, max: 1000) */
  limit?: number
  /** Number of items to skip (default: 0) */
  offset?: number
  /** Filter for active (non-expired) sessions */
  active?: boolean
}

/**
 * User service for managing current user context, organizations, and permissions
 * Generic TMetadata allows for type-safe custom metadata
 */
export interface UserService<TMetadata = Record<string, any>> {
  // Current user context
  current(): Promise<User<TMetadata> | null>
  update(data: UserUpdateInput<TMetadata>): Promise<User<TMetadata>>

  // Organization management
  switchOrganization(organizationId: string): Promise<User<TMetadata>>
  listOrganizations(options?: { limit?: number; offset?: number }): Promise<PaginatedResponse<OrganizationMembership>>
  getOrganization(organizationId: string): Promise<OrganizationMembership | null>
  /**
   * Get the current organization membership for the authenticated user
   * Returns null if:
   * - User has no currentOrganization set
   * - currentOrganization is not in the user's organizations array
   * - User has no organizations
   */
  getCurrentOrganizationMembership(): Promise<OrganizationMembership | null>

  // Permission and role checking
  hasPermission(permission: Permission, organizationId?: string): Promise<boolean>
  hasRole(role: string, organizationId?: string): Promise<boolean>
  getPermissions(organizationId?: string): Promise<Permission[]>

  // Analytics and activity tracking
  getAnalytics(options?: AnalyticsOptions): Promise<UserAnalytics>
  getActivity(options?: ActivityOptions): Promise<PaginatedResponse<Activity>>
  getSessions(options?: SessionOptions): Promise<PaginatedResponse<Session>>
  revokeSession(sessionId: string): Promise<void>
}

/**
 * API Service - see api.ts for full type definitions
 */
export type { APIService } from './api'

/**
 * Functions Service - see functions.ts for full type definitions
 */
export type {
  FunctionsService,
  DeployedFunction,
  FunctionDefinition,
  FunctionMetadata,
  ExecutionResult,
  ScheduleConfig,
  LogEntry,
  LogsOptions,
  ListFunctionsOptions,
} from './functions'

/**
 * LLM Service - see llm.ts for full type definitions and interfaces
 */
export type {
  LLMService,
  LLMProvider,
  MessageRole,
  ChatMessage,
  ToolCall,
  Tool,
  GenerateOptions,
  ChatOptions,
  StreamChunk,
  EmbedOptions,
  Embedding,
  Model,
  BatchRequest,
  BatchStatus,
  BatchJob,
  GenerateResponse,
  ChatResponse,
} from './llm'
// Note: StreamOptions exported from ./events, BatchResult exported from ./database

/**
 * Workflows Service - see workflows.ts for full type definitions
 */
export type {
  WorkflowsService,
  Workflow,
  WorkflowDefinition,
  WorkflowStep,
  WorkflowExecution,
  WorkflowExecutionStatus,
  WorkflowStatus,
  WorkflowContext,
  RetryConfig,
  BackoffStrategy,
  StepCondition,
  ListExecutionsOptions,
  ListWorkflowsOptions,
  WorkflowsServiceConfig,
} from './workflows'

/**
 * Events Service - see events.ts for full type definitions
 */
export type {
  EventsService,
  Event,
  EventType,
  EventPayload,
  EventSubscriber,
  SubscribeOptions,
  Subscription,
  StreamOptions,
  HistoryOptions,
  BatchEvent,
  BatchPublishResult,
  DLQEntry,
  EventMetrics,
  MetricsOptions,
  EventsServiceConfig,
} from './events'

/**
 * Database Service - see database.ts for full type definitions
 */
export type {
  DatabaseService,
  QueryOptions,
  SearchOptions,
  RelationshipOptions,
  CollectionSchema,
  FieldSchema,
  IndexSchema,
  RelationshipSchema,
  ValidationRule,
  Collection,
  Transaction,
  Migration,
  DatabaseServiceConfig,
  BatchResult,
} from './database'

/**
 * OAuth Service - see oauth.ts for full type definitions
 */
export type {
  OAuthService,
  OAuthTokens,
  AuthorizeOptions,
  ExchangeCodeOptions,
  RefreshTokenOptions,
  ClientCredentialsOptions,
  TokenValidation,
  UserInfo,
  CreateApiKeyOptions,
  ApiKey,
  RegisterClientOptions,
  OAuthClient,
  CreateSessionOptions,
  OAuthSession,
} from './oauth'

/**
 * Triggers Service - see triggers.ts for full type definitions
 */
export type {
  TriggersService,
  Trigger,
  TriggerDefinition,
  TriggerEvent,
  TriggerEventPattern,
  TriggerCondition,
  TriggerAction,
  TriggerPriority,
  TriggerStatus,
  RegisteredTrigger,
  TriggerExecutionResult,
  TriggerMetrics,
  TriggerHistoryOptions,
  ListTriggersOptions,
  TriggersServiceConfig,
} from './triggers'

/**
 * Actions Service - see actions.ts for full type definitions
 */
export type {
  ActionsService,
  Action,
  ActionDefinition,
  ActionContext,
  ActionResult,
  ComposedAction,
  ParameterDefinition,
  ParameterType,
  ExecuteOptions,
} from './actions'

/**
 * Scheduling service with human-readable syntax
 * Provides a Proxy-based API for creating schedules with chainable properties
 */
export interface EveryService extends EveryChain {
  // Time periods
  minute: EveryChain
  hour: EveryChain
  day: EveryChain
  week: EveryChain
  month: EveryChain
  year: EveryChain

  // Business time
  business: EveryChain

  // Days of week
  monday: EveryChain
  tuesday: EveryChain
  wednesday: EveryChain
  thursday: EveryChain
  friday: EveryChain
  saturday: EveryChain
  sunday: EveryChain

  // Allow additional dynamic properties for chaining
  [key: string]: EveryChain
}

/**
 * Chain type for every service that allows both property access and invocation
 * Returns a Schedule object when invoked with a callback
 */
export interface EveryChain {
  // Allow property access for chaining (e.g., every.business.hour)
  [key: string]: EveryChain

  // Allow invocation with callback (e.g., every.hour($ => {}))
  // Returns a Schedule object that represents the registered schedule
  (callback: (context: any) => void | Promise<void>): Schedule
}

/**
 * Represents a registered schedule (from every.ts)
 * Re-exported here to avoid circular dependencies
 */
export interface Schedule {
  id: string
  pattern: string
  cron: string
  description: string
  callback: (context: any) => void | Promise<void>
  createdAt: Date
  status: 'active' | 'paused' | 'cancelled'
}

/**
 * Logger interface for configurable logging
 */
export interface Logger {
  log?: (...args: any[]) => void
  error?: (...args: any[]) => void
  warn?: (...args: any[]) => void
  info?: (...args: any[]) => void
  debug?: (...args: any[]) => void
}

/**
 * Semantic path builder for database queries
 * Enables semantic patterns like: db.forEvery.industry.occupations.tasks
 *
 * This is a recursive proxy type that allows arbitrary chaining of properties
 * and ends with callable functions that accept any arguments.
 *
 * @example
 * ```typescript
 * // Semantic database queries
 * db.forEvery.industry.occupations.tasks.generateService()
 * db.forEvery.customer.orders.where({ status: 'pending' })
 * ```
 */
export interface ForEvery {
  [key: string]: ForEvery & {
    [key: string]: ForEvery & {
      [key: string]: ForEvery & ((...args: any[]) => any)
    }
  }
}

/**
 * Business context with all services
 * Generic TMetadata allows for type-safe custom user metadata
 *
 * This is the main entry point for Business-as-Code development,
 * providing semantic, AI-native primitives for building autonomous
 * digital workers.
 *
 * @example
 * ```typescript
 * import { type BusinessContext } from 'sdk.do'
 *
 * export default ($: BusinessContext) => {
 *   const { ai, db, on, send, every, user } = $
 *
 *   // Use $ for semantic paths
 *   on($.Order.created, async (event) => {
 *     await ai.generateText('Process order...')
 *   })
 *
 *   // Semantic database queries
 *   db.forEvery.customer.orders.where({ status: 'pending' })
 * }
 * ```
 */
export interface BusinessContext<TMetadata = Record<string, any>> {
  /** Semantic path builder from graphdl */
  $: typeof $

  /** Database service with semantic query support */
  db: DBService & { forEvery?: ForEvery }

  /** AI service for generation, embedding, and batch processing */
  ai: AIService

  /** HTTP Client for making authenticated API requests */
  api: HTTPClient

  /** Authentication and authorization service */
  auth: AuthService

  /** Event listener service with BusinessEvent support */
  on: OnService

  /** Event publishing service with semantic patterns */
  send: SendService

  /** Scheduling service with semantic intervals */
  every: EveryService

  /** Decision and experimentation service */
  decide: any

  /** User context and permission management */
  user: UserService<TMetadata>

  /** Functions service for deploying and executing serverless functions */
  functions: FunctionsService

  /** LLM service for multi-provider AI operations */
  llm: LLMService

  /** Events service for publishing, subscribing, and managing events */
  events: EventsService

  /** OAuth 2.0 service for authentication and authorization */
  oauth: OAuthService

  /** Database service for comprehensive database operations */
  database: DatabaseService

  /** Triggers service for event-based automation and workflows */
  triggers: TriggersService

  /** Actions service for reusable workflow actions */
  actions: ActionsService

  /** Analytics service for event tracking and metrics */
  analytics: any // Full AnalyticsService type available in analytics.ts

  /** Experiments service for A/B testing and feature flags */
  experiments: any // Full ExperimentsService type available in experiments.ts

  /** Cache service for cache management */
  cache: any // Full CacheService type available in cache.ts

  /** Vault service for secrets management */
  vault: any // Full VaultService type available in vault.ts

  /** Media service for file uploads and management */
  media: any // Full MediaService type available in media.ts

  /** Search service for full-text and vector search */
  search: any // Full SearchService type available in search.ts

  /** Stream service for Server-Sent Events and WebSockets */
  stream: any // Full StreamService type available in stream.ts

  /** Batch service for batch operations */
  batch: any // Full BatchService type available in batch.ts

  /** Storage service for R2 object storage */
  storage: any // Full StorageService type available in storage.ts

  /** Queue service for Cloudflare Queues message publishing */
  queue: any // Full QueueService type available in queue.ts

  /** Workflows service (Layer 0-1 comprehensive workflows) */
  workflowsLayer01: WorkflowsService

  /** Workflows service for creating and managing workflow instances */
  workflows: any // Full WorkflowsService type available in workflows.ts

  /** Optional logger for debugging */
  logger?: Logger
}

/**
 * @deprecated Use BusinessContext instead
 * RuntimeContext is maintained for backward compatibility
 */
export interface RuntimeContext<TMetadata = Record<string, any>> extends BusinessContext<TMetadata> {}
