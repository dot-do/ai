/**
 * AI Service Integration Tests
 *
 * These tests run against actual AI service endpoints with real AI providers.
 * Requires AI_TEST_API_KEY and provider API keys (OPENAI_API_KEY, etc).
 *
 * Run with: pnpm test:integration ai.integration.test.ts
 */

import { describe, test, expect, beforeAll } from 'vitest'
import { RPCClient } from './client'
import type { AIService } from './types'

const AI_BASE_URL = process.env.AI_BASE_URL || 'https://apis.do'
const AI_TEST_API_KEY = process.env.AI_TEST_API_KEY

// Skip all tests if no API key provided
const describeIfApiKey = AI_TEST_API_KEY ? describe : describe.skip

describeIfApiKey('AI Service - Integration Tests', () => {
  let client: RPCClient
  let ai: AIService

  beforeAll(() => {
    if (!AI_TEST_API_KEY) {
      throw new Error('AI_TEST_API_KEY environment variable is required for integration tests')
    }
    client = new RPCClient({
      baseUrl: AI_BASE_URL,
      apiKey: AI_TEST_API_KEY,
    })
    ai = client.ai
  })

  describe('Text Generation', () => {
    test('generates text from simple prompt', async () => {
      const result = await ai.generateText('Say hello in 3 words')

      expect(result).toBeDefined()
      expect(result.text).toBeDefined()
      expect(typeof result.text).toBe('string')
      expect(result.text.length).toBeGreaterThan(0)
      expect(result.text.length).toBeLessThan(100) // Should be short
    }, 30000)

    test('generates text with temperature control', async () => {
      const result1 = await ai.generateText('Write a creative sentence', { temperature: 0.1 })
      const result2 = await ai.generateText('Write a creative sentence', { temperature: 0.9 })

      expect(result1.text).toBeDefined()
      expect(result2.text).toBeDefined()
      // With different temperatures, responses should vary
      expect(result1.text).not.toBe(result2.text)
    }, 30000)

    test('respects maxTokens limit', async () => {
      const result = await ai.generateText('Write a long story', { maxTokens: 50 })

      expect(result.text).toBeDefined()
      // Response should be relatively short due to token limit
      expect(result.text.split(' ').length).toBeLessThan(100)
    }, 30000)
  })

  describe('Object Generation', () => {
    test('generates structured object with schema', async () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
          city: { type: 'string' },
        },
        required: ['name', 'age'],
      }

      const result = await ai.generateObject('Generate a person: Alice, 28, from New York', { schema })

      expect(result.object).toBeDefined()
      expect(result.object.name).toBeDefined()
      expect(typeof result.object.name).toBe('string')
      expect(result.object.age).toBeDefined()
      expect(typeof result.object.age).toBe('number')
    }, 30000)

    test('generates list of items', async () => {
      const result = await ai.list('List 5 programming languages')

      expect(result).toBeDefined()
      expect(result.items).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)
      expect(result.items.length).toBeGreaterThanOrEqual(3)
      expect(result.items.length).toBeLessThanOrEqual(7)
    }, 30000)
  })

  describe('Embeddings', () => {
    test('generates embeddings for text', async () => {
      const result = await ai.embed('Hello world')

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(100) // Vector should have reasonable dimensions
      expect(typeof result[0]).toBe('number')
    }, 30000)

    test('generates consistent embeddings for same text', async () => {
      const text = 'Consistent test text'

      const result1 = await ai.embed(text)
      const result2 = await ai.embed(text)

      expect(result1.length).toBe(result2.length)
      // Embeddings should be very similar (cosine similarity near 1)
      const dotProduct = result1.reduce((sum, val, i) => sum + val * result2[i], 0)
      const mag1 = Math.sqrt(result1.reduce((sum, val) => sum + val * val, 0))
      const mag2 = Math.sqrt(result2.reduce((sum, val) => sum + val * val, 0))
      const cosineSimilarity = dotProduct / (mag1 * mag2)

      expect(cosineSimilarity).toBeGreaterThan(0.99) // Very similar
    }, 30000)
  })

  describe('Vector Search', () => {
    test('upserts and searches vectors', async () => {
      // Upsert test vectors
      const vectors = [
        { id: 'test1', text: 'Machine learning and artificial intelligence' },
        { id: 'test2', text: 'Cooking recipes and food preparation' },
        { id: 'test3', text: 'Deep learning neural networks' },
      ]

      const upsertResult = await ai.upsert({ vectors })
      expect(upsertResult.count).toBe(3)
      expect(upsertResult.ids).toContain('test1')

      // Wait a moment for indexing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Search for similar content
      const searchResult = await ai.search('AI and machine learning', { topK: 2 })

      expect(searchResult.results).toBeDefined()
      expect(Array.isArray(searchResult.results)).toBe(true)
      expect(searchResult.results.length).toBeGreaterThan(0)
      expect(searchResult.results.length).toBeLessThanOrEqual(2)

      // First result should be most relevant (test1 or test3)
      const topResult = searchResult.results[0]
      expect(['test1', 'test3']).toContain(topResult.id)
      expect(topResult.score).toBeGreaterThan(0.5) // Reasonable similarity
    }, 60000)
  })

  describe('Streaming', () => {
    test('streams text generation', async () => {
      const chunks: string[] = []

      const stream = await ai.stream('Count from 1 to 5', {
        onChunk: (chunk) => chunks.push(chunk),
      })

      expect(stream).toBeInstanceOf(ReadableStream)

      // Wait for stream to complete
      await new Promise((resolve) => setTimeout(resolve, 5000))

      // Should have received multiple chunks
      expect(chunks.length).toBeGreaterThan(0)

      // Full text should be reasonable
      const fullText = chunks.join('')
      expect(fullText.length).toBeGreaterThan(0)
    }, 30000)
  })

  describe('Error Handling', () => {
    test('handles invalid model', async () => {
      await expect(
        ai.generateText('Test', {
          model: 'nonexistent-model-xyz',
        })
      ).rejects.toThrow()
    }, 30000)

    test('handles invalid schema', async () => {
      const invalidSchema = {
        type: 'invalid-type',
      } as any

      await expect(ai.generateObject('Test', { schema: invalidSchema })).rejects.toThrow()
    }, 30000)

    test('handles empty prompts gracefully', async () => {
      const result = await ai.generateText('', { maxTokens: 10 })

      // Should either return minimal text or error
      expect(result).toBeDefined()
    }, 30000)
  })
})

describeIfApiKey('AI Service - Load Testing', () => {
  let client: RPCClient
  let ai: AIService

  beforeAll(() => {
    client = new RPCClient({
      baseUrl: AI_BASE_URL,
      apiKey: AI_TEST_API_KEY!,
    })
    ai = client.ai
  })

  test('handles concurrent text generation', async () => {
    const promises = Array.from({ length: 5 }, (_, i) => ai.generateText(`Generate text ${i}`, { maxTokens: 20 }))

    const results = await Promise.allSettled(promises)

    const successful = results.filter((r) => r.status === 'fulfilled').length
    expect(successful).toBeGreaterThan(0)
  }, 60000)

  test('handles concurrent embeddings', async () => {
    const texts = ['Text 1', 'Text 2', 'Text 3', 'Text 4', 'Text 5']
    const promises = texts.map((text) => ai.embed(text))

    const results = await Promise.all(promises)

    results.forEach((embedding) => {
      expect(Array.isArray(embedding)).toBe(true)
      expect(embedding.length).toBeGreaterThan(100)
    })
  }, 60000)
})
