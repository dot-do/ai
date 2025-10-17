/**
 * Workers RPC Client using Cap'n Web / Cloudflare Workers RPC
 *
 * This client uses service bindings for zero-latency Worker-to-Worker calls
 * with promise pipelining support.
 */

import type { RPCClientOptions, DBService, AIService, AuthService, UserService, BusinessContext } from './types'

/**
 * Environment with RPC service bindings
 */
export interface RPCServiceBindings {
  RPC?: any // RPC service binding (workers/rpc)
  AI_SERVICE?: any
  DB_SERVICE?: any
  MCP_SERVICE?: any
  PIPELINE_SERVICE?: any
  API_SERVICE?: any
}

/**
 * Detect if we're running in Cloudflare Workers context
 */
export function isWorkersContext(): boolean {
  // Check for Workers-specific globals
  return typeof caches !== 'undefined' && typeof Request !== 'undefined' && typeof Response !== 'undefined' && typeof addEventListener !== 'undefined'
}

/**
 * Workers RPC Client
 *
 * Uses Cloudflare Workers RPC with service bindings for fast, type-safe RPC calls
 */
export class WorkersRPCClient {
  private env: RPCServiceBindings

  constructor(env: RPCServiceBindings) {
    if (!env.RPC) {
      throw new Error('RPC service binding not found. Add RPC binding to wrangler.jsonc')
    }
    this.env = env
  }

  /**
   * Get AI service (with promise pipelining support)
   */
  get ai(): AIService {
    if (!this.env.RPC.AIService) {
      throw new Error('AIService not exposed by RPC worker')
    }
    return this.env.RPC.AIService as AIService
  }

  /**
   * Get DB service (with promise pipelining support)
   */
  get db(): DBService {
    if (!this.env.RPC.DBService) {
      throw new Error('DBService not exposed by RPC worker')
    }
    return this.env.RPC.DBService as DBService
  }

  /**
   * Get Auth service
   */
  get auth(): AuthService {
    // TODO: Add AuthService to RPC worker
    throw new Error('AuthService not yet implemented in RPC worker')
  }

  /**
   * Get User service
   */
  get user(): UserService {
    // TODO: Add UserService to RPC worker
    throw new Error('UserService not yet implemented in RPC worker')
  }

  /**
   * Generic service accessor with promise pipelining
   *
   * @example
   * const result = await client.service('ai').generateText({ prompt: 'Hello' })
   */
  service<T extends object>(serviceName: string): T {
    const serviceClass = `${serviceName.charAt(0).toUpperCase()}${serviceName.slice(1)}Service`

    if (!this.env.RPC[serviceClass]) {
      throw new Error(`${serviceClass} not exposed by RPC worker`)
    }

    return this.env.RPC[serviceClass] as T
  }

  /**
   * Call a specific service method directly
   *
   * @example
   * const text = await client.call('ai', 'generateText', { prompt: 'Hello' })
   */
  async call<T = unknown>(service: string, method: string, params?: unknown): Promise<T> {
    const serviceObj = this.service(service)

    if (typeof (serviceObj as any)[method] !== 'function') {
      throw new Error(`Method ${method} not found on ${service} service`)
    }

    // Call the RPC method with promise pipelining
    return (serviceObj as any)[method](params)
  }
}

/**
 * Create a Workers RPC client from service bindings
 *
 * @example
 * export default {
 *   async fetch(request: Request, env: Env) {
 *     const client = createWorkersRPCClient(env)
 *     const result = await client.ai.generateText({ prompt: 'Hello' })
 *     return Response.json(result)
 *   }
 * }
 */
export function createWorkersRPCClient(env: RPCServiceBindings): WorkersRPCClient {
  return new WorkersRPCClient(env)
}

/**
 * Create a Business Context using Workers RPC
 *
 * This provides the same $ interface but uses Workers RPC under the hood
 * for zero-latency calls with promise pipelining.
 */
export function createWorkersBusinessContext<TMetadata = Record<string, any>>(
  env: RPCServiceBindings,
  options?: RPCClientOptions
): Partial<BusinessContext<TMetadata>> {
  const client = createWorkersRPCClient(env)

  // Import graphdl $ proxy
  // Note: This is simplified - full implementation would include all services
  return {
    db: client.db,
    ai: client.ai,
    // TODO: Add other services as they're implemented in RPC worker
    // auth: client.auth,
    // user: client.user as UserService<TMetadata>,
    // send: ...,
    // on: ...,
    // every: ...,
    // etc.
  }
}
