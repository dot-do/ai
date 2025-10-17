# Workiom Integration

Workiom allows businesses to create custom workflows, integrate apps, and automate processes, reducing manual overhead and streamlining operations

**Category**: productivity
**Service**: Workiom
**Base URL**: https://api.workiom.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/workiom](https://integrations.do/workiom)

## Installation

```bash
npm install @dotdo/integration-workiom
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-workiom
```

## Quick Start

```typescript
import { WorkiomClient } from '@dotdo/integration-workiom'

// Initialize client
const client = new WorkiomClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WorkiomClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Workiom actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WorkiomError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WorkiomError) {
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
