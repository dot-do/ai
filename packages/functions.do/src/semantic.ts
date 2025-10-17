/**
 * Semantic Fluent API - Declarative function composition
 *
 * Enables semantic syntax like:
 * - db.forEach.Occupation.tasks(ifAICapableOfDelivering.generateService)
 * - db.get.User(byEmail('user@example.com')).then(updateProfile)
 * - api.send.Email(toUser).with(welcomeTemplate)
 *
 * Accessible via RPC at:
 * - rpc.do/db.forEach.Occupation.tasks(ifAICapableOfDelivering.generateService)
 * - 入.io/db.forEach.Occupation.tasks(ifAICapableOfDelivering.generateService)
 */

import type { FunctionContext, Predicate, Mapper } from './types'
import { execute, executeByName } from './executor'

/**
 * Chainable operation that can be executed
 */
export interface ChainableOperation<TInput = any, TOutput = any> {
  /** Execute the chained operations */
  execute(input: TInput, ctx?: Partial<FunctionContext>): Promise<TOutput>

  /** Add another operation to the chain */
  then<TNext>(fn: Mapper<TOutput, TNext> | string): ChainableOperation<TInput, TNext>

  /** Add conditional logic */
  when(predicate: Predicate<TOutput>): SemanticConditionalChain<TInput, TOutput>

  /** Map over results (for arrays) */
  map<TNext>(fn: Mapper<TOutput, TNext> | string): ChainableOperation<TInput, TNext[]>

  /** Filter results (for arrays) */
  filter(predicate: Predicate<TOutput>): ChainableOperation<TInput, TOutput[]>

  /** Reduce results (for arrays) */
  reduce<TAcc>(fn: (acc: TAcc, item: TOutput) => TAcc | Promise<TAcc>, initial: TAcc): ChainableOperation<TInput, TAcc>

  /** Execute in parallel (for arrays) */
  parallel(): ChainableOperation<TInput, TOutput>

  /** Add retry logic */
  retry(attempts: number, delay?: number): ChainableOperation<TInput, TOutput>

  /** Add timeout */
  timeout(ms: number): ChainableOperation<TInput, TOutput>
}

/**
 * Conditional chain for when/then/else logic
 */
export interface SemanticConditionalChain<TInput = any, TOutput = any> {
  then<TNext>(fn: Mapper<TOutput, TNext> | string): SemanticConditionalElseChain<TInput, TOutput, TNext>
}

export interface SemanticConditionalElseChain<TInput = any, TOutput = any, TThen = any> {
  else<TElse>(fn: Mapper<TOutput, TElse> | string): ChainableOperation<TInput, TThen | TElse>
}

/**
 * Operation in the chain
 */
interface Operation {
  type: 'map' | 'filter' | 'reduce' | 'when' | 'then' | 'else' | 'parallel' | 'retry' | 'timeout'
  fn?: Function | string
  predicate?: Predicate<any>
  initial?: any
  attempts?: number
  delay?: number
  ms?: number
}

/**
 * Chainable operation implementation
 */
class ChainableOperationImpl<TInput = any, TOutput = any> implements ChainableOperation<TInput, TOutput> {
  private operations: Operation[] = []

  constructor(private baseFn: string | Function) {}

  async execute(input: TInput, ctx?: Partial<FunctionContext>): Promise<TOutput> {
    let result: any = input

    // Execute base function
    if (typeof this.baseFn === 'string') {
      const execResult = await execute(this.baseFn, input, { context: ctx })
      if (execResult.status !== 'completed') {
        throw new Error(`Execution failed: ${execResult.error?.message}`)
      }
      result = execResult.output
    } else {
      result = await this.baseFn(input, ctx as FunctionContext)
    }

    // Execute chained operations
    for (const op of this.operations) {
      result = await this.executeOperation(op, result, ctx)
    }

    return result
  }

  private async executeOperation(op: Operation, input: any, ctx?: Partial<FunctionContext>): Promise<any> {
    switch (op.type) {
      case 'map':
        if (Array.isArray(input)) {
          return Promise.all(input.map((item) => this.executeFunction(op.fn!, item, ctx)))
        }
        return this.executeFunction(op.fn!, input, ctx)

      case 'filter':
        if (Array.isArray(input)) {
          const results = await Promise.all(input.map((item) => op.predicate!(item)))
          return input.filter((_, i) => results[i])
        }
        return input

      case 'reduce':
        if (Array.isArray(input)) {
          let acc = op.initial
          for (const item of input) {
            const reduceFn = op.fn as (acc: any, item: any) => any | Promise<any>
            acc = await reduceFn(acc, item)
          }
          return acc
        }
        return input

      case 'when':
        const condition = await op.predicate!(input)
        if (condition && op.fn) {
          return this.executeFunction(op.fn, input, ctx)
        }
        return input

      case 'then':
        return this.executeFunction(op.fn!, input, ctx)

      case 'parallel':
        if (Array.isArray(input)) {
          return Promise.all(input.map((item) => this.executeFunction(op.fn!, item, ctx)))
        }
        return input

      case 'retry':
        return this.executeWithRetry(op.fn!, input, op.attempts!, op.delay || 1000, ctx)

      case 'timeout':
        return this.executeWithTimeout(op.fn!, input, op.ms!, ctx)

      default:
        return input
    }
  }

  private async executeFunction(fn: Function | string, input: any, ctx?: Partial<FunctionContext>): Promise<any> {
    if (typeof fn === 'string') {
      const result = await execute(fn, input, { context: ctx })
      if (result.status !== 'completed') {
        throw new Error(`Function ${fn} failed: ${result.error?.message}`)
      }
      return result.output
    }
    return fn(input)
  }

  private async executeWithRetry(fn: Function | string, input: any, attempts: number, delay: number, ctx?: Partial<FunctionContext>): Promise<any> {
    let lastError: any

    for (let i = 0; i < attempts; i++) {
      try {
        return await this.executeFunction(fn, input, ctx)
      } catch (error) {
        lastError = error
        if (i < attempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
        }
      }
    }

    throw lastError
  }

  private async executeWithTimeout(fn: Function | string, input: any, ms: number, ctx?: Partial<FunctionContext>): Promise<any> {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    })

    const executionPromise = this.executeFunction(fn, input, ctx)

    return Promise.race([executionPromise, timeoutPromise])
  }

  then<TNext>(fn: Mapper<TOutput, TNext> | string): ChainableOperation<TInput, TNext> {
    this.operations.push({ type: 'then', fn })
    return this as any
  }

  when(predicate: Predicate<TOutput>): SemanticConditionalChain<TInput, TOutput> {
    const conditionalOp: Operation = { type: 'when', predicate }
    this.operations.push(conditionalOp)

    return {
      then: <TNext>(fn: Mapper<TOutput, TNext> | string): SemanticConditionalElseChain<TInput, TOutput, TNext> => {
        conditionalOp.fn = fn
        return {
          else: <TElse>(elseFn: Mapper<TOutput, TElse> | string): ChainableOperation<TInput, TNext | TElse> => {
            this.operations.push({ type: 'else', fn: elseFn })
            return this as any
          },
        }
      },
    }
  }

  map<TNext>(fn: Mapper<TOutput, TNext> | string): ChainableOperation<TInput, TNext[]> {
    this.operations.push({ type: 'map', fn })
    return this as any
  }

  filter(predicate: Predicate<TOutput>): ChainableOperation<TInput, TOutput[]> {
    this.operations.push({ type: 'filter', predicate })
    return this as any
  }

  reduce<TAcc>(fn: (acc: TAcc, item: TOutput) => TAcc | Promise<TAcc>, initial: TAcc): ChainableOperation<TInput, TAcc> {
    this.operations.push({ type: 'reduce', fn, initial })
    return this as any
  }

  parallel(): ChainableOperation<TInput, TOutput> {
    this.operations.push({ type: 'parallel' })
    return this as any
  }

  retry(attempts: number, delay?: number): ChainableOperation<TInput, TOutput> {
    this.operations.push({ type: 'retry', attempts, delay })
    return this as any
  }

  timeout(ms: number): ChainableOperation<TInput, TOutput> {
    this.operations.push({ type: 'timeout', ms })
    return this as any
  }
}

/**
 * Create a chainable operation
 *
 * @example
 * ```typescript
 * const operation = chain('fn_fetch_users')
 *   .filter(user => user.active)
 *   .map('fn_enrich_user')
 *   .parallel()
 *
 * const result = await operation.execute()
 * ```
 */
export function chain<TInput = any, TOutput = any>(fn: string | Function): ChainableOperation<TInput, TOutput> {
  return new ChainableOperationImpl(fn)
}

/**
 * Semantic Database API
 *
 * @example
 * ```typescript
 * // db.forEach.Occupation.tasks(ifAICapableOfDelivering.generateService)
 * const result = await db.forEach.Occupation.tasks(
 *   chain('fn_check_ai_capable')
 *     .when(result => result.capable)
 *     .then('fn_generate_service')
 * ).execute()
 * ```
 */
export const db = {
  /**
   * For each record in a collection
   */
  forEach: new Proxy(
    {},
    {
      get: (_, collection: string) => {
        return new Proxy(
          {},
          {
            get: (_, field: string) => {
              return (operation: ChainableOperation) => {
                return chain(async (input: any, ctx: FunctionContext) => {
                  // Fetch all records from collection
                  const records = await execute(`fn_db_list_${collection}`, {}, { context: ctx })

                  if (records.status !== 'completed') {
                    throw new Error(`Failed to list ${collection}`)
                  }

                  const results = []

                  // Execute operation for each record's field
                  for (const record of records.output) {
                    const fieldValue = record[field]
                    if (Array.isArray(fieldValue)) {
                      for (const item of fieldValue) {
                        const result = await operation.execute(item, ctx)
                        results.push(result)
                      }
                    }
                  }

                  return results
                })
              }
            },
          }
        )
      },
    }
  ),

  /**
   * Get a single record
   */
  get: new Proxy(
    {},
    {
      get: (_, collection: string) => {
        return (query: any) => {
          return chain(`fn_db_get_${collection}`).then((record) => record)
        }
      },
    }
  ),

  /**
   * List records
   */
  list: new Proxy(
    {},
    {
      get: (_, collection: string) => {
        return (filter?: any) => {
          return chain(`fn_db_list_${collection}`)
        }
      },
    }
  ),

  /**
   * Create a record
   */
  create: new Proxy(
    {},
    {
      get: (_, collection: string) => {
        return (data: any) => {
          return chain(`fn_db_create_${collection}`)
        }
      },
    }
  ),
}

/**
 * Conditional helpers
 */
export const ifAICapableOfDelivering = chain('fn_check_ai_capable').when((result: any) => result.capable)

export const ifHighValue = chain((input: any) => input).when((input: any) => input.value > 1000)

export const ifActiveUser = chain((input: any) => input).when((input: any) => input.status === 'active')

/**
 * Transform helpers
 */
export const generateService = chain('fn_generate_service')

export const enrichData = chain('fn_enrich_data')

export const sendNotification = chain('fn_send_notification')
