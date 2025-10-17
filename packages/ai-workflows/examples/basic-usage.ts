/**
 * Basic usage example for ai-workflows
 *
 * This example demonstrates:
 * - Defining workflows with multiple steps
 * - Executing workflows with input data
 * - Monitoring execution status
 * - Handling workflow triggers and scheduling
 */

import { defineWorkflow, executeWorkflow, getExecution, listExecutions, getWorkflowStats, cancelExecution } from 'ai-workflows'

async function main() {
  console.log('=== ai-workflows Basic Usage Example ===\n')

  // 1. Define a simple workflow
  console.log('1. Defining a simple order processing workflow...')
  const orderWorkflow = await defineWorkflow({
    name: 'orderProcessing',
    description: 'Process customer orders from validation to fulfillment',
    version: '1.0.0',
    steps: [
      {
        id: 'validate',
        name: 'Validate Order',
        type: 'function',
        config: { function: 'validateOrder' },
        onSuccess: 'checkInventory',
        onError: 'notifyFailure',
      },
      {
        id: 'checkInventory',
        name: 'Check Inventory',
        type: 'function',
        config: { function: 'checkInventory' },
        onSuccess: 'chargePayment',
        onError: 'notifyOutOfStock',
      },
      {
        id: 'chargePayment',
        name: 'Charge Payment',
        type: 'http',
        config: { url: 'https://api.stripe.com/charges', method: 'POST' },
        retry: { maxAttempts: 3, backoff: 'exponential', delay: 1000 },
        onSuccess: 'fulfill',
        onError: 'refund',
      },
      {
        id: 'fulfill',
        name: 'Fulfill Order',
        type: 'function',
        config: { function: 'fulfillOrder' },
        onSuccess: 'complete',
      },
      {
        id: 'complete',
        name: 'Complete Order',
        type: 'function',
        config: { function: 'notifyCustomer' },
      },
    ],
    initialStep: 'validate',
    triggers: [{ type: 'event', event: '$.Order.created' }],
    metadata: {
      author: 'example-user',
      tags: ['order', 'ecommerce'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  console.log(`   Workflow defined: ${orderWorkflow.name} (${orderWorkflow.id})`)
  console.log(`   Steps: ${orderWorkflow.steps.length}`)
  console.log(`   Triggers: ${orderWorkflow.triggers?.length}\n`)

  // 2. Define a scheduled workflow
  console.log('2. Defining a scheduled data sync workflow...')
  const syncWorkflow = await defineWorkflow({
    name: 'dailyDataSync',
    description: 'Sync data with external systems daily',
    version: '1.0.0',
    steps: [
      {
        id: 'fetch',
        name: 'Fetch External Data',
        type: 'http',
        config: { url: 'https://api.example.com/data' },
        timeout: 30000,
      },
      {
        id: 'transform',
        name: 'Transform Data',
        type: 'function',
        config: { function: 'transformData' },
      },
      {
        id: 'save',
        name: 'Save to Database',
        type: 'function',
        config: { function: 'saveData' },
      },
    ],
    initialStep: 'fetch',
    triggers: [{ type: 'schedule', schedule: '0 2 * * *' }], // Run at 2 AM daily
  })

  console.log(`   Workflow defined: ${syncWorkflow.name} (${syncWorkflow.id})`)
  console.log(`   Schedule: Daily at 2 AM\n`)

  // 3. Execute a workflow
  console.log('3. Executing order processing workflow...')
  const execution = await executeWorkflow(orderWorkflow.id, {
    orderId: 'order_12345',
    customerId: 'customer_67890',
    items: [
      { sku: 'WIDGET-001', quantity: 2, price: 29.99 },
      { sku: 'GADGET-002', quantity: 1, price: 49.99 },
    ],
    total: 109.97,
  })

  console.log(`   Execution started: ${execution.id}`)
  console.log(`   Status: ${execution.status}`)
  console.log(`   Started at: ${execution.startedAt.toISOString()}`)
  console.log(`   Steps executed: ${execution.steps.length}\n`)

  // 4. Get execution details
  console.log('4. Retrieving execution details...')
  const executionDetails = await getExecution(execution.id)
  if (executionDetails) {
    console.log(`   Status: ${executionDetails.status}`)
    console.log(`   Duration: ${executionDetails.completedAt ? executionDetails.completedAt.getTime() - executionDetails.startedAt.getTime() : 'N/A'}ms`)
    console.log(`   Steps completed: ${executionDetails.steps.filter((s) => s.status === 'completed').length}/${executionDetails.steps.length}`)

    if (executionDetails.error) {
      console.log(`   Error: ${executionDetails.error.message}`)
    }
  }
  console.log()

  // 5. List all executions for a workflow
  console.log('5. Listing executions...')
  const executions = await listExecutions({
    workflowId: orderWorkflow.id,
    limit: 10,
  })
  console.log(`   Total executions: ${executions.length}`)
  executions.forEach((exec, index) => {
    console.log(`   ${index + 1}. ${exec.id} - ${exec.status} (${exec.startedAt.toISOString()})`)
  })
  console.log()

  // 6. Get workflow statistics
  console.log('6. Getting workflow statistics...')
  const stats = await getWorkflowStats(orderWorkflow.id)
  console.log(`   Total executions: ${stats.totalExecutions}`)
  console.log(`   Successful: ${stats.successfulExecutions}`)
  console.log(`   Failed: ${stats.failedExecutions}`)
  console.log(`   Average duration: ${stats.averageDuration}ms`)
  if (stats.lastExecutedAt) {
    console.log(`   Last executed: ${stats.lastExecutedAt.toISOString()}`)
  }
  console.log()

  // 7. Define a parallel workflow
  console.log('7. Defining a parallel processing workflow...')
  const parallelWorkflow = await defineWorkflow({
    name: 'parallelProcessing',
    description: 'Process multiple tasks in parallel',
    version: '1.0.0',
    steps: [
      {
        id: 'parallel',
        name: 'Parallel Tasks',
        type: 'parallel',
        config: {
          tasks: ['processA', 'processB', 'processC'],
        },
      },
      {
        id: 'aggregate',
        name: 'Aggregate Results',
        type: 'function',
        config: { function: 'aggregateResults' },
      },
    ],
    initialStep: 'parallel',
  })

  console.log(`   Workflow defined: ${parallelWorkflow.name}`)
  console.log(`   Pattern: Parallel execution with aggregation\n`)

  // 8. Define a conditional workflow
  console.log('8. Defining a conditional workflow...')
  const conditionalWorkflow = await defineWorkflow({
    name: 'conditionalApproval',
    description: 'Approval workflow with conditions',
    version: '1.0.0',
    steps: [
      {
        id: 'evaluate',
        name: 'Evaluate Request',
        type: 'condition',
        config: {
          condition: 'amount > 1000',
          onTrue: 'requireApproval',
          onFalse: 'autoApprove',
        },
      },
      {
        id: 'requireApproval',
        name: 'Require Manager Approval',
        type: 'function',
        config: { function: 'requestApproval' },
      },
      {
        id: 'autoApprove',
        name: 'Auto Approve',
        type: 'function',
        config: { function: 'autoApprove' },
      },
    ],
    initialStep: 'evaluate',
  })

  console.log(`   Workflow defined: ${conditionalWorkflow.name}`)
  console.log(`   Pattern: Conditional branching based on amount\n`)

  console.log('=== Example Complete ===')
}

main().catch(console.error)
