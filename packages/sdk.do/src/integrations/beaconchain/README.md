# Beaconchain Integration

Beaconchain is a platform providing real-time data and analytics for the Ethereum 2.0 Beacon Chain, offering insights into validators, blocks, and network performance.

**Category**: productivity
**Service**: Beaconchain
**Base URL**: https://api.beaconchain.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/beaconchain](https://integrations.do/beaconchain)

## Installation

```bash
npm install @dotdo/integration-beaconchain
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-beaconchain
```

## Quick Start

```typescript
import { BeaconchainClient } from '@dotdo/integration-beaconchain'

// Initialize client
const client = new BeaconchainClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BeaconchainClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Beaconchain actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BeaconchainError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BeaconchainError) {
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
