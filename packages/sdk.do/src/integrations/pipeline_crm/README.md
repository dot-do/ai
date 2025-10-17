# Pipeline crm Integration

Pipeline CRM is a sales-focused customer relationship management tool designed to help teams track leads, manage deals, and streamline workflows.

**Category**: productivity
**Service**: PipelineCrm
**Base URL**: https://api.pipeline_crm.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pipeline_crm](https://integrations.do/pipeline_crm)

## Installation

```bash
npm install @dotdo/integration-pipeline_crm
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pipeline_crm
```

## Quick Start

```typescript
import { PipelineCrmClient } from '@dotdo/integration-pipeline_crm'

// Initialize client
const client = new PipelineCrmClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PipelineCrmClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Pipeline crm actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PipelineCrmError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PipelineCrmError) {
    console.error('Error type:', error.type)
    console.error('Error code:', error.code)
    console.error('Status code:', error.statusCode)
    console.error('Retryable:', error.isRetriable())
  }
}
```

**Error Types:**

- `authentication` - Authentication failed
- `authorization` - Insufficient permissions
- `validation` - Invalid parameters
- `not_found` - Resource not found
- `rate_limit` - Rate limit exceeded
- `server` - Server error
- `network` - Network error
- `unknown` - Unknown error

## License

MIT
