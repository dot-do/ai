/**
 * Dynamic Worker Loader
 *
 * Functions for creating and managing dynamic workers using Cloudflare Worker Loaders
 */

import type { SandboxExecuteRequest, SandboxExecuteResponse, CreateWorkerRequest, WorkerParams } from './types'
import { SANDBOX_CONSTANTS, SandboxValidationError } from './types'
import { wrapModule, wrapCode, createSDKGlobals } from './wrapper'

/**
 * Execute script with module using simplified do(script, module) interface
 * This is the new simplified interface with SDK primitives injected
 */
export async function executeInSandbox(request: SandboxExecuteRequest, loaderBinding: any): Promise<SandboxExecuteResponse> {
  try {
    // Validate inputs at entry point before any processing
    const { validateScript, validateModule } = await import('./validation')
    validateScript(request.script)
    if (request.module) {
      validateModule(request.module)
    }

    const executionId = crypto.randomUUID()
    const captureConsole = request.captureConsole ?? true

    // Create SDK globals from bindings
    const sdkGlobals = request.bindings ? createSDKGlobals(request.bindings) : ''

    // Create dynamic worker using Worker Loader API
    const worker = loaderBinding.get(executionId, () => ({
      compatibilityDate: '2025-10-04',
      mainModule: 'main.js',
      modules: {
        'main.js': wrapModule(request.script, request.module, {
          captureConsole,
          autoReturn: true,
          sdkGlobals,
        }),
      },
      bindings: request.bindings || {},
      env: request.env || {},
    }))

    // Get the entrypoint (returns Fetcher)
    const entrypoint = worker.getEntrypoint()

    // Execute the worker by calling its fetch handler
    const response = await entrypoint.fetch(new Request('http://worker'))

    if (!response.ok) {
      const error = await response.text()
      return {
        error: `Worker execution failed: ${error}`,
      }
    }

    // Parse and return the result
    const result = await response.json()
    return result as SandboxExecuteResponse
  } catch (error) {
    // Handle validation errors specially to preserve security context
    if (error instanceof SandboxValidationError) {
      return {
        error: `Validation error: ${error.message}`,
      }
    }
    return {
      error: `Execution error: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

/**
 * Execute code using Dynamic Worker Loader (legacy/simple interface)
 */
export async function executeCode(
  code: string,
  loaderBinding: any,
  options: { env?: Record<string, any>; captureConsole?: boolean } = {}
): Promise<SandboxExecuteResponse> {
  try {
    // Validate inputs at entry point before any processing
    const { validateScript } = await import('./validation')
    validateScript(code)

    const executionId = crypto.randomUUID()
    const captureConsole = options.captureConsole ?? true

    // Create dynamic worker using Worker Loader API
    const worker = loaderBinding.get(executionId, () => ({
      compatibilityDate: '2025-10-04',
      mainModule: 'main.js',
      modules: {
        'main.js': wrapCode(code, captureConsole),
      },
      // Sandboxed - no bindings, no env access (unless explicitly provided)
      env: options.env || {},
    }))

    // Get the entrypoint (returns Fetcher)
    const entrypoint = worker.getEntrypoint()

    // Execute the worker by calling its fetch handler
    const response = await entrypoint.fetch(new Request('http://worker'))

    if (!response.ok) {
      const error = await response.text()
      return {
        error: `Worker execution failed: ${error}`,
      }
    }

    // Parse and return the result
    const result = await response.json()
    return result as SandboxExecuteResponse
  } catch (error) {
    // Handle validation errors specially to preserve security context
    if (error instanceof SandboxValidationError) {
      return {
        error: `Validation error: ${error.message}`,
      }
    }
    return {
      error: `Execution error: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

/**
 * Create a worker with custom parameters
 */
export async function createWorker(id: string, params: WorkerParams, loaderBinding: Fetcher): Promise<Response> {
  return loaderBinding.fetch(SANDBOX_CONSTANTS.LOADER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      params,
    } satisfies CreateWorkerRequest),
  })
}

/**
 * Get information about a worker
 */
export async function getWorker(id: string, loaderBinding: Fetcher): Promise<Response> {
  return loaderBinding.fetch(`${SANDBOX_CONSTANTS.LOADER_URL}/${id}`, {
    method: 'GET',
  })
}

/**
 * Delete a worker
 */
export async function deleteWorker(id: string, loaderBinding: Fetcher): Promise<Response> {
  return loaderBinding.fetch(`${SANDBOX_CONSTANTS.LOADER_URL}/${id}`, {
    method: 'DELETE',
  })
}

/**
 * List all workers
 */
export async function listWorkers(loaderBinding: Fetcher): Promise<Response> {
  return loaderBinding.fetch(SANDBOX_CONSTANTS.LOADER_URL, {
    method: 'GET',
  })
}

/**
 * Execute a request on a worker
 */
export async function executeWorker(id: string, request: Request, loaderBinding: Fetcher): Promise<Response> {
  return loaderBinding.fetch(`${SANDBOX_CONSTANTS.LOADER_URL}/${id}`, {
    method: 'POST',
    headers: request.headers,
    body: request.body,
  })
}
