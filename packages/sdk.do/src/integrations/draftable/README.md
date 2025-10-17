# Draftable Integration

Draftable provides an enterprise-grade document comparison API that allows developers to compare popular document types such as PDFs, Word, and PowerPoint files.

**Category**: productivity
**Service**: Draftable
**Base URL**: https://api.draftable.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/draftable](https://integrations.do/draftable)

## Installation

```bash
npm install @dotdo/integration-draftable
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-draftable
```

## Quick Start

```typescript
import { DraftableClient } from '@dotdo/integration-draftable'

// Initialize client
const client = new DraftableClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DraftableClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Draftable actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DraftableError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DraftableError) {
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
