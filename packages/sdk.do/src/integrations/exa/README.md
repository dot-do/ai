# Exa Integration

Exa focuses on data extraction and search, helping teams gather, analyze, and visualize information from websites, APIs, or internal databases

**Category**: analytics
**Service**: Exa
**Base URL**: https://api.exa.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/exa](https://integrations.do/exa)

## Installation

```bash
npm install @dotdo/integration-exa
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-exa
```

## Quick Start

```typescript
import { ExaClient } from '@dotdo/integration-exa'

// Initialize client
const client = new ExaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ExaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Exa actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ExaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ExaError) {
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
