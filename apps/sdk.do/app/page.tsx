import { Hero } from '@/components/Hero'
import { ScrollyLayout, Selectable } from '@/components/ScrollyCode'
import { CodePlayground } from '@/components/CodePlayground'

const examples = [
  {
    title: 'Installation',
    code: `// Install the SDK
pnpm add @dotdo/sdk.do

// Or with npm
npm install @dotdo/sdk.do`,
    language: 'bash',
  },
  {
    title: 'Initialize SDK',
    code: `import { $ } from '@dotdo/sdk.do'

// The $ proxy provides semantic access to all services
// Use environment variable DO_TOKEN for auth
const result = await $.db.get('users', 'user_123')`,
    language: 'typescript',
  },
  {
    title: 'AI Generation',
    code: `import { $ } from '@dotdo/sdk.do'

// Generate content with AI
const response = await $.ai.generate({
  model: 'gpt-5',
  prompt: 'Write a product description for wireless headphones',
  schema: {
    name: 'string',
    description: 'string',
    features: 'string[]',
    price: 'number'
  }
})

console.log(response.data)`,
    language: 'typescript',
  },
  {
    title: 'Database Operations',
    code: `import { $ } from '@dotdo/sdk.do'

// Create a new product
const product = await $.db.create('products', {
  name: 'Wireless Headphones',
  price: 299,
  category: 'electronics'
})

// Query with filters
const products = await $.db.list('products', {
  where: { category: 'electronics', price: { $lt: 500 } },
  orderBy: { price: 'asc' },
  limit: 10
})`,
    language: 'typescript',
  },
  {
    title: 'Event Publishing',
    code: `import { $ } from '@dotdo/sdk.do'

// Publish events to semantic queues
await $.send('Order.created', {
  orderId: 'order_123',
  customerId: 'user_456',
  total: 299.99,
  items: [...]
})

// Batch publish for efficiency
await $.events.batchPublish([
  { type: 'Product.viewed', payload: { productId: 'prod_1' } },
  { type: 'Product.addedToCart', payload: { productId: 'prod_1' } }
])`,
    language: 'typescript',
  },
  {
    title: 'Event Listeners',
    code: `import { $ } from '@dotdo/sdk.do'

// Listen to semantic event patterns
$.on('Order.created', async (event) => {
  console.log('New order:', event.payload.orderId)

  // Send confirmation email
  await $.actions.email.send({
    to: event.payload.customerEmail,
    subject: 'Order Confirmed',
    template: 'order-confirmation'
  })
})

// Pattern matching with wildcards
$.on('Product.*', async (event) => {
  await $.db.create('analytics', {
    eventType: event.type,
    timestamp: new Date()
  })
})`,
    language: 'typescript',
  },
  {
    title: 'Scheduled Tasks',
    code: `import { $ } from '@dotdo/sdk.do'

// Run tasks on a schedule
$.every('0 0 * * *', async () => {
  // Daily cleanup at midnight
  const oldRecords = await $.db.list('logs', {
    where: { createdAt: { $lt: Date.now() - 30 * 24 * 60 * 60 * 1000 } }
  })

  await $.db.batchDelete('logs', oldRecords.map(r => r.id))
})

// Or use semantic intervals
$.every('$.Daily', async () => {
  await $.actions.email.send({
    to: 'admin@example.com',
    subject: 'Daily Report',
    template: 'daily-summary'
  })
})`,
    language: 'typescript',
  },
  {
    title: 'Workflows',
    code: `import { defineWorkflow } from '@dotdo/sdk.do'

// Define multi-step workflows
const orderWorkflow = defineWorkflow({
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
await orderWorkflow.execute({ orderId: 'order_123' })`,
    language: 'typescript',
  },
  {
    title: 'Actions & Triggers',
    code: `import { defineAction, defineTrigger } from '@dotdo/sdk.do'

// Define reusable actions
const sendNotification = defineAction({
  name: 'send-notification',
  async execute({ userId, message }) {
    const user = await this.db.get('users', userId)
    await this.actions.email.send({
      to: user.email,
      subject: 'Notification',
      body: message
    })
  }
})

// Create triggers for automation
const highValueOrderTrigger = defineTrigger({
  event: 'Order.created',
  condition: (event) => event.payload.total > 1000,
  action: async (event) => {
    await sendNotification.execute({
      userId: 'admin',
      message: \`High value order: $\${event.payload.total}\`
    })
  }
})`,
    language: 'typescript',
  },
  {
    title: 'OAuth & Auth',
    code: `import { $ } from '@dotdo/sdk.do'

// OAuth 2.0 authorization flow
const authUrl = await $.oauth.authorize({
  clientId: 'your-client-id',
  redirectUri: 'https://app.example.com/callback',
  scope: ['read:user', 'write:orders'],
  state: 'random-state-string'
})

// Exchange code for tokens
const tokens = await $.oauth.exchangeCode({
  code: 'authorization-code',
  redirectUri: 'https://app.example.com/callback'
})

// Use tokens
const user = await $.oauth.getUserInfo(tokens.accessToken)
console.log('Authenticated as:', user.email)`,
    language: 'typescript',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero
        title="SDK.do"
        description="Build autonomous Business-as-Code with AI-native TypeScript SDKs. Type-safe, semantic, and ready for production."
        packageName="@dotdo/sdk.do"
        gradient="from-blue-500 to-purple-600"
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <ScrollyLayout
          steps={[
            <Selectable key={0} index={0}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Get Started in Seconds</h2>
                <p className="text-xl text-gray-400">Install the SDK with your favorite package manager. No complex setup required.</p>
              </div>
            </Selectable>,

            <Selectable key={1} index={1}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Semantic $ Proxy</h2>
                <p className="text-xl text-gray-400">
                  Access all services through the intuitive <code className="text-blue-400">$</code> proxy. Type-safe and autocomplete-friendly.
                </p>
              </div>
            </Selectable>,

            <Selectable key={2} index={2}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">AI-Native from the Ground Up</h2>
                <p className="text-xl text-gray-400">
                  Generate structured content with GPT-5, Claude, and more. Schema validation built-in for type-safe AI responses.
                </p>
              </div>
            </Selectable>,

            <Selectable key={3} index={3}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Powerful Database Operations</h2>
                <p className="text-xl text-gray-400">
                  CRUD operations, relationships, transactions, and semantic queries. Works with any collection out of the box.
                </p>
              </div>
            </Selectable>,

            <Selectable key={4} index={4}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Event-Driven Architecture</h2>
                <p className="text-xl text-gray-400">Publish events to semantic queues. Perfect for microservices, workflows, and real-time updates.</p>
              </div>
            </Selectable>,

            <Selectable key={5} index={5}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">React to Events Automatically</h2>
                <p className="text-xl text-gray-400">Listen to events with pattern matching. Wildcards, conditions, and middleware support included.</p>
              </div>
            </Selectable>,

            <Selectable key={6} index={6}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Schedule Anything</h2>
                <p className="text-xl text-gray-400">
                  Cron schedules or semantic intervals like <code className="text-blue-400">$.Daily</code>. Perfect for background jobs and cleanup tasks.
                </p>
              </div>
            </Selectable>,

            <Selectable key={7} index={7}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Multi-Step Workflows</h2>
                <p className="text-xl text-gray-400">Define complex business processes with retry logic, error handling, and automatic recovery.</p>
              </div>
            </Selectable>,

            <Selectable key={8} index={8}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Composable Actions & Triggers</h2>
                <p className="text-xl text-gray-400">Build reusable actions and automate with event-driven triggers. DRY principle for workflows.</p>
              </div>
            </Selectable>,

            <Selectable key={9} index={9}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">OAuth 2.0 Built-In</h2>
                <p className="text-xl text-gray-400">Complete OAuth 2.0 implementation with PKCE, refresh tokens, and OpenID Connect support.</p>
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

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">Everything You Need to Build Autonomous Business Logic</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="AI Services"
            description="GPT-5, Claude Sonnet 4.5, and more. Generate, embed, and batch process with type-safe schemas."
            icon="🤖"
            href="/ai"
          />
          <FeatureCard
            title="Database"
            description="Semantic CRUD, relationships, transactions, and graph queries across any collection."
            icon="🗄️"
            href="/database"
          />
          <FeatureCard title="Events" description="Publish, subscribe, and stream events with pattern matching and DLQ support." icon="📡" href="/events" />
          <FeatureCard title="Functions" description="Deploy serverless functions with automatic scaling and edge distribution." icon="⚡" href="/functions" />
          <FeatureCard
            title="Workflows"
            description="Multi-step processes with retry logic, error handling, and state management."
            icon="🔄"
            href="/workflows"
          />
          <FeatureCard
            title="Agents"
            description="Deploy autonomous AI agents with tools, memory, and decision-making capabilities."
            icon="🎯"
            href="/agents"
          />
          <FeatureCard title="Actions" description="Reusable workflow actions that compose into complex business logic." icon="⚙️" href="/actions" />
          <FeatureCard title="Triggers" description="Event-driven automation with conditions, priorities, and execution history." icon="🎬" href="/triggers" />
          <FeatureCard title="OAuth" description="Complete OAuth 2.0 with PKCE, sessions, and API key management." icon="🔐" href="/oauth" />
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ title, description, icon, href }: { title: string; description: string; icon: string; href: string }) {
  return (
    <a href={href} className="group p-6 rounded-lg border border-gray-800 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </a>
  )
}
