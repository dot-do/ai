# Daffy Integration

Daffy is a modern platform for charitable giving, offering a donor-advised fund that allows users to set money aside, watch it grow tax-free, and donate to over 1.7 million charities in the U.S.

**Category**: productivity
**Service**: Daffy
**Base URL**: https://api.daffy.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/daffy](https://integrations.do/daffy)

## Installation

```bash
npm install @dotdo/integration-daffy
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-daffy
```

## Quick Start

```typescript
import { DaffyClient } from '@dotdo/integration-daffy'

// Initialize client
const client = new DaffyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DaffyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Daffy actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DaffyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DaffyError) {
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
