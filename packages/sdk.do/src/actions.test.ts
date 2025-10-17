/**
 * Tests for Actions Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  defineAction,
  createActionsService,
  actions,
  ActionsService,
  type Action,
  type ActionDefinition,
  type ActionContext,
  type ActionResult,
} from './actions'
import type { BusinessContext } from './types'

// Mock BusinessContext
const mockContext: Partial<BusinessContext> = {
  db: {
    get: vi.fn(),
    list: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
    query: vi.fn(),
    search: vi.fn(),
  },
  events: {
    publish: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    history: vi.fn(),
    stream: vi.fn(),
    batchPublish: vi.fn(),
    getDLQ: vi.fn(),
    replayDLQ: vi.fn(),
    clearDLQ: vi.fn(),
    metrics: vi.fn(),
  },
}

describe('Actions Service', () => {
  describe('defineAction', () => {
    it('should define a simple action', () => {
      const action = defineAction({
        name: 'test-action',
        description: 'A test action',
        handler: async () => ({ success: true }),
      })

      expect(action).toBeDefined()
      expect(action.definition.name).toBe('test-action')
      expect(action.definition.description).toBe('A test action')
    })

    it('should validate action name format', () => {
      expect(() =>
        defineAction({
          name: 'Invalid Name',
          description: 'Invalid',
          handler: async () => ({}),
        })
      ).toThrow('kebab-case')

      expect(() =>
        defineAction({
          name: 'invalid_name',
          description: 'Invalid',
          handler: async () => ({}),
        })
      ).toThrow('kebab-case')
    })

    it('should accept valid kebab-case names', () => {
      const action = defineAction({
        name: 'valid-action-name-123',
        description: 'Valid',
        handler: async () => ({}),
      })

      expect(action.definition.name).toBe('valid-action-name-123')
    })
  })

  describe('Action execution', () => {
    it('should execute a simple action', async () => {
      const action = defineAction({
        name: 'simple-test',
        description: 'Simple test',
        handler: async (params: { value: number }) => ({ result: params.value * 2 }),
      })

      const result = await action.execute({ value: 5 })

      expect(result.status).toBe('success')
      expect(result.result).toEqual({ result: 10 })
      expect(result.action).toBe('simple-test')
      expect(result.id).toBeDefined()
      expect(result.metadata.duration).toBeGreaterThanOrEqual(0)
    })

    it('should handle action errors', async () => {
      const action = defineAction({
        name: 'error-test',
        description: 'Error test',
        handler: async () => {
          throw new Error('Test error')
        },
      })

      const result = await action.execute({})

      expect(result.status).toBe('error')
      expect(result.error?.message).toBe('Test error')
      expect(result.result).toBeUndefined()
    })

    it('should enforce timeout', async () => {
      const action = defineAction({
        name: 'timeout-test',
        description: 'Timeout test',
        timeout: 100,
        handler: async () => {
          await new Promise((resolve) => setTimeout(resolve, 200))
          return { success: true }
        },
      })

      const result = await action.execute({})

      expect(result.status).toBe('timeout')
      expect(result.error?.message).toBe('Action timeout')
    })

    it('should track execution metadata', async () => {
      const action = defineAction({
        name: 'metadata-test',
        description: 'Metadata test',
        handler: async () => {
          await new Promise((resolve) => setTimeout(resolve, 50))
          return { success: true }
        },
      })

      const result = await action.execute({})

      expect(result.metadata.startTime).toBeDefined()
      expect(result.metadata.endTime).toBeDefined()
      expect(result.metadata.duration).toBeGreaterThanOrEqual(50)
      expect(result.metadata.attempts).toBe(1)
    })
  })

  describe('Parameter validation', () => {
    it('should validate required parameters', async () => {
      const action = defineAction({
        name: 'required-params',
        description: 'Required params test',
        parameters: {
          name: { type: 'string', required: true },
          age: { type: 'number', required: true },
        },
        handler: async (params) => params,
      })

      const result = await action.execute({ name: 'John' } as any)

      expect(result.status).toBe('error')
      expect(result.error?.message).toContain('required')
    })

    it('should validate parameter types', async () => {
      const action = defineAction({
        name: 'type-validation',
        description: 'Type validation test',
        parameters: {
          count: { type: 'number', required: true },
        },
        handler: async (params) => params,
      })

      const result = await action.execute({ count: 'not-a-number' } as any)

      expect(result.status).toBe('error')
      expect(result.error?.message).toContain('type')
    })

    it('should apply default values', async () => {
      const action = defineAction({
        name: 'defaults-test',
        description: 'Defaults test',
        parameters: {
          name: { type: 'string', default: 'World' },
        },
        handler: async (params: { name: string }) => ({ greeting: `Hello ${params.name}` }),
      })

      const result = await action.execute({})

      expect(result.status).toBe('success')
      expect(result.result).toEqual({ greeting: 'Hello World' })
    })

    it('should run custom validation', async () => {
      const action = defineAction({
        name: 'custom-validation',
        description: 'Custom validation test',
        parameters: {
          email: {
            type: 'string',
            required: true,
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          },
        },
        handler: async (params) => params,
      })

      const result = await action.execute({ email: 'invalid-email' })

      expect(result.status).toBe('error')
      expect(result.error?.message).toContain('validation')
    })

    it('should validate array types', async () => {
      const action = defineAction({
        name: 'array-type',
        description: 'Array type test',
        parameters: {
          items: { type: 'array', required: true },
        },
        handler: async (params) => params,
      })

      const validResult = await action.execute({ items: [1, 2, 3] })
      expect(validResult.status).toBe('success')

      const invalidResult = await action.execute({ items: 'not-an-array' } as any)
      expect(invalidResult.status).toBe('error')
    })
  })

  describe('Retry logic', () => {
    it('should retry failed actions', async () => {
      let attempts = 0
      const action = defineAction({
        name: 'retry-test',
        description: 'Retry test',
        retry: {
          max: 3,
          delay: 10,
          backoff: 'fixed',
        },
        handler: async () => {
          attempts++
          if (attempts < 3) {
            throw new Error('Temporary failure')
          }
          return { success: true }
        },
      })

      const result = await action.execute({})

      expect(result.status).toBe('success')
      expect(attempts).toBe(3)
      expect(result.metadata.attempts).toBe(3)
    })

    it('should respect max retry attempts', async () => {
      let attempts = 0
      const action = defineAction({
        name: 'max-retries',
        description: 'Max retries test',
        retry: {
          max: 2,
          delay: 10,
        },
        handler: async () => {
          attempts++
          throw new Error('Always fails')
        },
      })

      const result = await action.execute({})

      expect(result.status).toBe('error')
      expect(attempts).toBe(2)
    })

    it('should use exponential backoff', async () => {
      const delays: number[] = []
      let lastTime = Date.now()
      let firstCall = true

      const action = defineAction({
        name: 'exponential-backoff',
        description: 'Exponential backoff test',
        retry: {
          max: 3,
          delay: 10,
          backoff: 'exponential',
        },
        handler: async () => {
          const now = Date.now()
          if (firstCall) {
            firstCall = false
          } else {
            delays.push(now - lastTime)
          }
          lastTime = now
          throw new Error('Test')
        },
      })

      await action.execute({})

      // Exponential backoff: 10ms, 20ms (approximately)
      expect(delays.length).toBeGreaterThanOrEqual(2)
      if (delays.length >= 2) {
        expect(delays[1]).toBeGreaterThan(delays[0])
      }
    })
  })

  describe('ActionsService', () => {
    let service: ActionsService

    beforeEach(() => {
      service = createActionsService(mockContext as BusinessContext)
    })

    it('should register and retrieve actions', () => {
      const action = defineAction({
        name: 'custom-action',
        description: 'Custom action',
        handler: async () => ({}),
      })

      service.register(action)

      const retrieved = service.get('custom-action')
      expect(retrieved).toBe(action)
    })

    it('should list all registered actions', () => {
      const action1 = defineAction({
        name: 'action-1',
        description: 'Action 1',
        handler: async () => ({}),
      })

      const action2 = defineAction({
        name: 'action-2',
        description: 'Action 2',
        handler: async () => ({}),
      })

      service.register(action1)
      service.register(action2)

      const actions = service.list()
      expect(actions.length).toBeGreaterThanOrEqual(2)
    })

    it('should find actions by tag', () => {
      const action1 = defineAction({
        name: 'tagged-1',
        description: 'Tagged 1',
        tags: ['test', 'demo'],
        handler: async () => ({}),
      })

      const action2 = defineAction({
        name: 'tagged-2',
        description: 'Tagged 2',
        tags: ['test'],
        handler: async () => ({}),
      })

      service.register(action1)
      service.register(action2)

      const testActions = service.findByTag('test')
      expect(testActions.length).toBeGreaterThanOrEqual(2)

      const demoActions = service.findByTag('demo')
      expect(demoActions.length).toBeGreaterThanOrEqual(1)
    })

    it('should execute registered actions by name', async () => {
      const action = defineAction({
        name: 'execute-by-name',
        description: 'Execute by name',
        handler: async (params: { value: number }) => ({ doubled: params.value * 2 }),
      })

      service.register(action)

      const result = await service.execute('execute-by-name', { value: 10 })

      expect(result.status).toBe('success')
      expect(result.result).toEqual({ doubled: 20 })
    })

    it('should throw error for unknown action', async () => {
      await expect(service.execute('unknown-action', {})).rejects.toThrow('not found')
    })
  })

  describe('Built-in actions', () => {
    let service: ActionsService

    beforeEach(() => {
      vi.clearAllMocks()
      service = createActionsService(mockContext as BusinessContext)
    })

    it('should execute email send action', async () => {
      const publishMock = mockContext.events!.publish as any
      publishMock.mockResolvedValue(undefined)

      const result = await service.email.send({
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test email',
      })

      expect(result.status).toBe('success')
      expect(publishMock).toHaveBeenCalledWith('email.send', {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test email',
      })
    })

    it('should execute database get action', async () => {
      const getMock = mockContext.db!.get as any
      getMock.mockResolvedValue({ id: 'user-123', name: 'John' })

      const result = await service.database.get('users', 'user-123')

      expect(result.status).toBe('success')
      expect(getMock).toHaveBeenCalledWith('users', 'user-123')
    })

    it('should execute database upsert action', async () => {
      const upsertMock = mockContext.db!.upsert as any
      upsertMock.mockResolvedValue({ id: 'user-123', name: 'Jane' })

      const result = await service.database.upsert('users', 'user-123', { name: 'Jane' })

      expect(result.status).toBe('success')
      expect(upsertMock).toHaveBeenCalledWith('users', 'user-123', { name: 'Jane' })
    })

    it('should execute database delete action', async () => {
      const deleteMock = mockContext.db!.delete as any
      deleteMock.mockResolvedValue(undefined)

      const result = await service.database.delete('users', 'user-123')

      expect(result.status).toBe('success')
      expect(deleteMock).toHaveBeenCalledWith('users', 'user-123')
    })

    it('should execute HTTP GET action', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: async () => ({ data: 'test' }),
      })

      const result = await service.http.get('https://api.example.com/data')

      expect(result.status).toBe('success')
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data', {
        method: 'GET',
        headers: undefined,
      })
    })

    it('should execute HTTP POST action', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: async () => ({ success: true }),
      })

      const result = await service.http.post('https://api.example.com/data', { key: 'value' })

      expect(result.status).toBe('success')
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'value' }),
      })
    })

    it('should execute transform map action', async () => {
      const result = await service.transform.map([1, 2, 3], (x: number) => x * 2)

      expect(result.status).toBe('success')
      expect(result.result).toEqual([2, 4, 6])
    })

    it('should execute transform filter action', async () => {
      const result = await service.transform.filter([1, 2, 3, 4, 5], (x: number) => x > 2)

      expect(result.status).toBe('success')
      expect(result.result).toEqual([3, 4, 5])
    })

    it('should execute transform reduce action', async () => {
      const result = await service.transform.reduce([1, 2, 3, 4], (acc: number, x: number) => acc + x, 0)

      expect(result.status).toBe('success')
      expect(result.result).toBe(10)
    })

    it('should execute delay wait action', async () => {
      const start = Date.now()
      const result = await service.delay.wait(50)
      const duration = Date.now() - start

      expect(result.status).toBe('success')
      expect(duration).toBeGreaterThanOrEqual(45) // Allow 5ms tolerance
    })

    it('should execute event publish action', async () => {
      const publishMock = mockContext.events!.publish as any
      publishMock.mockResolvedValue(undefined)

      const result = await service.events.publish('order.created', { orderId: '123' })

      expect(result.status).toBe('success')
      expect(publishMock).toHaveBeenCalledWith('order.created', { orderId: '123' })
    })
  })

  describe('Action composition', () => {
    let service: ActionsService

    beforeEach(() => {
      service = createActionsService(mockContext as BusinessContext)
    })

    it('should compose actions into a pipeline', async () => {
      const action1 = defineAction({
        name: 'add-one',
        description: 'Add one',
        handler: async (value: number) => value + 1,
      })

      const action2 = defineAction({
        name: 'multiply-two',
        description: 'Multiply by two',
        handler: async (value: number) => value * 2,
      })

      const pipeline = service.compose([action1, action2])
      const result = await pipeline.execute(5)

      expect(result.status).toBe('success')
      expect(result.result).toBe(12) // (5 + 1) * 2
    })

    it('should stop pipeline on error', async () => {
      const action1 = defineAction({
        name: 'succeeds',
        description: 'Succeeds',
        handler: async (value: number) => value + 1,
      })

      const action2 = defineAction({
        name: 'fails',
        description: 'Fails',
        handler: async () => {
          throw new Error('Pipeline error')
        },
      })

      const action3 = defineAction({
        name: 'should-not-run',
        description: 'Should not run',
        handler: async (value: number) => value * 2,
      })

      const pipeline = service.compose([action1, action2, action3])
      const result = await pipeline.execute(5)

      expect(result.status).toBe('error')
      expect(result.error?.message).toBe('Pipeline error')
    })

    it('should execute actions in parallel', async () => {
      const action1 = defineAction({
        name: 'parallel-1',
        description: 'Parallel 1',
        handler: async () => {
          await new Promise((resolve) => setTimeout(resolve, 50))
          return 'result1'
        },
      })

      const action2 = defineAction({
        name: 'parallel-2',
        description: 'Parallel 2',
        handler: async () => {
          await new Promise((resolve) => setTimeout(resolve, 50))
          return 'result2'
        },
      })

      const start = Date.now()
      const parallel = service.parallel([
        { action: action1, params: {} },
        { action: action2, params: {} },
      ])
      const result = await parallel.execute({})
      const duration = Date.now() - start

      expect(result.status).toBe('success')
      expect(result.result).toEqual(['result1', 'result2'])
      // Should take ~50ms (parallel) not ~100ms (sequential)
      expect(duration).toBeLessThan(100)
    })

    it('should fail parallel execution if any action fails', async () => {
      const action1 = defineAction({
        name: 'succeeds',
        description: 'Succeeds',
        handler: async () => 'success',
      })

      const action2 = defineAction({
        name: 'fails',
        description: 'Fails',
        handler: async () => {
          throw new Error('Parallel failure')
        },
      })

      const parallel = service.parallel([
        { action: action1, params: {} },
        { action: action2, params: {} },
      ])
      const result = await parallel.execute({})

      expect(result.status).toBe('error')
    })

    it('should execute conditional actions (if)', async () => {
      const trueAction = defineAction({
        name: 'true-action',
        description: 'True action',
        handler: async () => 'true-result',
      })

      const falseAction = defineAction({
        name: 'false-action',
        description: 'False action',
        handler: async () => 'false-result',
      })

      const conditionalTrue = service.if(() => true, trueAction, falseAction)
      const resultTrue = await conditionalTrue.execute({})

      expect(resultTrue.status).toBe('success')
      expect(resultTrue.result).toBe('true-result')

      const conditionalFalse = service.if(() => false, trueAction, falseAction)
      const resultFalse = await conditionalFalse.execute({})

      expect(resultFalse.status).toBe('success')
      expect(resultFalse.result).toBe('false-result')
    })

    it('should support async conditions', async () => {
      const trueAction = defineAction({
        name: 'async-true',
        description: 'Async true',
        handler: async () => 'async-true-result',
      })

      const conditional = service.if(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return true
      }, trueAction)

      const result = await conditional.execute({})

      expect(result.status).toBe('success')
      expect(result.result).toBe('async-true-result')
    })

    it('should execute switch-case actions', async () => {
      const caseA = defineAction({
        name: 'case-a',
        description: 'Case A',
        handler: async () => 'result-a',
      })

      const caseB = defineAction({
        name: 'case-b',
        description: 'Case B',
        handler: async () => 'result-b',
      })

      const defaultAction = defineAction({
        name: 'default',
        description: 'Default',
        handler: async () => 'result-default',
      })

      const switchAction = service.switch((input: { type: string }) => input.type, { a: caseA, b: caseB }, defaultAction)

      const resultA = await switchAction.execute({ type: 'a' })
      expect(resultA.result).toBe('result-a')

      const resultB = await switchAction.execute({ type: 'b' })
      expect(resultB.result).toBe('result-b')

      const resultDefault = await switchAction.execute({ type: 'c' })
      expect(resultDefault.result).toBe('result-default')
    })
  })

  describe('Standalone action helpers', () => {
    it('should use standalone compose', async () => {
      const action1 = defineAction({
        name: 'standalone-1',
        description: 'Standalone 1',
        handler: async (x: number) => x + 1,
      })

      const action2 = defineAction({
        name: 'standalone-2',
        description: 'Standalone 2',
        handler: async (x: number) => x * 2,
      })

      const pipeline = actions.compose([action1, action2])
      const result = await pipeline.execute(5)

      expect(result.status).toBe('success')
      expect(result.result).toBe(12)
    })

    it('should use standalone parallel', async () => {
      const action1 = defineAction({
        name: 'standalone-parallel-1',
        description: 'Standalone parallel 1',
        handler: async () => 'a',
      })

      const action2 = defineAction({
        name: 'standalone-parallel-2',
        description: 'Standalone parallel 2',
        handler: async () => 'b',
      })

      const parallel = actions.parallel([
        { action: action1, params: {} },
        { action: action2, params: {} },
      ])
      const result = await parallel.execute({})

      expect(result.status).toBe('success')
      expect(result.result).toEqual(['a', 'b'])
    })

    it('should use standalone if', async () => {
      const trueAction = defineAction({
        name: 'standalone-true',
        description: 'Standalone true',
        handler: async () => 'true',
      })

      const conditional = actions.if(() => true, trueAction)
      const result = await conditional.execute({})

      expect(result.status).toBe('success')
      expect(result.result).toBe('true')
    })

    it('should use standalone switch', async () => {
      const caseX = defineAction({
        name: 'standalone-case-x',
        description: 'Standalone case x',
        handler: async () => 'x',
      })

      const switchAction = actions.switch((input: { key: string }) => input.key, { x: caseX })
      const result = await switchAction.execute({ key: 'x' })

      expect(result.status).toBe('success')
      expect(result.result).toBe('x')
    })

    it('should use standalone database actions', async () => {
      const getAction = actions.database.get('users', 'user-123')
      expect(getAction.definition.name).toContain('database-get')
    })

    it('should use standalone http actions', async () => {
      const getAction = actions.http.get('https://api.example.com')
      expect(getAction.definition.name).toContain('http-get')
    })

    it('should use standalone transform actions', async () => {
      const mapAction = actions.transform.map((x: number) => x * 2)
      const result = await mapAction.execute([1, 2, 3])

      expect(result.status).toBe('success')
      expect(result.result).toEqual([2, 4, 6])
    })
  })

  describe('Action metadata', () => {
    it('should retrieve action metadata', () => {
      const action = defineAction({
        name: 'metadata-action',
        description: 'Action with metadata',
        parameters: {
          name: { type: 'string', required: true },
          age: { type: 'number' },
        },
        tags: ['test', 'metadata'],
        handler: async () => ({}),
      })

      const metadata = action.getMetadata()

      expect(metadata.name).toBe('metadata-action')
      expect(metadata.description).toBe('Action with metadata')
      expect(metadata.parameters).toHaveProperty('name')
      expect(metadata.parameters).toHaveProperty('age')
      expect(metadata.tags).toEqual(['test', 'metadata'])
    })
  })

  describe('Error handling', () => {
    it('should handle synchronous errors', async () => {
      const action = defineAction({
        name: 'sync-error',
        description: 'Sync error',
        handler: () => {
          throw new Error('Sync error')
        },
      })

      const result = await action.execute({})

      expect(result.status).toBe('error')
      expect(result.error?.message).toBe('Sync error')
    })

    it('should handle async errors', async () => {
      const action = defineAction({
        name: 'async-error',
        description: 'Async error',
        handler: async () => {
          throw new Error('Async error')
        },
      })

      const result = await action.execute({})

      expect(result.status).toBe('error')
      expect(result.error?.message).toBe('Async error')
    })

    it('should include error stack traces', async () => {
      const action = defineAction({
        name: 'stack-trace',
        description: 'Stack trace',
        handler: async () => {
          throw new Error('Error with stack')
        },
      })

      const result = await action.execute({})

      expect(result.status).toBe('error')
      expect(result.error?.stack).toBeDefined()
    })
  })
})
