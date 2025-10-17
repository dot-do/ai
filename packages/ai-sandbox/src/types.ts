/**
 * Types for ai-sandbox
 *
 * Provides type-safe interfaces for creating and executing code in isolated sandboxes
 */

/// <reference types="@cloudflare/workers-types" />

/**
 * Constants for sandbox configuration
 */
export const SANDBOX_CONSTANTS = {
  /** Base URL for loader requests */
  LOADER_URL: 'http://loader',
  /** Base URL for service RPC requests */
  SERVICE_URL: 'http://service',
  /** Maximum script size in characters (1MB) */
  MAX_SCRIPT_SIZE: 1_000_000,
  /** Maximum module size in characters (1MB) */
  MAX_MODULE_SIZE: 1_000_000,
} as const

/**
 * Worker Loader binding interface
 */
export interface WorkerLoader {
  get(id: string, codeProvider: () => Promise<WorkerParams> | WorkerParams): Promise<Fetcher>
}

/**
 * Known service bindings with type safety
 */
export interface ServiceBindings {
  AI_SERVICE?: Fetcher
  API_SERVICE?: Fetcher
  MCP_SERVICE?: Fetcher
  OAUTH_SERVICE?: Fetcher
  PIPELINE_SERVICE?: Fetcher
  DB_SERVICE?: Fetcher
  QUEUE_SERVICE?: Fetcher
  [key: string]: Fetcher | undefined
}

/**
 * Request to execute code in a sandbox
 */
export interface SandboxExecuteRequest {
  /** The code to execute */
  script: string
  /** Optional module code (for ESM exports) */
  module?: string
  /** Environment variables to inject */
  env?: Record<string, any>
  /** Whether to capture console output */
  captureConsole?: boolean
  /** Service bindings to inject */
  bindings?: ServiceBindings
}

/**
 * Response from sandbox execution
 */
export interface SandboxExecuteResponse {
  /** The result of the execution */
  result?: any
  /** Module exports (if module code was provided) */
  exports?: Record<string, any>
  /** Captured console output */
  console?: string[]
  /** Error message if execution failed */
  error?: string
}

/**
 * Parameters for creating a dynamic worker
 */
export interface WorkerParams {
  /** Compatibility date for the worker */
  compatibilityDate: string
  /** Main module name */
  mainModule: string
  /** Module code */
  modules: Record<string, string>
  /** Service bindings */
  bindings?: ServiceBindings
  /** Environment variables */
  env?: Record<string, any>
}

/**
 * Request to create a dynamic worker
 */
export interface CreateWorkerRequest {
  /** Unique ID for the worker */
  id: string
  /** Worker parameters */
  params: WorkerParams
}

/**
 * Options for wrapping code
 */
export interface WrapOptions {
  /** Whether to capture console output */
  captureConsole?: boolean
  /** Whether to auto-return the last expression */
  autoReturn?: boolean
  /** SDK globals to inject */
  sdkGlobals?: string
}

/**
 * Cloudflare Sandbox SDK - Abstract interface to all sandbox methods
 *
 * This interface represents the full Cloudflare Workers Sandbox API.
 * Implementations should provide access to all sandbox functionality.
 */
export interface CloudflareSandbox {
  /**
   * Execute code in a sandbox with the simplified do(script, module) interface
   */
  do(request: SandboxExecuteRequest): Promise<SandboxExecuteResponse>

  /**
   * Create a dynamic worker
   */
  createWorker(request: CreateWorkerRequest): Promise<Response>

  /**
   * Get information about a worker
   */
  getWorker(id: string): Promise<Response>

  /**
   * Delete a worker
   */
  deleteWorker(id: string): Promise<Response>

  /**
   * List all workers
   */
  listWorkers(): Promise<Response>

  /**
   * Execute a request on a worker
   */
  executeWorker(id: string, request: Request): Promise<Response>
}

/**
 * SDK globals generator function
 */
export type SDKGlobalsGenerator = (bindings?: Record<string, Fetcher>) => string

/**
 * Validation error class
 */
export class SandboxValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SandboxValidationError'
  }
}
