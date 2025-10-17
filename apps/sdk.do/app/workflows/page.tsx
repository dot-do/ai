import { Hero } from '@/components/Hero'
import { ScrollyLayout, Selectable } from '@/components/ScrollyCode'
import { CodePlayground } from '@/components/CodePlayground'

const examples = [
  {
    title: 'Basic Workflow',
    code: `import { defineWorkflow } from '@dotdo/sdk.do'

const processOrder = defineWorkflow({
  name: 'process-order',
  steps: [
    {
      id: 'validate',
      action: async (ctx) => {
        const order = await ctx.db.get('orders', ctx.input.orderId)
        if (!order) throw new Error('Order not found')
        return order
      }
    },
    {
      id: 'charge',
      action: async (ctx, order) => {
        return await ctx.actions.payment.charge({
          amount: order.total,
          customerId: order.customerId
        })
      }
    },
    {
      id: 'fulfill',
      action: async (ctx, charge) => {
        await ctx.send('Order.fulfilled', {
          orderId: ctx.input.orderId,
          chargeId: charge.id
        })
      }
    }
  ]
})

// Execute workflow
await processOrder.execute({ orderId: 'order_123' })`,
  },
  {
    title: 'Error Handling',
    code: `import { defineWorkflow } from '@dotdo/sdk.do'

const workflow = defineWorkflow({
  name: 'resilient-workflow',
  steps: [
    {
      id: 'risky-operation',
      action: async (ctx) => {
        // This might fail
        return await ctx.actions.external.call()
      },
      retry: {
        maxAttempts: 3,
        backoff: 'exponential',
        initialDelay: 1000,
        maxDelay: 30000
      },
      onError: async (ctx, error) => {
        // Log error
        await ctx.db.create('errors', {
          workflow: 'resilient-workflow',
          step: 'risky-operation',
          error: error.message,
          timestamp: new Date()
        })

        // Send alert
        await ctx.send('Workflow.error', {
          workflowId: ctx.executionId,
          error: error.message
        })

        // Decide whether to continue or stop
        if (error.code === 'RATE_LIMIT') {
          return { skipStep: true }
        }
        throw error // Re-throw to stop workflow
      }
    }
  ]
})`,
  },
  {
    title: 'Conditional Logic',
    code: `import { defineWorkflow } from '@dotdo/sdk.do'

const userOnboarding = defineWorkflow({
  name: 'user-onboarding',
  steps: [
    {
      id: 'check-eligibility',
      action: async (ctx) => {
        const user = await ctx.db.get('users', ctx.input.userId)
        return {
          isEligible: user.age >= 18,
          isPremium: user.subscription === 'premium',
          user
        }
      }
    },
    {
      id: 'premium-welcome',
      condition: (ctx, result) => result.isPremium,
      action: async (ctx, result) => {
        await ctx.actions.email.send({
          to: result.user.email,
          template: 'premium-welcome',
          data: { name: result.user.name }
        })
      }
    },
    {
      id: 'standard-welcome',
      condition: (ctx, result) => !result.isPremium && result.isEligible,
      action: async (ctx, result) => {
        await ctx.actions.email.send({
          to: result.user.email,
          template: 'standard-welcome',
          data: { name: result.user.name }
        })
      }
    }
  ]
})`,
  },
  {
    title: 'Parallel Execution',
    code: `import { defineWorkflow } from '@dotdo/sdk.do'

const dataEnrichment = defineWorkflow({
  name: 'enrich-user-data',
  steps: [
    {
      id: 'fetch-user',
      action: async (ctx) => {
        return await ctx.db.get('users', ctx.input.userId)
      }
    },
    {
      id: 'parallel-enrichment',
      action: async (ctx, user) => {
        // Execute multiple operations in parallel
        const [analytics, social, credit] = await Promise.all([
          ctx.actions.analytics.getUserData(user.id),
          ctx.actions.social.getProfiles(user.email),
          ctx.actions.credit.getScore(user.id)
        ])

        return { analytics, social, credit }
      }
    },
    {
      id: 'update-user',
      action: async (ctx, enrichment) => {
        await ctx.db.update('users', ctx.input.userId, {
          analytics: enrichment.analytics,
          socialProfiles: enrichment.social,
          creditScore: enrichment.credit.score
        })
      }
    }
  ]
})`,
  },
  {
    title: 'Sub-Workflows',
    code: `import { defineWorkflow } from '@dotdo/sdk.do'

// Sub-workflow
const sendNotification = defineWorkflow({
  name: 'send-notification',
  steps: [
    {
      id: 'get-user',
      action: async (ctx) => {
        return await ctx.db.get('users', ctx.input.userId)
      }
    },
    {
      id: 'send',
      action: async (ctx, user) => {
        await ctx.actions.email.send({
          to: user.email,
          subject: ctx.input.subject,
          body: ctx.input.body
        })
      }
    }
  ]
})

// Parent workflow
const orderWorkflow = defineWorkflow({
  name: 'process-order',
  steps: [
    {
      id: 'create-order',
      action: async (ctx) => {
        return await ctx.db.create('orders', ctx.input)
      }
    },
    {
      id: 'notify-customer',
      action: async (ctx, order) => {
        // Execute sub-workflow
        await sendNotification.execute({
          userId: order.customerId,
          subject: 'Order Confirmed',
          body: \`Your order #\${order.id} has been confirmed\`
        })
      }
    }
  ]
})`,
  },
  {
    title: 'State Management',
    code: `import { defineWorkflow } from '@dotdo/sdk.do'

const longRunningWorkflow = defineWorkflow({
  name: 'long-running-process',
  steps: [
    {
      id: 'step-1',
      action: async (ctx) => {
        // State is automatically persisted
        ctx.state.progress = 0
        ctx.state.itemsProcessed = []

        const items = await ctx.db.list('items', { limit: 1000 })
        return items
      }
    },
    {
      id: 'process-items',
      action: async (ctx, items) => {
        for (const item of items) {
          // Process item
          await ctx.actions.process(item)

          // Update state
          ctx.state.itemsProcessed.push(item.id)
          ctx.state.progress = (ctx.state.itemsProcessed.length / items.length) * 100

          // State is checkpointed every 10 items
          if (ctx.state.itemsProcessed.length % 10 === 0) {
            await ctx.checkpoint()
          }
        }
      }
    }
  ],
  // Resume from last checkpoint if workflow fails
  resumable: true
})

// Check workflow status
const execution = await longRunningWorkflow.getExecution('exec_123')
console.log(\`Progress: \${execution.state.progress}%\`)`,
  },
  {
    title: 'Scheduled Workflows',
    code: `import { defineWorkflow } from '@dotdo/sdk.do'

const dailyReport = defineWorkflow({
  name: 'daily-sales-report',
  schedule: '0 9 * * *', // Every day at 9 AM
  steps: [
    {
      id: 'fetch-sales',
      action: async (ctx) => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        return await ctx.db.list('orders', {
          where: {
            status: 'completed',
            createdAt: {
              $gte: yesterday.setHours(0, 0, 0, 0),
              $lt: yesterday.setHours(23, 59, 59, 999)
            }
          }
        })
      }
    },
    {
      id: 'generate-report',
      action: async (ctx, orders) => {
        const total = orders.reduce((sum, o) => sum + o.total, 0)

        return await ctx.ai.generate({
          model: 'gpt-5',
          prompt: \`Generate a sales report for \${orders.length} orders totaling $\${total}\`,
          schema: {
            summary: 'string',
            insights: 'string[]',
            recommendations: 'string[]'
          }
        })
      }
    },
    {
      id: 'send-report',
      action: async (ctx, report) => {
        await ctx.actions.email.send({
          to: 'team@example.com',
          subject: 'Daily Sales Report',
          body: report.data.summary
        })
      }
    }
  ]
})`,
  },
  {
    title: 'Workflow Monitoring',
    code: `import { defineWorkflow } from '@dotdo/sdk.do'

// List all workflow executions
const executions = await $.workflows.listExecutions({
  workflowName: 'process-order',
  status: 'running',
  limit: 50
})

// Get execution details
const execution = await $.workflows.getExecution('exec_123')
console.log({
  status: execution.status, // running | completed | failed | paused
  progress: execution.currentStep,
  duration: execution.duration,
  state: execution.state
})

// Pause/resume execution
await $.workflows.pause('exec_123')
await $.workflows.resume('exec_123')

// Cancel execution
await $.workflows.cancel('exec_123')

// Get workflow metrics
const metrics = await $.workflows.metrics('process-order', {
  period: '7d'
})

console.log({
  executions: metrics.totalExecutions,
  successRate: metrics.successRate,
  avgDuration: metrics.avgDuration,
  errors: metrics.errors
})`,
  },
]

export default function WorkflowsPage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="Workflows"
        description="Build multi-step business processes with retry logic, error handling, and automatic state management."
        packageName="@dotdo/sdk.do"
        gradient="from-cyan-500 to-blue-600"
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <ScrollyLayout
          steps={[
            <Selectable key={0} index={0}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Define Multi-Step Workflows</h2>
                <p className="text-xl text-gray-400">Create complex business processes with sequential steps. Each step has full access to SDK services.</p>
              </div>
            </Selectable>,

            <Selectable key={1} index={1}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Automatic Error Recovery</h2>
                <p className="text-xl text-gray-400">Configure retry logic and error handlers. Exponential backoff and custom error handling included.</p>
              </div>
            </Selectable>,

            <Selectable key={2} index={2}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Conditional Execution</h2>
                <p className="text-xl text-gray-400">Skip steps based on conditions. Build dynamic workflows that adapt to data.</p>
              </div>
            </Selectable>,

            <Selectable key={3} index={3}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Parallel Operations</h2>
                <p className="text-xl text-gray-400">Execute multiple operations simultaneously. Perfect for data enrichment and aggregation.</p>
              </div>
            </Selectable>,

            <Selectable key={4} index={4}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Composable Workflows</h2>
                <p className="text-xl text-gray-400">Call workflows from other workflows. Build reusable process components.</p>
              </div>
            </Selectable>,

            <Selectable key={5} index={5}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Persistent State</h2>
                <p className="text-xl text-gray-400">State is automatically saved and can be resumed. Long-running workflows stay reliable.</p>
              </div>
            </Selectable>,

            <Selectable key={6} index={6}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Scheduled Execution</h2>
                <p className="text-xl text-gray-400">Run workflows on a schedule. Perfect for reports, cleanup, and batch processing.</p>
              </div>
            </Selectable>,

            <Selectable key={7} index={7}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Full Observability</h2>
                <p className="text-xl text-gray-400">Monitor, pause, resume, and cancel executions. Metrics and execution history included.</p>
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
        <h2 className="text-4xl font-bold text-center mb-16">Workflow Capabilities</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard title="Durable Execution" description="Workflows survive crashes and restarts. Execution state is automatically persisted." />
          <FeatureCard title="Step Orchestration" description="Sequential, parallel, and conditional step execution with full control flow." />
          <FeatureCard title="Retry Strategies" description="Exponential backoff, fixed delay, or custom retry logic with max attempts." />
          <FeatureCard title="Error Boundaries" description="Isolate failures to specific steps. Continue workflow or gracefully stop." />
          <FeatureCard title="Checkpointing" description="Save state at any point. Resume from last checkpoint on failure or pause." />
          <FeatureCard title="Timeouts" description="Per-step and workflow-level timeouts. Prevent hanging executions automatically." />
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
