/**
 * Integration Tests for Workflow Compiler
 *
 * Tests the complete workflow compilation pipeline:
 * - YAML parsing
 * - Validation
 * - TypeScript compilation
 * - Runtime execution
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { parseWorkflow, validateWorkflow, compileWorkflow, createRuntime } from '../src/index.js'

const TEST_DIR = join(process.cwd(), 'test-output')

beforeAll(() => {
  // Create test output directory
  if (!existsSync(TEST_DIR)) {
    mkdirSync(TEST_DIR, { recursive: true })
  }
})

afterAll(() => {
  // Clean up test directory
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true })
  }
})

describe('Workflow Compiler Integration Tests', () => {
  const simpleWorkflowYAML = `
$id: test-workflow
$type: Workflow
name: Test Workflow
description: A simple test workflow
version: "1.0.0"
triggers:
  - on: $.Test.event
steps:
  - id: step-1
    action: $.Email.send
    input:
      to: "test@example.com"
      subject: "Test Email"
`

  const multiStepWorkflowYAML = `
$id: multi-step-workflow
$type: Workflow
name: Multi-Step Workflow
description: Workflow with multiple steps and error handling
version: "1.0.0"
triggers:
  - on: $.Order.created
  - every: "0 * * * *"
steps:
  - id: validate-order
    action: $.Order.validate
    input:
      orderId: "{{context.orderId}}"
    onSuccess: process-payment
    onError: send-error-notification
  - id: process-payment
    action: $.Payment.process
    input:
      orderId: "{{context.orderId}}"
    onSuccess: send-confirmation
    onError: send-error-notification
  - id: send-confirmation
    action: $.Email.send
    input:
      to: "{{customer.email}}"
      template: order-confirmation
  - id: send-error-notification
    action: $.Slack.send
    input:
      channel: "#alerts"
      message: "Order processing failed"
`

  describe('Parsing', () => {
    it('should parse simple workflow YAML', () => {
      const result = parseWorkflow(simpleWorkflowYAML)

      expect(result.errors).toHaveLength(0)
      expect(result.workflow.$id).toBe('test-workflow')
      expect(result.workflow.name).toBe('Test Workflow')
      expect(result.workflow.triggers).toHaveLength(1)
      expect(result.workflow.steps).toHaveLength(1)
    })

    it('should parse multi-step workflow YAML', () => {
      const result = parseWorkflow(multiStepWorkflowYAML)

      expect(result.errors).toHaveLength(0)
      expect(result.workflow.steps).toHaveLength(4)
      expect(result.workflow.triggers).toHaveLength(2)
    })

    it('should detect missing required fields', () => {
      const invalidYAML = `
name: Test Workflow
steps: []
`
      const result = parseWorkflow(invalidYAML)

      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors.some((e) => e.includes('$id'))).toBe(true)
    })
  })

  describe('Validation', () => {
    it('should validate simple workflow', () => {
      const parseResult = parseWorkflow(simpleWorkflowYAML)
      const validation = validateWorkflow(parseResult.workflow)

      expect(validation.valid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should validate multi-step workflow', () => {
      const parseResult = parseWorkflow(multiStepWorkflowYAML)
      const validation = validateWorkflow(parseResult.workflow)

      expect(validation.valid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should detect invalid step references during parsing', () => {
      const invalidYAML = `
$id: invalid
$type: Workflow
name: Invalid
version: "1.0.0"
triggers:
  - on: $.Test.event
steps:
  - id: step-1
    action: $.Test.action
    input: {}
    onSuccess: nonexistent-step
`
      const parseResult = parseWorkflow(invalidYAML)

      expect(parseResult.errors.length).toBeGreaterThan(0)
      expect(parseResult.errors.some((e) => e.includes('nonexistent-step'))).toBe(true)
    })

    it('should detect circular dependencies', () => {
      const circularWorkflow = {
        $id: 'circular',
        $type: 'Workflow' as const,
        name: 'Circular',
        version: '1.0.0',
        triggers: [{ on: '$.Test.event' }],
        steps: [
          {
            id: 'step-1',
            action: '$.Test.action',
            input: {},
            onSuccess: 'step-2',
          },
          {
            id: 'step-2',
            action: '$.Test.action',
            input: {},
            onSuccess: 'step-1',
          },
        ],
      }

      const validation = validateWorkflow(circularWorkflow)

      expect(validation.valid).toBe(false)
      expect(validation.errors.some((e) => e.includes('Circular'))).toBe(true)
    })
  })

  describe('Compilation', () => {
    it('should compile simple workflow to TypeScript', () => {
      const parseResult = parseWorkflow(simpleWorkflowYAML)
      const compileResult = compileWorkflow(parseResult.workflow)

      expect(compileResult.errors).toHaveLength(0)
      expect(compileResult.code).toContain('export default workflow')
      expect(compileResult.code).toContain('on.Test.event')
      expect(compileResult.code).toContain('$.Email.send')
    })

    it('should compile multi-step workflow with state machine', () => {
      const parseResult = parseWorkflow(multiStepWorkflowYAML)
      const compileResult = compileWorkflow(parseResult.workflow)

      expect(compileResult.errors).toHaveLength(0)
      expect(compileResult.code).toContain('while (currentStep)')
      expect(compileResult.code).toContain('switch (currentStep)')
      expect(compileResult.code).toContain('case "validate-order"')
      expect(compileResult.code).toContain('case "process-payment"')
    })

    it('should include error handling in compiled code', () => {
      const parseResult = parseWorkflow(multiStepWorkflowYAML)
      const compileResult = compileWorkflow(parseResult.workflow)

      expect(compileResult.code).toContain('try {')
      expect(compileResult.code).toContain('catch (error)')
      expect(compileResult.code).toContain('currentStep = "send-error-notification"')
    })

    it('should support both event and schedule triggers', () => {
      const parseResult = parseWorkflow(multiStepWorkflowYAML)
      const compileResult = compileWorkflow(parseResult.workflow)

      expect(compileResult.code).toContain('on.Order.created')
      expect(compileResult.code).toContain('every("0 * * * *")')
    })

    it('should write compiled output to file', () => {
      const parseResult = parseWorkflow(simpleWorkflowYAML)
      const compileResult = compileWorkflow(parseResult.workflow)

      const outputPath = join(TEST_DIR, 'test-workflow.ts')
      writeFileSync(outputPath, compileResult.code)

      expect(existsSync(outputPath)).toBe(true)
      const written = readFileSync(outputPath, 'utf-8')
      expect(written).toBe(compileResult.code)
    })
  })

  describe('Runtime Execution', () => {
    it('should create runtime and register workflows', () => {
      const runtime = createRuntime({ timeout: 5000, debug: false })

      expect(runtime).toBeDefined()
      expect(typeof runtime.register).toBe('function')
      expect(typeof runtime.execute).toBe('function')
    })

    it('should track execution results', async () => {
      const runtime = createRuntime({ timeout: 5000 })

      // Mock workflow function
      const mockWorkflow = async (context: any) => {
        return { success: true, data: 'test' }
      }

      runtime.register('test-workflow', mockWorkflow)

      const result = await runtime.execute(
        'test-workflow',
        { type: 'event', data: { test: true } },
        {},
        {} // Mock $ proxy
      )

      expect(result.status).toBe('succeeded')
      expect(result.executionId).toBeDefined()
      expect(result.duration).toBeGreaterThanOrEqual(0)
      expect(result.outputs).toEqual({ success: true, data: 'test' })
    })

    it('should handle workflow execution errors', async () => {
      const runtime = createRuntime({ timeout: 5000 })

      // Mock workflow that throws an error
      const errorWorkflow = async () => {
        throw new Error('Test error')
      }

      runtime.register('error-workflow', errorWorkflow)

      const result = await runtime.execute('error-workflow', { type: 'event', data: {} }, {}, {})

      expect(result.status).toBe('failed')
      expect(result.error).toBeDefined()
      expect(result.error?.message).toContain('Test error')
    })

    it('should enforce execution timeouts', async () => {
      const runtime = createRuntime({ timeout: 100 }) // 100ms timeout

      // Mock workflow that takes too long
      const slowWorkflow = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return { success: true }
      }

      runtime.register('slow-workflow', slowWorkflow)

      const result = await runtime.execute('slow-workflow', { type: 'event', data: {} }, {}, {})

      expect(result.status).toBe('failed')
      expect(result.error?.message).toContain('timeout')
    })
  })

  describe('End-to-End', () => {
    it('should complete full workflow lifecycle', async () => {
      // 1. Parse YAML
      const parseResult = parseWorkflow(simpleWorkflowYAML)
      expect(parseResult.errors).toHaveLength(0)

      // 2. Validate
      const validation = validateWorkflow(parseResult.workflow)
      expect(validation.valid).toBe(true)

      // 3. Compile to TypeScript
      const compileResult = compileWorkflow(parseResult.workflow)
      expect(compileResult.errors).toHaveLength(0)

      // 4. Write to file
      const outputPath = join(TEST_DIR, 'e2e-workflow.ts')
      writeFileSync(outputPath, compileResult.code)
      expect(existsSync(outputPath)).toBe(true)

      // 5. Create runtime and mock workflow
      const runtime = createRuntime()
      const mockWorkflow = async () => ({ completed: true })
      runtime.register('test-workflow', mockWorkflow)

      // 6. Execute workflow
      const execution = await runtime.execute('test-workflow', { type: 'event', data: { test: true } }, {}, {})

      expect(execution.status).toBe('succeeded')
      expect(execution.executionId).toBeDefined()
    })
  })
})
