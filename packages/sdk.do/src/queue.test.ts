/**
 * Tests for Queue Service
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { QueueService, createQueueService } from './queue'
import type { PublishResponse, BatchPublishResponse, QueueStats, HealthStatus } from './queue'

describe('QueueService', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let service: QueueService

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    service = new QueueService('https://test.queue.do', 'test-api-key')
  })

  describe('constructor', () => {
    test('creates service with default baseUrl', () => {
      const defaultService = new QueueService()
      expect(defaultService).toBeInstanceOf(QueueService)
    })

    test('creates service with custom baseUrl and apiKey', () => {
      expect(service).toBeInstanceOf(QueueService)
    })
  })

  describe('publish()', () => {
    test('publishes a message to queue', async () => {
      const mockResponse: PublishResponse = {
        messageId: 'msg-123',
        queue: 'tasks',
        publishedAt: '2025-10-12T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.publish('tasks', {
        type: 'send-email',
        to: 'user@example.com',
      })

      expect(mockFetch).toHaveBeenCalledWith('https://test.queue.do/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: JSON.stringify({
          queue: 'tasks',
          message: {
            type: 'send-email',
            to: 'user@example.com',
          },
        }),
      })

      expect(result.messageId).toBe('msg-123')
      expect(result.queue).toBe('tasks')
    })

    test('publishes with delay option', async () => {
      const mockResponse: PublishResponse = {
        messageId: 'msg-456',
        queue: 'emails',
        publishedAt: '2025-10-12T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.publish(
        'emails',
        {
          type: 'send-reminder',
          userId: '123',
        },
        {
          delaySeconds: 3600,
        }
      )

      expect(result.messageId).toBe('msg-456')
    })

    test('throws error on publish failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid message format',
      })

      await expect(
        service.publish('tasks', {
          type: 'invalid',
        })
      ).rejects.toThrow('Failed to publish message: Invalid message format')
    })
  })

  describe('batch()', () => {
    test('publishes multiple messages in batch', async () => {
      const mockResponse: BatchPublishResponse = {
        messageIds: ['msg-1', 'msg-2', 'msg-3'],
        successCount: 3,
        failedCount: 0,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.batch('events', [
        { type: 'user.created', userId: '1' },
        { type: 'user.created', userId: '2' },
        { type: 'user.created', userId: '3' },
      ])

      expect(mockFetch).toHaveBeenCalledWith('https://test.queue.do/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: JSON.stringify({
          queue: 'events',
          messages: [
            { type: 'user.created', userId: '1' },
            { type: 'user.created', userId: '2' },
            { type: 'user.created', userId: '3' },
          ],
        }),
      })

      expect(result.messageIds).toHaveLength(3)
      expect(result.successCount).toBe(3)
      expect(result.failedCount).toBe(0)
    })

    test('handles partial batch failures', async () => {
      const mockResponse: BatchPublishResponse = {
        messageIds: ['msg-1', 'msg-2'],
        successCount: 2,
        failedCount: 1,
        failures: [
          {
            message: { type: 'invalid' },
            error: 'Missing required field',
          },
        ],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.batch('events', [{ type: 'user.created', userId: '1' }, { type: 'user.created', userId: '2' }, { type: 'invalid' }])

      expect(result.successCount).toBe(2)
      expect(result.failedCount).toBe(1)
      expect(result.failures).toHaveLength(1)
    })

    test('throws error on batch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid batch request',
      })

      await expect(service.batch('tasks', [])).rejects.toThrow('Failed to batch publish: Invalid batch request')
    })
  })

  describe('stats()', () => {
    test('retrieves stats for specific queue', async () => {
      const mockStats: QueueStats = {
        queue: 'tasks',
        pending: 42,
        inFlight: 5,
        deadLetterCount: 2,
        messagesPerSecond: 10.5,
        avgProcessingTime: 250,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })

      const result = await service.stats('tasks')

      expect(mockFetch).toHaveBeenCalledWith('https://test.queue.do/stats/tasks', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result).toHaveProperty('queue', 'tasks')
      expect(result).toHaveProperty('pending', 42)
      expect(result).toHaveProperty('inFlight', 5)
    })

    test('retrieves stats for all queues', async () => {
      const mockAllStats: Record<string, QueueStats> = {
        tasks: {
          queue: 'tasks',
          pending: 42,
          inFlight: 5,
          deadLetterCount: 2,
          messagesPerSecond: 10.5,
        },
        events: {
          queue: 'events',
          pending: 100,
          inFlight: 10,
          deadLetterCount: 0,
          messagesPerSecond: 25.0,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAllStats,
      })

      const result = await service.stats()

      expect(mockFetch).toHaveBeenCalledWith('https://test.queue.do/stats', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result).toHaveProperty('tasks')
      expect(result).toHaveProperty('events')
    })

    test('throws error on stats failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal server error',
      })

      await expect(service.stats('tasks')).rejects.toThrow('Failed to get queue stats: Internal server error')
    })
  })

  describe('health()', () => {
    test('retrieves health status for all queues', async () => {
      const mockHealth: HealthStatus = {
        healthy: true,
        queues: {
          events: {
            healthy: true,
            pending: 50,
            errors: 0,
          },
          tasks: {
            healthy: true,
            pending: 30,
            errors: 0,
          },
          webhooks: {
            healthy: false,
            pending: 1000,
            errors: 10,
          },
          emails: {
            healthy: true,
            pending: 20,
            errors: 0,
          },
          analytics: {
            healthy: true,
            pending: 100,
            errors: 0,
          },
        },
        timestamp: '2025-10-12T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockHealth,
      })

      const result = await service.health()

      expect(mockFetch).toHaveBeenCalledWith('https://test.queue.do/health', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result.healthy).toBe(true)
      expect(result.queues.webhooks.healthy).toBe(false)
      expect(result.queues.webhooks.errors).toBe(10)
    })

    test('indicates unhealthy when any queue is unhealthy', async () => {
      const mockHealth: HealthStatus = {
        healthy: false,
        queues: {
          events: {
            healthy: true,
            pending: 10,
            errors: 0,
          },
          tasks: {
            healthy: false,
            pending: 5000,
            errors: 50,
          },
          webhooks: {
            healthy: true,
            pending: 20,
            errors: 0,
          },
          emails: {
            healthy: true,
            pending: 15,
            errors: 0,
          },
          analytics: {
            healthy: true,
            pending: 30,
            errors: 0,
          },
        },
        timestamp: '2025-10-12T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockHealth,
      })

      const result = await service.health()

      expect(result.healthy).toBe(false)
      expect(result.queues.tasks.healthy).toBe(false)
    })

    test('throws error on health check failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Health check failed',
      })

      await expect(service.health()).rejects.toThrow('Failed to get queue health: Health check failed')
    })
  })

  describe('createQueueService', () => {
    test('creates service instance with factory function', () => {
      const factoryService = createQueueService('https://test.do', 'test-key')
      expect(factoryService).toBeInstanceOf(QueueService)
    })
  })
})
