# Dotsimple Integration

DotSimple is a comprehensive social media management tool that enables users to plan, create, and publish content across multiple platforms, leveraging AI for content generation and providing analytics for performance optimization.

**Category**: productivity
**Service**: Dotsimple
**Base URL**: https://api.dotsimple.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dotsimple](https://integrations.do/dotsimple)

## Installation

```bash
npm install @dotdo/integration-dotsimple
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dotsimple
```

## Quick Start

```typescript
import { DotsimpleClient } from '@dotdo/integration-dotsimple'

// Initialize client
const client = new DotsimpleClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DotsimpleClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dotsimple actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DotsimpleError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DotsimpleError) {
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
