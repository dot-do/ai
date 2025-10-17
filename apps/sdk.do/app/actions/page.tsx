import { Hero } from '@/components/Hero'
import { ScrollyLayout, Selectable } from '@/components/ScrollyCode'
import { CodePlayground } from '@/components/CodePlayground'

const examples = [
  {
    title: 'Define Action',
    code: `import { defineAction } from '@dotdo/sdk.do'

// Define a reusable action
export const sendEmailAction = defineAction({
  name: 'send-email',
  description: 'Send an email to a user',

  // Input schema
  input: {
    to: { type: 'string', format: 'email', required: true },
    subject: { type: 'string', required: true },
    body: { type: 'string', required: true },
    template: { type: 'string', optional: true },
    data: { type: 'object', optional: true }
  },

  // Output schema
  output: {
    messageId: 'string',
    status: 'string'
  },

  // Action implementation
  handler: async ({ input, $ }) => {
    // If template provided, render it
    let body = input.body
    if (input.template) {
      body = await $.actions.templates.render(input.template, input.data)
    }

    // Send email
    const result = await $.actions.email.send({
      to: input.to,
      subject: input.subject,
      body
    })

    // Log the action
    await $.db.create('email_logs', {
      to: input.to,
      subject: input.subject,
      messageId: result.messageId,
      timestamp: new Date()
    })

    return {
      messageId: result.messageId,
      status: 'sent'
    }
  }
})

// Use the action
await $.actions.execute('send-email', {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Welcome to our platform!'
})`,
  },
  {
    title: 'Action Composition',
    code: `import { defineAction } from '@dotdo/sdk.do'

// Define atomic actions
export const validateInput = defineAction({
  name: 'validate-input',
  input: { data: 'object', rules: 'object' },
  output: { valid: 'boolean', errors: 'array' },
  handler: async ({ input }) => {
    // Validation logic
    const errors = []
    for (const [field, rule] of Object.entries(input.rules)) {
      if (rule.required && !input.data[field]) {
        errors.push(\`\${field} is required\`)
      }
    }
    return { valid: errors.length === 0, errors }
  }
})

export const transformData = defineAction({
  name: 'transform-data',
  input: { data: 'object', transforms: 'array' },
  output: { data: 'object' },
  handler: async ({ input }) => {
    let data = { ...input.data }
    for (const transform of input.transforms) {
      data = transform(data)
    }
    return { data }
  }
})

export const saveData = defineAction({
  name: 'save-data',
  input: { collection: 'string', data: 'object' },
  output: { id: 'string' },
  handler: async ({ input, $ }) => {
    const result = await $.db.create(input.collection, input.data)
    return { id: result.id }
  }
})

// Compose actions into a pipeline
export const processAndSave = defineAction({
  name: 'process-and-save',
  input: { data: 'object', collection: 'string' },
  output: { id: 'string', success: 'boolean' },
  handler: async ({ input, $ }) => {
    // 1. Validate
    const validation = await $.actions.execute('validate-input', {
      data: input.data,
      rules: { name: { required: true } }
    })

    if (!validation.valid) {
      throw new Error(\`Validation failed: \${validation.errors.join(', ')}\`)
    }

    // 2. Transform
    const transformed = await $.actions.execute('transform-data', {
      data: input.data,
      transforms: [(d) => ({ ...d, processed: true })]
    })

    // 3. Save
    const saved = await $.actions.execute('save-data', {
      collection: input.collection,
      data: transformed.data
    })

    return { id: saved.id, success: true }
  }
})`,
  },
  {
    title: 'Parallel Execution',
    code: `import { defineAction } from '@dotdo/sdk.do'

export const enrichUserData = defineAction({
  name: 'enrich-user-data',
  input: { userId: 'string' },
  output: { userData: 'object' },

  handler: async ({ input, $ }) => {
    // Execute multiple actions in parallel
    const [analytics, social, credit, preferences] = await Promise.all([
      $.actions.execute('fetch-analytics', { userId: input.userId }),
      $.actions.execute('fetch-social-profiles', { userId: input.userId }),
      $.actions.execute('fetch-credit-score', { userId: input.userId }),
      $.actions.execute('fetch-preferences', { userId: input.userId })
    ])

    // Combine results
    return {
      userData: {
        ...analytics,
        ...social,
        ...credit,
        ...preferences
      }
    }
  }
})

// Batch execute actions
const results = await $.actions.batch([
  { action: 'send-email', input: { to: 'user1@example.com', subject: 'Hi', body: 'Hello' } },
  { action: 'send-email', input: { to: 'user2@example.com', subject: 'Hi', body: 'Hello' } },
  { action: 'send-email', input: { to: 'user3@example.com', subject: 'Hi', body: 'Hello' } }
])

console.log(\`Sent \${results.filter(r => r.success).length} emails\`)`,
  },
  {
    title: 'Conditional Actions',
    code: `import { defineAction } from '@dotdo/sdk.do'

export const processOrder = defineAction({
  name: 'process-order',
  input: { orderId: 'string' },
  output: { status: 'string' },

  handler: async ({ input, $ }) => {
    // Get order
    const order = await $.db.get('orders', input.orderId)

    // Conditional execution based on order value
    if (order.total > 100000) {
      // High-value orders require approval
      await $.actions.execute('notify-management', {
        message: \`High-value order: $\${order.total / 100}\`,
        orderId: order.id
      })

      await $.actions.execute('create-approval-request', {
        orderId: order.id,
        reason: 'high-value'
      })

      return { status: 'pending-approval' }
    }

    // Check if rush shipping requested
    if (order.metadata?.rushShipping) {
      await $.actions.execute('priority-shipping', {
        orderId: order.id
      })
    } else {
      await $.actions.execute('standard-shipping', {
        orderId: order.id
      })
    }

    // Check if first-time customer
    const customerOrders = await $.db.count('orders', {
      where: { customerId: order.customerId }
    })

    if (customerOrders === 1) {
      await $.actions.execute('send-welcome-email', {
        customerId: order.customerId
      })
    }

    return { status: 'processed' }
  }
})`,
  },
  {
    title: 'Error Handling',
    code: `import { defineAction } from '@dotdo/sdk.do'

export const resilientAction = defineAction({
  name: 'resilient-action',
  input: { data: 'object' },
  output: { success: 'boolean', result: 'object' },

  // Retry configuration
  retry: {
    maxAttempts: 3,
    backoff: 'exponential',
    initialDelay: 1000,
    maxDelay: 30000,
    retryOn: ['NETWORK_ERROR', 'TIMEOUT']
  },

  // Timeout
  timeout: 30000, // 30 seconds

  handler: async ({ input, $ }) => {
    try {
      // Risky operation
      const result = await $.actions.external.call(input.data)
      return { success: true, result }

    } catch (error) {
      // Log error
      await $.db.create('action_errors', {
        action: 'resilient-action',
        error: error.message,
        input: input.data,
        timestamp: new Date()
      })

      // Try fallback
      if (error.code === 'SERVICE_UNAVAILABLE') {
        const fallback = await $.actions.execute('fallback-action', input)
        return { success: true, result: fallback }
      }

      // Alert team
      await $.actions.execute('notify-team', {
        message: \`Action failed: \${error.message}\`,
        severity: 'high'
      })

      throw error // Re-throw if no fallback
    }
  }
})`,
  },
  {
    title: 'Action Metrics',
    code: `import { $ } from '@dotdo/sdk.do'

// Get action execution history
const executions = await $.actions.history('send-email', {
  limit: 100,
  since: '2025-10-10T00:00:00Z',
  status: 'success' // all | success | failed
})

executions.forEach(exec => {
  console.log({
    timestamp: exec.timestamp,
    input: exec.input,
    output: exec.output,
    duration: exec.duration,
    status: exec.status
  })
})

// Get action metrics
const metrics = await $.actions.metrics('send-email', {
  period: '7d'
})

console.log({
  totalExecutions: metrics.executions,
  successRate: metrics.successRate,
  avgDuration: metrics.avgDuration,
  p95Duration: metrics.p95Duration,
  errorRate: metrics.errorRate,
  errors: metrics.errors
})

// List all actions
const actions = await $.actions.list()

actions.forEach(action => {
  console.log({
    name: action.name,
    description: action.description,
    executionCount: action.executionCount,
    lastExecuted: action.lastExecuted
  })
})`,
  },
  {
    title: 'Scheduled Actions',
    code: `import { defineAction } from '@dotdo/sdk.do'

// Define action that runs on schedule
export const dailyCleanup = defineAction({
  name: 'daily-cleanup',
  description: 'Clean up expired data daily',

  // Run every day at 2 AM
  schedule: '0 2 * * *',

  handler: async ({ $ }) => {
    // Delete expired sessions
    const expiredSessions = await $.db.list('sessions', {
      where: {
        expiresAt: { $lt: new Date() }
      }
    })

    await $.db.batchDelete('sessions',
      expiredSessions.map(s => s.id)
    )

    // Archive old orders
    const oldOrders = await $.db.list('orders', {
      where: {
        createdAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
      }
    })

    for (const order of oldOrders) {
      await $.db.create('archived_orders', order)
      await $.db.delete('orders', order.id)
    }

    return {
      sessionsDeleted: expiredSessions.length,
      ordersArchived: oldOrders.length
    }
  }
})

// Trigger action manually
await $.actions.trigger('daily-cleanup')

// Update schedule
await $.actions.updateSchedule('daily-cleanup', {
  schedule: '0 3 * * *' // Change to 3 AM
})`,
  },
  {
    title: 'Action Templates',
    code: `import { defineAction } from '@dotdo/sdk.do'

// Create action from template
const notificationAction = await $.actions.createFromTemplate('notification', {
  name: 'notify-customer',
  channels: ['email', 'sms'],
  template: 'order-update',
  priority: 'high'
})

// Common action templates
export const webhookAction = defineAction({
  name: 'webhook',
  input: {
    url: 'string',
    method: { type: 'string', enum: ['GET', 'POST', 'PUT'] },
    headers: 'object',
    body: 'object'
  },
  handler: async ({ input }) => {
    const response = await fetch(input.url, {
      method: input.method,
      headers: input.headers,
      body: JSON.stringify(input.body)
    })
    return await response.json()
  }
})

export const dataTransformAction = defineAction({
  name: 'transform',
  input: {
    data: 'object',
    mapping: 'object' // { outputField: 'inputField' }
  },
  handler: async ({ input }) => {
    const result = {}
    for (const [outputField, inputField] of Object.entries(input.mapping)) {
      result[outputField] = input.data[inputField]
    }
    return result
  }
})

export const conditionalAction = defineAction({
  name: 'conditional',
  input: {
    condition: 'boolean',
    ifTrue: 'string', // Action name
    ifFalse: 'string', // Action name
    data: 'object'
  },
  handler: async ({ input, $ }) => {
    const actionName = input.condition ? input.ifTrue : input.ifFalse
    return await $.actions.execute(actionName, input.data)
  }
})`,
  },
]

export default function ActionsPage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="Reusable Actions"
        description="Build composable actions with schemas, error handling, retries, and scheduling. Chain actions into powerful workflows."
        packageName="@dotdo/sdk.do"
        gradient="from-teal-500 to-cyan-600"
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <ScrollyLayout
          steps={[
            <Selectable key={0} index={0}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Define Reusable Actions</h2>
                <p className="text-xl text-gray-400">Create typed actions with input/output schemas. Full SDK access for implementation.</p>
              </div>
            </Selectable>,

            <Selectable key={1} index={1}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Compose Actions</h2>
                <p className="text-xl text-gray-400">
                  Build complex workflows by composing simple actions. Create pipelines with validation, transformation, and persistence.
                </p>
              </div>
            </Selectable>,

            <Selectable key={2} index={2}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Parallel Execution</h2>
                <p className="text-xl text-gray-400">Execute multiple actions simultaneously. Perfect for data enrichment and batch operations.</p>
              </div>
            </Selectable>,

            <Selectable key={3} index={3}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Conditional Logic</h2>
                <p className="text-xl text-gray-400">Execute actions based on data conditions. Build dynamic workflows that adapt to context.</p>
              </div>
            </Selectable>,

            <Selectable key={4} index={4}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Automatic Error Recovery</h2>
                <p className="text-xl text-gray-400">Configure retries, timeouts, and fallbacks. Actions handle failures gracefully.</p>
              </div>
            </Selectable>,

            <Selectable key={5} index={5}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Built-In Observability</h2>
                <p className="text-xl text-gray-400">Track execution history, success rates, and performance metrics automatically.</p>
              </div>
            </Selectable>,

            <Selectable key={6} index={6}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Scheduled Execution</h2>
                <p className="text-xl text-gray-400">Run actions on cron schedules. Perfect for cleanup tasks and recurring operations.</p>
              </div>
            </Selectable>,

            <Selectable key={7} index={7}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Action Templates</h2>
                <p className="text-xl text-gray-400">Create actions from templates. Common patterns like webhooks, transforms, and conditionals included.</p>
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
        <h2 className="text-4xl font-bold text-center mb-16">Action Capabilities</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="Type Safety" description="Input and output schemas validated at runtime. TypeScript types generated automatically." />
          <FeatureCard title="Composability" description="Chain actions together into complex workflows. Build pipelines from simple building blocks." />
          <FeatureCard title="Retry Logic" description="Exponential backoff, fixed delay, or custom retry strategies with max attempts." />
          <FeatureCard title="Timeout Protection" description="Set timeouts per action to prevent hanging operations. Automatic cancellation." />
          <FeatureCard title="Fallback Actions" description="Define fallback actions for error scenarios. Graceful degradation included." />
          <FeatureCard title="Execution History" description="Query past executions with filtering. Track inputs, outputs, and performance." />
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
