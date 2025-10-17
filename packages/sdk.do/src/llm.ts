/**
 * LLM Service - Multi-provider LLM operations
 *
 * Provides access to text generation, chat, streaming, embeddings,
 * function calling, and batch processing across multiple LLM providers.
 */

/**
 * Supported LLM providers
 */
export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'meta' | 'xai' | 'workers-ai'

/**
 * Message role types for chat completions
 */
export type MessageRole = 'system' | 'user' | 'assistant' | 'tool'

/**
 * Chat message structure
 */
export interface ChatMessage {
  role: MessageRole
  content: string
  name?: string
  tool_call_id?: string
  tool_calls?: ToolCall[]
}

/**
 * Tool/function call structure
 */
export interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

/**
 * Tool/function definition
 */
export interface Tool {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: Record<string, any>
  }
}

/**
 * Options for text generation
 */
export interface GenerateOptions {
  model?: string
  provider?: LLMProvider
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
  seed?: number
}

/**
 * Options for chat completions
 */
export interface ChatOptions extends GenerateOptions {
  tools?: Tool[]
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } }
}

/**
 * Options for streaming
 */
export interface StreamOptions extends ChatOptions {
  onChunk?: (chunk: StreamChunk) => void
}

/**
 * Chunk in a streaming response
 */
export interface StreamChunk {
  text?: string
  done: boolean
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'content_filter'
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * Options for embeddings
 */
export interface EmbedOptions {
  model?: string
  provider?: LLMProvider
  dimensions?: number
}

/**
 * Embedding result
 */
export interface Embedding {
  embedding: number[]
  dimensions: number
  model: string
}

/**
 * Model information
 */
export interface Model {
  id: string
  name: string
  provider: LLMProvider
  contextWindow: number
  maxOutputTokens: number
  inputPrice: number // per 1M tokens
  outputPrice: number // per 1M tokens
  capabilities: {
    chat: boolean
    functionCalling: boolean
    streaming: boolean
    vision: boolean
  }
}

/**
 * Batch request item
 */
export interface BatchRequest {
  custom_id: string
  prompt?: string
  messages?: ChatMessage[]
  options?: GenerateOptions
}

/**
 * Batch result item
 */
export interface BatchResult {
  custom_id: string
  text?: string
  error?: string
}

/**
 * Batch job status
 */
export type BatchStatus = 'validating' | 'processing' | 'completed' | 'failed' | 'cancelled'

/**
 * Batch job information
 */
export interface BatchJob {
  id: string
  status: BatchStatus
  totalRequests: number
  completedRequests: number
  failedRequests: number
  createdAt: string
  completedAt?: string
  expiresAt: string
  resultsUrl?: string
}

/**
 * Response from text generation
 */
export interface GenerateResponse {
  text: string
  finishReason: 'stop' | 'length' | 'content_filter'
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
}

/**
 * Response from chat completions
 */
export interface ChatResponse {
  message: ChatMessage
  finishReason: 'stop' | 'length' | 'tool_calls' | 'content_filter'
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
}

/**
 * LLM Service interface
 *
 * Provides methods for interacting with LLM providers for text generation,
 * chat completions, streaming, embeddings, function calling, and batch processing.
 */
export interface LLMService {
  /**
   * Generate text from a prompt
   *
   * @example
   * ```typescript
   * const response = await llm.generate({
   *   prompt: 'Write a haiku about TypeScript',
   *   temperature: 0.7,
   *   maxTokens: 100
   * })
   * console.log(response.text)
   * ```
   */
  generate(prompt: string, options?: GenerateOptions): Promise<GenerateResponse>

  /**
   * Chat completions with message history
   *
   * @example
   * ```typescript
   * const response = await llm.chat({
   *   messages: [
   *     { role: 'system', content: 'You are a helpful assistant' },
   *     { role: 'user', content: 'What is TypeScript?' }
   *   ],
   *   temperature: 0.7
   * })
   * console.log(response.message.content)
   * ```
   */
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>

  /**
   * Stream text generation
   *
   * @example
   * ```typescript
   * const stream = await llm.stream({
   *   prompt: 'Write a long story',
   *   onChunk: (chunk) => {
   *     if (chunk.text) process.stdout.write(chunk.text)
   *   }
   * })
   *
   * for await (const chunk of stream) {
   *   process.stdout.write(chunk.text || '')
   * }
   * ```
   */
  stream(prompt: string, options?: StreamOptions): Promise<AsyncIterable<StreamChunk>>
  stream(messages: ChatMessage[], options?: StreamOptions): Promise<AsyncIterable<StreamChunk>>

  /**
   * Generate embeddings for text
   *
   * @example
   * ```typescript
   * const embedding = await llm.embed({
   *   input: 'Hello world',
   *   model: 'text-embedding-ada-002'
   * })
   * console.log(embedding.embedding.length) // 1536
   * ```
   */
  embed(input: string | string[], options?: EmbedOptions): Promise<Embedding | Embedding[]>

  /**
   * List available models
   *
   * @example
   * ```typescript
   * const models = await llm.models()
   * console.log(models.map(m => m.id))
   * ```
   */
  models(provider?: LLMProvider): Promise<Model[]>

  /**
   * Get model details
   *
   * @example
   * ```typescript
   * const model = await llm.model('claude-sonnet-4.5')
   * console.log(model.contextWindow) // 200000
   * ```
   */
  model(modelId: string): Promise<Model>

  /**
   * Check if model is available
   *
   * @example
   * ```typescript
   * const available = await llm.isAvailable('gpt-5')
   * ```
   */
  isAvailable(modelId: string): Promise<boolean>

  /**
   * Create a batch job for processing multiple requests
   *
   * @example
   * ```typescript
   * const batch = await llm.batch({
   *   model: 'gpt-5',
   *   requests: [
   *     { custom_id: '1', prompt: 'Hello' },
   *     { custom_id: '2', prompt: 'World' }
   *   ]
   * })
   * console.log(batch.id)
   * ```
   */
  batch(requests: BatchRequest[], options?: GenerateOptions): Promise<BatchJob>

  /**
   * Get batch job status
   *
   * @example
   * ```typescript
   * const status = await llm.batchStatus('batch_123')
   * console.log(status.completedRequests)
   * ```
   */
  batchStatus(batchId: string): Promise<BatchJob>

  /**
   * Get batch results
   *
   * @example
   * ```typescript
   * const results = await llm.batchResults('batch_123')
   * console.log(results.map(r => r.text))
   * ```
   */
  batchResults(batchId: string): Promise<BatchResult[]>

  /**
   * Cancel a batch job
   *
   * @example
   * ```typescript
   * await llm.cancelBatch('batch_123')
   * ```
   */
  cancelBatch(batchId: string): Promise<void>
}

/**
 * LLM Service implementation
 */
class LLMServiceImpl implements LLMService {
  private apiUrl: string
  private apiKey?: string

  constructor(options: { apiUrl: string; apiKey?: string }) {
    if (!options.apiUrl || !options.apiUrl.trim()) {
      throw new Error('apiUrl is required and cannot be empty')
    }
    if (options.apiKey !== undefined && !options.apiKey.trim()) {
      throw new Error('apiKey cannot be empty string')
    }
    this.apiUrl = options.apiUrl
    this.apiKey = options.apiKey
  }

  private async request<T>(endpoint: string, body?: any): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`LLM API error: ${response.status} ${errorText}`)
    }

    return response.json()
  }

  async generate(prompt: string, options?: GenerateOptions): Promise<GenerateResponse> {
    if (!prompt || !prompt.trim()) {
      throw new Error('prompt is required and cannot be empty')
    }
    return this.request<GenerateResponse>('/generate', { prompt, ...options })
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    if (!messages || messages.length === 0) {
      throw new Error('messages array is required and cannot be empty')
    }
    return this.request<ChatResponse>('/chat', { messages, ...options })
  }

  async stream(promptOrMessages: string | ChatMessage[], options?: StreamOptions): Promise<AsyncIterable<StreamChunk>> {
    if (!promptOrMessages) {
      throw new Error('promptOrMessages is required')
    }
    if (typeof promptOrMessages === 'string' && !promptOrMessages.trim()) {
      throw new Error('prompt cannot be empty')
    }
    if (Array.isArray(promptOrMessages) && promptOrMessages.length === 0) {
      throw new Error('messages array cannot be empty')
    }
    const body = typeof promptOrMessages === 'string' ? { prompt: promptOrMessages, ...options } : { messages: promptOrMessages, ...options }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(`${this.apiUrl}/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`LLM stream error: ${response.status} ${errorText}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    return this.streamReader(response.body)
  }

  private async *streamReader(body: ReadableStream<Uint8Array>): AsyncIterable<StreamChunk> {
    const reader = body.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter((line) => line.trim())

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              yield { done: true }
              return
            }
            try {
              const parsed = JSON.parse(data)
              yield parsed
            } catch (e) {
              // Log malformed JSON for debugging but continue streaming
              console.warn('[LLM Stream] Skipping malformed JSON chunk:', data, e)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  async embed(input: string | string[], options?: EmbedOptions): Promise<Embedding | Embedding[]> {
    if (!input) {
      throw new Error('input is required')
    }
    if (typeof input === 'string' && !input.trim()) {
      throw new Error('input cannot be empty')
    }
    if (Array.isArray(input) && input.length === 0) {
      throw new Error('input array cannot be empty')
    }
    const result = await this.request<{ embeddings: Embedding[] }>('/embed', { input, ...options })
    return Array.isArray(input) ? result.embeddings : result.embeddings[0]
  }

  async models(provider?: LLMProvider): Promise<Model[]> {
    const response = await fetch(`${this.apiUrl}/models${provider ? `?provider=${provider}` : ''}`, {
      method: 'GET',
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    })

    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.status}`)
    }

    const data = (await response.json()) as { models?: Model[] }
    return data.models || []
  }

  async model(modelId: string): Promise<Model> {
    if (!modelId || !modelId.trim()) {
      throw new Error('modelId is required and cannot be empty')
    }
    const response = await fetch(`${this.apiUrl}/models/${modelId}`, {
      method: 'GET',
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    })

    if (!response.ok) {
      throw new Error(`Failed to get model: ${response.status}`)
    }

    return response.json()
  }

  async isAvailable(modelId: string): Promise<boolean> {
    if (!modelId || !modelId.trim()) {
      throw new Error('modelId is required and cannot be empty')
    }
    try {
      await this.model(modelId)
      return true
    } catch {
      return false
    }
  }

  async batch(requests: BatchRequest[], options?: GenerateOptions): Promise<BatchJob> {
    if (!requests || requests.length === 0) {
      throw new Error('requests array is required and cannot be empty')
    }
    return this.request<BatchJob>('/batch', { requests, ...options })
  }

  async batchStatus(batchId: string): Promise<BatchJob> {
    if (!batchId || !batchId.trim()) {
      throw new Error('batchId is required and cannot be empty')
    }
    const response = await fetch(`${this.apiUrl}/batch/${batchId}`, {
      method: 'GET',
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    })

    if (!response.ok) {
      throw new Error(`Failed to get batch status: ${response.status}`)
    }

    return response.json()
  }

  async batchResults(batchId: string): Promise<BatchResult[]> {
    if (!batchId || !batchId.trim()) {
      throw new Error('batchId is required and cannot be empty')
    }
    const response = await fetch(`${this.apiUrl}/batch/${batchId}/results`, {
      method: 'GET',
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    })

    if (!response.ok) {
      throw new Error(`Failed to get batch results: ${response.status}`)
    }

    const data = (await response.json()) as { results?: BatchResult[] }
    return data.results || []
  }

  async cancelBatch(batchId: string): Promise<void> {
    if (!batchId || !batchId.trim()) {
      throw new Error('batchId is required and cannot be empty')
    }
    const response = await fetch(`${this.apiUrl}/batch/${batchId}/cancel`, {
      method: 'POST',
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    })

    if (!response.ok) {
      throw new Error(`Failed to cancel batch: ${response.status}`)
    }
  }
}

/**
 * Create an LLM service instance
 */
export function createLLMService(options: { apiUrl: string; apiKey?: string }): LLMService {
  return new LLMServiceImpl(options)
}
