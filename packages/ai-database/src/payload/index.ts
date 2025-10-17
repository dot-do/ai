/**
 * Payload CMS integration for ai-database
 *
 * Provides utilities for running Payload CMS on Cloudflare Durable Objects
 * with the @payloadcms/db-do-sqlite adapter.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { createPayloadManager } from 'ai-database/payload'
 *
 * export class PayloadDO extends DurableObject {
 *   private payloadManager: PayloadDOManager
 *
 *   constructor(state: DurableObjectState, env: Env) {
 *     super(state, env)
 *     this.payloadManager = createPayloadManager(state, env)
 *   }
 *
 *   async fetch(request: Request) {
 *     // Health check
 *     if (new URL(request.url).pathname === '/health') {
 *       return this.payloadManager.healthCheck()
 *     }
 *
 *     // Try Payload first
 *     const response = await this.payloadManager.handleRequest(request)
 *     if (response) {
 *       return response
 *     }
 *
 *     // Custom logic here
 *     return new Response('Not found', { status: 404 })
 *   }
 * }
 * ```
 */

// Core exports
export { PayloadDOManager, createPayloadManager } from './adapter.js'
export { fetchDatabaseMetadata, isPayloadEnabled, getEnabledCollections, createMetadataCacheKey } from './metadata.js'
export { initializePayload, shouldHandleWithPayload, createPayloadHealthResponse } from './initializer.js'

// Type exports
export type { DatabaseMetadata, PayloadConfig, PayloadInitOptions, PayloadInstance, MetadataFetchOptions, MetadataFetchResult, PayloadEnv } from './types.js'
