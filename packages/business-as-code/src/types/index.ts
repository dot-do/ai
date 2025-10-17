/**
 * Business-as-Code core types and abstractions
 */

/**
 * A business function that can be composed and executed
 */
export interface BusinessFunction<TInput = any, TOutput = any> {
  /**
   * Unique identifier for the function
   */
  id: string

  /**
   * Human-readable name
   */
  name: string

  /**
   * Description of what this function does
   */
  description?: string

  /**
   * Input schema/type
   */
  input?: TInput

  /**
   * Output schema/type
   */
  output?: TOutput

  /**
   * Execute the function
   */
  execute: (input: TInput) => Promise<TOutput> | TOutput

  /**
   * Metadata
   */
  metadata?: Record<string, any>
}

/**
 * A business workflow composed of multiple steps
 */
export interface BusinessWorkflow {
  /**
   * Unique identifier
   */
  id: string

  /**
   * Workflow name
   */
  name: string

  /**
   * Description
   */
  description?: string

  /**
   * Workflow steps/stages
   */
  steps: WorkflowStep[]

  /**
   * Triggers that start this workflow
   */
  triggers?: WorkflowTrigger[]

  /**
   * Metadata
   */
  metadata?: Record<string, any>
}

/**
 * A step in a workflow
 *
 * @example
 * ```typescript
 * const step: WorkflowStep = {
 *   id: 'send-email',
 *   name: 'Send Welcome Email',
 *   type: 'function',
 *   function: 'send-email-function',
 *   next: 'assign-rep'
 * }
 * ```
 */
export interface WorkflowStep {
  /**
   * Step identifier (unique within the workflow)
   *
   * @example 'send-email', 'validate-input', 'process-payment'
   */
  id: string

  /**
   * Human-readable step name
   *
   * @example 'Send Welcome Email', 'Validate User Input'
   */
  name: string

  /**
   * Type of step to execute
   *
   * - `function`: Execute a business function
   * - `condition`: Branch based on a condition
   * - `parallel`: Execute multiple steps in parallel
   * - `loop`: Repeat steps based on a condition
   * - `human`: Require human approval/input
   * - `agent`: Delegate to an autonomous agent
   */
  type: 'function' | 'condition' | 'parallel' | 'loop' | 'human' | 'agent'

  /**
   * Function to execute (for function steps)
   *
   * Can be a function ID (string) or a full BusinessFunction object
   *
   * @example 'send-email-function' or { id: 'calc', execute: async (input) => {...} }
   */
  function?: string | BusinessFunction

  /**
   * Condition expression (for condition steps)
   *
   * JavaScript expression that evaluates to true/false
   *
   * @example 'input.amount > 1000', 'user.role === "admin"'
   */
  condition?: string

  /**
   * Next step(s) to execute after this step completes
   *
   * - Single string: Go to that step
   * - Array of strings: Execute multiple steps in parallel
   * - Undefined: End workflow
   *
   * @example 'next-step-id' or ['step-1', 'step-2']
   */
  next?: string | string[]

  /**
   * Step-specific configuration options
   *
   * Content varies by step type:
   * - function: Input parameters, timeout, retries
   * - agent: Agent role, permissions, tools
   * - human: Approval requirements, notification settings
   *
   * @example { timeout: 5000, retries: 3 } or { agentRole: 'sdr' }
   */
  config?: Record<string, any>
}

/**
 * Workflow trigger
 */
export interface WorkflowTrigger {
  /**
   * Trigger type
   */
  type: 'schedule' | 'event' | 'webhook' | 'manual'

  /**
   * Trigger configuration
   */
  config: Record<string, any>

  /**
   * Condition for trigger activation
   */
  condition?: string
}

/**
 * An autonomous agent
 */
export interface BusinessAgent {
  /**
   * Agent identifier
   */
  id: string

  /**
   * Agent name/role
   */
  name: string

  /**
   * Description
   */
  description?: string

  /**
   * Agent type/role
   */
  role: 'cfo' | 'cmo' | 'cto' | 'swe' | 'sdr' | 'bdr' | 'custom'

  /**
   * Functions this agent can execute
   */
  functions: string[] | BusinessFunction[]

  /**
   * Workflows this agent can run
   */
  workflows?: string[] | BusinessWorkflow[]

  /**
   * Agent capabilities
   */
  capabilities?: string[]

  /**
   * Configuration
   */
  config?: Record<string, any>
}

/**
 * Business resource (noun/entity instance)
 */
export interface BusinessResource {
  /**
   * Resource identifier
   */
  $id: string

  /**
   * Resource type (noun)
   */
  $type: string

  /**
   * Resource properties
   */
  [key: string]: any
}

/**
 * Business action (verb instance)
 */
export interface BusinessAction {
  /**
   * Action identifier
   */
  id: string

  /**
   * Action verb
   */
  verb: string

  /**
   * Subject (who performs the action)
   */
  subject: string | BusinessResource

  /**
   * Object (what the action is performed on)
   */
  object?: string | BusinessResource

  /**
   * When the action occurred/will occur
   */
  timestamp?: string

  /**
   * Action result/status
   */
  status?: 'pending' | 'in_progress' | 'completed' | 'failed'

  /**
   * Additional context
   */
  context?: Record<string, any>
}

/**
 * Business event
 */
export interface BusinessEvent {
  /**
   * Event identifier
   */
  id: string

  /**
   * Event type
   */
  type: string

  /**
   * When the event occurred
   */
  timestamp: string

  /**
   * Event source
   */
  source: string

  /**
   * Event data
   */
  data: Record<string, any>

  /**
   * Related resources
   */
  resources?: BusinessResource[]

  /**
   * Metadata
   */
  metadata?: Record<string, any>
}

/**
 * Business query/search
 */
export interface BusinessQuery {
  /**
   * Query identifier
   */
  id?: string

  /**
   * What to search for
   */
  query: string

  /**
   * Resource types to search
   */
  types?: string[]

  /**
   * Filters
   */
  filters?: Record<string, any>

  /**
   * Sort order
   */
  sort?: {
    field: string
    order: 'asc' | 'desc'
  }

  /**
   * Pagination
   */
  pagination?: {
    page: number
    pageSize: number
  }
}

/**
 * Business metric/KPI
 */
export interface BusinessMetric {
  /**
   * Metric identifier
   */
  id: string

  /**
   * Metric name
   */
  name: string

  /**
   * Metric type
   */
  type: 'kpi' | 'okr' | 'counter' | 'gauge' | 'histogram'

  /**
   * Current value
   */
  value: number | string

  /**
   * Target value (for KPIs/OKRs)
   */
  target?: number | string

  /**
   * Unit of measurement
   */
  unit?: string

  /**
   * When measured
   */
  timestamp?: string

  /**
   * Metadata
   */
  metadata?: Record<string, any>
}
