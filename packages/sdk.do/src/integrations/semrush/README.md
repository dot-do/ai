# Semrush Integration

Semrush is a popular SEO tool suite that specializes in keyword research, competitor analysis, and Google Ad campaign optimization.

**Category**: productivity
**Service**: Semrush
**Base URL**: https://api.semrush.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/semrush](https://integrations.do/semrush)

## Installation

```bash
npm install @dotdo/integration-semrush
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-semrush
```

## Quick Start

```typescript
import { SemrushClient } from '@dotdo/integration-semrush'

// Initialize client
const client = new SemrushClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SemrushClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Semrush actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SemrushError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SemrushError) {
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
