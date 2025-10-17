# Airtable Integration

Airtable merges spreadsheet functionality with database power, enabling teams to organize projects, track tasks, and collaborate through customizable views, automation, and integrations for data management

**Category**: productivity
**Service**: Airtable
**Base URL**: https://api.airtable.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/airtable](https://integrations.do/airtable)

## Installation

```bash
npm install @dotdo/integration-airtable
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-airtable
```

## Quick Start

```typescript
import { AirtableClient } from '@dotdo/integration-airtable'

// Initialize client
const client = new AirtableClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new AirtableClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Airtable actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AirtableError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AirtableError) {
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
