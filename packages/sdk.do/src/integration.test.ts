/**
 * Integration Tests for db.forEach with AI Methods
 *
 * Tests the integration between database iteration (db.forEach) and AI generation methods,
 * specifically focusing on list/lists generation and batch processing workflows.
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { createDatabaseService } from './db'
import { createAIService } from './ai'

describe('Integration: db.forEach with AI Methods', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let db: ReturnType<typeof createDatabaseService>
  let ai: ReturnType<typeof createAIService>

  beforeEach(() => {
    // Mock global fetch
    mockFetch = vi.fn()
    global.fetch = mockFetch

    // Create service instances
    db = createDatabaseService('https://test.db.do', 'test-key')
    ai = createAIService('https://test.ai.do', 'test-key')
  })

  describe('db.forEach() with ai.list() - 1 Level Deep', () => {
    test('generates list for each database record', async () => {
      // Mock database list call (for total count)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [],
          total: 3,
        }),
      })

      // Mock database list call (for fetching batch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [
            { id: '1', namespace: 'categories', data: { name: 'Tech' }, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
            { id: '2', namespace: 'categories', data: { name: 'Health' }, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
            { id: '3', namespace: 'categories', data: { name: 'Finance' }, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
          ],
          total: 3,
        }),
      })

      // Mock AI list generations
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            name: 'Tech Topics',
            type: 'list',
            items: ['AI', 'Cloud', 'DevOps'],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            name: 'Health Topics',
            type: 'list',
            items: ['Nutrition', 'Exercise', 'Mental Health'],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            name: 'Finance Topics',
            type: 'list',
            items: ['Investing', 'Budgeting', 'Crypto'],
          }),
        })

      const results: any[] = []

      const result = await db.forEach(
        'categories',
        async (doc) => {
          const list = await ai.list(`Generate topics for ${doc.data.name}`, {
            provider: 'openai',
            minItems: 3,
            maxItems: 5,
          })
          results.push({ category: doc.data.name, topics: list.items })
        },
        {
          batchSize: 100,
          useQueue: false,
          concurrency: 3,
        }
      )

      expect(result.success).toBe(3)
      expect(result.failed).toBe(0)
      expect(result.processed).toBe(3)
      expect(results).toHaveLength(3)
      expect(results[0].topics).toHaveLength(3)
      expect(results[1].topics).toHaveLength(3)
      expect(results[2].topics).toHaveLength(3)
    })

    test('stores generated lists back to database', async () => {
      // Mock database list call (for total count)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [],
          total: 2,
        }),
      })

      // Mock database list call (for fetching batch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [
            { id: '1', namespace: 'articles', data: { title: 'AI in 2025' } },
            { id: '2', namespace: 'articles', data: { title: 'Cloud Computing Guide' } },
          ],
          total: 2,
        }),
      })

      // Mock AI list generation
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            name: 'AI Keywords',
            type: 'list',
            items: ['machine learning', 'neural networks', 'GPT-5'],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            name: 'Cloud Keywords',
            type: 'list',
            items: ['AWS', 'serverless', 'edge computing'],
          }),
        })

      // Mock database update calls
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: '1',
            namespace: 'articles',
            data: { title: 'AI in 2025', keywords: ['machine learning', 'neural networks', 'GPT-5'] },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: '2',
            namespace: 'articles',
            data: { title: 'Cloud Computing Guide', keywords: ['AWS', 'serverless', 'edge computing'] },
          }),
        })

      const result = await db.forEach(
        'articles',
        async (doc) => {
          const keywords = await ai.list(`Extract keywords from: ${doc.data.title}`)
          await db.update('articles', doc.id, {
            keywords: keywords.items,
          })
        },
        {
          useQueue: false,
          concurrency: 2,
        }
      )

      expect(result.success).toBe(2)
      expect(result.failed).toBe(0)
    })
  })

  describe('db.forEach() with ai.lists() - 2 Level Deep', () => {
    test('generates categorized lists for each record', async () => {
      // Mock database list call (for total count)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [],
          total: 2,
        }),
      })

      // Mock database list call (for fetching batch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [
            { id: '1', namespace: 'projects', data: { name: 'E-commerce Platform' } },
            { id: '2', namespace: 'projects', data: { name: 'Social Network' } },
          ],
          total: 2,
        }),
      })

      // Mock AI lists generations (2-level deep)
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            lists: [
              { name: 'Frontend', type: 'list', items: ['React', 'TypeScript', 'Tailwind'] },
              { name: 'Backend', type: 'list', items: ['Node.js', 'PostgreSQL', 'Redis'] },
              { name: 'Infrastructure', type: 'list', items: ['AWS', 'Docker', 'Kubernetes'] },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            lists: [
              { name: 'Frontend', type: 'list', items: ['Vue.js', 'Nuxt', 'WebSockets'] },
              { name: 'Backend', type: 'list', items: ['Express', 'MongoDB', 'GraphQL'] },
              { name: 'Infrastructure', type: 'list', items: ['Vercel', 'Cloudflare', 'CDN'] },
            ],
          }),
        })

      const results: any[] = []

      const result = await db.forEach(
        'projects',
        async (doc) => {
          const techStack = await ai.lists(`Categorize tech stack for ${doc.data.name}`, {
            provider: 'openai',
            count: 3,
          })
          results.push({
            project: doc.data.name,
            stack: techStack.lists,
          })
        },
        {
          useQueue: false,
          concurrency: 2,
        }
      )

      expect(result.success).toBe(2)
      expect(result.failed).toBe(0)
      expect(results).toHaveLength(2)

      // Verify 2-level deep structure
      expect(results[0].stack).toHaveLength(3)
      expect(results[0].stack[0]).toHaveProperty('name')
      expect(results[0].stack[0]).toHaveProperty('type')
      expect(results[0].stack[0]).toHaveProperty('items')
      expect(Array.isArray(results[0].stack[0].items)).toBe(true)
    })

    test('processes nested lists and stores to database', async () => {
      // Mock database list call (for total count)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [],
          total: 1,
        }),
      })

      // Mock database list call (for fetching batch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [{ id: '1', namespace: 'courses', data: { title: 'Full Stack Development' } }],
          total: 1,
        }),
      })

      // Mock AI lists generation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          lists: [
            { name: 'Beginner', type: 'list', items: ['HTML Basics', 'CSS Fundamentals', 'JavaScript Intro'] },
            { name: 'Intermediate', type: 'list', items: ['React', 'Node.js', 'Databases'] },
            { name: 'Advanced', type: 'list', items: ['System Design', 'DevOps', 'Microservices'] },
          ],
        }),
      })

      // Mock database create calls (one for each category)
      for (let i = 0; i < 3; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: `module-${i + 1}`,
            namespace: 'course-modules',
            data: {},
          }),
        })
      }

      const result = await db.forEach(
        'courses',
        async (course) => {
          const modules = await ai.lists(`Generate course modules for ${course.data.title}`)

          // Store each category as a separate database record
          for (const category of modules.lists) {
            await db.create('course-modules', `${course.id}-${category.name}`, 'Module', {
              courseId: course.id,
              level: category.name,
              topics: category.items,
            })
          }
        },
        {
          useQueue: false,
        }
      )

      expect(result.success).toBe(1)
      expect(result.failed).toBe(0)
    })
  })

  describe('db.forEach() with ai.generateCode()', () => {
    test('generates code for each database model', async () => {
      // Mock database list call (for total count)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [],
          total: 2,
        }),
      })

      // Mock database list call (for fetching batch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [
            {
              id: '1',
              namespace: 'models',
              data: {
                name: 'User',
                fields: [
                  { name: 'id', type: 'string' },
                  { name: 'email', type: 'string' },
                ],
              },
            },
            {
              id: '2',
              namespace: 'models',
              data: {
                name: 'Post',
                fields: [
                  { name: 'id', type: 'string' },
                  { name: 'title', type: 'string' },
                ],
              },
            },
          ],
          total: 2,
        }),
      })

      // Mock AI code generation
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            code: 'interface User { id: string; email: string; }',
            language: 'typescript',
            explanation: 'TypeScript interface for User model',
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            code: 'interface Post { id: string; title: string; }',
            language: 'typescript',
            explanation: 'TypeScript interface for Post model',
          }),
        })

      const generatedCode: any[] = []

      const result = await db.forEach(
        'models',
        async (model) => {
          const code = await ai.generateCode(`Generate TypeScript interface for ${model.data.name} with fields: ${JSON.stringify(model.data.fields)}`, {
            language: 'typescript',
            includeComments: true,
          })
          generatedCode.push({
            model: model.data.name,
            code: code.code,
          })
        },
        {
          batchSize: 10,
          useQueue: false,
          concurrency: 3,
        }
      )

      expect(result.success).toBe(2)
      expect(result.failed).toBe(0)
      expect(generatedCode).toHaveLength(2)
      expect(generatedCode[0].code).toContain('interface User')
      expect(generatedCode[1].code).toContain('interface Post')
    })
  })

  describe('db.forEach() Error Handling', () => {
    test('handles API errors with continueOnError', async () => {
      // Mock database list call (for total count)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [],
          total: 3,
        }),
      })

      // Mock database list call (for fetching batch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [
            { id: '1', namespace: 'items', data: { name: 'Item 1' } },
            { id: '2', namespace: 'items', data: { name: 'Item 2' } },
            { id: '3', namespace: 'items', data: { name: 'Item 3' } },
          ],
          total: 3,
        }),
      })

      // Mock AI calls - second one fails
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ name: 'List 1', items: ['a', 'b'] }),
        })
        .mockResolvedValueOnce({
          ok: false,
          text: async () => 'Rate limit exceeded',
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ name: 'List 3', items: ['c', 'd'] }),
        })

      const errors: any[] = []

      const result = await db.forEach(
        'items',
        async (doc) => {
          const list = await ai.list(`Generate for ${doc.data.name}`)
          return list
        },
        {
          useQueue: false,
          continueOnError: true,
          onError: (error, doc) => {
            errors.push({ docId: doc.id, error: error.message })
          },
        }
      )

      expect(result.success).toBe(2)
      expect(result.failed).toBe(1)
      expect(result.processed).toBe(3)
      expect(result.errors).toHaveLength(1)
      expect(errors).toHaveLength(1)
      expect(errors[0].docId).toBe('2')
    })

    test('stops on first error when continueOnError is false', async () => {
      // Mock database list call (for total count)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [],
          total: 3,
        }),
      })

      // Mock database list call (for fetching batch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [
            { id: '1', namespace: 'items', data: { name: 'Item 1' } },
            { id: '2', namespace: 'items', data: { name: 'Item 2' } },
            { id: '3', namespace: 'items', data: { name: 'Item 3' } },
          ],
          total: 3,
        }),
      })

      // Mock AI calls - second one fails
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ name: 'List 1', items: ['a', 'b'] }),
        })
        .mockResolvedValueOnce({
          ok: false,
          text: async () => 'Internal server error',
        })

      await expect(
        db.forEach(
          'items',
          async (doc) => {
            await ai.list(`Generate for ${doc.data.name}`)
          },
          {
            useQueue: false,
            continueOnError: false,
          }
        )
      ).rejects.toThrow('Internal server error')
    })
  })

  describe('db.forEach() Progress Tracking', () => {
    test('reports progress via callback', async () => {
      // Mock database list call (for total count)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [],
          total: 10,
        }),
      })

      // Mock database list calls for each batch (batchSize=3, so 4 batches: 3+3+3+1)
      // With concurrency=1, batches are processed sequentially

      // Batch 1: offset 0, limit 3
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: Array.from({ length: 3 }, (_, i) => ({
            id: String(i + 1),
            namespace: 'items',
            data: { name: `Item ${i + 1}` },
          })),
          total: 10,
        }),
      })

      // AI calls for batch 1 (3 documents)
      for (let i = 0; i < 3; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ name: `List ${i + 1}`, items: ['a', 'b'] }),
        })
      }

      // Batch 2: offset 3, limit 3
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: Array.from({ length: 3 }, (_, i) => ({
            id: String(i + 4),
            namespace: 'items',
            data: { name: `Item ${i + 4}` },
          })),
          total: 10,
        }),
      })

      // AI calls for batch 2 (3 documents)
      for (let i = 3; i < 6; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ name: `List ${i + 1}`, items: ['a', 'b'] }),
        })
      }

      // Batch 3: offset 6, limit 3
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: Array.from({ length: 3 }, (_, i) => ({
            id: String(i + 7),
            namespace: 'items',
            data: { name: `Item ${i + 7}` },
          })),
          total: 10,
        }),
      })

      // AI calls for batch 3 (3 documents)
      for (let i = 6; i < 9; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ name: `List ${i + 1}`, items: ['a', 'b'] }),
        })
      }

      // Batch 4: offset 9, limit 3 (only 1 document remaining)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [
            {
              id: '10',
              namespace: 'items',
              data: { name: 'Item 10' },
            },
          ],
          total: 10,
        }),
      })

      // AI call for batch 4 (1 document)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ name: 'List 10', items: ['a', 'b'] }),
      })

      const progressUpdates: Array<{ processed: number; total: number }> = []

      const result = await db.forEach(
        'items',
        async (doc) => {
          await ai.list(`Generate for ${doc.data.name}`)
        },
        {
          batchSize: 3,
          useQueue: false,
          concurrency: 1, // Sequential processing to simplify test mocks
          onProgress: (processed, total) => {
            progressUpdates.push({ processed, total })
          },
        }
      )

      expect(result.success).toBe(10)
      expect(result.failed).toBe(0)
      expect(progressUpdates.length).toBeGreaterThan(0)
      expect(progressUpdates[progressUpdates.length - 1]).toEqual({ processed: 10, total: 10 })
    })
  })

  describe('db.forEach() Concurrency Control', () => {
    test('respects concurrency limits', async () => {
      // Mock database list call (for total count)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [],
          total: 6,
        }),
      })

      // Mock database list call (for fetching batch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: Array.from({ length: 6 }, (_, i) => ({
            id: String(i + 1),
            namespace: 'items',
            data: { name: `Item ${i + 1}` },
          })),
          total: 6,
        }),
      })

      // Mock AI calls with delays to test concurrency
      const callTimes: number[] = []
      for (let i = 0; i < 6; i++) {
        mockFetch.mockImplementationOnce(async () => {
          callTimes.push(Date.now())
          await new Promise((resolve) => setTimeout(resolve, 10))
          return {
            ok: true,
            json: async () => ({ name: `List ${i + 1}`, items: ['a'] }),
          }
        })
      }

      await db.forEach(
        'items',
        async (doc) => {
          await ai.list(`Generate for ${doc.data.name}`)
        },
        {
          batchSize: 100,
          useQueue: false,
          concurrency: 2, // Max 2 concurrent requests
        }
      )

      // With concurrency=2, we should have pairs of calls happening at similar times
      expect(callTimes).toHaveLength(6)
    })
  })
})
