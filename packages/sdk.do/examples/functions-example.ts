/**
 * Functions Service Examples
 * Demonstrates how to deploy and execute serverless functions using sdk.do
 */

import { $, defineFunction } from 'sdk.do'

// ============================================================================
// Example 1: Define and Deploy a Function
// ============================================================================

async function example1_defineAndDeploy() {
  console.log('Example 1: Define and Deploy a Function')

  // Define a payment processing function
  const processPaymentFn = defineFunction({
    name: 'process-payment',
    handler: async (event) => {
      const { amount, currency, customerId } = event
      // Payment processing logic here
      return {
        success: true,
        transactionId: 'txn_' + Date.now(),
        amount,
        currency,
        customerId,
      }
    },
    timeout: 30000, // 30 seconds
    memory: 256, // 256 MB
    env: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    },
  })

  // Deploy the function
  const fn = await $.functions.deploy('process-payment', processPaymentFn.handler, {
    timeout: processPaymentFn.timeout,
    memory: processPaymentFn.memory,
    env: processPaymentFn.env,
  })

  console.log('Function deployed successfully!')
  return fn
}

// ============================================================================
// Example 2: Execute a Function
// ============================================================================

async function example2_executeFunction() {
  console.log('Example 2: Execute a Function')

  // Execute the function directly
  const result = await $.functions.execute('process-payment', {
    amount: 1000,
    currency: 'usd',
    customerId: 'cus_123',
  })

  console.log('Payment processed:', result)
  return result
}

// ============================================================================
// Example 3: Execute via DeployedFunction Instance
// ============================================================================

async function example3_executeViaInstance() {
  console.log('Example 3: Execute via DeployedFunction Instance')

  // Get the deployed function
  const fn = await $.functions.get('process-payment')

  // Execute it
  const result = await fn.execute({
    amount: 2500,
    currency: 'usd',
    customerId: 'cus_456',
  })

  console.log('Payment processed:', result)
  return result
}

// ============================================================================
// Example 4: Schedule a Function
// ============================================================================

async function example4_scheduleFunction() {
  console.log('Example 4: Schedule a Function')

  // Deploy a daily report function
  const reportFn = await $.functions.deploy(
    'daily-report',
    async (event) => {
      console.log('Generating daily report...')
      // Report generation logic
      return {
        reportDate: new Date().toISOString(),
        metrics: {
          revenue: 12500,
          orders: 45,
          customers: 32,
        },
      }
    },
    {
      description: 'Generates daily business reports',
    }
  )

  // Schedule it to run daily at midnight (UTC)
  await reportFn.schedule({
    cron: '0 0 * * *',
    timezone: 'UTC',
    description: 'Daily at midnight',
  })

  console.log('Function scheduled successfully!')
}

// ============================================================================
// Example 5: List All Functions
// ============================================================================

async function example5_listFunctions() {
  console.log('Example 5: List All Functions')

  // List all deployed functions
  const functions = await $.functions.list()

  console.log(`Found ${functions.length} functions:`)
  functions.forEach((fn) => {
    console.log(`  - ${fn.name} (${fn.runtime})`)
  })

  return functions
}

// ============================================================================
// Example 6: List Functions with Pagination
// ============================================================================

async function example6_listWithPagination() {
  console.log('Example 6: List Functions with Pagination')

  // List functions with pagination
  const functions = await $.functions.list({
    limit: 10,
    offset: 0,
    runtime: 'workers',
  })

  console.log(`Found ${functions.length} worker functions`)
  return functions
}

// ============================================================================
// Example 7: Get Function Metadata
// ============================================================================

async function example7_getFunctionMetadata() {
  console.log('Example 7: Get Function Metadata')

  const fn = await $.functions.get('process-payment')
  const metadata = await fn.getMetadata()

  console.log('Function metadata:', {
    name: metadata.name,
    runtime: metadata.runtime,
    timeout: metadata.timeout,
    memory: metadata.memory,
    createdAt: metadata.createdAt,
    lastExecuted: metadata.lastExecuted,
  })

  return metadata
}

// ============================================================================
// Example 8: Retrieve Function Logs
// ============================================================================

async function example8_getFunctionLogs() {
  console.log('Example 8: Retrieve Function Logs')

  const fn = await $.functions.get('process-payment')

  // Get recent logs
  const logs = await fn.logs({
    limit: 100,
    level: 'info',
  })

  console.log(`Found ${logs.length} log entries:`)
  logs.forEach((log) => {
    console.log(`  [${log.timestamp}] ${log.level}: ${log.message}`)
  })

  return logs
}

// ============================================================================
// Example 9: Filter Logs by Date Range
// ============================================================================

async function example9_filterLogsByDate() {
  console.log('Example 9: Filter Logs by Date Range')

  const logs = await $.functions.logs('process-payment', {
    limit: 50,
    level: 'error',
    startDate: '2025-10-11T00:00:00Z',
    endDate: '2025-10-11T23:59:59Z',
  })

  console.log(`Found ${logs.length} error logs for today`)
  return logs
}

// ============================================================================
// Example 10: Delete a Function
// ============================================================================

async function example10_deleteFunction() {
  console.log('Example 10: Delete a Function')

  // Delete a function
  await $.functions.delete('old-function')

  console.log('Function deleted successfully!')
}

// ============================================================================
// Example 11: Complex Function with Error Handling
// ============================================================================

async function example11_complexFunction() {
  console.log('Example 11: Complex Function with Error Handling')

  const emailFn = await $.functions.deploy(
    'send-email',
    async (event) => {
      const { to, subject, body } = event

      // Validate input
      if (!to || !subject || !body) {
        throw new Error('Missing required fields: to, subject, body')
      }

      // Email sending logic (mock)
      console.log(`Sending email to ${to}...`)

      return {
        success: true,
        messageId: 'msg_' + Date.now(),
        to,
        subject,
        sentAt: new Date().toISOString(),
      }
    },
    {
      timeout: 10000,
      memory: 128,
      description: 'Sends transactional emails',
      env: {
        SMTP_HOST: process.env.SMTP_HOST || '',
        SMTP_PORT: process.env.SMTP_PORT || '587',
      },
    }
  )

  // Execute with error handling
  try {
    const result = await emailFn.execute({
      to: 'customer@example.com',
      subject: 'Welcome!',
      body: 'Thank you for signing up.',
    })
    console.log('Email sent:', result)
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}

// ============================================================================
// Example 12: Batch Processing Function
// ============================================================================

async function example12_batchProcessing() {
  console.log('Example 12: Batch Processing Function')

  const batchFn = await $.functions.deploy(
    'process-batch',
    async (event) => {
      const { items } = event

      const results = []
      for (const item of items) {
        // Process each item
        results.push({
          id: item.id,
          status: 'processed',
          timestamp: Date.now(),
        })
      }

      return {
        total: items.length,
        processed: results.length,
        results,
      }
    },
    {
      timeout: 60000, // 1 minute for batch processing
      memory: 512, // More memory for batch operations
    }
  )

  // Execute batch processing
  const result = await batchFn.execute({
    items: [
      { id: 1, data: 'item1' },
      { id: 2, data: 'item2' },
      { id: 3, data: 'item3' },
    ],
  })

  console.log('Batch processing complete:', result)
}

// ============================================================================
// Example 13: TypeScript Type Safety
// ============================================================================

// Define types for your function inputs and outputs
interface PaymentInput {
  amount: number
  currency: string
  customerId: string
}

interface PaymentResult {
  success: boolean
  transactionId: string
  amount: number
  currency: string
  customerId: string
}

async function example13_typeSafety() {
  console.log('Example 13: TypeScript Type Safety')

  // Execute with type safety
  const result = await $.functions.execute<PaymentResult>('process-payment', {
    amount: 1000,
    currency: 'usd',
    customerId: 'cus_789',
  } as PaymentInput)

  // TypeScript knows the shape of result
  console.log(`Transaction ${result.transactionId} processed for ${result.amount} ${result.currency}`)
}

// ============================================================================
// Example 14: Error Handling and Retries
// ============================================================================

async function example14_errorHandling() {
  console.log('Example 14: Error Handling and Retries')

  const unreliableFn = await $.functions.deploy(
    'unreliable-api',
    async (event) => {
      // Simulate random failures
      if (Math.random() < 0.3) {
        throw new Error('API temporarily unavailable')
      }

      return {
        success: true,
        data: 'API response',
      }
    },
    {
      timeout: 5000,
    }
  )

  // Execute with retry logic
  let attempts = 0
  const maxAttempts = 3

  while (attempts < maxAttempts) {
    try {
      const result = await unreliableFn.execute({})
      console.log('Success on attempt', attempts + 1, result)
      break
    } catch (error) {
      attempts++
      if (attempts >= maxAttempts) {
        console.error('Failed after', maxAttempts, 'attempts:', error)
        throw error
      }
      console.log('Attempt', attempts, 'failed, retrying...')
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts))
    }
  }
}

// ============================================================================
// Example 15: Cleanup Resources
// ============================================================================

async function example15_cleanup() {
  console.log('Example 15: Cleanup Resources')

  // List all functions
  const functions = await $.functions.list()

  // Delete old or unused functions
  for (const fn of functions) {
    const created = new Date(fn.createdAt)
    const ageInDays = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)

    if (ageInDays > 30 && !fn.lastExecuted) {
      console.log(`Deleting unused function: ${fn.name}`)
      await $.functions.delete(fn.name)
    }
  }

  console.log('Cleanup complete!')
}

// ============================================================================
// Run Examples
// ============================================================================

async function runExamples() {
  try {
    console.log('='.repeat(80))
    console.log('Functions Service Examples')
    console.log('='.repeat(80))

    // Run examples sequentially
    await example1_defineAndDeploy()
    console.log()

    await example2_executeFunction()
    console.log()

    await example3_executeViaInstance()
    console.log()

    await example4_scheduleFunction()
    console.log()

    await example5_listFunctions()
    console.log()

    await example6_listWithPagination()
    console.log()

    await example7_getFunctionMetadata()
    console.log()

    await example8_getFunctionLogs()
    console.log()

    await example9_filterLogsByDate()
    console.log()

    // Skip example10_deleteFunction to avoid deleting in demo

    await example11_complexFunction()
    console.log()

    await example12_batchProcessing()
    console.log()

    await example13_typeSafety()
    console.log()

    await example14_errorHandling()
    console.log()

    // Skip example15_cleanup to avoid deleting in demo

    console.log('='.repeat(80))
    console.log('All examples completed successfully!')
    console.log('='.repeat(80))
  } catch (error) {
    console.error('Error running examples:', error)
    process.exit(1)
  }
}

// Only run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples()
}
