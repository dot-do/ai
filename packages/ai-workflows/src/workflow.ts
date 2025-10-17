/**
 * Workflow definition function
 */

import type { WorkflowDefinition, WorkflowContext } from './types.js'

/**
 * Define a workflow with triggers and execution logic
 *
 * Usage:
 * ```typescript
 * export default workflow({
 *   name: 'Order Fulfillment',
 *   triggers: [
 *     on.Order.created($ => ({
 *       filter: $.total > 100,
 *       context: { orderId: $.id }
 *     })),
 *     every('0 *\/4 * * *')
 *   ],
 *   async execute({ trigger, context, $ }) {
 *     // Workflow logic
 *   }
 * })
 * ```
 *
 * @param definition - Workflow definition
 * @returns Workflow definition object
 */
export function workflow<T = any>(definition: WorkflowDefinition<T>): WorkflowDefinition<T> {
  // Validate workflow definition
  if (!definition.name) {
    throw new Error('Workflow name is required')
  }

  if (!definition.triggers || definition.triggers.length === 0) {
    throw new Error('At least one trigger is required')
  }

  if (typeof definition.execute !== 'function') {
    throw new Error('Workflow execute function is required')
  }

  return definition
}

/**
 * Create a workflow execution context
 *
 * @param trigger - The trigger that initiated the workflow
 * @param data - Trigger-specific data
 * @param $ - Semantic action proxy
 * @returns Workflow context
 */
export function createContext<T = any>(trigger: WorkflowContext<T>['trigger'], data: T, $: any, metadata: WorkflowContext<T>['metadata']): WorkflowContext<T> {
  return {
    trigger,
    context: data,
    $,
    metadata,
  }
}
