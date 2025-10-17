/**
 * Workflow Integration - Workflows as Code Functions with Durable Execution
 *
 * Workflows are Code Functions that support:
 * - Durable execution via Cloudflare Workflows
 * - Step-based composition
 * - Parallel execution
 * - Retries and error handling
 * - Long-running tasks
 */

import type { CodeFunction, FunctionContext, Schema } from './types'
import { defineCodeFunction } from './define'
import { execute } from './executor'

/**
 * Workflow Step - A single step in a workflow
 */
export interface WorkflowStep<TInput = any, TOutput = any> {
  /** Step name/ID */
  name: string

  /** Function to execute for this step */
  function: string | ((input: TInput, ctx: FunctionContext) => Promise<TOutput>)

  /** Input transformation from previous step */
  inputTransform?: (prevOutput: any) => TInput

  /** Retry configuration for this step */
  retries?: number

  /** Timeout for this step */
  timeout?: number

  /** Whether this step can run in parallel with others */
  parallel?: boolean
}

/**
 * Workflow Context - Extended function context for workflows
 */
export interface WorkflowContext extends FunctionContext {
  /** Workflow instance ID */
  instanceId: string

  /** Current step name */
  stepName?: string

  /** Previous step outputs */
  stepOutputs: Record<string, any>

  /** Workflow metadata */
  workflowMetadata?: Record<string, any>
}

/**
 * Workflow Function - Code Function with durable execution
 */
export interface WorkflowFunction<TInput = any, TOutput = any> extends CodeFunction<TInput, TOutput> {
  /** Workflow configuration */
  workflow: {
    /** Workflow steps */
    steps: WorkflowStep[]

    /** Use durable execution (Cloudflare Workflows) */
    durable: boolean

    /** Workflow engine (cloudflare, payload, dotdo) */
    engine?: 'cloudflare' | 'payload' | 'dotdo'

    /** Max workflow duration */
    maxDuration?: number

    /** Cleanup function called on completion/failure */
    onComplete?: (result: TOutput, ctx: WorkflowContext) => Promise<void>

    /** Error handler */
    onError?: (error: Error, ctx: WorkflowContext) => Promise<void>
  }
}

/**
 * Workflow Step Executor
 */
class WorkflowStepExecutor {
  private stepOutputs: Record<string, any> = {}

  /**
   * Execute a single step
   */
  async executeStep<TInput, TOutput>(step: WorkflowStep<TInput, TOutput>, ctx: WorkflowContext, prevOutput?: any): Promise<TOutput> {
    // Transform input if needed
    const input = step.inputTransform ? step.inputTransform(prevOutput) : prevOutput

    // Execute function
    let output: TOutput
    if (typeof step.function === 'string') {
      // Execute registered function by ID
      const result = await execute<TInput, TOutput>(step.function, input, {
        timeout: step.timeout,
        retries: step.retries,
        context: ctx,
      })

      if (result.status !== 'completed') {
        throw new Error(`Step ${step.name} failed: ${result.error?.message}`)
      }

      output = result.output!
    } else {
      // Execute inline function
      output = await step.function(input, ctx)
    }

    // Store step output
    this.stepOutputs[step.name] = output

    return output
  }

  /**
   * Execute steps in sequence
   */
  async executeSequence(steps: WorkflowStep[], ctx: WorkflowContext): Promise<any> {
    let output: any

    for (const step of steps) {
      ctx.stepName = step.name
      output = await this.executeStep(step, ctx, output)
    }

    return output
  }

  /**
   * Execute steps in parallel
   */
  async executeParallel(steps: WorkflowStep[], ctx: WorkflowContext, input: any): Promise<any[]> {
    const promises = steps.map((step) => {
      const stepCtx = { ...ctx, stepName: step.name }
      return this.executeStep(step, stepCtx, input)
    })

    return Promise.all(promises)
  }

  /**
   * Get all step outputs
   */
  getStepOutputs(): Record<string, any> {
    return this.stepOutputs
  }
}

/**
 * Define a Workflow Function
 *
 * @example
 * ```typescript
 * import { defineWorkflow, step } from 'functions.do'
 * import { z } from 'zod'
 *
 * const dataIngestionWorkflow = defineWorkflow({
 *   name: 'dataIngestion',
 *   description: 'Ingest data from source, transform, and load into database',
 *   input: z.object({
 *     source: z.string(),
 *     format: z.enum(['csv', 'json', 'xml']),
 *   }),
 *   output: z.object({
 *     recordsProcessed: z.number(),
 *     duration: z.number(),
 *   }),
 *   steps: [
 *     step('fetch', 'fn_fetch_data'),
 *     step('parse', 'fn_parse_data'),
 *     step('transform', 'fn_transform_data'),
 *     step('load', 'fn_load_to_db'),
 *   ],
 *   durable: true,
 *   engine: 'cloudflare',
 * })
 * ```
 */
export function defineWorkflow<TInput = any, TOutput = any>(options: {
  /** Workflow name */
  name: string

  /** Workflow description */
  description?: string

  /** Input schema */
  input: Schema<TInput>

  /** Output schema */
  output: Schema<TOutput>

  /** Workflow steps */
  steps: WorkflowStep[]

  /** Use durable execution (default: true) */
  durable?: boolean

  /** Workflow engine (default: cloudflare) */
  engine?: 'cloudflare' | 'payload' | 'dotdo'

  /** Max workflow duration in ms */
  maxDuration?: number

  /** Timeout per step (ms) */
  timeout?: number

  /** Max retries per step */
  retries?: number

  /** Tags */
  tags?: string[]

  /** Completion handler */
  onComplete?: (result: TOutput, ctx: WorkflowContext) => Promise<void>

  /** Error handler */
  onError?: (error: Error, ctx: WorkflowContext) => Promise<void>
}): WorkflowFunction<TInput, TOutput> {
  const executor = new WorkflowStepExecutor()

  // Create workflow handler that executes steps
  const handler = async (input: TInput, ctx: FunctionContext): Promise<TOutput> => {
    const workflowCtx: WorkflowContext = {
      ...ctx,
      instanceId: ctx.executionId,
      stepOutputs: {},
      workflowMetadata: {},
    }

    try {
      // Separate parallel and sequential steps
      const sequentialSteps: WorkflowStep[] = []
      const parallelSteps: WorkflowStep[] = []

      for (const step of options.steps) {
        if (step.parallel) {
          parallelSteps.push(step)
        } else {
          sequentialSteps.push(step)
        }
      }

      // Execute sequential steps
      let output: any = input
      if (sequentialSteps.length > 0) {
        output = await executor.executeSequence(sequentialSteps, workflowCtx)
      }

      // Execute parallel steps
      if (parallelSteps.length > 0) {
        const parallelOutputs = await executor.executeParallel(parallelSteps, workflowCtx, output)
        output = { sequentialOutput: output, parallelOutputs }
      }

      // Store all step outputs in context
      workflowCtx.stepOutputs = executor.getStepOutputs()

      // Call completion handler
      if (options.onComplete) {
        await options.onComplete(output, workflowCtx)
      }

      return output
    } catch (error) {
      // Call error handler
      if (options.onError) {
        await options.onError(error as Error, workflowCtx)
      }
      throw error
    }
  }

  // Create Code Function with workflow configuration
  const workflowFunction: WorkflowFunction<TInput, TOutput> = {
    ...defineCodeFunction({
      name: options.name,
      description: options.description,
      input: options.input,
      output: options.output,
      handler,
      timeout: options.maxDuration || options.timeout,
      retries: options.retries,
      tags: [...(options.tags || []), 'workflow'],
      deterministic: false, // Workflows are generally non-deterministic
    }),
    workflow: {
      steps: options.steps,
      durable: options.durable !== false, // Default to true
      engine: options.engine || 'cloudflare',
      maxDuration: options.maxDuration,
      onComplete: options.onComplete,
      onError: options.onError,
    },
  }

  return workflowFunction
}

/**
 * Create a workflow step
 *
 * @example
 * ```typescript
 * step('fetchData', 'fn_fetch_data', { timeout: 30000 })
 * step('parseData', async (input) => JSON.parse(input))
 * ```
 */
export function step<TInput = any, TOutput = any>(
  name: string,
  fn: string | ((input: TInput, ctx: FunctionContext) => Promise<TOutput>),
  options?: {
    inputTransform?: (prevOutput: any) => TInput
    retries?: number
    timeout?: number
    parallel?: boolean
  }
): WorkflowStep<TInput, TOutput> {
  return {
    name,
    function: fn,
    ...options,
  }
}

/**
 * Execute multiple steps in parallel
 *
 * @example
 * ```typescript
 * parallel([
 *   step('fetchUsers', 'fn_fetch_users'),
 *   step('fetchOrders', 'fn_fetch_orders'),
 *   step('fetchProducts', 'fn_fetch_products'),
 * ])
 * ```
 */
export function parallel(steps: WorkflowStep[]): WorkflowStep[] {
  return steps.map((s) => ({ ...s, parallel: true }))
}

/**
 * Execute steps in sequence
 *
 * @example
 * ```typescript
 * sequence([
 *   step('step1', 'fn_step1'),
 *   step('step2', 'fn_step2'),
 *   step('step3', 'fn_step3'),
 * ])
 * ```
 */
export function sequence(steps: WorkflowStep[]): WorkflowStep[] {
  return steps.map((s) => ({ ...s, parallel: false }))
}
