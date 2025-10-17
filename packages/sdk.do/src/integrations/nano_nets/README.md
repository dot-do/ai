# Nano nets Integration

Nanonets provides an AI-driven Intelligent Document Processing API that transforms unstructured documents into structured data, enabling efficient data extraction and workflow automation.

**Category**: productivity
**Service**: NanoNets
**Base URL**: https://api.nano_nets.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/nano_nets](https://integrations.do/nano_nets)

## Installation

```bash
npm install @dotdo/integration-nano_nets
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-nano_nets
```

## Quick Start

```typescript
import { NanoNetsClient } from '@dotdo/integration-nano_nets'

// Initialize client
const client = new NanoNetsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NanoNetsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Nano nets actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NanoNetsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NanoNetsError) {
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
