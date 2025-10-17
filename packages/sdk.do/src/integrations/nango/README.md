# Nango Integration

Nango provides a unified API to integrate with over 250 external APIs, offering pre-built and customizable integrations for various categories such as CRM, HR, and accounting systems.

**Category**: productivity
**Service**: Nango
**Base URL**: https://api.nango.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/nango](https://integrations.do/nango)

## Installation

```bash
npm install @dotdo/integration-nango
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-nango
```

## Quick Start

```typescript
import { NangoClient } from '@dotdo/integration-nango'

// Initialize client
const client = new NangoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NangoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Nango actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NangoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NangoError) {
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
