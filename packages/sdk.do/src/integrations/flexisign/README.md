# Flexisign Integration

FlexiSign is a privacy and security-focused e-signature tool that simplifies how you sign, send, and manage documents.

**Category**: productivity
**Service**: Flexisign
**Base URL**: https://api.flexisign.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/flexisign](https://integrations.do/flexisign)

## Installation

```bash
npm install @dotdo/integration-flexisign
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-flexisign
```

## Quick Start

```typescript
import { FlexisignClient } from '@dotdo/integration-flexisign'

// Initialize client
const client = new FlexisignClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FlexisignClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Flexisign actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FlexisignError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FlexisignError) {
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
