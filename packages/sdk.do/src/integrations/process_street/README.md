# Process street Integration

Process Street supports creating and running checklists, SOPs, and workflows, helping teams automate recurring processes and track compliance

**Category**: productivity
**Service**: ProcessStreet
**Base URL**: https://api.process_street.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/process_street](https://integrations.do/process_street)

## Installation

```bash
npm install @dotdo/integration-process_street
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-process_street
```

## Quick Start

```typescript
import { ProcessStreetClient } from '@dotdo/integration-process_street'

// Initialize client
const client = new ProcessStreetClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ProcessStreetClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Process street actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ProcessStreetError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ProcessStreetError) {
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
