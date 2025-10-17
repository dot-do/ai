/**
 * Function Executor - Universal execution engine
 *
 * Executes functions of any type (Code, Generative, Agentic, Human)
 */

import type {
  FunctionDefinition,
  CodeFunction,
  GenerativeFunction,
  AgenticFunction,
  HumanFunction,
  FunctionContext,
  ExecutionResult,
  ExecuteOptions,
  ExecutionStatus,
} from './types'
import { getRegistry } from './registry'
import { validateInput, validateOutput } from './validation'
import { executeHumanFunction } from './executors/human'

/**
 * Generate unique execution ID
 */
function generateExecutionId(): string {
  return `exec_${Date.now()}_${Math.random().toString(36).substring(7)}`
}

/**
 * Execute a function by ID
 */
export async function execute<TInput = any, TOutput = any>(functionId: string, input: TInput, options: ExecuteOptions = {}): Promise<ExecutionResult<TOutput>> {
  const startTime = Date.now()
  const executionId = generateExecutionId()

  // Get function from registry
  const func = getRegistry().get<TInput, TOutput>(functionId)
  if (!func) {
    return {
      status: 'failed',
      error: {
        message: `Function not found: ${functionId}`,
        code: 'FUNCTION_NOT_FOUND',
      },
      duration: Date.now() - startTime,
    }
  }

  // Build context
  const context: FunctionContext = {
    executionId,
    functionName: func.metadata.name,
    traceId: options.context?.traceId || executionId,
    parentExecutionId: options.context?.parentExecutionId,
    user: options.context?.user,
    headers: options.context?.headers,
    env: options.context?.env,
    custom: options.context?.custom,
  }

  // Validate input
  try {
    validateInput(func.input, input)
  } catch (error) {
    return {
      status: 'failed',
      error: {
        message: `Input validation failed: ${(error as Error).message}`,
        code: 'INVALID_INPUT',
        details: error,
      },
      duration: Date.now() - startTime,
    }
  }

  // Execute with timeout and retries
  const timeout = options.timeout || func.metadata.timeout || 30000
  const maxRetries = options.retries ?? func.metadata.retries ?? 0

  let attempt = 0
  let lastError: any

  while (attempt <= maxRetries) {
    try {
      // Execute based on function type
      const output = await executeWithTimeout(func, input, context, timeout)

      // Validate output
      validateOutput(func.output, output)

      // Record success
      const duration = Date.now() - startTime
      getRegistry().recordExecution(func.id, true, duration)

      return {
        status: 'completed',
        output,
        duration,
      }
    } catch (error) {
      lastError = error
      attempt++

      // If max retries reached, fail
      if (attempt > maxRetries) {
        const duration = Date.now() - startTime
        getRegistry().recordExecution(func.id, false, duration)

        return {
          status: 'failed',
          error: {
            message: (error as Error).message,
            code: 'EXECUTION_ERROR',
            stack: (error as Error).stack,
            details: error,
          },
          duration,
        }
      }

      // Wait before retry (exponential backoff)
      if (func.metadata.retryBackoff === 'exponential') {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  // Should never reach here
  const duration = Date.now() - startTime
  return {
    status: 'failed',
    error: {
      message: lastError?.message || 'Unknown error',
      code: 'EXECUTION_ERROR',
    },
    duration,
  }
}

/**
 * Execute function with timeout
 */
async function executeWithTimeout<TInput, TOutput>(
  func: FunctionDefinition<TInput, TOutput>,
  input: TInput,
  context: FunctionContext,
  timeout: number
): Promise<TOutput> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Execution timeout after ${timeout}ms`)), timeout)
  })

  const executionPromise = executeByType(func, input, context)

  return Promise.race([executionPromise, timeoutPromise])
}

/**
 * Execute function by type
 */
async function executeByType<TInput, TOutput>(func: FunctionDefinition<TInput, TOutput>, input: TInput, context: FunctionContext): Promise<TOutput> {
  switch (func.type) {
    case 'code':
      return executeCodeFunction(func as CodeFunction<TInput, TOutput>, input, context)

    case 'generative':
      return executeGenerativeFunction(func as GenerativeFunction<TInput, TOutput>, input, context)

    case 'agentic':
      return executeAgenticFunction(func as AgenticFunction<TInput, TOutput>, input, context)

    case 'human':
      return executeHumanFunction(func as HumanFunction<TInput, TOutput>, input, context)

    default:
      throw new Error(`Unknown function type: ${func.type}`)
  }
}

/**
 * Execute Code Function
 */
async function executeCodeFunction<TInput, TOutput>(func: CodeFunction<TInput, TOutput>, input: TInput, context: FunctionContext): Promise<TOutput> {
  // If code string provided, use eval (for simple functions)
  if (func.code) {
    // TODO: Implement safe code execution via Dynamic Worker Loader
    // For now, use handler
    return func.handler(input, context)
  }

  // Use handler directly
  return func.handler(input, context)
}

/**
 * Execute Generative Function
 */
async function executeGenerativeFunction<TInput, TOutput>(
  func: GenerativeFunction<TInput, TOutput>,
  input: TInput,
  context: FunctionContext
): Promise<TOutput> {
  // Generative functions use the handler which wraps AI calls
  // The handler is responsible for building prompts and calling AI services
  return func.handler(input, context)
}

/**
 * Execute Agentic Function
 */
async function executeAgenticFunction<TInput, TOutput>(func: AgenticFunction<TInput, TOutput>, input: TInput, context: FunctionContext): Promise<TOutput> {
  // Agentic functions use agents with tools
  // The handler manages the agent lifecycle
  return func.handler(input, context)
}

/**
 * Execute function by name (convenience)
 */
export async function executeByName<TInput = any, TOutput = any>(
  functionName: string,
  input: TInput,
  options?: ExecuteOptions
): Promise<ExecutionResult<TOutput>> {
  // Find function by name
  const funcs = getRegistry().list()
  const func = funcs.find((f) => f.metadata.name === functionName)

  if (!func) {
    return {
      status: 'failed',
      error: {
        message: `Function not found: ${functionName}`,
        code: 'FUNCTION_NOT_FOUND',
      },
    }
  }

  return execute<TInput, TOutput>(func.id, input, options)
}
