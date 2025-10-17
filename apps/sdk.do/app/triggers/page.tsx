import { Hero } from '@/components/Hero'
import { ScrollyLayout, Selectable } from '@/components/ScrollyCode'
import { CodePlayground } from '@/components/CodePlayground'

const examples = [
  {
    title: 'Basic Trigger',
    code: `import { defineTrigger } from '@dotdo/sdk.do'

// Define a trigger that responds to events
export const orderCreatedTrigger = defineTrigger({
  name: 'order-created-notification',
  description: 'Send notification when order is created',

  // Event pattern to watch for
  on: 'Order.created',

  // Action to execute
  action: async ({ event, $ }) => {
    const order = event.data

    // Send confirmation email
    await $.actions.email.send({
      to: order.customerEmail,
      subject: \`Order Confirmation #\${order.id}\`,
      template: 'order-confirmation',
      data: order
    })

    // Create notification
    await $.db.create('notifications', {
      userId: order.customerId,
      type: 'order_created',
      message: \`Your order #\${order.id} has been received\`,
      read: false
    })

    // Send webhook to fulfillment system
    await $.actions.webhook.post({
      url: 'https://fulfillment.example.com/orders',
      body: order
    })
  }
})`,
  },
  {
    title: 'Conditional Triggers',
    code: `import { defineTrigger } from '@dotdo/sdk.do'

// Trigger only for high-value orders
export const highValueOrderTrigger = defineTrigger({
  name: 'high-value-order-alert',
  on: 'Order.created',

  // Condition to evaluate
  condition: async ({ event, $ }) => {
    // Only trigger if order total > $1000
    return event.data.total > 100000 // cents
  },

  action: async ({ event, $ }) => {
    // Alert sales team
    await $.actions.notify.team({
      channel: 'sales',
      message: \`High-value order: $\${event.data.total / 100}\`,
      priority: 'high',
      data: {
        orderId: event.data.id,
        customerId: event.data.customerId,
        total: event.data.total
      }
    })

    // Create approval request
    await $.db.create('approvals', {
      type: 'high-value-order',
      orderId: event.data.id,
      requiredBy: 'sales-manager',
      status: 'pending'
    })
  }
})

// Trigger only for first-time customers
export const firstTimeCustomerTrigger = defineTrigger({
  name: 'first-time-customer-welcome',
  on: 'Order.created',

  condition: async ({ event, $ }) => {
    // Check if this is customer's first order
    const orderCount = await $.db.count('orders', {
      where: { customerId: event.data.customerId }
    })
    return orderCount === 1
  },

  action: async ({ event, $ }) => {
    // Send welcome email with discount code
    await $.actions.email.send({
      to: event.data.customerEmail,
      template: 'first-time-customer',
      data: {
        customerName: event.data.customerName,
        discountCode: 'WELCOME20'
      }
    })
  }
})`,
  },
  {
    title: 'Multiple Event Patterns',
    code: `import { defineTrigger } from '@dotdo/sdk.do'

// Trigger on multiple event types
export const orderStatusTrigger = defineTrigger({
  name: 'order-status-updates',
  description: 'Track all order status changes',

  // Watch for multiple events with wildcard
  on: 'Order.*',

  action: async ({ event, $ }) => {
    // Log all order events
    await $.db.create('order_timeline', {
      orderId: event.data.orderId,
      eventType: event.type,
      timestamp: new Date(),
      data: event.data
    })

    // Send notification based on event type
    if (event.type === 'Order.shipped') {
      await $.actions.email.send({
        to: event.data.customerEmail,
        subject: 'Your order has shipped!',
        template: 'order-shipped',
        data: event.data
      })
    } else if (event.type === 'Order.delivered') {
      await $.actions.email.send({
        to: event.data.customerEmail,
        subject: 'Your order has been delivered',
        template: 'order-delivered',
        data: event.data
      })
    } else if (event.type === 'Order.cancelled') {
      await $.actions.refund.process({
        orderId: event.data.orderId
      })
    }
  }
})

// Trigger on multiple specific events
export const inventoryTrigger = defineTrigger({
  name: 'inventory-management',
  on: ['Order.created', 'Order.cancelled', 'Product.restocked'],

  action: async ({ event, $ }) => {
    if (event.type === 'Order.created') {
      // Decrease inventory
      for (const item of event.data.items) {
        await $.db.update('products', item.productId, {
          stock: { $decrement: item.quantity }
        })
      }
    } else if (event.type === 'Order.cancelled') {
      // Restore inventory
      for (const item of event.data.items) {
        await $.db.update('products', item.productId, {
          stock: { $increment: item.quantity }
        })
      }
    } else if (event.type === 'Product.restocked') {
      // Check for waitlist customers
      const waitlist = await $.db.list('product_waitlist', {
        where: { productId: event.data.productId }
      })

      for (const customer of waitlist) {
        await $.actions.email.send({
          to: customer.email,
          subject: 'Product back in stock!',
          template: 'restock-notification',
          data: event.data
        })
      }
    }
  }
})`,
  },
  {
    title: 'Scheduled Triggers',
    code: `import { defineTrigger } from '@dotdo/sdk.do'

// Trigger on a cron schedule
export const dailyReportTrigger = defineTrigger({
  name: 'daily-sales-report',
  description: 'Generate daily sales report',

  // Run every day at 9 AM
  schedule: '0 9 * * *',

  action: async ({ $ }) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    // Get yesterday's orders
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
        topProducts: 'array',
        insights: 'array'
      }
    })

    // Send to team
    await $.actions.email.send({
      to: 'team@example.com',
      subject: 'Daily Sales Report',
      body: report.data.summary
    })
  }
})

// Hourly inventory check
export const inventoryCheckTrigger = defineTrigger({
  name: 'low-stock-alert',
  schedule: '0 * * * *', // Every hour

  action: async ({ $ }) => {
    // Find low-stock products
    const lowStock = await $.db.list('products', {
      where: {
        stock: { $lt: 10 },
        active: true
      }
    })

    if (lowStock.length > 0) {
      await $.actions.notify.team({
        channel: 'inventory',
        message: \`\${lowStock.length} products are running low on stock\`,
        data: lowStock.map(p => ({
          id: p.id,
          name: p.name,
          stock: p.stock
        }))
      })
    }
  }
})`,
  },
  {
    title: 'Priority & Ordering',
    code: `import { defineTrigger } from '@dotdo/sdk.do'

// Triggers execute in priority order
export const highPriorityTrigger = defineTrigger({
  name: 'fraud-detection',
  on: 'Order.created',

  // Execute first (lower number = higher priority)
  priority: 1,

  action: async ({ event, $ }) => {
    // Run fraud detection
    const fraudScore = await $.ai.generate({
      model: 'gpt-5-mini',
      prompt: \`Analyze this order for fraud: \${JSON.stringify(event.data)}\`,
      schema: {
        score: 'number',
        reason: 'string',
        flagged: 'boolean'
      }
    })

    if (fraudScore.data.flagged) {
      // Flag order for review
      await $.db.update('orders', event.data.id, {
        status: 'review',
        metadata: {
          fraudScore: fraudScore.data.score,
          flagReason: fraudScore.data.reason
        }
      })

      // Stop processing other triggers
      throw new Error('Order flagged for fraud review')
    }
  }
})

export const normalPriorityTrigger = defineTrigger({
  name: 'order-processing',
  on: 'Order.created',

  // Execute after fraud detection
  priority: 10,

  action: async ({ event, $ }) => {
    // Process order normally
    await $.actions.execute('process-order', {
      orderId: event.data.id
    })
  }
})

export const lowPriorityTrigger = defineTrigger({
  name: 'analytics-tracking',
  on: 'Order.created',

  // Execute last
  priority: 100,

  action: async ({ event, $ }) => {
    // Track analytics (not critical)
    await $.actions.analytics.track('order_created', event.data)
  }
})`,
  },
  {
    title: 'Trigger Composition',
    code: `import { defineTrigger } from '@dotdo/sdk.do'

// Compose triggers with actions
export const orderWorkflowTrigger = defineTrigger({
  name: 'order-workflow',
  on: 'Order.created',

  action: async ({ event, $ }) => {
    const order = event.data

    // Execute workflow
    await $.workflows.execute('process-order', {
      orderId: order.id
    })
  }
})

// Trigger that spawns an agent
export const customerInquiryTrigger = defineTrigger({
  name: 'customer-inquiry-agent',
  on: 'Inquiry.created',

  action: async ({ event, $ }) => {
    // Spawn agent to handle inquiry
    await $.agents.execute('customer-support', {
      message: event.data.message,
      userId: event.data.userId,
      context: {
        inquiryId: event.data.id,
        category: event.data.category
      }
    })
  }
})

// Chain triggers with events
export const cascadingTrigger = defineTrigger({
  name: 'order-fulfillment-cascade',
  on: 'Order.paid',

  action: async ({ event, $ }) => {
    // Process payment confirmation
    await $.db.update('orders', event.data.orderId, {
      paymentStatus: 'confirmed'
    })

    // Emit new event that other triggers can watch
    await $.send('Order.ready-to-ship', {
      orderId: event.data.orderId,
      warehouse: event.data.warehouse
    })
  }
})

// Subsequent trigger
export const shippingTrigger = defineTrigger({
  name: 'create-shipping-label',
  on: 'Order.ready-to-ship',

  action: async ({ event, $ }) => {
    await $.actions.shipping.createLabel({
      orderId: event.data.orderId,
      warehouse: event.data.warehouse
    })
  }
})`,
  },
  {
    title: 'Execution History',
    code: `import { $ } from '@dotdo/sdk.do'

// Get trigger execution history
const executions = await $.triggers.history('order-created-notification', {
  limit: 100,
  since: '2025-10-10T00:00:00Z',
  status: 'success' // all | success | failed | skipped
})

executions.forEach(exec => {
  console.log({
    timestamp: exec.timestamp,
    eventType: exec.event.type,
    eventData: exec.event.data,
    success: exec.success,
    duration: exec.duration,
    error: exec.error
  })
})

// Get trigger metrics
const metrics = await $.triggers.metrics('order-created-notification', {
  period: '7d'
})

console.log({
  totalExecutions: metrics.executions,
  successRate: metrics.successRate,
  avgDuration: metrics.avgDuration,
  errorRate: metrics.errorRate,
  skippedRate: metrics.skippedRate
})

// List all triggers
const triggers = await $.triggers.list()

triggers.forEach(trigger => {
  console.log({
    name: trigger.name,
    description: trigger.description,
    pattern: trigger.on,
    schedule: trigger.schedule,
    priority: trigger.priority,
    enabled: trigger.enabled,
    executionCount: trigger.executionCount
  })
})`,
  },
  {
    title: 'Advanced Configuration',
    code: `import { defineTrigger } from '@dotdo/sdk.do'

export const advancedTrigger = defineTrigger({
  name: 'advanced-trigger',
  description: 'Trigger with advanced configuration',

  // Event pattern
  on: 'Order.*',

  // Conditions
  condition: async ({ event, $ }) => {
    return event.data.total > 10000
  },

  // Priority
  priority: 5,

  // Rate limiting
  rateLimit: {
    maxExecutions: 100,
    windowMs: 60000 // 100 executions per minute
  },

  // Deduplication
  deduplicate: {
    enabled: true,
    key: (event) => \`order-\${event.data.orderId}\`,
    windowMs: 300000 // 5 minutes
  },

  // Retry configuration
  retry: {
    maxAttempts: 3,
    backoff: 'exponential',
    initialDelay: 1000
  },

  // Timeout
  timeout: 30000, // 30 seconds

  // Idempotency
  idempotent: true,

  action: async ({ event, $, log }) => {
    log.info('Trigger executing', { eventType: event.type })

    // Action implementation
    await $.actions.execute('process-event', event.data)

    log.info('Trigger completed')
  }
})

// Enable/disable triggers programmatically
await $.triggers.enable('advanced-trigger')
await $.triggers.disable('advanced-trigger')

// Update trigger configuration
await $.triggers.update('advanced-trigger', {
  priority: 10,
  rateLimit: {
    maxExecutions: 200,
    windowMs: 60000
  }
})

// Delete trigger
await $.triggers.delete('advanced-trigger')`,
  },
]

export default function TriggersPage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="Event Triggers"
        description="Automate workflows with event-driven triggers. Watch for patterns, evaluate conditions, and execute actions automatically."
        packageName="@dotdo/sdk.do"
        gradient="from-lime-500 to-green-600"
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <ScrollyLayout
          steps={[
            <Selectable key={0} index={0}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Event-Driven Automation</h2>
                <p className="text-xl text-gray-400">Define triggers that watch for events and execute actions automatically. Full SDK access included.</p>
              </div>
            </Selectable>,

            <Selectable key={1} index={1}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Conditional Execution</h2>
                <p className="text-xl text-gray-400">
                  Evaluate conditions before executing actions. Perfect for high-value transactions and specific scenarios.
                </p>
              </div>
            </Selectable>,

            <Selectable key={2} index={2}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Pattern Matching</h2>
                <p className="text-xl text-gray-400">Watch multiple events with wildcards and arrays. Handle entire event families with one trigger.</p>
              </div>
            </Selectable>,

            <Selectable key={3} index={3}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Scheduled Triggers</h2>
                <p className="text-xl text-gray-400">Run triggers on cron schedules. Perfect for reports, cleanup, and periodic checks.</p>
              </div>
            </Selectable>,

            <Selectable key={4} index={4}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Priority Control</h2>
                <p className="text-xl text-gray-400">Control execution order with priorities. Critical triggers like fraud detection run first.</p>
              </div>
            </Selectable>,

            <Selectable key={5} index={5}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Composable Actions</h2>
                <p className="text-xl text-gray-400">Trigger workflows, agents, and actions. Chain triggers with events for complex automation.</p>
              </div>
            </Selectable>,

            <Selectable key={6} index={6}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Complete Observability</h2>
                <p className="text-xl text-gray-400">Track execution history, success rates, and performance. Monitor trigger health in real-time.</p>
              </div>
            </Selectable>,

            <Selectable key={7} index={7}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Advanced Controls</h2>
                <p className="text-xl text-gray-400">Rate limiting, deduplication, retries, timeouts, and idempotency all configurable per trigger.</p>
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
        <h2 className="text-4xl font-bold text-center mb-16">Trigger Capabilities</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="Event Pattern Matching" description="Wildcards, arrays, and semantic patterns. Match events flexibly with full type safety." />
          <FeatureCard title="Conditional Logic" description="Evaluate conditions before executing. Access database and context for decisions." />
          <FeatureCard title="Priority Ordering" description="Control execution order with priority values. Critical triggers run first automatically." />
          <FeatureCard title="Rate Limiting" description="Limit executions per time window. Prevent runaway triggers and control costs." />
          <FeatureCard title="Deduplication" description="Prevent duplicate executions with custom keys. Configurable time windows." />
          <FeatureCard title="Automatic Retries" description="Retry failed executions with exponential backoff. Max attempts configurable." />
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
