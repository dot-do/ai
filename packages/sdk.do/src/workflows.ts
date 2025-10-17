/**
 * Workflows System for .do SDK
 *
 * Orchestrate multi-step workflows on Cloudflare Workflows
 *
 * Features:
 * - Workflow definition with semantic patterns
 * - Execution and status tracking
 * - Parallel step execution
 * - Conditional branching
 * - Retry logic with backoff strategies
 * - Management APIs (list, get, delete)
 * - Integration with Cloudflare Workflows
 *
 * Usage:
 *
 * ```typescript
 * import { defineWorkflow } from 'sdk.do'
 *
 * // Define a workflow
 * const onboarding = defineWorkflow({
 *   name: 'user-onboarding',
 *   steps: [
 *     {
 *       name: 'create-account',
 *       function: 'create-user',
 *       retry: { max: 3, backoff: 'exponential' }
 *     },
 *     {
 *       name: 'send-welcome-email',
 *       function: 'send-email',
 *       dependsOn: ['create-account']
 *     }
 *   ]
 * })
 *
 * // Start execution
 * const execution = await onboarding.start({
 *   email: 'user@example.com',
 *   plan: 'pro'
 * })
 *
 * // Check status
 * const status = await execution.status()
 *
 * // Wait for completion
 * const result = await execution.wait()
 * ```
 */

export type BackoffStrategy = 'linear' | 'exponential' | 'fixed'

export interface RetryConfig {
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  max?: number

  /**
   * Delay between retries (milliseconds or duration string)
   * @example 1000
   * @example "5s"
   * @example "1m"
   */
  delay?: number | string

  /**
   * Backoff strategy for retries
   * @default 'exponential'
   */
  backoff?: BackoffStrategy

  /**
   * Maximum delay between retries (for exponential backoff)
   * @default 60000 (1 minute)
   */
  maxDelay?: number
}

export interface StepCondition {
  /**
   * Condition expression to evaluate
   * @example "amount > 10000"
   */
  [condition: string]: string[] | undefined

  /**
   * Default path if no conditions match
   */
  default?: string[]
}

export interface WorkflowStep {
  /**
   * Unique step name
   */
  name: string

  /**
   * Function to execute for this step
   */
  function?: string

  /**
   * Retry configuration
   */
  retry?: RetryConfig

  /**
   * Timeout for step execution
   */
  timeout?: number | string

  /**
   * Dependencies (steps that must complete before this step)
   */
  dependsOn?: string[]

  /**
   * Parallel sub-steps
   */
  parallel?: WorkflowStep[]

  /**
   * Conditional branching
   */
  condition?: StepCondition

  /**
   * Input transformation
   */
  input?: (context: WorkflowContext) => any

  /**
   * Output transformation
   */
  output?: (result: any, context: WorkflowContext) => any

  /**
   * Metadata for the step
   */
  metadata?: Record<string, any>
}

export interface WorkflowDefinition {
  /**
   * Unique workflow name
   */
  name: string

  /**
   * Workflow description
   */
  description?: string

  /**
   * Workflow steps
   */
  steps: WorkflowStep[]

  /**
   * Global retry configuration (applied to all steps unless overridden)
   */
  retry?: RetryConfig

  /**
   * Global timeout (applied to all steps unless overridden)
   */
  timeout?: number | string

  /**
   * Input schema validation
   */
  inputSchema?: any

  /**
   * Output schema validation
   */
  outputSchema?: any

  /**
   * Workflow metadata
   */
  metadata?: Record<string, any>
}

export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface WorkflowContext {
  /**
   * Workflow execution ID
   */
  executionId: string

  /**
   * Workflow name
   */
  workflowName: string

  /**
   * Initial input
   */
  input: any

  /**
   * Results from completed steps
   */
  stepResults: Record<string, any>

  /**
   * Current step name
   */
  currentStep?: string

  /**
   * Workflow metadata
   */
  metadata?: Record<string, any>
}

export interface WorkflowExecutionStatus {
  /**
   * Execution ID
   */
  id: string

  /**
   * Workflow name
   */
  workflowName: string

  /**
   * Current status
   */
  status: WorkflowStatus

  /**
   * Current step
   */
  currentStep?: string

  /**
   * Progress (0-1)
   */
  progress: number

  /**
   * Steps completed
   */
  completedSteps: string[]

  /**
   * Steps failed
   */
  failedSteps: string[]

  /**
   * Execution result (if completed)
   */
  result?: any

  /**
   * Error (if failed)
   */
  error?: {
    message: string
    step?: string
    code?: string
  }

  /**
   * Started at
   */
  startedAt: string

  /**
   * Completed at
   */
  completedAt?: string

  /**
   * Duration (milliseconds)
   */
  duration?: number

  /**
   * Metadata
   */
  metadata?: Record<string, any>
}

export interface WorkflowExecution {
  /**
   * Execution ID
   */
  id: string

  /**
   * Get execution status
   */
  status(): Promise<WorkflowExecutionStatus>

  /**
   * Wait for execution to complete
   * @param timeout - Optional timeout in milliseconds
   */
  wait(timeout?: number): Promise<WorkflowExecutionStatus>

  /**
   * Cancel execution
   */
  cancel(): Promise<void>

  /**
   * Resume execution (if paused)
   */
  resume(): Promise<void>

  /**
   * Pause execution
   */
  pause(): Promise<void>
}

export interface Workflow {
  /**
   * Workflow name
   */
  name: string

  /**
   * Workflow definition
   */
  definition: WorkflowDefinition

  /**
   * Start workflow execution
   */
  start(input: any, metadata?: Record<string, any>): Promise<WorkflowExecution>

  /**
   * Get workflow executions
   */
  executions(options?: ListExecutionsOptions): Promise<WorkflowExecution[]>

  /**
   * Update workflow definition
   */
  update(definition: Partial<WorkflowDefinition>): Promise<void>

  /**
   * Delete workflow
   */
  delete(): Promise<void>
}

export interface ListExecutionsOptions {
  /**
   * Filter by status
   */
  status?: WorkflowStatus

  /**
   * Maximum results
   */
  limit?: number

  /**
   * Pagination offset
   */
  offset?: number

  /**
   * Start time range
   */
  startTime?: Date

  /**
   * End time range
   */
  endTime?: Date
}

export interface ListWorkflowsOptions {
  /**
   * Maximum results
   */
  limit?: number

  /**
   * Pagination offset
   */
  offset?: number

  /**
   * Filter by name pattern
   */
  namePattern?: string
}

export interface WorkflowsServiceConfig {
  /**
   * Workflows API URL
   * @default process.env.WORKFLOWS_API_URL || 'https://workflows.do'
   */
  apiUrl?: string

  /**
   * API key for authentication
   */
  apiKey?: string

  /**
   * Client instance (for internal use)
   */
  client?: any
}

/**
 * Create a workflow execution instance
 */
function createExecution(id: string, workflowName: string, config: WorkflowsServiceConfig): WorkflowExecution {
  const apiUrl = config.apiUrl || 'https://workflows.do'
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`
  }

  return {
    id,

    async status(): Promise<WorkflowExecutionStatus> {
      const response = await fetch(`${apiUrl}/execution/${id}`, {
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to get execution status: ${response.statusText}`)
      }

      return (await response.json()) as WorkflowExecutionStatus
    },

    async wait(timeout?: number): Promise<WorkflowExecutionStatus> {
      const startTime = Date.now()
      const maxTimeout = timeout || 300000 // 5 minutes default

      while (true) {
        const status = await this.status()

        if (status.status === 'completed' || status.status === 'failed' || status.status === 'cancelled') {
          return status
        }

        if (Date.now() - startTime > maxTimeout) {
          throw new Error(`Workflow execution timed out after ${maxTimeout}ms`)
        }

        // Poll every 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    },

    async cancel(): Promise<void> {
      const response = await fetch(`${apiUrl}/execution/${id}/cancel`, {
        method: 'POST',
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to cancel execution: ${response.statusText}`)
      }
    },

    async resume(): Promise<void> {
      const response = await fetch(`${apiUrl}/execution/${id}/resume`, {
        method: 'POST',
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to resume execution: ${response.statusText}`)
      }
    },

    async pause(): Promise<void> {
      const response = await fetch(`${apiUrl}/execution/${id}/pause`, {
        method: 'POST',
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to pause execution: ${response.statusText}`)
      }
    },
  }
}

/**
 * Create a workflow instance
 */
function createWorkflow(definition: WorkflowDefinition, config: WorkflowsServiceConfig): Workflow {
  const apiUrl = config.apiUrl || 'https://workflows.do'
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`
  }

  return {
    name: definition.name,
    definition,

    async start(input: any, metadata?: Record<string, any>): Promise<WorkflowExecution> {
      const response = await fetch(`${apiUrl}/start/${definition.name}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ input, metadata }),
      })

      if (!response.ok) {
        throw new Error(`Failed to start workflow: ${response.statusText}`)
      }

      const result = (await response.json()) as { id: string }
      return createExecution(result.id, definition.name, config)
    },

    async executions(options?: ListExecutionsOptions): Promise<WorkflowExecution[]> {
      const params = new URLSearchParams()

      if (options?.status) params.set('status', options.status)
      if (options?.limit) params.set('limit', options.limit.toString())
      if (options?.offset) params.set('offset', options.offset.toString())
      if (options?.startTime) params.set('startTime', options.startTime.toISOString())
      if (options?.endTime) params.set('endTime', options.endTime.toISOString())

      const response = await fetch(`${apiUrl}/${definition.name}/executions?${params}`, {
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to list executions: ${response.statusText}`)
      }

      const result = (await response.json()) as { executions: Array<{ id: string }> }
      return result.executions.map((exec) => createExecution(exec.id, definition.name, config))
    },

    async update(updates: Partial<WorkflowDefinition>): Promise<void> {
      const response = await fetch(`${apiUrl}/${definition.name}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`Failed to update workflow: ${response.statusText}`)
      }

      // Merge updates into definition
      Object.assign(definition, updates)
    },

    async delete(): Promise<void> {
      const response = await fetch(`${apiUrl}/${definition.name}`, {
        method: 'DELETE',
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to delete workflow: ${response.statusText}`)
      }
    },
  }
}

/**
 * Define a workflow
 *
 * @param definition - Workflow definition
 * @param config - Optional configuration
 * @returns Workflow instance
 *
 * @example
 * ```typescript
 * const workflow = defineWorkflow({
 *   name: 'user-onboarding',
 *   steps: [
 *     {
 *       name: 'create-account',
 *       function: 'create-user',
 *       retry: { max: 3, backoff: 'exponential' }
 *     },
 *     {
 *       name: 'send-welcome-email',
 *       function: 'send-email',
 *       dependsOn: ['create-account']
 *     }
 *   ]
 * })
 *
 * const execution = await workflow.start({
 *   email: 'user@example.com',
 *   plan: 'pro'
 * })
 * ```
 */
export function defineWorkflow(definition: WorkflowDefinition, config: WorkflowsServiceConfig = {}): Workflow {
  return createWorkflow(definition, config)
}

/**
 * Workflows service for managing workflows
 */
export interface WorkflowsService {
  /**
   * Define a workflow
   */
  define(definition: WorkflowDefinition): Promise<Workflow>

  /**
   * Get a workflow by name
   */
  get(name: string): Promise<Workflow>

  /**
   * List all workflows
   */
  list(options?: ListWorkflowsOptions): Promise<Workflow[]>

  /**
   * Delete a workflow
   */
  delete(name: string): Promise<void>

  /**
   * Get workflow execution by ID
   */
  execution(id: string): Promise<WorkflowExecution>

  /**
   * List all executions across all workflows
   */
  executions(options?: ListExecutionsOptions): Promise<WorkflowExecution[]>
}

/**
 * Create a workflows service
 *
 * @param config - Service configuration
 * @returns WorkflowsService instance
 */
export function createWorkflowsService(config: WorkflowsServiceConfig = {}): WorkflowsService {
  const apiUrl = config.apiUrl || 'https://workflows.do'
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`
  }

  return {
    async define(definition: WorkflowDefinition): Promise<Workflow> {
      const response = await fetch(`${apiUrl}/define`, {
        method: 'POST',
        headers,
        body: JSON.stringify(definition),
      })

      if (!response.ok) {
        throw new Error(`Failed to define workflow: ${response.statusText}`)
      }

      return createWorkflow(definition, config)
    },

    async get(name: string): Promise<Workflow> {
      const response = await fetch(`${apiUrl}/${name}`, {
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to get workflow: ${response.statusText}`)
      }

      const definition = (await response.json()) as WorkflowDefinition
      return createWorkflow(definition, config)
    },

    async list(options?: ListWorkflowsOptions): Promise<Workflow[]> {
      const params = new URLSearchParams()

      if (options?.limit) params.set('limit', options.limit.toString())
      if (options?.offset) params.set('offset', options.offset.toString())
      if (options?.namePattern) params.set('namePattern', options.namePattern)

      const response = await fetch(`${apiUrl}/list?${params}`, {
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to list workflows: ${response.statusText}`)
      }

      const result = (await response.json()) as { workflows: WorkflowDefinition[] }
      return result.workflows.map((def) => createWorkflow(def, config))
    },

    async delete(name: string): Promise<void> {
      const response = await fetch(`${apiUrl}/${name}`, {
        method: 'DELETE',
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to delete workflow: ${response.statusText}`)
      }
    },

    async execution(id: string): Promise<WorkflowExecution> {
      const response = await fetch(`${apiUrl}/execution/${id}`, {
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to get execution: ${response.statusText}`)
      }

      const status = (await response.json()) as { workflowName: string }
      return createExecution(id, status.workflowName, config)
    },

    async executions(options?: ListExecutionsOptions): Promise<WorkflowExecution[]> {
      const params = new URLSearchParams()

      if (options?.status) params.set('status', options.status)
      if (options?.limit) params.set('limit', options.limit.toString())
      if (options?.offset) params.set('offset', options.offset.toString())
      if (options?.startTime) params.set('startTime', options.startTime.toISOString())
      if (options?.endTime) params.set('endTime', options.endTime.toISOString())

      const response = await fetch(`${apiUrl}/executions?${params}`, {
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to list executions: ${response.statusText}`)
      }

      const result = (await response.json()) as { executions: Array<{ id: string; workflowName: string }> }
      return result.executions.map((exec) => createExecution(exec.id, exec.workflowName, config))
    },
  }
}
