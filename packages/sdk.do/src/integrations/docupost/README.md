# Docupost Integration

DocuPost is a print and mail service that enables users to send digital files as physical letters and postcards via the U.S. Postal Service.

**Category**: productivity
**Service**: Docupost
**Base URL**: https://api.docupost.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/docupost](https://integrations.do/docupost)

## Installation

```bash
npm install @dotdo/integration-docupost
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-docupost
```

## Quick Start

```typescript
import { DocupostClient } from '@dotdo/integration-docupost'

// Initialize client
const client = new DocupostClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DocupostClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Docupost actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DocupostError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DocupostError) {
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
