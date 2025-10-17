# Autobound Integration

Autobound provides AI-driven sales engagement solutions, offering personalized content generation and actionable insights to enhance sales outreach.

**Category**: productivity
**Service**: Autobound
**Base URL**: https://api.autobound.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/autobound](https://integrations.do/autobound)

## Installation

```bash
npm install @dotdo/integration-autobound
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-autobound
```

## Quick Start

```typescript
import { AutoboundClient } from '@dotdo/integration-autobound'

// Initialize client
const client = new AutoboundClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AutoboundClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Autobound actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AutoboundError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AutoboundError) {
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
