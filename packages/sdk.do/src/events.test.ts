/**
 * Events Service Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  EventsService,
  createEventsService,
  type Event,
  type BatchEvent,
  type BatchPublishResult,
  type DLQEntry,
  type EventMetrics,
  type Subscription,
  type StreamOptions,
  type HistoryOptions,
  type SubscribeOptions,
} from './events'

// Mock fetch globally
global.fetch = vi.fn()
// Mock WebSocket globally
global.WebSocket = vi.fn(() => ({
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  onmessage: null,
  onerror: null,
  onopen: null,
  onclose: null,
})) as any

describe('EventsService', () => {
  let service: EventsService
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFetch = global.fetch as ReturnType<typeof vi.fn>
    mockFetch.mockClear()
    service = new EventsService({
      apiUrl: 'https://test.events.do',
      apiKey: 'test-key',
      telemetry: false,
    })
  })

  afterEach(() => {
    service.cleanup()
    vi.clearAllMocks()
  })

  describe('publish', () => {
    it('should publish an event successfully', async () => {
      const mockEvent: Event = {
        id: 'evt-123',
        type: 'user.created',
        payload: { userId: '123', email: 'alice@example.com' },
        timestamp: '2025-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvent,
      })

      const result = await service.publish('user.created', { userId: '123', email: 'alice@example.com' })

      expect(result).toEqual(mockEvent)
      expect(mockFetch).toHaveBeenCalledWith('https://test.events.do/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({
          type: 'user.created',
          payload: { userId: '123', email: 'alice@example.com' },
          metadata: undefined,
        }),
      })
    })

    it('should publish an event with metadata', async () => {
      const mockEvent: Event = {
        id: 'evt-124',
        type: 'order.created',
        payload: { orderId: '456' },
        metadata: { priority: 'high' },
        timestamp: '2025-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvent,
      })

      const result = await service.publish('order.created', { orderId: '456' }, { priority: 'high' })

      expect(result.metadata).toEqual({ priority: 'high' })
    })

    it('should throw error on failed publish', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      })

      await expect(service.publish('user.created', {})).rejects.toThrow('Failed to publish event: 500 Internal Server Error')
    })
  })

  describe('batchPublish', () => {
    it('should batch publish multiple events successfully', async () => {
      const mockResult: BatchPublishResult = {
        success: 2,
        failed: 0,
        eventIds: ['evt-1', 'evt-2'],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const events: BatchEvent[] = [
        { type: 'user.created', payload: { userId: '123' } },
        { type: 'user.updated', payload: { userId: '456' } },
      ]

      const result = await service.batchPublish(events)

      expect(result).toEqual(mockResult)
      expect(mockFetch).toHaveBeenCalledWith('https://test.events.do/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ events }),
      })
    })

    it('should handle partial batch failures', async () => {
      const mockResult: BatchPublishResult = {
        success: 1,
        failed: 1,
        eventIds: ['evt-1'],
        errors: [{ index: 1, error: 'Invalid payload' }],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      })

      const events: BatchEvent[] = [
        { type: 'user.created', payload: { userId: '123' } },
        { type: 'user.invalid', payload: {} },
      ]

      const result = await service.batchPublish(events)

      expect(result.success).toBe(1)
      expect(result.failed).toBe(1)
      expect(result.errors).toHaveLength(1)
    })

    it('should throw error on failed batch publish', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      })

      await expect(service.batchPublish([])).rejects.toThrow('Failed to batch publish events: 400 Bad Request')
    })
  })

  describe('subscribe', () => {
    it('should create a subscription', () => {
      const handler = vi.fn()
      const subscription = service.subscribe('user.*', handler)

      expect(subscription.id).toBeDefined()
      expect(subscription.unsubscribe).toBeInstanceOf(Function)
      expect(global.WebSocket).toHaveBeenCalled()
    })

    it('should create a subscription with options', () => {
      const handler = vi.fn()
      const options: SubscribeOptions = {
        from: 'beginning',
        filter: { status: 'active' },
        durable: true,
        group: 'test-group',
      }

      const subscription = service.subscribe('order.*', handler, options)

      expect(subscription.id).toBeDefined()
    })

    it('should allow unsubscribing', () => {
      const handler = vi.fn()
      const subscription = service.subscribe('user.*', handler)

      expect(() => subscription.unsubscribe()).not.toThrow()
    })
  })

  describe('stream', () => {
    it('should create an event stream', async () => {
      const mockEvents = [
        { id: 'evt-1', type: 'user.created', payload: {}, timestamp: '2025-01-01T00:00:00Z' },
        { id: 'evt-2', type: 'user.updated', payload: {}, timestamp: '2025-01-01T00:01:00Z' },
      ]

      const mockBody = {
        getReader: () => ({
          read: vi
            .fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode(`data: ${JSON.stringify(mockEvents[0])}\n`),
            })
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode(`data: ${JSON.stringify(mockEvents[1])}\n`),
            })
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode('data: [DONE]\n'),
            })
            .mockResolvedValueOnce({
              done: true,
              value: undefined,
            }),
        }),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: mockBody,
      })

      const stream = await service.stream('user.*', { from: 'beginning' })

      const events: Event[] = []
      for await (const event of stream) {
        events.push(event)
      }

      expect(events).toHaveLength(2)
      expect(events[0].id).toBe('evt-1')
      expect(events[1].id).toBe('evt-2')
    })

    it('should handle stream with filter', async () => {
      const mockBody = {
        getReader: () => ({
          read: vi.fn().mockResolvedValueOnce({
            done: true,
            value: undefined,
          }),
        }),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: mockBody,
      })

      const options: StreamOptions = {
        from: 'now',
        filter: { status: 'pending' },
        batchSize: 10,
      }

      await service.stream('order.*', options)

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('filter=' + encodeURIComponent(JSON.stringify({ status: 'pending' }))), expect.any(Object))
    })

    it('should throw error on failed stream creation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      })

      await expect(service.stream('user.*')).rejects.toThrow('Failed to create event stream: 500 Internal Server Error')
    })

    it('should throw error if response body is not readable', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: null,
      })

      await expect(service.stream('user.*')).rejects.toThrow('Response body is not readable')
    })
  })

  describe('history', () => {
    it('should query event history', async () => {
      const mockEvents: Event[] = [
        { id: 'evt-1', type: 'user.created', payload: {}, timestamp: '2025-01-01T00:00:00Z' },
        { id: 'evt-2', type: 'user.updated', payload: {}, timestamp: '2025-01-02T00:00:00Z' },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: mockEvents }),
      })

      const result = await service.history('user.*', {
        from: '2025-01-01',
        to: '2025-01-31',
        limit: 100,
      })

      expect(result).toEqual(mockEvents)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('from=2025-01-01'),
        expect.objectContaining({
          method: 'GET',
        })
      )
    })

    it('should query history with all options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: [] }),
      })

      const options: HistoryOptions = {
        from: '2025-01-01',
        to: '2025-01-31',
        limit: 50,
        offset: 10,
        filter: { status: 'completed' },
        order: 'desc',
      }

      await service.history('order.*', options)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=50'),
        expect.objectContaining({
          method: 'GET',
        })
      )
    })

    it('should return empty array when no events found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const result = await service.history('user.*')

      expect(result).toEqual([])
    })

    it('should throw error on failed history query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      })

      await expect(service.history('user.*')).rejects.toThrow('Failed to query event history: 400 Bad Request')
    })
  })

  describe('dlq', () => {
    it('should get DLQ entries', async () => {
      const mockEntries: DLQEntry[] = [
        {
          id: 'dlq-1',
          event: { id: 'evt-1', type: 'user.created', payload: {}, timestamp: '2025-01-01T00:00:00Z' },
          error: 'Processing failed',
          retryCount: 3,
          createdAt: '2025-01-01T00:00:00Z',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ entries: mockEntries }),
      })

      const result = await service.dlq('failed-events')

      expect(result).toEqual(mockEntries)
      expect(mockFetch).toHaveBeenCalledWith('https://test.events.do/dlq/failed-events', expect.any(Object))
    })

    it('should use default queue if not specified', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ entries: [] }),
      })

      await service.dlq()

      expect(mockFetch).toHaveBeenCalledWith('https://test.events.do/dlq/default', expect.any(Object))
    })

    it('should return empty array when no entries found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const result = await service.dlq()

      expect(result).toEqual([])
    })

    it('should throw error on failed DLQ fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      })

      await expect(service.dlq()).rejects.toThrow('Failed to get DLQ entries: 500 Internal Server Error')
    })
  })

  describe('retry', () => {
    it('should retry a DLQ entry', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      })

      await service.retry('dlq-123')

      expect(mockFetch).toHaveBeenCalledWith('https://test.events.do/dlq/dlq-123/retry', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-key',
        },
      })
    })

    it('should throw error on failed retry', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      })

      await expect(service.retry('dlq-invalid')).rejects.toThrow('Failed to retry DLQ entry: 404 Not Found')
    })
  })

  describe('discard', () => {
    it('should discard a DLQ entry', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      })

      await service.discard('dlq-123')

      expect(mockFetch).toHaveBeenCalledWith('https://test.events.do/dlq/dlq-123', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer test-key',
        },
      })
    })

    it('should throw error on failed discard', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      })

      await expect(service.discard('dlq-invalid')).rejects.toThrow('Failed to discard DLQ entry: 404 Not Found')
    })
  })

  describe('metrics', () => {
    it('should get event metrics', async () => {
      const mockMetrics: EventMetrics = {
        published: 1000,
        consumed: 950,
        rate: 10.5,
        latency: 125,
        errorRate: 0.05,
        topTypes: [
          { type: 'user.created', count: 500 },
          { type: 'order.created', count: 300 },
        ],
        timeRange: {
          from: '2025-01-01T00:00:00Z',
          to: '2025-01-31T23:59:59Z',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetrics,
      })

      const result = await service.metrics('user.*', {
        from: '2025-01-01',
        to: '2025-01-31',
      })

      expect(result).toEqual(mockMetrics)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('pattern=user.*'),
        expect.objectContaining({
          method: 'GET',
        })
      )
    })

    it('should get metrics with granularity', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          published: 0,
          consumed: 0,
          rate: 0,
          latency: 0,
          errorRate: 0,
          topTypes: [],
          timeRange: { from: '', to: '' },
        }),
      })

      await service.metrics('order.*', {
        from: '2025-01-01',
        to: '2025-01-31',
        granularity: 60,
      })

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('granularity=60'), expect.any(Object))
    })

    it('should throw error on failed metrics fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      })

      await expect(service.metrics('user.*')).rejects.toThrow('Failed to get event metrics: 500 Internal Server Error')
    })
  })

  describe('listSubscriptions', () => {
    it('should list all subscriptions', async () => {
      const mockSubscriptions: Subscription[] = [
        {
          id: 'sub-1',
          pattern: 'user.*',
          status: 'active',
          createdAt: '2025-01-01T00:00:00Z',
          durable: true,
        },
        {
          id: 'sub-2',
          pattern: 'order.*',
          status: 'paused',
          createdAt: '2025-01-01T00:00:00Z',
          durable: false,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ subscriptions: mockSubscriptions }),
      })

      const result = await service.listSubscriptions()

      expect(result).toEqual(mockSubscriptions)
      expect(mockFetch).toHaveBeenCalledWith('https://test.events.do/subscriptions', expect.any(Object))
    })

    it('should return empty array when no subscriptions found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const result = await service.listSubscriptions()

      expect(result).toEqual([])
    })

    it('should throw error on failed list', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      })

      await expect(service.listSubscriptions()).rejects.toThrow('Failed to list subscriptions: 500 Internal Server Error')
    })
  })

  describe('getSubscription', () => {
    it('should get subscription details', async () => {
      const mockSubscription: Subscription = {
        id: 'sub-123',
        pattern: 'user.*',
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z',
        group: 'test-group',
        durable: true,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubscription,
      })

      const result = await service.getSubscription('sub-123')

      expect(result).toEqual(mockSubscription)
      expect(mockFetch).toHaveBeenCalledWith('https://test.events.do/subscriptions/sub-123', expect.any(Object))
    })

    it('should throw error on failed get', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      })

      await expect(service.getSubscription('sub-invalid')).rejects.toThrow('Failed to get subscription: 404 Not Found')
    })
  })

  describe('cancelSubscription', () => {
    it('should cancel a subscription', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      })

      await service.cancelSubscription('sub-123')

      expect(mockFetch).toHaveBeenCalledWith('https://test.events.do/subscriptions/sub-123', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer test-key',
        },
      })
    })

    it('should throw error on failed cancel', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      })

      await expect(service.cancelSubscription('sub-invalid')).rejects.toThrow('Failed to cancel subscription: 404 Not Found')
    })
  })

  describe('cleanup', () => {
    it('should cleanup all active subscriptions', () => {
      const handler = vi.fn()
      service.subscribe('user.*', handler)
      service.subscribe('order.*', handler)

      expect(() => service.cleanup()).not.toThrow()
    })
  })

  describe('createEventsService', () => {
    it('should create a new service instance', () => {
      const newService = createEventsService({
        apiUrl: 'https://custom.events.do',
        apiKey: 'custom-key',
      })

      expect(newService).toBeInstanceOf(EventsService)
    })

    it('should use default configuration', () => {
      const newService = createEventsService()

      expect(newService).toBeInstanceOf(EventsService)
    })
  })

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(service.publish('user.created', {})).rejects.toThrow('Network error')
    })

    it('should handle invalid JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(service.publish('user.created', {})).rejects.toThrow('Invalid JSON')
    })
  })

  describe('authentication', () => {
    it('should include auth header when API key is provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'evt-1', type: 'test', payload: {}, timestamp: '' }),
      })

      await service.publish('test', {})

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-key',
          }),
        })
      )
    })

    it('should work without API key', async () => {
      const noAuthService = new EventsService({ apiUrl: 'https://test.events.do' })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'evt-1', type: 'test', payload: {}, timestamp: '' }),
      })

      await noAuthService.publish('test', {})

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      )
    })
  })
})
