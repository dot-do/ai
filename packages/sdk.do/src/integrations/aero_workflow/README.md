# Aero workflow Integration

Aero Workflow is a practice management tool for accounting firms, offering task tracking, time billing, and client collaboration in a centralized workspace

**Category**: accounting
**Service**: AeroWorkflow
**Base URL**: https://api.aero_workflow.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/aero_workflow](https://integrations.do/aero_workflow)

## Installation

```bash
npm install @dotdo/integration-aero_workflow
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-aero_workflow
```

## Quick Start

```typescript
import { AeroWorkflowClient } from '@dotdo/integration-aero_workflow'

// Initialize client
const client = new AeroWorkflowClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AeroWorkflowClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Aero workflow actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AeroWorkflowError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AeroWorkflowError) {
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
