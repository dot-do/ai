/**
 * Workflow Types for MDXLD-based declarative workflows
 *
 * These types define the structure for workflows using semantic triggers:
 * - Event triggers with `on.Object.action()` syntax
 * - Schedule triggers with `every()` syntax
 * - Declarative workflow definitions
 */

/**
 * Semantic interval types for scheduling
 */
export type SemanticInterval = '$.Hourly' | '$.Daily' | '$.Weekly' | '$.Monthly' | '$.Quarterly' | '$.Yearly'

/**
 * Event trigger - starts workflows when semantic events occur
 */
export interface WorkflowEventTrigger {
  $type: 'EventTrigger'
  $id: string
  /** Object type (e.g., Order, Customer, Payment) */
  object: string
  /** Action type (e.g., created, updated, deleted) */
  action: string
  /** Optional filter expression */
  filter?: string
  /** Context data to extract from event */
  context?: Record<string, string>
  /** Transform function for event data */
  transform?: string
}

/**
 * Schedule trigger - starts workflows on a schedule
 */
export interface WorkflowScheduleTrigger {
  $type: 'ScheduleTrigger'
  $id: string
  /** Cron expression or semantic interval */
  schedule: string | SemanticInterval
  /** Optional day of week (for weekly schedules) */
  day?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  /** Optional time of day */
  time?: string
  /** Optional timezone */
  timezone?: string
}

/**
 * Trigger type - event or schedule
 */
export type WorkflowTrigger = WorkflowEventTrigger | WorkflowScheduleTrigger

/**
 * Workflow step definition
 */
export interface WorkflowStep {
  $type: 'WorkflowStep'
  $id: string
  /** Step identifier */
  id: string
  /** Action to execute (semantic $.action) */
  action: string
  /** Input data for the step */
  input?: Record<string, any>
  /** Next step on success */
  onSuccess?: string
  /** Next step on error */
  onError?: string
  /** Retry configuration */
  retry?: {
    attempts: number
    backoff: 'linear' | 'exponential'
    delay: number
  }
}

/**
 * Workflow definition in MDXLD format
 */
export interface WorkflowDefinition {
  $type: 'Workflow'
  $id: string
  /** Workflow name */
  name: string
  /** Human-readable display name */
  displayName?: string
  /** Detailed description */
  description?: string
  /** Workflow version */
  version: string
  /** Triggers that can start this workflow */
  triggers: WorkflowTrigger[]
  /** Workflow steps (for YAML workflows) */
  steps?: WorkflowStep[]
  /** TypeScript execute function (for TS workflows) */
  execute?: string
  /** Error handler function */
  onError?: string
  /** Completion handler function */
  onComplete?: string
  /** Workflow metadata */
  metadata?: Record<string, any>
}

/**
 * Workflow execution context
 */
export interface WorkflowContext {
  $type: 'WorkflowContext'
  $id: string
  /** The trigger that initiated this workflow */
  trigger: WorkflowTrigger
  /** Trigger-specific context data */
  context: Record<string, any>
  /** Workflow metadata */
  metadata: {
    workflowId: string
    executionId: string
    startedAt: string
    version: string
  }
}

/**
 * Workflow execution result
 */
export interface WorkflowExecution {
  $type: 'WorkflowExecution'
  $id: string
  /** Workflow identifier */
  workflowId: string
  /** Execution identifier */
  executionId: string
  /** Execution status */
  status: 'pending' | 'running' | 'succeeded' | 'failed' | 'cancelled'
  /** Start timestamp */
  startedAt: string
  /** End timestamp */
  completedAt?: string
  /** Execution duration in milliseconds */
  duration?: number
  /** Trigger that initiated the execution */
  trigger: WorkflowTrigger
  /** Execution context */
  context: Record<string, any>
  /** Execution result data */
  result?: any
  /** Error information if failed */
  error?: {
    message: string
    stack?: string
    step?: string
  }
}
