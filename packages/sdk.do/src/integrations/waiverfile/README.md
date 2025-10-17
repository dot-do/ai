# Waiverfile Integration

WaiverFile is an electronic waiver form system that allows customers to sign release waivers from any device, streamlining the waiver management process.

**Category**: productivity
**Service**: Waiverfile
**Base URL**: https://api.waiverfile.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/waiverfile](https://integrations.do/waiverfile)

## Installation

```bash
npm install @dotdo/integration-waiverfile
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-waiverfile
```

## Quick Start

```typescript
import { WaiverfileClient } from '@dotdo/integration-waiverfile'

// Initialize client
const client = new WaiverfileClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WaiverfileClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Waiverfile actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WaiverfileError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WaiverfileError) {
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
