/**
 * Tests for Send Service (Event Publishing)
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { RPCClient } from './client'
import type { SendService } from './types'

describe('Send Service', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let client: RPCClient
  let send: SendService

  beforeEach(() => {
    // Mock global fetch
    mockFetch = vi.fn()
    global.fetch = mockFetch

    // Create client with test configuration
    client = new RPCClient({
      apiKey: 'test-key',
      baseUrl: 'https://test.apis.do',
    })

    send = client.send
  })

  describe('Semantic Event Publishing', () => {
    test('publishes Customer.subscribed event', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Customer.subscribed({ email: 'user@example.com', plan: 'pro' })

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/send/Customer.subscribed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: { email: 'user@example.com', plan: 'pro' } }),
      })
    })

    test('publishes Order.created event', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Order.created({ orderId: '123', customerId: 'cust_1', total: 99.99 })

      expect(mockFetch).toHaveBeenCalledWith('https://test.apis.do/rpc/send/Order.created', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ params: { orderId: '123', customerId: 'cust_1', total: 99.99 } }),
      })
    })

    test('publishes Invoice.sent event', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Invoice.sent({ invoiceId: 'INV-001', recipient: 'customer@example.com', amount: 150.0 })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/send/Invoice.sent',
        expect.objectContaining({
          body: JSON.stringify({ params: { invoiceId: 'INV-001', recipient: 'customer@example.com', amount: 150.0 } }),
        })
      )
    })
  })

  describe('Past Tense Verbs', () => {
    test('handles regular past tense (created, updated, deleted)', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Order.created({ id: '1' })
      await send.Order.updated({ id: '1' })
      await send.Order.deleted({ id: '1' })

      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    test('handles irregular past tense (sent, built, made)', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Email.sent({ to: 'user@example.com' })
      await send.Report.built({ format: 'pdf' })
      await send.Payment.made({ amount: 100 })

      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    test('handles subscribed/unsubscribed', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Customer.subscribed({ plan: 'pro' })
      await send.Customer.unsubscribed({ reason: 'cancelled' })

      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('Payload Handling', () => {
    test('sends object payloads', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      const payload = {
        orderId: 'order_123',
        items: [
          { id: 'item_1', quantity: 2 },
          { id: 'item_2', quantity: 1 },
        ],
        total: 150.0,
      }

      await send.Order.created(payload)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/send/Order.created',
        expect.objectContaining({
          body: JSON.stringify({ params: payload }),
        })
      )
    })

    test('sends array payloads', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      const items = [
        { id: 'item_1', status: 'processed' },
        { id: 'item_2', status: 'processed' },
        { id: 'item_3', status: 'processed' },
      ]

      await send.Batch.processed(items)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/send/Batch.processed',
        expect.objectContaining({
          body: JSON.stringify({ params: items }),
        })
      )
    })

    test('sends scalar payloads', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Counter.incremented(1)
      await send.Flag.toggled(true)
      await send.Message.received('Hello')

      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    test('sends without payload', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.System.ready()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/send/System.ready',
        expect.objectContaining({
          body: JSON.stringify({ params: undefined }),
        })
      )
    })

    test('handles null payload', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Field.cleared(null)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/send/Field.cleared',
        expect.objectContaining({
          body: JSON.stringify({ params: null }),
        })
      )
    })
  })

  describe('Naming Conventions', () => {
    test('accepts PascalCase objects', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Customer.created({})
      await send.Order.created({})
      await send.Invoice.created({})
      await send.Product.created({})

      expect(mockFetch).toHaveBeenCalledTimes(4)
    })

    test('accepts camelCase objects', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.myObject.created({})

      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    test('accepts lowercase actions', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Order.created({})
      await send.Order.updated({})
      await send.Order.deleted({})

      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    test('accepts underscores in names', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Order_Item.quantity_changed({})

      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('Validation', () => {
    test('rejects reserved keywords as object names', async () => {
      const reserved = ['constructor', 'prototype', '__proto__', 'toString', 'valueOf']

      for (const keyword of reserved) {
        expect(() => {
          ;(send as any)[keyword].created()
        }).toThrow('reserved keyword')
      }
    })

    test('rejects invalid object names', async () => {
      expect(() => {
        ;(send as any)['123invalid'].created()
      }).toThrow('Must start with a letter')

      expect(() => {
        ;(send as any)['invalid@name'].created()
      }).toThrow('alphanumeric')

      expect(() => {
        ;(send as any)[''].created()
      }).toThrow('Invalid object name')
    })

    test('rejects invalid action names', async () => {
      expect(() => {
        ;(send.Order as any)['123invalid']()
      }).toThrow('Must start with a letter')

      expect(() => {
        ;(send.Order as any)['invalid-action']()
      }).toThrow('alphanumeric')
    })

    test('enforces maximum name length', async () => {
      const longName = 'a'.repeat(101)

      expect(() => {
        ;(send as any)[longName].created()
      }).toThrow('Maximum length is 100 characters')
    })

    test('validates action names', async () => {
      const longAction = 'a'.repeat(101)

      expect(() => {
        ;(send.Order as any)[longAction]()
      }).toThrow('Maximum length is 100 characters')
    })
  })

  describe('Proxy Behavior', () => {
    test('returns undefined for symbol properties', () => {
      const symbolProp = send[Symbol.iterator as any]
      expect(symbolProp).toBeUndefined()
    })

    test('returns undefined for internal properties', () => {
      expect(send.Customer.toString).toBeUndefined()
      expect(send.Customer.valueOf).toBeUndefined()
      expect(send.Customer.toJSON).toBeUndefined()
      expect((send.Customer as any).then).toBeUndefined()
    })

    test('caches object-level proxies', () => {
      const customer1 = send.Customer
      const customer2 = send.Customer

      expect(customer1).toBe(customer2)
    })

    test('validation is cached for performance', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      // Access same pattern multiple times
      for (let i = 0; i < 100; i++) {
        await send.Customer.subscribed({ email: 'test@example.com' })
      }

      expect(mockFetch).toHaveBeenCalledTimes(100)
    })
  })

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(send.Order.created({ id: '1' })).rejects.toThrow('Network error')
    })

    test('handles HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(send.Order.created({ id: '1' })).rejects.toThrow('HTTP 500')
    })

    test('handles RPC error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: {
            message: 'Invalid event format',
            code: 'INVALID_EVENT',
          },
        }),
      })

      await expect(send.Order.created({ id: '1' })).rejects.toThrow('Invalid event format')
    })

    test('handles malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(send.Order.created({ id: '1' })).rejects.toThrow('Invalid JSON')
    })
  })

  describe('Business Events', () => {
    test('publishes customer lifecycle events', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Customer.registered({ customerId: 'cust_1' })
      await send.Customer.subscribed({ customerId: 'cust_1', plan: 'pro' })
      await send.Customer.upgraded({ customerId: 'cust_1', from: 'basic', to: 'pro' })
      await send.Customer.downgraded({ customerId: 'cust_1', from: 'pro', to: 'basic' })
      await send.Customer.unsubscribed({ customerId: 'cust_1' })
      await send.Customer.deleted({ customerId: 'cust_1' })

      expect(mockFetch).toHaveBeenCalledTimes(6)
    })

    test('publishes order workflow events', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Order.created({ orderId: 'order_1' })
      await send.Order.confirmed({ orderId: 'order_1' })
      await send.Order.paid({ orderId: 'order_1' })
      await send.Order.shipped({ orderId: 'order_1' })
      await send.Order.delivered({ orderId: 'order_1' })
      await send.Order.completed({ orderId: 'order_1' })

      expect(mockFetch).toHaveBeenCalledTimes(6)
    })

    test('publishes payment events', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Payment.initiated({ paymentId: 'pay_1' })
      await send.Payment.authorized({ paymentId: 'pay_1' })
      await send.Payment.captured({ paymentId: 'pay_1' })
      await send.Payment.refunded({ paymentId: 'pay_1' })
      await send.Payment.failed({ paymentId: 'pay_1' })

      expect(mockFetch).toHaveBeenCalledTimes(5)
    })
  })

  describe('Concurrent Events', () => {
    test('handles concurrent event publishing', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await Promise.all([
        send.Order.created({ id: '1' }),
        send.Order.created({ id: '2' }),
        send.Order.created({ id: '3' }),
        send.Customer.subscribed({ id: 'cust_1' }),
        send.Invoice.sent({ id: 'inv_1' }),
      ])

      expect(mockFetch).toHaveBeenCalledTimes(5)
    })

    test('publishes events to different objects concurrently', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      const events = [
        send.Customer.subscribed({ id: 'c1' }),
        send.Order.created({ id: 'o1' }),
        send.Invoice.sent({ id: 'i1' }),
        send.Payment.made({ id: 'p1' }),
        send.Product.updated({ id: 'pr1' }),
      ]

      await Promise.all(events)

      expect(mockFetch).toHaveBeenCalledTimes(5)
    })
  })

  describe('Edge Cases', () => {
    test('handles complex nested payloads', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      const complexPayload = {
        order: {
          id: 'order_123',
          customer: {
            id: 'cust_1',
            name: 'Alice',
            address: {
              street: '123 Main St',
              city: 'San Francisco',
              coordinates: { lat: 37.7749, lon: -122.4194 },
            },
          },
          items: [
            { id: 'item_1', price: 10.0, metadata: { sku: 'ABC-123' } },
            { id: 'item_2', price: 20.0, metadata: { sku: 'DEF-456' } },
          ],
        },
      }

      await send.Order.created(complexPayload)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/send/Order.created',
        expect.objectContaining({
          body: JSON.stringify({ params: complexPayload }),
        })
      )
    })

    test('handles unicode in event payloads', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Message.sent({
        text: '你好世界 🌍 مرحبا العالم',
        emoji: '🚀💻🎉',
      })

      expect(mockFetch).toHaveBeenCalled()
    })

    test('handles empty object payloads', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.System.started({})

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.apis.do/rpc/send/System.started',
        expect.objectContaining({
          body: JSON.stringify({ params: {} }),
        })
      )
    })

    test('handles numeric payloads', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Counter.incremented(5)
      await send.Temperature.changed(72.5)
      await send.Score.updated(-100)

      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    test('handles boolean payloads', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Feature.enabled(true)
      await send.Feature.disabled(false)

      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('Request Deduplication', () => {
    test('deduplicates identical concurrent events', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      const payload = { orderId: 'order_123' }

      // Make three identical concurrent requests
      await Promise.all([send.Order.created(payload), send.Order.created(payload), send.Order.created(payload)])

      // Should only make one network request due to deduplication
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    test('does not deduplicate different events', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await Promise.all([send.Order.created({ id: '1' }), send.Order.created({ id: '2' }), send.Order.created({ id: '3' })])

      // Should make three separate network requests
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
  })

  describe('Type Safety', () => {
    test('event names are dot-separated', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      await send.Customer.subscribed({})

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[0]).toContain('Customer.subscribed')
    })

    test('preserves payload types', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: undefined }),
      })

      interface OrderPayload {
        orderId: string
        total: number
      }

      const payload: OrderPayload = { orderId: 'order_123', total: 99.99 }

      await send.Order.created(payload)

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.params).toEqual(payload)
    })
  })
})
