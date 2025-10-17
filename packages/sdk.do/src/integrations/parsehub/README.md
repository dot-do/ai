# Parsehub Integration

ParseHub is a web scraping tool that allows users to extract data from websites without coding.

**Category**: productivity
**Service**: Parsehub
**Base URL**: https://api.parsehub.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/parsehub](https://integrations.do/parsehub)

## Installation

```bash
npm install @dotdo/integration-parsehub
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-parsehub
```

## Quick Start

```typescript
import { ParsehubClient } from '@dotdo/integration-parsehub'

// Initialize client
const client = new ParsehubClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ParsehubClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Parsehub actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ParsehubError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ParsehubError) {
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
