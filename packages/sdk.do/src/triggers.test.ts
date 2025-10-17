/**
 * Tests for Triggers Service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  defineTrigger,
  createTriggersService,
  triggers,
  Trigger,
  TriggersService,
  type TriggerDefinition,
  type RegisteredTrigger,
  type TriggerEvent,
  type TriggerExecutionResult,
  type TriggerMetrics,
} from './triggers'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch as any

describe('Triggers Service', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('defineTrigger', () => {
    it('should create a trigger instance', () => {
      const trigger = defineTrigger({
        name: 'test-trigger',
        description: 'Test trigger',
        event: 'user.created',
        action: async (event) => {
          console.log('Action executed', event)
        },
      })

      expect(trigger).toBeInstanceOf(Trigger)
      expect(trigger.getDefinition().name).toBe('test-trigger')
      expect(trigger.getId()).toBeUndefined()
    })

    it('should create trigger with default config', () => {
      const trigger = defineTrigger({
        name: 'test',
        event: 'test.event',
        action: async () => {},
      })

      const definition = trigger.getDefinition()
      expect(definition.enabled).toBeUndefined() // Will default to true on registration
      expect(definition.priority).toBeUndefined() // Will default to 'normal' on registration
    })

    it('should create trigger with custom config', () => {
      const trigger = defineTrigger(
        {
          name: 'test',
          event: 'test.event',
          action: async () => {},
          priority: 'high',
          enabled: false,
        },
        {
          apiUrl: 'https://custom.do',
          apiKey: 'test-key',
        }
      )

      const definition = trigger.getDefinition()
      expect(definition.priority).toBe('high')
      expect(definition.enabled).toBe(false)
    })

    it('should create trigger with condition', () => {
      const condition = vi.fn(async (event: TriggerEvent) => event.payload.value > 100)

      const trigger = defineTrigger({
        name: 'conditional-trigger',
        event: 'order.created',
        condition,
        action: async () => {},
      })

      expect(trigger.getDefinition().condition).toBe(condition)
    })

    it('should create trigger with retry config', () => {
      const trigger = defineTrigger({
        name: 'retry-trigger',
        event: 'test.event',
        action: async () => {},
        retry: {
          max: 5,
          backoff: 'exponential',
          delay: 2000,
          maxDelay: 120000,
        },
      })

      const definition = trigger.getDefinition()
      expect(definition.retry?.max).toBe(5)
      expect(definition.retry?.backoff).toBe('exponential')
      expect(definition.retry?.delay).toBe(2000)
      expect(definition.retry?.maxDelay).toBe(120000)
    })
  })

  describe('Trigger registration', () => {
    it('should register a trigger', async () => {
      const mockResponse: RegisteredTrigger = {
        id: 'trigger-123',
        name: 'test-trigger',
        description: 'Test trigger',
        pattern: 'user.created',
        status: 'active',
        priority: 'normal',
        executionCount: 0,
        successCount: 0,
        failureCount: 0,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const trigger = defineTrigger({
        name: 'test-trigger',
        event: 'user.created',
        action: async () => {},
      })

      const result = await trigger.register()

      expect(result).toEqual(mockResponse)
      expect(trigger.getId()).toBe('trigger-123')
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/register'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('"name":"test-trigger"'),
        })
      )
    })

    it('should throw error on registration failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid trigger definition',
      })

      const trigger = defineTrigger({
        name: 'invalid-trigger',
        event: 'test.event',
        action: async () => {},
      })

      await expect(trigger.register()).rejects.toThrow('Failed to register trigger: 400 Invalid trigger definition')
    })

    it('should register trigger with authentication', async () => {
      const mockResponse: RegisteredTrigger = {
        id: 'trigger-123',
        name: 'test-trigger',
        pattern: 'user.created',
        status: 'active',
        priority: 'normal',
        executionCount: 0,
        successCount: 0,
        failureCount: 0,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const trigger = defineTrigger(
        {
          name: 'test-trigger',
          event: 'user.created',
          action: async () => {},
        },
        {
          apiKey: 'test-api-key',
        }
      )

      await trigger.register()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        })
      )
    })
  })

  describe('Trigger unregistration', () => {
    it('should unregister a trigger', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'trigger-123',
          name: 'test',
          pattern: 'test',
          status: 'active',
          priority: 'normal',
          executionCount: 0,
          successCount: 0,
          failureCount: 0,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        }),
      })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const trigger = defineTrigger({
        name: 'test-trigger',
        event: 'user.created',
        action: async () => {},
      })

      await trigger.register()
      await trigger.unregister()

      expect(trigger.getId()).toBeUndefined()
      expect(mockFetch).toHaveBeenLastCalledWith(expect.stringContaining('/triggers/trigger-123'), expect.objectContaining({ method: 'DELETE' }))
    })

    it('should throw error when unregistering non-registered trigger', async () => {
      const trigger = defineTrigger({
        name: 'test-trigger',
        event: 'user.created',
        action: async () => {},
      })

      await expect(trigger.unregister()).rejects.toThrow('Trigger is not registered')
    })
  })

  describe('Trigger status management', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'trigger-123',
          name: 'test',
          pattern: 'test',
          status: 'active',
          priority: 'normal',
          executionCount: 0,
          successCount: 0,
          failureCount: 0,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        }),
      })
    })

    it('should enable a trigger', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const trigger = defineTrigger({
        name: 'test-trigger',
        event: 'user.created',
        action: async () => {},
      })

      await trigger.register()
      await trigger.enable()

      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/triggers/trigger-123/status'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'active' }),
        })
      )
    })

    it('should disable a trigger', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const trigger = defineTrigger({
        name: 'test-trigger',
        event: 'user.created',
        action: async () => {},
      })

      await trigger.register()
      await trigger.disable()

      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/triggers/trigger-123/status'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'disabled' }),
        })
      )
    })

    it('should pause a trigger', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const trigger = defineTrigger({
        name: 'test-trigger',
        event: 'user.created',
        action: async () => {},
      })

      await trigger.register()
      await trigger.pause()

      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/triggers/trigger-123/status'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'paused' }),
        })
      )
    })
  })

  describe('Trigger info and metrics', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'trigger-123',
          name: 'test',
          pattern: 'test',
          status: 'active',
          priority: 'normal',
          executionCount: 0,
          successCount: 0,
          failureCount: 0,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        }),
      })
    })

    it('should get trigger info', async () => {
      const mockInfo: RegisteredTrigger = {
        id: 'trigger-123',
        name: 'test-trigger',
        pattern: 'user.created',
        status: 'active',
        priority: 'high',
        executionCount: 10,
        successCount: 9,
        failureCount: 1,
        lastExecutedAt: '2025-01-10T12:00:00Z',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-10T12:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockInfo,
      })

      const trigger = defineTrigger({
        name: 'test-trigger',
        event: 'user.created',
        action: async () => {},
      })

      await trigger.register()
      const info = await trigger.info()

      expect(info).toEqual(mockInfo)
    })

    it('should get trigger metrics', async () => {
      const mockMetrics: TriggerMetrics = {
        triggerId: 'trigger-123',
        totalExecutions: 100,
        successfulExecutions: 95,
        failedExecutions: 5,
        successRate: 0.95,
        avgDuration: 150,
        minDuration: 50,
        maxDuration: 500,
        lastExecutedAt: '2025-01-10T12:00:00Z',
        errors: [
          { message: 'Network timeout', count: 3 },
          { message: 'Invalid payload', count: 2 },
        ],
        timeRange: {
          from: '2025-01-01T00:00:00Z',
          to: '2025-01-10T23:59:59Z',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetrics,
      })

      const trigger = defineTrigger({
        name: 'test-trigger',
        event: 'user.created',
        action: async () => {},
      })

      await trigger.register()
      const metrics = await trigger.metrics()

      expect(metrics).toEqual(mockMetrics)
      expect(metrics.successRate).toBe(0.95)
      expect(metrics.errors).toHaveLength(2)
    })

    it('should get trigger history', async () => {
      const mockHistory: TriggerExecutionResult[] = [
        {
          id: 'exec-1',
          triggerId: 'trigger-123',
          event: {
            id: 'event-1',
            type: 'user.created',
            payload: { userId: '123' },
            timestamp: '2025-01-10T12:00:00Z',
          },
          success: true,
          duration: 120,
          startedAt: '2025-01-10T12:00:00Z',
          completedAt: '2025-01-10T12:00:00.120Z',
        },
        {
          id: 'exec-2',
          triggerId: 'trigger-123',
          event: {
            id: 'event-2',
            type: 'user.created',
            payload: { userId: '456' },
            timestamp: '2025-01-10T13:00:00Z',
          },
          success: false,
          error: { message: 'Network timeout' },
          duration: 5000,
          startedAt: '2025-01-10T13:00:00Z',
          completedAt: '2025-01-10T13:00:05Z',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ executions: mockHistory }),
      })

      const trigger = defineTrigger({
        name: 'test-trigger',
        event: 'user.created',
        action: async () => {},
      })

      await trigger.register()
      const history = await trigger.history({ limit: 10 })

      expect(history).toEqual(mockHistory)
      expect(history).toHaveLength(2)
      expect(history[0].success).toBe(true)
      expect(history[1].success).toBe(false)
    })
  })

  describe('TriggersService', () => {
    it('should create service with default config', () => {
      const service = createTriggersService()
      expect(service).toBeInstanceOf(TriggersService)
    })

    it('should create service with custom config', () => {
      const service = createTriggersService({
        apiUrl: 'https://custom-triggers.do',
        apiKey: 'custom-key',
        telemetry: false,
      })
      expect(service).toBeInstanceOf(TriggersService)
    })

    it('should register trigger with on()', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'trigger-456',
          name: 'trigger-1736547600000',
          pattern: 'user.created',
          status: 'active',
          priority: 'normal',
          executionCount: 0,
          successCount: 0,
          failureCount: 0,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        }),
      })

      const service = createTriggersService()
      const action = vi.fn()

      const triggerId = await service.on('user.created', action)

      expect(triggerId).toBe('trigger-456')
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/register'),
        expect.objectContaining({
          method: 'POST',
        })
      )
    })

    it('should register conditional trigger with when()', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'trigger-789',
          name: 'when-1736547600000',
          pattern: 'order.created',
          status: 'active',
          priority: 'high',
          executionCount: 0,
          successCount: 0,
          failureCount: 0,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        }),
      })

      const service = createTriggersService()
      const condition = vi.fn(async (event: TriggerEvent) => event.payload.total > 100)
      const action = vi.fn()

      const triggerId = await service.when('order.created', {
        condition,
        action,
        priority: 'high',
      })

      expect(triggerId).toBe('trigger-789')
    })

    it('should register schedule-based trigger with every()', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'trigger-schedule',
          name: 'schedule-1736547600000',
          pattern: 'schedule:0 9 * * *',
          status: 'active',
          priority: 'normal',
          executionCount: 0,
          successCount: 0,
          failureCount: 0,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        }),
      })

      const service = createTriggersService()
      const action = vi.fn()

      const triggerId = await service.every('0 9 * * *', { action })

      expect(triggerId).toBe('trigger-schedule')
      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: expect.stringContaining('schedule:0 9 * * *'),
        })
      )
    })

    it('should list triggers', async () => {
      const mockTriggers: RegisteredTrigger[] = [
        {
          id: 'trigger-1',
          name: 'trigger-1',
          pattern: 'user.created',
          status: 'active',
          priority: 'normal',
          executionCount: 10,
          successCount: 10,
          failureCount: 0,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-10T00:00:00Z',
        },
        {
          id: 'trigger-2',
          name: 'trigger-2',
          pattern: 'order.created',
          status: 'paused',
          priority: 'high',
          executionCount: 5,
          successCount: 4,
          failureCount: 1,
          createdAt: '2025-01-02T00:00:00Z',
          updatedAt: '2025-01-11T00:00:00Z',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ triggers: mockTriggers }),
      })

      const service = createTriggersService()
      const triggers = await service.list({ status: 'active' })

      expect(triggers).toEqual(mockTriggers)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('status=active'), expect.anything())
    })

    it('should get trigger by id', async () => {
      const mockTrigger: RegisteredTrigger = {
        id: 'trigger-123',
        name: 'test-trigger',
        pattern: 'user.created',
        status: 'active',
        priority: 'normal',
        executionCount: 10,
        successCount: 10,
        failureCount: 0,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTrigger,
      })

      const service = createTriggersService()
      const trigger = await service.get('trigger-123')

      expect(trigger).toEqual(mockTrigger)
    })

    it('should enable trigger', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const service = createTriggersService()
      await service.enable('trigger-123')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/triggers/trigger-123/status'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'active' }),
        })
      )
    })

    it('should disable trigger', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const service = createTriggersService()
      await service.disable('trigger-123')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/triggers/trigger-123/status'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'disabled' }),
        })
      )
    })

    it('should pause trigger', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const service = createTriggersService()
      await service.pause('trigger-123')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/triggers/trigger-123/status'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'paused' }),
        })
      )
    })

    it('should delete trigger', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const service = createTriggersService()
      await service.delete('trigger-123')

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/triggers/trigger-123'), expect.objectContaining({ method: 'DELETE' }))
    })

    it('should get trigger history', async () => {
      const mockHistory: TriggerExecutionResult[] = [
        {
          id: 'exec-1',
          triggerId: 'trigger-123',
          event: {
            id: 'event-1',
            type: 'user.created',
            payload: { userId: '123' },
            timestamp: '2025-01-10T12:00:00Z',
          },
          success: true,
          duration: 120,
          startedAt: '2025-01-10T12:00:00Z',
          completedAt: '2025-01-10T12:00:00.120Z',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ executions: mockHistory }),
      })

      const service = createTriggersService()
      const history = await service.history('trigger-123', {
        from: '2025-01-01',
        limit: 10,
      })

      expect(history).toEqual(mockHistory)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('from=2025-01-01'), expect.anything())
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('limit=10'), expect.anything())
    })

    it('should get trigger metrics', async () => {
      const mockMetrics: TriggerMetrics = {
        triggerId: 'trigger-123',
        totalExecutions: 50,
        successfulExecutions: 48,
        failedExecutions: 2,
        successRate: 0.96,
        avgDuration: 200,
        minDuration: 80,
        maxDuration: 600,
        errors: [],
        timeRange: {
          from: '2025-01-01T00:00:00Z',
          to: '2025-01-10T23:59:59Z',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetrics,
      })

      const service = createTriggersService()
      const metrics = await service.metrics('trigger-123')

      expect(metrics).toEqual(mockMetrics)
      expect(metrics.successRate).toBe(0.96)
    })
  })

  describe('Pattern matching', () => {
    it('should handle string patterns', () => {
      const trigger = defineTrigger({
        name: 'string-pattern',
        event: 'user.created',
        action: async () => {},
      })

      expect(trigger.getDefinition().event).toBe('user.created')
    })

    it('should handle glob patterns', () => {
      const trigger = defineTrigger({
        name: 'glob-pattern',
        event: 'order.*',
        action: async () => {},
      })

      expect(trigger.getDefinition().event).toBe('order.*')
    })

    it('should handle regex patterns', () => {
      const pattern = /^payment\.(success|failed)$/

      const trigger = defineTrigger({
        name: 'regex-pattern',
        event: pattern,
        action: async () => {},
      })

      expect(trigger.getDefinition().event).toBe(pattern)
    })

    it('should handle function patterns', () => {
      const pattern = (event: TriggerEvent) => event.payload.amount > 1000

      const trigger = defineTrigger({
        name: 'function-pattern',
        event: pattern,
        action: async () => {},
      })

      expect(trigger.getDefinition().event).toBe(pattern)
    })
  })

  describe('Default instance', () => {
    it('should have default triggers instance', () => {
      expect(triggers).toBeInstanceOf(TriggersService)
    })

    it('should be usable without configuration', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'trigger-default',
          name: 'trigger-1736547600000',
          pattern: 'test.event',
          status: 'active',
          priority: 'normal',
          executionCount: 0,
          successCount: 0,
          failureCount: 0,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        }),
      })

      const triggerId = await triggers.on('test.event', async () => {})
      expect(triggerId).toBe('trigger-default')
    })
  })

  describe('Error handling', () => {
    it('should handle registration errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal server error',
      })

      const trigger = defineTrigger({
        name: 'error-trigger',
        event: 'test.event',
        action: async () => {},
      })

      await expect(trigger.register()).rejects.toThrow('Failed to register trigger: 500 Internal server error')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const trigger = defineTrigger({
        name: 'network-error-trigger',
        event: 'test.event',
        action: async () => {},
      })

      await expect(trigger.register()).rejects.toThrow('Network error')
    })

    it('should handle invalid operations on unregistered triggers', async () => {
      const trigger = defineTrigger({
        name: 'unregistered-trigger',
        event: 'test.event',
        action: async () => {},
      })

      await expect(trigger.enable()).rejects.toThrow('Trigger is not registered')
      await expect(trigger.disable()).rejects.toThrow('Trigger is not registered')
      await expect(trigger.pause()).rejects.toThrow('Trigger is not registered')
      await expect(trigger.info()).rejects.toThrow('Trigger is not registered')
      await expect(trigger.metrics()).rejects.toThrow('Trigger is not registered')
      await expect(trigger.history()).rejects.toThrow('Trigger is not registered')
    })
  })

  describe('Priority levels', () => {
    it('should support all priority levels', () => {
      const levels: Array<'low' | 'normal' | 'high' | 'critical'> = ['low', 'normal', 'high', 'critical']

      levels.forEach((priority) => {
        const trigger = defineTrigger({
          name: `priority-${priority}`,
          event: 'test.event',
          action: async () => {},
          priority,
        })

        expect(trigger.getDefinition().priority).toBe(priority)
      })
    })
  })

  describe('List options', () => {
    it('should support filtering by status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ triggers: [] }),
      })

      const service = createTriggersService()
      await service.list({ status: 'active' })

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('status=active'), expect.anything())
    })

    it('should support filtering by priority', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ triggers: [] }),
      })

      const service = createTriggersService()
      await service.list({ priority: 'high' })

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('priority=high'), expect.anything())
    })

    it('should support pagination', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ triggers: [] }),
      })

      const service = createTriggersService()
      await service.list({ limit: 50, offset: 100 })

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('limit=50'), expect.anything())
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('offset=100'), expect.anything())
    })

    it('should support sorting', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ triggers: [] }),
      })

      const service = createTriggersService()
      await service.list({ sortBy: 'executionCount', order: 'desc' })

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('sortBy=executionCount'), expect.anything())
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('order=desc'), expect.anything())
    })
  })
})
