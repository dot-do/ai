/**
 * Workflow type definitions for declarative workflow authoring
 */

/**
 * Semantic interval types for scheduling
 */
export type SemanticInterval = '$.Hourly' | '$.Daily' | '$.Weekly' | '$.Monthly' | '$.Quarterly' | '$.Yearly'

/**
 * Trigger configuration returned by event handler
 */
export interface TriggerConfig {
  /** Optional filter expression for the event */
  filter?: any
  /** Context data to pass to workflow */
  context?: Record<string, any>
  /** Transform event data */
  transform?: (event: any) => any
}

/**
 * Event trigger definition
 */
export interface EventTrigger {
  type: 'event'
  object: string
  action: string
  handler: ($: any) => TriggerConfig
}

/**
 * Schedule trigger definition
 */
export interface ScheduleTrigger {
  type: 'schedule'
  schedule: string | SemanticInterval
  options?: {
    day?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
    time?: string
    timezone?: string
  }
}

/**
 * Trigger type (event or schedule)
 */
export type Trigger = EventTrigger | ScheduleTrigger

/**
 * Workflow execution context
 */
export interface WorkflowContext<T = any> {
  /** The trigger that initiated this workflow */
  trigger: Trigger
  /** Trigger-specific context data */
  context: T
  /** Semantic $ proxy for executing actions */
  $: any
  /** Workflow metadata */
  metadata: {
    workflowId: string
    executionId: string
    startedAt: Date
    version: string
  }
}

/**
 * Workflow definition
 */
export interface WorkflowDefinition<T = any> {
  /** Workflow name */
  name: string
  /** Workflow description */
  description?: string
  /** Array of triggers that can start this workflow */
  triggers: Trigger[]
  /** Main execution function */
  execute: (context: WorkflowContext<T>) => Promise<void> | void
  /** Optional error handler */
  onError?: (error: Error, context: WorkflowContext<T>) => Promise<void> | void
  /** Optional completion handler */
  onComplete?: (context: WorkflowContext<T>) => Promise<void> | void
}

/**
 * Workflow step definition (for YAML workflows)
 */
export interface WorkflowStep {
  id: string
  action: string
  input?: Record<string, any>
  onSuccess?: string
  onError?: string
  retry?: {
    attempts: number
    backoff: 'linear' | 'exponential'
    delay: number
  }
}

/**
 * YAML workflow definition
 */
export interface YAMLWorkflowDefinition {
  $id: string
  $type: 'Workflow'
  name: string
  description?: string
  version: string
  triggers: Array<{
    on?: string
    every?: string
  }>
  steps: WorkflowStep[]
  metadata?: Record<string, any>
}
