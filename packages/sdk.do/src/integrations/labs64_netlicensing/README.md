# Labs64 netlicensing Integration

Labs64 NetLicensing is a license management software designed to help software vendors and developers efficiently manage their software licenses and distribution.

**Category**: productivity
**Service**: Labs64Netlicensing
**Base URL**: https://api.labs64_netlicensing.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/labs64_netlicensing](https://integrations.do/labs64_netlicensing)

## Installation

```bash
npm install @dotdo/integration-labs64_netlicensing
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-labs64_netlicensing
```

## Quick Start

```typescript
import { Labs64NetlicensingClient } from '@dotdo/integration-labs64_netlicensing'

// Initialize client
const client = new Labs64NetlicensingClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new Labs64NetlicensingClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Labs64 netlicensing actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `Labs64NetlicensingError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof Labs64NetlicensingError) {
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
