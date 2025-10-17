/**
 * Tests for Vault Service
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { VaultService, createVaultService } from './vault'
import type { VaultSecret, SecretMetadata, VaultResponse, HealthResponse } from './vault'

describe('VaultService', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let service: VaultService

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    service = new VaultService('https://test.vault.do', 'test-api-key')
  })

  describe('constructor', () => {
    test('creates service with default baseUrl', () => {
      const defaultService = new VaultService()
      expect(defaultService).toBeInstanceOf(VaultService)
    })

    test('creates service with custom baseUrl and apiKey', () => {
      expect(service).toBeInstanceOf(VaultService)
    })
  })

  describe('store()', () => {
    test('stores a secret', async () => {
      const mockMetadata: SecretMetadata = {
        key: 'api_key',
        organizationId: 'org_123',
        createdAt: '2025-10-11T16:00:00Z',
        updatedAt: '2025-10-11T16:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockMetadata }),
      })

      const result = await service.store('org_123', 'api_key', 'secret_value')

      expect(mockFetch).toHaveBeenCalledWith('https://test.vault.do/secrets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: JSON.stringify({
          organizationId: 'org_123',
          key: 'api_key',
          value: 'secret_value',
          metadata: undefined,
        }),
      })

      expect(result.key).toBe('api_key')
      expect(result.organizationId).toBe('org_123')
    })

    test('stores a secret with metadata', async () => {
      const mockMetadata: SecretMetadata = {
        key: 'api_key',
        organizationId: 'org_123',
        createdAt: '2025-10-11T16:00:00Z',
        updatedAt: '2025-10-11T16:00:00Z',
        metadata: { description: 'Test API key' },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockMetadata }),
      })

      const result = await service.store('org_123', 'api_key', 'secret_value', {
        metadata: { description: 'Test API key' },
      })

      expect(result.metadata?.description).toBe('Test API key')
    })

    test('throws error on store failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid secret',
      })

      await expect(service.store('org_123', 'invalid', 'value')).rejects.toThrow('Failed to store secret: Invalid secret')
    })
  })

  describe('get()', () => {
    test('retrieves a secret', async () => {
      const mockSecret: VaultSecret = {
        key: 'api_key',
        value: 'secret_value',
        metadata: { description: 'Test API key' },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockSecret }),
      })

      const result = await service.get('org_123', 'api_key')

      expect(mockFetch).toHaveBeenCalledWith('https://test.vault.do/secrets/org_123/api_key', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result.key).toBe('api_key')
      expect(result.value).toBe('secret_value')
    })

    test('throws error when secret not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not found',
      })

      await expect(service.get('org_123', 'nonexistent')).rejects.toThrow('Secret not found: nonexistent')
    })

    test('throws error on get failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Server error',
      })

      await expect(service.get('org_123', 'api_key')).rejects.toThrow('Failed to get secret: Server error')
    })
  })

  describe('delete()', () => {
    test('deletes a secret', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      await service.delete('org_123', 'api_key')

      expect(mockFetch).toHaveBeenCalledWith('https://test.vault.do/secrets/org_123/api_key', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })
    })

    test('throws error on delete failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not found',
      })

      await expect(service.delete('org_123', 'nonexistent')).rejects.toThrow('Failed to delete secret: Not found')
    })
  })

  describe('list()', () => {
    test('lists all secrets', async () => {
      const mockSecrets: SecretMetadata[] = [
        {
          key: 'api_key_1',
          organizationId: 'org_123',
          createdAt: '2025-10-11T16:00:00Z',
          updatedAt: '2025-10-11T16:00:00Z',
        },
        {
          key: 'api_key_2',
          organizationId: 'org_123',
          createdAt: '2025-10-11T16:00:00Z',
          updatedAt: '2025-10-11T16:00:00Z',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockSecrets }),
      })

      const result = await service.list('org_123')

      expect(mockFetch).toHaveBeenCalledWith('https://test.vault.do/secrets/org_123', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result).toHaveLength(2)
      expect(result[0].key).toBe('api_key_1')
    })

    test('lists secrets with prefix filter', async () => {
      const mockSecrets: SecretMetadata[] = [
        {
          key: 'api_key_1',
          organizationId: 'org_123',
          createdAt: '2025-10-11T16:00:00Z',
          updatedAt: '2025-10-11T16:00:00Z',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockSecrets }),
      })

      const result = await service.list('org_123', { prefix: 'api_' })

      expect(mockFetch).toHaveBeenCalledWith('https://test.vault.do/secrets/org_123?prefix=api_', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })

      expect(result).toHaveLength(1)
    })

    test('throws error on list failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Server error',
      })

      await expect(service.list('org_123')).rejects.toThrow('Failed to list secrets: Server error')
    })
  })

  describe('health()', () => {
    test('checks vault health', async () => {
      const mockHealth: HealthResponse = {
        status: 'ok',
        service: 'vault',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockHealth,
      })

      const result = await service.health()

      expect(result.status).toBe('ok')
      expect(result.service).toBe('vault')
    })

    test('throws error on health check failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      })

      await expect(service.health()).rejects.toThrow('Health check failed: Service Unavailable')
    })
  })

  describe('exists()', () => {
    test('returns true if secret exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { key: 'api_key', value: 'secret_value' },
        }),
      })

      const result = await service.exists('org_123', 'api_key')

      expect(result).toBe(true)
    })

    test('returns false if secret does not exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not found',
      })

      const result = await service.exists('org_123', 'nonexistent')

      expect(result).toBe(false)
    })
  })

  describe('update()', () => {
    test('updates existing secret', async () => {
      // Mock exists() call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { key: 'api_key', value: 'old_value' },
        }),
      })

      // Mock delete() call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      // Mock store() call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            key: 'api_key',
            organizationId: 'org_123',
            createdAt: '2025-10-11T16:00:00Z',
            updatedAt: '2025-10-11T16:05:00Z',
          },
        }),
      })

      const result = await service.update('org_123', 'api_key', 'new_value')

      expect(result.key).toBe('api_key')
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    test('creates secret if it does not exist', async () => {
      // Mock exists() call
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      // Mock store() call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            key: 'new_key',
            organizationId: 'org_123',
            createdAt: '2025-10-11T16:00:00Z',
            updatedAt: '2025-10-11T16:00:00Z',
          },
        }),
      })

      const result = await service.update('org_123', 'new_key', 'value')

      expect(result.key).toBe('new_key')
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('rotate()', () => {
    test('rotates secret with generator function', async () => {
      // Mock exists() call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { key: 'api_key', value: 'old_value' },
        }),
      })

      // Mock delete() call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      // Mock store() call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            key: 'api_key',
            organizationId: 'org_123',
            createdAt: '2025-10-11T16:00:00Z',
            updatedAt: '2025-10-11T16:05:00Z',
            metadata: { rotatedAt: expect.any(String) },
          },
        }),
      })

      const result = await service.rotate('org_123', 'api_key', () => 'new_generated_value')

      expect(result.key).toBe('api_key')
      expect(result.metadata?.rotatedAt).toBeDefined()
    })
  })

  describe('bulkStore()', () => {
    test('stores multiple secrets', async () => {
      const secret1 = {
        key: 'key1',
        organizationId: 'org_123',
        createdAt: '2025-10-11T16:00:00Z',
        updatedAt: '2025-10-11T16:00:00Z',
      }
      const secret2 = {
        key: 'key2',
        organizationId: 'org_123',
        createdAt: '2025-10-11T16:00:00Z',
        updatedAt: '2025-10-11T16:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: secret1 }),
      })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: secret2 }),
      })

      const result = await service.bulkStore('org_123', {
        key1: 'value1',
        key2: 'value2',
      })

      expect(result).toHaveLength(2)
      expect(result[0].key).toBe('key1')
      expect(result[1].key).toBe('key2')
    })
  })

  describe('bulkDelete()', () => {
    test('deletes multiple secrets', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      await service.bulkDelete('org_123', ['key1', 'key2'])

      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('count()', () => {
    test('counts secrets', async () => {
      const mockSecrets: SecretMetadata[] = [
        {
          key: 'api_key_1',
          organizationId: 'org_123',
          createdAt: '2025-10-11T16:00:00Z',
          updatedAt: '2025-10-11T16:00:00Z',
        },
        {
          key: 'api_key_2',
          organizationId: 'org_123',
          createdAt: '2025-10-11T16:00:00Z',
          updatedAt: '2025-10-11T16:00:00Z',
        },
        {
          key: 'api_key_3',
          organizationId: 'org_123',
          createdAt: '2025-10-11T16:00:00Z',
          updatedAt: '2025-10-11T16:00:00Z',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockSecrets }),
      })

      const result = await service.count('org_123')

      expect(result).toBe(3)
    })
  })

  describe('createVaultService', () => {
    test('creates service instance with factory function', () => {
      const factoryService = createVaultService('https://test.do', 'test-key')
      expect(factoryService).toBeInstanceOf(VaultService)
    })
  })
})
