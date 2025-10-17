/**
 * RPC Client for .do platform using CapnWeb/Cloudflare RPC
 */

import $ from 'graphdl'
import type {
  RPCClientOptions,
  RPCRequest,
  RPCResponse,
  DBService,
  AIService,
  AuthService,
  UserService,
  BusinessContext,
  RuntimeContext,
  UserServiceErrorCode,
  SendService,
  OnService,
  EveryService,
  FunctionsService,
  LLMService,
  WorkflowsService,
  EventsService,
  DatabaseService,
  OAuthService,
  TriggersService,
  ActionsService,
} from './types'
import { UserServiceError } from './types'
import { createOnService } from './on'
import { createEveryProxy } from './every'
import { createSendProxy } from './send'
import { createFunctionsService } from './functions'
import { createWorkflowsService as createWorkflowsServiceLayer01 } from './workflows'
import { createEventsService } from './events'
import { createDatabaseService } from './database'
import { createOAuthService } from './oauth'
import { createTriggersService } from './triggers'
import { createActionsService } from './actions'
import { HTTPClient } from './http'
import { AnalyticsService } from './analytics'
import { ExperimentsService } from './experiments'
import { CacheService } from './cache'
import { VaultService } from './vault'
import { MediaService } from './media'
import { SearchService } from './search'
import { StreamService } from './stream'
import { BatchService } from './batch'
import { AIService as AIServiceClass } from './ai'
import { DatabaseService as DatabaseServiceClass } from './db'
import { WorkflowsService } from './workflows'
import { StorageService } from './storage'
import { QueueService } from './queue'
import { createLLMService } from './llm'

/**
 * Maps error messages to UserServiceErrorCode
 */
function mapErrorCode(message?: string): UserServiceErrorCode {
  if (!message) return 'NETWORK_ERROR'

  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('not authorized') || lowerMessage.includes('authentication')) {
    return 'UNAUTHORIZED'
  }
  if (lowerMessage.includes('not found') || lowerMessage.includes('does not exist')) {
    return 'NOT_FOUND'
  }
  if (lowerMessage.includes('forbidden') || lowerMessage.includes('permission denied') || lowerMessage.includes('access denied')) {
    return 'FORBIDDEN'
  }
  if (lowerMessage.includes('invalid') || lowerMessage.includes('validation')) {
    return 'INVALID_INPUT'
  }

  return 'NETWORK_ERROR'
}

export class RPCClient {
  private baseUrl: string
  private headers: Record<string, string>
  private _sendProxy?: SendService
  private _onProxy?: OnService
  private _httpClient?: HTTPClient
  private _analytics?: AnalyticsService
  private _experiments?: ExperimentsService
  private _cache?: CacheService
  private _vault?: VaultService
  private _media?: MediaService
  private _search?: SearchService
  private _stream?: StreamService
  private _batch?: BatchService
  private _aiService?: AIServiceClass
  private _dbService?: DatabaseServiceClass
  private _workflows?: WorkflowsService
  private _workflowsLayer01?: any
  private _storage?: StorageService
  private _queue?: QueueService
  private _llmService?: LLMService
  private _functionsService?: FunctionsService
  private pendingRequests = new Map<string, Promise<any>>()

  constructor(options: RPCClientOptions = {}) {
    this.baseUrl = options.baseUrl || 'https://apis.do'
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (options.apiKey) {
      this.headers['Authorization'] = `Bearer ${options.apiKey}`
    }
  }

  /**
   * Make an RPC call to a service method with request deduplication
   * Identical concurrent requests are deduplicated to prevent redundant network calls
   */
  async call<T = unknown>(service: string, method: string, params?: unknown): Promise<T> {
    // Create a cache key for request deduplication
    const cacheKey = `${service}.${method}:${JSON.stringify(params)}`

    // Return pending request if one exists
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!
    }

    // Create the request promise
    const requestPromise = this._call<T>(service, method, params)

    // Store the pending request
    this.pendingRequests.set(cacheKey, requestPromise)

    // Clean up after completion (success or error)
    requestPromise.finally(() => {
      this.pendingRequests.delete(cacheKey)
    })

    return requestPromise
  }

  /**
   * Internal method that performs the actual RPC call
   */
  private async _call<T = unknown>(service: string, method: string, params?: unknown): Promise<T> {
    const url = `${this.baseUrl}/rpc/${service}/${method}`

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ params }),
    })

    // Check HTTP status before parsing JSON
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = (await response.json()) as RPCResponse<T>

    if (!data.success) {
      const errorMessage = data.error?.message || `RPC call failed for ${service}/${method}`

      // Map to UserServiceError for user service calls
      if (service === 'user') {
        const errorCode = mapErrorCode(errorMessage)
        throw new UserServiceError(errorCode, errorMessage)
      }

      // Generic error for other services
      const errorCode = data.error?.code ? ` (${data.error.code})` : ''
      throw new Error(errorMessage + errorCode)
    }

    return data.result as T
  }

  /**
   * Get a proxy for a specific service
   */
  service<T extends object>(serviceName: string): T {
    return new Proxy({} as T, {
      get: (_, method: string) => {
        return (...args: any[]) => this.call(serviceName, method, args)
      },
    })
  }

  /**
   * Database service
   */
  get db(): DBService {
    return this.service<DBService>('db')
  }

  /**
   * AI service
   */
  get ai(): AIService {
    return this.service<AIService>('ai')
  }

  /**
   * Auth service
   */
  get auth(): AuthService {
    return this.service<AuthService>('auth')
  }

  /**
   * HTTP Client for making authenticated API requests
   */
  get api(): HTTPClient {
    if (!this._httpClient) {
      const apiKey = this.headers['Authorization']?.replace('Bearer ', '')
      this._httpClient = new HTTPClient(this.baseUrl, apiKey)
    }
    return this._httpClient
  }

  /**
   * Event listener service
   *
   * IMPORTANT: Creates a new OnService instance on each access to prevent
   * listener leakage in multi-tenant environments (e.g., Cloudflare Workers).
   *
   * If you need to preserve listeners across multiple accesses, store the
   * result in a variable:
   *
   * @example
   * // Store once to preserve listeners
   * const events = client.on
   * events('Order.created', handler1)
   * events('Order.updated', handler2)
   * await events.emit(event)
   *
   * @example
   * // Multi-tenant safe: Each request gets isolated listeners
   * export default {
   *   async fetch(request: Request) {
   *     const client = new RPCClient()
   *     const events = client.on  // Fresh instance per request
   *     events('Order.created', handler)
   *   }
   * }
   */
  get on() {
    return createOnService()
  }

  /**
   * Send/emit service
   *
   * Semantic pattern: send.[Object].[action](payload)
   *
   * @example
   * ```typescript
   * // Send customer subscribed event
   * await $.send.Customer.subscribed({ email: 'user@example.com', plan: 'pro' })
   *
   * // Send order created event
   * await $.send.Order.created({ orderId: '123', total: 99.99 })
   *
   * // Send invoice sent event
   * await $.send.Invoice.sent({ invoiceId: 'INV-001', recipient: 'customer@example.com' })
   * ```
   */
  get send(): SendService {
    if (!this._sendProxy) {
      // Use the new queue-based send implementation
      this._sendProxy = createSendProxy({
        apiUrl: `${this.baseUrl}/v1/events`,
        apiKey: this.headers['Authorization']?.replace('Bearer ', ''),
      })
    }
    return this._sendProxy
  }

  /**
   * Validate event name part (Object or action)
   */
  private validateEventPart(part: string, type: 'object' | 'action'): void {
    // Check for reserved JavaScript keywords
    const reserved = ['constructor', 'prototype', '__proto__', 'toString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf']
    if (reserved.includes(part.toLowerCase())) {
      throw new Error(`Invalid ${type} name: "${part}" is a reserved keyword`)
    }

    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(part)) {
      throw new Error(`Invalid ${type} name: "${part}". Must start with a letter and contain only alphanumeric characters and underscores.`)
    }
    if (part.length > 100) {
      throw new Error(`${type} name too long: "${part}". Maximum length is 100 characters.`)
    }
  }

  /**
   * Create a semantic proxy for send/on patterns: service.[Object].[action]
   *
   * This enables semantic patterns like:
   * - send.Customer.subscribed(payload)
   * - send.Order.created(payload)
   * - on.Invoice.sent(handler)
   */
  private createSemanticProxy(serviceName: string): unknown {
    // Cache object-level proxies for performance
    const objectProxies = new Map<string, unknown>()
    // Cache validated action names to avoid redundant validation
    const validatedActions = new Set<string>()

    return new Proxy(
      {},
      {
        get: (_, object: string | symbol) => {
          // Ignore symbol properties (like Symbol.iterator, Symbol.toStringTag, etc.)
          if (typeof object === 'symbol') {
            return undefined
          }

          // Return cached proxy if available (avoids redundant validation)
          if (objectProxies.has(object)) {
            return objectProxies.get(object)
          }

          // Validate object name only on cache miss
          this.validateEventPart(object, 'object')

          // Create and cache new object-level proxy
          const objectProxy = new Proxy(
            {},
            {
              get: (_target, action: string | symbol) => {
                // Ignore symbol properties
                if (typeof action === 'symbol') {
                  return undefined
                }

                // Ignore internal JavaScript operations that access these properties
                // These are accessed during comparisons, JSON.stringify, etc.
                const internalProps = ['constructor', 'prototype', '__proto__', 'toString', 'valueOf', 'toJSON', 'then']
                if (internalProps.includes(action)) {
                  return undefined
                }

                // Cache key for validation
                const cacheKey = `${object}.${action}`

                // Validate action name only if not already validated
                if (!validatedActions.has(cacheKey)) {
                  this.validateEventPart(action, 'action')
                  validatedActions.add(cacheKey)
                }

                // Second level: action (e.g., created, subscribed, sent)
                return (...args: unknown[]) => {
                  // Construct semantic event name: Object.action
                  const eventName = `${object}.${action}`

                  // Handle arguments intelligently:
                  // - No arguments: pass undefined
                  // - Single argument: pass it directly (preserves objects AND arrays)
                  // - Multiple arguments: pass as array
                  //
                  // Note: When you pass an array as the single argument like send.Batch.processed([1,2,3]),
                  // the array itself becomes the params. This is intentional - the array is your payload.
                  // If you need multiple separate arguments, pass them separately: send.Batch.processed(arg1, arg2)
                  const params = args.length === 0 ? undefined : args.length === 1 ? args[0] : args

                  return this.call(serviceName, eventName, params)
                }
              },
            }
          )

          objectProxies.set(object, objectProxy)
          return objectProxy
        },
      }
    )
  }

  /**
   * Scheduled tasks service with human-readable syntax
   * Returns a Proxy that supports patterns like:
   * - every.hour(callback)
   * - every.business.day(callback)
   * - every.minute.during.business.hours(callback)
   */
  get every(): EveryService {
    // Return proxy-based API instead of simple RPC service
    // The actual runtime interface follows EveryService from types.ts
    return createEveryProxy(this as unknown as RuntimeContext)
  }

  /**
   * Decision logic service
   */
  get decide(): any {
    return this.service('decide')
  }

  /**
   * User context service
   */
  get user(): UserService {
    return this.service<UserService>('user')
  }

  /**
   * Functions service for deploying and executing serverless functions
   */
  get functions(): FunctionsService {
    if (!this._functionsService) {
      this._functionsService = createFunctionsService(this as unknown as BusinessContext, {
        baseUrl: `${this.baseUrl}/functions`,
      })
    }
    return this._functionsService
  }

  /**
   * LLM service for multi-provider AI operations
   */
  get llm(): LLMService {
    if (!this._llmService) {
      this._llmService = createLLMService({
        apiUrl: `${this.baseUrl}/v1/llm`,
        apiKey: this.headers['Authorization']?.replace('Bearer ', ''),
      })
    }
    return this._llmService
  }

  /**
   * Workflows service (Layer 0-1 comprehensive workflows)
   */
  get workflowsLayer01(): any {
    if (!this._workflowsLayer01) {
      this._workflowsLayer01 = createWorkflowsServiceLayer01({
        apiUrl: `${this.baseUrl.replace('/apis', '/workflows')}`,
        apiKey: this.headers['Authorization']?.replace('Bearer ', ''),
      })
    }
    return this._workflowsLayer01
  }

  /**
   * Events service for publishing, subscribing, and managing events
   */
  get events(): EventsService {
    return createEventsService({
      apiUrl: `${this.baseUrl.replace('/apis', '/events')}`,
      apiKey: this.headers['Authorization']?.replace('Bearer ', ''),
    })
  }

  /**
   * Database service for comprehensive database operations
   */
  get database(): DatabaseService {
    return createDatabaseService(this as unknown as BusinessContext, {
      apiUrl: `${this.baseUrl.replace('/apis', '/database')}`,
      apiKey: this.headers['Authorization']?.replace('Bearer ', ''),
    })
  }

  /**
   * OAuth 2.0 service for authentication and authorization
   */
  get oauth(): OAuthService {
    return createOAuthService(this as unknown as BusinessContext, {
      baseUrl: `${this.baseUrl.replace('/apis', '/oauth')}`,
    })
  }

  /**
   * Triggers service for event-based automation and workflows
   */
  get triggers(): TriggersService {
    return createTriggersService({
      apiUrl: `${this.baseUrl.replace('/apis', '/triggers')}`,
      apiKey: this.headers['Authorization']?.replace('Bearer ', ''),
    })
  }

  /**
   * Actions service for reusable workflow actions
   */
  get actions(): ActionsService {
    return createActionsService(this as unknown as BusinessContext)
  }

  /**
   * Analytics service for event tracking and metrics
   */
  get analytics(): AnalyticsService {
    if (!this._analytics) {
      this._analytics = new AnalyticsService(`${this.baseUrl}/v1/analytics`, this.headers['Authorization']?.replace('Bearer ', ''))
    }
    return this._analytics
  }

  /**
   * Experiments service for A/B testing and feature flags
   */
  get experiments(): ExperimentsService {
    if (!this._experiments) {
      this._experiments = new ExperimentsService(`${this.baseUrl}/v1/experiments`, this.headers['Authorization']?.replace('Bearer ', ''))
    }
    return this._experiments
  }

  /**
   * Cache service for cache management
   */
  get cache(): CacheService {
    if (!this._cache) {
      this._cache = new CacheService(`${this.baseUrl}/v1/cache`, this.headers['Authorization']?.replace('Bearer ', ''))
    }
    return this._cache
  }

  /**
   * Vault service for secrets management
   */
  get vault(): VaultService {
    if (!this._vault) {
      this._vault = new VaultService(`${this.baseUrl}/v1/vault`, this.headers['Authorization']?.replace('Bearer ', ''))
    }
    return this._vault
  }

  /**
   * Media service for file uploads and management
   */
  get media(): MediaService {
    if (!this._media) {
      this._media = new MediaService(`${this.baseUrl}/v1/media`, this.headers['Authorization']?.replace('Bearer ', ''))
    }
    return this._media
  }

  /**
   * Search service for full-text and vector search
   */
  get search(): SearchService {
    if (!this._search) {
      this._search = new SearchService(`${this.baseUrl}/v1/search`, this.headers['Authorization']?.replace('Bearer ', ''))
    }
    return this._search
  }

  /**
   * Stream service for Server-Sent Events and WebSockets
   */
  get stream(): StreamService {
    if (!this._stream) {
      this._stream = new StreamService(`${this.baseUrl}/v1/stream`, this.headers['Authorization']?.replace('Bearer ', ''))
    }
    return this._stream
  }

  /**
   * Batch service for batch operations
   */
  get batch(): BatchService {
    if (!this._batch) {
      this._batch = new BatchService(`${this.baseUrl}/v1/batch`, this.headers['Authorization']?.replace('Bearer ', ''))
    }
    return this._batch
  }

  /**
   * Storage service for R2 object storage
   */
  get storage(): StorageService {
    if (!this._storage) {
      this._storage = new StorageService('https://storage.do', this.headers['Authorization']?.replace('Bearer ', ''))
    }
    return this._storage
  }

  /**
   * Queue service for Cloudflare Queues message publishing
   */
  get queue(): QueueService {
    if (!this._queue) {
      this._queue = new QueueService('https://queue.do', this.headers['Authorization']?.replace('Bearer ', ''))
    }
    return this._queue
  }

  /**
   * Workflows service for creating and managing workflow instances
   */
  get workflows(): WorkflowsService {
    if (!this._workflows) {
      this._workflows = new WorkflowsService(`${this.baseUrl}/v1/workflows`, this.headers['Authorization']?.replace('Bearer ', ''))
    }
    return this._workflows
  }
}

/**
 * Detect authentication from environment
 */
function detectAuth(env?: any): RPCClientOptions {
  // Check for DO_TOKEN in process.env (Node.js)
  const globalProcess = (typeof globalThis !== 'undefined' && (globalThis as any).process) || undefined
  if (globalProcess && globalProcess.env?.DO_TOKEN) {
    return {
      apiKey: globalProcess.env.DO_TOKEN,
    }
  }

  // Check for Cloudflare Workers env binding
  // In Workers, env object contains bindings
  if (env?.DO_TOKEN) {
    return {
      apiKey: env.DO_TOKEN,
    }
  }

  // Check if we're in a Cloudflare Worker context
  const globalExecContext = (typeof globalThis !== 'undefined' && (globalThis as any).ExecutionContext) || undefined
  if (globalExecContext) {
    // If we're in a worker but no token, caller should pass env explicitly
    const globalConsole = (typeof globalThis !== 'undefined' && (globalThis as any).console) || undefined
    if (globalConsole) {
      globalConsole.warn('Running in Cloudflare Worker context but no DO_TOKEN found in env')
    }
  }

  return {}
}

/**
 * Start OAuth flow for authentication
 */
async function startOAuthFlow(): Promise<string> {
  // TODO: Implement OAuth flow
  // For now, throw an error indicating OAuth is needed
  throw new Error('Authentication required. Please set DO_TOKEN environment variable or pass apiKey to create$()')
}

/**
 * Create an RPC client instance with explicit configuration
 * Generic TMetadata allows for type-safe custom user metadata
 */
export function create$<TMetadata = Record<string, any>>(options?: RPCClientOptions, env?: any): BusinessContext<TMetadata> {
  // Merge detected auth with explicit options
  const detectedAuth = detectAuth(env)
  const mergedOptions = { ...detectedAuth, ...options }

  const client = new RPCClient(mergedOptions)

  return {
    $, // Semantic path builder from graphdl
    db: client.db,
    ai: client.ai,
    api: client.api,
    auth: client.auth,
    on: client.on,
    send: client.send,
    every: client.every,
    decide: client.decide,
    user: client.user as UserService<TMetadata>,
    functions: client.functions,
    llm: client.llm,
    workflowsLayer01: client.workflowsLayer01,
    events: client.events,
    database: client.database,
    oauth: client.oauth,
    triggers: client.triggers,
    actions: client.actions,
    analytics: client.analytics,
    experiments: client.experiments,
    cache: client.cache,
    vault: client.vault,
    media: client.media,
    search: client.search,
    stream: client.stream,
    batch: client.batch,
    storage: client.storage,
    queue: client.queue,
    workflows: client.workflows,
  }
}

/**
 * Get or create default RPC client instance with automatic authentication
 * Generic TMetadata allows for type-safe custom user metadata
 *
 * LIMITATION: The defaultClient singleton means that if you create a client with one TMetadata
 * type and then call this function with a different TMetadata type, the type cast will succeed
 * but the actual runtime metadata may not match. For type-safe metadata in multi-context apps,
 * create separate client instances with create$<TMetadata>() instead of using the default client.
 */
let defaultClient: BusinessContext<any> | null = null

async function $Internal<TMetadata = Record<string, any>>(env?: any): Promise<BusinessContext<TMetadata>> {
  if (defaultClient) {
    // Type cast limitation: This assumes the cached client's metadata type matches TMetadata
    // For applications with multiple metadata types, use create$<TMetadata>() instead
    return defaultClient as BusinessContext<TMetadata>
  }

  // Try to detect authentication
  const authOptions = detectAuth(env)

  // If no auth found, start OAuth flow
  if (!authOptions.apiKey) {
    authOptions.apiKey = await startOAuthFlow()
  }

  defaultClient = create$<TMetadata>(authOptions, env) as BusinessContext<any>
  return defaultClient as BusinessContext<TMetadata>
}

// Support both direct property access (sync) and function call (async)
const $proxy = new Proxy($Internal, {
  get(target, prop) {
    if (prop === 'then' || prop === 'catch' || prop === 'finally') {
      // Allow async usage: await $()
      return undefined
    }

    // For direct property access like $.db, create default client synchronously
    if (!defaultClient) {
      const authOptions = detectAuth()
      if (!authOptions.apiKey) {
        throw new Error('Authentication required. Use await $() or await $(env) to start OAuth flow, or set DO_TOKEN environment variable')
      }
      defaultClient = create$(authOptions)
    }

    return defaultClient[prop as keyof BusinessContext]
  },
})

// Export the proxy as $ so it can be used both ways:
// 1. Sync: $.db.get(...)  (when DO_TOKEN is set)
// 2. Async: const $ = await $(); $.db.get(...)  (when OAuth is needed)
// 3. Async with env: const $ = await $(env); $.db.get(...)  (in Cloudflare Workers)
export { $proxy as $ }
