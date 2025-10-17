import { Hero } from '@/components/Hero'
import { ScrollyLayout, Selectable } from '@/components/ScrollyCode'
import { CodePlayground } from '@/components/CodePlayground'

const examples = [
  {
    title: 'Define Function',
    code: `import { defineFunction } from '@dotdo/sdk.do'

// Define a serverless function
export const processPayment = defineFunction({
  name: 'process-payment',
  description: 'Process payment and create order',

  // Define input schema
  input: {
    customerId: 'string',
    amount: 'number',
    currency: 'string',
    items: 'array'
  },

  // Define output schema
  output: {
    orderId: 'string',
    status: 'string',
    total: 'number'
  },

  // Function implementation
  handler: async ({ input, $ }) => {
    // Charge customer
    const charge = await $.actions.stripe.charge({
      customerId: input.customerId,
      amount: input.amount,
      currency: input.currency
    })

    // Create order
    const order = await $.db.create('orders', {
      customerId: input.customerId,
      total: input.amount,
      items: input.items,
      status: 'paid',
      chargeId: charge.id
    })

    // Send confirmation
    await $.send('Order.created', { orderId: order.id })

    return {
      orderId: order.id,
      status: 'success',
      total: input.amount
    }
  }
})`,
  },
  {
    title: 'Deploy Function',
    code: `import { $ } from '@dotdo/sdk.do'
import { processPayment } from './functions/processPayment'

// Deploy function
const deployment = await $.functions.deploy(processPayment)

console.log({
  functionId: deployment.id,
  url: deployment.url,
  version: deployment.version,
  status: deployment.status
})

// Deployed to:
// https://functions.your-domain.com/process-payment

// Update existing function
const update = await $.functions.update(processPayment, {
  version: '1.0.1',
  description: 'Updated payment processing logic'
})

// Rollback to previous version
await $.functions.rollback(processPayment.name, {
  version: '1.0.0'
})`,
  },
  {
    title: 'Execute Function',
    code: `import { $ } from '@dotdo/sdk.do'

// Execute deployed function
const result = await $.functions.execute('process-payment', {
  customerId: 'cus_123',
  amount: 4999,
  currency: 'usd',
  items: [
    { productId: 'prod_456', quantity: 2, price: 2499 }
  ]
})

console.log({
  orderId: result.orderId,
  status: result.status,
  total: result.total
})

// Execute with timeout
const resultWithTimeout = await $.functions.execute('process-payment', input, {
  timeout: 30000 // 30 seconds
})

// Execute asynchronously
const executionId = await $.functions.executeAsync('process-payment', input)

// Check execution status
const execution = await $.functions.getExecution(executionId)
console.log(execution.status) // pending | running | completed | failed`,
  },
  {
    title: 'Scheduled Functions',
    code: `import { defineFunction } from '@dotdo/sdk.do'

// Function that runs on a schedule
export const dailyReport = defineFunction({
  name: 'daily-report',
  description: 'Generate daily sales report',

  // Run every day at 9 AM
  schedule: '0 9 * * *',

  handler: async ({ $ }) => {
    // Get yesterday's orders
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const orders = await $.db.list('orders', {
      where: {
        createdAt: {
          $gte: yesterday.setHours(0, 0, 0, 0),
          $lt: yesterday.setHours(23, 59, 59, 999)
        },
        status: 'completed'
      }
    })

    // Generate report with AI
    const report = await $.ai.generate({
      model: 'gpt-5',
      prompt: \`Generate sales report for \${orders.length} orders\`,
      schema: {
        summary: 'string',
        revenue: 'number',
        topProducts: 'array'
      }
    })

    // Send report to team
    await $.actions.email.send({
      to: 'team@example.com',
      subject: 'Daily Sales Report',
      body: report.data.summary
    })

    return report.data
  }
})

// Cron expressions supported:
// '*/5 * * * *' - Every 5 minutes
// '0 * * * *' - Every hour
// '0 0 * * 0' - Every Sunday at midnight`,
  },
  {
    title: 'Function Logs',
    code: `import { $ } from '@dotdo/sdk.do'

// Get function logs
const logs = await $.functions.logs('process-payment', {
  limit: 100,
  since: '2025-10-10T00:00:00Z',
  level: 'error' // all | info | warn | error
})

logs.forEach(log => {
  console.log({
    timestamp: log.timestamp,
    level: log.level,
    message: log.message,
    executionId: log.executionId,
    duration: log.duration
  })
})

// Stream logs in real-time
const stream = $.functions.streamLogs('process-payment')

for await (const log of stream) {
  console.log(\`[\${log.timestamp}] \${log.level}: \${log.message}\`)
}

// Log from inside function
defineFunction({
  name: 'my-function',
  handler: async ({ $, log }) => {
    log.info('Processing started')
    log.warn('High memory usage detected')
    log.error('Payment failed', { error: 'CARD_DECLINED' })

    return { success: true }
  }
})`,
  },
  {
    title: 'Function Metrics',
    code: `import { $ } from '@dotdo/sdk.do'

// Get function metrics
const metrics = await $.functions.metrics('process-payment', {
  period: '7d',
  interval: '1h'
})

console.log({
  executions: metrics.totalExecutions,
  successRate: metrics.successRate,
  avgDuration: metrics.avgDuration,
  p95Duration: metrics.p95Duration,
  p99Duration: metrics.p99Duration,
  errorRate: metrics.errorRate,
  errors: metrics.errors
})

// Get real-time metrics
const realtimeMetrics = await $.functions.realtimeMetrics('process-payment')

console.log({
  activeExecutions: realtimeMetrics.active,
  queuedExecutions: realtimeMetrics.queued,
  requestsPerSecond: realtimeMetrics.rps,
  avgLatency: realtimeMetrics.latency
})

// Set up alerts
await $.functions.alert('process-payment', {
  metric: 'errorRate',
  threshold: 5, // 5%
  action: async (alert) => {
    await $.actions.notify.team({
      message: \`Error rate exceeded: \${alert.value}%\`,
      severity: 'high'
    })
  }
})`,
  },
  {
    title: 'Function Composition',
    code: `import { defineFunction } from '@dotdo/sdk.do'

// Composable functions
export const validateOrder = defineFunction({
  name: 'validate-order',
  input: { items: 'array' },
  output: { valid: 'boolean', errors: 'array' },
  handler: async ({ input }) => {
    // Validation logic
    const errors = []
    if (!input.items.length) {
      errors.push('No items in order')
    }
    return { valid: errors.length === 0, errors }
  }
})

export const calculateShipping = defineFunction({
  name: 'calculate-shipping',
  input: { items: 'array', address: 'object' },
  output: { cost: 'number', estimatedDays: 'number' },
  handler: async ({ input }) => {
    // Calculate shipping
    return { cost: 1299, estimatedDays: 3 }
  }
})

export const processOrder = defineFunction({
  name: 'process-order',
  handler: async ({ input, $ }) => {
    // Call other functions
    const validation = await $.functions.execute('validate-order', {
      items: input.items
    })

    if (!validation.valid) {
      throw new Error('Invalid order: ' + validation.errors.join(', '))
    }

    const shipping = await $.functions.execute('calculate-shipping', {
      items: input.items,
      address: input.shippingAddress
    })

    // Create order with shipping
    return await $.db.create('orders', {
      ...input,
      shippingCost: shipping.cost,
      estimatedDelivery: shipping.estimatedDays
    })
  }
})`,
  },
  {
    title: 'Advanced Configuration',
    code: `import { defineFunction } from '@dotdo/sdk.do'

export const advancedFunction = defineFunction({
  name: 'advanced-function',
  description: 'Function with advanced configuration',

  // Runtime configuration
  runtime: {
    memory: 512, // MB
    timeout: 60000, // 60 seconds
    concurrency: 10, // Max concurrent executions
    retries: 3,
    environment: {
      NODE_ENV: 'production',
      LOG_LEVEL: 'info'
    }
  },

  // Rate limiting
  rateLimit: {
    maxRequests: 100,
    windowMs: 60000 // 100 requests per minute
  },

  // Authentication
  auth: {
    required: true,
    scopes: ['read:data', 'write:data']
  },

  // Input validation
  input: {
    email: { type: 'string', format: 'email', required: true },
    age: { type: 'number', min: 0, max: 120 },
    role: { type: 'string', enum: ['admin', 'user', 'guest'] }
  },

  handler: async ({ input, $, user, log }) => {
    log.info('User:', user.id)
    log.info('Input:', input)

    // Function logic
    return { success: true }
  }
})

// Environment-specific deployment
await $.functions.deploy(advancedFunction, {
  environment: 'production',
  regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1']
})`,
  },
]

export default function FunctionsPage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="Serverless Functions"
        description="Deploy and execute serverless functions with scheduling, metrics, logs, and automatic scaling across global regions."
        packageName="@dotdo/sdk.do"
        gradient="from-yellow-500 to-orange-600"
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <ScrollyLayout
          steps={[
            <Selectable key={0} index={0}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Define Functions</h2>
                <p className="text-xl text-gray-400">Create serverless functions with typed inputs and outputs. Full SDK access included.</p>
              </div>
            </Selectable>,

            <Selectable key={1} index={1}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Deploy & Version</h2>
                <p className="text-xl text-gray-400">Deploy functions with versioning and rollback support. Zero-downtime updates guaranteed.</p>
              </div>
            </Selectable>,

            <Selectable key={2} index={2}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Execute Functions</h2>
                <p className="text-xl text-gray-400">Run functions synchronously or asynchronously. Timeouts and status tracking included.</p>
              </div>
            </Selectable>,

            <Selectable key={3} index={3}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Scheduled Execution</h2>
                <p className="text-xl text-gray-400">Run functions on a cron schedule. Perfect for reports, cleanup, and batch processing.</p>
              </div>
            </Selectable>,

            <Selectable key={4} index={4}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Comprehensive Logs</h2>
                <p className="text-xl text-gray-400">Query and stream function logs in real-time. Filter by level and execution ID.</p>
              </div>
            </Selectable>,

            <Selectable key={5} index={5}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Performance Metrics</h2>
                <p className="text-xl text-gray-400">Track executions, latency, success rates, and errors. Set up alerts for anomalies.</p>
              </div>
            </Selectable>,

            <Selectable key={6} index={6}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Function Composition</h2>
                <p className="text-xl text-gray-400">Call functions from other functions. Build complex workflows from simple building blocks.</p>
              </div>
            </Selectable>,

            <Selectable key={7} index={7}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Advanced Configuration</h2>
                <p className="text-xl text-gray-400">Configure memory, timeouts, concurrency, rate limits, and authentication per function.</p>
              </div>
            </Selectable>,
          ]}
          code={
            <div className="sticky top-24 h-[600px]">
              <CodePlayground examples={examples} />
            </div>
          }
        />
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-800">
        <h2 className="text-4xl font-bold text-center mb-16">Function Capabilities</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="Global Deployment" description="Deploy functions to regions worldwide. Automatic routing to nearest location." />
          <FeatureCard title="Automatic Scaling" description="Scale from zero to millions of requests. Pay only for what you use." />
          <FeatureCard title="Built-In Monitoring" description="Logs, metrics, and alerts included. No external tools required." />
          <FeatureCard title="Type Safety" description="Input and output schemas validated at runtime. TypeScript types generated automatically." />
          <FeatureCard title="Cron Scheduling" description="Run functions on any schedule with cron expressions." />
          <FeatureCard title="Zero Cold Starts" description="Functions run on Cloudflare Workers. Sub-millisecond cold starts globally." />
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg border border-gray-800">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
