/**
 * Unit tests for Vapi Client
 * Tests VapiClient, VapiRateLimiter, and EscalationManager
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { VapiClient, VapiRateLimiter, EscalationManager, type EscalationContext } from './vapi.js'

// Mock fetch globally
global.fetch = vi.fn()

describe('VapiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should throw error when apiKey is missing', () => {
      expect(() => new VapiClient({ apiKey: '' })).toThrow('Vapi API key is required')
    })

    it('should initialize with valid config', () => {
      const client = new VapiClient({
        apiKey: 'test-key',
        phoneNumber: '+12345678900',
        assistantId: 'asst_123',
      })
      expect(client).toBeDefined()
    })
  })

  describe('sendSMS', () => {
    it('should throw error when phone number not configured', async () => {
      const client = new VapiClient({ apiKey: 'test-key' })
      await expect(client.sendSMS({ to: '+12345678900', message: 'test' })).rejects.toThrow('Vapi phone number not configured')
    })

    it('should send SMS successfully', async () => {
      const mockResponse = {
        id: 'msg_123',
        phoneNumberId: '+12345678900',
        to: '+10987654321',
        message: 'test message',
        status: 'sent',
        createdAt: new Date().toISOString(),
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const client = new VapiClient({
        apiKey: 'test-key',
        phoneNumber: '+12345678900',
      })

      const result = await client.sendSMS({ to: '+10987654321', message: 'test message' })
      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith('https://api.vapi.ai/messages', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumberId: '+12345678900',
          to: '+10987654321',
          message: 'test message',
          type: 'sms',
        }),
      })
    })

    it('should throw error on API failure', async () => {
      ;(global.fetch as any).mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          text: async () => 'Unauthorized',
        })
      )

      const client = new VapiClient({
        apiKey: 'test-key',
        phoneNumber: '+12345678900',
      })

      await expect(client.sendSMS({ to: '+10987654321', message: 'test' })).rejects.toThrow('Vapi API POST /messages failed (401): Unauthorized')
    })
  })

  describe('makeCall', () => {
    it('should throw error when assistant ID not configured', async () => {
      const client = new VapiClient({
        apiKey: 'test-key',
        phoneNumber: '+12345678900',
      })
      await expect(client.makeCall({ to: '+12345678900', message: 'test' })).rejects.toThrow('Vapi assistant ID not configured')
    })

    it('should make call successfully', async () => {
      const mockResponse = {
        id: 'call_123',
        status: 'queued' as const,
        assistantId: 'asst_123',
        phoneNumberId: '+12345678900',
        customer: { number: '+10987654321' },
        createdAt: new Date().toISOString(),
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const client = new VapiClient({
        apiKey: 'test-key',
        phoneNumber: '+12345678900',
        assistantId: 'asst_123',
      })

      const result = await client.makeCall({ to: '+10987654321', message: 'test call' })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('sendEmail', () => {
    it('should throw error indicating email not implemented', async () => {
      const client = new VapiClient({ apiKey: 'test-key' })

      await expect(
        client.sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          body: 'Test body',
        })
      ).rejects.toThrow('Email escalation not implemented')
    })
  })
})

describe('VapiRateLimiter', () => {
  let rateLimiter: VapiRateLimiter
  let originalDateNow: () => number

  beforeEach(() => {
    rateLimiter = new VapiRateLimiter({
      smsPerHour: 10,
      callsPerDay: 5,
    })
    originalDateNow = Date.now
  })

  afterEach(() => {
    Date.now = originalDateNow
  })

  describe('SMS rate limiting', () => {
    it('should allow SMS when under limit', () => {
      expect(rateLimiter.canSendSMS()).toBe(true)
      expect(rateLimiter.getRemainingSMS()).toBe(10)
    })

    it('should enforce SMS rate limit', () => {
      // Send 10 SMS (at limit)
      for (let i = 0; i < 10; i++) {
        expect(rateLimiter.canSendSMS()).toBe(true)
        rateLimiter.recordSMS()
      }

      // 11th should be blocked
      expect(rateLimiter.canSendSMS()).toBe(false)
      expect(rateLimiter.getRemainingSMS()).toBe(0)
    })

    it('should reset SMS limit after 1 hour', () => {
      const mockTime = Date.now()
      Date.now = vi.fn(() => mockTime)

      // Send 10 SMS
      for (let i = 0; i < 10; i++) {
        rateLimiter.recordSMS()
      }
      expect(rateLimiter.canSendSMS()).toBe(false)

      // Advance time by 1 hour + 1ms
      Date.now = vi.fn(() => mockTime + 60 * 60 * 1000 + 1)

      // Should be able to send again
      expect(rateLimiter.canSendSMS()).toBe(true)
      expect(rateLimiter.getRemainingSMS()).toBe(10)
    })

    it('should track remaining SMS correctly', () => {
      expect(rateLimiter.getRemainingSMS()).toBe(10)

      rateLimiter.recordSMS()
      expect(rateLimiter.getRemainingSMS()).toBe(9)

      rateLimiter.recordSMS()
      rateLimiter.recordSMS()
      expect(rateLimiter.getRemainingSMS()).toBe(7)
    })
  })

  describe('Call rate limiting', () => {
    it('should allow calls when under limit', () => {
      expect(rateLimiter.canMakeCall()).toBe(true)
      expect(rateLimiter.getRemainingCalls()).toBe(5)
    })

    it('should enforce call rate limit', () => {
      // Make 5 calls (at limit)
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.canMakeCall()).toBe(true)
        rateLimiter.recordCall()
      }

      // 6th should be blocked
      expect(rateLimiter.canMakeCall()).toBe(false)
      expect(rateLimiter.getRemainingCalls()).toBe(0)
    })

    it('should reset call limit after 24 hours', () => {
      const mockTime = Date.now()
      Date.now = vi.fn(() => mockTime)

      // Make 5 calls
      for (let i = 0; i < 5; i++) {
        rateLimiter.recordCall()
      }
      expect(rateLimiter.canMakeCall()).toBe(false)

      // Advance time by 24 hours + 1ms
      Date.now = vi.fn(() => mockTime + 24 * 60 * 60 * 1000 + 1)

      // Should be able to call again
      expect(rateLimiter.canMakeCall()).toBe(true)
      expect(rateLimiter.getRemainingCalls()).toBe(5)
    })
  })

  describe('Timestamp cleanup', () => {
    it('should clean up old SMS timestamps when checking', () => {
      const mockTime = Date.now()
      Date.now = vi.fn(() => mockTime)

      // Record 3 SMS
      rateLimiter.recordSMS()
      rateLimiter.recordSMS()
      rateLimiter.recordSMS()
      expect(rateLimiter.getRemainingSMS()).toBe(7)

      // Advance time by 30 minutes
      Date.now = vi.fn(() => mockTime + 30 * 60 * 1000)
      expect(rateLimiter.getRemainingSMS()).toBe(7) // Still counting

      // Advance time by another 31 minutes (total 61 minutes)
      Date.now = vi.fn(() => mockTime + 61 * 60 * 1000)
      expect(rateLimiter.getRemainingSMS()).toBe(10) // Should be cleaned up
    })

    it('should clean up old call timestamps when checking', () => {
      const mockTime = Date.now()
      Date.now = vi.fn(() => mockTime)

      // Record 2 calls
      rateLimiter.recordCall()
      rateLimiter.recordCall()
      expect(rateLimiter.getRemainingCalls()).toBe(3)

      // Advance time by 12 hours
      Date.now = vi.fn(() => mockTime + 12 * 60 * 60 * 1000)
      expect(rateLimiter.getRemainingCalls()).toBe(3) // Still counting

      // Advance time by another 13 hours (total 25 hours)
      Date.now = vi.fn(() => mockTime + 25 * 60 * 60 * 1000)
      expect(rateLimiter.getRemainingCalls()).toBe(5) // Should be cleaned up
    })
  })
})

describe('EscalationManager', () => {
  let vapiClient: VapiClient
  let rateLimiter: VapiRateLimiter
  let escalationManager: EscalationManager
  const emergencyContact = '+12345678900'

  beforeEach(() => {
    vi.clearAllMocks()
    vapiClient = new VapiClient({
      apiKey: 'test-key',
      phoneNumber: '+10987654321',
      assistantId: 'asst_123',
    })
    rateLimiter = new VapiRateLimiter({
      smsPerHour: 10,
      callsPerDay: 5,
    })
    escalationManager = new EscalationManager(vapiClient, rateLimiter, emergencyContact)
  })

  const createContext = (priority: 'P0' | 'P1' | 'P2' | 'P3'): EscalationContext => ({
    issueNumber: 123,
    title: 'Test Issue',
    priority,
    author: 'testuser',
    description: 'Test description',
  })

  describe('P0 escalation', () => {
    it('should send SMS and make voice call for P0', async () => {
      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test', status: 'sent' }),
      })

      const result = await escalationManager.escalate(createContext('P0'))

      expect(result.success).toBe(true)
      expect(result.channel).toBe('sms+voice')
      expect(global.fetch).toHaveBeenCalledTimes(2) // SMS + voice call
    })

    it('should return SMS-only if voice call fails', async () => {
      let callCount = 0
      ;(global.fetch as any).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // SMS succeeds
          return Promise.resolve({
            ok: true,
            json: async () => ({ id: 'test', status: 'sent' }),
          })
        } else {
          // Voice call fails (will retry 3 times)
          return Promise.resolve({
            ok: false,
            status: 500,
            text: async () => 'Internal Server Error',
          })
        }
      })

      const result = await escalationManager.escalate(createContext('P0'))

      expect(result.success).toBe(true)
      expect(result.channel).toBe('sms') // Voice call failed, so only SMS succeeded
      expect(result.message).toBe('Escalated via SMS only (voice call failed)')
      // SMS + 3 failed voice call attempts (retry logic)
      expect(global.fetch).toHaveBeenCalled()
    })

    it('should return failure if SMS rate limit exceeded', async () => {
      // Exhaust SMS quota
      for (let i = 0; i < 10; i++) {
        rateLimiter.recordSMS()
      }

      const result = await escalationManager.escalate(createContext('P0'))

      expect(result.success).toBe(false)
      expect(result.channel).toBe('sms')
      expect(result.message).toBe('SMS rate limit exceeded')
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should return failure if SMS fails', async () => {
      ;(global.fetch as any).mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          text: async () => 'Unauthorized',
        })
      )

      const result = await escalationManager.escalate(createContext('P0'))

      expect(result.success).toBe(false)
      expect(result.channel).toBe('sms')
      expect(result.message).toContain('Vapi API POST /messages failed')
    })
  })

  describe('P1 escalation', () => {
    it('should send SMS only for P1', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'test', status: 'sent' }),
      })

      const result = await escalationManager.escalate(createContext('P1'))

      expect(result.success).toBe(true)
      expect(result.channel).toBe('sms')
      expect(global.fetch).toHaveBeenCalledTimes(1) // Only SMS
    })

    it('should handle SMS rate limit for P1', async () => {
      // Exhaust SMS quota
      for (let i = 0; i < 10; i++) {
        rateLimiter.recordSMS()
      }

      const result = await escalationManager.escalate(createContext('P1'))

      expect(result.success).toBe(false)
      expect(result.message).toBe('SMS rate limit exceeded')
    })
  })

  describe('P2/P3 escalation', () => {
    it('should fail for P2 (email not implemented)', async () => {
      const result = await escalationManager.escalate(createContext('P2'))

      expect(result.success).toBe(false)
      expect(result.channel).toBe('email')
      expect(result.message).toContain('Email escalation not implemented')
    })

    it('should fail for P3 (email not implemented)', async () => {
      const result = await escalationManager.escalate(createContext('P3'))

      expect(result.success).toBe(false)
      expect(result.channel).toBe('email')
      expect(result.message).toContain('Email escalation not implemented')
    })

    it('should gracefully handle email failures', async () => {
      const result = await escalationManager.escalate(createContext('P2'))

      expect(result.success).toBe(false)
      expect(result.channel).toBe('email')
      expect(result.message).toContain('not implemented')
    })
  })

  describe('Message formatting', () => {
    it('should format SMS correctly', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'test', status: 'sent' }),
      })

      await escalationManager.escalate(createContext('P0'))

      const smsCall = (global.fetch as any).mock.calls.find((call: any) => call[0].includes('/messages'))
      expect(smsCall).toBeDefined()
      const body = JSON.parse(smsCall[1].body)
      expect(body.message).toContain('[P0]')
      expect(body.message).toContain('Blocking issue #123')
      expect(body.message).toContain('Test Issue')
    })

    it('should attempt email formatting even though not implemented', async () => {
      // Email will fail, but we can verify the error message is appropriate
      const result = await escalationManager.escalate({
        ...createContext('P2'),
        blockedSince: '2025-10-01',
      })

      expect(result.success).toBe(false)
      expect(result.channel).toBe('email')
      expect(result.message).toContain('not implemented')
    })
  })
})
