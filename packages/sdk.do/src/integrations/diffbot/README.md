# Diffbot Integration

Diffbot provides AI-powered tools to extract and structure data from web pages, transforming unstructured web content into structured, linked data.

**Category**: productivity
**Service**: Diffbot
**Base URL**: https://api.diffbot.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/diffbot](https://integrations.do/diffbot)

## Installation

```bash
npm install @dotdo/integration-diffbot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-diffbot
```

## Quick Start

```typescript
import { DiffbotClient } from '@dotdo/integration-diffbot'

// Initialize client
const client = new DiffbotClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DiffbotClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Diffbot actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DiffbotError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DiffbotError) {
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
