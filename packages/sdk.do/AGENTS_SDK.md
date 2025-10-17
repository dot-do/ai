# agents.do SDK

Complete SDK for defining, deploying, and executing AI agents on the Cloudflare agents framework.

## Installation

```bash
npm install @dotdo/sdk.do
# or
pnpm add @dotdo/sdk.do
```

## Quick Start

```typescript
import { defineAgent } from '@dotdo/sdk.do'

// 1. Define your agent
const agent = defineAgent({
  name: 'customer-support',
  description: 'Handles customer support queries',
  autonomyLevel: 'semi-autonomous',
  tools: [
    {
      name: 'search_kb',
      description: 'Search knowledge base',
      requiresApproval: false,
    },
    {
      name: 'send_email',
      description: 'Send email to customer',
      requiresApproval: true,
    },
  ],
  model: 'claude-sonnet-4.5',
  systemPrompt: 'You are a helpful customer support agent.',
})

// 2. Deploy the agent
await agent.deploy({
  apiKey: process.env.DO_API_KEY,
  environment: 'production',
})

// 3. Execute the agent
const result = await agent.execute({
  input: 'Help me reset my password',
  context: { userId: 'user_123' },
})

console.log(result.response)
```

## Autonomy Levels

The SDK supports three levels of agent autonomy:

### Supervised

Requires human approval for **all** actions before execution.

```typescript
const supervisedAgent = defineAgent({
  name: 'supervised-agent',
  autonomyLevel: 'supervised',
  tools: [...],
})

await supervisedAgent.execute({
  input: 'Process refund',
  onApprovalRequired: async (action) => {
    console.log(`Approve ${action.tool}?`, action.parameters)
    return confirm('Approve?')
  },
})
```

### Semi-Autonomous

Auto-executes safe actions, asks for approval on dangerous ones.

```typescript
const semiAgent = defineAgent({
  name: 'semi-agent',
  autonomyLevel: 'semi-autonomous',
  tools: [
    {
      name: 'search_data',
      requiresApproval: false, // Safe - auto-execute
    },
    {
      name: 'delete_record',
      requiresApproval: true, // Dangerous - needs approval
    },
  ],
})
```

### Autonomous

Executes all actions without human intervention.

```typescript
const autoAgent = defineAgent({
  name: 'auto-agent',
  autonomyLevel: 'autonomous',
  tools: [...],
})

// No approval callback needed
await autoAgent.execute({ input: 'Process data' })
```

## API Reference

### `defineAgent(config: AgentConfig)`

Create a new agent with the given configuration.

```typescript
interface AgentConfig {
  name: string // kebab-case required
  description: string
  autonomyLevel: 'supervised' | 'semi-autonomous' | 'autonomous'
  tools: AgentTool[]
  model?: string // Default: 'gpt-5'
  systemPrompt?: string
  temperature?: number // 0-1
  maxTokens?: number
  rateLimits?: {
    perMinute?: number
    perHour?: number
    perDay?: number
  }
  metadata?: Record<string, any>
}
```

### `agent.deploy(options: DeployOptions)`

Deploy the agent to agents.do.

```typescript
await agent.deploy({
  apiKey: 'do_xxx', // or DO_API_KEY env var
  environment: 'production', // or 'development', 'staging'
  customDomain: 'my-agent.example.com',
  logging: true,
})
```

Returns:

```typescript
{
  id: string
  url: string
}
```

### `agent.execute(options: ExecuteOptions)`

Execute the agent with given input.

```typescript
const result = await agent.execute({
  input: 'User query here',
  context: {
    userId: 'user_123',
    // ... additional context
  },
  timeout: 30, // seconds
  stream: false,
  onStream: (chunk) => console.log(chunk),
  onApprovalRequired: async (action) => {
    // Return true to approve, false to reject
    return action.risk === 'low'
  },
})
```

Returns:

```typescript
interface ExecuteResult {
  id: string
  response: string
  actions: ExecutedAction[]
  metadata: {
    startTime: string
    endTime: string
    duration: number // milliseconds
    tokensUsed: number
    cost: number // USD
  }
  errors?: Array<{
    message: string
    code?: string
    tool?: string
  }>
}
```

### `agent.status()`

Get current agent status.

```typescript
const status = await agent.status()
```

Returns:

```typescript
interface AgentStatus {
  state: 'idle' | 'running' | 'paused' | 'stopped' | 'error'
  executions: number
  errors: number
  uptime: string
  lastExecution?: string
  version: string
  environment: string
}
```

### `agent.metrics(period?)`

Get agent performance metrics.

```typescript
const metrics = await agent.metrics('7d') // '24h', '7d', '30d', '90d'
```

Returns:

```typescript
interface AgentMetrics {
  avgResponseTime: number // milliseconds
  successRate: number // 0-1
  totalExecutions: number
  executions24h: number
  totalTokens: number
  totalCost: number // USD
  topTools: Array<{ tool: string; count: number }>
  errors: Array<{ type: string; count: number }>
  uptimePercentage: number // 0-100
}
```

### `agent.update(updates: Partial<AgentConfig>)`

Update agent configuration.

```typescript
await agent.update({
  temperature: 0.5,
  maxTokens: 1500,
  systemPrompt: 'Updated prompt...',
})
```

### `agent.pause()` / `agent.resume()` / `agent.stop()`

Control agent state.

```typescript
await agent.pause() // Temporarily pause
await agent.resume() // Resume execution
await agent.stop() // Stop (can be restarted)
```

### `agent.delete()`

Permanently delete the agent.

```typescript
await agent.delete()
```

### `listAgents(options?)`

List all deployed agents.

```typescript
const agents = await listAgents({
  apiKey: 'do_xxx',
  baseUrl: 'https://agents.do',
})
```

Returns:

```typescript
Array<{
  id: string
  name: string
  environment: string
  state: AgentState
  url: string
}>
```

### `getAgent(idOrName, options?)`

Get an existing agent by ID or name.

```typescript
const { agent, status } = await getAgent('agent-123', {
  apiKey: 'do_xxx',
})

// Use the retrieved agent
await agent.execute({ input: 'test' })
```

## Tool Definitions

Define tools your agent can use:

```typescript
interface AgentTool {
  name: string
  description: string
  parameters?: Record<string, any> // JSON schema
  requiresApproval?: boolean // For semi-autonomous agents
  execute?: (params: any) => Promise<any> // Optional local execution
}
```

Example:

```typescript
const tools: AgentTool[] = [
  {
    name: 'search_database',
    description: 'Search the customer database',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number', default: 10 },
      },
      required: ['query'],
    },
    requiresApproval: false,
  },
  {
    name: 'send_refund',
    description: 'Process a customer refund',
    parameters: {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
        amount: { type: 'number' },
        reason: { type: 'string' },
      },
      required: ['customerId', 'amount'],
    },
    requiresApproval: true, // Requires approval in semi-autonomous mode
  },
]
```

## Streaming Responses

Stream agent responses in real-time:

```typescript
await agent.execute({
  input: 'Explain quantum computing',
  stream: true,
  onStream: (chunk) => {
    process.stdout.write(chunk)
  },
})
```

## Rate Limiting

Configure rate limits for your agent:

```typescript
const agent = defineAgent({
  name: 'rate-limited-agent',
  rateLimits: {
    perMinute: 10,
    perHour: 100,
    perDay: 1000,
  },
  // ... other config
})
```

## Error Handling

```typescript
try {
  const result = await agent.execute({ input: 'test' })
} catch (error) {
  if (error.message.includes('must be deployed')) {
    console.error('Deploy the agent first')
  } else if (error.message.includes('rejected by user')) {
    console.error('Action was not approved')
  } else {
    console.error('Execution failed:', error.message)
  }
}
```

## Environment Variables

- `DO_API_KEY` - API key for agents.do (optional if passed in options)

## Examples

See `src/agents.examples.ts` for comprehensive examples including:

1. Supervised agent with approval workflow
2. Semi-autonomous sales assistant
3. Fully autonomous data processor
4. Streaming responses
5. Monitoring and management
6. Working with multiple agents
7. Advanced tool definitions
8. Error handling
9. Custom context and metadata
10. Production deployment with custom domain

## TypeScript Support

The SDK is written in TypeScript with full type definitions.

```typescript
import type { AgentConfig, AgentTool, ExecuteResult, AgentStatus, AgentMetrics, PendingAction, ExecutedAction } from '@dotdo/sdk.do'
```

## Testing

The SDK includes comprehensive tests (37 test cases):

```bash
pnpm test agents.test.ts
```

## License

MIT

## Support

- Documentation: https://agents.do/docs
- GitHub: https://github.com/dot-do/platform
- Discord: https://discord.gg/dotdo

---

Built with ❤️ by the `.do` team
