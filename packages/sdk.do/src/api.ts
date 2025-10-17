/**
 * API Interface Types for sdk.do
 *
 * This module provides TypeScript types for:
 * 1. .do platform primitives (database, workflows, agents, etc.)
 * 2. Popular third-party integrations (Stripe, GitHub, Twilio, etc.)
 * 3. Zapier integrations (triggers, actions, searches)
 * 4. Webhook callbacks and event handlers
 */

// =============================================================================
// Core API Service Types
// =============================================================================

/**
 * Main API service interface
 * Provides access to all platform and third-party APIs
 */
export interface APIService {
  // .do Platform Primitives
  database: DatabaseAPI
  workflows: WorkflowsAPI
  agents: AgentsAPI
  llm: LLMAPI
  triggers: TriggersAPI
  searches: SearchesAPI
  actions: ActionsAPI
  analytics: AnalyticsAPI
  evals: EvalsAPI
  experiments: ExperimentsAPI
  integrations: IntegrationsAPI
  webhooks: WebhooksAPI
  emails: EmailsAPI
  embeddings: EmbeddingsAPI
  extract: ExtractAPI
  browse: BrowseAPI
  queue: QueueAPI

  // Popular Third-Party Integrations (via RPC, not direct client)
  stripe: StripeAPI
  github: GitHubAPI
  twilio: TwilioAPI
  sendgrid: SendGridAPI
  slack: SlackAPI
  googleSheets: GoogleSheetsAPI
  salesforce: SalesforceAPI
  hubspot: HubSpotAPI
  trello: TrelloAPI
  asana: AsanaAPI
  mailchimp: MailchimpAPI

  // Zapier Integration Registry
  zapier: ZapierAPI

  // Composio Integration Platform (200+ apps, 3000+ actions)
  composio: ComposioAPI

  // Generic integration access
  integration(name: string): IntegrationAPI

  // Webhook event handlers
  on: WebhookHandlers
}

// =============================================================================
// .do Platform Primitive APIs
// =============================================================================

export interface DatabaseAPI {
  query(sql: string, params?: any[]): Promise<any[]>
  get(ns: string, id: string): Promise<any>
  list(ns: string, options?: ListOptions): Promise<any[]>
  create(ns: string, data: any): Promise<any>
  update(ns: string, id: string, data: any): Promise<any>
  delete(ns: string, id: string): Promise<void>
  search(ns: string, query: string, options?: SearchOptions): Promise<any[]>
  relate(ns: string, from: string, to: string, type?: string): Promise<void>
}

export interface WorkflowsAPI {
  create(workflow: WorkflowDefinition): Promise<Workflow>
  get(id: string): Promise<Workflow>
  list(options?: ListOptions): Promise<Workflow[]>
  execute(id: string, input?: any): Promise<WorkflowExecution>
  cancel(executionId: string): Promise<void>
  pause(executionId: string): Promise<void>
  resume(executionId: string): Promise<void>
  getExecution(executionId: string): Promise<WorkflowExecution>
}

export interface AgentsAPI {
  create(agent: AgentDefinition): Promise<Agent>
  get(id: string): Promise<Agent>
  list(options?: ListOptions): Promise<Agent[]>
  deploy(id: string): Promise<AgentDeployment>
  invoke(id: string, input: any): Promise<AgentResponse>
  stop(id: string): Promise<void>
  getLogs(id: string, options?: LogOptions): Promise<AgentLog[]>
}

export interface LLMAPI {
  generateText(prompt: string, options?: GenerateOptions): Promise<{ text: string }>
  generate(prompt: string, options?: GenerateOptions): Promise<any>
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>
  embed(text: string | string[], options?: EmbedOptions): Promise<number[] | number[][]>
  models(): Promise<Model[]>
  getModel(id: string): Promise<Model>
}

export interface TriggersAPI {
  create(trigger: TriggerDefinition): Promise<Trigger>
  get(id: string): Promise<Trigger>
  list(integration?: string, options?: ListOptions): Promise<Trigger[]>
  enable(id: string): Promise<void>
  disable(id: string): Promise<void>
  test(id: string, input?: any): Promise<any>
}

export interface SearchesAPI {
  create(search: SearchDefinition): Promise<Search>
  get(id: string): Promise<Search>
  list(integration?: string, options?: ListOptions): Promise<Search[]>
  execute(id: string, query: any): Promise<any[]>
}

export interface ActionsAPI {
  create(action: ActionDefinition): Promise<Action>
  get(id: string): Promise<Action>
  list(integration?: string, options?: ListOptions): Promise<Action[]>
  execute(id: string, input: any): Promise<any>
}

export interface AnalyticsAPI {
  track(event: string, properties?: any): Promise<void>
  identify(userId: string, traits?: any): Promise<void>
  query(query: AnalyticsQuery): Promise<any[]>
  report(type: string, options?: ReportOptions): Promise<Report>
}

export interface EvalsAPI {
  create(evaluation: EvalDefinition): Promise<Eval>
  run(id: string, input: any): Promise<EvalResult>
  list(options?: ListOptions): Promise<Eval[]>
  getResults(id: string, options?: ListOptions): Promise<EvalResult[]>
}

export interface ExperimentsAPI {
  create(experiment: ExperimentDefinition): Promise<Experiment>
  get(id: string): Promise<Experiment>
  list(options?: ListOptions): Promise<Experiment[]>
  start(id: string): Promise<void>
  stop(id: string): Promise<void>
  getResults(id: string): Promise<ExperimentResults>
}

export interface IntegrationsAPI {
  list(options?: ListOptions): Promise<Integration[]>
  get(name: string): Promise<Integration>
  install(name: string, config: any): Promise<IntegrationInstallation>
  uninstall(name: string): Promise<void>
  configure(name: string, config: any): Promise<void>
  test(name: string): Promise<TestResult>
}

export interface WebhooksAPI {
  create(webhook: WebhookDefinition): Promise<Webhook>
  get(id: string): Promise<Webhook>
  list(options?: ListOptions): Promise<Webhook[]>
  delete(id: string): Promise<void>
  test(id: string, payload?: any): Promise<WebhookTestResult>
  getLogs(id: string, options?: LogOptions): Promise<WebhookLog[]>
}

export interface EmailsAPI {
  send(email: EmailMessage): Promise<EmailResult>
  sendTemplate(templateId: string, to: string, data: any): Promise<EmailResult>
  verify(email: string): Promise<EmailVerification>
  track(messageId: string): Promise<EmailTracking>
}

export interface EmbeddingsAPI {
  create(text: string | string[], options?: EmbedOptions): Promise<number[] | number[][]>
  search(query: string, namespace: string, options?: VectorSearchOptions): Promise<VectorSearchResult[]>
  upsert(namespace: string, vectors: Vector[]): Promise<void>
  delete(namespace: string, ids: string[]): Promise<void>
}

export interface ExtractAPI {
  text(url: string): Promise<{ text: string; metadata?: any }>
  html(url: string): Promise<{ html: string; metadata?: any }>
  structured(url: string, schema: any): Promise<any>
  pdf(url: string): Promise<{ text: string; pages: number }>
}

export interface BrowseAPI {
  navigate(url: string): Promise<BrowserPage>
  screenshot(url: string, options?: ScreenshotOptions): Promise<{ url: string; data?: ArrayBuffer }>
  evaluate(url: string, script: string): Promise<any>
  fill(url: string, selector: string): Promise<void>
  click(url: string, selector: string): Promise<void>
}

export interface QueueAPI {
  send(queue: string, message: any, options?: QueueOptions): Promise<{ messageId: string }>
  receive(queue: string, options?: ReceiveOptions): Promise<QueueMessage[]>
  delete(queue: string, messageId: string): Promise<void>
  peek(queue: string, count?: number): Promise<QueueMessage[]>
  stats(queue: string): Promise<QueueStats>
}

// =============================================================================
// Third-Party Integration APIs (via RPC)
// =============================================================================

export interface StripeAPI {
  customers: {
    create(params: any): Promise<any>
    retrieve(id: string): Promise<any>
    update(id: string, params: any): Promise<any>
    list(params?: any): Promise<any>
  }
  charges: {
    create(params: any): Promise<any>
    retrieve(id: string): Promise<any>
    list(params?: any): Promise<any>
  }
  paymentIntents: {
    create(params: any): Promise<any>
    retrieve(id: string): Promise<any>
    confirm(id: string, params?: any): Promise<any>
  }
  subscriptions: {
    create(params: any): Promise<any>
    retrieve(id: string): Promise<any>
    update(id: string, params: any): Promise<any>
    cancel(id: string): Promise<any>
  }
  // Webhook event handlers
  on: {
    'customer.created'(handler: (data: any) => void | Promise<void>): void
    'payment_intent.succeeded'(handler: (data: any) => void | Promise<void>): void
    'charge.succeeded'(handler: (data: any) => void | Promise<void>): void
    [event: string]: (handler: (data: any) => void | Promise<void>) => void
  }
}

export interface GitHubAPI {
  repos: {
    get(owner: string, repo: string): Promise<any>
    list(params?: any): Promise<any>
    create(params: any): Promise<any>
    update(owner: string, repo: string, params: any): Promise<any>
  }
  issues: {
    list(owner: string, repo: string, params?: any): Promise<any>
    get(owner: string, repo: string, issueNumber: number): Promise<any>
    create(owner: string, repo: string, params: any): Promise<any>
    update(owner: string, repo: string, issueNumber: number, params: any): Promise<any>
  }
  pulls: {
    list(owner: string, repo: string, params?: any): Promise<any>
    get(owner: string, repo: string, pullNumber: number): Promise<any>
    create(owner: string, repo: string, params: any): Promise<any>
    merge(owner: string, repo: string, pullNumber: number, params?: any): Promise<any>
  }
  on: {
    'push'(handler: (data: any) => void | Promise<void>): void
    'pull_request'(handler: (data: any) => void | Promise<void>): void
    'issues'(handler: (data: any) => void | Promise<void>): void
    [event: string]: (handler: (data: any) => void | Promise<void>) => void
  }
}

export interface TwilioAPI {
  messages: {
    create(params: { to: string; from: string; body: string }): Promise<any>
    list(params?: any): Promise<any>
    get(sid: string): Promise<any>
  }
  calls: {
    create(params: { to: string; from: string; url: string }): Promise<any>
    list(params?: any): Promise<any>
    get(sid: string): Promise<any>
  }
  on: {
    'message.received'(handler: (data: any) => void | Promise<void>): void
    'call.completed'(handler: (data: any) => void | Promise<void>): void
    [event: string]: (handler: (data: any) => void | Promise<void>) => void
  }
}

export interface SendGridAPI {
  send(params: { to: string; from: string; subject: string; text?: string; html?: string }): Promise<any>
  sendMultiple(params: { to: string[]; from: string; subject: string; text?: string; html?: string }): Promise<any>
  on: {
    'email.delivered'(handler: (data: any) => void | Promise<void>): void
    'email.opened'(handler: (data: any) => void | Promise<void>): void
    'email.clicked'(handler: (data: any) => void | Promise<void>): void
    [event: string]: (handler: (data: any) => void | Promise<void>) => void
  }
}

export interface SlackAPI {
  chat: {
    postMessage(params: { channel: string; text: string; blocks?: any[] }): Promise<any>
    update(params: { channel: string; ts: string; text: string }): Promise<any>
    delete(params: { channel: string; ts: string }): Promise<any>
  }
  users: {
    list(params?: any): Promise<any>
    info(userId: string): Promise<any>
  }
  on: {
    'message'(handler: (data: any) => void | Promise<void>): void
    'reaction_added'(handler: (data: any) => void | Promise<void>): void
    [event: string]: (handler: (data: any) => void | Promise<void>) => void
  }
}

export interface GoogleSheetsAPI {
  spreadsheets: {
    get(spreadsheetId: string): Promise<any>
    create(params: any): Promise<any>
    values: {
      get(spreadsheetId: string, range: string): Promise<any>
      update(spreadsheetId: string, range: string, values: any[][]): Promise<any>
      append(spreadsheetId: string, range: string, values: any[][]): Promise<any>
    }
  }
  on: {
    'row.created'(handler: (data: any) => void | Promise<void>): void
    'row.updated'(handler: (data: any) => void | Promise<void>): void
    [event: string]: (handler: (data: any) => void | Promise<void>) => void
  }
}

export interface SalesforceAPI {
  sobjects: {
    create(type: string, data: any): Promise<any>
    retrieve(type: string, id: string): Promise<any>
    update(type: string, id: string, data: any): Promise<any>
    delete(type: string, id: string): Promise<any>
  }
  query(soql: string): Promise<any>
  search(sosl: string): Promise<any>
  on: {
    'record.created'(handler: (data: any) => void | Promise<void>): void
    'record.updated'(handler: (data: any) => void | Promise<void>): void
    [event: string]: (handler: (data: any) => void | Promise<void>) => void
  }
}

export interface HubSpotAPI {
  contacts: {
    create(params: any): Promise<any>
    get(id: string): Promise<any>
    update(id: string, params: any): Promise<any>
    list(params?: any): Promise<any>
  }
  deals: {
    create(params: any): Promise<any>
    get(id: string): Promise<any>
    update(id: string, params: any): Promise<any>
    list(params?: any): Promise<any>
  }
  companies: {
    create(params: any): Promise<any>
    get(id: string): Promise<any>
    update(id: string, params: any): Promise<any>
    list(params?: any): Promise<any>
  }
  on: {
    'contact.created'(handler: (data: any) => void | Promise<void>): void
    'deal.created'(handler: (data: any) => void | Promise<void>): void
    [event: string]: (handler: (data: any) => void | Promise<void>) => void
  }
}

export interface TrelloAPI {
  cards: {
    create(params: { name: string; idList: string; desc?: string }): Promise<any>
    get(id: string): Promise<any>
    update(id: string, params: any): Promise<any>
    delete(id: string): Promise<any>
  }
  lists: {
    get(id: string): Promise<any>
    create(params: { name: string; idBoard: string }): Promise<any>
  }
  boards: {
    get(id: string): Promise<any>
    list(params?: any): Promise<any>
  }
  on: {
    'card.created'(handler: (data: any) => void | Promise<void>): void
    'card.moved'(handler: (data: any) => void | Promise<void>): void
    [event: string]: (handler: (data: any) => void | Promise<void>) => void
  }
}

export interface AsanaAPI {
  tasks: {
    create(params: any): Promise<any>
    get(id: string): Promise<any>
    update(id: string, params: any): Promise<any>
    delete(id: string): Promise<any>
    list(params?: any): Promise<any>
  }
  projects: {
    get(id: string): Promise<any>
    create(params: any): Promise<any>
    list(params?: any): Promise<any>
  }
  on: {
    'task.created'(handler: (data: any) => void | Promise<void>): void
    'task.completed'(handler: (data: any) => void | Promise<void>): void
    [event: string]: (handler: (data: any) => void | Promise<void>) => void
  }
}

export interface MailchimpAPI {
  lists: {
    get(id: string): Promise<any>
    list(params?: any): Promise<any>
    members: {
      add(listId: string, params: any): Promise<any>
      update(listId: string, email: string, params: any): Promise<any>
      remove(listId: string, email: string): Promise<any>
    }
  }
  campaigns: {
    create(params: any): Promise<any>
    get(id: string): Promise<any>
    send(id: string): Promise<any>
  }
  on: {
    'subscriber.added'(handler: (data: any) => void | Promise<void>): void
    'subscriber.unsubscribed'(handler: (data: any) => void | Promise<void>): void
    [event: string]: (handler: (data: any) => void | Promise<void>) => void
  }
}

// =============================================================================
// Zapier Integration API
// =============================================================================

export interface ZapierAPI {
  // List all available integrations
  integrations(): Promise<ZapierIntegration[]>

  // Get a specific integration
  integration(key: string): ZapierIntegrationAPI

  // Access triggers, actions, searches for any integration
  trigger(integrationKey: string, triggerKey: string): ZapierTriggerAPI
  action(integrationKey: string, actionKey: string): ZapierActionAPI
  search(integrationKey: string, searchKey: string): ZapierSearchAPI
}

export interface ZapierIntegrationAPI {
  info(): Promise<ZapierIntegration>
  triggers(): Promise<ZapierTrigger[]>
  actions(): Promise<ZapierAction[]>
  searches(): Promise<ZapierSearch[]>

  trigger(key: string): ZapierTriggerAPI
  action(key: string): ZapierActionAPI
  search(key: string): ZapierSearchAPI
}

export interface ZapierTriggerAPI {
  info(): Promise<ZapierTrigger>
  test(input?: any): Promise<any[]>
  subscribe(webhookUrl: string, config?: any): Promise<SubscriptionResult>
  unsubscribe(subscriptionId: string): Promise<void>
}

export interface ZapierActionAPI {
  info(): Promise<ZapierAction>
  execute(input: any): Promise<any>
  test(input: any): Promise<any>
}

export interface ZapierSearchAPI {
  info(): Promise<ZapierSearch>
  execute(query: any): Promise<any[]>
  test(query: any): Promise<any[]>
}

// =============================================================================
// Composio Integration Platform
// =============================================================================

/**
 * Composio API - AI-native integration platform
 * Provides access to 200+ apps with 3000+ actions
 *
 * Features:
 * - Managed OAuth 2.0 with automatic token refresh
 * - Webhook-based triggers for real-time events
 * - TypeScript SDK with full type safety
 * - Edge-compatible (Cloudflare Workers)
 */
export interface ComposioAPI {
  // App/Integration Management
  listApps(filters?: ComposioListFilters): Promise<ComposioListResponse<ComposioApp>>
  getApp(appKey: string): Promise<ComposioApp>

  // Actions
  listActions(filters?: ComposioActionFilters): Promise<ComposioAction[]>
  getAction(actionName: string): Promise<ComposioAction>
  executeAction<T = any>(options: ComposioExecuteActionOptions): Promise<T>

  // Triggers (Event Subscriptions)
  listTriggers(filters?: ComposioTriggerFilters): Promise<ComposioTrigger[]>
  setupTrigger(options: ComposioSetupTriggerOptions): Promise<ComposioTrigger>

  // Connected Accounts (User Authentication)
  listConnections(filters?: ComposioConnectionFilters): Promise<ComposioConnectedAccount[]>
  initiateConnection(options: ComposioInitiateConnectionOptions): Promise<ComposioConnectionResult>
  getConnection(connectionId: string): Promise<ComposioConnectedAccount>
  deleteConnection(connectionId: string): Promise<void>
}

// =============================================================================
// Generic Integration API
// =============================================================================

export interface IntegrationAPI {
  get(endpoint: string, params?: any): Promise<any>
  post(endpoint: string, data?: any): Promise<any>
  put(endpoint: string, data?: any): Promise<any>
  patch(endpoint: string, data?: any): Promise<any>
  delete(endpoint: string): Promise<any>
  request(options: RequestOptions): Promise<any>
}

// =============================================================================
// Webhook Event Handlers
// =============================================================================

export interface WebhookHandlers {
  // Platform events
  'workflow.completed'(handler: (data: any) => void | Promise<void>): void
  'workflow.failed'(handler: (data: any) => void | Promise<void>): void
  'agent.invoked'(handler: (data: any) => void | Promise<void>): void
  'database.record.created'(handler: (data: any) => void | Promise<void>): void
  'database.record.updated'(handler: (data: any) => void | Promise<void>): void

  // Third-party integration events (see individual APIs for specific events)
  stripe: StripeAPI['on']
  github: GitHubAPI['on']
  twilio: TwilioAPI['on']
  sendgrid: SendGridAPI['on']
  slack: SlackAPI['on']
  googleSheets: GoogleSheetsAPI['on']
  salesforce: SalesforceAPI['on']
  hubspot: HubSpotAPI['on']
  trello: TrelloAPI['on']
  asana: AsanaAPI['on']
  mailchimp: MailchimpAPI['on']

  // Generic webhook handler
  [event: string]: ((handler: (data: any) => void | Promise<void>) => void) | any
}

// =============================================================================
// Supporting Types
// =============================================================================

export interface ListOptions {
  limit?: number
  offset?: number
  orderBy?: string
  order?: 'asc' | 'desc'
  filter?: any
}

export interface SearchOptions {
  limit?: number
  offset?: number
  fields?: string[]
  highlight?: boolean
}

export interface LogOptions {
  limit?: number
  since?: Date
  until?: Date
  level?: 'debug' | 'info' | 'warn' | 'error'
}

export interface WorkflowDefinition {
  name: string
  description?: string
  steps: WorkflowStep[]
  input?: any
  output?: any
}

export interface WorkflowStep {
  id: string
  type: string
  params: any
  next?: string | string[]
}

export interface Workflow {
  id: string
  name: string
  definition: WorkflowDefinition
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  input?: any
  output?: any
  error?: string
  startedAt: Date
  completedAt?: Date
}

export interface AgentDefinition {
  name: string
  description?: string
  model?: string
  instructions?: string
  tools?: string[]
}

export interface Agent {
  id: string
  name: string
  definition: AgentDefinition
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

export interface AgentDeployment {
  id: string
  agentId: string
  status: 'deployed' | 'deploying' | 'failed'
  url?: string
}

export interface AgentResponse {
  output: any
  usage?: {
    tokens: number
    cost: number
  }
}

export interface AgentLog {
  timestamp: Date
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  data?: any
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  message: ChatMessage
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface GenerateOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  schema?: any
}

export interface ChatOptions extends GenerateOptions {
  stream?: boolean
}

export interface EmbedOptions {
  model?: string
  dimensions?: number
}

export interface Model {
  id: string
  name: string
  provider: string
  contextWindow: number
  pricing?: {
    input: number
    output: number
  }
}

export interface TriggerDefinition {
  integration: string
  name: string
  key: string
  type: 'polling' | 'webhook' | 'realtime' | 'scheduled'
  config: any
}

export interface Trigger {
  id: string
  integration: string
  name: string
  key: string
  type: string
  enabled: boolean
}

export interface SearchDefinition {
  integration: string
  name: string
  key: string
  config: any
}

export interface Search {
  id: string
  integration: string
  name: string
  key: string
}

export interface ActionDefinition {
  integration: string
  name: string
  key: string
  category: string
  config: any
}

export interface Action {
  id: string
  integration: string
  name: string
  key: string
  category: string
}

export interface AnalyticsQuery {
  metric: string
  dimensions?: string[]
  filters?: any
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface ReportOptions {
  format?: 'json' | 'csv' | 'pdf'
  email?: string
}

export interface Report {
  id: string
  type: string
  data: any
  generatedAt: Date
}

export interface EvalDefinition {
  name: string
  description?: string
  type: string
  config: any
}

export interface Eval {
  id: string
  name: string
  type: string
}

export interface EvalResult {
  id: string
  evalId: string
  score: number
  passed: boolean
  details?: any
  timestamp: Date
}

export interface ExperimentDefinition {
  name: string
  description?: string
  variants: ExperimentVariant[]
  metrics: string[]
}

export interface ExperimentVariant {
  id: string
  name: string
  config: any
  weight: number
}

export interface Experiment {
  id: string
  name: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  variants: ExperimentVariant[]
}

export interface ExperimentResults {
  experimentId: string
  variants: Array<{
    id: string
    name: string
    metrics: Record<string, number>
    traffic: number
  }>
  winner?: string
}

export interface Integration {
  id: string
  name: string
  slug: string
  category: string
  description?: string
  website?: string
  authentication: {
    type: 'oauth2' | 'api_key' | 'bearer' | 'basic' | 'custom'
  }
}

export interface IntegrationInstallation {
  id: string
  integration: string
  status: 'active' | 'inactive'
  config: any
}

export interface TestResult {
  success: boolean
  message?: string
  details?: any
}

export interface WebhookDefinition {
  url: string
  events: string[]
  secret?: string
  headers?: Record<string, string>
}

export interface Webhook {
  id: string
  url: string
  events: string[]
  active: boolean
  createdAt: Date
}

export interface WebhookTestResult {
  success: boolean
  status: number
  response?: any
  error?: string
}

export interface WebhookLog {
  timestamp: Date
  event: string
  status: number
  duration: number
  error?: string
}

export interface EmailMessage {
  to: string | string[]
  from: string
  subject: string
  text?: string
  html?: string
  attachments?: EmailAttachment[]
}

export interface EmailAttachment {
  filename: string
  content: string | ArrayBuffer | Uint8Array
  contentType?: string
}

export interface EmailResult {
  messageId: string
  accepted: string[]
  rejected: string[]
}

export interface EmailVerification {
  email: string
  valid: boolean
  reason?: string
}

export interface EmailTracking {
  messageId: string
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained'
  events: Array<{
    event: string
    timestamp: Date
  }>
}

export interface Vector {
  id: string
  values: number[]
  metadata?: any
}

export interface VectorSearchOptions {
  topK?: number
  filter?: any
  includeMetadata?: boolean
}

export interface VectorSearchResult {
  id: string
  score: number
  metadata?: any
}

export interface BrowserPage {
  url: string
  title: string
  html: string
}

export interface ScreenshotOptions {
  fullPage?: boolean
  width?: number
  height?: number
  format?: 'png' | 'jpeg'
}

export interface QueueOptions {
  delay?: number
  priority?: number
  dedupe?: boolean
}

export interface ReceiveOptions {
  maxMessages?: number
  visibilityTimeout?: number
  waitTime?: number
}

export interface QueueMessage {
  id: string
  body: any
  receiptHandle: string
  attributes?: any
}

export interface QueueStats {
  name: string
  size: number
  inFlight: number
  delayed: number
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  headers?: Record<string, string>
  params?: any
  data?: any
  timeout?: number
}

export interface ZapierIntegration {
  key: string
  name: string
  description: string
  category: string
  imageUrl?: string
  url: string
}

export interface ZapierTrigger {
  key: string
  name: string
  description: string
  type: 'polling' | 'webhook' | 'realtime' | 'scheduled'
  inputFields: ZapierField[]
  outputFields: ZapierField[]
}

export interface ZapierAction {
  key: string
  name: string
  description: string
  category: string
  inputFields: ZapierField[]
  outputFields: ZapierField[]
}

export interface ZapierSearch {
  key: string
  name: string
  description: string
  inputFields: ZapierField[]
  outputFields: ZapierField[]
}

export interface ZapierField {
  key: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'dropdown' | 'file' | 'textarea' | 'array'
  required: boolean
  description?: string
  default?: any
  placeholder?: string
}

export interface SubscriptionResult {
  id: string
  webhookUrl: string
  active: boolean
}

// =============================================================================
// Composio Types
// =============================================================================

/**
 * Composio app/integration metadata
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
 * Composio action/tool metadata
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
 * Composio trigger metadata
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
 * Composio connected account
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
 * Composio pagination info
 */
export interface ComposioPageInfo {
  total: number
  page: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

/**
 * Composio list response wrapper
 */
export interface ComposioListResponse<T> {
  items: T[]
  pageInfo: ComposioPageInfo
}

/**
 * Composio list filters
 */
export interface ComposioListFilters {
  page?: number
  pageSize?: number
  search?: string
}

/**
 * Composio action filters
 */
export interface ComposioActionFilters extends ComposioListFilters {
  appName?: string
}

/**
 * Composio trigger filters
 */
export interface ComposioTriggerFilters extends ComposioListFilters {
  appName?: string
}

/**
 * Composio connection filters
 */
export interface ComposioConnectionFilters {
  userId?: string
  appName?: string
}

/**
 * Composio action execution options
 */
export interface ComposioExecuteActionOptions {
  actionName: string
  userId?: string
  connectedAccountId?: string
  params: Record<string, any>
  auth?: ComposioCustomAuth
}

/**
 * Composio custom authentication credentials
 */
export interface ComposioCustomAuth {
  type: 'api_key' | 'bearer' | 'basic'
  value: string | { username: string; password: string }
}

/**
 * Composio trigger setup options
 */
export interface ComposioSetupTriggerOptions {
  userId: string
  triggerName: string
  config?: Record<string, any>
}

/**
 * Composio connection initiation options
 */
export interface ComposioInitiateConnectionOptions {
  userId: string
  authConfigId: string
  redirectUrl?: string
  allowMultiple?: boolean
}

/**
 * Composio connection result
 */
export interface ComposioConnectionResult {
  redirectUrl: string
  connectionId: string
}

/**
 * Composio trigger event payload
 */
export interface ComposioTriggerEvent<T = any> {
  trigger_name: string
  trigger_id: string
  connected_account_id: string
  payload: T
}
