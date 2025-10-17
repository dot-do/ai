# Hystruct Integration

Hystruct is an AI-driven web scraping tool that simplifies data extraction from websites using predefined schemas, supporting various data fields like job listings and e-commerce.

**Category**: productivity
**Service**: Hystruct
**Base URL**: https://api.hystruct.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/hystruct](https://integrations.do/hystruct)

## Installation

```bash
npm install @dotdo/integration-hystruct
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-hystruct
```

## Quick Start

```typescript
import { HystructClient } from '@dotdo/integration-hystruct'

// Initialize client
const client = new HystructClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new HystructClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Hystruct actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HystructError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HystructError) {
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
