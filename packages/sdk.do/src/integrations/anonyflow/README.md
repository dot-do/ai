# Anonyflow Integration

AnonyFlow offers a simple and powerful service for encryption-based data anonymization and community sharing, enabling GDPR, CCPA, and HIPAA data privacy protection compliance.

**Category**: productivity
**Service**: Anonyflow
**Base URL**: https://api.anonyflow.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/anonyflow](https://integrations.do/anonyflow)

## Installation

```bash
npm install @dotdo/integration-anonyflow
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-anonyflow
```

## Quick Start

```typescript
import { AnonyflowClient } from '@dotdo/integration-anonyflow'

// Initialize client
const client = new AnonyflowClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AnonyflowClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Anonyflow actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AnonyflowError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AnonyflowError) {
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
