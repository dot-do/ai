/**
 * Parse YAML workflow definitions into structured WorkflowDefinition objects
 */

import { parse as parseYAML } from 'yaml'

/**
 * Workflow step definition
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

export interface ParseResult {
  workflow: YAMLWorkflowDefinition
  errors: string[]
  warnings: string[]
}

/**
 * Parse YAML workflow definition
 */
export function parseWorkflow(yaml: string): ParseResult {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    const workflow = parseYAML(yaml) as YAMLWorkflowDefinition

    // Validate required fields
    if (!workflow.$id) {
      errors.push('Missing required field: $id')
    }
    if (!workflow.$type || workflow.$type !== 'Workflow') {
      errors.push('Missing or invalid $type field (must be "Workflow")')
    }
    if (!workflow.name) {
      errors.push('Missing required field: name')
    }
    if (!workflow.version) {
      errors.push('Missing required field: version')
    }
    if (!workflow.triggers || workflow.triggers.length === 0) {
      errors.push('At least one trigger is required')
    }
    if (!workflow.steps || workflow.steps.length === 0) {
      errors.push('At least one step is required')
    }

    // Validate triggers
    if (workflow.triggers) {
      workflow.triggers.forEach((trigger, index) => {
        if (!trigger.on && !trigger.every) {
          errors.push(`Trigger ${index}: must have either 'on' or 'every' field`)
        }
        if (trigger.on && trigger.every) {
          warnings.push(`Trigger ${index}: has both 'on' and 'every' - only 'on' will be used`)
        }
      })
    }

    // Validate steps
    if (workflow.steps) {
      const stepIds = new Set<string>()

      workflow.steps.forEach((step, index) => {
        if (!step.id) {
          errors.push(`Step ${index}: missing required 'id' field`)
        } else {
          if (stepIds.has(step.id)) {
            errors.push(`Step ${index}: duplicate step id '${step.id}'`)
          }
          stepIds.add(step.id)
        }

        if (!step.action) {
          errors.push(`Step ${index} (${step.id}): missing required 'action' field`)
        }
      })

      // Validate step references
      workflow.steps.forEach((step) => {
        if (step.onSuccess && !stepIds.has(step.onSuccess)) {
          errors.push(`Step ${step.id}: onSuccess references unknown step '${step.onSuccess}'`)
        }
        if (step.onError && !stepIds.has(step.onError)) {
          errors.push(`Step ${step.id}: onError references unknown step '${step.onError}'`)
        }
      })
    }

    return { workflow, errors, warnings }
  } catch (error) {
    errors.push(`YAML parse error: ${error instanceof Error ? error.message : String(error)}`)
    return {
      workflow: {} as YAMLWorkflowDefinition,
      errors,
      warnings,
    }
  }
}

/**
 * Validate workflow definition
 */
export function validateWorkflow(workflow: YAMLWorkflowDefinition): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Check for circular dependencies in steps
  if (workflow.steps) {
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const hasCycle = (stepId: string): boolean => {
      if (recursionStack.has(stepId)) {
        errors.push(`Circular dependency detected involving step '${stepId}'`)
        return true
      }
      if (visited.has(stepId)) {
        return false
      }

      visited.add(stepId)
      recursionStack.add(stepId)

      const step = workflow.steps!.find((s) => s.id === stepId)
      if (step) {
        if (step.onSuccess && hasCycle(step.onSuccess)) return true
        if (step.onError && hasCycle(step.onError)) return true
      }

      recursionStack.delete(stepId)
      return false
    }

    workflow.steps.forEach((step) => {
      if (!visited.has(step.id)) {
        hasCycle(step.id)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
