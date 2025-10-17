# Apilio Integration

Apilio is a home automation platform that enables users to connect and control smart devices from various brands, offering flexible automation through complex conditions, time constraints, and integrations with services like IFTTT and Tuya.

**Category**: productivity
**Service**: Apilio
**Base URL**: https://api.apilio.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/apilio](https://integrations.do/apilio)

## Installation

```bash
npm install @dotdo/integration-apilio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-apilio
```

## Quick Start

```typescript
import { ApilioClient } from '@dotdo/integration-apilio'

// Initialize client
const client = new ApilioClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ApilioClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Apilio actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ApilioError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ApilioError) {
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
