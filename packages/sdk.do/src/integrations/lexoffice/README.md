# Lexoffice Integration

Lexoffice is a cloud-based accounting software designed for freelancers and small businesses, offering invoicing, expense management, and integration with banks

**Category**: accounting
**Service**: Lexoffice
**Base URL**: https://api.lexoffice.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/lexoffice](https://integrations.do/lexoffice)

## Installation

```bash
npm install @dotdo/integration-lexoffice
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-lexoffice
```

## Quick Start

```typescript
import { LexofficeClient } from '@dotdo/integration-lexoffice'

// Initialize client
const client = new LexofficeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LexofficeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Lexoffice actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LexofficeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LexofficeError) {
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
