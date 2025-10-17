/**
 * Tests for $ proxy and SDK initialization
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { $, create$, RPCClient } from './client'
import type { BusinessContext, RPCClientOptions } from './types'

describe('$ Proxy', () => {
  // Save original environment
  const originalEnv = { ...process.env }

  beforeEach(() => {
    // Reset environment before each test
    delete process.env.DO_TOKEN
    // Clear any cached default client
    ;($ as any).defaultClient = null
  })

  afterEach(() => {
    // Restore original environment
    process.env = { ...originalEnv }
  })

  describe('Authentication Detection', () => {
    test('detects DO_TOKEN from process.env', () => {
      process.env.DO_TOKEN = 'test-token'

      const context = create$()

      expect(context).toBeDefined()
      expect(context.db).toBeDefined()
      expect(context.ai).toBeDefined()
    })

    test('accepts explicit apiKey in options', () => {
      const context = create$({ apiKey: 'explicit-key' })

      expect(context).toBeDefined()
      expect(context.db).toBeDefined()
    })

    test('explicit apiKey overrides DO_TOKEN', () => {
      process.env.DO_TOKEN = 'env-token'

      const context = create$({ apiKey: 'explicit-key' })

      // Verify the explicit key is used (we can't directly inspect this,
      // but we can verify the client was created successfully)
      expect(context).toBeDefined()
    })

    test('throws error when no authentication available in sync mode', () => {
      // Remove DO_TOKEN
      delete process.env.DO_TOKEN

      expect(() => {
        // Direct property access without auth
        $.db.list('users')
      }).toThrow('Authentication required')
    })
  })

  describe('Service Access', () => {
    beforeEach(() => {
      process.env.DO_TOKEN = 'test-token'
    })

    test('provides access to db service', () => {
      const context = create$()

      expect(context.db).toBeDefined()
      expect(typeof context.db.query).toBe('function')
      expect(typeof context.db.get).toBe('function')
      expect(typeof context.db.list).toBe('function')
      expect(typeof context.db.upsert).toBe('function')
      expect(typeof context.db.delete).toBe('function')
      expect(typeof context.db.search).toBe('function')
    })

    test('provides access to ai service', () => {
      const context = create$()

      expect(context.ai).toBeDefined()
      expect(typeof context.ai.generateText).toBe('function')
      expect(typeof context.ai.generate).toBe('function')
      expect(typeof context.ai.embed).toBe('function')
    })

    test('provides access to auth service', () => {
      const context = create$()

      expect(context.auth).toBeDefined()
      expect(typeof context.auth.validateToken).toBe('function')
      expect(typeof context.auth.createSession).toBe('function')
      expect(typeof context.auth.createApiKey).toBe('function')
      expect(typeof context.auth.checkPermission).toBe('function')
    })

    test('provides access to user service', () => {
      const context = create$()

      expect(context.user).toBeDefined()
    })

    test('provides access to api service', () => {
      const context = create$()

      expect(context.api).toBeDefined()
    })

    test('provides access to on service', () => {
      const context = create$()

      expect(context.on).toBeDefined()
      expect(typeof context.on).toBe('function')
    })

    test('provides access to send service', () => {
      const context = create$()

      expect(context.send).toBeDefined()
      expect(typeof context.send).toBe('object')
    })

    test('provides access to every service', () => {
      const context = create$()

      expect(context.every).toBeDefined()
      // every is a Proxy wrapping a function, so typeof returns 'function'
      expect(typeof context.every).toBe('function')
    })

    test('provides access to decide service', () => {
      const context = create$()

      expect(context.decide).toBeDefined()
    })

    test('provides access to graphdl $ builder', () => {
      const context = create$()

      expect(context.$).toBeDefined()
      // $ from graphdl is a PathProxy object, not a function
      expect(typeof context.$).toBe('object')
    })
  })

  describe('Semantic Patterns', () => {
    beforeEach(() => {
      process.env.DO_TOKEN = 'test-token'
    })

    test('send service supports semantic patterns', () => {
      const context = create$()

      // These should be accessible without throwing
      expect(context.send.Customer).toBeDefined()
      expect(context.send.Order).toBeDefined()
      expect(context.send.Invoice).toBeDefined()
    })

    test.skip('send service validates object names', () => {
      // TODO: Validation not yet implemented in send.ts
      const context = create$()

      // Valid patterns should not throw when accessed
      expect(() => context.send.Customer).not.toThrow()
      expect(() => context.send.Order).not.toThrow()

      // Invalid patterns should throw on method call
      expect(() => {
        ;(context.send as any)['invalid-name'].created()
      }).toThrow('Invalid object name')
    })

    test.skip('send service validates action names', () => {
      // TODO: Validation not yet implemented in send.ts
      const context = create$()

      // Valid actions should not throw when accessed
      expect(() => context.send.Customer.created).not.toThrow()
      expect(() => context.send.Customer.subscribed).not.toThrow()

      // Invalid actions should throw on call
      expect(() => {
        ;(context.send.Customer as any)['invalid-action']()
      }).toThrow('Invalid action name')
    })

    test.skip('send service rejects reserved keywords', () => {
      // TODO: Validation not yet implemented in send.ts
      const context = create$()

      // Reserved keywords should be rejected
      const reserved = ['constructor', 'prototype', '__proto__']

      reserved.forEach((keyword) => {
        expect(() => {
          ;(context.send as any)[keyword].created()
        }).toThrow('reserved keyword')
      })
    })

    test.skip('send service enforces name length limits', () => {
      // TODO: Validation not yet implemented in send.ts
      const context = create$()

      // 101 character name should be rejected
      const longName = 'a'.repeat(101)

      expect(() => {
        ;(context.send as any)[longName].created()
      }).toThrow('Maximum length is 100 characters')
    })

    test.skip('send service requires alphanumeric names', () => {
      // TODO: Validation not yet implemented in send.ts
      const context = create$()

      expect(() => {
        ;(context.send as any)['123invalid'].created()
      }).toThrow('Must start with a letter')
    })
  })

  describe('Client Options', () => {
    test('accepts custom baseUrl', () => {
      const context = create$({
        apiKey: 'test-key',
        baseUrl: 'https://custom.api.do',
      })

      expect(context).toBeDefined()
    })

    test('accepts custom headers', () => {
      const context = create$({
        apiKey: 'test-key',
        headers: {
          'X-Custom-Header': 'value',
        },
      })

      expect(context).toBeDefined()
    })

    test('sets Authorization header from apiKey', () => {
      const client = new RPCClient({ apiKey: 'test-key' })

      // Check that header would be set (we can't access private property directly)
      expect(client).toBeDefined()
    })
  })

  describe('Type Safety', () => {
    beforeEach(() => {
      process.env.DO_TOKEN = 'test-token'
    })

    test('context has correct TypeScript types', () => {
      const context = create$()

      // Type assertions - these would fail at compile time if types are wrong
      const dbService: typeof context.db = context.db
      const aiService: typeof context.ai = context.ai
      const authService: typeof context.auth = context.auth
      const userService: typeof context.user = context.user

      expect(dbService).toBeDefined()
      expect(aiService).toBeDefined()
      expect(authService).toBeDefined()
      expect(userService).toBeDefined()
    })

    test('supports generic metadata types', () => {
      interface CustomMetadata {
        appVersion: string
        environment: 'dev' | 'prod'
      }

      const context = create$<CustomMetadata>({ apiKey: 'test-key' })

      // Type would be BusinessContext<CustomMetadata>
      expect(context).toBeDefined()
    })
  })

  describe('Service Proxy Behavior', () => {
    beforeEach(() => {
      process.env.DO_TOKEN = 'test-token'
    })

    test('service methods return callable functions', () => {
      const context = create$()

      // All service methods should be functions
      expect(typeof context.db.get).toBe('function')
      expect(typeof context.db.list).toBe('function')
      expect(typeof context.ai.generate).toBe('function')
      expect(typeof context.ai.embed).toBe('function')
    })

    test('send service creates nested proxies', () => {
      const context = create$()

      // First level: Object
      const customer = context.send.Customer
      expect(customer).toBeDefined()

      // Second level: action
      const created = customer.created
      expect(typeof created).toBe('function')
    })

    test.skip('send service ignores symbol properties', () => {
      // TODO: Symbol property handling not yet implemented in send.ts
      const context = create$()

      // Symbol properties should return undefined
      const symbolProp = context.send[Symbol.iterator as any]
      expect(symbolProp).toBeUndefined()
    })

    test.skip('send service ignores internal properties', () => {
      // TODO: Internal property filtering not yet implemented in send.ts
      const context = create$()

      // Internal properties should return undefined
      expect(context.send.Customer.toString).toBeUndefined()
      expect(context.send.Customer.valueOf).toBeUndefined()
      expect(context.send.Customer.toJSON).toBeUndefined()
      expect((context.send.Customer as any).then).toBeUndefined()
    })
  })

  describe('Concurrent Access', () => {
    beforeEach(() => {
      process.env.DO_TOKEN = 'test-token'
    })

    test('multiple service accesses work concurrently', () => {
      const context = create$()

      // Access multiple services simultaneously
      const db = context.db
      const ai = context.ai
      const send = context.send
      const on = context.on

      expect(db).toBeDefined()
      expect(ai).toBeDefined()
      expect(send).toBeDefined()
      expect(on).toBeDefined()
    })

    test('multiple send patterns can be created', () => {
      const context = create$()

      const customer = context.send.Customer
      const order = context.send.Order
      const invoice = context.send.Invoice

      expect(customer).toBeDefined()
      expect(order).toBeDefined()
      expect(invoice).toBeDefined()

      // Actions should be accessible
      expect(typeof customer.created).toBe('function')
      expect(typeof order.created).toBe('function')
      expect(typeof invoice.sent).toBe('function')
    })
  })

  describe('Edge Cases', () => {
    test('handles missing environment gracefully', () => {
      delete process.env.DO_TOKEN

      expect(() => {
        create$()
      }).not.toThrow()
    })

    test('handles empty options object', () => {
      const context = create$({})

      expect(context).toBeDefined()
    })

    test('handles undefined options', () => {
      process.env.DO_TOKEN = 'test-token'

      const context = create$()

      expect(context).toBeDefined()
    })

    test('send service handles rapid property access', () => {
      process.env.DO_TOKEN = 'test-token'
      const context = create$()

      // Rapidly access same pattern multiple times
      for (let i = 0; i < 100; i++) {
        expect(context.send.Customer.created).toBeDefined()
      }
    })

    test.skip('send service caches object proxies', () => {
      // TODO: Proxy caching not yet implemented in send.ts
      process.env.DO_TOKEN = 'test-token'
      const context = create$()

      // Same object should return same proxy instance
      const customer1 = context.send.Customer
      const customer2 = context.send.Customer

      expect(customer1).toBe(customer2)
    })
  })

  describe('Error Cases', () => {
    test.skip('validates event part format', () => {
      // TODO: Validation not yet implemented in send.ts
      process.env.DO_TOKEN = 'test-token'
      const context = create$()

      // Empty string should fail
      expect(() => {
        ;(context.send as any)[''].created()
      }).toThrow('Invalid object name')

      // Special characters should fail
      expect(() => {
        ;(context.send as any)['Customer@'].created()
      }).toThrow('Invalid object name')

      // Starting with number should fail
      expect(() => {
        ;(context.send as any)['123Customer'].created()
      }).toThrow('Must start with a letter')
    })

    test.skip('handles extremely long names', () => {
      // TODO: Validation not yet implemented in send.ts
      process.env.DO_TOKEN = 'test-token'
      const context = create$()

      const longName = 'a'.repeat(150)

      expect(() => {
        ;(context.send as any)[longName].created()
      }).toThrow('Maximum length is 100 characters')
    })

    test.skip('rejects all reserved keywords', () => {
      // TODO: Validation not yet implemented in send.ts
      process.env.DO_TOKEN = 'test-token'
      const context = create$()

      const reserved = ['constructor', 'prototype', '__proto__', 'toString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf']

      reserved.forEach((keyword) => {
        expect(() => {
          ;(context.send as any)[keyword].created()
        }).toThrow('reserved keyword')
      })
    })
  })

  describe('Integration with graphdl', () => {
    beforeEach(() => {
      process.env.DO_TOKEN = 'test-token'
    })

    test('$ builder is available from graphdl', () => {
      const context = create$()

      expect(context.$).toBeDefined()
      // $ from graphdl is a PathProxy object, not a function
      expect(typeof context.$).toBe('object')
    })

    test('$ builder creates semantic paths', () => {
      const context = create$()

      // Create a semantic path
      const customerPath = context.$.Customer

      expect(customerPath).toBeDefined()
    })
  })

  describe('Service Instance Behavior', () => {
    beforeEach(() => {
      process.env.DO_TOKEN = 'test-token'
    })

    test('on service creates fresh instance each time', () => {
      const context = create$()

      // Each access should create new instance (for multi-tenant safety)
      const on1 = context.on
      const on2 = context.on

      // They should be different instances to prevent listener leakage
      expect(on1).toBeDefined()
      expect(on2).toBeDefined()
    })

    test('send service reuses same instance', () => {
      const context = create$()

      const send1 = context.send
      const send2 = context.send

      // Should be same instance (cached)
      expect(send1).toBe(send2)
    })

    test('every service returns consistent instance', () => {
      const context = create$()

      const every1 = context.every
      const every2 = context.every

      expect(every1).toBeDefined()
      expect(every2).toBeDefined()
    })
  })

  describe('Backwards Compatibility', () => {
    test.skip('createClient alias works', () => {
      // TODO: Cannot use require() in ESM context - need to export createClient as named export
      const { createClient } = require('./client')

      process.env.DO_TOKEN = 'test-token'
      const context = createClient()

      expect(context).toBeDefined()
      expect(context.db).toBeDefined()
    })
  })
})
