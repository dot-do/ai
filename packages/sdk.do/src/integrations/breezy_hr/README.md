# Breezy hr Integration

Integrate Breezy HR to streamline your recruiting and applicant tracking processes.

**Category**: hr
**Service**: BreezyHr
**Base URL**: https://api.breezy_hr.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/breezy_hr](https://integrations.do/breezy_hr)

## Installation

```bash
npm install @dotdo/integration-breezy_hr
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-breezy_hr
```

## Quick Start

```typescript
import { BreezyHrClient } from '@dotdo/integration-breezy_hr'

// Initialize client
const client = new BreezyHrClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BreezyHrClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Breezy hr actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BreezyHrError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BreezyHrError) {
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
