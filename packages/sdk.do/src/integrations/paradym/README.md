# Paradym Integration

Paradym is an API-first platform that simplifies the issuance, verification, and management of verifiable credentials, supporting standards like SD-JWT VCs over OpenID4VC and AnonCreds over DIDComm.

**Category**: productivity
**Service**: Paradym
**Base URL**: https://api.paradym.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/paradym](https://integrations.do/paradym)

## Installation

```bash
npm install @dotdo/integration-paradym
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-paradym
```

## Quick Start

```typescript
import { ParadymClient } from '@dotdo/integration-paradym'

// Initialize client
const client = new ParadymClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ParadymClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Paradym actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ParadymError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ParadymError) {
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
