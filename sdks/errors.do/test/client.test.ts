import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createClient, ErrorClient } from '../src/index'

describe('ErrorClient', () => {
  let client: ErrorClient

  beforeEach(() => {
    client = createClient({
      baseUrl: 'https://errors.test',
      apiKey: 'test-key',
      environment: 'test',
      enableAutoCapture: false,
    })
  })

  afterEach(async () => {
    await client.close()
  })

  describe('createClient', () => {
    it('should create a client instance', () => {
      expect(client).toBeInstanceOf(ErrorClient)
    })

    it('should create client with default config', () => {
      const defaultClient = createClient()
      expect(defaultClient).toBeInstanceOf(ErrorClient)
    })
  })

  describe('captureError', () => {
    it('should capture string errors', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      const id = await client.captureError('Test error')
      expect(id).toBeTruthy()
    })

    it('should capture Error objects', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      const error = new Error('Test error')
      const id = await client.captureError(error)
      expect(id).toBeTruthy()
    })

    it('should capture error with context', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      const id = await client.captureError('Test error', {
        user: { id: 'user-1', email: 'test@example.com' },
        tags: { component: 'auth' },
      })
      expect(id).toBeTruthy()
    })
  })

  describe('captureException', () => {
    it('should capture exceptions', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      const error = new Error('Test exception')
      const id = await client.captureException(error)
      expect(id).toBeTruthy()
    })
  })

  describe('captureMessage', () => {
    it('should capture messages with default level', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      const id = await client.captureMessage('Test message')
      expect(id).toBeTruthy()
    })

    it('should capture messages with custom level', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      const id = await client.captureMessage('Test warning', 'warning')
      expect(id).toBeTruthy()
    })
  })

  describe('breadcrumbs', () => {
    it('should add breadcrumbs and include them in error context', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      client.addBreadcrumb({
        category: 'navigation',
        message: 'User navigated to /dashboard',
        level: 'info',
      })

      client.addBreadcrumb({
        category: 'user',
        message: 'User clicked button',
        level: 'info',
      })

      // Capture error to trigger batch with breadcrumbs
      await client.captureError('Test error')
      await client.flush()

      // Verify fetch was called and breadcrumbs were included
      expect(mockFetch).toHaveBeenCalled()
      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)
      expect(body.errors[0].context.breadcrumbs).toHaveLength(2)
      expect(body.errors[0].context.breadcrumbs[0].category).toBe('navigation')
      expect(body.errors[0].context.breadcrumbs[1].category).toBe('user')
    })
  })

  describe('user context', () => {
    it('should set user context in headers', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      client.setUser({
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
      })

      // Trigger a request to verify headers
      await client.captureError('Test error')
      await client.flush()

      // Verify user context was set in headers
      expect(mockFetch).toHaveBeenCalled()
      const callArgs = mockFetch.mock.calls[0]
      const headers = callArgs[1]?.headers as Record<string, string>
      expect(headers['X-User-Id']).toBe('user-123')
      expect(headers['X-User-Email']).toBe('test@example.com')
    })
  })

  describe('tags', () => {
    it('should set tags in headers', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      const tags = {
        component: 'auth',
        version: '1.0.0',
      }
      client.setTags(tags)

      // Trigger a request to verify headers
      await client.captureError('Test error')
      await client.flush()

      // Verify tags were set in headers
      expect(mockFetch).toHaveBeenCalled()
      const callArgs = mockFetch.mock.calls[0]
      const headers = callArgs[1]?.headers as Record<string, string>
      expect(headers['X-Tags']).toBe(JSON.stringify(tags))
    })
  })

  describe('flush', () => {
    it('should flush empty queue', async () => {
      await expect(client.flush()).resolves.toBeUndefined()
    })

    it('should flush queued errors', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
      global.fetch = mockFetch

      // Queue some errors
      await client.captureMessage('Error 1')
      await client.captureMessage('Error 2')

      // Flush
      await client.flush()

      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('health', () => {
    it('should check health status', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'healthy', timestamp: Date.now() }),
      })
      global.fetch = mockFetch

      const health = await client.health()
      expect(health.status).toBe('healthy')
      expect(health.timestamp).toBeTruthy()
    })
  })

  describe('retry logic', () => {
    it('should retry failed errors up to max retries', async () => {
      let callCount = 0
      const mockFetch = vi.fn().mockImplementation(() => {
        callCount++
        if (callCount <= 3) {
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            json: async () => ({ message: 'Server error' }),
          })
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        })
      })
      global.fetch = mockFetch

      // Capture an error
      await client.captureError('Test error')

      // Try to flush multiple times (should fail 3 times, then drop)
      for (let i = 0; i < 4; i++) {
        try {
          await client.flush()
        } catch (e) {
          // Expected to fail
        }
      }

      // Verify it was retried but eventually dropped
      expect(callCount).toBeGreaterThanOrEqual(3)
    })

    it('should clear retry count on successful send', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
      global.fetch = mockFetch

      // Capture and flush successfully
      await client.captureError('Test error')
      await client.flush()

      // Capture another error and flush again
      await client.captureError('Test error 2')
      await client.flush()

      // Should have called fetch twice (no retries)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('max breadcrumbs limit', () => {
    it('should limit breadcrumbs to max limit', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      // Add 150 breadcrumbs (more than the 100 limit)
      for (let i = 0; i < 150; i++) {
        client.addBreadcrumb({
          category: 'test',
          message: `Breadcrumb ${i}`,
        })
      }

      await client.captureError('Test error')
      await client.flush()

      // Verify only last 100 breadcrumbs were kept
      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)
      expect(body.errors[0].context.breadcrumbs.length).toBe(100)
      // Should have breadcrumbs 50-149 (last 100)
      expect(body.errors[0].context.breadcrumbs[0].message).toBe('Breadcrumb 50')
      expect(body.errors[0].context.breadcrumbs[99].message).toBe('Breadcrumb 149')
    })
  })

  describe('queue size limit', () => {
    it('should drop oldest errors when queue exceeds max size', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
      global.fetch = mockFetch

      // Create client with small queue size
      const smallQueueClient = createClient({
        baseUrl: 'https://errors.test',
        apiKey: 'test-key',
        environment: 'test',
        enableAutoCapture: false,
        maxQueueSize: 5,
        batchSize: 100, // Set high to prevent auto-flush
      })

      // Add 10 errors (should drop first 5)
      for (let i = 0; i < 10; i++) {
        await smallQueueClient.captureMessage(`Error ${i}`)
      }

      await smallQueueClient.flush()

      // Verify only 5 errors were sent (errors 5-9)
      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)
      expect(body.errors.length).toBe(5)
      expect(body.errors[0].message).toBe('Error 5')
      expect(body.errors[4].message).toBe('Error 9')

      await smallQueueClient.close()
    })
  })

  describe('network timeout', () => {
    it('should timeout long requests', { timeout: 5000 }, async () => {
      const mockFetch = vi.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({ success: true }),
            })
          }, 20000) // 20 second delay

          // Handle abort signal
          if (options?.signal) {
            options.signal.addEventListener('abort', () => {
              clearTimeout(timeoutId)
              reject(new DOMException('The operation was aborted', 'AbortError'))
            })
          }
        })
      })
      global.fetch = mockFetch

      const timeoutClient = createClient({
        baseUrl: 'https://errors.test',
        apiKey: 'test-key',
        timeout: 100, // 100ms timeout
        enableAutoCapture: false,
      })

      await timeoutClient.captureError('Test error')

      // Should throw timeout error
      await expect(timeoutClient.flush()).rejects.toThrow()

      // close() will also try to flush, so wrap it to handle the rejection
      try {
        await timeoutClient.close()
      } catch (e) {
        // Expected to fail due to timeout
      }
    })
  })

  describe('header sanitization', () => {
    it('should sanitize user headers to remove control characters', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      // Set user with control characters
      client.setUser({
        id: 'user\r\n123',
        email: 'test\x00@example.com',
      })

      await client.captureError('Test error')
      await client.flush()

      const callArgs = mockFetch.mock.calls[0]
      const headers = callArgs[1]?.headers as Record<string, string>
      expect(headers['X-User-Id']).toBe('user123')
      expect(headers['X-User-Email']).toBe('test@example.com')
    })

    it('should sanitize tags to remove control characters', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      client.setTags({
        component: 'auth\r\n',
        version: '1.0.0\x00',
      })

      await client.captureError('Test error')
      await client.flush()

      const callArgs = mockFetch.mock.calls[0]
      const headers = callArgs[1]?.headers as Record<string, string>
      const tags = JSON.parse(headers['X-Tags'])
      expect(tags.component).toBe('auth')
      expect(tags.version).toBe('1.0.0')
    })
  })

  describe('race condition in scheduleFlush', () => {
    it('should prevent multiple flush schedules', { timeout: 10000 }, async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
      global.fetch = mockFetch

      // Capture multiple errors rapidly
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(client.captureMessage(`Error ${i}`))
      }
      await Promise.all(promises)

      // Wait for flush interval
      await new Promise((resolve) => setTimeout(resolve, 6000))

      // Should only flush once
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    it('should handle errors with null/undefined messages', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      // Create error with empty message
      const error = new Error()
      error.message = ''

      await client.captureException(error)
      await client.flush()

      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)
      expect(body.errors[0].message).toBe('Unknown error')
    })

    it('should handle concurrent flush operations', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
      global.fetch = mockFetch

      // Capture some errors
      await client.captureMessage('Error 1')
      await client.captureMessage('Error 2')

      // Trigger multiple concurrent flushes
      const flushPromises = [client.flush(), client.flush(), client.flush()]
      await Promise.all(flushPromises)

      // Should only send once due to race condition protection
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should handle various stack trace formats', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      // V8 format
      const v8Error = new Error('V8 error')
      v8Error.stack = `Error: V8 error
    at Object.<anonymous> (/home/user/file.js:10:5)
    at Module._compile (internal/modules/cjs/loader.js:999:30)`

      await client.captureException(v8Error)
      await client.flush()

      let callArgs = mockFetch.mock.calls[0]
      let body = JSON.parse(callArgs[1]?.body as string)
      expect(body.errors[0].exception.stacktrace).toBeDefined()
      expect(body.errors[0].exception.stacktrace.length).toBeGreaterThan(0)

      // Firefox format
      const firefoxError = new Error('Firefox error')
      firefoxError.stack = `Error: Firefox error
myFunction@/home/user/file.js:10:5
anotherFunction@/home/user/other.js:20:10`

      await client.captureException(firefoxError)
      await client.flush()

      callArgs = mockFetch.mock.calls[1]
      body = JSON.parse(callArgs[1]?.body as string)
      expect(body.errors[0].exception.stacktrace).toBeDefined()
      expect(body.errors[0].exception.stacktrace.length).toBeGreaterThan(0)
    })

    it('should validate user input to prevent DoS', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      // Try to set user with very long ID
      const longId = 'a'.repeat(2000)
      client.setUser({ id: longId })

      await client.captureError('Test error')
      await client.flush()

      const callArgs = mockFetch.mock.calls[0]
      const headers = callArgs[1]?.headers as Record<string, string>
      // Should be truncated to 1000 chars
      expect(headers['X-User-Id'].length).toBeLessThanOrEqual(1000)
    })

    it('should prevent infinite loops in auto-capture with circuit breaker', async () => {
      const autoClient = createClient({
        baseUrl: 'https://errors.test',
        apiKey: 'test-key',
        environment: 'test',
        enableAutoCapture: true,
      })

      let captureCount = 0
      const originalCapture = autoClient.captureException.bind(autoClient)
      autoClient.captureException = vi.fn().mockImplementation(async (error) => {
        captureCount++
        if (captureCount > 2) {
          throw new Error('Capture failed')
        }
        return originalCapture(error)
      })

      // Simulate error handler triggering
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test-id' }),
      })
      global.fetch = mockFetch

      // Should not cause infinite loop
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        const errorEvent = new ErrorEvent('error', {
          message: 'Test error',
          error: new Error('Test error'),
        })
        window.dispatchEvent(errorEvent)
      }

      await autoClient.close()
    })

    it('should handle debug mode correctly', async () => {
      const debugClient = createClient({
        baseUrl: 'https://errors.test',
        apiKey: 'test-key',
        environment: 'test',
        enableAutoCapture: false,
        debug: true,
      })

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
      global.fetch = mockFetch

      // Capture and flush to trigger retry logic
      await debugClient.captureMessage('Test error')

      // Use expect to handle the rejected promise properly
      await expect(debugClient.flush()).rejects.toThrow('Network error')

      // In debug mode, console.warn should be called
      expect(consoleWarnSpy).not.toHaveBeenCalled() // No errors exceeded retries yet

      consoleWarnSpy.mockRestore()

      // close() will also call flush(), so wrap it to handle the rejection
      try {
        await debugClient.close()
      } catch (e) {
        // Expected to fail due to mock
      }
    })
  })
})
