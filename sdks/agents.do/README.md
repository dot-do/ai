# agents.do

TypeScript SDK and CLI for autonomous agent orchestration and management.

## Installation

```bash
pnpm add agents.do
```

## CLI Usage

### Authentication

```bash
# Login with OAuth
agents auth login

# Check authentication status
agents auth status

# Validate token
agents auth validate

# Set API key
agents auth set-token <token>

# Set admin token
agents auth set-admin-token <token>

# Logout
agents auth logout
```

### Agent Management

```bash
# List all agents
agents list

# Create a new agent
agents create my-agent --description "My autonomous agent"

# Get agent details
agents get <agent-id>

# Start an agent
agents start <agent-id>

# Stop an agent
agents stop <agent-id>

# View agent logs
agents logs <agent-id>
agents logs <agent-id> --follow
agents logs <agent-id> --lines 50

# Delete an agent
agents delete <agent-id>
```

## SDK Usage

```typescript
import {
  createAgent,
  listAgents,
  getAgent,
  startAgent,
  stopAgent,
  deleteAgent,
} from 'agents.do'

// Create a new agent
const agent = await createAgent({
  name: 'my-agent',
  description: 'My autonomous agent',
  capabilities: ['code-generation', 'data-analysis'],
})

// List all agents
const agents = await listAgents()

// Get agent details
const details = await getAgent(agent.id)

// Start the agent
await startAgent(agent.id)

// Stop the agent
await stopAgent(agent.id)

// Delete the agent
await deleteAgent(agent.id)
```

## Environment Variables

Authentication tokens can be provided via environment variables:

```bash
DO_TOKEN=your_api_key
DO_ADMIN_TOKEN=your_admin_token
```

Or use OAuth authentication with `agents auth login`.

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

## License

MIT
