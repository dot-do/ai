# Agenty Integration

Agenty is a web scraping and automation platform that enables users to extract data, monitor changes, and automate browser tasks without coding.

**Category**: productivity
**Service**: Agenty
**Base URL**: https://api.agenty.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/agenty](https://integrations.do/agenty)

## Installation

```bash
npm install @dotdo/integration-agenty
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-agenty
```

## Quick Start

```typescript
import { AgentyClient } from '@dotdo/integration-agenty'

// Initialize client
const client = new AgentyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AgentyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Agenty actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AgentyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AgentyError) {
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
