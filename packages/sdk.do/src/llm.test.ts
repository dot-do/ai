/**
 * Tests for LLM Service
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { RPCClient } from './client'
import type { LLMService, ChatMessage, GenerateOptions, StreamChunk, Model, BatchRequest, BatchJob } from './llm'

describe('LLM Service', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let client: RPCClient
  let llm: LLMService

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    client = new RPCClient({
      apiKey: 'test-key',
      baseUrl: 'https://test.apis.do',
    })

    llm = client.service<LLMService>('llm')
  })

  describe('generate()', () => {
    test('generates text from prompt', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            text: 'TypeScript is great',
            finishReason: 'stop',
            usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            model: 'gpt-5',
          },
        }),
      })

      const result = await llm.generate('What is TypeScript?')

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/llm/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: [['What is TypeScript?', undefined]] }),
      })

      expect(result.text).toBe('TypeScript is great')
      expect(result.finishReason).toBe('stop')
      expect(result.usage.totalTokens).toBe(30)
    })

    test('accepts generation options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            text: 'Creative response',
            finishReason: 'stop',
            usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            model: 'claude-sonnet-4.5',
          },
        }),
      })

      const options: GenerateOptions = {
        model: 'claude-sonnet-4.5',
        temperature: 0.9,
        maxTokens: 500,
        topP: 0.95,
      }

      await llm.generate('Write creatively', options)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/llm/generate',
        expect.objectContaining({
          body: JSON.stringify({ params: [['Write creatively', options]] }),
        })
      )
    })

    test('handles different finish reasons', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            text: 'Partial response',
            finishReason: 'length',
            usage: { promptTokens: 10, completionTokens: 100, totalTokens: 110 },
            model: 'gpt-5',
          },
        }),
      })

      const result = await llm.generate('Generate a very long text', { maxTokens: 100 })

      expect(result.finishReason).toBe('length')
    })
  })

  describe('chat()', () => {
    test('completes chat with message history', async () => {
      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful assistant' },
        { role: 'user', content: 'What is TypeScript?' },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            message: { role: 'assistant', content: 'TypeScript is a typed superset of JavaScript' },
            finishReason: 'stop',
            usage: { promptTokens: 20, completionTokens: 15, totalTokens: 35 },
            model: 'gpt-5',
          },
        }),
      })

      const result = await llm.chat(messages)

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/llm/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: [[messages, undefined]] }),
      })

      expect(result.message.role).toBe('assistant')
      expect(result.message.content).toContain('TypeScript')
    })

    test('supports function calling', async () => {
      const messages: ChatMessage[] = [{ role: 'user', content: 'What is the weather in London?' }]

      const tools = [
        {
          type: 'function' as const,
          function: {
            name: 'get_weather',
            description: 'Get weather for a location',
            parameters: {
              type: 'object',
              properties: {
                location: { type: 'string' },
              },
            },
          },
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            message: {
              role: 'assistant',
              content: null,
              tool_calls: [
                {
                  id: 'call_123',
                  type: 'function',
                  function: {
                    name: 'get_weather',
                    arguments: '{"location":"London"}',
                  },
                },
              ],
            },
            finishReason: 'tool_calls',
            usage: { promptTokens: 30, completionTokens: 10, totalTokens: 40 },
            model: 'gpt-5',
          },
        }),
      })

      const result = await llm.chat(messages, { tools })

      expect(result.finishReason).toBe('tool_calls')
      expect(result.message.tool_calls).toBeDefined()
      expect(result.message.tool_calls?.[0].function.name).toBe('get_weather')
    })

    test('handles multi-turn conversations', async () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi! How can I help?' },
        { role: 'user', content: 'Tell me a joke' },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            message: { role: 'assistant', content: 'Why did the programmer quit? No arrays!' },
            finishReason: 'stop',
            usage: { promptTokens: 40, completionTokens: 20, totalTokens: 60 },
            model: 'claude-sonnet-4.5',
          },
        }),
      })

      const result = await llm.chat(messages)

      expect(result.message.content).toContain('programmer')
    })
  })

  describe('stream()', () => {
    test('streams text generation', async () => {
      const chunks: StreamChunk[] = [
        { text: 'Hello', done: false },
        { text: ' world', done: false },
        { text: '!', done: true, finishReason: 'stop', usage: { promptTokens: 5, completionTokens: 10, totalTokens: 15 } },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            stream: chunks,
          },
        }),
      })

      const stream = await llm.stream('Say hello')

      const collected: string[] = []
      for await (const chunk of stream as AsyncIterable<StreamChunk>) {
        if (chunk.text) collected.push(chunk.text)
      }

      expect(collected.join('')).toBe('Hello world!')
    })

    test('streams with onChunk callback', async () => {
      const onChunk = vi.fn()

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            stream: [{ text: 'Test', done: true, finishReason: 'stop' }],
          },
        }),
      })

      await llm.stream('Test', { onChunk })

      // Note: In actual implementation, onChunk would be called
      // This test verifies the option is accepted
      expect(mockFetch).toHaveBeenCalled()
    })

    test('streams chat messages', async () => {
      const messages: ChatMessage[] = [{ role: 'user', content: 'Tell me a story' }]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            stream: [
              { text: 'Once upon a time', done: false },
              { text: '...', done: true, finishReason: 'stop' },
            ],
          },
        }),
      })

      const stream = await llm.stream(messages)

      const chunks: StreamChunk[] = []
      for await (const chunk of stream as AsyncIterable<StreamChunk>) {
        chunks.push(chunk)
      }

      expect(chunks.length).toBeGreaterThan(0)
    })
  })

  describe('embed()', () => {
    test('generates embeddings for single text', async () => {
      const mockEmbedding = new Array(1536).fill(0).map((_, i) => Math.random())

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            embedding: mockEmbedding,
            dimensions: 1536,
            model: 'text-embedding-ada-002',
          },
        }),
      })

      const result = await llm.embed('Hello world')

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/llm/embed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: [['Hello world', undefined]] }),
      })

      expect(Array.isArray(result.embedding)).toBe(true)
      expect(result.dimensions).toBe(1536)
    })

    test('generates embeddings for multiple texts', async () => {
      const texts = ['Hello', 'World', 'Test']
      const mockEmbeddings = texts.map(() => new Array(1536).fill(0).map(() => Math.random()))

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: mockEmbeddings.map((embedding) => ({
            embedding,
            dimensions: 1536,
            model: 'text-embedding-ada-002',
          })),
        }),
      })

      const results = await llm.embed(texts)

      expect(Array.isArray(results)).toBe(true)
      expect(results).toHaveLength(3)
    })

    test('accepts embedding options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            embedding: new Array(768).fill(0),
            dimensions: 768,
            model: 'text-embedding-3-small',
          },
        }),
      })

      await llm.embed('Test', {
        model: 'text-embedding-3-small',
        dimensions: 768,
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/llm/embed',
        expect.objectContaining({
          body: JSON.stringify({ params: [['Test', { model: 'text-embedding-3-small', dimensions: 768 }]] }),
        })
      )
    })
  })

  describe('models()', () => {
    test('lists all available models', async () => {
      const mockModels: Model[] = [
        {
          id: 'gpt-5',
          name: 'GPT-5',
          provider: 'openai',
          contextWindow: 128000,
          maxOutputTokens: 16384,
          inputPrice: 2.5,
          outputPrice: 10,
          capabilities: { chat: true, functionCalling: true, streaming: true, vision: false },
        },
        {
          id: 'claude-sonnet-4.5',
          name: 'Claude Sonnet 4.5',
          provider: 'anthropic',
          contextWindow: 200000,
          maxOutputTokens: 8192,
          inputPrice: 3,
          outputPrice: 15,
          capabilities: { chat: true, functionCalling: true, streaming: true, vision: true },
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: mockModels,
        }),
      })

      const models = await llm.models()

      expect(models).toHaveLength(2)
      expect(models[0].id).toBe('gpt-5')
      expect(models[1].id).toBe('claude-sonnet-4.5')
    })

    test('filters models by provider', async () => {
      const mockModels: Model[] = [
        {
          id: 'gpt-5',
          name: 'GPT-5',
          provider: 'openai',
          contextWindow: 128000,
          maxOutputTokens: 16384,
          inputPrice: 2.5,
          outputPrice: 10,
          capabilities: { chat: true, functionCalling: true, streaming: true, vision: false },
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: mockModels,
        }),
      })

      const models = await llm.models('openai')

      expect(models).toHaveLength(1)
      expect(models[0].provider).toBe('openai')
    })
  })

  describe('model()', () => {
    test('gets model details', async () => {
      const mockModel: Model = {
        id: 'claude-sonnet-4.5',
        name: 'Claude Sonnet 4.5',
        provider: 'anthropic',
        contextWindow: 200000,
        maxOutputTokens: 8192,
        inputPrice: 3,
        outputPrice: 15,
        capabilities: { chat: true, functionCalling: true, streaming: true, vision: true },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: mockModel,
        }),
      })

      const model = await llm.model('claude-sonnet-4.5')

      expect(model.id).toBe('claude-sonnet-4.5')
      expect(model.contextWindow).toBe(200000)
      expect(model.capabilities.vision).toBe(true)
    })

    test('throws error for unknown model', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: { message: 'Model not found: unknown-model' },
        }),
      })

      await expect(llm.model('unknown-model')).rejects.toThrow('Model not found')
    })
  })

  describe('isAvailable()', () => {
    test('checks if model is available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: true,
        }),
      })

      const available = await llm.isAvailable('gpt-5')

      expect(available).toBe(true)
    })

    test('returns false for unavailable model', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: false,
        }),
      })

      const available = await llm.isAvailable('future-model')

      expect(available).toBe(false)
    })
  })

  describe('batch()', () => {
    test('creates batch job', async () => {
      const requests: BatchRequest[] = [
        { custom_id: '1', prompt: 'Hello' },
        { custom_id: '2', prompt: 'World' },
        { custom_id: '3', prompt: 'Test' },
      ]

      const mockBatch: BatchJob = {
        id: 'batch_123',
        status: 'validating',
        totalRequests: 3,
        completedRequests: 0,
        failedRequests: 0,
        createdAt: '2025-10-11T00:00:00Z',
        expiresAt: '2025-10-12T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: mockBatch,
        }),
      })

      const batch = await llm.batch(requests, { model: 'gpt-5' })

      expect(batch.id).toBe('batch_123')
      expect(batch.totalRequests).toBe(3)
      expect(batch.status).toBe('validating')
    })

    test('handles large batch', async () => {
      const requests: BatchRequest[] = Array.from({ length: 1000 }, (_, i) => ({
        custom_id: `${i}`,
        prompt: `Request ${i}`,
      }))

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            id: 'batch_large',
            status: 'validating',
            totalRequests: 1000,
            completedRequests: 0,
            failedRequests: 0,
            createdAt: '2025-10-11T00:00:00Z',
            expiresAt: '2025-10-12T00:00:00Z',
          },
        }),
      })

      const batch = await llm.batch(requests)

      expect(batch.totalRequests).toBe(1000)
    })
  })

  describe('batchStatus()', () => {
    test('gets batch status', async () => {
      const mockStatus: BatchJob = {
        id: 'batch_123',
        status: 'processing',
        totalRequests: 100,
        completedRequests: 50,
        failedRequests: 2,
        createdAt: '2025-10-11T00:00:00Z',
        expiresAt: '2025-10-12T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: mockStatus,
        }),
      })

      const status = await llm.batchStatus('batch_123')

      expect(status.status).toBe('processing')
      expect(status.completedRequests).toBe(50)
    })

    test('tracks batch completion', async () => {
      const mockStatus: BatchJob = {
        id: 'batch_123',
        status: 'completed',
        totalRequests: 100,
        completedRequests: 100,
        failedRequests: 0,
        createdAt: '2025-10-11T00:00:00Z',
        completedAt: '2025-10-11T01:00:00Z',
        expiresAt: '2025-10-12T00:00:00Z',
        resultsUrl: 'https://api.example.com/batches/batch_123/results',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: mockStatus,
        }),
      })

      const status = await llm.batchStatus('batch_123')

      expect(status.status).toBe('completed')
      expect(status.completedAt).toBeDefined()
      expect(status.resultsUrl).toBeDefined()
    })
  })

  describe('batchResults()', () => {
    test('gets batch results', async () => {
      const mockResults = [
        { custom_id: '1', text: 'Response 1' },
        { custom_id: '2', text: 'Response 2' },
        { custom_id: '3', error: 'Failed to generate' },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: mockResults,
        }),
      })

      const results = await llm.batchResults('batch_123')

      expect(results).toHaveLength(3)
      expect(results[0].text).toBe('Response 1')
      expect(results[2].error).toBeDefined()
    })
  })

  describe('cancelBatch()', () => {
    test('cancels batch job', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: undefined,
        }),
      })

      await llm.cancelBatch('batch_123')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/llm/cancelBatch',
        expect.objectContaining({
          body: JSON.stringify({ params: [['batch_123']] }),
        })
      )
    })
  })

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(llm.generate('test')).rejects.toThrow('Network error')
    })

    test('handles HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
      })

      await expect(llm.generate('test')).rejects.toThrow('HTTP 429')
    })

    test('handles RPC error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: {
            message: 'Rate limit exceeded',
            code: 'RATE_LIMIT',
          },
        }),
      })

      await expect(llm.generate('test')).rejects.toThrow('Rate limit exceeded')
    })

    test('handles invalid API key', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      })

      await expect(llm.generate('test')).rejects.toThrow('HTTP 401')
    })
  })

  describe('Model Selection', () => {
    test('uses default model when not specified', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            text: 'response',
            finishReason: 'stop',
            usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            model: 'gpt-5',
          },
        }),
      })

      await llm.generate('test')

      expect(mockFetch).toHaveBeenCalled()
    })

    test('supports all current models', async () => {
      const models = ['gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-5-codex', 'claude-sonnet-4.5', 'llama-4', 'gemini-2.5-pro', 'grok-4']

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            text: 'response',
            finishReason: 'stop',
            usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            model: 'test',
          },
        }),
      })

      for (const model of models) {
        await llm.generate('test', { model })
      }

      expect(mockFetch).toHaveBeenCalledTimes(models.length)
    })
  })

  describe('Provider Selection', () => {
    test('supports OpenAI provider', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            text: 'response',
            finishReason: 'stop',
            usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            model: 'gpt-5',
          },
        }),
      })

      await llm.generate('test', { provider: 'openai' })

      expect(mockFetch).toHaveBeenCalled()
    })

    test('supports Anthropic provider', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            text: 'response',
            finishReason: 'stop',
            usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            model: 'claude-sonnet-4.5',
          },
        }),
      })

      await llm.generate('test', { provider: 'anthropic' })

      expect(mockFetch).toHaveBeenCalled()
    })

    test('supports all providers', async () => {
      const providers = ['openai', 'anthropic', 'google', 'meta', 'xai', 'workers-ai'] as const

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            text: 'response',
            finishReason: 'stop',
            usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            model: 'test',
          },
        }),
      })

      for (const provider of providers) {
        await llm.generate('test', { provider })
      }

      expect(mockFetch).toHaveBeenCalledTimes(providers.length)
    })
  })

  describe('Type Safety', () => {
    test('generate returns correct type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            text: 'response',
            finishReason: 'stop',
            usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            model: 'gpt-5',
          },
        }),
      })

      const result = await llm.generate('test')

      const text: string = result.text
      const tokens: number = result.usage.totalTokens
      expect(typeof text).toBe('string')
      expect(typeof tokens).toBe('number')
    })

    test('chat returns correct type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            message: { role: 'assistant', content: 'response' },
            finishReason: 'stop',
            usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            model: 'gpt-5',
          },
        }),
      })

      const result = await llm.chat([{ role: 'user', content: 'test' }])

      const content: string = result.message.content
      expect(typeof content).toBe('string')
    })

    test('embed returns correct type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            embedding: [0.1, 0.2, 0.3],
            dimensions: 3,
            model: 'test',
          },
        }),
      })

      const result = await llm.embed('test')

      const embedding: number[] = result.embedding
      const dimensions: number = result.dimensions
      expect(Array.isArray(embedding)).toBe(true)
      expect(typeof dimensions).toBe('number')
    })
  })
})
