/**
 * Basic example - Define and execute a workflow
 */

import { registerWorkflow, executeWorkflow, getWorkflow } from '../src/index.js'

async function main() {
  console.log('=== ai-workflows Basic Example ===\n')

  // 1. Define workflow
  console.log('1. Defining workflow...')

  const workflow = await registerWorkflow({
    id: 'process-order',
    name: 'Process Order',
    description: 'Validate, charge, and fulfill an order',
    version: '1.0.0',
    steps: [
      {
        id: 'validate',
        name: 'Validate Order',
        type: 'action',
        action: 'validateOrder',
        input: {
          orderId: '$input.orderId',
          items: '$input.items',
        },
        next: 'charge',
      },
      {
        id: 'charge',
        name: 'Charge Payment',
        type: 'action',
        action: 'chargeCard',
        input: {
          amount: '$input.amount',
          cardId: '$input.cardId',
        },
        next: 'fulfill',
        onError: 'refund',
      },
      {
        id: 'fulfill',
        name: 'Fulfill Order',
        type: 'action',
        action: 'fulfillOrder',
        input: {
          orderId: '$input.orderId',
        },
      },
      {
        id: 'refund',
        name: 'Refund Order',
        type: 'action',
        action: 'refundOrder',
        input: {
          orderId: '$input.orderId',
        },
      },
    ],
    startStep: 'validate',
    timeout: 300,
    tags: ['order', 'ecommerce'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  console.log('Workflow registered:', workflow.name)
  console.log('Workflow ID:', workflow.id)
  console.log('Steps:', workflow.steps.length)
  console.log()

  // 2. Get workflow
  console.log('2. Getting workflow...')

  const retrieved = await getWorkflow('process-order')
  if (retrieved) {
    console.log('Found workflow:', retrieved.name)
    console.log('Version:', retrieved.version)
    console.log('Tags:', retrieved.tags?.join(', '))
  }
  console.log()

  // 3. Execute workflow
  console.log('3. Executing workflow...')

  const result = await executeWorkflow('process-order', {
    orderId: '12345',
    items: [
      { id: 'item-1', quantity: 2 },
      { id: 'item-2', quantity: 1 },
    ],
    amount: 99.99,
    cardId: 'card-456',
  })

  if (result.success) {
    console.log('✓ Workflow completed successfully!')
    console.log('Execution ID:', result.executionId)
    console.log('Steps executed:', result.execution.stepsExecuted)
    console.log('Duration:', result.execution.duration, 'ms')
    console.log('Output:', result.output)
  } else {
    console.error('✗ Workflow failed:', result.error)
  }
  console.log()

  // 4. Show workflow structure
  console.log('4. Workflow structure:')
  console.log('Steps:')
  workflow.steps.forEach((step, index) => {
    console.log(`  ${index + 1}. ${step.name} (${step.type})`)
    if (step.action) {
      console.log(`     Action: ${step.action}`)
    }
    if (step.next) {
      console.log(`     Next: ${Array.isArray(step.next) ? step.next.join(', ') : step.next}`)
    }
    if (step.onError) {
      console.log(`     On Error: ${step.onError}`)
    }
  })
  console.log()

  console.log('=== Example Complete ===')
}

main().catch(console.error)
