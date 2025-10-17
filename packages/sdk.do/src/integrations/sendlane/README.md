# Sendlane Integration

Sendlane is a cloud-based marketing automation platform that helps eCommerce businesses engage customers through personalized email and SMS campaigns.

**Category**: productivity
**Service**: Sendlane
**Base URL**: https://api.sendlane.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sendlane](https://integrations.do/sendlane)

## Installation

```bash
npm install @dotdo/integration-sendlane
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sendlane
```

## Quick Start

```typescript
import { SendlaneClient } from '@dotdo/integration-sendlane'

// Initialize client
const client = new SendlaneClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SendlaneClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Sendlane actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SendlaneError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SendlaneError) {
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
