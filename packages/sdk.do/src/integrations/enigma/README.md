# Enigma Integration

Enigma provides comprehensive data on U.S. businesses, offering insights into their identity and financial health to support sales, marketing, risk assessment, and compliance processes.

**Category**: productivity
**Service**: Enigma
**Base URL**: https://api.enigma.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/enigma](https://integrations.do/enigma)

## Installation

```bash
npm install @dotdo/integration-enigma
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-enigma
```

## Quick Start

```typescript
import { EnigmaClient } from '@dotdo/integration-enigma'

// Initialize client
const client = new EnigmaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EnigmaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Enigma actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EnigmaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EnigmaError) {
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
