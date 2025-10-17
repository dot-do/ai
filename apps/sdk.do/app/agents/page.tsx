import { Hero } from '@/components/Hero'
import { ScrollyLayout, Selectable } from '@/components/ScrollyCode'
import { CodePlayground } from '@/components/CodePlayground'

const examples = [
  {
    title: 'Define Agent',
    code: `import { defineAgent } from '@dotdo/sdk.do'

// Define an autonomous agent
export const customerSupportAgent = defineAgent({
  name: 'customer-support',
  description: 'Autonomous customer support agent',

  // Agent personality and behavior
  system: \`You are a helpful customer support agent.
    You can check order status, process refunds, and answer questions.
    Be friendly, professional, and proactive.\`,

  // Tools the agent can use
  tools: [
    {
      name: 'get_order',
      description: 'Get order details by ID',
      parameters: {
        orderId: 'string'
      },
      handler: async ({ orderId }, { $ }) => {
        return await $.db.get('orders', orderId)
      }
    },
    {
      name: 'process_refund',
      description: 'Process a refund for an order',
      parameters: {
        orderId: 'string',
        reason: 'string'
      },
      handler: async ({ orderId, reason }, { $ }) => {
        const order = await $.db.get('orders', orderId)
        const refund = await $.actions.stripe.refund({
          chargeId: order.chargeId,
          amount: order.total
        })
        return { success: true, refundId: refund.id }
      }
    }
  ]
})`,
  },
  {
    title: 'Autonomy Levels',
    code: `import { defineAgent } from '@dotdo/sdk.do'

// Different autonomy levels
export const conservativeAgent = defineAgent({
  name: 'conservative-agent',

  // Agent must ask before taking actions
  autonomy: 'supervised',

  tools: [{
    name: 'charge_customer',
    requiresApproval: true, // Ask before executing
    handler: async (params, ctx) => {
      // Only runs if user approves
      return await ctx.$.actions.stripe.charge(params)
    }
  }]
})

export const autonomousAgent = defineAgent({
  name: 'autonomous-agent',

  // Agent can take actions without asking
  autonomy: 'autonomous',

  // Set spending limits
  limits: {
    maxTransactionAmount: 10000, // $100
    maxDailySpend: 100000, // $1000
    requireApprovalAbove: 50000 // $500
  },

  tools: [{
    name: 'charge_customer',
    handler: async (params, ctx) => {
      // Runs automatically if within limits
      return await ctx.$.actions.stripe.charge(params)
    }
  }]
})

export const hybridAgent = defineAgent({
  name: 'hybrid-agent',

  // Agent decides based on confidence
  autonomy: 'hybrid',

  confidenceThreshold: 0.8, // Ask if confidence < 80%

  tools: [{
    name: 'create_order',
    handler: async (params, ctx) => {
      // Runs automatically if agent is confident
      // Otherwise asks for confirmation
      return await ctx.$.db.create('orders', params)
    }
  }]
})`,
  },
  {
    title: 'Agent Tools',
    code: `import { defineAgent } from '@dotdo/sdk.do'

export const salesAgent = defineAgent({
  name: 'sales-agent',
  system: 'You are a sales agent. Help customers find and purchase products.',

  tools: [
    {
      name: 'search_products',
      description: 'Search products by query',
      parameters: {
        query: 'string',
        category: { type: 'string', optional: true },
        priceRange: { type: 'object', optional: true }
      },
      handler: async ({ query, category, priceRange }, { $ }) => {
        return await $.db.search('products', {
          query,
          where: {
            ...(category && { category }),
            ...(priceRange && {
              price: {
                $gte: priceRange.min,
                $lte: priceRange.max
              }
            })
          }
        })
      }
    },
    {
      name: 'get_recommendations',
      description: 'Get personalized product recommendations',
      parameters: {
        userId: 'string',
        count: { type: 'number', default: 5 }
      },
      handler: async ({ userId, count }, { $ }) => {
        // AI-powered recommendations
        const user = await $.db.get('users', userId)
        const history = await $.db.list('orders', {
          where: { customerId: userId }
        })

        return await $.ai.generate({
          model: 'gpt-5',
          prompt: \`Recommend products for user with history: \${JSON.stringify(history)}\`,
          schema: {
            recommendations: {
              type: 'array',
              items: {
                productId: 'string',
                reason: 'string',
                confidence: 'number'
              },
              maxItems: count
            }
          }
        })
      }
    },
    {
      name: 'create_order',
      description: 'Create an order for the customer',
      parameters: {
        customerId: 'string',
        items: 'array'
      },
      requiresApproval: true,
      handler: async ({ customerId, items }, { $ }) => {
        // Calculate total
        const products = await Promise.all(
          items.map(item => $.db.get('products', item.productId))
        )
        const total = products.reduce((sum, p, i) =>
          sum + p.price * items[i].quantity, 0
        )

        // Create order
        return await $.db.create('orders', {
          customerId,
          items,
          total,
          status: 'pending'
        })
      }
    }
  ]
})`,
  },
  {
    title: 'State Management',
    code: `import { defineAgent } from '@dotdo/sdk.do'

export const statefulAgent = defineAgent({
  name: 'stateful-agent',

  // Initial state
  initialState: {
    conversationContext: [],
    userPreferences: {},
    taskQueue: []
  },

  tools: [
    {
      name: 'remember_preference',
      description: 'Remember user preference',
      parameters: {
        key: 'string',
        value: 'string'
      },
      handler: async ({ key, value }, { state }) => {
        // Update agent state
        state.userPreferences[key] = value
        return { success: true }
      }
    },
    {
      name: 'get_context',
      description: 'Get conversation context',
      parameters: {},
      handler: async (params, { state }) => {
        return {
          context: state.conversationContext,
          preferences: state.userPreferences
        }
      }
    }
  ],

  // State is automatically persisted
  beforeMessage: async ({ state, message }) => {
    // Add message to context
    state.conversationContext.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    })
  },

  afterMessage: async ({ state, response }) => {
    // Add response to context
    state.conversationContext.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    })

    // Keep only last 10 messages
    if (state.conversationContext.length > 10) {
      state.conversationContext = state.conversationContext.slice(-10)
    }
  }
})`,
  },
  {
    title: 'Execute Agent',
    code: `import { $ } from '@dotdo/sdk.do'

// Execute agent with a message
const response = await $.agents.execute('customer-support', {
  message: 'I want to return my order #12345',
  userId: 'user_123',
  context: {
    previousOrders: 5,
    totalSpent: 49999
  }
})

console.log({
  message: response.message,
  toolCalls: response.toolCalls,
  confidence: response.confidence,
  requiresApproval: response.requiresApproval
})

// Handle tool approval
if (response.requiresApproval) {
  const approved = await askUserForApproval(response.toolCalls)

  if (approved) {
    const finalResponse = await $.agents.approve(response.executionId)
    console.log(finalResponse.message)
  } else {
    await $.agents.reject(response.executionId)
  }
}

// Stream agent responses
const stream = $.agents.stream('customer-support', {
  message: 'Tell me about your best products'
})

for await (const chunk of stream) {
  process.stdout.write(chunk.text)
}`,
  },
  {
    title: 'Agent Monitoring',
    code: `import { $ } from '@dotdo/sdk.do'

// Get agent execution history
const executions = await $.agents.history('customer-support', {
  limit: 50,
  since: '2025-10-10T00:00:00Z'
})

executions.forEach(exec => {
  console.log({
    timestamp: exec.timestamp,
    message: exec.message,
    response: exec.response,
    toolsUsed: exec.toolCalls.map(t => t.name),
    duration: exec.duration,
    success: exec.success
  })
})

// Get agent metrics
const metrics = await $.agents.metrics('customer-support', {
  period: '7d'
})

console.log({
  totalExecutions: metrics.executions,
  avgResponseTime: metrics.avgResponseTime,
  toolUsage: metrics.toolUsage,
  successRate: metrics.successRate,
  approvalRate: metrics.approvalRate,
  userSatisfaction: metrics.satisfaction
})

// Monitor agent in real-time
const monitor = $.agents.monitor('customer-support')

monitor.on('execution', (exec) => {
  console.log('New execution:', exec.id)
})

monitor.on('tool-call', (call) => {
  console.log('Tool called:', call.name, call.parameters)
})

monitor.on('error', (error) => {
  console.error('Agent error:', error)
})`,
  },
  {
    title: 'Multi-Agent Systems',
    code: `import { defineAgent } from '@dotdo/sdk.do'

// Define multiple specialized agents
export const researchAgent = defineAgent({
  name: 'research-agent',
  system: 'Research and gather information',
  tools: [/* research tools */]
})

export const analysisAgent = defineAgent({
  name: 'analysis-agent',
  system: 'Analyze data and provide insights',
  tools: [/* analysis tools */]
})

export const executionAgent = defineAgent({
  name: 'execution-agent',
  system: 'Execute actions based on analysis',
  tools: [/* execution tools */]
})

// Orchestrator agent coordinates others
export const orchestratorAgent = defineAgent({
  name: 'orchestrator',
  system: 'Coordinate other agents to complete complex tasks',

  tools: [
    {
      name: 'delegate_to_agent',
      description: 'Delegate task to another agent',
      parameters: {
        agent: 'string',
        task: 'string'
      },
      handler: async ({ agent, task }, { $ }) => {
        return await $.agents.execute(agent, { message: task })
      }
    }
  ]
})

// Execute complex task with multiple agents
const result = await $.agents.execute('orchestrator', {
  message: 'Research market trends, analyze competitors, and create strategy'
})

// Orchestrator will:
// 1. Delegate research to research-agent
// 2. Pass results to analysis-agent
// 3. Use analysis to have execution-agent create strategy`,
  },
  {
    title: 'Agent Configuration',
    code: `import { defineAgent } from '@dotdo/sdk.do'

export const advancedAgent = defineAgent({
  name: 'advanced-agent',
  description: 'Agent with advanced configuration',

  // Model selection
  model: 'gpt-5',

  // System prompt
  system: \`You are an advanced AI agent with the following guidelines:
    1. Always verify data before taking actions
    2. Provide explanations for your decisions
    3. Ask for clarification when uncertain
    4. Prioritize user safety and satisfaction\`,

  // Temperature for creativity
  temperature: 0.7,

  // Max tokens per response
  maxTokens: 2000,

  // Autonomy settings
  autonomy: 'hybrid',
  confidenceThreshold: 0.85,

  // Rate limits
  rateLimit: {
    maxRequestsPerMinute: 60,
    maxRequestsPerDay: 1000
  },

  // Timeout settings
  timeout: {
    perMessage: 30000, // 30 seconds
    perTool: 10000 // 10 seconds
  },

  // Memory settings
  memory: {
    maxMessages: 20,
    summarizeAfter: 10,
    persistState: true
  },

  // Logging and monitoring
  logging: {
    logLevel: 'info',
    logTools: true,
    logState: false
  },

  // Error handling
  errorHandling: {
    retryOnFailure: true,
    maxRetries: 3,
    fallbackModel: 'gpt-5-mini'
  }
})`,
  },
]

export default function AgentsPage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="Autonomous Agents"
        description="Build AI agents that can use tools, manage state, and take actions autonomously with configurable oversight levels."
        packageName="@dotdo/sdk.do"
        gradient="from-pink-500 to-rose-600"
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <ScrollyLayout
          steps={[
            <Selectable key={0} index={0}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Define Intelligent Agents</h2>
                <p className="text-xl text-gray-400">Create AI agents with personality, tools, and decision-making capabilities. Full SDK access for tools.</p>
              </div>
            </Selectable>,

            <Selectable key={1} index={1}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Configurable Autonomy</h2>
                <p className="text-xl text-gray-400">Choose between supervised, autonomous, or hybrid modes. Set spending limits and approval requirements.</p>
              </div>
            </Selectable>,

            <Selectable key={2} index={2}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Powerful Tool System</h2>
                <p className="text-xl text-gray-400">
                  Give agents access to databases, APIs, AI services, and custom functions. Agents decide when to use tools.
                </p>
              </div>
            </Selectable>,

            <Selectable key={3} index={3}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Persistent State</h2>
                <p className="text-xl text-gray-400">
                  Agents remember context across conversations. Track preferences, history, and task queues automatically.
                </p>
              </div>
            </Selectable>,

            <Selectable key={4} index={4}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Execute & Stream</h2>
                <p className="text-xl text-gray-400">Run agents synchronously or stream responses in real-time. Handle tool approvals when needed.</p>
              </div>
            </Selectable>,

            <Selectable key={5} index={5}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Complete Observability</h2>
                <p className="text-xl text-gray-400">Monitor executions, tool usage, success rates, and user satisfaction. Real-time event streams included.</p>
              </div>
            </Selectable>,

            <Selectable key={6} index={6}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Multi-Agent Systems</h2>
                <p className="text-xl text-gray-400">
                  Build orchestrators that coordinate specialized agents. Solve complex tasks through agent collaboration.
                </p>
              </div>
            </Selectable>,

            <Selectable key={7} index={7}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Advanced Configuration</h2>
                <p className="text-xl text-gray-400">Fine-tune models, temperature, memory, rate limits, timeouts, and error handling per agent.</p>
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
        <h2 className="text-4xl font-bold text-center mb-16">Agent Capabilities</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="Function Calling" description="Agents automatically decide which tools to use based on user requests and context." />
          <FeatureCard title="Chain of Thought" description="Agents explain their reasoning and decision-making process transparently." />
          <FeatureCard title="Approval Workflows" description="Require human approval for sensitive actions. Agents wait for confirmation." />
          <FeatureCard title="Spending Limits" description="Set maximum transaction amounts and daily spending caps for safety." />
          <FeatureCard title="Context Windows" description="Large context windows for complex tasks. Automatic summarization of long histories." />
          <FeatureCard title="Multi-Modal" description="Agents can process text, images, and structured data. Vision models supported." />
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
