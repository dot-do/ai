/**
 * Tests for Analytics Service
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { AnalyticsService, createAnalyticsService } from './analytics'
import type { TrackResponse, ListEventsResponse, AnalyticsMetrics } from './analytics'

describe('AnalyticsService', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let service: AnalyticsService

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    service = new AnalyticsService('https://test.analytics.do/v1/analytics', 'test-api-key')
  })

  describe('constructor', () => {
    test('creates service with default baseUrl', () => {
      const defaultService = new AnalyticsService()
      expect(defaultService).toBeInstanceOf(AnalyticsService)
    })

    test('creates service with custom baseUrl and apiKey', () => {
      expect(service).toBeInstanceOf(AnalyticsService)
    })
  })

  describe('track()', () => {
    test('tracks event with required fields', async () => {
      const mockResponse: TrackResponse = {
        success: true,
        eventId: 'evt_123abc',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.track('button_clicked', { button: 'signup' })

      // Check that fetch was called (with dynamic timestamp, so we use toHaveBeenCalled)
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Verify the call structure
      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[0]).toBe('https://test.analytics.do/v1/analytics/track')
      expect(callArgs[1].method).toBe('POST')
      expect(callArgs[1].headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-api-key',
      })

      // Parse body and verify structure (timestamp is dynamic)
      const body = JSON.parse(callArgs[1].body)
      expect(body.type).toBe('button_clicked')
      expect(body.properties).toEqual({ button: 'signup' })
      expect(body.timestamp).toBeDefined()
      expect(typeof body.timestamp).toBe('string')

      expect(result.success).toBe(true)
      expect(result.eventId).toBe('evt_123abc')
    })

    test('tracks event with userId', async () => {
      const mockResponse: TrackResponse = {
        success: true,
        eventId: 'evt_456def',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.track('purchase_completed', { amount: 99.99 }, { userId: 'user_123' })

      expect(result.eventId).toBe('evt_456def')
    })

    test('throws error on tracking failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Invalid event name',
      })

      await expect(service.track('', {})).rejects.toThrow('Failed to track event: Invalid event name')
    })
  })

  describe('page()', () => {
    test('tracks page view', async () => {
      const mockResponse: TrackResponse = {
        success: true,
        eventId: 'evt_pageview',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.page('/pricing', { title: 'Pricing Page' })

      // Verify call was made
      expect(mockFetch).toHaveBeenCalledTimes(1)

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[0]).toBe('https://test.analytics.do/v1/analytics/track')
      expect(callArgs[1].method).toBe('POST')

      // Parse body and verify structure
      const body = JSON.parse(callArgs[1].body)
      expect(body.type).toBe('pageview')
      expect(body.page).toEqual({
        url: '/pricing',
        title: 'Pricing Page',
        referrer: undefined,
      })
      expect(body.timestamp).toBeDefined()

      expect(result.success).toBe(true)
    })
  })

  describe('identify()', () => {
    test('identifies user with traits', async () => {
      const mockResponse: TrackResponse = {
        success: true,
        eventId: 'evt_identify',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.identify('user_123', {
        email: 'user@example.com',
        name: 'Test User',
        plan: 'pro',
      })

      // Verify call was made
      expect(mockFetch).toHaveBeenCalledTimes(1)

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[0]).toBe('https://test.analytics.do/v1/analytics/track')
      expect(callArgs[1].method).toBe('POST')

      // Parse body and verify structure
      const body = JSON.parse(callArgs[1].body)
      expect(body.type).toBe('identify')
      expect(body.userId).toBe('user_123')
      expect(body.properties).toEqual({
        email: 'user@example.com',
        name: 'Test User',
        plan: 'pro',
      })
      expect(body.timestamp).toBeDefined()

      expect(result.success).toBe(true)
    })
  })

  describe('group()', () => {
    test('associates user with group', async () => {
      const mockResponse: TrackResponse = {
        success: true,
        eventId: 'evt_group',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.group('user_123', 'company_456', {
        name: 'Acme Corp',
        plan: 'enterprise',
      })

      expect(result.success).toBe(true)
    })
  })

  describe('events()', () => {
    test('lists events with filters', async () => {
      const mockResponse: ListEventsResponse = {
        success: true,
        count: 2,
        data: [
          {
            id: 'evt_1',
            timestamp: '2025-10-11T16:00:00Z',
            type: 'button_clicked',
            userId: 'user_123',
            properties: { button: 'signup' },
            eventType: 'track',
          },
          {
            id: 'evt_2',
            timestamp: '2025-10-11T16:05:00Z',
            type: 'purchase_completed',
            userId: 'user_123',
            properties: { amount: 99.99 },
            eventType: 'track',
          },
        ],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.events({ userId: 'user_123', limit: 50 })

      expect(result.data).toHaveLength(2)
      expect(result.count).toBe(2)
      expect(result.success).toBe(true)
    })
  })

  describe('createAnalyticsService', () => {
    test('creates service instance with factory function', () => {
      const factoryService = createAnalyticsService('https://test.do', 'test-key')
      expect(factoryService).toBeInstanceOf(AnalyticsService)
    })
  })
})
