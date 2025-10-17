# Parseur Integration

Parseur is an AI-powered data extraction tool that automates the parsing of emails, PDFs, and other documents into structured data.

**Category**: productivity
**Service**: Parseur
**Base URL**: https://api.parseur.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/parseur](https://integrations.do/parseur)

## Installation

```bash
npm install @dotdo/integration-parseur
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-parseur
```

## Quick Start

```typescript
import { ParseurClient } from '@dotdo/integration-parseur'

// Initialize client
const client = new ParseurClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ParseurClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Parseur actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ParseurError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ParseurError) {
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
