# Apollo Integration

Apollo provides CRM and lead generation capabilities, helping businesses discover contacts, manage outreach, and track sales pipelines for consistent customer relationship development

**Category**: crm
**Service**: Apollo
**Base URL**: https://api.apollo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/apollo](https://integrations.do/apollo)

## Installation

```bash
npm install @dotdo/integration-apollo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-apollo
```

## Quick Start

```typescript
import { ApolloClient } from '@dotdo/integration-apollo'

// Initialize client
const client = new ApolloClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ApolloClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Apollo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ApolloError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ApolloError) {
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
