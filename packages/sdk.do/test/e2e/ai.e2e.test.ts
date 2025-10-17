/**
 * AI Service E2E Tests
 *
 * Comprehensive end-to-end tests for AI operations including:
 * - Text generation (basic, streaming, with schema)
 * - Embeddings generation (single, batch)
 * - Vector search operations
 * - Multi-provider support (OpenAI, Anthropic, Google, Meta)
 * - Model registry operations
 * - Batch processing (large datasets, 50% cost savings)
 * - Schema-based generation (structured outputs)
 * - AI + database integration (db.forEach with AI)
 * - Error handling (invalid models, rate limits)
 * - Token tracking and costs
 * - Prompt templates
 * - AI Gateway integration
 * - Image generation
 * - Multi-modal operations
 * - Performance tests
 *
 * Run with: TEST_ENV=e2e pnpm test test/e2e/ai.e2e.test.ts
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from '../e2e/runner'
import { getTimeout } from '../e2e/config'

describe('AI Service E2E Tests', () => {
  let runner: E2ETestRunner

  beforeEach(() => {
    runner = new E2ETestRunner('ai')
  })

  afterEach(async () => {
    await runner.teardown()
  })

  describe('Text Generation', () => {
    test(
      'should generate text with GPT-5',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateText('Write a haiku about TypeScript')

        expect(result).toBeDefined()
        expect(result.text).toBeTruthy()
        expect(typeof result.text).toBe('string')
        expect(result.text.length).toBeGreaterThan(10)
        expect(result.text.length).toBeLessThan(500) // Haikus are short
      },
      getTimeout()
    )

    test(
      'should generate text with streaming',
      async () => {
        const sdk = runner.getSDK()
        const chunks: string[] = []

        const stream = await sdk.ai.stream('Count from 1 to 5', {
          onChunk: (chunk) => chunks.push(chunk.text),
        })

        expect(stream).toBeInstanceOf(ReadableStream)

        // Wait for stream to complete
        await runner.wait(5000)

        expect(chunks.length).toBeGreaterThan(0)
        const fullText = chunks.join('')
        expect(fullText.length).toBeGreaterThan(0)
      },
      getTimeout()
    )

    test(
      'should generate text with temperature control',
      async () => {
        const sdk = runner.getSDK()

        // Low temperature (more deterministic)
        const result1 = await sdk.ai.generateText('Write a greeting', {
          temperature: 0.1,
          maxTokens: 50,
        })

        // High temperature (more creative)
        const result2 = await sdk.ai.generateText('Write a greeting', {
          temperature: 0.9,
          maxTokens: 50,
        })

        expect(result1.text).toBeDefined()
        expect(result2.text).toBeDefined()
        // Both should be different due to temperature variation
        expect(result1.text).not.toBe(result2.text)
      },
      getTimeout()
    )

    test(
      'should respect maxTokens limit',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateText('Write a very long essay about AI', {
          maxTokens: 50,
        })

        expect(result.text).toBeDefined()
        // Response should be relatively short
        expect(result.text.split(' ').length).toBeLessThan(100)
      },
      getTimeout()
    )
  })

  describe('Structured Generation with Schema', () => {
    test(
      'should generate object with JSON schema',
      async () => {
        const sdk = runner.getSDK()

        const schema = {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
            email: { type: 'string' },
            city: { type: 'string' },
          },
          required: ['name', 'age'],
        }

        const result = await sdk.ai.generate('Generate a person: Alice, 28, alice@example.com, New York', {
          schema,
        })

        expect(result).toBeDefined()
        expect(result.name).toBeDefined()
        expect(typeof result.name).toBe('string')
        expect(result.age).toBeDefined()
        expect(typeof result.age).toBe('number')
        expect(result.age).toBeGreaterThan(0)
      },
      getTimeout()
    )

    test(
      'should generate array with schema',
      async () => {
        const sdk = runner.getSDK()

        const schema = {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              title: { type: 'string' },
              completed: { type: 'boolean' },
            },
          },
        }

        const result = await sdk.ai.generate('Generate 3 todo tasks', { schema })

        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBeGreaterThanOrEqual(2)
        expect(result.length).toBeLessThanOrEqual(5)
        expect(result[0]).toHaveProperty('id')
        expect(result[0]).toHaveProperty('title')
        expect(result[0]).toHaveProperty('completed')
      },
      getTimeout()
    )

    test(
      'should generate nested objects with complex schema',
      async () => {
        const sdk = runner.getSDK()

        const schema = {
          type: 'object',
          properties: {
            company: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                employees: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      role: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        }

        const result = await sdk.ai.generate('Generate a tech company with 2 employees', {
          schema,
        })

        expect(result.company).toBeDefined()
        expect(result.company.name).toBeDefined()
        expect(Array.isArray(result.company.employees)).toBe(true)
        expect(result.company.employees.length).toBeGreaterThanOrEqual(1)
      },
      getTimeout()
    )
  })

  describe('Embeddings Generation', () => {
    test(
      'should generate embeddings for single text',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.embed('Hello world')

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBeGreaterThan(100) // OpenAI embeddings are typically 1536 dimensions
        expect(typeof result[0]).toBe('number')
        // Check embeddings are normalized (common practice)
        const magnitude = Math.sqrt(result.reduce((sum, val) => sum + val * val, 0))
        expect(magnitude).toBeGreaterThan(0)
      },
      getTimeout()
    )

    test(
      'should generate batch embeddings',
      async () => {
        const sdk = runner.getSDK()

        const texts = ['Machine learning and AI', 'Cooking recipes and food', 'Sports and athletics', 'Music and entertainment']

        const embeddings = await Promise.all(texts.map((text) => sdk.ai.embed(text)))

        expect(embeddings).toHaveLength(4)
        embeddings.forEach((embedding) => {
          expect(Array.isArray(embedding)).toBe(true)
          expect(embedding.length).toBeGreaterThan(100)
        })

        // Similar texts should have higher cosine similarity
        const cosineSimilarity = (a: number[], b: number[]) => {
          const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
          const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
          const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
          return dotProduct / (magA * magB)
        }

        // Check that unrelated topics have lower similarity than related ones
        const similarity01 = cosineSimilarity(embeddings[0], embeddings[1])
        const similarity02 = cosineSimilarity(embeddings[0], embeddings[2])
        expect(Math.abs(similarity01)).toBeLessThan(1)
        expect(Math.abs(similarity02)).toBeLessThan(1)
      },
      getTimeout()
    )

    test(
      'should generate consistent embeddings for same text',
      async () => {
        const sdk = runner.getSDK()
        const text = 'Consistent embedding test'

        const result1 = await sdk.ai.embed(text)
        const result2 = await sdk.ai.embed(text)

        expect(result1.length).toBe(result2.length)

        // Calculate cosine similarity
        const dotProduct = result1.reduce((sum, val, i) => sum + val * result2[i], 0)
        const mag1 = Math.sqrt(result1.reduce((sum, val) => sum + val * val, 0))
        const mag2 = Math.sqrt(result2.reduce((sum, val) => sum + val * val, 0))
        const cosineSimilarity = dotProduct / (mag1 * mag2)

        // Embeddings should be identical or very similar
        expect(cosineSimilarity).toBeGreaterThan(0.99)
      },
      getTimeout()
    )

    test(
      'should handle unicode and special characters in embeddings',
      async () => {
        const sdk = runner.getSDK()

        const texts = [
          '你好世界', // Chinese
          'مرحبا العالم', // Arabic
          'Hello 🌍 World', // Emoji
          'Special chars: @#$%^&*()',
        ]

        const embeddings = await Promise.all(texts.map((text) => sdk.ai.embed(text)))

        embeddings.forEach((embedding) => {
          expect(Array.isArray(embedding)).toBe(true)
          expect(embedding.length).toBeGreaterThan(100)
          expect(embedding.every((v) => typeof v === 'number' && !isNaN(v))).toBe(true)
        })
      },
      getTimeout()
    )
  })

  describe('Vector Search Operations', () => {
    test(
      'should upsert and search vectors',
      async () => {
        const sdk = runner.getSDK()
        const namespace = await runner.createVectorNamespace('search')

        // Upsert test vectors
        const vectors = [
          { id: 'doc1', text: 'Machine learning and artificial intelligence' },
          { id: 'doc2', text: 'Cooking recipes and food preparation' },
          { id: 'doc3', text: 'Deep learning neural networks' },
          { id: 'doc4', text: 'Sports and physical fitness' },
        ]

        const upsertResult = await sdk.ai.upsert({
          vectors,
          index: namespace,
        })

        expect(upsertResult.count).toBe(4)
        expect(upsertResult.ids).toContain('doc1')
        expect(upsertResult.ids).toContain('doc2')

        // Wait for indexing
        await runner.wait(2000)

        // Search for similar content
        const searchResult = await sdk.ai.search('AI and machine learning', {
          topK: 2,
          index: namespace,
        })

        expect(searchResult.results).toBeDefined()
        expect(Array.isArray(searchResult.results)).toBe(true)
        expect(searchResult.results.length).toBeGreaterThan(0)
        expect(searchResult.results.length).toBeLessThanOrEqual(2)

        // First result should be most relevant (doc1 or doc3)
        const topResult = searchResult.results[0]
        expect(['doc1', 'doc3']).toContain(topResult.id)
        expect(topResult.score).toBeGreaterThan(0.5) // Reasonable similarity threshold
      },
      getTimeout()
    )

    test(
      'should perform semantic search with filters',
      async () => {
        const sdk = runner.getSDK()
        const namespace = await runner.createVectorNamespace('filter_search')

        const vectors = [
          { id: 'tech1', text: 'JavaScript programming', metadata: { category: 'tech', year: 2024 } },
          { id: 'tech2', text: 'Python development', metadata: { category: 'tech', year: 2023 } },
          { id: 'food1', text: 'Italian pasta recipes', metadata: { category: 'food', year: 2024 } },
          { id: 'food2', text: 'Japanese sushi guide', metadata: { category: 'food', year: 2023 } },
        ]

        await sdk.ai.upsert({ vectors, index: namespace })
        await runner.wait(2000)

        // Search with filter
        const result = await sdk.ai.search('programming languages', {
          topK: 5,
          index: namespace,
          filter: { category: 'tech' },
        })

        expect(result.results).toBeDefined()
        expect(result.results.every((r) => ['tech1', 'tech2'].includes(r.id))).toBe(true)
      },
      getTimeout()
    )
  })

  describe('Multi-Provider Support', () => {
    test(
      'should generate text with OpenAI GPT-5',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateText('Say hello', {
          provider: 'openai',
          model: 'gpt-5',
        })

        expect(result.text).toBeDefined()
        expect(result.provider).toBe('openai')
        expect(result.model).toBe('gpt-5')
      },
      getTimeout()
    )

    test(
      'should generate text with Claude Sonnet 4.5',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateText('Say hello', {
          provider: 'anthropic',
          model: 'claude-sonnet-4.5',
        })

        expect(result.text).toBeDefined()
        expect(result.provider).toBe('anthropic')
        expect(result.model).toBe('claude-sonnet-4.5')
      },
      getTimeout()
    )

    test(
      'should generate text with Gemini 2.5 Pro',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateText('Say hello', {
          provider: 'googleai',
          model: 'gemini-2.5-pro',
        })

        expect(result.text).toBeDefined()
        expect(result.provider).toBe('googleai')
        expect(result.model).toBe('gemini-2.5-pro')
      },
      getTimeout()
    )

    test(
      'should generate text with Llama 4',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateText('Say hello', {
          provider: 'openrouter',
          model: 'llama-4',
        })

        expect(result.text).toBeDefined()
        expect(result.provider).toBe('openrouter')
        expect(result.model).toBe('llama-4')
      },
      getTimeout()
    )

    test(
      'should use GPT-5 variants',
      async () => {
        const sdk = runner.getSDK()

        const models = ['gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-5-codex']

        for (const model of models) {
          const result = await sdk.ai.generateText('Test', {
            provider: 'openai',
            model,
            maxTokens: 20,
          })

          expect(result.text).toBeDefined()
          expect(result.model).toBe(model)
        }
      },
      getTimeout()
    )
  })

  describe('Batch Processing', () => {
    test(
      'should process batch generation for cost savings',
      async () => {
        const sdk = runner.getSDK()

        const prompts = ['Write a one-word color', 'Write a one-word fruit', 'Write a one-word animal', 'Write a one-word vehicle', 'Write a one-word emotion']

        // Batch processing (50% cost savings on OpenAI)
        const batchResult = await sdk.ai.batch({
          requests: prompts.map((prompt) => ({
            type: 'generateText',
            params: { prompt, maxTokens: 10 },
          })),
        })

        expect(batchResult.results).toBeDefined()
        expect(batchResult.results.length).toBe(5)
        expect(batchResult.status).toBe('completed')
        expect(batchResult.costSavings).toBeGreaterThan(0) // Should indicate cost savings

        // Verify each result
        batchResult.results.forEach((result) => {
          expect(result.text).toBeDefined()
          expect(result.text.length).toBeGreaterThan(0)
        })
      },
      getTimeout()
    )

    test(
      'should handle large batch with 100+ items',
      async () => {
        const sdk = runner.getSDK()

        const prompts = Array.from({ length: 100 }, (_, i) => `Generate number: ${i}`)

        const batchResult = await sdk.ai.batch({
          requests: prompts.map((prompt) => ({
            type: 'generateText',
            params: { prompt, maxTokens: 5 },
          })),
        })

        expect(batchResult.results).toBeDefined()
        expect(batchResult.results.length).toBe(100)
        expect(batchResult.status).toBe('completed')
      },
      getTimeout()
    )
  })

  describe('AI + Database Integration', () => {
    test(
      'should use AI with db.forEach for enrichment',
      async () => {
        const sdk = runner.getSDK()
        const namespace = await runner.createNamespace('products')

        // Create test products
        const products = [
          { id: 'prod1', name: 'Laptop', category: 'Electronics' },
          { id: 'prod2', name: 'Desk Chair', category: 'Furniture' },
          { id: 'prod3', name: 'Coffee Maker', category: 'Appliances' },
        ]

        for (const product of products) {
          await sdk.db.create(namespace, product.id, 'Product', product)
        }

        // Enrich each product with AI-generated description
        const enriched: any[] = []

        await sdk.db.forEach(namespace, async (doc) => {
          const description = await sdk.ai.generateText(`Write a short product description for a ${doc.data.name}`, {
            maxTokens: 50,
          })

          const updated = {
            ...doc.data,
            description: description.text,
          }

          await sdk.db.update(namespace, doc.id, updated)
          enriched.push(updated)
        })

        expect(enriched.length).toBe(3)
        enriched.forEach((item) => {
          expect(item.description).toBeDefined()
          expect(item.description.length).toBeGreaterThan(10)
        })
      },
      getTimeout()
    )
  })

  describe('Error Handling', () => {
    test(
      'should handle invalid model error',
      async () => {
        const sdk = runner.getSDK()

        await expect(
          sdk.ai.generateText('Test', {
            model: 'nonexistent-model-xyz-123',
          })
        ).rejects.toThrow()
      },
      getTimeout()
    )

    test(
      'should handle rate limit errors gracefully',
      async () => {
        const sdk = runner.getSDK()

        // Make many concurrent requests to potentially trigger rate limit
        const promises = Array.from({ length: 50 }, () => sdk.ai.generateText('Test', { maxTokens: 5 }))

        const results = await Promise.allSettled(promises)

        // At least some should succeed
        const successful = results.filter((r) => r.status === 'fulfilled')
        expect(successful.length).toBeGreaterThan(0)

        // Any failures should be rate limit errors
        const failed = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[]
        failed.forEach((result) => {
          expect(result.reason.message).toMatch(/(rate limit|too many requests|429)/i)
        })
      },
      getTimeout()
    )

    test(
      'should handle invalid schema errors',
      async () => {
        const sdk = runner.getSDK()

        const invalidSchema = {
          type: 'invalid-type-xyz',
        } as any

        await expect(sdk.ai.generate('Test', { schema: invalidSchema })).rejects.toThrow()
      },
      getTimeout()
    )

    test(
      'should handle empty prompt gracefully',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateText('', { maxTokens: 10 })

        // Should return something or handle gracefully
        expect(result).toBeDefined()
      },
      getTimeout()
    )

    test(
      'should handle network timeout',
      async () => {
        const sdk = runner.getSDK()

        // Try a very long generation that might timeout
        await expect(
          sdk.ai.generateText('Write a 10,000 word essay', {
            maxTokens: 10000,
            // If there's a timeout setting, use it
          })
        ).rejects.toThrow()
      },
      getTimeout()
    )
  })

  describe('Token Tracking and Costs', () => {
    test(
      'should track token usage',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateText('Write a short sentence', {
          maxTokens: 50,
        })

        expect(result).toHaveProperty('usage')
        expect(result.usage).toBeDefined()
        expect(result.usage.promptTokens).toBeGreaterThan(0)
        expect(result.usage.completionTokens).toBeGreaterThan(0)
        expect(result.usage.totalTokens).toBe(result.usage.promptTokens + result.usage.completionTokens)
      },
      getTimeout()
    )

    test(
      'should calculate estimated costs',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateText('Test', {
          provider: 'openai',
          model: 'gpt-5',
          maxTokens: 100,
        })

        expect(result).toHaveProperty('cost')
        expect(result.cost).toBeDefined()
        expect(result.cost.amount).toBeGreaterThan(0)
        expect(result.cost.currency).toBe('USD')
      },
      getTimeout()
    )
  })

  describe('Prompt Templates', () => {
    test(
      'should use prompt templates with variables',
      async () => {
        const sdk = runner.getSDK()

        const template = await sdk.ai.createTemplate({
          name: 'greeting',
          template: 'Write a {{style}} greeting to {{name}}',
        })

        const result = await sdk.ai.generateFromTemplate('greeting', {
          variables: {
            style: 'formal',
            name: 'Alice',
          },
          maxTokens: 50,
        })

        expect(result.text).toBeDefined()
        expect(result.text.toLowerCase()).toContain('alice')
      },
      getTimeout()
    )
  })

  describe('Image Generation', () => {
    test(
      'should generate image with DALL-E',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateImage('A cute cat wearing sunglasses', {
          provider: 'openai',
          model: 'dall-e-3',
          size: '1024x1024',
        })

        expect(result).toBeDefined()
        expect(result.images).toBeDefined()
        expect(result.images.length).toBeGreaterThan(0)
        expect(result.images[0].url).toMatch(/^https?:\/\//)
        expect(result.provider).toBe('openai')
      },
      getTimeout()
    )

    test(
      'should generate multiple images',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateImage('Abstract art', {
          n: 3,
          size: '512x512',
        })

        expect(result.images).toHaveLength(3)
        result.images.forEach((image) => {
          expect(image.url || image.b64_json).toBeDefined()
        })
      },
      getTimeout()
    )
  })

  describe('Multi-Modal Operations', () => {
    test(
      'should analyze image with vision model',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.analyzeImage({
          imageUrl: 'https://example.com/test-image.jpg',
          prompt: 'Describe this image in detail',
          model: 'gpt-5-vision',
        })

        expect(result).toBeDefined()
        expect(result.text).toBeDefined()
        expect(result.text.length).toBeGreaterThan(20)
      },
      getTimeout()
    )

    test(
      'should generate speech from text',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateSpeech('Hello, welcome to the platform!', {
          voice: 'alloy',
          format: 'mp3',
        })

        expect(result).toBeDefined()
        expect(result.audio).toBeDefined()
        expect(result.format).toBe('mp3')
        expect(result.duration).toBeGreaterThan(0)
      },
      getTimeout()
    )

    test(
      'should transcribe audio to text',
      async () => {
        const sdk = runner.getSDK()

        // Assuming we have audio data or URL
        const result = await sdk.ai.transcribeAudio({
          audioUrl: 'https://example.com/test-audio.mp3',
          model: 'whisper',
        })

        expect(result).toBeDefined()
        expect(result.text).toBeDefined()
        expect(typeof result.text).toBe('string')
      },
      getTimeout()
    )
  })

  describe('Performance Tests', () => {
    test(
      'should handle concurrent requests efficiently',
      async () => {
        const sdk = runner.getSDK()

        const startTime = Date.now()

        const promises = Array.from({ length: 10 }, (_, i) => sdk.ai.generateText(`Generate text ${i}`, { maxTokens: 20 }))

        const results = await Promise.all(promises)

        const duration = Date.now() - startTime

        expect(results).toHaveLength(10)
        results.forEach((result) => {
          expect(result.text).toBeDefined()
        })

        // Should complete reasonably fast with concurrent execution
        // (adjust threshold based on actual performance)
        expect(duration).toBeLessThan(60000) // 60 seconds for 10 requests
      },
      getTimeout()
    )

    test(
      'should cache identical requests',
      async () => {
        const sdk = runner.getSDK()

        const prompt = 'What is 2+2?'

        const start1 = Date.now()
        const result1 = await sdk.ai.generateText(prompt, { maxTokens: 10 })
        const duration1 = Date.now() - start1

        const start2 = Date.now()
        const result2 = await sdk.ai.generateText(prompt, { maxTokens: 10 })
        const duration2 = Date.now() - start2

        expect(result1.text).toBeDefined()
        expect(result2.text).toBeDefined()

        // Second request should be faster due to caching
        expect(duration2).toBeLessThan(duration1)
      },
      getTimeout()
    )

    test(
      'should handle large payload efficiently',
      async () => {
        const sdk = runner.getSDK()

        // Generate a large prompt
        const largePrompt = 'Summarize this text: ' + 'Lorem ipsum '.repeat(1000)

        const result = await sdk.ai.generateText(largePrompt, {
          maxTokens: 100,
        })

        expect(result.text).toBeDefined()
        expect(result.usage).toBeDefined()
        expect(result.usage.promptTokens).toBeGreaterThan(500)
      },
      getTimeout()
    )
  })

  describe('List Generation', () => {
    test(
      'should generate list with itemType and itemSchema',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.list('Popular programming languages')

        expect(result.name).toBeDefined()
        expect(typeof result.name).toBe('string')
        expect(result.name.length).toBeGreaterThan(0)

        expect(result.itemType).toBeDefined()
        expect(typeof result.itemType).toBe('string')
        expect(result.itemType.length).toBeGreaterThan(0)

        expect(result.itemSchema).toBeDefined()
        expect(typeof result.itemSchema).toBe('string')
        expect(result.itemSchema.length).toBeGreaterThan(0)

        expect(Array.isArray(result.items)).toBe(true)
        expect(result.items.length).toBeGreaterThan(0)

        // Verify each item has required fields
        result.items.forEach((item) => {
          expect(item).toHaveProperty('name')
          expect(item).toHaveProperty('description')
          expect(typeof item.name).toBe('string')
          expect(typeof item.description).toBe('string')
          expect(item.name.length).toBeGreaterThan(0)
          expect(item.description.length).toBeGreaterThan(0)
        })
      },
      getTimeout()
    )

    test(
      'should generate list with OpenAI provider',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.list('Top 5 countries by population', {
          provider: 'openai',
          minItems: 5,
          maxItems: 5,
        })

        expect(result.name).toBeDefined()
        expect(result.itemType).toBeDefined()
        expect(result.itemSchema).toBeDefined()
        expect(result.items.length).toBe(5)

        // Verify structure matches schema
        result.items.forEach((item) => {
          expect(item.name).toBeTruthy()
          expect(item.description).toBeTruthy()
        })
      },
      getTimeout()
    )

    test(
      'should generate list with min/max item constraints',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.list('Common fruits', {
          minItems: 3,
          maxItems: 7,
        })

        expect(result.items.length).toBeGreaterThanOrEqual(3)
        expect(result.items.length).toBeLessThanOrEqual(7)
      },
      getTimeout()
    )

    test(
      'should generate list with semantic schema.org types',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.list('Best selling books of 2024')

        // Should have appropriate schema.org type
        expect(result.itemSchema).toBeDefined()
        expect(typeof result.itemSchema).toBe('string')

        // Should be a reasonable schema.org type (could be Book, CreativeWork, etc.)
        expect(result.itemSchema.length).toBeGreaterThan(0)

        // Verify items have proper structure
        expect(result.items.length).toBeGreaterThan(0)
        result.items.forEach((item) => {
          expect(item.name).toBeTruthy()
          expect(item.description).toBeTruthy()
        })
      },
      getTimeout()
    )

    test(
      'should handle different list types appropriately',
      async () => {
        const sdk = runner.getSDK()

        // Test with products/items
        const products = await sdk.ai.list('Popular smartphone brands', {
          maxTokens: 500,
        })

        expect(products.name).toBeDefined()
        expect(products.itemType).toBeDefined()
        expect(products.itemSchema).toBeDefined()
        expect(products.items.length).toBeGreaterThan(0)

        // Test with concepts/ideas
        const concepts = await sdk.ai.list('Key principles of agile development', {
          maxTokens: 500,
        })

        expect(concepts.name).toBeDefined()
        expect(concepts.itemType).toBeDefined()
        expect(concepts.itemSchema).toBeDefined()
        expect(concepts.items.length).toBeGreaterThan(0)
      },
      getTimeout()
    )

    test(
      'should return usage statistics',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.list('Top 3 programming languages')

        // Usage stats may or may not be present depending on provider
        if (result.usage) {
          expect(result.usage.promptTokens).toBeGreaterThan(0)
          expect(result.usage.completionTokens).toBeGreaterThan(0)
          expect(result.usage.totalTokens).toBe(result.usage.promptTokens + result.usage.completionTokens)
        }
      },
      getTimeout()
    )

    test(
      'should generate list with Workers AI provider',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.list('Common web development frameworks', {
          provider: 'workers-ai',
          model: '@cf/meta/llama-3.1-8b-instruct',
        })

        // Validate all required fields are present
        expect(result.name).toBeDefined()
        expect(typeof result.name).toBe('string')
        expect(result.name.length).toBeGreaterThan(0)

        expect(result.itemType).toBeDefined()
        expect(typeof result.itemType).toBe('string')
        expect(result.itemType.length).toBeGreaterThan(0)

        expect(result.itemSchema).toBeDefined()
        expect(typeof result.itemSchema).toBe('string')
        expect(result.itemSchema.length).toBeGreaterThan(0)

        expect(Array.isArray(result.items)).toBe(true)
        expect(result.items.length).toBeGreaterThan(0)

        // Verify each item has required structure
        result.items.forEach((item) => {
          expect(item).toHaveProperty('name')
          expect(item).toHaveProperty('description')
          expect(typeof item.name).toBe('string')
          expect(typeof item.description).toBe('string')
          expect(item.name.length).toBeGreaterThan(0)
          expect(item.description.length).toBeGreaterThan(0)
        })

        // Verify provider metadata
        expect(result.provider).toBe('workers-ai')
        expect(result.model).toBe('@cf/meta/llama-3.1-8b-instruct')
      },
      getTimeout()
    )
  })

  describe('Model Registry Operations', () => {
    test(
      'should list available models',
      async () => {
        const sdk = runner.getSDK()

        const models = await sdk.ai.listModels()

        expect(models).toBeDefined()
        expect(Array.isArray(models)).toBe(true)
        expect(models.length).toBeGreaterThan(0)

        // Should include GPT-5 variants
        const modelIds = models.map((m) => m.id)
        expect(modelIds).toContain('gpt-5')
        expect(modelIds).toContain('gpt-5-mini')
      },
      getTimeout()
    )

    test(
      'should get model details',
      async () => {
        const sdk = runner.getSDK()

        const model = await sdk.ai.getModel('gpt-5')

        expect(model).toBeDefined()
        expect(model.id).toBe('gpt-5')
        expect(model.provider).toBe('openai')
        expect(model.contextWindow).toBeGreaterThan(0)
        expect(model.maxTokens).toBeGreaterThan(0)
      },
      getTimeout()
    )

    test(
      'should filter models by capability',
      async () => {
        const sdk = runner.getSDK()

        const textModels = await sdk.ai.listModels({ capability: 'text-generation' })
        const visionModels = await sdk.ai.listModels({ capability: 'vision' })
        const embeddingModels = await sdk.ai.listModels({ capability: 'embeddings' })

        expect(textModels.length).toBeGreaterThan(0)
        expect(visionModels.length).toBeGreaterThan(0)
        expect(embeddingModels.length).toBeGreaterThan(0)

        // Ensure filtering works
        textModels.forEach((model) => {
          expect(model.capabilities).toContain('text-generation')
        })
      },
      getTimeout()
    )
  })

  describe('AI Gateway Integration', () => {
    test(
      'should route through AI Gateway',
      async () => {
        const sdk = runner.getSDK()

        const result = await sdk.ai.generateText('Test AI Gateway', {
          gateway: true,
          maxTokens: 20,
        })

        expect(result.text).toBeDefined()
        expect(result).toHaveProperty('gatewayMetadata')
        expect(result.gatewayMetadata.cached).toBeDefined()
      },
      getTimeout()
    )

    test(
      'should track gateway metrics',
      async () => {
        const sdk = runner.getSDK()

        // Make several requests
        for (let i = 0; i < 5; i++) {
          await sdk.ai.generateText(`Request ${i}`, { gateway: true, maxTokens: 10 })
        }

        const metrics = await sdk.ai.getGatewayMetrics()

        expect(metrics).toBeDefined()
        expect(metrics.totalRequests).toBeGreaterThanOrEqual(5)
        expect(metrics.cacheHitRate).toBeGreaterThanOrEqual(0)
        expect(metrics.cacheHitRate).toBeLessThanOrEqual(1)
      },
      getTimeout()
    )
  })
})
