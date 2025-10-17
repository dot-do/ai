/**
 * Prisma Client
 *
 * Auto-generated Integration client for Prisma.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/prisma
 */

import { ActionExecuteParams } from './types.js'
import { PrismaError } from './errors.js'

/**
 * Prisma client options
 */
export interface PrismaClientOptions {
  /** API key for authentication */
  apiKey: string
  /** Base URL override */
  baseUrl?: string
  /** Request timeout in ms */
  timeout?: number
  /** Retry attempts */
  retryAttempts?: number
}

/**
 * Prisma Client
 *
 * Prisma Data Platform provides database tools including Accelerate (global database cache), Optimize (AI-driven query analysis), and Prisma Postgres (managed PostgreSQL). Manage workspaces, projects, environments, and API keys programmatically.
 */
export class PrismaClient {
  private options: PrismaClientOptions

  /**
   * Action resource
   * Execute Prisma actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: PrismaClientOptions) {
    this.options = {
      baseUrl: 'https://api.prisma.com',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize resource namespaces
    this.action = {
      execute: this.actionExecute.bind(this),
    }
  }

  /**
   * undefined Action
   * @param params - Operation parameters
   * @returns object
   */
  private async actionExecute(params: ActionExecuteParams): Promise<object> {
    try {
      const response = await this.request('POST', '/', params)
      return response as object
    } catch (error) {
      throw PrismaError.fromError(error)
    }
  }

  /**
   * Make HTTP request
   * @param method - HTTP method
   * @param path - Request path
   * @param data - Request data
   * @returns Response data
   */
  private async request(method: string, path: string, data?: any): Promise<any> {
    const url = `${this.options.baseUrl}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: this.options.apiKey,
    }

    const config: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.options.timeout || 30000),
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data)
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }
}
