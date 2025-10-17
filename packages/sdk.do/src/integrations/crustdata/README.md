# Crustdata Integration

CrustData is an AI-powered data intelligence platform that provides real-time company and people data via APIs and webhooks, empowering B2B sales teams, AI SDRs, and investors to act on live signals

**Category**: marketing
**Service**: Crustdata
**Base URL**: https://api.crustdata.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/crustdata](https://integrations.do/crustdata)

## Installation

```bash
npm install @dotdo/integration-crustdata
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-crustdata
```

## Quick Start

```typescript
import { CrustdataClient } from '@dotdo/integration-crustdata'

// Initialize client
const client = new CrustdataClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CrustdataClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Crustdata actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CrustdataError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CrustdataError) {
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
