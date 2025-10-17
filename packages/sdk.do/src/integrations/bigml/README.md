# Bigml Integration

BigML is a comprehensive machine learning platform that simplifies the creation and deployment of predictive models through an intuitive web interface and a REST API.

**Category**: productivity
**Service**: Bigml
**Base URL**: https://api.bigml.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bigml](https://integrations.do/bigml)

## Installation

```bash
npm install @dotdo/integration-bigml
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bigml
```

## Quick Start

```typescript
import { BigmlClient } from '@dotdo/integration-bigml'

// Initialize client
const client = new BigmlClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BigmlClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bigml actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BigmlError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BigmlError) {
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
