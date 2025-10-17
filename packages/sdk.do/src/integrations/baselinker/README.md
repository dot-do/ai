# Baselinker Integration

BaseLinker is a comprehensive e-commerce management platform that integrates with various marketplaces, online stores, carriers, and accounting systems to streamline order processing, inventory management, and sales automation.

**Category**: ecommerce
**Service**: Baselinker
**Base URL**: https://api.baselinker.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/baselinker](https://integrations.do/baselinker)

## Installation

```bash
npm install @dotdo/integration-baselinker
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-baselinker
```

## Quick Start

```typescript
import { BaselinkerClient } from '@dotdo/integration-baselinker'

// Initialize client
const client = new BaselinkerClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BaselinkerClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Baselinker actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BaselinkerError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BaselinkerError) {
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
