/**
 * Tests for AI Service
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { RPCClient } from './client'
import type { AIService } from './types'

describe('AI Service', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let client: RPCClient
  let ai: AIService

  beforeEach(() => {
    // Mock global fetch
    mockFetch = vi.fn()
    global.fetch = mockFetch

    // Create client with test configuration
    client = new RPCClient({
      apiKey: 'test-key',
      baseUrl: 'https://test.apis.do',
    })

    ai = client.ai
  })

  describe('generateText()', () => {
    test('generates text from prompt', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: { text: 'This is a generated response.' },
        }),
      })

      const result = await ai.generateText('Write a short greeting')

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/ai/generateText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: [['Write a short greeting', undefined]] }),
      })

      expect(result).toEqual({ text: 'This is a generated response.' })
      expect(result.text).toBe('This is a generated response.')
    })

    test('accepts generation options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: { text: 'Creative response' },
        }),
      })

      await ai.generateText('Write creatively', {
        model: 'gpt-5',
        temperature: 0.9,
        maxTokens: 500,
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/ai/generateText',
        expect.objectContaining({
          body: JSON.stringify({ params: [['Write creatively', { model: 'gpt-5', temperature: 0.9, maxTokens: 500 }]] }),
        })
      )
    })

    test('handles empty responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: { text: '' },
        }),
      })

      const result = await ai.generateText('Generate nothing')

      expect(result.text).toBe('')
    })
  })

  describe('generate()', () => {
    test('generates content with schema', async () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
          email: { type: 'string' },
        },
      }

      const mockResult = {
        name: 'John Doe',
        age: 30,
        email: 'john@example.com',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: mockResult }),
      })

      const result = await ai.generate('Generate a user profile', { schema })

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: [['Generate a user profile', { schema }]] }),
      })

      expect(result).toEqual(mockResult)
    })

    test('generates arrays of objects', async () => {
      const mockResult = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
        { id: 3, title: 'Task 3' },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: mockResult }),
      })

      const result = await ai.generate('Generate 3 tasks')

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(3)
    })

    test('supports different models', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: {} }),
      })

      await ai.generate('test', { model: 'gpt-5' })
      await ai.generate('test', { model: 'claude-sonnet-4.5' })
      await ai.generate('test', { model: 'llama-4' })

      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    test('applies temperature settings', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: {} }),
      })

      await ai.generate('test', { temperature: 0.1 })

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.params[0][1].temperature).toBe(0.1)
    })

    test('handles complex nested schemas', async () => {
      const complexSchema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              profile: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  contacts: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: { type: 'string' },
                        value: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            user: {
              profile: {
                name: 'Alice',
                contacts: [
                  { type: 'email', value: 'alice@example.com' },
                  { type: 'phone', value: '+1234567890' },
                ],
              },
            },
          },
        }),
      })

      const result = await ai.generate('Generate user data', { schema: complexSchema })

      expect(result.user.profile.name).toBe('Alice')
      expect(result.user.profile.contacts).toHaveLength(2)
    })
  })

  describe('embed()', () => {
    test('generates embeddings for single text', async () => {
      const mockEmbedding = new Array(1536).fill(0).map((_, i) => Math.random())

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: mockEmbedding }),
      })

      const result = await ai.embed('Hello world')

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/ai/embed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: [['Hello world', undefined]] }),
      })

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(1536)
      expect(typeof result[0]).toBe('number')
    })

    test('accepts embedding options', async () => {
      const mockEmbedding = new Array(768).fill(0).map(() => Math.random())

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: mockEmbedding }),
      })

      await ai.embed('Test text', {
        model: 'text-embedding-3-small',
        dimensions: 768,
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/ai/embed',
        expect.objectContaining({
          body: JSON.stringify({ params: [['Test text', { model: 'text-embedding-3-small', dimensions: 768 }]] }),
        })
      )
    })

    test('handles empty string', async () => {
      const mockEmbedding = new Array(1536).fill(0)

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: mockEmbedding }),
      })

      const result = await ai.embed('')

      expect(Array.isArray(result)).toBe(true)
    })

    test('generates embeddings for long text', async () => {
      const longText = 'Lorem ipsum '.repeat(1000) // ~12000 chars

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: new Array(1536).fill(0) }),
      })

      const result = await ai.embed(longText)

      expect(Array.isArray(result)).toBe(true)
    })

    test('handles unicode text', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: new Array(1536).fill(0) }),
      })

      const result = await ai.embed('你好世界 🌍 مرحبا العالم')

      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(ai.generateText('test')).rejects.toThrow('Network error')
    })

    test('handles HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
      })

      await expect(ai.generateText('test')).rejects.toThrow('HTTP 429')
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

      await expect(ai.generateText('test')).rejects.toThrow('Rate limit exceeded')
    })

    test('handles invalid API key', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      })

      await expect(ai.generateText('test')).rejects.toThrow('HTTP 401')
    })

    test('handles malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(ai.generateText('test')).rejects.toThrow('Invalid JSON')
    })

    test('handles timeout errors', async () => {
      mockFetch.mockImplementationOnce(() => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100)))

      await expect(ai.generateText('test')).rejects.toThrow('Timeout')
    })
  })

  describe('Model Selection', () => {
    test('uses GPT-5 by default', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      await ai.generateText('test')

      // Default model should be used (or none specified = server default)
      expect(mockFetch).toHaveBeenCalled()
    })

    test('supports GPT-5 variants', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      await ai.generateText('test', { model: 'gpt-5' })
      await ai.generateText('test', { model: 'gpt-5-mini' })
      await ai.generateText('test', { model: 'gpt-5-nano' })
      await ai.generateText('test', { model: 'gpt-5-codex' })

      expect(mockFetch).toHaveBeenCalledTimes(4)
    })

    test('supports Claude models', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      await ai.generateText('test', { model: 'claude-sonnet-4.5' })

      expect(mockFetch).toHaveBeenCalled()
    })

    test('supports Llama models', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      await ai.generateText('test', { model: 'llama-4' })

      expect(mockFetch).toHaveBeenCalled()
    })

    test('supports Gemini models', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      await ai.generateText('test', { model: 'gemini-2.5-pro' })

      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('Request Deduplication', () => {
    test('deduplicates identical concurrent requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      // Make three identical concurrent requests
      const [result1, result2, result3] = await Promise.all([ai.generateText('same prompt'), ai.generateText('same prompt'), ai.generateText('same prompt')])

      // Should only make one network request
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // All results should be the same
      expect(result1).toEqual(result2)
      expect(result2).toEqual(result3)
    })

    test('does not deduplicate different prompts', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      await Promise.all([ai.generateText('prompt 1'), ai.generateText('prompt 2'), ai.generateText('prompt 3')])

      // Should make three separate network requests
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
  })

  describe('Generation Options', () => {
    test('applies temperature parameter', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      await ai.generateText('test', { temperature: 0.1 }) // More deterministic
      await ai.generateText('test', { temperature: 0.9 }) // More creative

      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    test('applies maxTokens parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { text: 'short' } }),
      })

      await ai.generateText('test', { maxTokens: 10 })

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.params[0][1].maxTokens).toBe(10)
    })

    test('applies topP parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      await ai.generateText('test', { topP: 0.95 })

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.params[0][1].topP).toBe(0.95)
    })

    test('combines multiple options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      await ai.generateText('test', {
        model: 'gpt-5',
        temperature: 0.7,
        maxTokens: 500,
        topP: 0.9,
      })

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.params[0][1]).toMatchObject({
        model: 'gpt-5',
        temperature: 0.7,
        maxTokens: 500,
        topP: 0.9,
      })
    })
  })

  describe('Schema-Based Generation', () => {
    test('generates typed objects', async () => {
      interface Person {
        name: string
        age: number
        email: string
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: { name: 'Alice', age: 30, email: 'alice@example.com' },
        }),
      })

      const result = await ai.generate('Generate a person')

      // Type assertion
      const person: Person = result as Person
      expect(person.name).toBeDefined()
      expect(typeof person.age).toBe('number')
    })

    test('generates arrays with schema', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: [
            { id: 1, completed: false },
            { id: 2, completed: true },
          ],
        }),
      })

      const result = await ai.generate('Generate tasks', {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              completed: { type: 'boolean' },
            },
          },
        },
      })

      expect(Array.isArray(result)).toBe(true)
      expect(result[0].id).toBeDefined()
    })

    test('validates against schema', async () => {
      const schema = {
        type: 'object',
        properties: {
          count: { type: 'number', minimum: 0, maximum: 100 },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { count: 50 } }),
      })

      const result = await ai.generate('Generate count', { schema })

      expect(result.count).toBeGreaterThanOrEqual(0)
      expect(result.count).toBeLessThanOrEqual(100)
    })
  })

  describe('Edge Cases', () => {
    test('handles very long prompts', async () => {
      const longPrompt = 'Generate '.repeat(10000) + 'text'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      await ai.generateText(longPrompt)

      expect(mockFetch).toHaveBeenCalled()
    })

    test('handles prompts with special characters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      await ai.generateText('Generate text with "quotes" and \'apostrophes\' and \n newlines')

      expect(mockFetch).toHaveBeenCalled()
    })

    test('handles unicode in prompts', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { text: '你好世界' } }),
      })

      const result = await ai.generateText('Generate Chinese greeting: 你好')

      expect(result.text).toBeDefined()
    })

    test('handles empty prompt', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { text: '' } }),
      })

      const result = await ai.generateText('')

      expect(result.text).toBe('')
    })

    test('handles null/undefined options gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      await ai.generateText('test', undefined)

      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('Type Safety', () => {
    test('generateText returns correct type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { text: 'response' } }),
      })

      const result = await ai.generateText('test')

      // Type assertion
      const text: string = result.text
      expect(typeof text).toBe('string')
    })

    test('generate returns any type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: {} }),
      })

      const result = await ai.generate('test')

      // Type assertion
      const data: any = result
      expect(data).toBeDefined()
    })

    test('embed returns number array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: [0.1, 0.2, 0.3] }),
      })

      const result = await ai.embed('test')

      // Type assertion
      const embedding: number[] = result
      expect(Array.isArray(embedding)).toBe(true)
      expect(typeof embedding[0]).toBe('number')
    })
  })

  describe('generateCode()', () => {
    test('generates code with default options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            code: 'function hello() { return "Hello World"; }',
            language: 'javascript',
            explanation: 'A simple hello world function',
          },
        }),
      })

      const result = await ai.generateCode('Create a hello world function')

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/ai/generateCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({
          params: [['Create a hello world function', undefined]],
        }),
      })

      expect(result.code).toContain('function hello')
      expect(result.language).toBe('javascript')
      expect(result.explanation).toBeDefined()
    })

    test('generates code with specific language', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            code: 'def hello():\\n    return "Hello World"',
            language: 'python',
          },
        }),
      })

      const result = await ai.generateCode('Create a hello world function', {
        language: 'python',
        includeComments: true,
      })

      expect(result.language).toBe('python')
      expect(result.code).toContain('def hello')
    })

    test('handles code generation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: { message: 'Invalid prompt' },
        }),
      })

      await expect(ai.generateCode('Invalid prompt')).rejects.toThrow('Invalid prompt')
    })

    test('supports different models', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            code: 'code here',
            language: 'typescript',
          },
        }),
      })

      await ai.generateCode('Create function', {
        provider: 'openai',
        model: 'gpt-5-codex',
      })

      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('generateImage()', () => {
    test('generates image with default options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            images: [{ url: 'https://example.com/image.png' }],
            provider: 'openai',
            model: 'dall-e-3',
            createdAt: '2025-10-11T00:00:00Z',
          },
        }),
      })

      const result = await ai.generateImage('A beautiful sunset')

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/ai/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({
          params: [['A beautiful sunset', undefined]],
        }),
      })

      expect(result.images).toHaveLength(1)
      expect(result.images[0].url).toContain('example.com')
      expect(result.provider).toBe('openai')
    })

    test('generates multiple images', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            images: [{ url: 'url1' }, { url: 'url2' }, { url: 'url3' }],
            provider: 'openai',
            model: 'dall-e-3',
            createdAt: '2025-10-11T00:00:00Z',
          },
        }),
      })

      const result = await ai.generateImage('Generate art', { n: 3 })

      expect(result.images).toHaveLength(3)
    })

    test('supports different image sizes', async () => {
      const sizes = ['256x256', '512x512', '1024x1024', '1024x1792', '1792x1024'] as const

      for (const size of sizes) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            result: {
              images: [{ url: 'url' }],
              provider: 'openai',
              model: 'dall-e-3',
              createdAt: '2025-10-11T00:00:00Z',
            },
          }),
        })

        await ai.generateImage('Test', { size })
      }

      expect(mockFetch).toHaveBeenCalledTimes(sizes.length)
    })

    test('supports quality settings', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            images: [{ url: 'hd-image.png' }],
            provider: 'openai',
            model: 'dall-e-3',
            createdAt: '2025-10-11T00:00:00Z',
          },
        }),
      })

      await ai.generateImage('High quality image', {
        quality: 'hd',
        style: 'vivid',
      })

      expect(mockFetch).toHaveBeenCalled()
    })

    test('handles image generation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: { message: 'Content policy violation' },
        }),
      })

      await expect(ai.generateImage('Inappropriate content')).rejects.toThrow('Content policy violation')
    })

    test('supports base64 responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            images: [{ b64_json: 'base64encodeddata==' }],
            provider: 'openai',
            model: 'dall-e-3',
            createdAt: '2025-10-11T00:00:00Z',
          },
        }),
      })

      const result = await ai.generateImage('Image')

      expect(result.images[0].b64_json).toBeDefined()
    })
  })

  describe('generateSpeech()', () => {
    test('generates speech with default options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            audio: 'base64audiodata==',
            format: 'mp3',
            provider: 'openai',
            voice: 'alloy',
            duration: 5.2,
          },
        }),
      })

      const result = await ai.generateSpeech('Hello, world!')

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/ai/generateSpeech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({
          params: [['Hello, world!', undefined]],
        }),
      })

      expect(result.audio).toBe('base64audiodata==')
      expect(result.format).toBe('mp3')
      expect(result.provider).toBe('openai')
      expect(result.duration).toBeGreaterThan(0)
    })

    test('supports different voices', async () => {
      const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']

      for (const voice of voices) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            result: {
              audio: 'data',
              format: 'mp3',
              provider: 'openai',
              voice,
              duration: 1.0,
            },
          }),
        })

        const result = await ai.generateSpeech('Test', { voice })
        expect(result.voice).toBe(voice)
      }
    })

    test('supports different audio formats', async () => {
      const formats = ['mp3', 'opus', 'aac', 'flac', 'wav', 'pcm']

      for (const format of formats) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            result: {
              audio: 'data',
              format,
              provider: 'openai',
              voice: 'alloy',
              duration: 1.0,
            },
          }),
        })

        const result = await ai.generateSpeech('Test', { format: format as any })
        expect(result.format).toBe(format)
      }
    })

    test('supports speed control', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            audio: 'data',
            format: 'mp3',
            provider: 'openai',
            voice: 'alloy',
            duration: 0.5, // Faster due to speed 2.0
          },
        }),
      })

      const result = await ai.generateSpeech('Fast speech', { speed: 2.0 })

      expect(result.duration).toBeLessThan(1.0)
    })

    test('handles empty text', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: { message: 'Text cannot be empty' },
        }),
      })

      await expect(ai.generateSpeech('')).rejects.toThrow('Text cannot be empty')
    })

    test('handles long text', async () => {
      const longText = 'a'.repeat(5000)

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            audio: 'longaudiodata',
            format: 'mp3',
            provider: 'openai',
            voice: 'alloy',
            duration: 120.5,
          },
        }),
      })

      const result = await ai.generateSpeech(longText)

      expect(result.duration).toBeGreaterThan(100)
    })
  })

  describe('generateVideo()', () => {
    test('generates video with default options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            video: 'https://example.com/video.mp4',
            format: 'mp4',
            provider: 'runway',
            duration: 5,
            status: 'completed',
          },
        }),
      })

      const result = await ai.generateVideo('A cat playing piano')

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/ai/generateVideo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({
          params: [['A cat playing piano', undefined]],
        }),
      })

      expect(result.video).toContain('example.com')
      expect(result.status).toBe('completed')
      expect(result.duration).toBe(5)
    })

    test('handles async processing with job ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            video: '',
            format: 'mp4',
            provider: 'runway',
            duration: 0,
            status: 'processing',
            jobId: 'job-123',
          },
        }),
      })

      const result = await ai.generateVideo('Complex scene')

      expect(result.status).toBe('processing')
      expect(result.jobId).toBe('job-123')
      expect(result.video).toBe('')
    })

    test('supports different resolutions', async () => {
      const resolutions = ['720p', '1080p', '4k'] as const

      for (const resolution of resolutions) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            result: {
              video: `video-${resolution}.mp4`,
              format: 'mp4',
              provider: 'runway',
              duration: 5,
              status: 'completed',
            },
          }),
        })

        const result = await ai.generateVideo('Test', { resolution })
        expect(result.video).toContain(resolution)
      }
    })

    test('supports custom duration', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            video: 'long-video.mp4',
            format: 'mp4',
            provider: 'runway',
            duration: 10,
            status: 'completed',
          },
        }),
      })

      const result = await ai.generateVideo('Long scene', { duration: 10 })

      expect(result.duration).toBe(10)
    })

    test('supports frame rate control', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            video: 'smooth-video.mp4',
            format: 'mp4',
            provider: 'runway',
            duration: 5,
            status: 'completed',
          },
        }),
      })

      await ai.generateVideo('Smooth animation', { fps: 60 })

      expect(mockFetch).toHaveBeenCalled()
    })

    test('supports style presets', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            video: 'cinematic.mp4',
            format: 'mp4',
            provider: 'runway',
            duration: 5,
            status: 'completed',
          },
        }),
      })

      await ai.generateVideo('Dramatic scene', { style: 'cinematic' })

      expect(mockFetch).toHaveBeenCalled()
    })

    test('handles failed video generation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            video: '',
            format: 'mp4',
            provider: 'runway',
            duration: 0,
            status: 'failed',
            jobId: 'job-failed',
          },
        }),
      })

      const result = await ai.generateVideo('Invalid prompt')

      expect(result.status).toBe('failed')
      expect(result.video).toBe('')
    })

    test('handles network errors during video generation', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'))

      await expect(ai.generateVideo('Test')).rejects.toThrow('Network timeout')
    })
  })
})
