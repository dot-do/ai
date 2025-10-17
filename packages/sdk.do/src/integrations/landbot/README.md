# Landbot Integration

Landbot is a no-code chatbot builder that enables businesses to create conversational experiences for customer engagement, lead generation, and support across various messaging channels.

**Category**: productivity
**Service**: Landbot
**Base URL**: https://api.landbot.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/landbot](https://integrations.do/landbot)

## Installation

```bash
npm install @dotdo/integration-landbot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-landbot
```

## Quick Start

```typescript
import { LandbotClient } from '@dotdo/integration-landbot'

// Initialize client
const client = new LandbotClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LandbotClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Landbot actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LandbotError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LandbotError) {
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
