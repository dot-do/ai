# Dromo Integration

Dromo is an intuitive spreadsheet importer that integrates seamlessly with your product, enabling users to match columns, correct errors, perform complex validations, transform values, and upload perfectly formatted data.

**Category**: productivity
**Service**: Dromo
**Base URL**: https://api.dromo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dromo](https://integrations.do/dromo)

## Installation

```bash
npm install @dotdo/integration-dromo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dromo
```

## Quick Start

```typescript
import { DromoClient } from '@dotdo/integration-dromo'

// Initialize client
const client = new DromoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DromoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dromo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DromoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DromoError) {
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
