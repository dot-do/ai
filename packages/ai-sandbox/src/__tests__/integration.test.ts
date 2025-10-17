/**
 * Integration tests for ai-sandbox
 *
 * Tests the full worker lifecycle and execution flow
 *
 * NOTE: These tests use a MockLoaderFetcher rather than a real Cloudflare Worker Loader.
 * This approach allows for comprehensive testing of the API contract, error handling,
 * and lifecycle management without requiring a full Cloudflare Workers environment.
 * For true end-to-end integration tests with actual worker execution, use Wrangler's
 * unstable_dev() in a separate test suite.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createWorker, executeWorker, getWorker, listWorkers, deleteWorker, executeInSandbox } from '../loader'
import type { CreateWorkerRequest, SandboxExecuteRequest } from '../types'

/**
 * Worker information returned by the mock loader
 */
interface WorkerInfo {
  id: string
  params: any
  created: string
  status: string
}

/**
 * Mock Fetcher for testing
 * In production, this would be the actual LOADER binding
 */
class MockLoaderFetcher implements Fetcher {
  private workers: Map<string, any> = new Map()

  async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const request = new Request(input, init)
    const url = new URL(request.url)

    // Handle worker creation
    if (url.pathname === '/workers' && request.method === 'POST') {
      const body = await request.json()
      const id = body.id || crypto.randomUUID()
      this.workers.set(id, body)
      return Response.json({ id, created: new Date().toISOString() })
    }

    // Handle worker listing
    if (url.pathname === '/workers' && request.method === 'GET') {
      const workerList = Array.from(this.workers.entries()).map(([id, params]) => ({
        id,
        params,
        created: new Date().toISOString(),
        status: 'active',
      }))
      return Response.json(workerList)
    }

    // Handle worker operations
    const workerMatch = url.pathname.match(/^\/workers\/([^/]+)$/)
    if (workerMatch) {
      const workerId = workerMatch[1]

      if (request.method === 'GET') {
        const worker = this.workers.get(workerId)
        if (!worker) {
          return Response.json({ error: 'Worker not found' }, { status: 404 })
        }
        return Response.json({
          id: workerId,
          params: worker,
          created: new Date().toISOString(),
          status: 'active',
        })
      }

      if (request.method === 'DELETE') {
        if (!this.workers.has(workerId)) {
          return Response.json({ error: 'Worker not found' }, { status: 404 })
        }
        this.workers.delete(workerId)
        return Response.json({ success: true })
      }

      // Execute on worker
      if (request.method === 'POST') {
        const worker = this.workers.get(workerId)
        if (!worker) {
          return Response.json({ error: 'Worker not found' }, { status: 404 })
        }
        // Mock execution - return success
        return Response.json({
          result: 42,
          console: [['log', 'test']],
        })
      }
    }

    return Response.json({ error: 'Not found' }, { status: 404 })
  }
}

describe('Integration Tests', () => {
  let mockLoader: MockLoaderFetcher

  beforeAll(() => {
    mockLoader = new MockLoaderFetcher()
  })

  afterAll(async () => {
    // Cleanup - delete all test workers
    const workers = await listWorkers(mockLoader)
    const workerList = (await workers.json()) as WorkerInfo[]
    for (const worker of workerList) {
      await deleteWorker(worker.id, mockLoader)
    }
  })

  describe('Worker Lifecycle', () => {
    it('should create a worker', async () => {
      const request: CreateWorkerRequest = {
        script: 'export default { async fetch() { return new Response("Hello") } }',
      }

      const response = await createWorker(request, mockLoader)
      expect(response.ok).toBe(true)

      const data = await response.json()
      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('created')
    })

    it('should list workers', async () => {
      // Create a worker first
      await createWorker(
        {
          script: 'export default { async fetch() { return new Response("Test") } }',
        },
        mockLoader
      )

      const response = await listWorkers(mockLoader)
      expect(response.ok).toBe(true)

      const workers = await response.json()
      expect(Array.isArray(workers)).toBe(true)
      expect(workers.length).toBeGreaterThan(0)
    })

    it('should get worker information', async () => {
      // Create a worker
      const createResponse = await createWorker(
        {
          script: 'export default { async fetch() { return new Response("Info") } }',
        },
        mockLoader
      )
      const { id } = await createResponse.json()

      // Get worker info
      const response = await getWorker(id, mockLoader)
      expect(response.ok).toBe(true)

      const worker = await response.json()
      expect(worker.id).toBe(id)
      expect(worker).toHaveProperty('params')
      expect(worker).toHaveProperty('status')
    })

    it('should execute on worker', async () => {
      // Create a worker
      const createResponse = await createWorker(
        {
          script: 'export default { async fetch() { return new Response("Execute") } }',
        },
        mockLoader
      )
      const { id } = await createResponse.json()

      // Execute on worker
      const request = new Request('http://test.local/execute')
      const response = await executeWorker(id, request, mockLoader)
      expect(response.ok).toBe(true)

      const result = await response.json()
      expect(result).toHaveProperty('result')
    })

    it('should delete worker', async () => {
      // Create a worker
      const createResponse = await createWorker(
        {
          script: 'export default { async fetch() { return new Response("Delete") } }',
        },
        mockLoader
      )
      const { id } = await createResponse.json()

      // Delete worker
      const deleteResponse = await deleteWorker(id, mockLoader)
      expect(deleteResponse.ok).toBe(true)

      // Verify worker is gone
      const getResponse = await getWorker(id, mockLoader)
      expect(getResponse.status).toBe(404)
    })
  })

  describe('Code Execution', () => {
    it('should execute simple code', async () => {
      const request: SandboxExecuteRequest = {
        script: 'return 2 + 2',
      }

      const response = await executeInSandbox(request, mockLoader)
      expect(response).toHaveProperty('result')
      expect(response).not.toHaveProperty('error')
    })

    it('should execute code with console capture', async () => {
      const request: SandboxExecuteRequest = {
        script: 'console.log("test"); return 42',
        captureConsole: true,
      }

      const response = await executeInSandbox(request, mockLoader)
      expect(response).toHaveProperty('result')
      expect(response).toHaveProperty('console')
    })

    it('should execute code without console capture', async () => {
      const request: SandboxExecuteRequest = {
        script: 'console.log("test"); return 42',
        captureConsole: false,
      }

      const response = await executeInSandbox(request, mockLoader)
      expect(response).toHaveProperty('result')
      expect(response).not.toHaveProperty('console')
    })

    it('should execute async code', async () => {
      const request: SandboxExecuteRequest = {
        script: 'await Promise.resolve(42)',
      }

      const response = await executeInSandbox(request, mockLoader)
      expect(response).toHaveProperty('result')
      expect(response.result).toBe(42)
    })

    it('should handle errors gracefully', async () => {
      const request: SandboxExecuteRequest = {
        script: 'throw new Error("Test error")',
      }

      const response = await executeInSandbox(request, mockLoader)
      expect(response).toHaveProperty('error')
      expect(response.error).toContain('Test error')
    })

    it('should validate input before execution', async () => {
      const request: SandboxExecuteRequest = {
        script: '', // Empty script
      }

      await expect(async () => {
        await executeInSandbox(request, mockLoader)
      }).rejects.toThrow('Script cannot be empty')
    })
  })

  describe('Error Handling', () => {
    it('should return 404 for non-existent worker', async () => {
      const response = await getWorker('non-existent-id', mockLoader)
      expect(response.status).toBe(404)
    })

    it('should return 404 when deleting non-existent worker', async () => {
      const response = await deleteWorker('non-existent-id', mockLoader)
      expect(response.status).toBe(404)
    })

    it('should return 404 when executing on non-existent worker', async () => {
      const request = new Request('http://test.local/execute')
      const response = await executeWorker('non-existent-id', request, mockLoader)
      expect(response.status).toBe(404)
    })
  })
})
