/**
 * Tests for Experiments Service
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ExperimentsService, createExperimentsService } from './experiments'
import type { DecideResponse, ExperimentVariant, ListExperimentsResponse } from './experiments'

describe('ExperimentsService', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let service: ExperimentsService

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    service = new ExperimentsService('https://test.experiments.do/v1/experiments', 'test-api-key')
  })

  describe('constructor', () => {
    test('creates service with default baseUrl', () => {
      const defaultService = new ExperimentsService()
      expect(defaultService).toBeInstanceOf(ExperimentsService)
    })

    test('creates service with custom baseUrl and apiKey', () => {
      expect(service).toBeInstanceOf(ExperimentsService)
    })
  })

  describe('decide()', () => {
    test('returns variant for experiment', async () => {
      const mockResponse: DecideResponse = {
        variant: 'variant_b',
        featureEnabled: true,
        payload: { buttonColor: 'blue' },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.decide('button_color_test', { userId: 'user_123' })

      expect(mockFetch).toHaveBeenCalledWith('https://test.experiments.do/v1/experiments/decide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: JSON.stringify({
          experimentId: 'button_color_test',
          userId: 'user_123',
        }),
      })

      expect(result.variant).toBe('variant_b')
      expect(result.featureEnabled).toBe(true)
      expect(result.payload).toEqual({ buttonColor: 'blue' })
    })

    test('returns control variant', async () => {
      const mockResponse: DecideResponse = {
        variant: 'control',
        featureEnabled: false,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.decide('new_feature_test', { userId: 'user_456' })

      expect(result.variant).toBe('control')
      expect(result.featureEnabled).toBe(false)
    })

    test('handles attributes in decision', async () => {
      const mockResponse: DecideResponse = {
        variant: 'variant_a',
        featureEnabled: true,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.decide('pricing_test', {
        userId: 'user_789',
        attributes: { plan: 'pro', country: 'US' },
      })

      expect(result.variant).toBe('variant_a')
    })
  })

  describe('send()', () => {
    test('tracks conversion event', async () => {
      const mockResponse: SendEventResponse = {
        success: true,
        experimentId: 'button_color_test',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.send('button_color_test', 'conversion', {
        userId: 'user_123',
        value: 99.99,
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(result.success).toBe(true)
      expect(result.experimentId).toBe('button_color_test')
    })
  })

  describe('get()', () => {
    test('retrieves experiment configuration', async () => {
      const mockConfig: ExperimentConfig = {
        id: 'button_color_test',
        name: 'Button Color Test',
        description: 'Test button colors',
        status: 'running',
        variants: [
          { name: 'control', weight: 50 },
          { name: 'variant_b', weight: 50 },
        ],
        trafficAllocation: 100,
        createdAt: '2025-10-11T16:00:00Z',
        updatedAt: '2025-10-11T16:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockConfig,
      })

      const result = await service.get('button_color_test')

      expect(result.id).toBe('button_color_test')
      expect(result.status).toBe('running')
      expect(result.variants).toHaveLength(2)
    })
  })

  describe('list()', () => {
    test('lists all experiments', async () => {
      const mockResponse: ListExperimentsResponse = {
        data: [
          {
            id: 'test_1',
            name: 'Test 1',
            description: 'Test 1 description',
            status: 'running',
            variants: [],
            trafficAllocation: 100,
            createdAt: '2025-10-11T16:00:00Z',
            updatedAt: '2025-10-11T16:00:00Z',
          },
          {
            id: 'test_2',
            name: 'Test 2',
            description: 'Test 2 description',
            status: 'paused',
            variants: [],
            trafficAllocation: 50,
            createdAt: '2025-10-11T16:00:00Z',
            updatedAt: '2025-10-11T16:00:00Z',
          },
        ],
        total: 2,
        limit: 50,
        offset: 0,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.list()

      expect(result.data).toHaveLength(2)
      expect(result.total).toBe(2)
    })

    test('filters experiments by status', async () => {
      const mockResponse: ListExperimentsResponse = {
        data: [
          {
            id: 'test_1',
            name: 'Test 1',
            description: 'Test 1 description',
            status: 'running',
            variants: [],
            trafficAllocation: 100,
            createdAt: '2025-10-11T16:00:00Z',
            updatedAt: '2025-10-11T16:00:00Z',
          },
        ],
        total: 1,
        limit: 50,
        offset: 0,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.list({ status: 'running' })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].status).toBe('running')
    })
  })

  describe('results()', () => {
    test('retrieves experiment results', async () => {
      const mockResults: ExperimentResults = {
        experimentId: 'button_color_test',
        status: 'completed',
        variants: [
          {
            name: 'control',
            users: 500,
            conversions: 100,
            conversionRate: 0.2,
            revenue: 10000,
          },
          {
            name: 'variant_b',
            users: 500,
            conversions: 150,
            conversionRate: 0.3,
            revenue: 15000,
          },
        ],
        winner: 'variant_b',
        confidence: 95,
        startDate: '2025-10-01T00:00:00Z',
        endDate: '2025-10-11T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      })

      const result = await service.results('button_color_test')

      expect(result.winner).toBe('variant_b')
      expect(result.confidence).toBe(95)
      expect(result.experimentId).toBe('button_color_test')
    })
  })

  describe('createExperimentsService', () => {
    test('creates service instance with factory function', () => {
      const factoryService = createExperimentsService('https://test.do', 'test-key')
      expect(factoryService).toBeInstanceOf(ExperimentsService)
    })
  })
})
