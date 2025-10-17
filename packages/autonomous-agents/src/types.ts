import type { z } from 'zod'

/**
 * Schema.org Thing interface (simplified)
 * Full types available from 'schema.org.ai' package
 */
interface Thing {
  identifier?: string
  name?: string
  description?: string
  url?: string
  image?: string
  [key: string]: unknown
}

/**
 * Agent configuration following Schema.org Thing + Business-as-Code patterns
 */
export interface AgentConfig extends Partial<Thing> {
  /** Agent identifier (Schema.org Thing.identifier) */
  name: string
  /** Agent URL endpoint (Schema.org Thing.url) */
  url: string
  /** Agent role/persona (Schema.org Thing.description) */
  role: string
  /** Primary objective using OKR pattern */
  objective: string
  /** Key results for measuring success */
  keyResults: string[]
  /** External service integrations (APIs, webhooks) */
  integrations: string[]
  /** Event triggers that activate the agent ($.Event.triggered) */
  triggers: string[]
  /** Search capabilities (web, vector, semantic) */
  searches: string[]
  /** Actions the agent can perform */
  actions: string[]
  /** Optional business context */
  business?: string
  /** Optional service configuration */
  service?: string
}

/**
 * Result of agent execution
 */
export interface ExecuteResult<T = Record<string, string | number | boolean | null>> {
  /** Result data from execution */
  data: T
  /** Input provided to execution */
  input: Record<string, string | number | boolean | null>
  /** Optional execution options */
  options?: ExecuteOptions
  /** Agent name */
  agent: string
  /** ISO 8601 timestamp */
  timestamp: string
  /** Execution time in milliseconds */
  executionTime: number
}

/**
 * Options for agent execution
 */
export interface ExecuteOptions {
  /** Execute asynchronously */
  async?: boolean
  /** Timeout in milliseconds */
  timeout?: number
  /** Retry attempts */
  retries?: number
  /** Context data */
  context?: Record<string, string | number | boolean | null>
}

/**
 * Result of an agent action
 */
export interface ActionResult<T = Record<string, string | number | boolean | null>> {
  /** Action name */
  action: string
  /** Action parameters */
  params: Array<string | number | boolean | null | Record<string, string | number | boolean | null>>
  /** Agent name */
  agent: string
  /** ISO 8601 timestamp */
  timestamp: string
  /** Success status */
  success: boolean
  /** Result data */
  result?: T
  /** Error if failed */
  error?: string
}

/**
 * Result of event handler execution
 */
export interface EventHandlerResult {
  /** Trigger name */
  trigger: string
  /** Event arguments */
  args: Array<string | number | boolean | null | Record<string, string | number | boolean | null>>
  /** Agent name */
  agent: string
  /** ISO 8601 timestamp */
  timestamp: string
  /** Processing status */
  processed: boolean
  /** Execution time in milliseconds */
  executionTime: number
}

/**
 * Event handler function type
 */
export type EventHandler = (...args: Array<string | number | boolean | null | Record<string, string | number | boolean | null>>) => Promise<EventHandlerResult>

/**
 * Agent proxy for dynamic action invocation
 */
export interface AgentProxy {
  (action: string, ...params: Array<string | number | boolean | null | Record<string, string | number | boolean | null>>): Promise<ActionResult>
}

/**
 * Agent state interface
 */
export interface AgentState {
  lastExecution?: {
    timestamp: string
    executionTime: number
    input: Record<string, string | number | boolean | null>
    result: ExecuteResult
  }
  actions?: Array<{
    action: string
    params: Array<string | number | boolean | null | Record<string, string | number | boolean | null>>
    timestamp: string
    executionTime: number
    result: ActionResult
  }>
  keyResults?: Record<string, Array<{ value: string | number | boolean | null; timestamp: string }>>
}

/**
 * Autonomous agent instance
 */
export interface AutonomousAgent {
  /** Agent configuration */
  config: AgentConfig
  /** Execute agent with input */
  execute: (input: Record<string, string | number | boolean | null>, options?: ExecuteOptions) => Promise<ExecuteResult>
  /** Dynamic action proxy (agent.do('actionName', ...params)) */
  do: AgentProxy
  /** Event handlers for triggers */
  [trigger: string]:
    | EventHandler
    | AgentConfig
    | AgentProxy
    | ((input: Record<string, string | number | boolean | null>, options?: ExecuteOptions) => Promise<ExecuteResult>)
}
