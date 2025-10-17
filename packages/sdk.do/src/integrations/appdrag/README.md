# Appdrag Integration

AppDrag is a cloud-based platform for building websites, APIs, and databases with drag-and-drop tools, code editing, and integrated hosting to accelerate development workflows and iteration

**Category**: developer-tools
**Service**: Appdrag
**Base URL**: https://api.appdrag.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/appdrag](https://integrations.do/appdrag)

## Installation

```bash
npm install @dotdo/integration-appdrag
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-appdrag
```

## Quick Start

```typescript
import { AppdragClient } from '@dotdo/integration-appdrag'

// Initialize client
const client = new AppdragClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AppdragClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Appdrag actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AppdragError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AppdragError) {
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
