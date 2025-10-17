# Callpage Integration

CallPage is a lead capture tool that enables businesses to connect with website visitors through immediate phone callbacks, enhancing lead generation and sales conversion rates.

**Category**: productivity
**Service**: Callpage
**Base URL**: https://api.callpage.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/callpage](https://integrations.do/callpage)

## Installation

```bash
npm install @dotdo/integration-callpage
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-callpage
```

## Quick Start

```typescript
import { CallpageClient } from '@dotdo/integration-callpage'

// Initialize client
const client = new CallpageClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CallpageClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Callpage actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CallpageError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CallpageError) {
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
