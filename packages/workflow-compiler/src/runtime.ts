/**
 * Workflow Runtime - Execute compiled workflows
 */

import type { YAMLWorkflowDefinition } from './parser.js'

export interface ExecutionContext {
  workflowId: string
  executionId: string
  trigger: {
    type: 'event' | 'schedule'
    data?: any
  }
  context: Record<string, any>
  $: any // Semantic action proxy
}

export interface ExecutionResult {
  executionId: string
  status: 'succeeded' | 'failed'
  startedAt: Date
  completedAt: Date
  duration: number
  outputs?: Record<string, any>
  error?: {
    message: string
    step?: string
    stack?: string
  }
}

export interface RuntimeOptions {
  /** Maximum execution time in milliseconds */
  timeout?: number
  /** Enable debug logging */
  debug?: boolean
  /** Retry failed steps */
  retry?: {
    maxAttempts: number
    backoff: 'linear' | 'exponential'
    initialDelay: number
  }
}

/**
 * Workflow Runtime for executing compiled workflows
 */
export class WorkflowRuntime {
  private workflows = new Map<string, Function>()
  private executions = new Map<string, ExecutionResult>()

  constructor(private options: RuntimeOptions = {}) {}

  /**
   * Register a compiled workflow
   */
  register(workflowId: string, workflow: Function): void {
    this.workflows.set(workflowId, workflow)
  }

  /**
   * Execute a workflow
   */
  async execute(workflowId: string, trigger: ExecutionContext['trigger'], context: Record<string, any> = {}, $: any): Promise<ExecutionResult> {
    const executionId = crypto.randomUUID()
    const startedAt = new Date()

    const execution: ExecutionResult = {
      executionId,
      status: 'succeeded',
      startedAt,
      completedAt: new Date(),
      duration: 0,
    }

    this.executions.set(executionId, execution)

    try {
      const workflow = this.workflows.get(workflowId)
      if (!workflow) {
        throw new Error(`Workflow not found: ${workflowId}`)
      }

      if (this.options.debug) {
        console.log(`[Runtime] Executing workflow ${workflowId}`)
        console.log(`[Runtime] Execution ID: ${executionId}`)
      }

      const executionContext: ExecutionContext = {
        workflowId,
        executionId,
        trigger,
        context,
        $,
      }

      // Execute workflow with timeout
      const timeoutMs = this.options.timeout || 300000 // 5 minutes default
      const outputs = await this.executeWithTimeout(workflow, executionContext, timeoutMs)

      const completedAt = new Date()
      execution.status = 'succeeded'
      execution.completedAt = completedAt
      execution.duration = completedAt.getTime() - startedAt.getTime()
      execution.outputs = outputs

      if (this.options.debug) {
        console.log(`[Runtime] Workflow completed in ${execution.duration}ms`)
      }

      return execution
    } catch (error) {
      const completedAt = new Date()
      execution.status = 'failed'
      execution.completedAt = completedAt
      execution.duration = completedAt.getTime() - startedAt.getTime()
      execution.error = {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }

      if (this.options.debug) {
        console.error(`[Runtime] Workflow failed:`, execution.error)
      }

      return execution
    }
  }

  /**
   * Execute workflow with timeout
   */
  private async executeWithTimeout(workflow: Function, context: ExecutionContext, timeoutMs: number): Promise<any> {
    return Promise.race([
      workflow(context),
      new Promise((_, reject) => setTimeout(() => reject(new Error(`Workflow timeout after ${timeoutMs}ms`)), timeoutMs)),
    ])
  }

  /**
   * Get execution result
   */
  getExecution(executionId: string): ExecutionResult | undefined {
    return this.executions.get(executionId)
  }

  /**
   * List all executions for a workflow
   */
  listExecutions(workflowId: string): ExecutionResult[] {
    return Array.from(this.executions.values()).filter((exec) => {
      // This is a simple filter - in production you'd track workflowId in the execution
      return true
    })
  }

  /**
   * Clear execution history
   */
  clearExecutions(): void {
    this.executions.clear()
  }
}

/**
 * Create a workflow runtime instance
 */
export function createRuntime(options: RuntimeOptions = {}): WorkflowRuntime {
  return new WorkflowRuntime(options)
}
