# digital-workers

[![npm version](https://img.shields.io/npm/v/digital-workers.svg)](https://www.npmjs.com/package/digital-workers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Enhanced autonomous digital workers with event loop, KPI tracking, and communication capabilities. This package builds on the `autonomous-agents` infrastructure to create digital workers with advanced features.

## Purpose

The `digital-workers` package extends the autonomous agents concept by providing:

- Constant event loop for regular evaluation of KPIs against OKRs
- Context and memory management for long-running tasks
- Plan creation and execution for achieving objectives
- Multi-channel communication capabilities (Slack, Teams, Email, Phone)
- Enhanced autonomy through continuous self-evaluation

## How It Builds on autonomous-agents

The `digital-workers` package uses the function-based `Agent` from `autonomous-agents` as its foundation, adding:

- **Event Loop**: Continuous evaluation and adjustment based on KPIs
- **Enhanced Context**: Maintains richer context and memory for improved decision-making
- **Communication Channels**: Integrated support for multiple communication platforms
- **KPI Tracking**: Automated tracking and evaluation of key performance indicators
- **OKR Alignment**: Ensures actions align with organizational objectives and key results

## Installation

```bash
# Using npm
npm install digital-workers

# Using yarn
yarn add digital-workers

# Using pnpm
pnpm add digital-workers
```

## Usage

### Basic Usage

```typescript
import { Worker } from 'digital-workers'

// Create a digital worker for customer support
const supportWorker = Worker({
  name: 'Support Assistant',
  description: 'Handles customer support inquiries and resolves issues',
  id: 'support-worker-1',
  initialContext: {
    department: 'Customer Support',
    specialization: 'Technical Issues',
  },
  initialPlans: [
    {
      name: 'Handle New Tickets',
      steps: ['Review ticket', 'Categorize issue', 'Respond with solution or escalate'],
    },
  ],
  communication: {
    slack: {
      token: process.env.SLACK_TOKEN,
      channels: ['support', 'escalations'],
    },
    email: {
      smtp: process.env.SMTP_CONFIG,
      address: 'support@example.com',
    },
  },
  eventLoop: {
    frequency: '*/15 * * * *', // Cron expression for every 15 minutes
    kpis: ['responseTime', 'resolutionRate', 'customerSatisfaction'],
    okrs: {
      responseTime: { target: '< 30 minutes', weight: 0.3 },
      resolutionRate: { target: '> 85%', weight: 0.4 },
      customerSatisfaction: { target: '> 4.5/5', weight: 0.3 },
    },
  },
})

// Execute a task
const result = await supportWorker.execute({
  action: 'respondToTicket',
  ticketId: '12345',
  message: 'Thank you for your inquiry. Here is the solution...',
})

// Update worker context
await supportWorker.updateContext({
  currentLoad: 'high',
  priorityIssues: ['server-outage', 'payment-processing'],
})

// Send a message via configured channels
await supportWorker.sendMessage('slack', {
  channel: 'support',
  message: 'New high-priority issue detected: server outage',
})
```

## API Reference

### Worker(config)

Creates a new digital worker with the provided configuration.

**Parameters:**

- `config` (WorkerConfig): The configuration for the worker

**Returns:**

- (WorkerInstance): A digital worker instance

### WorkerConfig

The configuration object for creating a worker.

| Property       | Type                | Description                                       |
| -------------- | ------------------- | ------------------------------------------------- |
| name           | string              | The name of the worker                            |
| description    | string              | Description of the worker's purpose               |
| id             | string (optional)   | Unique identifier for the worker                  |
| initialContext | object (optional)   | Initial context data for the worker               |
| initialPlans   | Plan[] (optional)   | Initial plans for the worker to execute           |
| communication  | CommunicationConfig | Configuration for communication channels          |
| eventLoop      | EventLoopConfig     | Configuration for the event loop and KPI tracking |

### WorkerInstance

The worker instance returned by the Worker function.

| Property/Method | Type                                             | Description                                             |
| --------------- | ------------------------------------------------ | ------------------------------------------------------- |
| id              | string                                           | Unique identifier for the worker                        |
| agent           | AutonomousAgent                                  | The underlying autonomous agent                         |
| context         | object                                           | Current context data for the worker                     |
| plans           | Plan[]                                           | Current plans for the worker                            |
| execute         | (input: any) => Promise<any>                     | Executes an action using the underlying agent           |
| updateContext   | (newContext: any) => Promise<void>               | Updates the worker's context                            |
| sendMessage     | (channel: string, message: any) => Promise<void> | Sends a message via the specified communication channel |

## Dependencies

- autonomous-agents: For the underlying agent functionality
- Node.js 18+: For native features like fetch API

## License

MIT
