/**
 * AI Service for SDK.do
 *
 * Provides methods for AI inference, embeddings, vector search, and evaluation.
 * Integrates with Workers AI, OpenAI, Anthropic, Google AI, and OpenRouter.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Generate text
 * const response = await $.ai.generateText('Write a haiku about code', {
 *   provider: 'openai',
 *   model: 'gpt-5'
 * })
 *
 * // Generate structured object
 * const person = await $.ai.generateObject('Extract: John Doe, 30, engineer', {
 *   schema: {
 *     type: 'object',
 *     properties: {
 *       name: { type: 'string' },
 *       age: { type: 'number' },
 *       occupation: { type: 'string' }
 *     }
 *   }
 * })
 *
 * // Vector search
 * const results = await $.ai.search('What is serverless?', {
 *   topK: 5
 * })
 * ```
 */

// ============================================================================
// TYPES - Layer 2 Integration
// ============================================================================

export type AIProvider = 'workers-ai' | 'openai' | 'openrouter' | 'googleai' | 'anthropic'

// ============================================================================
// CHAT & COMPLETION TYPES (workers/llm integration)
// ============================================================================

export interface ChatMessage {
  /**
   * Message role
   */
  role: 'system' | 'user' | 'assistant' | 'function'

  /**
   * Message content
   */
  content: string

  /**
   * Function call name (if role is 'function')
   */
  name?: string
}

export interface ChatOptions {
  /**
   * Chat messages
   */
  messages: ChatMessage[]

  /**
   * AI provider to use
   */
  provider?: AIProvider

  /**
   * Model to use
   */
  model?: string

  /**
   * Temperature (0-2)
   */
  temperature?: number

  /**
   * Maximum tokens to generate
   */
  maxTokens?: number

  /**
   * Top P sampling
   */
  topP?: number

  /**
   * Frequency penalty
   */
  frequencyPenalty?: number

  /**
   * Presence penalty
   */
  presencePenalty?: number

  /**
   * Stop sequences
   */
  stop?: string[]
}

export interface ChatResponse {
  /**
   * Generated message
   */
  message: ChatMessage

  /**
   * Token usage
   */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }

  /**
   * Finish reason
   */
  finishReason?: string

  /**
   * Provider used
   */
  provider: string

  /**
   * Model used
   */
  model: string
}

export interface CompleteOptions {
  /**
   * Prompt text
   */
  prompt: string

  /**
   * AI provider to use
   */
  provider?: AIProvider

  /**
   * Model to use
   */
  model?: string

  /**
   * Temperature (0-2)
   */
  temperature?: number

  /**
   * Maximum tokens
   */
  maxTokens?: number

  /**
   * Top P sampling
   */
  topP?: number

  /**
   * Stop sequences
   */
  stop?: string[]
}

export interface CompleteResponse {
  /**
   * Completion text
   */
  text: string

  /**
   * Token usage
   */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }

  /**
   * Finish reason
   */
  finishReason?: string

  /**
   * Provider used
   */
  provider: string

  /**
   * Model used
   */
  model: string
}

export interface StructuredOptions<T = any> {
  /**
   * Prompt for generation
   */
  prompt: string

  /**
   * JSON schema for output
   */
  schema: Record<string, any>

  /**
   * AI provider to use
   */
  provider?: AIProvider

  /**
   * Model to use
   */
  model?: string

  /**
   * Temperature
   */
  temperature?: number

  /**
   * Maximum tokens
   */
  maxTokens?: number
}

export interface StreamChunk {
  /**
   * Chunk text
   */
  text: string

  /**
   * Is final chunk
   */
  done: boolean

  /**
   * Usage stats (only in final chunk)
   */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// ============================================================================
// VECTOR OPERATIONS TYPES (workers/vectors integration)
// ============================================================================

export interface VectorUpsertOptions {
  /**
   * Vectors to upsert
   */
  vectors: UpsertVector[]

  /**
   * Index name (optional, defaults to default index)
   */
  index?: string

  /**
   * Provider for embedding generation
   */
  provider?: AIProvider

  /**
   * Model for embedding generation
   */
  model?: string
}

export interface VectorUpsertResponse {
  /**
   * Number of vectors upserted
   */
  count: number

  /**
   * Vector IDs
   */
  ids: string[]

  /**
   * Index name
   */
  index: string
}

export interface VectorSearchOptions {
  /**
   * Number of results
   */
  topK?: number

  /**
   * Metadata filter
   */
  filter?: Record<string, any>

  /**
   * Return metadata
   */
  returnMetadata?: boolean

  /**
   * Return values (embeddings)
   */
  returnValues?: boolean

  /**
   * Index name
   */
  index?: string

  /**
   * Provider for query embedding
   */
  provider?: AIProvider

  /**
   * Model for query embedding
   */
  model?: string
}

export interface VectorSearchResponse {
  /**
   * Search results
   */
  results: SearchResult[]

  /**
   * Query embedding
   */
  queryEmbedding?: number[]

  /**
   * Index name
   */
  index: string
}

export interface VectorQueryOptions {
  /**
   * Number of results
   */
  topK?: number

  /**
   * Metadata filter
   */
  filter?: Record<string, any>

  /**
   * Return metadata
   */
  returnMetadata?: boolean

  /**
   * Return values
   */
  returnValues?: boolean

  /**
   * Index name
   */
  index?: string
}

export interface VectorQueryResponse {
  /**
   * Query results
   */
  results: SearchResult[]

  /**
   * Index name
   */
  index: string
}

export interface VectorDeleteOptions {
  /**
   * Vector IDs to delete
   */
  ids: string[]

  /**
   * Index name
   */
  index?: string
}

// ============================================================================
// MODEL OPERATIONS TYPES (workers/models integration)
// ============================================================================

export interface Model {
  /**
   * Model ID
   */
  id: string

  /**
   * Model name
   */
  name: string

  /**
   * Provider
   */
  provider: string

  /**
   * Context window size
   */
  contextWindow: number

  /**
   * Input cost per 1M tokens (USD)
   */
  inputCostPer1M: number

  /**
   * Output cost per 1M tokens (USD)
   */
  outputCostPer1M: number

  /**
   * Capabilities
   */
  capabilities: string[]

  /**
   * Maximum tokens
   */
  maxTokens?: number

  /**
   * Additional metadata
   */
  metadata?: Record<string, any>
}

export interface ModelRequirements {
  /**
   * Minimum context window
   */
  minContextWindow?: number

  /**
   * Maximum cost per 1M tokens
   */
  maxCostPer1M?: number

  /**
   * Required capabilities
   */
  capabilities?: string[]

  /**
   * Preferred provider
   */
  provider?: string
}

export interface ModelRouteRequest {
  /**
   * Task description
   */
  task: string

  /**
   * Model requirements
   */
  requirements?: ModelRequirements
}

export interface ModelRouteResponse {
  /**
   * Selected model
   */
  model: Model

  /**
   * Selection score
   */
  score: number

  /**
   * Selection reasoning
   */
  reasoning: string
}

export interface ModelFilters {
  /**
   * Filter by provider
   */
  provider?: string

  /**
   * Minimum context window
   */
  minContextWindow?: number

  /**
   * Maximum cost
   */
  maxCost?: number

  /**
   * Required capabilities
   */
  capabilities?: string[]
}

export interface Provider {
  /**
   * Provider ID
   */
  id: string

  /**
   * Provider name
   */
  name: string

  /**
   * Base URL
   */
  baseUrl: string

  /**
   * Supported features
   */
  features: string[]

  /**
   * Rate limits
   */
  rateLimits?: {
    requestsPerMinute: number
    tokensPerMinute: number
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface GenerateTextOptions {
  /**
   * AI provider to use
   */
  provider?: AIProvider

  /**
   * Model to use (provider-specific)
   */
  model?: string

  /**
   * Temperature (0-2, default: 0.7)
   */
  temperature?: number

  /**
   * Maximum tokens to generate
   */
  maxTokens?: number

  /**
   * System message
   */
  system?: string

  /**
   * Stop sequences
   */
  stop?: string[]

  /**
   * Top P sampling
   */
  topP?: number

  /**
   * Frequency penalty
   */
  frequencyPenalty?: number

  /**
   * Presence penalty
   */
  presencePenalty?: number
}

export interface GenerateTextResponse {
  /**
   * Generated text
   */
  text: string

  /**
   * Token usage statistics
   */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }

  /**
   * Finish reason
   */
  finishReason?: string

  /**
   * Provider used
   */
  provider: string

  /**
   * Model used
   */
  model: string
}

export interface GenerateObjectOptions extends GenerateTextOptions {
  /**
   * JSON schema for the output
   */
  schema: Record<string, any>

  /**
   * Schema name (optional)
   */
  schemaName?: string
}

export interface GenerateObjectResponse<T = any> {
  /**
   * Generated object matching schema
   */
  object: T

  /**
   * Token usage statistics
   */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }

  /**
   * Provider used
   */
  provider: string

  /**
   * Model used
   */
  model: string
}

export interface GenerateOptions extends Omit<GenerateTextOptions, 'model'> {
  /**
   * Payload collection type (e.g., 'Customer', 'Product')
   */
  type: string

  /**
   * Input data for generation
   */
  input?: Record<string, any>

  /**
   * Additional instructions
   */
  instructions?: string
}

export interface GenerateResponse<T = any> {
  /**
   * Generated data matching type schema
   */
  data: T

  /**
   * Collection type used
   */
  type: string

  /**
   * Token usage statistics
   */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }

  /**
   * Provider used
   */
  provider: string
}

export interface ListOptions extends GenerateTextOptions {
  /**
   * Expected list item type (optional)
   */
  itemType?: string

  /**
   * Minimum items (optional)
   */
  minItems?: number

  /**
   * Maximum items (optional)
   */
  maxItems?: number
}

export interface ListResponse<T = any> {
  /**
   * List name
   */
  name: string

  /**
   * Item type
   */
  itemType: string

  /**
   * Item schema (most specific @type of schema.org Thing each item represents)
   * @example 'ComputerLanguage', 'Person', 'Product', 'Organization', 'Book', 'Country'
   * @see https://schema.org for available types
   */
  itemSchema: string

  /**
   * List items
   */
  items: T[]

  /**
   * Token usage statistics
   */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface ListsOptions extends GenerateTextOptions {
  /**
   * Number of lists to generate
   */
  count?: number
}

export interface ListsResponse<T = any> {
  /**
   * Generated lists
   */
  lists: Array<{
    name: string
    itemType: string
    /**
     * Item schema (most specific @type of schema.org Thing each item represents)
     * @example 'ComputerLanguage', 'Person', 'Product', 'Organization', 'Book', 'Country'
     * @see https://schema.org for available types
     */
    itemSchema: string
    items: T[]
  }>

  /**
   * Token usage statistics
   */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface EmbedOptions {
  /**
   * Provider to use for embeddings
   */
  provider?: AIProvider

  /**
   * Model to use (provider-specific)
   */
  model?: string
}

export interface EmbedResponse {
  /**
   * Embedding vector
   */
  embedding: number[]

  /**
   * Vector dimensions
   */
  dimensions: number

  /**
   * Provider used
   */
  provider: string

  /**
   * Model used
   */
  model: string
}

export interface ForEachOptions<T, R> extends GenerateTextOptions {
  /**
   * Function to apply to each item
   */
  fn: (item: T) => Promise<R> | R

  /**
   * Maximum concurrency
   */
  concurrency?: number
}

export interface ForEachResponse<R> {
  /**
   * Results for each item
   */
  results: R[]

  /**
   * Processing statistics
   */
  stats: {
    total: number
    successful: number
    failed: number
    duration: number
  }
}

export interface StreamOptions extends GenerateTextOptions {
  /**
   * Callback for each chunk
   */
  onChunk?: (chunk: string) => void

  /**
   * Callback when complete
   */
  onComplete?: (fullText: string) => void

  /**
   * Callback for errors
   */
  onError?: (error: Error) => void
}

export interface UpsertVector {
  /**
   * Vector ID
   */
  id: string

  /**
   * Text to embed (will auto-generate embedding)
   */
  text?: string

  /**
   * Pre-computed embedding vector
   */
  values?: number[]

  /**
   * Metadata to store with vector
   */
  metadata?: Record<string, any>
}

export interface UpsertOptions {
  /**
   * Vectors to upsert
   */
  vectors: UpsertVector[]

  /**
   * Provider for embedding generation
   */
  provider?: AIProvider

  /**
   * Model for embedding generation
   */
  model?: string
}

export interface UpsertResponse {
  /**
   * Number of vectors upserted
   */
  count: number

  /**
   * Vector IDs
   */
  ids: string[]
}

export interface SearchOptions {
  /**
   * Number of results to return
   */
  topK?: number

  /**
   * Filter by metadata
   */
  filter?: Record<string, any>

  /**
   * Return metadata with results
   */
  returnMetadata?: boolean

  /**
   * Return values (embeddings) with results
   */
  returnValues?: boolean

  /**
   * Provider for query embedding
   */
  provider?: AIProvider

  /**
   * Model for query embedding
   */
  model?: string
}

export interface SearchResult {
  /**
   * Vector ID
   */
  id: string

  /**
   * Similarity score
   */
  score: number

  /**
   * Metadata (if returnMetadata: true)
   */
  metadata?: Record<string, any>

  /**
   * Vector values (if returnValues: true)
   */
  values?: number[]
}

export interface SearchResponse {
  /**
   * Search results
   */
  results: SearchResult[]

  /**
   * Query embedding used
   */
  queryEmbedding?: number[]
}

export interface RunEvalOptions {
  /**
   * Benchmark ID to evaluate against
   */
  benchmarkId: string

  /**
   * Model ID to evaluate
   */
  modelId?: string

  /**
   * Agent ID to evaluate
   */
  agentId?: string

  /**
   * Workflow ID to evaluate
   */
  workflowId?: string

  /**
   * Configuration for evaluation
   */
  config?: Record<string, any>

  /**
   * Metadata for this eval run
   */
  metadata?: Record<string, any>
}

export interface RunEvalResponse {
  /**
   * Eval ID
   */
  id: string

  /**
   * Benchmark ID
   */
  benchmarkId: string

  /**
   * Status
   */
  status: 'pending' | 'running' | 'completed' | 'failed'

  /**
   * Created timestamp
   */
  createdAt: string
}

export interface EvalResult {
  /**
   * Eval ID
   */
  id: string

  /**
   * Benchmark ID
   */
  benchmarkId: string

  /**
   * Model/Agent/Workflow ID
   */
  subjectId: string

  /**
   * Subject type
   */
  subjectType: 'model' | 'agent' | 'workflow'

  /**
   * Status
   */
  status: 'pending' | 'running' | 'completed' | 'failed'

  /**
   * Results
   */
  results?: {
    /**
     * Overall score (0-1)
     */
    score: number

    /**
     * Task-level scores
     */
    tasks: Array<{
      taskId: string
      score: number
      passed: boolean
      details?: Record<string, any>
    }>

    /**
     * Summary statistics
     */
    summary: {
      total: number
      passed: number
      failed: number
      averageScore: number
    }
  }

  /**
   * Error message (if failed)
   */
  error?: string

  /**
   * Created timestamp
   */
  createdAt: string

  /**
   * Completed timestamp
   */
  completedAt?: string

  /**
   * Metadata
   */
  metadata?: Record<string, any>
}

export interface ListEvalsOptions {
  /**
   * Filter by benchmark ID
   */
  benchmarkId?: string

  /**
   * Filter by model ID
   */
  modelId?: string

  /**
   * Filter by agent ID
   */
  agentId?: string

  /**
   * Filter by workflow ID
   */
  workflowId?: string

  /**
   * Filter by status
   */
  status?: 'pending' | 'running' | 'completed' | 'failed'

  /**
   * Limit results
   */
  limit?: number

  /**
   * Pagination offset
   */
  offset?: number
}

export interface ListEvalsResponse {
  /**
   * Eval results
   */
  results: EvalResult[]

  /**
   * Total count
   */
  total: number

  /**
   * Limit
   */
  limit: number

  /**
   * Offset
   */
  offset: number
}

export interface AgentState {
  /**
   * Agent ID
   */
  id: string

  /**
   * Agent state data
   */
  state: Record<string, any>

  /**
   * Last updated timestamp
   */
  updatedAt: string
}

export interface BackgroundJobStatus {
  /**
   * Job ID
   */
  id: string

  /**
   * Job status
   */
  status: 'pending' | 'processing' | 'completed' | 'failed'

  /**
   * Job result (if completed)
   */
  result?: any

  /**
   * Error message (if failed)
   */
  error?: string

  /**
   * Created timestamp
   */
  createdAt: string

  /**
   * Completed timestamp
   */
  completedAt?: string
}

export interface GenerateCodeOptions extends GenerateTextOptions {
  /**
   * Programming language
   */
  language?: string

  /**
   * Code style/framework preferences
   */
  style?: string

  /**
   * Include comments and documentation
   */
  includeComments?: boolean
}

export interface GenerateCodeResponse {
  /**
   * Generated code
   */
  code: string

  /**
   * Detected or specified language
   */
  language: string

  /**
   * Explanation of the code
   */
  explanation?: string

  /**
   * Token usage statistics
   */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface GenerateImageOptions {
  /**
   * AI provider to use
   */
  provider?: 'workers-ai' | 'openai' | 'stability-ai'

  /**
   * Model to use (provider-specific)
   */
  model?: string

  /**
   * Image size
   */
  size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024'

  /**
   * Number of images to generate
   */
  n?: number

  /**
   * Image quality
   */
  quality?: 'standard' | 'hd'

  /**
   * Style preset
   */
  style?: 'vivid' | 'natural'
}

export interface GenerateImageResponse {
  /**
   * Generated image URL(s) or base64 data
   */
  images: Array<{
    url?: string
    b64_json?: string
  }>

  /**
   * Provider used
   */
  provider: string

  /**
   * Model used
   */
  model: string

  /**
   * Generation timestamp
   */
  createdAt: string
}

export interface GenerateSpeechOptions {
  /**
   * AI provider to use
   */
  provider?: 'openai' | 'elevenlabs' | 'workers-ai'

  /**
   * Voice to use (provider-specific)
   */
  voice?: string

  /**
   * Speech model
   */
  model?: string

  /**
   * Audio format
   */
  format?: 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm'

  /**
   * Speech speed (0.25 to 4.0)
   */
  speed?: number
}

export interface GenerateSpeechResponse {
  /**
   * Audio data (base64 encoded or URL)
   */
  audio: string

  /**
   * Audio format
   */
  format: string

  /**
   * Provider used
   */
  provider: string

  /**
   * Voice used
   */
  voice: string

  /**
   * Duration in seconds
   */
  duration?: number
}

export interface GenerateVideoOptions {
  /**
   * AI provider to use
   */
  provider?: 'runway' | 'pika' | 'workers-ai'

  /**
   * Video model
   */
  model?: string

  /**
   * Video duration in seconds
   */
  duration?: number

  /**
   * Video resolution
   */
  resolution?: '720p' | '1080p' | '4k'

  /**
   * Frames per second
   */
  fps?: number

  /**
   * Style preset
   */
  style?: string
}

export interface GenerateVideoResponse {
  /**
   * Video URL or ID
   */
  video: string

  /**
   * Video format
   */
  format: string

  /**
   * Provider used
   */
  provider: string

  /**
   * Video duration in seconds
   */
  duration: number

  /**
   * Generation status
   */
  status: 'processing' | 'completed' | 'failed'

  /**
   * Job ID (for async generation)
   */
  jobId?: string
}

// ============================================================================
// AI SERVICE
// ============================================================================

export class AIService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://ai.do', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Get authorization headers for authenticated requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }

  /**
   * Generate text from a prompt
   *
   * @param prompt - Text prompt
   * @param options - Generation options
   * @returns Generated text response
   *
   * @example
   * ```typescript
   * const response = await $.ai.generateText('Write a haiku about code', {
   *   provider: 'openai',
   *   model: 'gpt-5',
   *   temperature: 0.7
   * })
   * console.log(response.text)
   * ```
   */
  async generateText(prompt: string, options: GenerateTextOptions = {}): Promise<GenerateTextResponse> {
    const response = await fetch(`${this.baseUrl}/generateText`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        prompt,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to generate text: ${error}`)
    }

    return response.json() as Promise<GenerateTextResponse>
  }

  /**
   * Generate structured object from a prompt
   *
   * @param prompt - Text prompt
   * @param options - Generation options with schema
   * @returns Generated object matching schema
   *
   * @example
   * ```typescript
   * const person = await $.ai.generateObject('Extract: John Doe, 30, engineer', {
   *   schema: {
   *     type: 'object',
   *     properties: {
   *       name: { type: 'string' },
   *       age: { type: 'number' },
   *       occupation: { type: 'string' }
   *     }
   *   },
   *   provider: 'openai'
   * })
   * console.log(person.object) // { name: 'John Doe', age: 30, occupation: 'engineer' }
   * ```
   */
  async generateObject<T = any>(prompt: string, options: GenerateObjectOptions): Promise<GenerateObjectResponse<T>> {
    const response = await fetch(`${this.baseUrl}/generateObject`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        prompt,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to generate object: ${error}`)
    }

    return response.json() as Promise<GenerateObjectResponse<T>>
  }

  /**
   * Generate typed data using Payload collection schema
   *
   * @param type - Payload collection type
   * @param options - Generation options
   * @returns Generated data matching collection schema
   *
   * @example
   * ```typescript
   * const customer = await $.ai.generate('Customer', {
   *   input: { name: 'John Doe', email: 'john@example.com' },
   *   instructions: 'Generate a customer record with complete profile',
   *   provider: 'openai'
   * })
   * console.log(customer.data)
   * ```
   */
  async generate<T = any>(type: string, options: Omit<GenerateOptions, 'type'> = {}): Promise<GenerateResponse<T>> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        type,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to generate ${type}: ${error}`)
    }

    return response.json() as Promise<GenerateResponse<T>>
  }

  /**
   * Generate a structured list
   *
   * @param prompt - Text prompt
   * @param options - List generation options
   * @returns Structured list with name, itemType, itemSchema, and items
   *
   * @example
   * ```typescript
   * const languages = await $.ai.list('Popular programming languages', {
   *   provider: 'openai',
   *   minItems: 5,
   *   maxItems: 10
   * })
   * console.log(languages.name) // 'Popular Programming Languages'
   * console.log(languages.itemType) // 'ProgrammingLanguage'
   * console.log(languages.itemSchema) // 'ComputerLanguage' (schema.org type)
   * console.log(languages.items) // [{ name: 'Python', description: '...' }, ...]
   * ```
   *
   * The `itemSchema` field contains the most specific schema.org @type for each item.
   * See https://schema.org for available types (e.g., 'Person', 'Product', 'Book', 'Organization').
   */
  async list<T = string>(prompt: string, options: ListOptions = {}): Promise<ListResponse<T>> {
    const response = await fetch(`${this.baseUrl}/list`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        prompt,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to generate list: ${error}`)
    }

    return response.json() as Promise<ListResponse<T>>
  }

  /**
   * Generate multiple categorized lists
   *
   * @param prompt - Text prompt
   * @param options - Lists generation options
   * @returns Multiple categorized lists
   *
   * @example
   * ```typescript
   * const categories = await $.ai.lists('Categorize programming languages by use case', {
   *   provider: 'openai',
   *   count: 3
   * })
   * console.log(categories.lists)
   * // [
   * //   { name: 'Web Development', itemType: 'ProgrammingLanguage', itemSchema: 'ComputerLanguage',
   * //     items: [{ name: 'JavaScript', description: '...' }, ...] },
   * //   { name: 'Data Science', itemType: 'ProgrammingLanguage', itemSchema: 'ComputerLanguage',
   * //     items: [{ name: 'Python', description: '...' }, ...] },
   * //   { name: 'Systems Programming', itemType: 'ProgrammingLanguage', itemSchema: 'ComputerLanguage',
   * //     items: [{ name: 'Rust', description: '...' }, ...] }
   * // ]
   * ```
   */
  async lists<T = string>(prompt: string, options: ListsOptions = {}): Promise<ListsResponse<T>> {
    const response = await fetch(`${this.baseUrl}/lists`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        prompt,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to generate lists: ${error}`)
    }

    return response.json() as Promise<ListsResponse<T>>
  }

  /**
   * Generate embedding vector for text
   *
   * @param text - Text to embed
   * @param options - Embedding options
   * @returns Embedding vector
   *
   * @example
   * ```typescript
   * const embedding = await $.ai.embed('Hello, world!', {
   *   provider: 'workers-ai'
   * })
   * console.log(embedding.embedding) // [0.123, -0.456, ...]
   * console.log(embedding.dimensions) // 768
   * ```
   */
  async embed(text: string, options: EmbedOptions = {}): Promise<EmbedResponse> {
    const response = await fetch(`${this.baseUrl}/embed`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        text,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to generate embedding: ${error}`)
    }

    return response.json() as Promise<EmbedResponse>
  }

  /**
   * Apply a function to each item in parallel
   *
   * @param items - Array of items to process
   * @param options - ForEach options with function to apply
   * @returns Results for each item
   *
   * @example
   * ```typescript
   * const items = ['apple', 'banana', 'cherry']
   * const results = await $.ai.forEach(items, {
   *   fn: async (item) => {
   *     const response = await $.ai.generateText(`Describe ${item}`)
   *     return response.text
   *   },
   *   concurrency: 3
   * })
   * console.log(results.results) // ['A red fruit...', 'A yellow fruit...', ...]
   * ```
   */
  async forEach<T, R>(items: T[], options: ForEachOptions<T, R>): Promise<ForEachResponse<R>> {
    const response = await fetch(`${this.baseUrl}/forEach`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        items,
        fn: options.fn.toString(),
        concurrency: options.concurrency,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to process forEach: ${error}`)
    }

    return response.json() as Promise<ForEachResponse<R>>
  }

  /**
   * Stream text generation with callbacks
   *
   * @param prompt - Text prompt
   * @param options - Streaming options with callbacks
   * @returns Async iterable of text chunks
   *
   * @example
   * ```typescript
   * const stream = await $.ai.stream('Write a story', {
   *   provider: 'openai',
   *   onChunk: (chunk) => console.log(chunk),
   *   onComplete: (fullText) => console.log('Done:', fullText)
   * })
   *
   * for await (const chunk of stream) {
   *   process.stdout.write(chunk)
   * }
   * ```
   */
  async stream(prompt: string, options: StreamOptions = {}): Promise<ReadableStream<string>> {
    const response = await fetch(`${this.baseUrl}/stream`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        prompt,
        provider: options.provider,
        model: options.model,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        system: options.system,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to start streaming: ${error}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    return response.body.pipeThrough(new TextDecoderStream())
  }

  /**
   * Upsert vectors to Vectorize with automatic embedding
   *
   * @param options - Upsert options with vectors
   * @returns Upsert response with count and IDs
   *
   * @example
   * ```typescript
   * const result = await $.ai.upsert({
   *   vectors: [
   *     {
   *       id: 'doc-1',
   *       text: 'Cloudflare Workers is a serverless platform',
   *       metadata: { source: 'docs', category: 'workers' }
   *     }
   *   ],
   *   provider: 'workers-ai'
   * })
   * console.log(result.count) // 1
   * ```
   */
  async upsert(options: UpsertOptions): Promise<UpsertResponse> {
    const response = await fetch(`${this.baseUrl}/vectorize/upsert`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to upsert vectors: ${error}`)
    }

    return response.json() as Promise<UpsertResponse>
  }

  /**
   * Search vectors with automatic query embedding
   *
   * @param query - Search query text
   * @param options - Search options
   * @returns Search results with scores
   *
   * @example
   * ```typescript
   * const results = await $.ai.search('What is serverless?', {
   *   topK: 5,
   *   returnMetadata: true,
   *   provider: 'workers-ai'
   * })
   * results.results.forEach(result => {
   *   console.log(result.id, result.score, result.metadata)
   * })
   * ```
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    const response = await fetch(`${this.baseUrl}/vectorize/search`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        query,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to search vectors: ${error}`)
    }

    return response.json() as Promise<SearchResponse>
  }

  /**
   * Run evaluation against a benchmark
   *
   * @param options - Eval options with benchmark and subject
   * @returns Eval run response with ID
   *
   * @example
   * ```typescript
   * const evalRun = await $.ai.runEval({
   *   benchmarkId: 'mmlu-benchmark',
   *   modelId: 'gpt-5',
   *   config: {
   *     temperature: 0.7
   *   },
   *   metadata: {
   *     runBy: 'system',
   *     purpose: 'model-comparison'
   *   }
   * })
   * console.log(evalRun.id)
   * ```
   */
  async runEval(options: RunEvalOptions): Promise<RunEvalResponse> {
    const response = await fetch(`${this.baseUrl}/eval/run`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to run eval: ${error}`)
    }

    return response.json() as Promise<RunEvalResponse>
  }

  /**
   * Get evaluation result by ID
   *
   * @param evalId - Eval ID
   * @returns Eval result with scores
   *
   * @example
   * ```typescript
   * const result = await $.ai.getEvalResult('eval-123')
   * console.log(result.status) // 'completed'
   * console.log(result.results?.score) // 0.87
   * console.log(result.results?.summary)
   * // { total: 100, passed: 87, failed: 13, averageScore: 0.87 }
   * ```
   */
  async getEvalResult(evalId: string): Promise<EvalResult> {
    const response = await fetch(`${this.baseUrl}/eval/${evalId}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Eval result not found: ${evalId}`)
      }
      const error = await response.text()
      throw new Error(`Failed to get eval result: ${error}`)
    }

    return response.json() as Promise<EvalResult>
  }

  /**
   * List evaluation results with filters
   *
   * @param options - Filter options
   * @returns List of eval results
   *
   * @example
   * ```typescript
   * const evals = await $.ai.listEvals({
   *   benchmarkId: 'mmlu-benchmark',
   *   status: 'completed',
   *   limit: 10
   * })
   * evals.results.forEach(result => {
   *   console.log(result.id, result.results?.score)
   * })
   * ```
   */
  async listEvals(options: ListEvalsOptions = {}): Promise<ListEvalsResponse> {
    const params = new URLSearchParams()

    if (options.benchmarkId) params.set('benchmarkId', options.benchmarkId)
    if (options.modelId) params.set('modelId', options.modelId)
    if (options.agentId) params.set('agentId', options.agentId)
    if (options.workflowId) params.set('workflowId', options.workflowId)
    if (options.status) params.set('status', options.status)
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.offset) params.set('offset', options.offset.toString())

    const response = await fetch(`${this.baseUrl}/eval/list?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to list evals: ${response.statusText}`)
    }

    return response.json() as Promise<ListEvalsResponse>
  }

  /**
   * Get agent state
   *
   * @param agentId - Agent ID
   * @returns Agent state
   *
   * @example
   * ```typescript
   * const agent = await $.ai.getAgent('agent-123')
   * console.log(agent.state)
   * ```
   */
  async getAgent(agentId: string): Promise<AgentState> {
    const response = await fetch(`${this.baseUrl}/agent/${agentId}/state`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Agent not found: ${agentId}`)
      }
      const error = await response.text()
      throw new Error(`Failed to get agent: ${error}`)
    }

    return response.json() as Promise<AgentState>
  }

  /**
   * Update agent state
   *
   * @param agentId - Agent ID
   * @param state - State updates
   * @returns Updated agent state
   *
   * @example
   * ```typescript
   * await $.ai.updateAgent('agent-123', {
   *   counter: 42,
   *   lastAction: 'process_message'
   * })
   * ```
   */
  async updateAgent(agentId: string, state: Record<string, any>): Promise<AgentState> {
    const response = await fetch(`${this.baseUrl}/agent/${agentId}/update`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ state }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update agent: ${error}`)
    }

    return response.json() as Promise<AgentState>
  }

  /**
   * Get background job status
   *
   * @param jobId - Job ID
   * @returns Job status
   *
   * @example
   * ```typescript
   * const status = await $.ai.getJobStatus('job-123')
   * console.log(status.status) // 'completed'
   * console.log(status.result)
   * ```
   */
  async getJobStatus(jobId: string): Promise<BackgroundJobStatus> {
    const response = await fetch(`${this.baseUrl}/background/status/${jobId}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Job not found: ${jobId}`)
      }
      const error = await response.text()
      throw new Error(`Failed to get job status: ${error}`)
    }

    return response.json() as Promise<BackgroundJobStatus>
  }

  /**
   * Generate code with language detection
   *
   * @param prompt - Code generation prompt
   * @param options - Code generation options
   * @returns Generated code with language detection
   *
   * @example
   * ```typescript
   * const result = await $.ai.generateCode('Create a function to calculate factorial', {
   *   language: 'typescript',
   *   includeComments: true,
   *   provider: 'openai'
   * })
   * console.log(result.code)
   * console.log(result.language) // 'typescript'
   * ```
   */
  async generateCode(prompt: string, options: GenerateCodeOptions = {}): Promise<GenerateCodeResponse> {
    const response = await fetch(`${this.baseUrl}/generate/code`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        prompt,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to generate code: ${error}`)
    }

    return response.json() as Promise<GenerateCodeResponse>
  }

  /**
   * Generate image from text prompt
   *
   * @param prompt - Image generation prompt
   * @param options - Image generation options
   * @returns Generated image(s)
   *
   * @example
   * ```typescript
   * const result = await $.ai.generateImage('A serene mountain landscape at sunset', {
   *   provider: 'openai',
   *   model: 'dall-e-3',
   *   size: '1024x1024',
   *   quality: 'hd'
   * })
   * console.log(result.images[0].url)
   * ```
   */
  async generateImage(prompt: string, options: GenerateImageOptions = {}): Promise<GenerateImageResponse> {
    const response = await fetch(`${this.baseUrl}/generate/image`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        prompt,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to generate image: ${error}`)
    }

    return response.json() as Promise<GenerateImageResponse>
  }

  /**
   * Generate speech from text (text-to-speech)
   *
   * @param text - Text to convert to speech
   * @param options - Speech generation options
   * @returns Generated speech audio
   *
   * @example
   * ```typescript
   * const result = await $.ai.generateSpeech('Hello, world!', {
   *   provider: 'openai',
   *   voice: 'alloy',
   *   format: 'mp3',
   *   speed: 1.0
   * })
   * console.log(result.audio) // base64 encoded audio or URL
   * console.log(result.format) // 'mp3'
   * ```
   */
  async generateSpeech(text: string, options: GenerateSpeechOptions = {}): Promise<GenerateSpeechResponse> {
    const response = await fetch(`${this.baseUrl}/generate/speech`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        text,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to generate speech: ${error}`)
    }

    return response.json() as Promise<GenerateSpeechResponse>
  }

  /**
   * Generate video from text prompt
   *
   * @param prompt - Video generation prompt
   * @param options - Video generation options
   * @returns Generated video (may be async with jobId)
   *
   * @example
   * ```typescript
   * const result = await $.ai.generateVideo('A cat playing piano', {
   *   provider: 'runway',
   *   duration: 5,
   *   resolution: '1080p'
   * })
   *
   * if (result.status === 'processing') {
   *   // Poll for completion
   *   const status = await $.ai.getJobStatus(result.jobId!)
   *   console.log(status.status)
   * } else {
   *   console.log(result.video) // Video URL
   * }
   * ```
   */
  async generateVideo(prompt: string, options: GenerateVideoOptions = {}): Promise<GenerateVideoResponse> {
    const response = await fetch(`${this.baseUrl}/generate/video`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        prompt,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to generate video: ${error}`)
    }

    return response.json() as Promise<GenerateVideoResponse>
  }

  // ============================================================================
  // LAYER 2 INTEGRATION METHODS (workers/llm)
  // ============================================================================

  /**
   * Chat completion with message history
   *
   * @param options - Chat options with messages
   * @returns Chat completion response
   *
   * @example
   * ```typescript
   * const response = await $.ai.chat({
   *   messages: [
   *     { role: 'system', content: 'You are a helpful assistant' },
   *     { role: 'user', content: 'What is serverless?' }
   *   ],
   *   provider: 'openai',
   *   model: 'gpt-5'
   * })
   * console.log(response.message.content)
   * ```
   */
  async chat(options: ChatOptions): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to complete chat: ${error}`)
    }

    return response.json()
  }

  /**
   * Text completion
   *
   * @param options - Completion options
   * @returns Completion response
   *
   * @example
   * ```typescript
   * const response = await $.ai.complete({
   *   prompt: 'Once upon a time',
   *   provider: 'openai',
   *   model: 'gpt-5',
   *   maxTokens: 100
   * })
   * console.log(response.text)
   * ```
   */
  async complete(options: CompleteOptions): Promise<CompleteResponse> {
    const response = await fetch(`${this.baseUrl}/complete`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to complete: ${error}`)
    }

    return response.json()
  }

  /**
   * Generate structured output matching a schema
   *
   * @param options - Structured generation options
   * @returns Parsed object matching schema
   *
   * @example
   * ```typescript
   * interface Person {
   *   name: string
   *   age: number
   *   occupation: string
   * }
   *
   * const person = await $.ai.structured<Person>({
   *   prompt: 'Extract: John Doe, 30, software engineer',
   *   schema: {
   *     type: 'object',
   *     properties: {
   *       name: { type: 'string' },
   *       age: { type: 'number' },
   *       occupation: { type: 'string' }
   *     },
   *     required: ['name', 'age', 'occupation']
   *   },
   *   provider: 'openai'
   * })
   * console.log(person.name) // 'John Doe'
   * ```
   */
  async structured<T = any>(options: StructuredOptions<T>): Promise<T> {
    const response = await fetch(`${this.baseUrl}/structured`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to generate structured output: ${error}`)
    }

    const result = await response.json()
    return result.object as T
  }

  /**
   * Stream text generation
   *
   * @param options - Streaming options (extends CompleteOptions)
   * @returns Async iterable of text chunks
   *
   * @example
   * ```typescript
   * const chunks = $.ai.streamText({
   *   prompt: 'Write a long story',
   *   provider: 'openai',
   *   model: 'gpt-5'
   * })
   *
   * for await (const chunk of chunks) {
   *   if (!chunk.done) {
   *     process.stdout.write(chunk.text)
   *   } else {
   *     console.log('\n\nUsage:', chunk.usage)
   *   }
   * }
   * ```
   */
  async *streamText(options: CompleteOptions): AsyncIterableIterator<StreamChunk> {
    const response = await fetch(`${this.baseUrl}/stream`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to start stream: ${error}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Parse SSE format
        const lines = value.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              yield { text: '', done: true }
              return
            }
            try {
              const chunk = JSON.parse(data)
              yield chunk as StreamChunk
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  // ============================================================================
  // LAYER 2 INTEGRATION - VECTOR OPERATIONS (workers/vectors)
  // ============================================================================

  /**
   * Vector operations namespace
   */
  readonly vectors = {
    /**
     * Upsert vectors to index with auto-embedding
     *
     * @param options - Vector upsert options
     * @returns Upsert response
     *
     * @example
     * ```typescript
     * const result = await $.ai.vectors.upsert({
     *   vectors: [
     *     {
     *       id: 'doc-1',
     *       text: 'Cloudflare Workers is a serverless platform',
     *       metadata: { source: 'docs', type: 'workers' }
     *     },
     *     {
     *       id: 'doc-2',
     *       values: [0.1, 0.2, 0.3, ...], // Pre-computed embedding
     *       metadata: { source: 'docs', type: 'pages' }
     *     }
     *   ],
     *   provider: 'openai'
     * })
     * console.log(result.count) // 2
     * ```
     */
    upsert: async (options: VectorUpsertOptions): Promise<VectorUpsertResponse> => {
      const response = await fetch(`${this.baseUrl}/vectors/upsert`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to upsert vectors: ${error}`)
      }

      return response.json()
    },

    /**
     * Search vectors by text query (auto-embeds query)
     *
     * @param query - Search query text
     * @param options - Search options
     * @returns Search results
     *
     * @example
     * ```typescript
     * const results = await $.ai.vectors.search('What is serverless?', {
     *   topK: 5,
     *   returnMetadata: true,
     *   filter: { source: 'docs' }
     * })
     *
     * results.results.forEach(result => {
     *   console.log(result.id, result.score, result.metadata)
     * })
     * ```
     */
    search: async (query: string, options: VectorSearchOptions = {}): Promise<VectorSearchResponse> => {
      const response = await fetch(`${this.baseUrl}/vectors/search`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          query,
          ...options,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to search vectors: ${error}`)
      }

      return response.json()
    },

    /**
     * Query vectors by embedding vector
     *
     * @param vector - Query embedding vector
     * @param options - Query options
     * @returns Query results
     *
     * @example
     * ```typescript
     * const embedding = await $.ai.embed('serverless computing')
     * const results = await $.ai.vectors.query(embedding.embedding, {
     *   topK: 10,
     *   returnMetadata: true
     * })
     * console.log(results.results)
     * ```
     */
    query: async (vector: number[], options: VectorQueryOptions = {}): Promise<VectorQueryResponse> => {
      const response = await fetch(`${this.baseUrl}/vectors/query`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          vector,
          ...options,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to query vectors: ${error}`)
      }

      return response.json()
    },

    /**
     * Delete vectors by IDs
     *
     * @param options - Delete options with vector IDs
     *
     * @example
     * ```typescript
     * await $.ai.vectors.delete({
     *   ids: ['doc-1', 'doc-2', 'doc-3']
     * })
     * ```
     */
    delete: async (options: VectorDeleteOptions): Promise<void> => {
      const response = await fetch(`${this.baseUrl}/vectors/delete`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to delete vectors: ${error}`)
      }
    },
  }

  // ============================================================================
  // LAYER 2 INTEGRATION - MODEL OPERATIONS (workers/models)
  // ============================================================================

  /**
   * Model operations namespace
   */
  readonly models = {
    /**
     * Route to optimal model for a task
     *
     * @param task - Task description
     * @param requirements - Model requirements (optional)
     * @returns Selected model with reasoning
     *
     * @example
     * ```typescript
     * const result = await $.ai.models.route('Generate code for sorting algorithm', {
     *   capabilities: ['code'],
     *   maxCostPer1M: 5.0
     * })
     * console.log(result.model.id) // 'gpt-5-codex'
     * console.log(result.reasoning) // 'Selected for code generation capability...'
     * ```
     */
    route: async (task: string, requirements?: ModelRequirements): Promise<ModelRouteResponse> => {
      const response = await fetch(`${this.baseUrl}/models/route`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          task,
          requirements,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to route model: ${error}`)
      }

      return response.json()
    },

    /**
     * List available models with filters
     *
     * @param filters - Model filters (optional)
     * @returns List of models
     *
     * @example
     * ```typescript
     * const models = await $.ai.models.list({
     *   provider: 'openai',
     *   capabilities: ['code'],
     *   minContextWindow: 100000
     * })
     *
     * models.forEach(model => {
     *   console.log(model.id, model.contextWindow, model.inputCostPer1M)
     * })
     * ```
     */
    list: async (filters?: ModelFilters): Promise<Model[]> => {
      const params = new URLSearchParams()
      if (filters?.provider) params.set('provider', filters.provider)
      if (filters?.minContextWindow) params.set('minContextWindow', filters.minContextWindow.toString())
      if (filters?.maxCost) params.set('maxCost', filters.maxCost.toString())
      if (filters?.capabilities) params.set('capabilities', filters.capabilities.join(','))

      const response = await fetch(`${this.baseUrl}/models/list?${params}`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to list models: ${error}`)
      }

      const result = await response.json()
      return result.models as Model[]
    },

    /**
     * Get model by ID
     *
     * @param id - Model ID
     * @returns Model details
     *
     * @example
     * ```typescript
     * const model = await $.ai.models.get('gpt-5')
     * console.log(model.name) // 'GPT-5'
     * console.log(model.contextWindow) // 200000
     * console.log(model.capabilities) // ['chat', 'code', 'vision', ...]
     * ```
     */
    get: async (id: string): Promise<Model> => {
      const response = await fetch(`${this.baseUrl}/models/${id}`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Model not found: ${id}`)
        }
        const error = await response.text()
        throw new Error(`Failed to get model: ${error}`)
      }

      return response.json()
    },

    /**
     * Provider operations
     */
    providers: {
      /**
       * List all providers
       *
       * @returns List of providers
       *
       * @example
       * ```typescript
       * const providers = await $.ai.models.providers.list()
       * providers.forEach(p => {
       *   console.log(p.id, p.name, p.features)
       * })
       * ```
       */
      list: async (): Promise<Provider[]> => {
        const response = await fetch(`${this.baseUrl}/models/providers`, {
          headers: this.getHeaders(),
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(`Failed to list providers: ${error}`)
        }

        const result = await response.json()
        return result.providers as Provider[]
      },

      /**
       * Get provider by ID
       *
       * @param id - Provider ID
       * @returns Provider details
       *
       * @example
       * ```typescript
       * const provider = await $.ai.models.providers.get('openai')
       * console.log(provider.name) // 'OpenAI'
       * console.log(provider.features) // ['chat', 'embeddings', 'images', ...]
       * ```
       */
      get: async (id: string): Promise<Provider> => {
        const response = await fetch(`${this.baseUrl}/models/providers/${id}`, {
          headers: this.getHeaders(),
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Provider not found: ${id}`)
          }
          const error = await response.text()
          throw new Error(`Failed to get provider: ${error}`)
        }

        return response.json()
      },
    },
  }
}

/**
 * Create AI service instance
 */
export function createAIService(baseUrl?: string, apiKey?: string): AIService {
  return new AIService(baseUrl, apiKey)
}

/**
 * Default AI service instance
 */
export const ai = createAIService()
