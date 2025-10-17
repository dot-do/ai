/**
 * functions.do - Universal Function Abstraction for .do Platform
 *
 * Everything is a Function:
 * - Code Functions: Pure computation via do eval with Dynamic Worker Loader
 * - Generative Functions: AI-powered generation via AI worker
 * - Agentic Functions: Multi-step reasoning with tools via agents
 * - Human Functions: Human-in-the-loop via Slack BlockKit, Discord, Email, etc.
 *
 * @example
 * ```typescript
 * import { defineCodeFunction, execute } from 'functions.do'
 * import { z } from 'zod'
 *
 * // Define a code function
 * const addNumbers = defineCodeFunction({
 *   name: 'addNumbers',
 *   description: 'Add two numbers',
 *   input: z.object({ a: z.number(), b: z.number() }),
 *   output: z.number(),
 *   handler: async ({ a, b }) => a + b,
 *   deterministic: true,
 * })
 *
 * // Execute the function
 * const result = await execute('fn_add_numbers', { a: 5, b: 3 })
 * console.log(result.output) // 8
 * ```
 */

// Types
export type {
  // Core types
  FunctionType,
  FunctionStatus,
  ExecutionStatus,
  Schema,
  // Function definitions
  FunctionDefinition,
  CodeFunction,
  GenerativeFunction,
  AgenticFunction,
  HumanFunction,
  // Metadata and context
  FunctionMetadata,
  FunctionContext,
  // Execution
  ExecutionResult,
  ExecuteOptions,
  // Registry
  RegistryEntry,
  // Higher-order functions
  Conditional,
  ConditionalChain,
  Predicate,
  Mapper,
  Reducer,
} from './types'

// Registry
export { FunctionRegistry, getRegistry, registerFunction, unregisterFunction, getFunction, listFunctions } from './registry'

// Executor
export { execute, executeByName } from './executor'

// Executors (type-specific)
export { executeHumanFunction } from './executors/human'

// Validation
export { validateInput, validateOutput } from './validation'

// Define API
export { defineFunction, defineCodeFunction, defineGenerativeFunction, defineAgenticFunction, defineHumanFunction } from './define'

// Workflow API
export type { WorkflowStep, WorkflowContext, WorkflowFunction } from './workflow'
export { defineWorkflow, step, parallel, sequence } from './workflow'

// Semantic Fluent API
export type { ChainableOperation, SemanticConditionalChain, SemanticConditionalElseChain } from './semantic'
export {
  chain,
  db,
  // Conditional helpers
  ifAICapableOfDelivering,
  ifHighValue,
  ifActiveUser,
  // Transform helpers
  generateService,
  enrichData,
  sendNotification,
} from './semantic'

// Function Selector API
export type {
  FunctionRequirements,
  SelectionResult,
  FunctionImplementation,
  CodeImplementation,
  GenerativeImplementation,
  AgenticImplementation,
  HumanImplementation,
} from './selector'
export {
  selectFunctionType,
  generateImplementation,
  generateCodeImplementation,
  generateGenerativeImplementation,
  generateAgenticImplementation,
  generateHumanImplementation,
} from './selector'
