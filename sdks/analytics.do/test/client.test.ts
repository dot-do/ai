/**
 * analytics.do SDK - Client Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AnalyticsClient } from '../src/client'

// Mock fetch
global.fetch = vi.fn()

describe('AnalyticsClient', () => {
  let client: AnalyticsClient

  beforeEach(() => {
    vi.clearAllMocks()
    client = new AnalyticsClient({
      writeKey: 'test-key',
      host: 'https://test.analytics.do',
      debug: false,
    })
  })

  describe('track', () => {
    it('should track an event', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 204,
      })

      await client.track('button_clicked', {
        button_id: 'cta',
        page: 'home',
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
      const [url, options] = (global.fetch as any).mock.calls[0]
      expect(url).toBe('https://test.analytics.do/track')
      expect(options.method).toBe('POST')

      const body = JSON.parse(options.body)
      expect(body.event).toBe('button_clicked')
      expect(body.properties).toEqual({
        button_id: 'cta',
        page: 'home',
      })
    })

    it('should validate event name', async () => {
      await expect(client.track('')).rejects.toThrow('Event name must be a non-empty string')
    })
  })

  describe('page', () => {
    it('should track a pageview', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 204,
      })

      await client.page('Home', {
        title: 'Homepage',
        url: 'https://example.com',
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
      const [url, options] = (global.fetch as any).mock.calls[0]
      expect(url).toBe('https://test.analytics.do/page')

      const body = JSON.parse(options.body)
      expect(body.name).toBe('Home')
      expect(body.properties).toEqual({
        title: 'Homepage',
        url: 'https://example.com',
      })
    })
  })

  describe('identify', () => {
    it('should identify a user', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 204,
      })

      await client.identify('user-123', {
        email: 'user@example.com',
        name: 'John Doe',
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
      const [url, options] = (global.fetch as any).mock.calls[0]
      expect(url).toBe('https://test.analytics.do/identify')

      const body = JSON.parse(options.body)
      expect(body.userId).toBe('user-123')
      expect(body.traits).toEqual({
        email: 'user@example.com',
        name: 'John Doe',
      })
    })

    it('should validate user ID', async () => {
      await expect(client.identify('')).rejects.toThrow('User ID must be a non-empty string')
    })
  })

  describe('group', () => {
    it('should group a user', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 204,
      })

      await client.group('user-123', 'org-abc', {
        name: 'Acme Inc',
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
      const [url, options] = (global.fetch as any).mock.calls[0]
      expect(url).toBe('https://test.analytics.do/group')

      const body = JSON.parse(options.body)
      expect(body.userId).toBe('user-123')
      expect(body.groupId).toBe('org-abc')
      expect(body.traits).toEqual({ name: 'Acme Inc' })
    })
  })

  describe('alias', () => {
    it('should alias user identities', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 204,
      })

      await client.alias('user-123', 'anon-456')

      expect(global.fetch).toHaveBeenCalledTimes(1)
      const [url, options] = (global.fetch as any).mock.calls[0]
      expect(url).toBe('https://test.analytics.do/alias')

      const body = JSON.parse(options.body)
      expect(body.userId).toBe('user-123')
      expect(body.previousId).toBe('anon-456')
    })
  })

  describe('query', () => {
    it('should query events', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [],
          total: 0,
          limit: 100,
          offset: 0,
          hasMore: false,
        }),
      })

      const result = await client.query({
        event: 'button_clicked',
        from: '2025-01-01',
        to: '2025-01-31',
        limit: 100,
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
      const [url] = (global.fetch as any).mock.calls[0]
      expect(url).toContain('/query')
      expect(url).toContain('event=button_clicked')
      expect(result.total).toBe(0)
    })
  })

  describe('batching', () => {
    it('should batch events when configured', async () => {
      const batchedClient = new AnalyticsClient({
        writeKey: 'test-key',
        host: 'https://test.analytics.do',
        batchSize: 2,
        batchInterval: 100,
      })

      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        status: 204,
      })

      // Track two events
      await batchedClient.track('event1')
      await batchedClient.track('event2')

      // Should trigger batch send
      expect(global.fetch).toHaveBeenCalledTimes(1)
      const [url, options] = (global.fetch as any).mock.calls[0]
      expect(url).toBe('https://test.analytics.do/batch')

      const body = JSON.parse(options.body)
      expect(body.events).toHaveLength(2)
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('should handle HTTP errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Invalid event data',
      })

      await expect(client.track('test_event')).rejects.toThrow(
        'HTTP 400: Bad Request - Invalid event data'
      )
    })

    it('should handle timeout errors', async () => {
      const timeoutClient = new AnalyticsClient({
        writeKey: 'test-key',
        host: 'https://test.analytics.do',
        timeout: 1000,
      })

      ;(global.fetch as any).mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => {
              const error = new Error('Aborted')
              error.name = 'AbortError'
              reject(error)
            }, 1500)
          })
      )

      const promise = timeoutClient.track('test_event')
      await vi.advanceTimersByTimeAsync(1500)

      await expect(promise).rejects.toThrow('Request timeout after 1000ms')
    })

    it('should handle network errors', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Failed to fetch'))

      await expect(client.track('test_event')).rejects.toThrow('Network error while fetching')
    })

    it('should include response body in HTTP errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Database connection failed',
      })

      await expect(client.track('test_event')).rejects.toThrow(
        'HTTP 500: Internal Server Error - Database connection failed'
      )
    })

    it('should reject invalid writeKey with newlines', () => {
      expect(
        () =>
          new AnalyticsClient({
            writeKey: 'invalid\nkey',
          })
      ).toThrow('Invalid writeKey: contains newline characters')
    })

    it('should reject invalid writeKey with carriage returns', () => {
      expect(
        () =>
          new AnalyticsClient({
            writeKey: 'invalid\rkey',
          })
      ).toThrow('Invalid writeKey: contains newline characters')
    })
  })
})
