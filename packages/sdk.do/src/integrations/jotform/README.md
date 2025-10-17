# Jotform Integration

Jotform is an online form builder that allows users to create and manage forms for various purposes, including data collection, surveys, and more.

**Category**: productivity
**Service**: Jotform
**Base URL**: https://api.jotform.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/jotform](https://integrations.do/jotform)

## Installation

```bash
npm install @dotdo/integration-jotform
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-jotform
```

## Quick Start

```typescript
import { JotformClient } from '@dotdo/integration-jotform'

// Initialize client
const client = new JotformClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new JotformClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Jotform actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `JotformError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof JotformError) {
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
