import { describe, it, expect } from 'vitest'
import {
  createBusinessEvent,
  validateBusinessEvent,
  isBusinessEvent,
  createPerson,
  createAgent,
  createOrganization,
  createSystem,
  createLocation,
  type BusinessEvent,
  type Person,
  type Agent,
  type Organization,
  type System,
  type Location,
} from './events.js'
import { z } from 'zod'

describe('BusinessEvent Types', () => {
  describe('createPerson', () => {
    it('should create a valid Person', () => {
      const person = createPerson({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
      })

      expect(person.$type).toBe('Person')
      expect(person.$id).toBe('user-123')
      expect(person.name).toBe('John Doe')
      expect(person.email).toBe('john@example.com')
    })

    it('should create a Person without optional fields', () => {
      const person = createPerson({
        id: 'user-456',
        name: 'Jane Smith',
      })

      expect(person.$type).toBe('Person')
      expect(person.$id).toBe('user-456')
      expect(person.name).toBe('Jane Smith')
      expect(person.email).toBeUndefined()
    })
  })

  describe('createAgent', () => {
    it('should create a valid Agent', () => {
      const agent = createAgent({
        id: 'agent-sdr-amy',
        role: 'sdr',
        name: 'Amy',
        capabilities: ['email', 'phone', 'crm'],
      })

      expect(agent.$type).toBe('Agent')
      expect(agent.$id).toBe('agent-sdr-amy')
      expect(agent.role).toBe('sdr')
      expect(agent.name).toBe('Amy')
      expect(agent.capabilities).toEqual(['email', 'phone', 'crm'])
    })
  })

  describe('createOrganization', () => {
    it('should create a valid Organization', () => {
      const org = createOrganization({
        id: 'org-123',
        name: 'Acme Corp',
        legalName: 'Acme Corporation Inc.',
        taxID: '12-3456789',
      })

      expect(org.$type).toBe('Organization')
      expect(org.$id).toBe('org-123')
      expect(org.name).toBe('Acme Corp')
      expect(org.legalName).toBe('Acme Corporation Inc.')
      expect(org.taxID).toBe('12-3456789')
    })
  })

  describe('createSystem', () => {
    it('should create a valid System', () => {
      const system = createSystem({
        id: 'system-api',
        name: 'API Gateway',
        version: '2.1.0',
      })

      expect(system.$type).toBe('System')
      expect(system.$id).toBe('system-api')
      expect(system.name).toBe('API Gateway')
      expect(system.version).toBe('2.1.0')
    })
  })

  describe('createLocation', () => {
    it('should create a Location with physical address', () => {
      const location = createLocation({
        gln: '1234567890123',
        address: {
          streetAddress: '123 Main St',
          addressLocality: 'San Francisco',
          addressRegion: 'CA',
          postalCode: '94102',
          addressCountry: 'US',
        },
      })

      expect(location.$type).toBe('Location')
      expect(location.gln).toBe('1234567890123')
      expect(location.address?.streetAddress).toBe('123 Main St')
      expect(location.address?.addressLocality).toBe('San Francisco')
    })

    it('should create a Location with digital location', () => {
      const location = createLocation({
        digital: {
          platform: 'email',
          url: 'https://example.com',
        },
      })

      expect(location.$type).toBe('Location')
      expect(location.digital?.platform).toBe('email')
      expect(location.digital?.url).toBe('https://example.com')
    })

    it('should create a Location with coordinates', () => {
      const location = createLocation({
        coordinates: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      })

      expect(location.$type).toBe('Location')
      expect(location.coordinates?.latitude).toBe(37.7749)
      expect(location.coordinates?.longitude).toBe(-122.4194)
    })

    it('should create a Location with valid IP address', () => {
      const location = createLocation({
        digital: {
          platform: 'web',
          ipAddress: '192.168.1.1',
        },
      })

      expect(location.$type).toBe('Location')
      expect(location.digital?.ipAddress).toBe('192.168.1.1')
    })

    it('should create a Location with boundary coordinates', () => {
      const location = createLocation({
        coordinates: {
          latitude: 90,
          longitude: -180,
        },
      })

      expect(location.$type).toBe('Location')
      expect(location.coordinates?.latitude).toBe(90)
      expect(location.coordinates?.longitude).toBe(-180)
    })
  })

  describe('createBusinessEvent', () => {
    it('should create a valid BusinessEvent with Order data', () => {
      const person = createPerson({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
      })

      const location = createLocation({
        gln: '1234567890123',
        address: {
          streetAddress: '123 Main St',
          addressLocality: 'San Francisco',
          addressRegion: 'CA',
          postalCode: '94102',
          addressCountry: 'US',
        },
      })

      const order = {
        $type: 'Order',
        $id: 'order-789',
        total: 100,
        items: [{ name: 'Widget', quantity: 2, price: 50 }],
      }

      const event = createBusinessEvent({
        id: 'event-123',
        who: person,
        what: order,
        when: '2025-10-09T21:30:00Z',
        where: location,
        why: {
          reason: 'customer-purchase',
          trigger: 'checkout-completed',
          goal: 'fulfill-order',
        },
        how: {
          method: 'automated',
          workflow: 'order-processing-v1',
        },
      })

      expect(event.$type).toBe('BusinessEvent')
      expect(event.$id).toBe('event-123')
      expect(event.who).toEqual(person)
      expect(event.what).toEqual(order)
      expect(event.when).toBe('2025-10-09T21:30:00Z')
      expect(event.where).toEqual(location)
      expect(event.why.reason).toBe('customer-purchase')
      expect(event.how.method).toBe('automated')
    })

    it('should create a BusinessEvent with auto-generated ID and timestamp', () => {
      const agent = createAgent({
        id: 'agent-sdr-amy',
        role: 'sdr',
        name: 'Amy',
      })

      const location = createLocation({
        digital: { platform: 'email' },
      })

      const task = {
        $type: 'Task',
        $id: 'task-789',
        action: 'send-follow-up-email',
      }

      const event = createBusinessEvent({
        who: agent,
        what: task,
        where: location,
        why: {
          reason: 'nurture-lead',
          trigger: 'lead-score-increased',
        },
        how: {
          method: 'automated',
          automation: 'lead-nurturing',
        },
      })

      expect(event.$type).toBe('BusinessEvent')
      // ID should be a nanoid (21 character alphanumeric string by default)
      expect(event.$id).toMatch(/^[A-Za-z0-9_-]{21}$/)
      expect(typeof event.when).toBe('string')
      expect(event.who).toEqual(agent)
      expect(event.what).toEqual(task)
    })

    it('should create a BusinessEvent with context and metadata', () => {
      const system = createSystem({
        id: 'system-api',
        name: 'API Gateway',
        version: '2.1.0',
      })

      const location = createLocation({
        digital: {
          platform: 'web',
          ipAddress: '192.168.1.1',
        },
      })

      const event = createBusinessEvent({
        who: system,
        what: { message: 'System health check' },
        where: location,
        why: {
          reason: 'scheduled-maintenance',
          trigger: 'cron-schedule',
        },
        how: {
          method: 'automated',
        },
        context: {
          environment: 'production',
          region: 'us-west-2',
        },
        metadata: {
          version: '1.0',
          source: 'monitoring-service',
        },
      })

      expect(event.context?.environment).toBe('production')
      expect(event.metadata?.source).toBe('monitoring-service')
    })
  })

  describe('validateBusinessEvent', () => {
    it('should validate a valid BusinessEvent', () => {
      const person = createPerson({
        id: 'user-123',
        name: 'John Doe',
      })

      const location = createLocation({
        digital: { platform: 'web' },
      })

      const OrderSchema = z.object({
        $type: z.literal('Order'),
        $id: z.string(),
        total: z.number(),
      })

      const event = createBusinessEvent({
        who: person,
        what: {
          $type: 'Order' as const,
          $id: 'order-789',
          total: 100,
        },
        where: location,
        why: { reason: 'customer-purchase' },
        how: { method: 'automated' as const },
      })

      const result = validateBusinessEvent(event, OrderSchema)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.$id).toBe(event.$id)
      }
    })

    it('should fail validation for invalid data', () => {
      const person = createPerson({
        id: 'user-123',
        name: 'John Doe',
      })

      const location = createLocation({
        digital: { platform: 'web' },
      })

      const OrderSchema = z.object({
        $type: z.literal('Order'),
        $id: z.string(),
        total: z.number(),
      })

      const event = createBusinessEvent({
        who: person,
        what: {
          $type: 'Order' as const,
          $id: 'order-789',
          total: 'invalid' as any, // Invalid: should be number
        },
        where: location,
        why: { reason: 'customer-purchase' },
        how: { method: 'automated' as const },
      })

      const result = validateBusinessEvent(event, OrderSchema)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeDefined()
      }
    })
  })

  describe('isBusinessEvent', () => {
    it('should return true for valid BusinessEvent', () => {
      const person = createPerson({
        id: 'user-123',
        name: 'John Doe',
      })

      const location = createLocation({
        digital: { platform: 'web' },
      })

      const event = createBusinessEvent({
        who: person,
        what: { test: 'data' },
        where: location,
        why: { reason: 'test' },
        how: { method: 'manual' as const },
      })

      expect(isBusinessEvent(event)).toBe(true)
    })

    it('should return false for invalid objects', () => {
      expect(isBusinessEvent({})).toBe(false)
      expect(isBusinessEvent(null)).toBe(false)
      expect(isBusinessEvent(undefined)).toBe(false)
      expect(isBusinessEvent('string')).toBe(false)
      expect(isBusinessEvent(42)).toBe(false)
      expect(isBusinessEvent({ $type: 'Order' })).toBe(false)
      expect(isBusinessEvent({ $type: 'BusinessEvent' })).toBe(false) // Missing required fields
    })

    it('should return false for object missing required fields', () => {
      const incomplete = {
        $type: 'BusinessEvent',
        $id: 'event-123',
        who: createPerson({ id: 'user-123', name: 'John Doe' }),
        // Missing: what, when, where, why, how
      }

      expect(isBusinessEvent(incomplete)).toBe(false)
    })
  })

  describe('Helper Validation', () => {
    it('should throw for invalid email in createPerson', () => {
      expect(() =>
        createPerson({
          id: 'user-1',
          name: 'John',
          email: 'invalid-email',
        })
      ).toThrow()
    })

    it('should throw for invalid GLN in createLocation', () => {
      expect(() =>
        createLocation({
          gln: '12345', // Too short - must be 13 digits
        })
      ).toThrow()
    })

    it('should throw for empty location (no fields provided)', () => {
      expect(() =>
        createLocation({
          // No fields provided - should fail validation
        })
      ).toThrow()
    })

    it('should throw for invalid IP address in createLocation', () => {
      expect(() =>
        createLocation({
          digital: {
            ipAddress: 'not-an-ip',
          },
        })
      ).toThrow()
    })

    it('should throw for out-of-range coordinates in createLocation', () => {
      expect(() =>
        createLocation({
          coordinates: {
            latitude: 91, // Out of range (max 90)
            longitude: 0,
          },
        })
      ).toThrow()

      expect(() =>
        createLocation({
          coordinates: {
            latitude: 0,
            longitude: 181, // Out of range (max 180)
          },
        })
      ).toThrow()
    })

    it('should accept valid inputs for createPerson', () => {
      expect(() =>
        createPerson({
          id: 'user-1',
          name: 'John',
          email: 'john@example.com',
        })
      ).not.toThrow()
    })

    it('should accept valid inputs for createLocation', () => {
      expect(() =>
        createLocation({
          gln: '1234567890123', // Exactly 13 digits
        })
      ).not.toThrow()

      expect(() =>
        createLocation({
          digital: {
            ipAddress: '192.168.1.1',
          },
        })
      ).not.toThrow()

      expect(() =>
        createLocation({
          coordinates: {
            latitude: 45.5,
            longitude: -122.6,
          },
        })
      ).not.toThrow()
    })
  })

  describe('Cron Expression Validation', () => {
    it('should validate standard 5-field cron expressions', () => {
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('0 0 * * *')
      ).not.toThrow()
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('0 9 * * 1')
      ).not.toThrow()
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('*/15 * * * *')
      ).not.toThrow()
    })

    it('should validate named cron schedules', () => {
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('@daily')
      ).not.toThrow()
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('@weekly')
      ).not.toThrow()
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('@monthly')
      ).not.toThrow()
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('@yearly')
      ).not.toThrow()
    })

    it('should validate @every interval notation', () => {
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('@every 5m')
      ).not.toThrow()
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('@every 1h')
      ).not.toThrow()
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('@every 30s')
      ).not.toThrow()
    })

    it('should reject invalid cron expressions', () => {
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('invalid')
      ).toThrow()
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('@invalid')
      ).toThrow()
      expect(() =>
        z
          .string()
          .regex(/^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/)
          .parse('0 0 0')
      ).toThrow() // Too few fields
    })
  })

  describe('Schema Validation', () => {
    it('should validate GLN format (13 digits)', () => {
      const validLocation = createLocation({
        gln: '1234567890123',
      })
      expect(validLocation.gln).toBe('1234567890123')

      // Invalid GLN should be caught by schema validation
      const invalidGln = '12345' // Too short
      expect(() => {
        z.string()
          .regex(/^\d{13}$/)
          .parse(invalidGln)
      }).toThrow()
    })

    it('should validate IP addresses', () => {
      const validIpv4 = '192.168.1.1'
      const validIpv6 = '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
      const invalidIp = 'not-an-ip'

      expect(() => z.string().ip().parse(validIpv4)).not.toThrow()
      expect(() => z.string().ip().parse(validIpv6)).not.toThrow()
      expect(() => z.string().ip().parse(invalidIp)).toThrow()
    })

    it('should require at least one location field', () => {
      const emptyLocation = {
        $type: 'Location' as const,
      }

      // This should fail validation because no location fields are provided
      const result = z
        .object({
          $type: z.literal('Location'),
          gln: z
            .string()
            .regex(/^\d{13}$/)
            .optional(),
          address: z.any().optional(),
          digital: z.any().optional(),
          coordinates: z.any().optional(),
        })
        .refine((data) => data.gln || data.address || data.digital || data.coordinates, { message: 'At least one location field must be provided' })
        .safeParse(emptyLocation)

      expect(result.success).toBe(false)
    })

    it('should validate coordinate boundaries', () => {
      // Valid boundaries
      expect(() => z.number().min(-90).max(90).parse(90)).not.toThrow()
      expect(() => z.number().min(-90).max(90).parse(-90)).not.toThrow()
      expect(() => z.number().min(-180).max(180).parse(180)).not.toThrow()
      expect(() => z.number().min(-180).max(180).parse(-180)).not.toThrow()

      // Invalid boundaries
      expect(() => z.number().min(-90).max(90).parse(91)).toThrow()
      expect(() => z.number().min(-90).max(90).parse(-91)).toThrow()
      expect(() => z.number().min(-180).max(180).parse(181)).toThrow()
      expect(() => z.number().min(-180).max(180).parse(-181)).toThrow()
    })

    it('should generate unique IDs with nanoid', () => {
      const person = createPerson({ id: 'user-123', name: 'John Doe' })
      const location = createLocation({ digital: { platform: 'web' } })

      const event1 = createBusinessEvent({
        who: person,
        what: { test: 'data' },
        where: location,
        why: { reason: 'test' },
        how: { method: 'manual' as const },
      })

      const event2 = createBusinessEvent({
        who: person,
        what: { test: 'data' },
        where: location,
        why: { reason: 'test' },
        how: { method: 'manual' as const },
      })

      // IDs should be different (nanoids)
      expect(event1.$id).not.toBe(event2.$id)
      // IDs should match nanoid format (21 character alphanumeric string by default)
      expect(event1.$id).toMatch(/^[A-Za-z0-9_-]{21}$/)
      expect(event2.$id).toMatch(/^[A-Za-z0-9_-]{21}$/)
    })
  })
})
