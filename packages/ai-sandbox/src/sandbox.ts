/**
 * Cloudflare Sandbox SDK Implementation
 *
 * Provides a complete implementation of the Cloudflare Sandbox interface
 */

import type { CloudflareSandbox, SandboxExecuteRequest, SandboxExecuteResponse, CreateWorkerRequest } from './types'
import {
  executeInSandbox,
  createWorker as createWorkerInternal,
  getWorker as getWorkerInternal,
  deleteWorker as deleteWorkerInternal,
  listWorkers as listWorkersInternal,
  executeWorker as executeWorkerInternal,
} from './loader'

/**
 * Create a Cloudflare Sandbox instance
 *
 * This provides the complete sandbox interface with all methods
 */
export function createSandbox(loaderBinding: Fetcher): CloudflareSandbox {
  return {
    async do(request: SandboxExecuteRequest): Promise<SandboxExecuteResponse> {
      return executeInSandbox(request, loaderBinding)
    },

    async createWorker(request: CreateWorkerRequest): Promise<Response> {
      return createWorkerInternal(request.id, request.params, loaderBinding)
    },

    async getWorker(id: string): Promise<Response> {
      return getWorkerInternal(id, loaderBinding)
    },

    async deleteWorker(id: string): Promise<Response> {
      return deleteWorkerInternal(id, loaderBinding)
    },

    async listWorkers(): Promise<Response> {
      return listWorkersInternal(loaderBinding)
    },

    async executeWorker(id: string, request: Request): Promise<Response> {
      return executeWorkerInternal(id, request, loaderBinding)
    },
  }
}
