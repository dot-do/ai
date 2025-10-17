/**
 * Trigger functions for workflow definitions
 *
 * Provides semantic trigger syntax:
 * - on.Order.created($ => ({ ... }))
 * - every('0 *\/4 * * *')
 */

import type { EventTrigger, ScheduleTrigger, TriggerConfig, SemanticInterval } from './types.js'

/**
 * Create event trigger proxy with on.Object.action() syntax
 *
 * Usage:
 * ```typescript
 * on.Order.created($ => ({
 *   filter: $.total > 100,
 *   context: { orderId: $.id }
 * }))
 * ```
 */
export const on = new Proxy(
  {},
  {
    get(_target, object: string) {
      return new Proxy(
        {},
        {
          get(_target, action: string) {
            return (handler: ($: any) => TriggerConfig): EventTrigger => {
              return {
                type: 'event',
                object,
                action,
                handler,
              }
            }
          },
        }
      )
    },
  }
) as OnProxy

/**
 * Type-safe on proxy interface
 */
interface OnProxy {
  [object: string]: {
    [action: string]: (handler: ($: any) => TriggerConfig) => EventTrigger
  }
}

/**
 * Create schedule trigger
 *
 * Usage:
 * ```typescript
 * every('0 *\/4 * * *')                        // Cron expression
 * every('$.Daily')                             // Semantic interval
 * every('$.Weekly', { day: 'monday' })        // With options
 * ```
 *
 * @param schedule - Cron expression or semantic interval
 * @param options - Optional scheduling options
 * @returns Schedule trigger definition
 */
export function every(
  schedule: string | SemanticInterval,
  options?: {
    day?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
    time?: string
    timezone?: string
  }
): ScheduleTrigger {
  return {
    type: 'schedule',
    schedule,
    options,
  }
}

/**
 * Helper to check if a value is an event trigger
 */
export function isEventTrigger(trigger: any): trigger is EventTrigger {
  return trigger && trigger.type === 'event'
}

/**
 * Helper to check if a value is a schedule trigger
 */
export function isScheduleTrigger(trigger: any): trigger is ScheduleTrigger {
  return trigger && trigger.type === 'schedule'
}
