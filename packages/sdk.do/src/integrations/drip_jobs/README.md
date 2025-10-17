# Drip jobs Integration

DripJobs is a Customer Resource Management system designed to help funnel leads through a strategic process to gain more jobs and increase revenue.

**Category**: productivity
**Service**: DripJobs
**Base URL**: https://api.drip_jobs.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/drip_jobs](https://integrations.do/drip_jobs)

## Installation

```bash
npm install @dotdo/integration-drip_jobs
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-drip_jobs
```

## Quick Start

```typescript
import { DripJobsClient } from '@dotdo/integration-drip_jobs'

// Initialize client
const client = new DripJobsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DripJobsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Drip jobs actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DripJobsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DripJobsError) {
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
