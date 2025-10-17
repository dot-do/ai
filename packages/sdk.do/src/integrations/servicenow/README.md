# Servicenow Integration

Servicenow provides IT Service Management Transform service management to boost productivity and maximize ROI

**Category**: analytics
**Service**: Servicenow
**Base URL**: https://api.servicenow.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/servicenow](https://integrations.do/servicenow)

## Installation

```bash
npm install @dotdo/integration-servicenow
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-servicenow
```

## Quick Start

```typescript
import { ServicenowClient } from '@dotdo/integration-servicenow'

// Initialize client
const client = new ServicenowClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new ServicenowClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Servicenow actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ServicenowError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ServicenowError) {
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
