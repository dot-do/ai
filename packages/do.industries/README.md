# do.industries

Types and constants for all `.do` domains and industries with API integrations.

## Installation

```bash
pnpm add do.industries
```

## Overview

This package provides comprehensive TypeScript types and data for all `.do` domains that make up the Business-as-Code platform. Each domain represents a specific industry, service, or capability with standardized categorization and API access patterns.

## Usage

### Domain Lookup

```typescript
import { DOMAINS, DOMAIN_MAP } from 'do.industries'

// Get all domains
console.log(DOMAINS.length) // 100+ domains

// Look up a specific domain
const functions = DOMAIN_MAP.get('functions.do')
console.log(functions)
// {
//   domain: 'functions.do',
//   category: 'Function',
//   description: 'Typesafe, composable business logic and automation'
// }
```

### Browse by Category

```typescript
import { DOMAINS_BY_CATEGORY, CATEGORIES } from 'do.industries'

// Get all agents
const agents = DOMAINS_BY_CATEGORY['Agent']
console.log(agents.map((d) => d.domain))
// ['agents.do', 'agi.do', 'amy.do', 'ari.do', 'bdr.do', ...]

// Get all categories
console.log(CATEGORIES)
// ['Function', 'Data Layer', 'Workflow', 'Agent', 'Gateway', ...]
```

### Types

```typescript
import type { Domain, DomainCategory, Industry } from 'do.industries'

const myDomain: Domain = {
  domain: 'custom.do',
  category: 'Utility',
  description: 'Custom utility service',
  apiEndpoint: 'https://custom.do/api',
}

const category: DomainCategory = 'Agent'

const industry: Industry = {
  name: 'Autonomous Workforce',
  domains: ['agents.do', 'workers.do', 'bots.do'],
  category: 'Agent',
  description: 'Autonomous digital workers and agents',
}
```

### API Integration

```typescript
import type { Service } from 'do.industries'

const service: Service = {
  name: 'Function Executor',
  domains: ['functions.do', 'function.do'],
  endpoint: 'https://apis.do/functions',
  methods: ['POST'],
  description: 'Execute typesafe functions',
}

// Use with fetch
async function callService(service: Service, data: any) {
  const response = await fetch(service.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}
```

## Domain Categories

The platform organizes domains into the following categories:

- **Function** - Typesafe, composable business logic
- **Data Layer** - Data access, storage, and management
- **Workflow** - Process orchestration and automation
- **Agent** - Autonomous digital workers
- **Gateway** - API gateways and model access
- **Data Model** - Entity types and schemas
- **Event/Trigger** - Event-driven architecture
- **Query/Search** - Data retrieval and search
- **Action** - Executable operations
- **Evaluation** - Performance testing and benchmarking
- **Analytics** - Metrics and insights
- **Experimentation** - A/B testing and iteration
- **Integration** - External system connections
- **Model Management** - AI/ML model lifecycle
- **API Gateway** - Unified API access
- **CMS/Admin UI** - Content and admin interfaces
- **Business Goal** - OKRs and objectives
- **Platform/Brand** - Core platform services
- **Utility** - Helper services and tools
- **Content/Resource** - Content management
- **Security/Auth** - Authentication and authorization
- **Dev Tool** - Development utilities
- **Business Metric** - KPIs and metrics
- **Human** - Human-in-the-loop services

## Key Domains

### Core Platform

- **functions.do** - Typesafe, composable business logic and automation
- **workflows.do** - Declarative orchestration of business processes
- **agents.do** - Platform for deploying/managing autonomous digital workers
- **database.do** - AI-native data access (search, CRUD, resources)
- **apis.do** - Unified API gateway for all services

### Data & Models

- **nouns.do** - Types of entities: people, places, things, ideas
- **verbs.do** - Actions performed by or to nouns
- **resources.do** - Structured data records (instances of nouns)
- **llm.do** / **llms.do** - Large language model gateway
- **models.do** - AI/ML model selection and management

### Automation & Events

- **triggers.do** / **trigger.do** - Initiate workflows based on events
- **events.do** - Business or system event tracking
- **actions.do** / **action.do** - Perform tasks and operations
- **webhooks.do** / **webhook.do** - Webhook management

### Autonomous Workers

- **bots.do** / **worker.do** / **workers.do** - Digital workers
- **cfo.do**, **cmo.do**, **cto.do**, etc. - C-suite agents
- **swe.do** - Software Engineer agent
- **sdr.do** / **bdr.do** - Sales agents
- **programmers.do** - Programming agents

### Analytics & Optimization

- **analytics.do** - Workflow/business outcome measurement
- **evals.do** - Performance evaluation
- **experiments.do** - Testing and iteration
- **benchmarks.do** - Model/workflow benchmarks
- **okrs.do** - OKR management
- **kpis.do** - KPI tracking

### Utilities

- **searches.do** - Query structured/unstructured data
- **extract.do** - Data extraction and transformation
- **embeddings.do** - Vector embeddings
- **queue.do** - Task and job queues
- **state.do** - State management
- **context.do** / **ctx.do** - Context management

## API Access Pattern

All domains follow a standardized API pattern:

```
https://apis.do/{domain-name}/{action}
```

Example:

```typescript
// Execute a function
POST https://apis.do/functions/execute

// Query data
GET https://apis.do/searches/query

// Trigger a workflow
POST https://apis.do/workflows/trigger

// Create an agent
POST https://apis.do/agents/create
```

## Integration with Business-as-Code

This package is designed to work seamlessly with:

- **business-as-code** - Business logic abstractions
- **services-as-software** - Service implementation patterns
- **graphdl** - Semantic graph types for domain relationships
- **sdk.do** - Core SDK for the `.do` platform

## License

MIT
