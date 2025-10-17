# Supportbee Integration

SupportBee is a web-based email support tool that helps businesses organize their customer support emails efficiently.

**Category**: productivity
**Service**: Supportbee
**Base URL**: https://api.supportbee.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/supportbee](https://integrations.do/supportbee)

## Installation

```bash
npm install @dotdo/integration-supportbee
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-supportbee
```

## Quick Start

```typescript
import { SupportbeeClient } from '@dotdo/integration-supportbee'

// Initialize client
const client = new SupportbeeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SupportbeeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Supportbee actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SupportbeeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SupportbeeError) {
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
