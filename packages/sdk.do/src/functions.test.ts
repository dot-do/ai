/**
 * Tests for Functions Service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FunctionsService, DeployedFunction, defineFunction } from './functions'
import type { BusinessContext } from './types'

// Mock fetch
global.fetch = vi.fn()

// Mock BusinessContext
const mockClient = {} as BusinessContext

describe('defineFunction', () => {
  it('should create a function definition', () => {
    const def = defineFunction({
      name: 'test-function',
      handler: async (event) => {
        return { success: true }
      },
      timeout: 10000,
      memory: 512,
      env: {
        API_KEY: 'test-key',
      },
    })

    expect(def.name).toBe('test-function')
    expect(def.timeout).toBe(10000)
    expect(def.memory).toBe(512)
    expect(def.env).toEqual({ API_KEY: 'test-key' })
    expect(typeof def.handler).toBe('function')
  })

  it('should use default values for optional fields', () => {
    const def = defineFunction({
      name: 'minimal-function',
      handler: async () => ({}),
    })

    expect(def.name).toBe('minimal-function')
    expect(def.timeout).toBeUndefined()
    expect(def.memory).toBeUndefined()
    expect(def.env).toBeUndefined()
  })
})

describe('FunctionsService', () => {
  let service: FunctionsService

  beforeEach(() => {
    service = new FunctionsService(mockClient)
    vi.clearAllMocks()
  })

  describe('deploy', () => {
    it('should deploy a function successfully', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          function: {
            id: 'fn-123',
            name: 'process-payment',
            code: 'async (event) => ({ success: true })',
            language: 'typescript',
            runtime: 'workers',
            timeout: 30000,
            memory: 256,
            createdAt: '2025-10-11T00:00:00Z',
            updatedAt: '2025-10-11T00:00:00Z',
          },
        }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const handler = async (event: any) => ({ success: true })
      const func = await service.deploy('process-payment', handler, {
        timeout: 30000,
        memory: 256,
      })

      expect(func).toBeInstanceOf(DeployedFunction)
      expect(global.fetch).toHaveBeenCalledWith('https://functions.do/functions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"name":"process-payment"'),
      })
    })

    it('should throw error on deployment failure', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        text: async () => 'Invalid function code',
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const handler = async () => ({})
      await expect(service.deploy('bad-function', handler)).rejects.toThrow('Function deployment failed: 400 Invalid function code')
    })

    it('should include environment variables in deployment', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ function: { id: 'fn-123', name: 'test' } }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await service.deploy('test', async () => ({}), {
        env: {
          API_KEY: 'secret',
          DATABASE_URL: 'postgres://...',
        },
      })

      const callBody = JSON.parse((global.fetch as any).mock.calls[0][1].body)
      expect(callBody.environment).toEqual({
        API_KEY: 'secret',
        DATABASE_URL: 'postgres://...',
      })
    })
  })

  describe('execute', () => {
    it('should execute a function by name', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          result: { amount: 1000, currency: 'usd', status: 'success' },
        }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const result = await service.execute('process-payment', {
        amount: 1000,
        currency: 'usd',
      })

      expect(result).toEqual({ amount: 1000, currency: 'usd', status: 'success' })
      expect(global.fetch).toHaveBeenCalledWith('https://functions.do/functions/process-payment/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"amount":1000'),
      })
    })

    it('should throw error on execution failure', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: async () => 'Internal server error',
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await expect(service.execute('failing-function')).rejects.toThrow('Function execution failed: 500 Internal server error')
    })
  })

  describe('list', () => {
    it('should list all functions', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          functions: [
            {
              id: 'fn-1',
              name: 'process-payment',
              language: 'typescript',
              runtime: 'workers',
              createdAt: '2025-10-11T00:00:00Z',
              updatedAt: '2025-10-11T00:00:00Z',
            },
            {
              id: 'fn-2',
              name: 'send-email',
              language: 'typescript',
              runtime: 'workers',
              createdAt: '2025-10-11T00:00:00Z',
              updatedAt: '2025-10-11T00:00:00Z',
            },
          ],
        }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const functions = await service.list()

      expect(functions).toHaveLength(2)
      expect(functions[0].name).toBe('process-payment')
      expect(functions[1].name).toBe('send-email')
    })

    it('should support pagination options', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ functions: [] }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await service.list({ limit: 10, offset: 20 })

      expect(global.fetch).toHaveBeenCalledWith('https://functions.do/functions?limit=10&offset=20', {
        method: 'GET',
      })
    })

    it('should filter by runtime', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ functions: [] }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await service.list({ runtime: 'durable-object' })

      expect(global.fetch).toHaveBeenCalledWith('https://functions.do/functions?runtime=durable-object', {
        method: 'GET',
      })
    })
  })

  describe('get', () => {
    it('should get a function by name', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          function: {
            id: 'fn-123',
            name: 'process-payment',
            language: 'typescript',
            runtime: 'workers',
            createdAt: '2025-10-11T00:00:00Z',
            updatedAt: '2025-10-11T00:00:00Z',
          },
        }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const func = await service.get('process-payment')

      expect(func).toBeInstanceOf(DeployedFunction)
      expect(global.fetch).toHaveBeenCalledWith('https://functions.do/functions/process-payment', {
        method: 'GET',
      })
    })

    it('should throw error if function not found', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await expect(service.get('non-existent')).rejects.toThrow('Failed to get function metadata: 404')
    })
  })

  describe('delete', () => {
    it('should delete a function by name', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await service.delete('process-payment')

      expect(global.fetch).toHaveBeenCalledWith('https://functions.do/functions/process-payment', {
        method: 'DELETE',
      })
    })

    it('should throw error on delete failure', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await expect(service.delete('process-payment')).rejects.toThrow('Failed to delete function: 500')
    })
  })

  describe('schedule', () => {
    it('should schedule a function with cron', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await service.schedule('process-payment', {
        cron: '0 0 * * *',
        timezone: 'America/New_York',
      })

      expect(global.fetch).toHaveBeenCalledWith('https://functions.do/functions/process-payment/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"cron":"0 0 * * *"'),
      })
    })

    it('should throw error on schedule failure', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await expect(
        service.schedule('process-payment', {
          cron: 'invalid cron',
        })
      ).rejects.toThrow('Failed to schedule function: 400')
    })
  })

  describe('logs', () => {
    it('should retrieve function logs', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          logs: [
            {
              timestamp: '2025-10-11T12:00:00Z',
              level: 'info',
              message: 'Function started',
            },
            {
              timestamp: '2025-10-11T12:00:01Z',
              level: 'info',
              message: 'Function completed',
            },
          ],
        }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const logs = await service.logs('process-payment', { limit: 100 })

      expect(logs).toHaveLength(2)
      expect(logs[0].message).toBe('Function started')
      expect(logs[1].message).toBe('Function completed')
    })

    it('should support log filtering options', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ logs: [] }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await service.logs('process-payment', {
        limit: 50,
        level: 'error',
        startDate: '2025-10-11T00:00:00Z',
        endDate: '2025-10-11T23:59:59Z',
      })

      const url = (global.fetch as any).mock.calls[0][0]
      expect(url).toContain('limit=50')
      expect(url).toContain('level=error')
      expect(url).toContain('startDate=2025-10-11T00%3A00%3A00Z')
      expect(url).toContain('endDate=2025-10-11T23%3A59%3A59Z')
    })
  })
})

describe('DeployedFunction', () => {
  let func: DeployedFunction

  beforeEach(() => {
    func = new DeployedFunction('test-function', mockClient, 'https://functions.do/functions')
    vi.clearAllMocks()
  })

  describe('execute', () => {
    it('should execute the function with parameters', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          result: { status: 'success' },
        }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const result = await func.execute({ input: 'test' })

      expect(result).toEqual({ status: 'success' })
      expect(global.fetch).toHaveBeenCalledWith('https://functions.do/functions/test-function/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"input":"test"'),
      })
    })

    it('should handle execution errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: async () => 'Execution failed',
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await expect(func.execute()).rejects.toThrow('Function execution failed: 500 Execution failed')
    })
  })

  describe('getMetadata', () => {
    it('should retrieve function metadata', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          function: {
            id: 'fn-123',
            name: 'test-function',
            language: 'typescript',
            runtime: 'workers',
            timeout: 30000,
            memory: 256,
            createdAt: '2025-10-11T00:00:00Z',
            updatedAt: '2025-10-11T00:00:00Z',
          },
        }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const metadata = await func.getMetadata()

      expect(metadata.name).toBe('test-function')
      expect(metadata.timeout).toBe(30000)
      expect(metadata.memory).toBe(256)
    })
  })

  describe('delete', () => {
    it('should delete the function', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await func.delete()

      expect(global.fetch).toHaveBeenCalledWith('https://functions.do/functions/test-function', {
        method: 'DELETE',
      })
    })
  })

  describe('schedule', () => {
    it('should schedule the function', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await func.schedule({
        cron: '0 0 * * *',
        timezone: 'UTC',
        description: 'Daily at midnight',
      })

      expect(global.fetch).toHaveBeenCalledWith('https://functions.do/functions/test-function/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"cron":"0 0 * * *"'),
      })
    })
  })

  describe('logs', () => {
    it('should retrieve function logs', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          logs: [
            {
              timestamp: '2025-10-11T12:00:00Z',
              level: 'info',
              message: 'Log entry',
            },
          ],
        }),
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const logs = await func.logs({ limit: 10 })

      expect(logs).toHaveLength(1)
      expect(logs[0].message).toBe('Log entry')
    })
  })
})
