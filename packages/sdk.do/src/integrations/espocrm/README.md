# Espocrm Integration

EspoCRM is an open-source web application that allows businesses to manage their customer relationships effectively.

**Category**: productivity
**Service**: Espocrm
**Base URL**: https://api.espocrm.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/espocrm](https://integrations.do/espocrm)

## Installation

```bash
npm install @dotdo/integration-espocrm
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-espocrm
```

## Quick Start

```typescript
import { EspocrmClient } from '@dotdo/integration-espocrm'

// Initialize client
const client = new EspocrmClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EspocrmClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Espocrm actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EspocrmError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EspocrmError) {
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
