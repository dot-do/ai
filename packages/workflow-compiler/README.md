# workflow-compiler

Compile MDXLD workflow definitions (YAML) to executable TypeScript for the `.do` platform.

## Overview

The `workflow-compiler` package provides tools to:

1. **Parse** YAML workflow definitions with validation
2. **Compile** workflows to executable TypeScript
3. **Execute** compiled workflows with a runtime

## Installation

```bash
pnpm add workflow-compiler
```

## Quick Start

### 1. Define a Workflow (YAML)

Create `order-fulfillment.yaml`:

```yaml
$id: order-fulfillment
$type: Workflow
name: Order Fulfillment
description: Process high-value orders
version: '1.0.0'
triggers:
  - on: $.Order.created
  - every: '0 */4 * * *'
steps:
  - id: check-inventory
    action: $.Inventory.check
    input:
      orderId: '{{context.orderId}}'
    onSuccess: process-payment
    onError: notify-team
  - id: process-payment
    action: $.Payment.process
    input:
      orderId: '{{context.orderId}}'
    onSuccess: send-confirmation
  - id: send-confirmation
    action: $.Email.send
    input:
      to: '{{customer.email}}'
      template: order-confirmation
  - id: notify-team
    action: $.Slack.send
    input:
      channel: '#alerts'
      message: 'Order processing failed'
```

### 2. Parse and Compile

```typescript
import { readFileSync } from 'fs'
import { parseWorkflow, validateWorkflow, compileWorkflow } from 'workflow-compiler'

// Parse YAML
const yaml = readFileSync('./order-fulfillment.yaml', 'utf-8')
const parseResult = parseWorkflow(yaml)

if (parseResult.errors.length > 0) {
  console.error('Parse errors:', parseResult.errors)
  process.exit(1)
}

// Validate
const validation = validateWorkflow(parseResult.workflow)
if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
  process.exit(1)
}

// Compile to TypeScript
const compileResult = compileWorkflow(parseResult.workflow, {
  pretty: true,
  debug: true,
})

console.log(compileResult.code)
```

### 3. Generated TypeScript

The compiler generates executable TypeScript:

```typescript
import { workflow, on, every } from 'ai-workflows'

export default workflow({
  name: 'Order Fulfillment',
  description: 'Process high-value orders',
  triggers: [on.Order.created(($) => ({ context: { workflowId: 'order-fulfillment' } })), every('0 */4 * * *')],
  async execute({ trigger, context, $, metadata }) {
    console.log('Workflow started:', metadata)

    // Step execution
    let currentStep = 'check-inventory'
    const stepOutputs: Record<string, any> = {}

    while (currentStep) {
      switch (currentStep) {
        case 'check-inventory':
          try {
            console.log('Executing step:', 'check-inventory')
            const result = await $.Inventory.check({ orderId: '{{context.orderId}}' })
            stepOutputs['check-inventory'] = result
            currentStep = 'process-payment'
          } catch (error) {
            console.error('Step failed:', 'check-inventory', error)
            currentStep = 'notify-team'
          }
          break

        // ... more steps
      }
    }

    return stepOutputs
  },
})
```

## API Reference

### Parser

#### `parseWorkflow(yaml: string): ParseResult`

Parse YAML workflow definition.

```typescript
interface ParseResult {
  workflow: YAMLWorkflowDefinition
  errors: string[]
  warnings: string[]
}
```

#### `validateWorkflow(workflow: YAMLWorkflowDefinition): ValidationResult`

Validate workflow structure and detect circular dependencies.

```typescript
interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}
```

### Compiler

#### `compileWorkflow(workflow: YAMLWorkflowDefinition, options?: CompileOptions): CompileResult`

Compile workflow to TypeScript.

```typescript
interface CompileOptions {
  sourceMaps?: boolean
  pretty?: boolean
  debug?: boolean
}

interface CompileResult {
  code: string
  errors: string[]
  warnings: string[]
}
```

### Runtime

#### `createRuntime(options?: RuntimeOptions): WorkflowRuntime`

Create a workflow runtime instance.

```typescript
interface RuntimeOptions {
  timeout?: number
  debug?: boolean
  retry?: {
    maxAttempts: number
    backoff: 'linear' | 'exponential'
    initialDelay: number
  }
}
```

#### `runtime.execute(workflowId, trigger, context, $): Promise<ExecutionResult>`

Execute a workflow.

```typescript
interface ExecutionResult {
  executionId: string
  status: 'succeeded' | 'failed'
  startedAt: Date
  completedAt: Date
  duration: number
  outputs?: Record<string, any>
  error?: {
    message: string
    step?: string
    stack?: string
  }
}
```

## Workflow YAML Format

### Required Fields

- `$id`: Unique workflow identifier
- `$type`: Must be `"Workflow"`
- `name`: Human-readable name
- `version`: Semantic version
- `triggers`: Array of event or schedule triggers
- `steps`: Array of workflow steps

### Triggers

**Event Trigger**:

```yaml
triggers:
  - on: $.Object.action # e.g., $.Order.created
```

**Schedule Trigger**:

```yaml
triggers:
  - every: '0 */4 * * *' # Cron expression
  - every: '$.Daily' # Semantic interval
```

### Steps

```yaml
steps:
  - id: step-name
    action: $.Service.method
    input:
      key: value
    onSuccess: next-step-id
    onError: error-handler-step-id
    retry:
      attempts: 3
      backoff: exponential
      delay: 1000
```

## Validation

The compiler performs comprehensive validation:

1. **Required Fields**: Ensures all required fields are present
2. **Trigger Syntax**: Validates trigger format (`$.Object.action`, cron expressions)
3. **Step References**: Validates onSuccess/onError step IDs exist
4. **Circular Dependencies**: Detects circular step references
5. **Action Format**: Validates action syntax (`$.Service.method`)

## Examples

See the `examples/` directory for complete examples:

- `examples/order-fulfillment.yaml` - Complete workflow definition
- `examples/compile-example.ts` - Compilation example

## Integration with Platform

The workflow-compiler integrates with the `.do` platform:

- **Payload CMS**: Store workflows in the `workflows` collection
- **Workers for Platforms**: Deploy compiled workflows as Cloudflare Workers
- **GraphDL**: Uses semantic types for workflow components
- **ai-workflows**: Compiles to ai-workflows TypeScript format

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Clean
pnpm clean
```

## License

MIT
