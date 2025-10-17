# Docmosis Integration

Docmosis generates PDF and Word documents from templates, letting developers merge data fields to produce reports, invoices, or letters quickly

**Category**: storage
**Service**: Docmosis
**Base URL**: https://api.docmosis.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/docmosis](https://integrations.do/docmosis)

## Installation

```bash
npm install @dotdo/integration-docmosis
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-docmosis
```

## Quick Start

```typescript
import { DocmosisClient } from '@dotdo/integration-docmosis'

// Initialize client
const client = new DocmosisClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DocmosisClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Docmosis actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DocmosisError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DocmosisError) {
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
