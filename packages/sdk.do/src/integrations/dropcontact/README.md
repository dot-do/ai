# Dropcontact Integration

Dropcontact is a B2B email finder and data enrichment service that provides verified professional email addresses and enriches contact information.

**Category**: productivity
**Service**: Dropcontact
**Base URL**: https://api.dropcontact.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dropcontact](https://integrations.do/dropcontact)

## Installation

```bash
npm install @dotdo/integration-dropcontact
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dropcontact
```

## Quick Start

```typescript
import { DropcontactClient } from '@dotdo/integration-dropcontact'

// Initialize client
const client = new DropcontactClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DropcontactClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dropcontact actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DropcontactError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DropcontactError) {
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
