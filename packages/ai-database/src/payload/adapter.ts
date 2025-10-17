/**
 * Payload Durable Object adapter
 *
 * High-level wrapper for using Payload CMS in Cloudflare Durable Objects.
 * Combines metadata fetching and Payload initialization into a simple API.
 */

// Type imports - these will be available at runtime in Cloudflare Workers
type DurableObjectState = import('@cloudflare/workers-types').DurableObjectState

import type { DatabaseMetadata, PayloadInstance, PayloadEnv } from './types.js'
import { fetchDatabaseMetadata } from './metadata.js'
import { initializePayload, shouldHandleWithPayload, createPayloadHealthResponse } from './initializer.js'

/**
 * Payload Durable Object Manager
 *
 * Manages Payload CMS lifecycle in a Durable Object:
 * - Fetches database metadata
 * - Initializes Payload if enabled
 * - Routes requests appropriately
 * - Provides health checks
 */
export class PayloadDOManager {
  private metadata?: DatabaseMetadata
  private payloadInstance?: PayloadInstance
  private initialized = false

  constructor(
    private state: DurableObjectState,
    private env: PayloadEnv
  ) {}

  /**
   * Initialize the manager
   *
   * Fetches metadata and initializes Payload if enabled.
   * This should be called once per request or lazily.
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    try {
      // Fetch database metadata
      const { metadata } = await fetchDatabaseMetadata({
        payloadBinding: this.env.PAYLOAD,
        doId: this.state.id.toString(),
      })

      this.metadata = metadata

      // Initialize Payload if enabled
      if (metadata.payload?.enabled) {
        this.payloadInstance = await initializePayload({
          state: this.state,
          secret: this.env.PAYLOAD_SECRET,
          metadata,
          debug: false,
        })
      } else {
        console.log('Payload not enabled for this database')
      }

      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize PayloadDOManager:', error)
      throw error
    }
  }

  /**
   * Get database metadata
   */
  getMetadata(): DatabaseMetadata | undefined {
    return this.metadata
  }

  /**
   * Get Payload instance
   */
  getPayload(): PayloadInstance | undefined {
    return this.payloadInstance
  }

  /**
   * Check if Payload is enabled and initialized
   */
  isPayloadEnabled(): boolean {
    return this.payloadInstance?.enabled === true
  }

  /**
   * Handle an HTTP request
   *
   * Routes the request to Payload if appropriate, otherwise returns null.
   *
   * @param request - HTTP request
   * @returns Response from Payload, or null if request should not be handled by Payload
   */
  async handleRequest(request: Request): Promise<Response | null> {
    // Ensure initialized
    await this.initialize()

    if (!this.payloadInstance || !this.payloadInstance.enabled) {
      return null
    }

    // Check if request should be handled by Payload
    if (shouldHandleWithPayload(request, this.payloadInstance.config)) {
      return this.payloadInstance.handleRequest(request)
    }

    return null
  }

  /**
   * Create a health check response
   */
  async healthCheck(): Promise<Response> {
    await this.initialize()

    if (!this.metadata) {
      return Response.json(
        {
          status: 'unhealthy',
          error: 'Metadata not loaded',
        },
        { status: 500 }
      )
    }

    if (!this.payloadInstance) {
      return Response.json({
        status: 'healthy',
        payload: {
          enabled: false,
        },
        database: {
          id: this.metadata.id,
          name: this.metadata.name,
        },
      })
    }

    return createPayloadHealthResponse(this.metadata, this.payloadInstance)
  }
}

/**
 * Create a Payload DO manager
 *
 * @param state - Durable Object state
 * @param env - Environment bindings
 * @returns Payload DO manager instance
 *
 * @example
 * ```typescript
 * export class MyDurableObject extends DurableObject {
 *   private payloadManager: PayloadDOManager
 *
 *   constructor(state: DurableObjectState, env: Env) {
 *     super(state, env)
 *     this.payloadManager = createPayloadManager(state, env)
 *   }
 *
 *   async fetch(request: Request) {
 *     // Try Payload first
 *     const payloadResponse = await this.payloadManager.handleRequest(request)
 *     if (payloadResponse) {
 *       return payloadResponse
 *     }
 *
 *     // Handle with custom logic
 *     return new Response('Hello')
 *   }
 * }
 * ```
 */
export function createPayloadManager(state: DurableObjectState, env: PayloadEnv): PayloadDOManager {
  return new PayloadDOManager(state, env)
}
