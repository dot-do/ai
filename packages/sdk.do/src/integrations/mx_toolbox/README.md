# Mx toolbox Integration

MxToolbox provides a suite of network diagnostic and monitoring tools, including DNS lookups, blacklist checks, and email health analysis.

**Category**: productivity
**Service**: MxToolbox
**Base URL**: https://api.mx_toolbox.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mx_toolbox](https://integrations.do/mx_toolbox)

## Installation

```bash
npm install @dotdo/integration-mx_toolbox
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mx_toolbox
```

## Quick Start

```typescript
import { MxToolboxClient } from '@dotdo/integration-mx_toolbox'

// Initialize client
const client = new MxToolboxClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MxToolboxClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mx toolbox actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MxToolboxError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MxToolboxError) {
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
