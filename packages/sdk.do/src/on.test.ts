/**
 * Tests for OnService
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { createOnService } from './on'
import { createBusinessEvent, createPerson, createLocation } from 'graphdl'

describe('OnService', () => {
  let onService: ReturnType<typeof createOnService>

  beforeEach(() => {
    onService = createOnService()
    onService.clear()
  })

  describe('Basic event listening', () => {
    it('should register and execute handler for simple pattern', async () => {
      let eventReceived: any = null

      const listenerId = onService('Order.created', async (event) => {
        eventReceived = event
      })

      expect(listenerId).toBeTruthy()

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123', total: 100 },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      await onService.emit(testEvent)

      expect(eventReceived).toBeTruthy()
      expect(eventReceived.what.id).toBe('order_123')
    })

    it('should support regex patterns', async () => {
      let eventCount = 0

      onService(/Order\.(created|updated)/, async () => {
        eventCount++
      })

      const createdEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      createdEvent.metadata = { action: 'created' }

      const updatedEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-update' },
        how: { method: 'api' },
      })
      updatedEvent.metadata = { action: 'updated' }

      await onService.emit(createdEvent)
      await onService.emit(updatedEvent)

      expect(eventCount).toBe(2)
    })

    it('should support custom filter functions', async () => {
      let highValueOrdersCount = 0

      onService(
        (event) => {
          return (event.what as any).total > 1000
        },
        async () => {
          highValueOrdersCount++
        }
      )

      const lowValueOrder = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', total: 50 },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })

      const highValueOrder = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', total: 5000 },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })

      await onService.emit(lowValueOrder)
      await onService.emit(highValueOrder)

      expect(highValueOrdersCount).toBe(1)
    })
  })

  describe('Event filters', () => {
    it('should filter by actor type', async () => {
      let agentEventsCount = 0

      onService(
        'Order.created',
        async () => {
          agentEventsCount++
        },
        {
          who: { $type: 'Agent' },
        }
      )

      const personEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'test' },
        how: { method: 'api' },
      })
      personEvent.metadata = { action: 'created' }

      const agentEvent = createBusinessEvent({
        who: { $type: 'Agent', $id: 'agent_123', role: 'sdr', name: 'SDR Agent' },
        what: { $type: 'Order' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'test' },
        how: { method: 'automated' },
      })
      agentEvent.metadata = { action: 'created' }

      await onService.emit(personEvent)
      await onService.emit(agentEvent)

      expect(agentEventsCount).toBe(1)
    })

    it('should filter by method', async () => {
      let apiEventsCount = 0

      onService(
        'Order.created',
        async () => {
          apiEventsCount++
        },
        {
          how: { method: 'api' },
        }
      )

      const apiEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'test' },
        how: { method: 'api' },
      })
      apiEvent.metadata = { action: 'created' }

      const manualEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'test' },
        how: { method: 'manual' },
      })
      manualEvent.metadata = { action: 'created' }

      await onService.emit(apiEvent)
      await onService.emit(manualEvent)

      expect(apiEventsCount).toBe(1)
    })
  })

  describe('Listener management', () => {
    it('should unregister listeners', async () => {
      let eventCount = 0

      const listenerId = onService('Order.created', async () => {
        eventCount++
      })

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'test' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      await onService.emit(testEvent)
      expect(eventCount).toBe(1)

      onService.off(listenerId)
      await onService.emit(testEvent)
      expect(eventCount).toBe(1) // Should not increment
    })

    it('should support maxExecutions option', async () => {
      let eventCount = 0

      onService(
        'Order.created',
        async () => {
          eventCount++
        },
        {
          maxExecutions: 2,
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'test' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      await onService.emit(testEvent)
      await onService.emit(testEvent)
      await onService.emit(testEvent)

      expect(eventCount).toBe(2) // Should stop after 2 executions
    })

    it('should execute handlers in priority order', async () => {
      const executionOrder: number[] = []

      onService(
        'Order.created',
        async () => {
          executionOrder.push(1)
        },
        { priority: 1 }
      )

      onService(
        'Order.created',
        async () => {
          executionOrder.push(3)
        },
        { priority: 3 }
      )

      onService(
        'Order.created',
        async () => {
          executionOrder.push(2)
        },
        { priority: 2 }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'test' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      await onService.emit(testEvent)

      expect(executionOrder).toEqual([3, 2, 1]) // Higher priority first
    })
  })

  describe('Ontology integrations', () => {
    it('should support Zapier trigger patterns', async () => {
      let triggerCount = 0

      onService.zapier.trigger('gmail', 'New Email', async () => {
        triggerCount++
      })

      const zapierEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Email', subject: 'Test' },
        where: createLocation({ digital: { platform: 'gmail' } }),
        why: { reason: 'email-received' },
        how: { method: 'api' },
      })
      zapierEvent.metadata = {
        source: 'zapier',
        app: 'gmail',
        trigger: 'New Email',
      }

      await onService.emit(zapierEvent)
      expect(triggerCount).toBe(1)
    })

    it('should support NAICS sector filtering', async () => {
      let financeEventsCount = 0

      onService.naics.sector('52', async () => {
        financeEventsCount++
      })

      const financeEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Transaction' },
        where: createLocation({ digital: { platform: 'banking-app' } }),
        why: { reason: 'payment' },
        how: { method: 'api' },
      })
      financeEvent.metadata = { naics: '522110' } // Commercial Banking

      const retailEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Sale' },
        where: createLocation({ digital: { platform: 'store' } }),
        why: { reason: 'purchase' },
        how: { method: 'api' },
      })
      retailEvent.metadata = { naics: '445110' } // Supermarkets

      await onService.emit(financeEvent)
      await onService.emit(retailEvent)

      expect(financeEventsCount).toBe(1)
    })

    it('should support O*NET occupation filtering', async () => {
      let developerEventsCount = 0

      onService.onet.occupation('15-1252.00', async () => {
        developerEventsCount++
      })

      const developerEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'CodeCommit' },
        where: createLocation({ digital: { platform: 'github' } }),
        why: { reason: 'feature-implementation' },
        how: { method: 'manual' },
      })
      developerEvent.metadata = { onetCode: '15-1252.00' }

      const designerEvent = createBusinessEvent({
        who: createPerson({ id: 'user_456', name: 'Jane Smith' }),
        what: { $type: 'DesignAsset' },
        where: createLocation({ digital: { platform: 'figma' } }),
        why: { reason: 'ui-design' },
        how: { method: 'manual' },
      })
      designerEvent.metadata = { onetCode: '27-1024.00' }

      await onService.emit(developerEvent)
      await onService.emit(designerEvent)

      expect(developerEventsCount).toBe(1)
    })
  })

  describe('Advanced features', () => {
    it('should support async filter functions', async () => {
      let asyncFilterCount = 0

      onService(
        async (event) => {
          // Simulate async check (e.g., database lookup)
          await new Promise((resolve) => setTimeout(resolve, 10))
          return (event.what as any).total > 1000
        },
        async () => {
          asyncFilterCount++
        }
      )

      const highValueOrder = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', total: 5000 },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })

      const lowValueOrder = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', total: 50 },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })

      await onService.emit(highValueOrder)
      await onService.emit(lowValueOrder)

      expect(asyncFilterCount).toBe(1)
    })

    it('should support before middleware', async () => {
      let processedValue: any = null

      onService(
        'Order.created',
        async (event) => {
          processedValue = event.metadata.processed
        },
        {
          before: (event) => {
            event.metadata.processed = true
            return event
          },
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      await onService.emit(testEvent)

      expect(processedValue).toBe(true)
    })

    it('should support after middleware', async () => {
      let afterCalled = false

      onService(
        'Order.created',
        async () => {
          return 'handler-result'
        },
        {
          after: (event, result) => {
            afterCalled = true
            expect(result).toBe('handler-result')
          },
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      await onService.emit(testEvent)

      expect(afterCalled).toBe(true)
    })

    it('should handle timeouts', async () => {
      onService(
        'Order.created',
        async () => {
          // Simulate long-running handler
          await new Promise((resolve) => setTimeout(resolve, 200))
        },
        {
          timeout: 50, // 50ms timeout
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      const results = await onService.emit(testEvent)

      expect(results.length).toBe(1)
      expect(results[0].success).toBe(false)
      expect(results[0].timedOut).toBe(true)
    })

    it('should call onError callback', async () => {
      let errorCalled = false
      let capturedError: Error | null = null

      onService(
        'Order.created',
        async () => {
          throw new Error('Test error')
        },
        {
          onError: (listenerId, error, event) => {
            errorCalled = true
            capturedError = error
          },
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      const results = await onService.emit(testEvent)

      expect(errorCalled).toBe(true)
      expect(capturedError?.message).toBe('Test error')
      expect(results[0].success).toBe(false)
    })

    it('should support listener groups', async () => {
      let analyticsCount = 0
      let billingCount = 0

      onService('Order.created', async () => analyticsCount++, { group: 'analytics' })
      onService('Payment.completed', async () => analyticsCount++, { group: 'analytics' })
      onService('Invoice.generated', async () => billingCount++, { group: 'billing' })

      // Remove analytics group
      const removed = onService.offGroup('analytics')
      expect(removed).toBe(2)

      // Emit events
      const orderEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      orderEvent.metadata = { action: 'created' }

      const invoiceEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Invoice', id: 'invoice_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'billing' },
        how: { method: 'api' },
      })
      invoiceEvent.metadata = { action: 'generated' }

      await onService.emit(orderEvent)
      await onService.emit(invoiceEvent)

      expect(analyticsCount).toBe(0) // Group was removed
      expect(billingCount).toBe(1)
    })
  })

  describe('Security features', () => {
    it('should enforce max listeners per pattern', () => {
      const limitedService = createOnService({
        maxListenersPerPattern: 2,
      })

      limitedService('Order.created', async () => {})
      limitedService('Order.created', async () => {})

      expect(() => {
        limitedService('Order.created', async () => {})
      }).toThrow(/Maximum listeners per pattern/)
    })

    it('should enforce max total listeners', () => {
      const limitedService = createOnService({
        maxTotalListeners: 2,
      })

      limitedService('Order.created', async () => {})
      limitedService('Payment.completed', async () => {})

      expect(() => {
        limitedService('Invoice.generated', async () => {})
      }).toThrow(/Maximum total listeners/)
    })

    it('should validate regex complexity', () => {
      const limitedService = createOnService({
        maxRegexComplexity: 5,
      })

      // Simple regex should work
      limitedService(/Order\.created/, async () => {})

      // Complex regex should fail
      expect(() => {
        limitedService(/(?:(?:(?:(?:(?:(?:a)*)*)*)*)*)*/, async () => {})
      }).toThrow(/Regex pattern too complex/)
    })
  })

  describe('Auto-cleanup options', () => {
    it('should auto-remove listener on error when removeOnError is true', async () => {
      let callCount = 0

      const listenerId = onService(
        'Order.created',
        async () => {
          callCount++
          throw new Error('Test error')
        },
        {
          removeOnError: true,
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      // First emit - handler throws and gets removed
      await onService.emit(testEvent)
      expect(callCount).toBe(1)

      // Second emit - handler should not be called (already removed)
      await onService.emit(testEvent)
      expect(callCount).toBe(1)
    })

    it('should auto-remove listener on timeout when removeOnTimeout is true', async () => {
      let callCount = 0

      const listenerId = onService(
        'Order.created',
        async () => {
          callCount++
          await new Promise((resolve) => setTimeout(resolve, 200))
        },
        {
          timeout: 50,
          removeOnTimeout: true,
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      // First emit - handler times out and gets removed
      const results1 = await onService.emit(testEvent)
      expect(results1[0].timedOut).toBe(true)
      expect(callCount).toBe(1)

      // Second emit - handler should not be called (already removed)
      const results2 = await onService.emit(testEvent)
      expect(results2.length).toBe(0)
      expect(callCount).toBe(1)
    })

    it('should not auto-remove listener on error when removeOnError is false', async () => {
      let callCount = 0

      onService(
        'Order.created',
        async () => {
          callCount++
          throw new Error('Test error')
        },
        {
          removeOnError: false,
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      // Both emits should call handler
      await onService.emit(testEvent)
      await onService.emit(testEvent)
      expect(callCount).toBe(2)
    })
  })

  describe('Async filter error handling', () => {
    it('should handle async filter errors gracefully', async () => {
      let handlerCalled = false

      onService(
        async () => {
          throw new Error('Filter error')
        },
        async () => {
          handlerCalled = true
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      // Should not throw, event should be rejected by filter error
      await expect(onService.emit(testEvent)).rejects.toThrow('Filter error')
      expect(handlerCalled).toBe(false)
    })

    it('should handle async filter returning false', async () => {
      let handlerCalled = false

      onService(
        async () => {
          return false
        },
        async () => {
          handlerCalled = true
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      const results = await onService.emit(testEvent)
      expect(results.length).toBe(0)
      expect(handlerCalled).toBe(false)
    })
  })

  describe('Concurrent execution', () => {
    it('should handle concurrent event emissions safely', async () => {
      let executionCount = 0
      const executionOrder: number[] = []

      onService('Order.created', async (event) => {
        const count = ++executionCount
        executionOrder.push(count)
        // Simulate async work
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 50))
      })

      const createEvent = (id: string) =>
        createBusinessEvent({
          who: createPerson({ id: 'user_123', name: 'John Doe' }),
          what: { $type: 'Order', id },
          where: createLocation({ digital: { platform: 'web' } }),
          why: { reason: 'customer-purchase' },
          how: { method: 'api' },
        })

      const event1 = createEvent('order_1')
      event1.metadata = { action: 'created' }
      const event2 = createEvent('order_2')
      event2.metadata = { action: 'created' }
      const event3 = createEvent('order_3')
      event3.metadata = { action: 'created' }

      // Emit events concurrently
      const results = await Promise.all([onService.emit(event1), onService.emit(event2), onService.emit(event3)])

      // All events should have been processed
      expect(executionCount).toBe(3)
      expect(results.every((r) => r[0].success)).toBe(true)
    })
  })

  describe('Middleware error handling', () => {
    it('should handle errors in before middleware', async () => {
      let handlerCalled = false

      onService(
        'Order.created',
        async () => {
          handlerCalled = true
        },
        {
          before: () => {
            throw new Error('Middleware error')
          },
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      const results = await onService.emit(testEvent)

      expect(results[0].success).toBe(false)
      expect(results[0].error?.message).toBe('Middleware error')
      expect(handlerCalled).toBe(false)
    })

    it('should handle errors in after middleware', async () => {
      let handlerCalled = false
      let afterError: Error | null = null

      onService(
        'Order.created',
        async () => {
          handlerCalled = true
        },
        {
          after: () => {
            throw new Error('After middleware error')
          },
          onError: (listenerId, error) => {
            afterError = error
          },
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      const results = await onService.emit(testEvent)

      expect(handlerCalled).toBe(true)
      // After middleware errors should be caught
      expect(results[0].success).toBe(false)
      expect(afterError?.message).toBe('After middleware error')
    })
  })

  describe('Edge cases', () => {
    it('should handle event with missing metadata.action', async () => {
      let handlerCalled = false

      onService('Order.created', async () => {
        handlerCalled = true
      })

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      // No metadata.action set

      const results = await onService.emit(testEvent)
      expect(results.length).toBe(0)
      expect(handlerCalled).toBe(false)
    })

    it('should handle event with missing what.$type', async () => {
      let handlerCalled = false

      onService('Order.created', async () => {
        handlerCalled = true
      })

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { id: 'order_123' }, // No $type
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      const results = await onService.emit(testEvent)
      expect(results.length).toBe(0)
      expect(handlerCalled).toBe(false)
    })

    it('should handle listeners with same priority', async () => {
      const executionOrder: string[] = []

      onService(
        'Order.created',
        async () => {
          executionOrder.push('listener1')
        },
        { priority: 10 }
      )

      onService(
        'Order.created',
        async () => {
          executionOrder.push('listener2')
        },
        { priority: 10 }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      await onService.emit(testEvent)
      expect(executionOrder.length).toBe(2)
      // Both should execute, order doesn't matter when priorities are equal
    })

    it('should handle global regex patterns correctly', async () => {
      let eventCount = 0

      // Global flag should be handled properly
      onService(/Order/g, async () => {
        eventCount++
      })

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      // Emit multiple times to test global regex state handling
      await onService.emit(testEvent)
      await onService.emit(testEvent)
      await onService.emit(testEvent)

      expect(eventCount).toBe(3)
    })

    it('should propagate errors from filter functions during pattern matching', async () => {
      // Register listener with filter function that throws
      onService(
        () => {
          throw new Error('Filter explosion')
        },
        async () => {
          // This handler should never be called
        }
      )

      const testEvent = createBusinessEvent({
        who: createPerson({ id: 'user_123', name: 'John Doe' }),
        what: { $type: 'Order', id: 'order_123' },
        where: createLocation({ digital: { platform: 'web' } }),
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
      })
      testEvent.metadata = { action: 'created' }

      // Event emission should fail due to filter error
      await expect(onService.emit(testEvent)).rejects.toThrow('Filter explosion')
    })

    it('should reject nested filter objects', () => {
      // Nested filter should be rejected at registration time
      expect(() => {
        onService('Order.created', async () => {}, {
          who: {
            metadata: { nested: 'value' }, // Nested object not allowed
          },
        })
      }).toThrow(/Nested object filters are not supported/)
    })
  })
})
