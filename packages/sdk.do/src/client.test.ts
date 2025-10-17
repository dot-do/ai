/**
 * Unit tests for RPCClient semantic proxy functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RPCClient, create$ } from './client'

describe('RPCClient', () => {
  let client: RPCClient

  beforeEach(() => {
    client = new RPCClient({ apiKey: 'test-key' })
    global.fetch = vi.fn()
  })

  describe('createSemanticProxy - send', () => {
    it('should construct correct event name for send.Customer.subscribed', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await client.send.Customer.subscribed({ email: 'test@example.com', plan: 'pro' })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apis.do/rpc/send/Customer.subscribed',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-key',
          }),
          body: JSON.stringify({ params: { email: 'test@example.com', plan: 'pro' } }),
        })
      )
    })

    it('should construct correct event name for send.Order.created', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await client.send.Order.created({ orderId: '123', total: 99.99 })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apis.do/rpc/send/Order.created',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ params: { orderId: '123', total: 99.99 } }),
        })
      )
    })

    it('should handle irregular verb patterns (sent, built, made)', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await client.send.Invoice.sent({ invoiceId: 'INV-001' })

      expect(global.fetch).toHaveBeenCalledWith('https://apis.do/rpc/send/Invoice.sent', expect.any(Object))
    })

    it('should handle events without payload', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await client.send.System.started()

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apis.do/rpc/send/System.started',
        expect.objectContaining({
          body: JSON.stringify({ params: undefined }),
        })
      )
    })

    it('should handle multiple arguments', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await client.send.Payment.processed({ amount: 100 }, { metadata: { source: 'stripe' } })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apis.do/rpc/send/Payment.processed',
        expect.objectContaining({
          body: JSON.stringify({ params: [{ amount: 100 }, { metadata: { source: 'stripe' } }] }),
        })
      )
    })
  })

  describe('createSemanticProxy - on', () => {
    it('should construct correct event name for on.Customer.subscribed', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const handler = async (customer: any) => {
        console.log('Customer:', customer)
      }

      await client.on.Customer.subscribed(handler)

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apis.do/rpc/on/Customer.subscribed',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ params: handler }),
        })
      )
    })

    it('should construct correct event name for on.Order.created', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const handler = async (order: any) => {
        console.log('Order:', order)
      }

      await client.on.Order.created(handler)

      expect(global.fetch).toHaveBeenCalledWith('https://apis.do/rpc/on/Order.created', expect.any(Object))
    })

    it('should handle listener registration for irregular verbs', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const handler = async (invoice: any) => {
        console.log('Invoice:', invoice)
      }

      await client.on.Invoice.sent(handler)

      expect(global.fetch).toHaveBeenCalledWith('https://apis.do/rpc/on/Invoice.sent', expect.any(Object))
    })
  })

  describe('error handling', () => {
    it('should throw error when RPC call fails', async () => {
      const mockResponse = { success: false, error: { message: 'Event not found' } }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await expect(client.send.Unknown.event()).rejects.toThrow('Event not found')
    })

    it('should throw generic error when no error message provided', async () => {
      const mockResponse = { success: false }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await expect(client.send.Test.failed()).rejects.toThrow('RPC call failed')
    })

    it('should handle HTTP 404 errors', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(client.send.Unknown.event()).rejects.toThrow('HTTP 404: Not Found')
    })

    it('should handle HTTP 500 errors', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(client.send.Test.action()).rejects.toThrow('HTTP 500: Internal Server Error')
    })

    it('should handle network failures', async () => {
      ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

      await expect(client.send.Test.action()).rejects.toThrow('Network error')
    })

    it('should handle malformed JSON responses', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('Unexpected token')
        },
      })

      await expect(client.send.Test.action()).rejects.toThrow('Unexpected token')
    })
  })

  describe('nested proxy chain', () => {
    it('should create proper nested proxy for Object.action pattern', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      // Test that we can access deeply nested properties
      const orderProxy = client.send.Order
      expect(orderProxy).toBeDefined()

      const createdMethod = orderProxy.created
      expect(createdMethod).toBeDefined()
      expect(typeof createdMethod).toBe('function')

      await createdMethod({ id: '123' })

      expect(global.fetch).toHaveBeenCalledWith('https://apis.do/rpc/send/Order.created', expect.any(Object))
    })

    it('should support any Object name', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      // Test various object names to ensure proxy works dynamically
      await client.send.CustomObject.customAction({ data: 'test' })
      await client.send.Warehouse.inventoryUpdated({ sku: 'ABC123' })
      await client.send.EDI.documentReceived({ type: '850' })

      expect(global.fetch).toHaveBeenCalledTimes(3)
      expect(global.fetch).toHaveBeenCalledWith('https://apis.do/rpc/send/CustomObject.customAction', expect.any(Object))
      expect(global.fetch).toHaveBeenCalledWith('https://apis.do/rpc/send/Warehouse.inventoryUpdated', expect.any(Object))
      expect(global.fetch).toHaveBeenCalledWith('https://apis.do/rpc/send/EDI.documentReceived', expect.any(Object))
    })
  })

  describe('type safety', () => {
    it('should return SendService type for send getter', () => {
      const sendService = client.send
      expect(sendService).toBeDefined()
      // Type assertion to verify it matches SendService interface
      expect(typeof sendService).toBe('object')
    })

    it('should return OnService type for on getter', () => {
      const onService = client.on
      expect(onService).toBeDefined()
      // Type assertion to verify it matches OnService interface
      expect(typeof onService).toBe('object')
    })
  })

  describe('create$ factory function', () => {
    it('should create RuntimeContext with all services', () => {
      const context = create$({ apiKey: 'test-key' })

      expect(context.db).toBeDefined()
      expect(context.ai).toBeDefined()
      expect(context.api).toBeDefined()
      expect(context.auth).toBeDefined()
      expect(context.on).toBeDefined()
      expect(context.send).toBeDefined()
      expect(context.every).toBeDefined()
      expect(context.decide).toBeDefined()
      expect(context.user).toBeDefined()
    })

    it('should include properly typed send service', async () => {
      const context = create$({ apiKey: 'test-key' })
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await context.send.Customer.subscribed({ email: 'test@example.com' })

      expect(global.fetch).toHaveBeenCalledWith('https://apis.do/rpc/send/Customer.subscribed', expect.any(Object))
    })

    it('should include properly typed on service', async () => {
      const context = create$({ apiKey: 'test-key' })
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await context.on.Order.created(async (order) => {
        console.log(order)
      })

      expect(global.fetch).toHaveBeenCalledWith('https://apis.do/rpc/on/Order.created', expect.any(Object))
    })
  })

  describe('constructor options', () => {
    it('should use default baseUrl when not provided', () => {
      const testClient = new RPCClient()
      expect((testClient as any).baseUrl).toBe('https://apis.do')
    })

    it('should use custom baseUrl when provided', () => {
      const testClient = new RPCClient({ baseUrl: 'https://custom.apis.do' })
      expect((testClient as any).baseUrl).toBe('https://custom.apis.do')
    })

    it('should set Authorization header when apiKey provided', () => {
      const testClient = new RPCClient({ apiKey: 'my-api-key' })
      expect((testClient as any).headers.Authorization).toBe('Bearer my-api-key')
    })

    it('should merge custom headers with default headers', () => {
      const testClient = new RPCClient({
        apiKey: 'test-key',
        headers: { 'X-Custom-Header': 'custom-value' },
      })
      expect((testClient as any).headers['Content-Type']).toBe('application/json')
      expect((testClient as any).headers['Authorization']).toBe('Bearer test-key')
      expect((testClient as any).headers['X-Custom-Header']).toBe('custom-value')
    })
  })

  describe('input validation', () => {
    it('should reject object names starting with numbers', async () => {
      await expect(async () => {
        await client.send['123Invalid'].created({})
      }).rejects.toThrow('Invalid object name')
    })

    it('should reject object names with special characters', async () => {
      await expect(async () => {
        await client.send['Invalid-Name'].created({})
      }).rejects.toThrow('Invalid object name')
    })

    it('should reject action names with special characters', async () => {
      await expect(async () => {
        await client.send.Customer['invalid-action']({})
      }).rejects.toThrow('Invalid action name')
    })

    it('should reject object names that are too long', async () => {
      const longName = 'A'.repeat(101)
      await expect(async () => {
        await client.send[longName].created({})
      }).rejects.toThrow('object name too long')
    })

    it('should reject action names that are too long', async () => {
      const longAction = 'a'.repeat(101)
      await expect(async () => {
        await client.send.Customer[longAction]({})
      }).rejects.toThrow('action name too long')
    })

    it('should accept valid object names with underscores', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await expect(client.send.Valid_Name.created({})).resolves.not.toThrow()
    })

    it('should accept valid action names with underscores', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await expect(client.send.Customer.valid_action({})).resolves.not.toThrow()
    })

    it('should handle reserved keyword "Constructor" (PascalCase) as object name with validation', async () => {
      await expect(async () => {
        // Using bracket notation with PascalCase to avoid the internal property
        await client.send['Constructor'].created({})
      }).rejects.toThrow('reserved keyword')
    })

    it('should ignore internal JavaScript property "constructor" gracefully', () => {
      // Accessing constructor shouldn't throw, it should return undefined
      const result = client.send.Customer.constructor
      expect(result).toBeUndefined()
    })

    it('should ignore internal JavaScript property "prototype" gracefully', () => {
      const result = client.send.Customer.prototype
      expect(result).toBeUndefined()
    })

    it('should ignore internal JavaScript property "toString" gracefully', () => {
      const result = client.send.Customer.toString
      expect(result).toBeUndefined()
    })
  })

  describe('proxy caching', () => {
    it('should cache object-level proxies', () => {
      const firstAccess = client.send.Customer
      const secondAccess = client.send.Customer

      // Both should reference the same cached proxy
      expect(firstAccess).toBe(secondAccess)
    })

    it('should cache different object proxies independently', () => {
      const customerProxy = client.send.Customer
      const orderProxy = client.send.Order

      // Different objects should have different proxies
      expect(customerProxy).not.toBe(orderProxy)

      // But repeated access should return cached versions
      expect(customerProxy).toBe(client.send.Customer)
      expect(orderProxy).toBe(client.send.Order)
    })
  })

  describe('array payload preservation', () => {
    it('should preserve array payloads when passed as single argument', async () => {
      const mockResponse = { success: true, result: undefined }
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const items = [{ id: 1 }, { id: 2 }, { id: 3 }]
      await client.send.Batch.processed(items)

      expect(global.fetch).toHaveBeenCalledWith(
        'https://apis.do/rpc/send/Batch.processed',
        expect.objectContaining({
          body: JSON.stringify({ params: items }),
        })
      )
    })
  })

  describe('listener isolation', () => {
    it('should create new OnService instance on each access to client.on', () => {
      // Access client.on multiple times
      const onService1 = client.on
      const onService2 = client.on
      const onService3 = client.on

      // Each access should return a different instance (no caching)
      expect(onService1).not.toBe(onService2)
      expect(onService2).not.toBe(onService3)
      expect(onService1).not.toBe(onService3)
    })

    it('should isolate listeners between different OnService instances', async () => {
      let count1 = 0
      let count2 = 0

      // Get two separate OnService instances
      const events1 = client.on
      const events2 = client.on

      // Register handlers on each instance
      events1('Order.created', async () => {
        count1++
      })

      events2('Order.created', async () => {
        count2++
      })

      // Create a mock BusinessEvent
      const testEvent = {
        who: { $type: 'Person', id: 'user_123' },
        what: { $type: 'Order', id: 'order_123' },
        where: { digital: { platform: 'web' } },
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
        when: new Date().toISOString(),
        metadata: { action: 'created' },
      }

      // Emit event on first instance
      await events1.emit(testEvent)

      // Only the first handler should have been called
      expect(count1).toBe(1)
      expect(count2).toBe(0)

      // Emit event on second instance
      await events2.emit(testEvent)

      // Only the second handler should have been called
      expect(count1).toBe(1)
      expect(count2).toBe(1)
    })

    it('should allow storing OnService in variable to preserve listeners', async () => {
      let eventCount = 0

      // Store OnService instance in variable
      const events = client.on

      // Register multiple handlers on the same instance
      events('Order.created', async () => {
        eventCount++
      })

      events('Order.updated', async () => {
        eventCount++
      })

      // Create test events
      const orderCreated = {
        who: { $type: 'Person', id: 'user_123' },
        what: { $type: 'Order', id: 'order_123' },
        where: { digital: { platform: 'web' } },
        why: { reason: 'customer-purchase' },
        how: { method: 'api' },
        when: new Date().toISOString(),
        metadata: { action: 'created' },
      }

      const orderUpdated = {
        who: { $type: 'Person', id: 'user_123' },
        what: { $type: 'Order', id: 'order_123' },
        where: { digital: { platform: 'web' } },
        why: { reason: 'customer-update' },
        how: { method: 'api' },
        when: new Date().toISOString(),
        metadata: { action: 'updated' },
      }

      // Emit both events using the same stored instance
      await events.emit(orderCreated)
      await events.emit(orderUpdated)

      // Both handlers should have been called
      expect(eventCount).toBe(2)
    })
  })
})
