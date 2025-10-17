/**
 * agents.do SDK - Usage Examples
 *
 * This file demonstrates the complete API surface for defining, deploying,
 * and executing AI agents on the Cloudflare agents framework.
 */

import { defineAgent, listAgents, getAgent } from './agents'
import type { AgentTool, PendingAction } from './agents'

// =============================================================================
// Example 1: Supervised Agent (Requires approval for all actions)
// =============================================================================

const supervisedAgent = defineAgent({
  name: 'supervised-support',
  description: 'Customer support agent that requires human approval for every action',
  autonomyLevel: 'supervised',
  tools: [
    {
      name: 'search_help_docs',
      description: 'Search the help documentation for relevant articles',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string' },
        },
      },
    },
    {
      name: 'send_email',
      description: 'Send an email to the customer',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'string' },
          subject: { type: 'string' },
          body: { type: 'string' },
        },
      },
    },
  ],
  model: 'claude-sonnet-4.5',
  systemPrompt: 'You are a helpful customer support agent. Always be polite and professional.',
  temperature: 0.7,
})

// Deploy the agent
async function deploySupervisedAgent() {
  const result = await supervisedAgent.deploy({
    apiKey: process.env.DO_API_KEY,
    environment: 'production',
  })

  console.log(`Agent deployed: ${result.url}`)
}

// Execute with approval callback
async function executeSupervisedAgent() {
  const result = await supervisedAgent.execute({
    input: 'I need help resetting my password',
    context: { userId: 'user_123', email: 'customer@example.com' },
    onApprovalRequired: async (action: PendingAction) => {
      console.log(`Approval required for: ${action.tool}`)
      console.log(`Reasoning: ${action.reasoning}`)
      console.log(`Risk level: ${action.risk}`)
      console.log(`Parameters:`, action.parameters)

      // In a real app, this would prompt a human operator
      // For this example, approve if it's just searching docs
      return action.tool === 'search_help_docs'
    },
  })

  console.log(`Agent response: ${result.response}`)
  console.log(`Actions taken: ${result.actions.length}`)
}

// =============================================================================
// Example 2: Semi-Autonomous Agent (Auto-executes safe actions)
// =============================================================================

const semiAutonomousAgent = defineAgent({
  name: 'sales-assistant',
  description: 'Sales agent that can research but needs approval for sending contracts',
  autonomyLevel: 'semi-autonomous',
  tools: [
    {
      name: 'check_crm',
      description: 'Look up customer information in CRM',
      requiresApproval: false, // Safe action
    },
    {
      name: 'calculate_pricing',
      description: 'Calculate custom pricing based on volume',
      requiresApproval: false, // Safe action
    },
    {
      name: 'send_contract',
      description: 'Send a sales contract to the customer',
      requiresApproval: true, // Needs approval
      parameters: {
        type: 'object',
        properties: {
          customerId: { type: 'string' },
          contractType: { type: 'string' },
          value: { type: 'number' },
        },
      },
    },
    {
      name: 'schedule_demo',
      description: 'Schedule a product demo with the customer',
      requiresApproval: true, // Needs approval
    },
  ],
  model: 'gpt-5',
  systemPrompt: 'You are a sales assistant. Focus on qualifying leads and providing value.',
  rateLimits: {
    perMinute: 20,
    perHour: 200,
    perDay: 1000,
  },
})

async function executeSemiAutonomousAgent() {
  const result = await semiAutonomousAgent.execute({
    input: 'I want to buy 1000 licenses for my company',
    context: {
      companyId: 'acme-corp',
      industry: 'technology',
    },
    onApprovalRequired: async (action) => {
      // Only called for actions with requiresApproval: true
      console.log(`Need approval to: ${action.tool}`)

      // Approve sending contract if value is under $50k
      if (action.tool === 'send_contract') {
        return action.parameters.value < 50000
      }

      // Always approve scheduling demos
      return action.tool === 'schedule_demo'
    },
  })

  console.log(result.response)
}

// =============================================================================
// Example 3: Autonomous Agent (Full autonomy, no approval needed)
// =============================================================================

const autonomousAgent = defineAgent({
  name: 'data-processor',
  description: 'Fully autonomous agent that processes data and generates reports',
  autonomyLevel: 'autonomous',
  tools: [
    {
      name: 'fetch_data',
      description: 'Fetch data from external API',
    },
    {
      name: 'analyze_data',
      description: 'Run statistical analysis on dataset',
    },
    {
      name: 'generate_chart',
      description: 'Create visualization from data',
    },
    {
      name: 'save_report',
      description: 'Save report to database',
    },
  ],
  model: 'gpt-5',
  systemPrompt: 'You are a data analyst. Process data efficiently and generate insights.',
  temperature: 0.3, // Lower temperature for more deterministic outputs
  maxTokens: 2000,
})

async function executeAutonomousAgent() {
  // No approval callback needed - agent runs fully autonomously
  const result = await autonomousAgent.execute({
    input: 'Generate monthly sales report for Q4 2024',
    context: {
      dataSource: 'sales_db',
      timeRange: '2024-10-01 to 2024-12-31',
    },
    timeout: 300, // 5 minute timeout
  })

  console.log(`Report generated: ${result.response}`)
  console.log(`Processing time: ${result.metadata.duration}ms`)
  console.log(`Cost: $${result.metadata.cost}`)
}

// =============================================================================
// Example 4: Streaming Responses
// =============================================================================

async function streamingExample() {
  const agent = defineAgent({
    name: 'chat-agent',
    description: 'Interactive chat agent with streaming responses',
    autonomyLevel: 'autonomous',
    tools: [],
    model: 'claude-sonnet-4.5',
  })

  await agent.deploy({ apiKey: process.env.DO_API_KEY })

  let streamedText = ''

  const result = await agent.execute({
    input: 'Explain quantum computing in simple terms',
    stream: true,
    onStream: (chunk) => {
      // Stream chunks to the console as they arrive
      process.stdout.write(chunk)
      streamedText += chunk
    },
  })

  console.log('\n\nFull response:', result.response)
  console.log('Tokens used:', result.metadata.tokensUsed)
}

// =============================================================================
// Example 5: Agent Monitoring and Management
// =============================================================================

async function monitoringExample() {
  const agent = defineAgent({
    name: 'production-agent',
    description: 'Production agent',
    autonomyLevel: 'autonomous',
    tools: [],
  })

  // Deploy the agent
  await agent.deploy({
    apiKey: process.env.DO_API_KEY,
    environment: 'production',
    logging: true,
  })

  // Get real-time status
  const status = await agent.status()
  console.log('Agent status:', status.state)
  console.log('Total executions:', status.executions)
  console.log('Error count:', status.errors)
  console.log('Uptime:', status.uptime)

  // Get performance metrics
  const metrics = await agent.metrics('7d') // Last 7 days
  console.log('Avg response time:', metrics.avgResponseTime, 'ms')
  console.log('Success rate:', (metrics.successRate * 100).toFixed(2), '%')
  console.log('Total cost:', `$${metrics.totalCost.toFixed(4)}`)
  console.log('Top tools:', metrics.topTools)
  console.log('Uptime:', metrics.uptimePercentage.toFixed(2), '%')

  // Update agent configuration
  await agent.update({
    temperature: 0.5,
    maxTokens: 1500,
  })

  // Pause agent temporarily
  await agent.pause()

  // Resume agent
  await agent.resume()

  // Stop agent (can be restarted)
  await agent.stop()

  // Delete agent permanently
  // await agent.delete()
}

// =============================================================================
// Example 6: Working with Multiple Agents
// =============================================================================

async function multipleAgentsExample() {
  // List all deployed agents
  const agents = await listAgents({ apiKey: process.env.DO_API_KEY })

  console.log(`Found ${agents.length} deployed agents:`)
  agents.forEach((a) => {
    console.log(`- ${a.name} (${a.environment}): ${a.state}`)
  })

  // Get a specific agent by ID
  const { agent, status } = await getAgent('agent-123', {
    apiKey: process.env.DO_API_KEY,
  })

  console.log(`Agent: ${agent.getConfig().name}`)
  console.log(`Status: ${status.state}`)
  console.log(`Executions: ${status.executions}`)

  // Execute the retrieved agent
  const result = await agent.execute({
    input: 'Process this request',
  })

  console.log(result.response)
}

// =============================================================================
// Example 7: Advanced Tool Definitions with Local Execution
// =============================================================================

const toolsWithExecution: AgentTool[] = [
  {
    name: 'calculate',
    description: 'Perform mathematical calculations',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string', description: 'Math expression to evaluate' },
      },
      required: ['expression'],
    },
    execute: async (params) => {
      // Local execution for testing
      try {
        // Note: eval is dangerous in production! Use a proper math parser
        const result = eval(params.expression)
        return { result, success: true }
      } catch (error) {
        return { error: 'Invalid expression', success: false }
      }
    },
  },
  {
    name: 'get_weather',
    description: 'Get current weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string' },
        units: { type: 'string', enum: ['celsius', 'fahrenheit'] },
      },
      required: ['location'],
    },
    execute: async (params) => {
      // Mock API call
      return {
        location: params.location,
        temperature: 72,
        units: params.units || 'fahrenheit',
        conditions: 'Sunny',
      }
    },
  },
]

// =============================================================================
// Example 8: Error Handling
// =============================================================================

async function errorHandlingExample() {
  try {
    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test agent',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    // This will fail if not deployed
    await agent.execute({ input: 'test' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('must be deployed')) {
      console.error('Agent needs to be deployed first')
    }
  }

  try {
    // Invalid agent name
    defineAgent({
      name: 'Invalid_Name',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('kebab-case')) {
      console.error('Agent name must be kebab-case')
    }
  }
}

// =============================================================================
// Example 9: Custom Metadata and Context
// =============================================================================

async function customContextExample() {
  const agent = defineAgent({
    name: 'context-aware-agent',
    description: 'Agent that uses context for personalization',
    autonomyLevel: 'autonomous',
    tools: [],
    metadata: {
      version: '1.0.0',
      category: 'customer-service',
      capabilities: ['chat', 'email', 'phone'],
    },
  })

  await agent.deploy({ apiKey: process.env.DO_API_KEY })

  const result = await agent.execute({
    input: 'Help me with my order',
    context: {
      userId: 'user_456',
      orderId: 'order_789',
      language: 'en',
      timezone: 'America/Los_Angeles',
      previousInteractions: 3,
      customerSegment: 'premium',
      preferences: {
        communicationChannel: 'email',
        responseStyle: 'detailed',
      },
    },
  })

  console.log(result.response)
}

// =============================================================================
// Example 10: Production Deployment with Custom Domain
// =============================================================================

async function productionDeploymentExample() {
  const agent = defineAgent({
    name: 'production-assistant',
    description: 'Production-ready customer assistant',
    autonomyLevel: 'semi-autonomous',
    tools: [
      { name: 'search_kb', description: 'Search knowledge base', requiresApproval: false },
      { name: 'create_ticket', description: 'Create support ticket', requiresApproval: false },
      { name: 'escalate', description: 'Escalate to human agent', requiresApproval: true },
    ],
    model: 'gpt-5',
    systemPrompt: `You are a professional customer support assistant for Acme Corp.

Guidelines:
- Always be polite and empathetic
- Search the knowledge base before escalating
- Create tickets for issues that need follow-up
- Escalate to humans for complex or sensitive issues`,
    temperature: 0.7,
    maxTokens: 1000,
    rateLimits: {
      perMinute: 100,
      perHour: 1000,
      perDay: 10000,
    },
    metadata: {
      version: '2.1.0',
      environment: 'production',
      deployedBy: 'deploy-bot',
      deployedAt: new Date().toISOString(),
    },
  })

  const deployment = await agent.deploy({
    apiKey: process.env.DO_API_KEY,
    environment: 'production',
    customDomain: 'assistant.acme-corp.com',
    logging: true,
  })

  console.log(`Agent deployed to: ${deployment.url}`)
  console.log(`Production endpoint: https://assistant.acme-corp.com`)

  // Set up monitoring
  setInterval(async () => {
    const status = await agent.status()
    if (status.state === 'error') {
      console.error('Agent is in error state!')
      // Alert ops team
    }
  }, 60000) // Check every minute
}

// Export examples
export {
  supervisedAgent,
  semiAutonomousAgent,
  autonomousAgent,
  deploySupervisedAgent,
  executeSupervisedAgent,
  executeSemiAutonomousAgent,
  executeAutonomousAgent,
  streamingExample,
  monitoringExample,
  multipleAgentsExample,
  errorHandlingExample,
  customContextExample,
  productionDeploymentExample,
}
