/**
 * Vault Service for SDK.do
 *
 * Provides methods for secure secrets management using WorkOS Vault.
 * Multi-tenant secrets storage with encryption at rest and per-organization isolation.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Store a secret
 * await $.vault.store('org_123', 'api_key', 'secret_value', {
 *   description: 'External API key'
 * })
 *
 * // Retrieve a secret
 * const secret = await $.vault.get('org_123', 'api_key')
 * console.log(secret.value)
 *
 * // List all secrets
 * const secrets = await $.vault.list('org_123')
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface VaultSecret {
  key: string
  value: string
  metadata?: Record<string, any>
}

export interface SecretMetadata {
  key: string
  organizationId: string
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
}

export interface StoreSecretOptions {
  /**
   * Additional metadata to store with the secret
   */
  metadata?: Record<string, any>
}

export interface ListSecretsOptions {
  /**
   * Filter secrets by key prefix
   */
  prefix?: string
}

export interface VaultResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface HealthResponse {
  status: string
  service: string
}

// ============================================================================
// VAULT SERVICE
// ============================================================================

export class VaultService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://vault.do', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Get authorization headers for authenticated requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }

  /**
   * Store a secret for an organization
   *
   * @param organizationId - Organization ID for multi-tenant isolation
   * @param key - Secret key/name
   * @param value - Secret value (encrypted at rest)
   * @param options - Optional metadata
   * @returns Storage result with secret metadata
   *
   * @example
   * ```typescript
   * await $.vault.store('org_123', 'stripe_secret_key', 'sk_live_...', {
   *   description: 'Stripe production API key',
   *   environment: 'production',
   *   rotation: '90d'
   * })
   * ```
   */
  async store(organizationId: string, key: string, value: string, options: StoreSecretOptions = {}): Promise<SecretMetadata> {
    const response = await fetch(`${this.baseUrl}/secrets`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        organizationId,
        key,
        value,
        metadata: options.metadata,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to store secret: ${error}`)
    }

    const result = await response.json<VaultResponse<SecretMetadata>>()

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to store secret')
    }

    return result.data
  }

  /**
   * Retrieve a secret by key
   *
   * @param organizationId - Organization ID
   * @param key - Secret key to retrieve
   * @returns Secret with decrypted value
   *
   * @example
   * ```typescript
   * const secret = await $.vault.get('org_123', 'stripe_secret_key')
   * console.log(secret.value) // 'sk_live_...'
   * console.log(secret.metadata) // { description: '...', ... }
   * ```
   */
  async get(organizationId: string, key: string): Promise<VaultSecret> {
    const response = await fetch(`${this.baseUrl}/secrets/${organizationId}/${key}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Secret not found: ${key}`)
      }
      const error = await response.text()
      throw new Error(`Failed to get secret: ${error}`)
    }

    const result = await response.json<VaultResponse<VaultSecret>>()

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to get secret')
    }

    return result.data
  }

  /**
   * Delete a secret
   *
   * @param organizationId - Organization ID
   * @param key - Secret key to delete
   *
   * @example
   * ```typescript
   * await $.vault.delete('org_123', 'old_api_key')
   * console.log('Secret deleted')
   * ```
   */
  async delete(organizationId: string, key: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/secrets/${organizationId}/${key}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to delete secret: ${error}`)
    }

    const result = await response.json<VaultResponse>()

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete secret')
    }
  }

  /**
   * List all secrets for an organization
   *
   * @param organizationId - Organization ID
   * @param options - List options (prefix filter)
   * @returns Array of secret metadata (values not included)
   *
   * @example
   * ```typescript
   * // List all secrets
   * const secrets = await $.vault.list('org_123')
   * console.log(secrets.length) // 15
   *
   * // List with prefix filter
   * const apiKeys = await $.vault.list('org_123', { prefix: 'api_' })
   * console.log(apiKeys) // Only keys starting with 'api_'
   * ```
   */
  async list(organizationId: string, options: ListSecretsOptions = {}): Promise<SecretMetadata[]> {
    const params = new URLSearchParams()
    if (options.prefix) {
      params.set('prefix', options.prefix)
    }

    const url = `${this.baseUrl}/secrets/${organizationId}${params.toString() ? `?${params}` : ''}`

    const response = await fetch(url, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to list secrets: ${error}`)
    }

    const result = await response.json<VaultResponse<SecretMetadata[]>>()

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to list secrets')
    }

    return result.data
  }

  /**
   * Check vault health status
   *
   * @returns Health status
   *
   * @example
   * ```typescript
   * const health = await $.vault.health()
   * console.log(health.status) // 'ok'
   * ```
   */
  async health(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/health`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Helper method to check if a secret exists
   *
   * @param organizationId - Organization ID
   * @param key - Secret key to check
   * @returns True if secret exists
   *
   * @example
   * ```typescript
   * if (await $.vault.exists('org_123', 'api_key')) {
   *   console.log('Secret exists')
   * }
   * ```
   */
  async exists(organizationId: string, key: string): Promise<boolean> {
    try {
      await this.get(organizationId, key)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Helper method to update a secret (delete + store)
   *
   * @param organizationId - Organization ID
   * @param key - Secret key to update
   * @param value - New secret value
   * @param options - Optional metadata
   * @returns Updated secret metadata
   *
   * @example
   * ```typescript
   * await $.vault.update('org_123', 'api_key', 'new_value', {
   *   rotatedAt: new Date().toISOString()
   * })
   * ```
   */
  async update(organizationId: string, key: string, value: string, options: StoreSecretOptions = {}): Promise<SecretMetadata> {
    // Delete existing secret if it exists
    const exists = await this.exists(organizationId, key)
    if (exists) {
      await this.delete(organizationId, key)
    }

    // Store new secret
    return this.store(organizationId, key, value, options)
  }

  /**
   * Helper method to rotate a secret (generate new value)
   *
   * @param organizationId - Organization ID
   * @param key - Secret key to rotate
   * @param generator - Function to generate new secret value
   * @returns Updated secret metadata
   *
   * @example
   * ```typescript
   * await $.vault.rotate('org_123', 'api_token', () => {
   *   return crypto.randomUUID()
   * })
   * ```
   */
  async rotate(organizationId: string, key: string, generator: () => string | Promise<string>): Promise<SecretMetadata> {
    const newValue = await generator()
    return this.update(organizationId, key, newValue, {
      metadata: {
        rotatedAt: new Date().toISOString(),
      },
    })
  }

  /**
   * Helper method to bulk store secrets
   *
   * @param organizationId - Organization ID
   * @param secrets - Object of key-value pairs
   * @returns Array of stored secret metadata
   *
   * @example
   * ```typescript
   * await $.vault.bulkStore('org_123', {
   *   'stripe_key': 'sk_live_...',
   *   'sendgrid_key': 'SG...',
   *   'twilio_sid': 'AC...'
   * })
   * ```
   */
  async bulkStore(organizationId: string, secrets: Record<string, string>): Promise<SecretMetadata[]> {
    const promises = Object.entries(secrets).map(([key, value]) => this.store(organizationId, key, value))

    return Promise.all(promises)
  }

  /**
   * Helper method to bulk delete secrets
   *
   * @param organizationId - Organization ID
   * @param keys - Array of secret keys to delete
   *
   * @example
   * ```typescript
   * await $.vault.bulkDelete('org_123', [
   *   'old_api_key',
   *   'deprecated_token',
   *   'unused_secret'
   * ])
   * ```
   */
  async bulkDelete(organizationId: string, keys: string[]): Promise<void> {
    const promises = keys.map((key) => this.delete(organizationId, key))
    await Promise.all(promises)
  }

  /**
   * Helper method to get secret count for an organization
   *
   * @param organizationId - Organization ID
   * @returns Number of secrets stored
   *
   * @example
   * ```typescript
   * const count = await $.vault.count('org_123')
   * console.log(`Organization has ${count} secrets`)
   * ```
   */
  async count(organizationId: string): Promise<number> {
    const secrets = await this.list(organizationId)
    return secrets.length
  }
}

/**
 * Create vault service instance
 */
export function createVaultService(baseUrl?: string, apiKey?: string): VaultService {
  return new VaultService(baseUrl, apiKey)
}

/**
 * Default vault service instance
 */
export const vault = createVaultService()
