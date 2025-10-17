/**
 * Workflows.do SDK Examples
 *
 * This file demonstrates the various features of the workflows.do SDK
 * for orchestrating multi-step workflows on Cloudflare Workflows.
 */

import { defineWorkflow, createWorkflowsService, $ } from 'sdk.do'

// =============================================================================
// Example 1: Basic User Onboarding Workflow
// =============================================================================

const userOnboarding = defineWorkflow({
  name: 'user-onboarding',
  description: 'Complete user onboarding process',
  steps: [
    {
      name: 'create-account',
      function: 'create-user',
      retry: {
        max: 3,
        delay: 1000,
        backoff: 'exponential',
      },
    },
    {
      name: 'send-welcome-email',
      function: 'send-email',
      dependsOn: ['create-account'],
    },
    {
      name: 'setup-billing',
      function: 'setup-stripe',
      dependsOn: ['create-account'],
    },
  ],
})

// Start the workflow
const execution = await userOnboarding.start({
  email: 'user@example.com',
  plan: 'pro',
})

// Check status
const status = await execution.status()
console.log(`Workflow status: ${status.status}`)
console.log(`Progress: ${(status.progress * 100).toFixed(0)}%`)

// Wait for completion
const result = await execution.wait()
console.log('Workflow completed:', result)

// =============================================================================
// Example 2: Data Pipeline with Parallel Processing
// =============================================================================

const dataPipeline = defineWorkflow({
  name: 'data-pipeline',
  description: 'ETL pipeline with parallel transformation',
  steps: [
    {
      name: 'extract',
      function: 'extract-data',
      input: (ctx) => ({
        source: ctx.input.dataSource,
        credentials: ctx.input.credentials,
      }),
    },
    {
      name: 'transform',
      parallel: [
        {
          name: 'transform-customers',
          function: 'transform-customers',
          input: (ctx) => ctx.stepResults.extract.customers,
        },
        {
          name: 'transform-orders',
          function: 'transform-orders',
          input: (ctx) => ctx.stepResults.extract.orders,
        },
        {
          name: 'transform-products',
          function: 'transform-products',
          input: (ctx) => ctx.stepResults.extract.products,
        },
      ],
      dependsOn: ['extract'],
    },
    {
      name: 'load',
      function: 'load-data',
      dependsOn: ['transform'],
      input: (ctx) => ({
        customers: ctx.stepResults['transform-customers'],
        orders: ctx.stepResults['transform-orders'],
        products: ctx.stepResults['transform-products'],
      }),
    },
  ],
  timeout: '30m',
})

// Start data pipeline
const pipelineExecution = await dataPipeline.start({
  dataSource: 'https://api.example.com/data',
  credentials: { apiKey: process.env.API_KEY },
  destination: 'warehouse',
})

// =============================================================================
// Example 3: Approval Flow with Conditional Branching
// =============================================================================

const approvalFlow = defineWorkflow({
  name: 'approval-flow',
  description: 'Smart approval routing based on amount',
  steps: [
    {
      name: 'submit',
      function: 'submit-request',
    },
    {
      name: 'route',
      function: 'determine-approver',
      condition: {
        'amount > 10000': ['ceo-approval', 'cfo-approval'],
        'amount > 1000': ['manager-approval'],
        default: ['auto-approve'],
      },
      dependsOn: ['submit'],
    },
    {
      name: 'ceo-approval',
      function: 'request-approval',
      input: (ctx) => ({
        approver: 'ceo@company.com',
        request: ctx.stepResults.submit,
      }),
    },
    {
      name: 'cfo-approval',
      function: 'request-approval',
      input: (ctx) => ({
        approver: 'cfo@company.com',
        request: ctx.stepResults.submit,
      }),
    },
    {
      name: 'manager-approval',
      function: 'request-approval',
      input: (ctx) => ({
        approver: ctx.stepResults.route.manager,
        request: ctx.stepResults.submit,
      }),
    },
    {
      name: 'auto-approve',
      function: 'auto-approve',
      input: (ctx) => ctx.stepResults.submit,
    },
    {
      name: 'finalize',
      function: 'finalize-approval',
      dependsOn: ['ceo-approval', 'cfo-approval', 'manager-approval', 'auto-approve'],
    },
  ],
})

// Start approval workflow
const approvalExecution = await approvalFlow.start({
  amount: 5000,
  description: 'Marketing campaign budget',
  requestor: 'john@company.com',
})

// =============================================================================
// Example 4: Using the Workflows Service for Management
// =============================================================================

const workflows = createWorkflowsService({
  apiUrl: 'https://workflows.do',
  apiKey: process.env.WORKFLOWS_API_KEY,
})

// List all workflows
const allWorkflows = await workflows.list({ limit: 10 })
console.log(`Found ${allWorkflows.length} workflows`)

// Get specific workflow
const workflow = await workflows.get('user-onboarding')
console.log(`Workflow: ${workflow.name}`)

// List executions for a workflow
const executions = await workflow.executions({
  status: 'completed',
  limit: 20,
})
console.log(`Found ${executions.length} completed executions`)

// Get execution by ID
const exec = await workflows.execution('exec-123')
const execStatus = await exec.status()
console.log(`Execution ${exec.id}: ${execStatus.status}`)

// =============================================================================
// Example 5: Advanced Retry and Timeout Configuration
// =============================================================================

const resilientWorkflow = defineWorkflow({
  name: 'resilient-api-calls',
  description: 'Workflow with comprehensive error handling',
  retry: {
    max: 5,
    delay: 2000,
    backoff: 'exponential',
    maxDelay: 60000,
  },
  timeout: '15m',
  steps: [
    {
      name: 'call-external-api',
      function: 'call-api',
      retry: {
        max: 10,
        delay: '5s',
        backoff: 'linear',
      },
      timeout: '2m',
    },
    {
      name: 'process-response',
      function: 'process-data',
      dependsOn: ['call-external-api'],
      retry: {
        max: 3,
        delay: '1s',
        backoff: 'fixed',
      },
    },
    {
      name: 'store-results',
      function: 'store-in-db',
      dependsOn: ['process-response'],
    },
  ],
})

// =============================================================================
// Example 6: Workflow Execution Control
// =============================================================================

// Start a workflow
const controlExec = await resilientWorkflow.start({ apiUrl: 'https://api.example.com' })

// Pause execution
await controlExec.pause()
console.log('Workflow paused')

// Resume execution
await controlExec.resume()
console.log('Workflow resumed')

// Cancel execution
await controlExec.cancel()
console.log('Workflow cancelled')

// =============================================================================
// Example 7: Using Workflows with BusinessContext ($)
// =============================================================================

// Access workflows through the unified $ context
const { workflows: workflowsService } = $

// Define workflow using $ context
const orderProcessing = defineWorkflow({
  name: 'order-processing',
  steps: [
    {
      name: 'validate-order',
      function: 'validate',
    },
    {
      name: 'charge-payment',
      function: 'charge',
      dependsOn: ['validate-order'],
    },
    {
      name: 'ship-order',
      function: 'ship',
      dependsOn: ['charge-payment'],
    },
    {
      name: 'send-confirmation',
      function: 'send-email',
      dependsOn: ['ship-order'],
    },
  ],
})

// Start and monitor
const orderExec = await orderProcessing.start({
  orderId: 'ORD-123',
  customerId: 'CUST-456',
})

const finalResult = await orderExec.wait(60000) // Wait max 60 seconds
console.log('Order processed:', finalResult.result)

// =============================================================================
// Example 8: Listing and Filtering Executions
// =============================================================================

// List all executions across all workflows
const allExecutions = await workflows.executions({
  status: 'running',
  limit: 50,
  startTime: new Date('2025-01-01'),
  endTime: new Date(),
})

console.log(`Active executions: ${allExecutions.length}`)

// List executions for specific workflow
const onboardingExecutions = await userOnboarding.executions({
  status: 'completed',
  limit: 100,
  offset: 0,
})

// Calculate success rate
const total = onboardingExecutions.length
const successful = onboardingExecutions.filter(async (exec) => {
  const status = await exec.status()
  return status.status === 'completed'
}).length

console.log(`Success rate: ${((successful / total) * 100).toFixed(1)}%`)

// =============================================================================
// Example 9: Workflow Input/Output Transformation
// =============================================================================

const dataTransform = defineWorkflow({
  name: 'data-transform',
  steps: [
    {
      name: 'fetch-data',
      function: 'fetch',
      input: (ctx) => ({
        url: ctx.input.source,
        headers: {
          Authorization: `Bearer ${ctx.input.token}`,
        },
      }),
      output: (result, ctx) => ({
        data: result.body,
        metadata: {
          fetchedAt: new Date().toISOString(),
          source: ctx.input.source,
        },
      }),
    },
    {
      name: 'validate-schema',
      function: 'validate',
      dependsOn: ['fetch-data'],
      input: (ctx) => ({
        data: ctx.stepResults['fetch-data'].data,
        schema: ctx.input.schema,
      }),
    },
    {
      name: 'enrich-data',
      function: 'enrich',
      dependsOn: ['validate-schema'],
      input: (ctx) => ctx.stepResults['fetch-data'].data,
      output: (result, ctx) => ({
        ...result,
        enrichedAt: new Date().toISOString(),
        metadata: ctx.stepResults['fetch-data'].metadata,
      }),
    },
  ],
})

// =============================================================================
// Example 10: Workflow Metadata and Monitoring
// =============================================================================

const monitoredWorkflow = defineWorkflow({
  name: 'monitored-process',
  description: 'Workflow with comprehensive tracking',
  metadata: {
    owner: 'data-team',
    sla: '5m',
    criticality: 'high',
    version: '2.1.0',
  },
  steps: [
    {
      name: 'step1',
      function: 'process',
      metadata: {
        costCenter: 'engineering',
        estimatedDuration: '30s',
      },
    },
    {
      name: 'step2',
      function: 'analyze',
      dependsOn: ['step1'],
      metadata: {
        requiresGpu: true,
        costCenter: 'ml-ops',
      },
    },
  ],
})

const monitoredExec = await monitoredWorkflow.start(
  { data: 'test' },
  {
    requestId: 'req-789',
    userId: 'user-123',
    priority: 'high',
  }
)

// Monitor execution
const monitorStatus = await monitoredExec.status()
console.log('Execution metadata:', monitorStatus.metadata)
console.log('Current step:', monitorStatus.currentStep)
console.log('Duration:', monitorStatus.duration, 'ms')
