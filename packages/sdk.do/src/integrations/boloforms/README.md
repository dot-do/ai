# Boloforms Integration

BoloForms is an eSignature platform designed for small businesses, offering unlimited signatures, templates, forms, and team members at a fixed price.

**Category**: productivity
**Service**: Boloforms
**Base URL**: https://api.boloforms.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/boloforms](https://integrations.do/boloforms)

## Installation

```bash
npm install @dotdo/integration-boloforms
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-boloforms
```

## Quick Start

```typescript
import { BoloformsClient } from '@dotdo/integration-boloforms'

// Initialize client
const client = new BoloformsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BoloformsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Boloforms actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BoloformsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BoloformsError) {
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
