/**
 * ai-workflows - Declarative workflow definitions with MDXLD
 *
 * Provides semantic trigger syntax for building AI-native workflows:
 * - on.Object.action() for event triggers
 * - every() for scheduled triggers
 * - workflow() for defining workflows
 */

export { workflow, createContext } from './workflow.js'
export { on, every, isEventTrigger, isScheduleTrigger } from './triggers.js'

export type {
  WorkflowDefinition,
  WorkflowContext,
  Trigger,
  EventTrigger,
  ScheduleTrigger,
  TriggerConfig,
  WorkflowStep,
  YAMLWorkflowDefinition,
  SemanticInterval,
} from './types.js'
