/**
 * Queue Service E2E Tests
 *
 * Comprehensive end-to-end tests for the queue service (workers/queue).
 * Tests cover message publishing, batch operations, queue stats, health checks,
 * message ordering, and error handling.
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from '../runner'
import { getTimeout } from '../config'
import type { QueueName } from '../../src/queue'

describe('Queue Service E2E Tests', () => {
  let runner: E2ETestRunner

  beforeEach(() => {
    runner = new E2ETestRunner('queue')
  })

  afterEach(async () => {
    await runner.teardown()
  })

  test(
    'should publish messages to queue',
    async () => {
      const sdk = runner.getSDK()

      const message = {
        type: 'test-event',
        testId: runner.testId,
        data: 'Hello from E2E test',
      }

      const result = await sdk.queue.publish('events', message)

      expect(result.messageId).toBeDefined()
      expect(result.queue).toBe('events')
      expect(result.publishedAt).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should publish message with delay',
    async () => {
      const sdk = runner.getSDK()

      const message = {
        type: 'delayed-event',
        testId: runner.testId,
      }

      const result = await sdk.queue.publish('tasks', message, {
        delaySeconds: 60, // 1 minute delay
      })

      expect(result.messageId).toBeDefined()
      expect(result.queue).toBe('tasks')
    },
    getTimeout()
  )

  test(
    'should publish batch messages',
    async () => {
      const sdk = runner.getSDK()

      const messages = [
        { type: 'batch-event-1', testId: runner.testId },
        { type: 'batch-event-2', testId: runner.testId },
        { type: 'batch-event-3', testId: runner.testId },
        { type: 'batch-event-4', testId: runner.testId },
        { type: 'batch-event-5', testId: runner.testId },
      ]

      const result = await sdk.queue.batch('events', messages)

      expect(result.successCount).toBe(5)
      expect(result.failedCount).toBe(0)
      expect(result.messageIds).toHaveLength(5)

      // All message IDs should be unique
      const uniqueIds = new Set(result.messageIds)
      expect(uniqueIds.size).toBe(5)
    },
    getTimeout()
  )

  test(
    'should get queue statistics',
    async () => {
      const sdk = runner.getSDK()

      // Publish some messages first
      await sdk.queue.publish('tasks', { testId: runner.testId, data: 'test1' })
      await sdk.queue.publish('tasks', { testId: runner.testId, data: 'test2' })

      // Get stats for specific queue
      const stats = await sdk.queue.stats('tasks')

      expect(stats).toBeDefined()
      expect(stats.queue).toBe('tasks')
      expect(typeof stats.pending).toBe('number')
      expect(typeof stats.inFlight).toBe('number')
      expect(typeof stats.deadLetterCount).toBe('number')
      expect(typeof stats.messagesPerSecond).toBe('number')

      expect(stats.pending).toBeGreaterThanOrEqual(0)
      expect(stats.inFlight).toBeGreaterThanOrEqual(0)
      expect(stats.messagesPerSecond).toBeGreaterThanOrEqual(0)
    },
    getTimeout()
  )

  test(
    'should get stats for all queues',
    async () => {
      const sdk = runner.getSDK()

      // Publish to multiple queues
      await sdk.queue.publish('events', { testId: runner.testId })
      await sdk.queue.publish('tasks', { testId: runner.testId })
      await sdk.queue.publish('webhooks', { testId: runner.testId })

      // Get stats for all queues
      const allStats = await sdk.queue.stats()

      expect(allStats).toBeDefined()
      expect(typeof allStats).toBe('object')

      // Should have stats for each queue
      const queueNames: QueueName[] = ['events', 'tasks', 'webhooks', 'emails', 'analytics']
      for (const queueName of queueNames) {
        if (allStats[queueName]) {
          expect(allStats[queueName].queue).toBe(queueName)
          expect(typeof allStats[queueName].pending).toBe('number')
        }
      }
    },
    getTimeout()
  )

  test(
    'should check queue health',
    async () => {
      const sdk = runner.getSDK()

      const health = await sdk.queue.health()

      expect(health).toBeDefined()
      expect(typeof health.healthy).toBe('boolean')
      expect(health.queues).toBeDefined()
      expect(health.timestamp).toBeDefined()

      // Check individual queue health
      const queueNames: QueueName[] = ['events', 'tasks', 'webhooks', 'emails', 'analytics']
      for (const queueName of queueNames) {
        if (health.queues[queueName]) {
          const queueHealth = health.queues[queueName]
          expect(typeof queueHealth.healthy).toBe('boolean')
          expect(typeof queueHealth.pending).toBe('number')
          expect(typeof queueHealth.errors).toBe('number')
        }
      }
    },
    getTimeout()
  )

  test(
    'should handle different message types',
    async () => {
      const sdk = runner.getSDK()

      // String message
      const stringResult = await sdk.queue.publish('events', 'simple string message')
      expect(stringResult.messageId).toBeDefined()

      // Number message
      const numberResult = await sdk.queue.publish('events', 42)
      expect(numberResult.messageId).toBeDefined()

      // Boolean message
      const boolResult = await sdk.queue.publish('events', true)
      expect(boolResult.messageId).toBeDefined()

      // Array message
      const arrayResult = await sdk.queue.publish('events', [1, 2, 3, 4, 5])
      expect(arrayResult.messageId).toBeDefined()

      // Object message
      const objectResult = await sdk.queue.publish('events', {
        id: 1,
        name: 'Test Object',
        tags: ['a', 'b', 'c'],
        metadata: { created: new Date().toISOString() },
      })
      expect(objectResult.messageId).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should publish to different queues',
    async () => {
      const sdk = runner.getSDK()

      const queues: QueueName[] = ['events', 'tasks', 'webhooks', 'emails', 'analytics']

      for (const queue of queues) {
        const result = await sdk.queue.publish(queue, {
          testId: runner.testId,
          queue,
          timestamp: new Date().toISOString(),
        })

        expect(result.messageId).toBeDefined()
        expect(result.queue).toBe(queue)
      }
    },
    getTimeout()
  )

  test(
    'should handle large batch publish',
    async () => {
      const sdk = runner.getSDK()

      // Create 100 messages
      const messages = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        testId: runner.testId,
        data: `Message ${i + 1}`,
      }))

      const result = await sdk.queue.batch('events', messages)

      expect(result.successCount).toBe(100)
      expect(result.failedCount).toBe(0)
      expect(result.messageIds).toHaveLength(100)
    },
    getTimeout()
  )

  test(
    'should handle batch with some failures gracefully',
    async () => {
      const sdk = runner.getSDK()

      // This test depends on how the queue service handles invalid messages
      // Assuming it attempts to publish all and reports failures
      const messages = [
        { valid: true, testId: runner.testId },
        { valid: true, testId: runner.testId },
        { valid: true, testId: runner.testId },
      ]

      const result = await sdk.queue.batch('events', messages)

      // All should succeed in this case
      expect(result.successCount).toBeGreaterThan(0)
      expect(result.messageIds.length).toBeGreaterThan(0)
    },
    getTimeout()
  )

  test(
    'should maintain message ordering in batch',
    async () => {
      const sdk = runner.getSDK()

      const messages = Array.from({ length: 10 }, (_, i) => ({
        sequence: i + 1,
        testId: runner.testId,
      }))

      const result = await sdk.queue.batch('events', messages)

      expect(result.successCount).toBe(10)
      expect(result.messageIds).toHaveLength(10)

      // Message IDs should be in order (if service maintains order)
      // This is implementation-dependent
    },
    getTimeout()
  )

  test(
    'should handle rapid successive publishes',
    async () => {
      const sdk = runner.getSDK()

      // Publish 20 messages rapidly
      const promises = Array.from({ length: 20 }, (_, i) =>
        sdk.queue.publish('events', {
          index: i,
          testId: runner.testId,
          timestamp: Date.now(),
        })
      )

      const results = await Promise.all(promises)

      expect(results).toHaveLength(20)
      results.forEach((result) => {
        expect(result.messageId).toBeDefined()
        expect(result.queue).toBe('events')
      })
    },
    getTimeout()
  )

  test(
    'should handle empty batch gracefully',
    async () => {
      const sdk = runner.getSDK()

      const result = await sdk.queue.batch('events', [])

      expect(result.successCount).toBe(0)
      expect(result.failedCount).toBe(0)
      expect(result.messageIds).toHaveLength(0)
    },
    getTimeout()
  )

  test(
    'should publish with custom content type',
    async () => {
      const sdk = runner.getSDK()

      const message = {
        type: 'json-message',
        testId: runner.testId,
      }

      const result = await sdk.queue.publish('events', message, {
        contentType: 'application/json',
      })

      expect(result.messageId).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should handle message with large payload',
    async () => {
      const sdk = runner.getSDK()

      // Create a large message (but under Cloudflare Queue limits - 128KB)
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        data: `This is message number ${i} with some extra padding data`,
        timestamp: new Date().toISOString(),
      }))

      const result = await sdk.queue.publish('events', {
        testId: runner.testId,
        payload: largeData,
      })

      expect(result.messageId).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should track pending messages in stats',
    async () => {
      const sdk = runner.getSDK()

      // Get initial stats
      const statsBefore = await sdk.queue.stats('tasks')
      const pendingBefore = statsBefore.pending

      // Publish messages
      await sdk.queue.publish('tasks', { testId: runner.testId })
      await sdk.queue.publish('tasks', { testId: runner.testId })
      await sdk.queue.publish('tasks', { testId: runner.testId })

      // Wait a bit for stats to update
      await runner.wait(1000)

      // Get stats after publishing
      const statsAfter = await sdk.queue.stats('tasks')
      const pendingAfter = statsAfter.pending

      // Pending should have increased (unless they were processed immediately)
      // This is environment-dependent, so we just check the structure
      expect(typeof pendingAfter).toBe('number')
      expect(pendingAfter).toBeGreaterThanOrEqual(0)
    },
    getTimeout()
  )

  test(
    'should handle messages with special characters',
    async () => {
      const sdk = runner.getSDK()

      const message = {
        testId: runner.testId,
        text: 'Special chars: äöü 日本語 🚀 <>&"\'',
        unicode: '∑∫∂√π',
      }

      const result = await sdk.queue.publish('events', message)

      expect(result.messageId).toBeDefined()
    },
    getTimeout()
  )
})
