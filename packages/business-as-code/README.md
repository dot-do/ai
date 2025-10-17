# business-as-code

Business-as-Code abstractions and types for autonomous business operations on the `.do` platform.

## Installation

```bash
pnpm add business-as-code
```

## Overview

Business-as-Code is a paradigm for defining and executing business logic, workflows, and operations as code. This package provides TypeScript types and API clients for building autonomous business systems using the `.do` platform.

## Core Concepts

### Functions

Typesafe, composable business logic units.

```typescript
import type { BusinessFunction } from 'business-as-code'
import { createBusinessApi } from 'business-as-code'

const calculateROI: BusinessFunction<{ revenue: number; cost: number }, number> = {
  id: 'calc-roi',
  name: 'Calculate ROI',
  description: 'Calculate return on investment',
  execute: async ({ revenue, cost }) => {
    return ((revenue - cost) / cost) * 100
  },
}

// Execute via API
const api = createBusinessApi({ apiKey: process.env.API_KEY })
const result = await api.functions.execute('calc-roi', { revenue: 10000, cost: 5000 })
console.log(`ROI: ${result}%`)
```

### Workflows

Declarative orchestration of business processes.

```typescript
import type { BusinessWorkflow } from 'business-as-code'

const onboardingWorkflow: BusinessWorkflow = {
  id: 'customer-onboarding',
  name: 'Customer Onboarding',
  description: 'Automated customer onboarding process',
  steps: [
    {
      id: 'create-account',
      name: 'Create Account',
      type: 'function',
      function: 'create-customer-account',
      next: 'send-welcome',
    },
    {
      id: 'send-welcome',
      name: 'Send Welcome Email',
      type: 'function',
      function: 'send-email',
      next: 'assign-rep',
    },
    {
      id: 'assign-rep',
      name: 'Assign Sales Rep',
      type: 'agent',
      config: { agentRole: 'sdr' },
    },
  ],
  triggers: [
    {
      type: 'event',
      config: { eventType: 'customer.signup' },
    },
  ],
}

// Trigger workflow
const { executionId } = await api.workflows.trigger('customer-onboarding', {
  customerId: '123',
  email: 'customer@example.com',
})
```

### Agents

Autonomous digital workers that execute functions and workflows.

```typescript
import type { BusinessAgent } from 'business-as-code'

const salesAgent: BusinessAgent = {
  id: 'sdr-amy',
  name: 'Amy - Sales Development Rep',
  role: 'sdr',
  functions: ['qualify-lead', 'send-outreach', 'schedule-demo'],
  workflows: ['lead-qualification', 'outreach-sequence'],
  capabilities: ['email', 'calendar', 'crm'],
  config: {
    model: 'claude-3-5-sonnet',
    temperature: 0.7,
  },
}

// Create and assign task to agent
const agent = await api.agents.create(salesAgent)
await api.agents.assign(agent.id, {
  type: 'qualify-leads',
  data: { leads: [...] },
})
```

### Resources (Nouns)

Entities and data objects in your business.

```typescript
import type { BusinessResource } from 'business-as-code'

const customer: BusinessResource = {
  $id: 'customer-123',
  $type: 'Customer',
  name: 'Acme Corp',
  email: 'contact@acme.com',
  status: 'active',
  plan: 'enterprise',
}

// CRUD operations
await api.resources.create(customer)
const retrieved = await api.resources.get('Customer', 'customer-123')
await api.resources.update({ ...customer, status: 'premium' })
await api.resources.delete('Customer', 'customer-123')
```

### Actions (Verbs)

Operations performed by or on resources.

```typescript
import type { BusinessAction } from 'business-as-code'

const purchase: BusinessAction = {
  id: 'action-456',
  verb: 'purchase',
  subject: 'customer-123',
  object: 'product-789',
  status: 'completed',
  timestamp: new Date().toISOString(),
  context: {
    amount: 99.99,
    currency: 'USD',
  },
}

await api.actions.execute(purchase)
```

### Events

Business or system events that trigger workflows.

```typescript
import type { BusinessEvent } from 'business-as-code'

const signupEvent: BusinessEvent = {
  id: 'evt-001',
  type: 'customer.signup',
  timestamp: new Date().toISOString(),
  source: 'website',
  data: {
    customerId: '123',
    email: 'new@customer.com',
    plan: 'starter',
  },
}

await api.events.publish(signupEvent)
```

### Queries

Search and retrieve business data.

```typescript
import type { BusinessQuery } from 'business-as-code'

const query: BusinessQuery = {
  query: 'enterprise customers in California',
  types: ['Customer'],
  filters: {
    plan: 'enterprise',
    'address.state': 'CA',
  },
  sort: {
    field: 'revenue',
    order: 'desc',
  },
  pagination: {
    page: 1,
    pageSize: 50,
  },
}

const results = await api.searches.query(query)
```

### Metrics

Track KPIs and OKRs.

```typescript
import type { BusinessMetric } from 'business-as-code'

const mrr: BusinessMetric = {
  id: 'mrr-2025-01',
  name: 'Monthly Recurring Revenue',
  type: 'kpi',
  value: 150000,
  target: 200000,
  unit: 'USD',
  timestamp: '2025-01-01',
}

await api.metrics.record(mrr)
```

## API Client

The package includes a complete API client for interacting with `apis.do`:

```typescript
import { createBusinessApi } from 'business-as-code'

const api = createBusinessApi({
  baseUrl: 'https://apis.do', // optional, default
  apiKey: process.env.API_KEY,
  headers: {
    // custom headers
  },
})

// Use the API
await api.functions.execute(...)
await api.workflows.trigger(...)
await api.agents.create(...)
await api.resources.get(...)
await api.actions.execute(...)
await api.events.publish(...)
await api.searches.query(...)
await api.metrics.record(...)
```

## Security Best Practices

When using the API client, follow these security guidelines:

### API Key Management

- **Never commit API keys** to version control
- **Use environment variables** to store sensitive credentials
- **Rotate keys regularly** to minimize exposure risk
- **Use different keys** for development, staging, and production environments

```typescript
// ✅ Good: Use environment variables
const api = createBusinessApi({
  apiKey: process.env.API_KEY,
})

// ❌ Bad: Never hardcode keys
const api = createBusinessApi({
  apiKey: 'sk_live_abc123...', // NEVER DO THIS
})
```

### Environment Configuration

Create a `.env` file (and add it to `.gitignore`):

```bash
API_KEY=your_api_key_here
API_BASE_URL=https://apis.do
```

Load environment variables securely:

```typescript
import 'dotenv/config'

const api = createBusinessApi({
  apiKey: process.env.API_KEY,
  baseUrl: process.env.API_BASE_URL,
})
```

### Additional Security Measures

- **Validate inputs** before passing to functions to prevent injection attacks
- **Implement rate limiting** in your application to prevent abuse
- **Use HTTPS** for all API communications (enabled by default)
- **Monitor API usage** for unusual patterns that may indicate compromise
- **Restrict API key permissions** to only what's necessary for your use case

## Integration

Works seamlessly with:

- **do.industries** - Domain and industry definitions
- **services-as-software** - Service implementation patterns
- **graphdl** - Semantic graph relationships
- **schema.org.ai** - Entity schemas

## Philosophy

Business-as-Code enables you to:

1. **Define** business logic as typesafe functions
2. **Compose** functions into declarative workflows
3. **Automate** with autonomous agents
4. **Track** resources, actions, and events
5. **Measure** with KPIs and OKRs
6. **Scale** with APIs and integrations

## Example: Complete Business Process

```typescript
import { createBusinessApi } from 'business-as-code'

const api = createBusinessApi({ apiKey: process.env.API_KEY })

// 1. Define a function
const qualifyLead: BusinessFunction = {
  id: 'qualify-lead',
  name: 'Qualify Lead',
  execute: async (lead) => {
    // Lead qualification logic
    return { score: 85, qualified: true }
  },
}

// 2. Create a workflow
const salesWorkflow: BusinessWorkflow = {
  id: 'sales-process',
  name: 'Sales Process',
  steps: [
    { id: 'qualify', type: 'function', function: 'qualify-lead', next: 'check-score' },
    { id: 'check-score', type: 'condition', condition: 'score > 70', next: 'assign-sdr' },
    { id: 'assign-sdr', type: 'agent', config: { role: 'sdr' } },
  ],
  triggers: [{ type: 'event', config: { eventType: 'lead.created' } }],
}

// 3. Create an agent
const sdr = await api.agents.create({
  name: 'SDR Bot',
  role: 'sdr',
  functions: ['qualify-lead', 'send-outreach'],
  capabilities: ['email', 'calendar'],
})

// 4. Trigger workflow when event occurs
const event = await api.events.publish({
  type: 'lead.created',
  timestamp: new Date().toISOString(),
  source: 'website-form',
  data: { email: 'lead@example.com' },
})

// 5. Track metrics
await api.metrics.record({
  name: 'Qualified Leads',
  type: 'kpi',
  value: 42,
  target: 50,
  unit: 'count',
})
```

## License

MIT
