/**
 * sandbox.do SDK - TypeScript SDK for Cloudflare Sandbox API
 *
 * Provides a type-safe client for interacting with the sandbox worker
 */

import type { SandboxExecuteRequest, SandboxExecuteResponse, CreateWorkerRequest } from 'ai-sandbox'

export type { SandboxExecuteRequest, SandboxExecuteResponse, CreateWorkerRequest }

/**
 * Configuration for the Sandbox SDK
 */
export interface SandboxConfig {
  /** Base URL of the sandbox API */
  baseUrl: string
  /** Optional API key for authentication */
  apiKey?: string
  /** Optional custom headers */
  headers?: Record<string, string>
}

/**
 * Worker information response
 */
export interface WorkerInfo {
  id: string
  params: {
    compatibilityDate: string
    mainModule: string
    modules: Record<string, string>
  }
  created: string
  status: 'active' | 'inactive'
}

/**
 * Sandbox SDK Client
 *
 * Provides methods to interact with the Cloudflare Sandbox API
 */
export class SandboxClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(config: SandboxConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    }

    if (config.apiKey) {
      this.headers['Authorization'] = `Bearer ${config.apiKey}`
    }
  }

  /**
   * Execute code with SDK primitives (simplified do interface)
   */
  async do(request: SandboxExecuteRequest): Promise<SandboxExecuteResponse> {
    // Client-side validation - fail fast before making request
    if (!request.script || typeof request.script !== 'string') {
      throw new Error('Missing or invalid "script" field')
    }

    if (request.script.length === 0) {
      throw new Error('Script cannot be empty')
    }

    if (request.module && typeof request.module !== 'string') {
      throw new Error('Invalid "module" field - must be a string')
    }

    const response = await fetch(`${this.baseUrl}/do`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(`Sandbox execution failed: ${errorBody.error || response.statusText}`)
    }

    return response.json()
  }

  /**
   * Create a new worker
   */
  async createWorker(request: CreateWorkerRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/workers`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(`Worker creation failed: ${errorBody.error || response.statusText}`)
    }
  }

  /**
   * Get information about a worker
   */
  async getWorker(id: string): Promise<WorkerInfo> {
    const response = await fetch(`${this.baseUrl}/workers/${id}`, {
      method: 'GET',
      headers: this.headers,
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(`Failed to get worker: ${errorBody.error || response.statusText}`)
    }

    return response.json()
  }

  /**
   * Delete a worker
   */
  async deleteWorker(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/workers/${id}`, {
      method: 'DELETE',
      headers: this.headers,
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(`Failed to delete worker: ${errorBody.error || response.statusText}`)
    }
  }

  /**
   * List all workers
   */
  async listWorkers(): Promise<WorkerInfo[]> {
    const response = await fetch(`${this.baseUrl}/workers`, {
      method: 'GET',
      headers: this.headers,
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(`Failed to list workers: ${errorBody.error || response.statusText}`)
    }

    return response.json()
  }

  /**
   * Execute a request on a worker
   */
  async executeWorker(id: string, request: Request): Promise<Response> {
    return fetch(`${this.baseUrl}/workers/${id}/execute`, {
      method: 'POST',
      headers: {
        ...this.headers,
        ...Object.fromEntries(request.headers.entries()),
      },
      body: request.body,
    })
  }

  /**
   * Check sandbox health
   */
  async health(): Promise<{
    service: string
    status: string
    timestamp: number
    version: string
  }> {
    const response = await fetch(`${this.baseUrl}/health`, {
      method: 'GET',
      headers: this.headers,
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(`Health check failed: ${errorBody.error || response.statusText}`)
    }

    return response.json()
  }
}

/**
 * Create a Sandbox SDK client
 */
export function createSandboxClient(config: SandboxConfig): SandboxClient {
  return new SandboxClient(config)
}

/**
 * Default export for convenience
 */
export default {
  createSandboxClient,
  SandboxClient,
}
