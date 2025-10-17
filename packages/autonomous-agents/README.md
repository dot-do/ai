# autonomous-agents

[![npm version](https://img.shields.io/npm/v/autonomous-agents.svg)](https://www.npmjs.com/package/autonomous-agents)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A function-based Agent API for inherently autonomous agents. This package provides a simple, elegant way to create and manage autonomous agents that can perform actions, respond to events, and integrate with external services.

## 🚧 Implementation Status

**Framework Package** (v0.1.0): This package provides the core **framework** and **type system** for autonomous agents.

**What's Production Ready** ✅:

- Agent configuration and lifecycle management
- Type-safe interfaces and contracts
- State management system
- Event handling infrastructure
- Proxy-based action invocation pattern

**What's Extensible** 🔧 (User/Worker Implementation):

- Specific action logic (`src/utils.ts:48-50`)
- External service integrations (`src/utils.ts:176`)
- Search implementations (`src/utils.ts:210`)

**Design Philosophy**: This is a **framework package** - we provide structure, types, and orchestration patterns. Domain-specific implementations are injected by workers or applications using this framework.

## Purpose

The `autonomous-agents` package embodies the definition of agents as "inherently autonomous" by providing a function-based API that:

- Simplifies agent creation and configuration
- Enables autonomous execution of actions based on triggers
- Facilitates integration with external services using semantic patterns
- Monitors key performance indicators
- Handles errors gracefully in an autonomous context
- Integrates with `sdk.do` semantic patterns (`$.Subject.predicate.Object`)

## How It Differs from agents (Cloudflare)

The `autonomous-agents` package is **fundamentally different** from Cloudflare's `agents` package:

### agents (Cloudflare) - Configuration-Based

- **Purpose**: Universal agent configuration format (YAML/JSON)
- **Ownership**: Cloudflare
- **Use Case**: Parse, render, and manage agent configuration files
- **Tooling**: CLI and SDK for config file operations
- **Architecture**: Configuration-driven with React components for rendering

### autonomous-agents (.do Platform) - Execution-Based

- **Purpose**: Runtime execution framework for fully autonomous agents
- **Ownership**: .do Platform
- **Use Case**: Create and execute self-directed autonomous agents
- **Tooling**: Function-based API with Proxy pattern for dynamic methods
- **Architecture**: Execution-driven with autonomous decision-making

**Key Distinctions:**

- **agents**: Manages agent _configuration_ (the blueprint)
- **autonomous-agents**: Manages agent _execution_ (the runtime)
- **Function-based API**: Uses a functional approach with JavaScript Proxies
- **Simplified Configuration**: Provides an intuitive runtime configuration interface
- **Enhanced Autonomy**: Built with self-directed behavior as the core principle
- **Improved Error Handling**: Designed with robust error handling for autonomous operations
- **Performance Monitoring**: Integrated tracking of key results and performance metrics
- **Semantic Integration**: First-class support for `$.Subject.predicate.Object` patterns

## Installation

```bash
# Using npm
npm install autonomous-agents

# Using yarn
yarn add autonomous-agents

# Using pnpm
pnpm add autonomous-agents
```

## Usage

### Basic Usage

```typescript
import { Agent } from 'autonomous-agents'

// Create a customer support agent
const amy = Agent({
  name: 'Amy',
  url: 'https://amy.do',
  role: 'Customer Support Agent',
  objective: 'Handles customer inquiries and resolves common issues',
  keyResults: ['ticketResponseTime', 'ticketResolutionTime', 'customerSatisfaction'],
  integrations: ['chat', 'slack', 'email', 'zendesk', 'shopify'],
  triggers: ['onTicketCreated', 'onMessageReceived'],
  searches: ['FAQs', 'Tickets', 'Orders', 'Products', 'Customers'],
  actions: ['sendMessage', 'updateOrder', 'refundOrder', 'resolveTicket', 'escalateTicket'],
})
```

### Executing Actions

```typescript
// Execute an action using the 'do' proxy
const result = await amy.do('sendMessage', {
  recipient: 'customer@example.com',
  subject: 'Order Status Update',
  body: 'Your order has been shipped and will arrive in 2-3 business days.',
})

// Execute a custom operation
const customResult = await amy.execute({
  operation: 'processRefund',
  orderId: '12345',
  amount: 99.99,
  reason: 'Customer request',
})
```

### Handling Events

```typescript
// Set up an event handler for a trigger
amy.onTicketCreated(async (ticket) => {
  console.log(`New ticket created: ${ticket.id}`)

  // Automatically respond to the ticket
  await amy.do('sendMessage', {
    ticketId: ticket.id,
    message: 'Thank you for your inquiry. We will respond shortly.',
  })
})
```

### Semantic Pattern Integration

The `autonomous-agents` package integrates with `sdk.do` semantic patterns using the `$.Subject.predicate.Object` notation:

```typescript
import { Agent } from 'autonomous-agents'
import { $ } from 'sdk.do'

// Create an agent with semantic triggers
const salesAgent = Agent({
  name: 'SalesAgent',
  url: 'https://sales-agent.do',
  role: 'Sales Automation Agent',
  objective: 'Automate sales workflows and customer outreach',
  keyResults: ['conversionRate', 'responseTime', 'dealsClosed'],
  integrations: ['crm', 'email', 'calendar'],
  // Semantic event triggers using $.Subject.predicate pattern
  triggers: ['$.Order.created', '$.Lead.qualified', '$.Meeting.scheduled'],
  searches: ['Leads', 'Opportunities', 'Contacts'],
  actions: ['sendEmail', 'createTask', 'updateDeal', 'scheduleMeeting'],
})

// Handle semantic events
salesAgent['$.Lead.qualified'](async (lead) => {
  console.log(`New qualified lead: ${lead.name}`)

  // Autonomous action based on semantic event
  await salesAgent.do('sendEmail', {
    to: lead.email,
    subject: `Welcome ${lead.name}`,
    template: '$.Email.Welcome',
  })

  await salesAgent.do('createTask', {
    type: '$.Task.FollowUp',
    assignee: 'sales-team',
    dueDate: new Date(Date.now() + 86400000), // 24 hours
  })
})
```

**Semantic Pattern Benefits:**

- **Type Safety**: GraphDL types ensure valid semantic patterns
- **Discoverability**: Use `$.` proxy for IDE autocomplete
- **Integration**: Seamless integration with `sdk.do` event system (`on`, `send`)
- **Consistency**: Follow platform-wide semantic conventions

## API Reference

### Agent(config)

Creates a new autonomous agent with the provided configuration.

**Parameters:**

- `config` (AgentConfig): The configuration for the agent

**Returns:**

- (AutonomousAgent): An autonomous agent instance

### AgentConfig

The configuration object for creating an agent.

| Property     | Type     | Description                                    |
| ------------ | -------- | ---------------------------------------------- |
| name         | string   | The name of the agent                          |
| url          | string   | The URL associated with the agent              |
| role         | string   | The role or purpose of the agent               |
| objective    | string   | The main objective or goal of the agent        |
| keyResults   | string[] | Key performance indicators for the agent       |
| integrations | string[] | External services the agent can integrate with |
| triggers     | string[] | Events that the agent can respond to           |
| searches     | string[] | Types of searches the agent can perform        |
| actions      | string[] | Actions that the agent can perform             |

### AutonomousAgent

The agent instance returned by the Agent function.

| Property/Method | Type                                                        | Description                                                                  |
| --------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| config          | AgentConfig                                                 | The configuration of the agent                                               |
| execute         | (input: Record<string, any>, options?: any) => Promise<any> | Executes a custom operation                                                  |
| do              | Proxy                                                       | A proxy for executing actions defined in the agent's configuration           |
| [triggerName]   | Function                                                    | Dynamic event handlers for each trigger defined in the agent's configuration |

## Dependencies

- TypeScript: For type safety and developer experience
- No external runtime dependencies, ensuring a lightweight package

## License

MIT
