/**
 * analytics.do SDK - Utils Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  generateMessageId,
  getTimestamp,
  extractUtmParams,
  validateEventName,
  validateUserId,
  enrichContext,
  EventBatcher,
} from '../src/utils'

describe('Utils', () => {
  describe('generateMessageId', () => {
    it('should generate unique message IDs', () => {
      const id1 = generateMessageId()
      const id2 = generateMessageId()

      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(id1).not.toBe(id2)
    })
  })

  describe('getTimestamp', () => {
    it('should return ISO timestamp', () => {
      const timestamp = getTimestamp()
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('extractUtmParams', () => {
    it('should extract UTM parameters from URL', () => {
      const url = 'https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=summer'
      const params = extractUtmParams(url)

      expect(params).toEqual({
        source: 'google',
        medium: 'cpc',
        campaign: 'summer',
      })
    })

    it('should return undefined for URL without UTM params', () => {
      const url = 'https://example.com'
      const params = extractUtmParams(url)

      expect(params).toBeUndefined()
    })

    it('should handle invalid URLs', () => {
      const params = extractUtmParams('not-a-url')
      expect(params).toBeUndefined()
    })
  })

  describe('validateEventName', () => {
    it('should accept valid event names', () => {
      expect(() => validateEventName('button_clicked')).not.toThrow()
      expect(() => validateEventName('Page Viewed')).not.toThrow()
    })

    it('should reject empty event names', () => {
      expect(() => validateEventName('')).toThrow('Event name must be a non-empty string')
    })

    it('should reject long event names', () => {
      const longName = 'a'.repeat(256)
      expect(() => validateEventName(longName)).toThrow(
        'Event name must be less than 255 characters'
      )
    })
  })

  describe('validateUserId', () => {
    it('should accept valid user IDs', () => {
      expect(() => validateUserId('user-123')).not.toThrow()
      expect(() => validateUserId('abc@example.com')).not.toThrow()
    })

    it('should reject empty user IDs', () => {
      expect(() => validateUserId('')).toThrow('User ID must be a non-empty string')
    })

    it('should reject long user IDs', () => {
      const longId = 'a'.repeat(256)
      expect(() => validateUserId(longId)).toThrow('User ID must be less than 255 characters')
    })
  })

  describe('enrichContext', () => {
    it('should add library information', () => {
      const context = enrichContext()

      expect(context.library).toEqual({
        name: 'analytics.do',
        version: '1.0.0',
      })
    })

    it('should preserve existing context', () => {
      const context = enrichContext({
        custom: 'value',
      })

      expect(context.custom).toBe('value')
      expect(context.library).toBeTruthy()
    })
  })

  describe('EventBatcher', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('should batch events and flush on batch size', async () => {
      const flushCallback = vi.fn().mockResolvedValue(undefined)
      const batcher = new EventBatcher(flushCallback, 3, 5000)

      batcher.add({ event: 'test1' })
      batcher.add({ event: 'test2' })
      expect(flushCallback).not.toHaveBeenCalled()

      batcher.add({ event: 'test3' })
      await vi.runAllTimersAsync()

      expect(flushCallback).toHaveBeenCalledWith([
        { event: 'test1' },
        { event: 'test2' },
        { event: 'test3' },
      ])
    })

    it('should flush on timer', async () => {
      const flushCallback = vi.fn().mockResolvedValue(undefined)
      const batcher = new EventBatcher(flushCallback, 100, 1000)

      batcher.add({ event: 'test1' })
      expect(flushCallback).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(1000)

      expect(flushCallback).toHaveBeenCalledWith([{ event: 'test1' }])
    })

    it('should retry failed events up to max retries', async () => {
      let attempts = 0
      const flushCallback = vi.fn().mockImplementation(() => {
        attempts++
        if (attempts < 3) {
          return Promise.reject(new Error('Flush failed'))
        }
        return Promise.resolve()
      })

      const batcher = new EventBatcher(flushCallback, 1, 1000, 3)

      batcher.add({ event: 'test1' })
      await vi.runAllTimersAsync()

      // First attempt fails
      expect(attempts).toBe(1)

      // Trigger retry
      await batcher.flush()
      expect(attempts).toBe(2)

      // Trigger another retry
      await batcher.flush()
      expect(attempts).toBe(3)

      // Should succeed on third attempt
      expect(flushCallback).toHaveBeenCalledTimes(3)
    })

    it('should drop events after max retries', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const flushCallback = vi.fn().mockRejectedValue(new Error('Flush failed'))

      const batcher = new EventBatcher(flushCallback, 1, 1000, 2)

      batcher.add({ event: 'test1' })

      // First attempt
      await expect(batcher.flush()).rejects.toThrow('Flush failed')

      // Second attempt
      await expect(batcher.flush()).rejects.toThrow('Flush failed')

      // Third attempt - event should be dropped
      await expect(batcher.flush()).rejects.toThrow('Flush failed')

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to flush 1 events after 2 retries')
      )

      consoleSpy.mockRestore()
    })

    it('should prevent race conditions during flush', async () => {
      const flushCallback = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )
      const batcher = new EventBatcher(flushCallback, 2, 5000)

      batcher.add({ event: 'test1' })
      batcher.add({ event: 'test2' })

      // Trigger flush
      const flushPromise = batcher.flush()

      // Try to add more events while flushing
      batcher.add({ event: 'test3' })

      await flushPromise
      await vi.advanceTimersByTimeAsync(100)

      // Should only have flushed the first batch
      expect(flushCallback).toHaveBeenCalledTimes(1)
      expect(flushCallback).toHaveBeenCalledWith([{ event: 'test1' }, { event: 'test2' }])
    })

    it('should handle network errors', async () => {
      const flushCallback = vi.fn().mockRejectedValue(new Error('Network error'))
      const batcher = new EventBatcher(flushCallback, 1, 1000, 1)

      batcher.add({ event: 'test1' })

      await expect(batcher.flush()).rejects.toThrow('Network error')
      expect(flushCallback).toHaveBeenCalledTimes(1)
    })

    it('should handle timeout errors', async () => {
      const flushCallback = vi.fn().mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 1000)
          )
      )
      const batcher = new EventBatcher(flushCallback, 1, 1000, 1)

      batcher.add({ event: 'test1' })

      const flushPromise = batcher.flush()
      await vi.advanceTimersByTimeAsync(1000)

      await expect(flushPromise).rejects.toThrow('Request timeout')
    })
  })
})
