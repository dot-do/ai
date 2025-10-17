/**
 * SDK.do - TypeScript SDK for .do platform
 *
 * Provides RPC client for calling .do services via CapnWeb
 *
 * Usage:
 *
 * // With DO_TOKEN environment variable set:
 * import { $ } from 'sdk.do'
 * const user = await $.db.get('users', 'user_123')
 *
 * // Or with explicit configuration:
 * import { create$ } from 'sdk.do'
 * const $ = create$({ apiKey: 'your-api-key' })
 * const user = await $.db.get('users', 'user_123')
 *
 * // Or with async initialization (for OAuth):
 * import { $ } from 'sdk.do'
 * const runtime = await $()
 * const user = await runtime.db.get('users', 'user_123')
 */

export { RPCClient, $, create$ } from './client'
export type {
  RPCClientOptions,
  RPCRequest,
  RPCResponse,
  DBService,
  AIService,
  AuthService,
  UserService,
  User,
  UserUpdateInput,
  Organization,
  OrganizationMembership,
  Session,
  Activity,
  UserAnalytics,
  AnalyticsOptions,
  ActivityOptions,
  SessionOptions,
  DateString,
  BusinessContext,
  RuntimeContext,
  Permission,
  UserServiceError,
  UserServiceErrorCode,
  PaginatedResponse,
  SendService,
  OnService,
  EveryService,
  ForEvery,
} from './types'

// Workers RPC Client (Cap'n Web / Cloudflare Workers RPC)
export { WorkersRPCClient, createWorkersRPCClient, createWorkersBusinessContext, isWorkersContext } from './workers-rpc'
export type { RPCServiceBindings } from './workers-rpc'
export { isValidDateString, toDateString, validateId, isValidPermission, UserServiceError as UserServiceErrorClass } from './types'

// Every scheduling types and functions
export type { ScheduleContext, ScheduleCallback, Schedule } from './every'
export {
  createEveryProxy,
  parseCron,
  matchesCron,
  listSchedules,
  getSchedule,
  cancelSchedule,
  pauseSchedule,
  resumeSchedule,
  clearCancelledSchedules,
} from './every'

// API types
export type * from './api'

// Event listener service
export { createOnService, on } from './on'
export type {
  EventHandler,
  EventListenerOptions,
  EventPattern,
  ExecutionResult,
  TelemetryHooks,
  RegistryConfig,
  ErrorHandler,
  BeforeMiddleware,
  AfterMiddleware,
  BusinessEvent,
} from './on'

// Event publishing service
export { createSendProxy, send, EventPublisher } from './send'
export type { SendOptions, EventsServiceConfig, SendResult, QueueBinding } from './send'

// Functions service
export { createFunctionsService, defineFunction, FunctionsService, DeployedFunction } from './functions'
export type {
  FunctionDefinition,
  FunctionMetadata,
  ExecutionResult as FunctionExecutionResult,
  ScheduleConfig,
  LogEntry,
  LogsOptions,
  ListFunctionsOptions,
} from './functions'

// LLM service
export type {
  LLMService,
  LLMProvider,
  MessageRole,
  ChatMessage,
  ToolCall,
  Tool,
  GenerateOptions,
  ChatOptions,
  StreamOptions,
  StreamChunk,
  EmbedOptions,
  Embedding,
  Model,
  BatchRequest,
  BatchResult,
  BatchStatus,
  BatchJob,
  GenerateResponse,
  ChatResponse,
} from './llm'

// Workflows service (Layer 0-1 comprehensive)
export { createWorkflowsService as createWorkflowsServiceLayer01, defineWorkflow } from './workflows'
export type {
  WorkflowsService as WorkflowsServiceLayer01,
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

// Events service
export { createEventsService, EventsService, events } from './events'
export type {
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

// Database service (Layer 0-1)
export { createDatabaseService, DatabaseService } from './database'
export type {
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
  BatchResult as DatabaseBatchResult,
} from './database'

// OAuth service
export { createOAuthService, OAuthService, generateCodeVerifier, generateCodeChallenge } from './oauth'
export type {
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

// Authentication service (OAuth client)
export { createAuthService, auth, AuthService as OAuthServiceClient } from './auth'
export type { AuthUser, SignInOptions, Session as AuthSession, RefreshTokenResponse, SignOutOptions } from './auth'

// Media service
export { createMediaService, media, MediaService } from './media'
export type { MediaFile, UploadOptions, ListMediaOptions, ListMediaResponse, UpdateMediaOptions, TransformImageOptions } from './media'

// Batch operations service
export { createBatchService, batch, BatchService } from './batch'
export type { BatchRequest, BatchResponse, BatchExecuteOptions, BatchResult, BatchValidationResult, BatchCapabilities } from './batch'

// Search service
export { createSearchService, search, SearchService } from './search'
export type { SearchResult, SearchOptions, SearchResponse, SuggestOptions, SuggestResponse, CollectionInfo, CollectionsResponse, SearchStats } from './search'

// Stream service
export { createStreamService, stream, StreamService } from './stream'
export type {
  StreamEvent,
  EventStreamOptions,
  SearchStreamOptions,
  BatchStreamOptions,
  HealthStreamOptions,
  StreamConnection,
  StreamCapabilities,
} from './stream'

// Cache service
export { createCacheService, cache, CacheService } from './cache'
export type {
  CacheMetrics,
  CacheMetricsResponse,
  CacheCapabilities,
  InvalidateResult,
  InvalidateCollectionResult,
  CacheKey,
  CacheKeysResponse,
  ClearResult,
  ResetResult,
  CacheSetOptions,
  CacheGetOptions,
  CacheEntry,
  CacheBatchGetOptions,
  CacheBatchGetResult,
  CacheBatchSetOptions,
  CacheWarmOptions,
  CacheWarmResult,
  CacheStats,
  HTTPInvalidateResult,
} from './cache'

// Storage service (R2)
export { createStorageService, storage, StorageService } from './storage'
export type {
  UploadOptions,
  UploadResponse,
  DownloadOptions,
  DownloadResponse,
  DeleteOptions,
  MultipartUpload,
  Part,
  PartResponse,
  UrlOptions,
  ObjectMetadata,
  ListOptions as StorageListOptions,
  ObjectList,
  CopyOptions,
  CopyResponse,
} from './storage'

// Queue service
export { createQueueService, queue, QueueService } from './queue'
export type { QueueName, PublishOptions, PublishResponse, BatchPublishResponse, QueueStats, HealthStatus } from './queue'

// Vault service
export { createVaultService, vault, VaultService } from './vault'
export type { VaultSecret, SecretMetadata, StoreSecretOptions, ListSecretsOptions, VaultResponse, HealthResponse } from './vault'

// Analytics service
export { createAnalyticsService, analytics, AnalyticsService } from './analytics'
export type {
  TrackEventOptions,
  PageViewOptions,
  IdentifyOptions,
  GroupOptions,
  TrackResponse,
  PixelOptions,
  AnalyticsEvent,
  ListEventsOptions,
  ListEventsResponse,
  AnalyticsMetrics,
  UTMParameters,
} from './analytics'

// Experiments service
export { createExperimentsService, experiments, ExperimentsService } from './experiments'
export type {
  DecideOptions,
  DecideResponse,
  SendEventOptions,
  SendEventResponse,
  ExperimentVariant,
  ExperimentConfig,
  ExperimentSession,
  ExperimentAssignment,
  ExperimentResults,
  ListExperimentsOptions,
  ListExperimentsResponse,
} from './experiments'

// AI service
export { createAIService, ai, AIService } from './ai'
export type {
  AIProvider,
  GenerateTextOptions,
  GenerateTextResponse,
  GenerateObjectOptions,
  GenerateObjectResponse,
  GenerateOptions,
  GenerateResponse,
  ListOptions as AIListOptions,
  ListResponse as AIListResponse,
  ListsOptions,
  ListsResponse,
  EmbedOptions,
  EmbedResponse,
  ForEachOptions,
  ForEachResponse,
  StreamOptions,
  UpsertVector,
  UpsertOptions,
  UpsertResponse,
  SearchOptions as AISearchOptions,
  SearchResult as AISearchResult,
  SearchResponse as AISearchResponse,
  RunEvalOptions,
  RunEvalResponse,
  EvalResult,
  ListEvalsOptions,
  ListEvalsResponse,
  AgentState,
  BackgroundJobStatus,
} from './ai'

// Database service (Layer 3+)
export { createDatabaseService as createDatabaseServiceLayer3, db, DatabaseService as DatabaseServiceLayer3 } from './db'
export type {
  Document,
  ListOptions as DBListOptions,
  ListResponse as DBListResponse,
  QueryFilter,
  MongoQuery,
  SearchOptions as DBSearchOptions,
  SearchResponse as DBSearchResponse,
  CursorPageRequest,
  CursorPageResponse,
  BatchCreateRequest,
  BatchUpdateRequest,
  BatchDeleteRequest,
  BatchResult,
  Relationship,
  RelationshipsQuery,
} from './db'

// HTTP Client
export { HTTPClient, createHTTPClient, http } from './http'
export type { HTTPRequestOptions, HTTPResponse } from './http'

// Workflows service (Layer 3+ instance management)
export { createWorkflowsService, workflows, WorkflowsService } from './workflows'
export type {
  WorkflowEngine,
  WorkflowStatus as WorkflowInstanceStatus,
  WorkflowInstance,
  CreateWorkflowOptions,
  GetWorkflowOptions,
  ListWorkflowsOptions,
  ListWorkflowsResponse,
  CancelWorkflowOptions,
  QueueWorkflowOptions,
  QueueWorkflowResponse,
  CompareEnginesOptions,
  EngineComparisonResult,
  CompareEnginesResponse,
} from './workflows'

// For backwards compatibility
export { create$ as createClient } from './client'

// Webhook verification and signing utilities (re-exported from webhooks.do)
export {
  verifyGitHubWebhook,
  verifyStripeWebhook,
  verifyWorkOSWebhook,
  verifyZapierWebhook,
  verifyDoWebhook,
  signWebhook,
  verifyWebhook,
  sendWebhook,
} from 'webhooks.do'
export type { WebhookVerificationResult } from 'webhooks.do'

// Agents API - Define, deploy, and execute AI agents
export { defineAgent, listAgents, getAgent, Agent } from './agents'
export type {
  AgentConfig,
  AgentTool,
  AutonomyLevel,
  AgentState,
  DeployOptions,
  ExecuteOptions,
  ExecuteResult,
  AgentStatus,
  AgentMetrics,
  PendingAction,
  ExecutedAction,
} from './agents'

// Triggers service
export { createTriggersService, defineTrigger, TriggersService, Trigger, triggers } from './triggers'
export type {
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

// Actions service
export { createActionsService, defineAction, ActionsService, actions } from './actions'
export type { Action, ActionDefinition, ActionContext, ActionResult, ComposedAction, ParameterDefinition, ParameterType, ExecuteOptions } from './actions'
