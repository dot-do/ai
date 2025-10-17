/**
 * Human Function Executor
 *
 * Executes Human Functions by:
 * 1. Calling Human Worker to send UI to user
 * 2. Polling for completion (or webhook callback)
 * 3. Returning parsed response
 * 4. Handling timeouts and errors
 */

import type { HumanFunction, FunctionContext } from '../types'

/**
 * Human Function Status Response
 */
interface HumanFunctionStatus<TOutput = unknown> {
  status: 'pending' | 'completed' | 'timeout' | 'error'
  response?: TOutput
  error?: string
}

/**
 * Human Function Start Response
 */
interface HumanFunctionStartResponse {
  success: boolean
  error?: string
}

/**
 * Human Function Error Response
 */
interface HumanFunctionErrorResponse {
  error: string
}

/**
 * Execute Human Function
 *
 * Calls Human Worker and waits for human response
 *
 * Supports two completion modes:
 * 1. Polling (default) - Polls for completion every 5 seconds
 * 2. Callback (if callbackUrl provided) - Returns immediately, Human Worker calls back when complete
 */
export async function executeHumanFunction<TInput, TOutput>(func: HumanFunction<TInput, TOutput>, input: TInput, context: FunctionContext): Promise<TOutput> {
  const executionId = context.executionId
  const humanWorkerUrl = context.env?.HUMAN_WORKER_URL || 'https://human.do'
  const callbackUrl = context.env?.CALLBACK_URL || context.custom?.callbackUrl

  // Start execution in Human Worker
  const startResponse = await fetch(`${humanWorkerUrl}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      functionDef: {
        type: 'human',
        name: func.metadata.name,
        description: func.metadata.description,
        inputSchema: func.input,
        outputSchema: func.output,
        uiType: func.ui.type,
        uiRenderer: func.ui.render,
        responseParser: func.parseResponse,
        timeout: func.ui.timeout,
        reminderInterval: func.ui.reminderInterval,
      },
      input,
      executionId,
      timeout: func.ui.timeout || context.env?.HUMAN_FUNCTION_TIMEOUT || 3600000,
      reminderInterval: func.ui.reminderInterval,
      callbackUrl, // Optional callback URL for webhook-based completion
    }),
  })

  if (!startResponse.ok) {
    const error = (await startResponse.json().catch(() => ({
      error: 'Failed to start human function',
    }))) as HumanFunctionErrorResponse
    throw new Error(error.error || `Human Worker returned ${startResponse.status}`)
  }

  const startResult = (await startResponse.json()) as HumanFunctionStartResponse

  if (!startResult.success) {
    throw new Error(startResult.error || 'Failed to start human function')
  }

  // If callback URL provided, return immediately (non-blocking mode)
  // The caller will receive the response via webhook callback
  if (callbackUrl) {
    // Return a pending response that includes the executionId for tracking
    // Note: This breaks the normal Promise<TOutput> contract, but allows non-blocking execution
    return {
      _pending: true,
      executionId,
      status: 'pending',
      message: 'Human function sent, awaiting callback',
    } as unknown as TOutput
  }

  // Poll for completion (blocking mode)
  const pollInterval = context.env?.HUMAN_FUNCTION_POLL_INTERVAL || 5000 // 5 seconds
  const maxPollTime = func.ui.timeout || 3600000 // Default 1 hour
  const startTime = Date.now()

  while (Date.now() - startTime < maxPollTime) {
    // Wait before polling
    await new Promise((resolve) => setTimeout(resolve, pollInterval))

    // Check status
    const statusResponse = await fetch(`${humanWorkerUrl}/status/${executionId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!statusResponse.ok) {
      // If status check fails, continue polling
      console.warn(`Status check failed for ${executionId}: ${statusResponse.status}`)
      continue
    }

    const status = (await statusResponse.json()) as HumanFunctionStatus<TOutput>

    // Check if completed
    if (status.status === 'completed') {
      return status.response as TOutput
    }

    // Check if timeout
    if (status.status === 'timeout') {
      throw new Error('Human function timed out waiting for response')
    }

    // Check if error
    if (status.status === 'error') {
      throw new Error(status.error || 'Human function failed')
    }

    // Otherwise status is 'pending', continue polling
  }

  // If we exit the loop, we timed out on our side
  throw new Error(`Human function execution timed out after ${maxPollTime}ms`)
}
