/**
 * Compile YAML workflows to executable TypeScript
 */

import type { YAMLWorkflowDefinition, WorkflowStep } from './parser.js'

export interface CompileOptions {
  /** Generate source maps */
  sourceMaps?: boolean
  /** Pretty print output */
  pretty?: boolean
  /** Add debug logging */
  debug?: boolean
}

export interface CompileResult {
  code: string
  errors: string[]
  warnings: string[]
}

/**
 * Compile YAML workflow to TypeScript
 */
export function compileWorkflow(workflow: YAMLWorkflowDefinition, options: CompileOptions = {}): CompileResult {
  const errors: string[] = []
  const warnings: string[] = []
  const lines: string[] = []

  try {
    // Generate imports
    lines.push("import { workflow, on, every } from 'ai-workflows'")
    lines.push('')

    // Generate trigger definitions
    const triggers = compileTriggers(workflow, errors)

    // Generate workflow export
    lines.push('export default workflow({')
    lines.push(`  name: ${JSON.stringify(workflow.name)},`)

    if (workflow.description) {
      lines.push(`  description: ${JSON.stringify(workflow.description)},`)
    }

    lines.push('  triggers: [')
    lines.push(triggers.map((t) => '    ' + t).join(',\n'))
    lines.push('  ],')

    // Generate execute function
    lines.push('  async execute({ trigger, context, $, metadata }) {')

    if (options.debug) {
      lines.push("    console.log('Workflow started:', metadata)")
    }

    // Generate step execution logic
    if (workflow.steps && workflow.steps.length > 0) {
      const stepCode = compileSteps(workflow.steps, options.debug || false)
      lines.push(...stepCode.map((line) => '    ' + line))
    } else {
      lines.push('    // No steps defined')
      warnings.push('Workflow has no steps defined')
    }

    lines.push('  }')
    lines.push('})')

    const code = options.pretty ? lines.join('\n') + '\n' : lines.join('\n')

    return { code, errors, warnings }
  } catch (error) {
    errors.push(`Compilation error: ${error instanceof Error ? error.message : String(error)}`)
    return { code: '', errors, warnings }
  }
}

/**
 * Compile workflow triggers to TypeScript
 */
function compileTriggers(workflow: YAMLWorkflowDefinition, errors: string[]): string[] {
  const triggers: string[] = []

  workflow.triggers?.forEach((trigger, index) => {
    if (trigger.on) {
      // Parse semantic trigger: $.Object.action
      const match = trigger.on.match(/^\$\.(\w+)\.(\w+)$/)
      if (match) {
        const [, object, action] = match
        triggers.push(`on.${object}.${action}($ => ({ context: { workflowId: ${JSON.stringify(workflow.$id)} } }))`)
      } else {
        errors.push(`Invalid trigger format at index ${index}: ${trigger.on}`)
      }
    } else if (trigger.every) {
      // Schedule trigger
      triggers.push(`every(${JSON.stringify(trigger.every)})`)
    }
  })

  return triggers
}

/**
 * Compile workflow steps to TypeScript
 */
function compileSteps(steps: WorkflowStep[], debug: boolean): string[] {
  const lines: string[] = []

  lines.push('// Step execution')
  lines.push(`let currentStep = ${JSON.stringify(steps[0].id)}`)
  lines.push('const stepOutputs: Record<string, any> = {}')
  lines.push('')

  lines.push('while (currentStep) {')
  lines.push('  switch (currentStep) {')

  steps.forEach((step) => {
    lines.push(`    case ${JSON.stringify(step.id)}:`)
    lines.push('      try {')

    if (debug) {
      lines.push(`        console.log('Executing step:', ${JSON.stringify(step.id)})`)
    }

    // Parse action: $.Service.method
    const actionMatch = step.action.match(/^\$\.(\w+)\.(\w+)$/)
    if (actionMatch) {
      const [, service, method] = actionMatch
      const inputJson = JSON.stringify(step.input || {})
      lines.push(`        // Execute: ${step.action}`)
      lines.push(`        const result = await $.${service}.${method}(${inputJson})`)
      lines.push(`        stepOutputs[${JSON.stringify(step.id)}] = result`)
    } else {
      lines.push(`        // Invalid action format: ${step.action}`)
      lines.push(`        throw new Error('Invalid action format: ${step.action}')`)
    }

    // Handle next step
    if (step.onSuccess) {
      lines.push(`        currentStep = ${JSON.stringify(step.onSuccess)}`)
    } else {
      lines.push('        currentStep = null')
    }

    lines.push('      } catch (error) {')

    if (debug) {
      lines.push(`        console.error('Step failed:', ${JSON.stringify(step.id)}, error)`)
    }

    if (step.onError) {
      lines.push(`        currentStep = ${JSON.stringify(step.onError)}`)
    } else {
      lines.push('        throw error')
    }

    lines.push('      }')
    lines.push('      break')
    lines.push('')
  })

  lines.push('    default:')
  lines.push('      currentStep = null')
  lines.push('  }')
  lines.push('}')
  lines.push('')
  lines.push('return stepOutputs')

  return lines
}

/**
 * Compile multiple workflows from a directory
 */
export async function compileDirectory(inputDir: string, outputDir: string, options: CompileOptions = {}): Promise<{ compiled: number; errors: string[] }> {
  // This would be implemented to read all .yaml files from inputDir,
  // compile them, and write the output to outputDir
  // For now, it's a placeholder for the CLI implementation
  return { compiled: 0, errors: ['Not yet implemented'] }
}
