/**
 * Tests for Batch Service
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { BatchService, createBatchService } from './batch'
import type { BatchRequest, BatchResponse, BatchResult, BatchValidationResult, BatchCapabilities } from './batch'

describe('BatchService', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let service: BatchService

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    service = new BatchService('https://test.batch.do', 'test-api-key')
  })

  describe('constructor', () => {
    test('creates service with default baseUrl', () => {
      const defaultService = new BatchService()
      expect(defaultService).toBeInstanceOf(BatchService)
    })

    test('creates service with custom baseUrl and apiKey', () => {
      expect(service).toBeInstanceOf(BatchService)
    })
  })

  describe('execute()', () => {
    test('executes batch requests', async () => {
      const mockResult: BatchResult = {
        responses: [
          {
            id: 'req1',
            status: 200,
            statusText: 'OK',
            headers: {},
            body: { data: 'result1' },
            duration: 50,
          },
          {
            id: 'req2',
            status: 200,
            statusText: 'OK',
            headers: {},
            body: { data: 'result2' },
            duration: 75,
          },
        ],
        summary: {
          total: 2,
          successful: 2,
          failed: 0,
          duration: 125,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await service.execute({
        requests: [
          { id: 'req1', method: 'GET', path: '/v1/users' },
          { id: 'req2', method: 'GET', path: '/v1/media' },
        ],
      })

      expect(mockFetch).toHaveBeenCalledWith('https://test.batch.do/v1/batch/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: JSON.stringify({
          requests: [
            { id: 'req1', method: 'GET', path: '/v1/users' },
            { id: 'req2', method: 'GET', path: '/v1/media' },
          ],
        }),
      })

      expect(result.summary.total).toBe(2)
      expect(result.summary.successful).toBe(2)
      expect(result.responses).toHaveLength(2)
    })

    test('executes batch with sequential option', async () => {
      const mockResult: BatchResult = {
        responses: [
          { id: 'req1', status: 200, statusText: 'OK', headers: {}, body: {}, duration: 50 },
          { id: 'req2', status: 200, statusText: 'OK', headers: {}, body: {}, duration: 50 },
        ],
        summary: {
          total: 2,
          successful: 2,
          failed: 0,
          duration: 100,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await service.execute({
        requests: [
          { id: 'req1', method: 'GET', path: '/v1/users' },
          { id: 'req2', method: 'GET', path: '/v1/media' },
        ],
        sequential: true,
      })

      expect(result.summary.total).toBe(2)
    })

    test('executes batch with stopOnError option', async () => {
      const mockResult: BatchResult = {
        responses: [{ id: 'req1', status: 500, statusText: 'Error', headers: {}, body: {}, duration: 50, error: { type: 'ServerError', message: 'Failed' } }],
        summary: {
          total: 2,
          successful: 0,
          failed: 1,
          duration: 50,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await service.execute({
        requests: [
          { id: 'req1', method: 'GET', path: '/v1/invalid' },
          { id: 'req2', method: 'GET', path: '/v1/media' },
        ],
        stopOnError: true,
      })

      expect(result.summary.failed).toBe(1)
    })

    test('executes batch with dependencies', async () => {
      const mockResult: BatchResult = {
        responses: [
          { id: 'createUser', status: 201, statusText: 'Created', headers: {}, body: { id: 'user_123' }, duration: 100 },
          { id: 'updateUser', status: 200, statusText: 'OK', headers: {}, body: { id: 'user_123', updated: true }, duration: 50 },
        ],
        summary: {
          total: 2,
          successful: 2,
          failed: 0,
          duration: 150,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await service.execute({
        requests: [
          { id: 'createUser', method: 'POST', path: '/v1/users', body: { name: 'John' } },
          { id: 'updateUser', method: 'PUT', path: '/v1/users/user_123', body: { name: 'Jane' }, dependsOn: ['createUser'] },
        ],
      })

      expect(result.responses[0].id).toBe('createUser')
      expect(result.responses[1].id).toBe('updateUser')
    })

    test('throws error on batch execution failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid batch request',
      })

      await expect(
        service.execute({
          requests: [],
        })
      ).rejects.toThrow('Batch execution failed: Invalid batch request')
    })
  })

  describe('validate()', () => {
    test('validates batch requests', async () => {
      const mockValidation: BatchValidationResult = {
        valid: true,
        summary: {
          totalRequests: 2,
          uniqueIds: 2,
          withDependencies: 1,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockValidation,
      })

      const result = await service.validate({
        requests: [
          { id: 'req1', method: 'GET', path: '/v1/users' },
          { id: 'req2', method: 'GET', path: '/v1/media', dependsOn: ['req1'] },
        ],
      })

      expect(result.valid).toBe(true)
      expect(result.summary?.totalRequests).toBe(2)
      expect(result.summary?.withDependencies).toBe(1)
    })

    test('validates batch with issues', async () => {
      const mockValidation: BatchValidationResult = {
        valid: false,
        issues: ['Duplicate request ID: req1', 'Circular dependency detected'],
        errors: { circularDependency: ['req1', 'req2'] },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockValidation,
      })

      const result = await service.validate({
        requests: [
          { id: 'req1', method: 'GET', path: '/v1/users', dependsOn: ['req2'] },
          { id: 'req2', method: 'GET', path: '/v1/media', dependsOn: ['req1'] },
        ],
      })

      expect(result.valid).toBe(false)
      expect(result.issues).toHaveLength(2)
    })

    test('throws error on validation failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(
        service.validate({
          requests: [],
        })
      ).rejects.toThrow('Batch validation failed: Internal Server Error')
    })
  })

  describe('getCapabilities()', () => {
    test('retrieves batch capabilities', async () => {
      const mockCapabilities: BatchCapabilities = {
        capabilities: {
          maxRequestsPerBatch: 100,
          supportedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          parallelExecution: true,
          sequentialExecution: true,
          dependencyManagement: true,
          stopOnError: true,
        },
        features: ['Parallel execution', 'Sequential execution', 'Dependency management', 'Error handling'],
        limits: {
          maxRequestsPerBatch: 100,
          maxRequestBodySize: '1MB',
          maxResponseBodySize: '10MB',
          maxBatchDuration: '60s',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCapabilities,
      })

      const result = await service.getCapabilities()

      expect(result.capabilities.maxRequestsPerBatch).toBe(100)
      expect(result.features).toContain('Parallel execution')
      expect(result.limits.maxRequestBodySize).toBe('1MB')
    })

    test('throws error on capabilities fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(service.getCapabilities()).rejects.toThrow('Failed to get batch capabilities: Internal Server Error')
    })
  })

  describe('createRequest()', () => {
    test('creates a batch request', () => {
      const request = service.createRequest('req1', 'GET', '/v1/users')

      expect(request.id).toBe('req1')
      expect(request.method).toBe('GET')
      expect(request.path).toBe('/v1/users')
    })

    test('creates a batch request with options', () => {
      const request = service.createRequest('req1', 'POST', '/v1/users', {
        headers: { 'X-Custom': 'value' },
        body: { name: 'John' },
        dependsOn: ['req0'],
      })

      expect(request.headers).toEqual({ 'X-Custom': 'value' })
      expect(request.body).toEqual({ name: 'John' })
      expect(request.dependsOn).toEqual(['req0'])
    })
  })

  describe('getAll()', () => {
    test('executes batch GET requests', async () => {
      const mockResult: BatchResult = {
        responses: [
          { id: 'get_0', status: 200, statusText: 'OK', headers: {}, body: { data: 'users' }, duration: 50 },
          { id: 'get_1', status: 200, statusText: 'OK', headers: {}, body: { data: 'media' }, duration: 50 },
          { id: 'get_2', status: 200, statusText: 'OK', headers: {}, body: { data: 'events' }, duration: 50 },
        ],
        summary: {
          total: 3,
          successful: 3,
          failed: 0,
          duration: 150,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const result = await service.getAll(['/v1/users', '/v1/media', '/v1/events'])

      expect(result.summary.total).toBe(3)
      expect(result.responses[0].id).toBe('get_0')
      expect(result.responses[1].id).toBe('get_1')
      expect(result.responses[2].id).toBe('get_2')
    })
  })

  describe('isAllSuccessful()', () => {
    test('returns true when all requests succeed', () => {
      const result: BatchResult = {
        responses: [
          { id: 'req1', status: 200, statusText: 'OK', headers: {}, body: {}, duration: 50 },
          { id: 'req2', status: 201, statusText: 'Created', headers: {}, body: {}, duration: 50 },
        ],
        summary: {
          total: 2,
          successful: 2,
          failed: 0,
          duration: 100,
        },
      }

      expect(service.isAllSuccessful(result)).toBe(true)
    })

    test('returns false when any request fails', () => {
      const result: BatchResult = {
        responses: [
          { id: 'req1', status: 200, statusText: 'OK', headers: {}, body: {}, duration: 50 },
          { id: 'req2', status: 500, statusText: 'Error', headers: {}, body: {}, duration: 50 },
        ],
        summary: {
          total: 2,
          successful: 1,
          failed: 1,
          duration: 100,
        },
      }

      expect(service.isAllSuccessful(result)).toBe(false)
    })
  })

  describe('getSuccessful()', () => {
    test('filters successful responses', () => {
      const result: BatchResult = {
        responses: [
          { id: 'req1', status: 200, statusText: 'OK', headers: {}, body: {}, duration: 50 },
          { id: 'req2', status: 500, statusText: 'Error', headers: {}, body: {}, duration: 50 },
          { id: 'req3', status: 201, statusText: 'Created', headers: {}, body: {}, duration: 50 },
        ],
        summary: {
          total: 3,
          successful: 2,
          failed: 1,
          duration: 150,
        },
      }

      const successful = service.getSuccessful(result)

      expect(successful).toHaveLength(2)
      expect(successful[0].id).toBe('req1')
      expect(successful[1].id).toBe('req3')
    })
  })

  describe('getFailed()', () => {
    test('filters failed responses', () => {
      const result: BatchResult = {
        responses: [
          { id: 'req1', status: 200, statusText: 'OK', headers: {}, body: {}, duration: 50 },
          { id: 'req2', status: 500, statusText: 'Error', headers: {}, body: {}, duration: 50 },
          { id: 'req3', status: 404, statusText: 'Not Found', headers: {}, body: {}, duration: 50 },
        ],
        summary: {
          total: 3,
          successful: 1,
          failed: 2,
          duration: 150,
        },
      }

      const failed = service.getFailed(result)

      expect(failed).toHaveLength(2)
      expect(failed[0].id).toBe('req2')
      expect(failed[1].id).toBe('req3')
    })
  })

  describe('createBatchService', () => {
    test('creates service instance with factory function', () => {
      const factoryService = createBatchService('https://test.do', 'test-key')
      expect(factoryService).toBeInstanceOf(BatchService)
    })
  })
})
