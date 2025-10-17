/**
 * Tests for Stream Service
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { StreamService, createStreamService } from './stream'
import type { StreamCapabilities, StreamConnection } from './stream'

// Mock EventSource
class MockEventSource {
  url: string
  readyState: number = 0
  onopen: ((event: Event) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  private listeners: Map<string, ((event: MessageEvent) => void)[]> = new Map()

  constructor(url: string) {
    this.url = url
    // Simulate async connection
    setTimeout(() => {
      this.readyState = 1
      if (this.onopen) {
        this.onopen(new Event('open'))
      }
    }, 0)
  }

  addEventListener(event: string, handler: (e: MessageEvent) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(handler)
  }

  removeEventListener(event: string, handler: (e: MessageEvent) => void) {
    const handlers = this.listeners.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  close() {
    this.readyState = 2
  }

  // Helper to simulate receiving an event
  _simulateEvent(event: string, data: any) {
    const handlers = this.listeners.get(event)
    if (handlers) {
      const messageEvent = new MessageEvent(event, {
        data: JSON.stringify(data),
      })
      handlers.forEach((handler) => handler(messageEvent))
    }
  }
}

describe('StreamService', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let service: StreamService
  let originalEventSource: any

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    // Mock EventSource globally
    originalEventSource = global.EventSource
    global.EventSource = MockEventSource as any

    service = new StreamService('https://test.stream.do', 'test-api-key')
  })

  afterEach(() => {
    // Restore EventSource
    global.EventSource = originalEventSource
  })

  describe('constructor', () => {
    test('creates service with default baseUrl', () => {
      const defaultService = new StreamService()
      expect(defaultService).toBeInstanceOf(StreamService)
    })

    test('creates service with custom baseUrl and apiKey', () => {
      expect(service).toBeInstanceOf(StreamService)
    })
  })

  describe('events()', () => {
    test('creates event stream connection', () => {
      const connection = service.events({
        types: ['$.Order.created'],
      })

      expect(connection).toBeDefined()
      expect(typeof connection.close).toBe('function')
      expect(typeof connection.getEventSource).toBe('function')

      const eventSource = connection.getEventSource()
      expect(eventSource).toBeDefined()
      expect(eventSource?.url).toContain('/v1/stream/events')
      expect(eventSource?.url).toContain('types=%24.Order.created')
      expect(eventSource?.url).toContain('apiKey=test-api-key')

      connection.close()
    })

    test('creates event stream with multiple types', () => {
      const connection = service.events({
        types: ['$.Order.created', '$.Order.updated'],
      })

      const eventSource = connection.getEventSource() as MockEventSource
      expect(eventSource.url).toContain('types=%24.Order.created')
      expect(eventSource.url).toContain('types=%24.Order.updated')

      connection.close()
    })

    test('creates event stream with collections filter', () => {
      const connection = service.events({
        collections: ['events', 'webhooks'],
      })

      const eventSource = connection.getEventSource() as MockEventSource
      expect(eventSource.url).toContain('collections=events')
      expect(eventSource.url).toContain('collections=webhooks')

      connection.close()
    })

    test('creates event stream with since timestamp', () => {
      const since = '2025-10-11T16:00:00Z'
      const connection = service.events({
        since,
      })

      const eventSource = connection.getEventSource() as MockEventSource
      expect(eventSource.url).toContain(`since=${encodeURIComponent(since)}`)

      connection.close()
    })

    test('calls onConnected callback', (done) => {
      const connection = service.events({
        onConnected: () => {
          expect(true).toBe(true)
          connection.close()
          done()
        },
      })
    })

    test('calls onEvent callback when event received', (done) => {
      const mockEvent = { type: '$.Order.created', data: { orderId: '123' } }

      const connection = service.events({
        types: ['$.Order.created'],
        onEvent: (event) => {
          expect(event).toEqual(mockEvent)
          connection.close()
          done()
        },
      })

      // Simulate receiving an event
      setTimeout(() => {
        const eventSource = connection.getEventSource() as MockEventSource
        eventSource._simulateEvent('message', mockEvent)
      }, 10)
    })
  })

  describe('search()', () => {
    test('creates search stream connection', () => {
      const connection = service.search({
        query: 'order',
      })

      expect(connection).toBeDefined()
      const eventSource = connection.getEventSource() as MockEventSource
      expect(eventSource.url).toContain('/v1/stream/search')
      expect(eventSource.url).toContain('q=order')
      expect(eventSource.url).toContain('apiKey=test-api-key')

      connection.close()
    })

    test('creates search stream with collections filter', () => {
      const connection = service.search({
        query: 'order',
        collections: ['events'],
      })

      const eventSource = connection.getEventSource() as MockEventSource
      expect(eventSource.url).toContain('collections=events')

      connection.close()
    })

    test('creates search stream with custom interval', () => {
      const connection = service.search({
        query: 'order',
        interval: 10000,
      })

      const eventSource = connection.getEventSource() as MockEventSource
      expect(eventSource.url).toContain('interval=10000')

      connection.close()
    })

    test('calls onResults callback when results received', (done) => {
      const mockResults = [{ id: 'evt_123', title: 'Order created' }]

      const connection = service.search({
        query: 'order',
        onResults: (results) => {
          expect(results).toEqual(mockResults)
          connection.close()
          done()
        },
      })

      setTimeout(() => {
        const eventSource = connection.getEventSource() as MockEventSource
        eventSource._simulateEvent('results', mockResults)
      }, 10)
    })
  })

  describe('batch()', () => {
    test('creates batch stream connection', () => {
      const connection = service.batch({
        batchId: 'batch_123',
      })

      expect(connection).toBeDefined()
      const eventSource = connection.getEventSource() as MockEventSource
      expect(eventSource.url).toContain('/v1/stream/batch/batch_123')
      expect(eventSource.url).toContain('apiKey=test-api-key')

      connection.close()
    })

    test('creates batch stream with custom interval', () => {
      const connection = service.batch({
        batchId: 'batch_123',
        interval: 1000,
      })

      const eventSource = connection.getEventSource() as MockEventSource
      expect(eventSource.url).toContain('interval=1000')

      connection.close()
    })

    test('calls onProgress callback when progress received', (done) => {
      const mockProgress = { completed: 50, total: 100, percentage: 50 }

      const connection = service.batch({
        batchId: 'batch_123',
        onProgress: (progress) => {
          expect(progress).toEqual(mockProgress)
          connection.close()
          done()
        },
      })

      setTimeout(() => {
        const eventSource = connection.getEventSource() as MockEventSource
        eventSource._simulateEvent('progress', mockProgress)
      }, 10)
    })

    test('calls onComplete callback when batch completes', (done) => {
      const mockComplete = { batchId: 'batch_123', status: 'completed', results: [] }

      const connection = service.batch({
        batchId: 'batch_123',
        onComplete: (data) => {
          expect(data).toEqual(mockComplete)
          connection.close()
          done()
        },
      })

      setTimeout(() => {
        const eventSource = connection.getEventSource() as MockEventSource
        eventSource._simulateEvent('complete', mockComplete)
      }, 10)
    })
  })

  describe('health()', () => {
    test('creates health stream connection', () => {
      const connection = service.health()

      expect(connection).toBeDefined()
      const eventSource = connection.getEventSource() as MockEventSource
      expect(eventSource.url).toContain('/v1/stream/health')
      expect(eventSource.url).toContain('apiKey=test-api-key')

      connection.close()
    })

    test('calls onHealth callback when health update received', (done) => {
      const mockHealth = { status: 'ok', services: ['api', 'db', 'cache'] }

      const connection = service.health({
        onHealth: (health) => {
          expect(health).toEqual(mockHealth)
          connection.close()
          done()
        },
      })

      setTimeout(() => {
        const eventSource = connection.getEventSource() as MockEventSource
        eventSource._simulateEvent('health', mockHealth)
      }, 10)
    })
  })

  describe('getCapabilities()', () => {
    test('retrieves stream capabilities', async () => {
      const mockCapabilities: StreamCapabilities = {
        capabilities: {
          protocol: 'SSE',
          supportedStreams: ['events', 'search', 'batch', 'health'],
          heartbeatInterval: '30s',
          features: ['Real-time events', 'Live search', 'Batch monitoring', 'Health monitoring'],
        },
        streams: {
          events: {
            path: '/v1/stream/events',
            description: 'Real-time event stream',
            params: { types: 'Event types filter', collections: 'Collections filter', since: 'Timestamp filter' },
          },
          search: {
            path: '/v1/stream/search',
            description: 'Live search results stream',
            params: { query: 'Search query', collections: 'Collections filter', interval: 'Poll interval' },
          },
        },
        usage: {
          javascript: 'const stream = $.stream.events({ types: ["$.Order.created"] })',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCapabilities,
      })

      const result = await service.getCapabilities()

      expect(mockFetch).toHaveBeenCalledWith('https://test.stream.do/v1/stream', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result.capabilities.protocol).toBe('SSE')
      expect(result.capabilities.supportedStreams).toHaveLength(4)
      expect(result.streams.events).toBeDefined()
    })

    test('throws error on capabilities fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(service.getCapabilities()).rejects.toThrow('Failed to get stream capabilities: Internal Server Error')
    })
  })

  describe('error handling', () => {
    test('throws error when EventSource not available', () => {
      // Temporarily remove EventSource
      const temp = global.EventSource
      global.EventSource = undefined as any

      expect(() => {
        service.events({})
      }).toThrow('EventSource is not available in this environment')

      // Restore
      global.EventSource = temp
    })

    test('calls onError callback on stream error', (done) => {
      const connection = service.events({
        onError: (error) => {
          expect(error).toBeInstanceOf(Error)
          connection.close()
          done()
        },
      })

      setTimeout(() => {
        const eventSource = connection.getEventSource() as MockEventSource
        if (eventSource.onerror) {
          eventSource.onerror(new Event('error'))
        }
      }, 10)
    })
  })

  describe('connection management', () => {
    test('close() closes the EventSource', () => {
      const connection = service.events({})
      const eventSource = connection.getEventSource() as MockEventSource

      expect(eventSource.readyState).toBe(0)
      connection.close()
      expect(eventSource.readyState).toBe(2)
    })

    test('getEventSource() returns the underlying EventSource', () => {
      const connection = service.events({})
      const eventSource = connection.getEventSource()

      expect(eventSource).toBeInstanceOf(MockEventSource)
    })
  })

  describe('createStreamService', () => {
    test('creates service instance with factory function', () => {
      const factoryService = createStreamService('https://test.do', 'test-key')
      expect(factoryService).toBeInstanceOf(StreamService)
    })
  })
})
