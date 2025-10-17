/**
 * Functions Service for sdk.do
 * Deploy and execute serverless functions on Cloudflare Workers
 */

import type { BusinessContext } from './types'

/**
 * Function definition options
 */
export interface FunctionDefinition {
  name: string
  handler: (event: any) => any | Promise<any>
  timeout?: number // milliseconds, default: 30000 (30s)
  memory?: number // MB, default: 256
  env?: Record<string, string>
  description?: string
  runtime?: 'workers' | 'durable-object' | 'workflow'
  language?: 'javascript' | 'typescript'
}

/**
 * Function metadata from server
 */
export interface FunctionMetadata {
  id: string
  name: string
  description?: string
  code?: string
  language: 'javascript' | 'typescript' | 'python'
  runtime: 'workers' | 'durable-object' | 'workflow'
  timeout?: number
  memory?: number
  environment?: Record<string, string>
  createdAt: string
  updatedAt: string
  lastExecuted?: string
}

/**
 * Function execution result
 */
export interface ExecutionResult {
  success: boolean
  result?: any
  error?: string
  duration: number // milliseconds
  memory?: number
  logs?: string[]
}

/**
 * Schedule configuration
 */
export interface ScheduleConfig {
  cron: string
  timezone?: string
  description?: string
}

/**
 * Log entry from function execution
 */
export interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  metadata?: Record<string, any>
}

/**
 * Options for listing logs
 */
export interface LogsOptions {
  limit?: number
  offset?: number
  level?: 'info' | 'warn' | 'error' | 'debug'
  startDate?: string
  endDate?: string
}

/**
 * Options for listing functions
 */
export interface ListFunctionsOptions {
  limit?: number
  offset?: number
  runtime?: 'workers' | 'durable-object' | 'workflow'
}

/**
 * Deployed function instance with execute and management methods
 */
export class DeployedFunction {
  constructor(
    private name: string,
    private client: BusinessContext,
    private apiUrl: string
  ) {}

  /**
   * Execute the function with parameters
   */
  async execute<TResult = any>(params?: any): Promise<TResult> {
    const response = await fetch(`${this.apiUrl}/${this.name}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parameters: params }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Function execution failed: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    return data.result as TResult
  }

  /**
   * Get function metadata
   */
  async getMetadata(): Promise<FunctionMetadata> {
    const response = await fetch(`${this.apiUrl}/${this.name}`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Failed to get function metadata: ${response.status}`)
    }

    const data = await response.json()
    return data.function
  }

  /**
   * Delete the function
   */
  async delete(): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${this.name}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to delete function: ${response.status}`)
    }
  }

  /**
   * Schedule the function to run on a cron schedule
   */
  async schedule(config: ScheduleConfig): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${this.name}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      throw new Error(`Failed to schedule function: ${response.status}`)
    }
  }

  /**
   * Get execution logs
   */
  async logs(options?: LogsOptions): Promise<LogEntry[]> {
    const params = new URLSearchParams()
    if (options?.limit) params.set('limit', options.limit.toString())
    if (options?.offset) params.set('offset', options.offset.toString())
    if (options?.level) params.set('level', options.level)
    if (options?.startDate) params.set('startDate', options.startDate)
    if (options?.endDate) params.set('endDate', options.endDate)

    const url = `${this.apiUrl}/${this.name}/logs${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url, { method: 'GET' })

    if (!response.ok) {
      throw new Error(`Failed to get logs: ${response.status}`)
    }

    const data = await response.json()
    return data.logs || []
  }
}

/**
 * Functions service for managing and executing serverless functions
 */
export class FunctionsService {
  private apiUrl: string
  private deployedFunctions = new Map<string, DeployedFunction>()

  constructor(
    private client: BusinessContext,
    options: { baseUrl?: string } = {}
  ) {
    this.apiUrl = options.baseUrl || 'https://functions.do/functions'
  }

  /**
   * Define a new function (does not deploy)
   */
  defineFunction(definition: FunctionDefinition): DeployedFunction {
    // Store function definition for later deployment
    const func = new DeployedFunction(definition.name, this.client, this.apiUrl)
    this.deployedFunctions.set(definition.name, func)
    return func
  }

  /**
   * Deploy a function to the platform
   */
  async deploy(name: string, handler: Function, options?: Partial<FunctionDefinition>): Promise<DeployedFunction> {
    // Serialize the handler function to code
    const code = handler.toString()

    const payload = {
      name,
      code,
      description: options?.description,
      language: options?.language || 'typescript',
      runtime: options?.runtime || 'workers',
      timeout: options?.timeout || 30000,
      memory: options?.memory || 256,
      environment: options?.env,
    }

    const response = await fetch(`${this.apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Function deployment failed: ${response.status} ${errorText}`)
    }

    const func = new DeployedFunction(name, this.client, this.apiUrl)
    this.deployedFunctions.set(name, func)
    return func
  }

  /**
   * Execute a function by name
   */
  async execute<TResult = any>(name: string, params?: any): Promise<TResult> {
    const response = await fetch(`${this.apiUrl}/${name}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parameters: params }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Function execution failed: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    return data.result as TResult
  }

  /**
   * List all deployed functions
   */
  async list(options?: ListFunctionsOptions): Promise<FunctionMetadata[]> {
    const params = new URLSearchParams()
    if (options?.limit) params.set('limit', options.limit.toString())
    if (options?.offset) params.set('offset', options.offset.toString())
    if (options?.runtime) params.set('runtime', options.runtime)

    const url = `${this.apiUrl}${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url, { method: 'GET' })

    if (!response.ok) {
      throw new Error(`Failed to list functions: ${response.status}`)
    }

    const data = await response.json()
    return data.functions || []
  }

  /**
   * Get a function by name
   */
  async get(name: string): Promise<DeployedFunction> {
    const func = new DeployedFunction(name, this.client, this.apiUrl)
    // Verify function exists by fetching metadata
    await func.getMetadata()
    return func
  }

  /**
   * Delete a function by name
   */
  async delete(name: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${name}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to delete function: ${response.status}`)
    }

    this.deployedFunctions.delete(name)
  }

  /**
   * Schedule a function to run on a cron schedule
   */
  async schedule(name: string, config: ScheduleConfig): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${name}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      throw new Error(`Failed to schedule function: ${response.status}`)
    }
  }

  /**
   * Get execution logs for a function
   */
  async logs(name: string, options?: LogsOptions): Promise<LogEntry[]> {
    const params = new URLSearchParams()
    if (options?.limit) params.set('limit', options.limit.toString())
    if (options?.offset) params.set('offset', options.offset.toString())
    if (options?.level) params.set('level', options.level)
    if (options?.startDate) params.set('startDate', options.startDate)
    if (options?.endDate) params.set('endDate', options.endDate)

    const url = `${this.apiUrl}/${name}/logs${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url, { method: 'GET' })

    if (!response.ok) {
      throw new Error(`Failed to get logs: ${response.status}`)
    }

    const data = await response.json()
    return data.logs || []
  }
}

/**
 * Create a FunctionsService instance
 */
export function createFunctionsService(client: BusinessContext, options?: { baseUrl?: string }): FunctionsService {
  return new FunctionsService(client, options)
}

/**
 * Define a function (convenience function)
 */
export function defineFunction(definition: FunctionDefinition): FunctionDefinition {
  return definition
}
