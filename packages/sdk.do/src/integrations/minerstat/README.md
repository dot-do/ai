# Minerstat Integration

minerstat is a comprehensive crypto mining monitoring and management platform offering tools for mining operations, including APIs for coins, hardware, pools, management, and monitoring.

**Category**: productivity
**Service**: Minerstat
**Base URL**: https://api.minerstat.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/minerstat](https://integrations.do/minerstat)

## Installation

```bash
npm install @dotdo/integration-minerstat
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-minerstat
```

## Quick Start

```typescript
import { MinerstatClient } from '@dotdo/integration-minerstat'

// Initialize client
const client = new MinerstatClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MinerstatClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Minerstat actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MinerstatError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MinerstatError) {
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
