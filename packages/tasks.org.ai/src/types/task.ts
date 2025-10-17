/**
 * Task type definitions for tasks.org.ai
 *
 * Based on O*NET Database 30.0 - Task Statements
 */

import type { Thing, Ref } from './base.js'

/**
 * Task - Occupational task or work activity
 *
 * Represents a task statement from the O*NET Task Statements dataset
 */
export interface Task extends Thing {
  $type: 'Task'

  // O*NET identifiers
  onetSocCode: string // O*NET-SOC occupation code
  taskId: string // Task ID within occupation
  taskStatement: string // The actual task description

  // Optional properties
  taskType?: string // Type of task (if categorized)

  // Semantic relationships (explicit predicates)
  performedBy?: Ref[] // $.Task.performedBy.Occupation
  requires?: Ref[] // $.Task.requires.Technology
  requiresTool?: Ref[] // $.Task.requiresTool.Tool
  relatedTo?: Ref[] // $.Task.relatedTo.Task
}
