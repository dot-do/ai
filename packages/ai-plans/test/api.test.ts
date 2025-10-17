import { describe, it, expect, beforeEach, vi } from 'vitest'
import { API } from '../src/api'

describe('API client', () => {
  let api: API

  beforeEach(() => {
    api = new API()
  })

  describe('constructor', () => {
    it('should create API instance with default config', () => {
      expect(api).toBeDefined()
    })

    it('should accept custom baseUrl', () => {
      const customApi = new API({ baseUrl: 'https://custom.api.com' })
      expect(customApi).toBeDefined()
    })

    it('should accept custom headers', () => {
      const customApi = new API({
        headers: { Authorization: 'Bearer token' },
      })
      expect(customApi).toBeDefined()
    })
  })

  describe('API methods', () => {
    it('should have create method', () => {
      expect(typeof api.create).toBe('function')
    })

    it('should have update method', () => {
      expect(typeof api.update).toBe('function')
    })

    it('should have get method', () => {
      expect(typeof api.get).toBe('function')
    })

    it('should handle create requests', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'test-id', name: 'Test Plan' }),
      })

      const result = await api.create('plans', { name: 'Test Plan' })
      expect(result).toEqual({ id: 'test-id', name: 'Test Plan' })
    })

    it('should handle errors gracefully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      })

      await expect(api.get('plans', 'invalid-id')).rejects.toThrow('Failed to get plans: Not Found')
    })
  })
})
