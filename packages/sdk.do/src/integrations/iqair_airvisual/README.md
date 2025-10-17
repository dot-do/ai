# Iqair airvisual Integration

IQAir AirVisual provides global air quality data through its API, offering real-time and historical information on air pollution levels.

**Category**: productivity
**Service**: IqairAirvisual
**Base URL**: https://api.iqair_airvisual.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/iqair_airvisual](https://integrations.do/iqair_airvisual)

## Installation

```bash
npm install @dotdo/integration-iqair_airvisual
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-iqair_airvisual
```

## Quick Start

```typescript
import { IqairAirvisualClient } from '@dotdo/integration-iqair_airvisual'

// Initialize client
const client = new IqairAirvisualClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new IqairAirvisualClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Iqair airvisual actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `IqairAirvisualError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof IqairAirvisualError) {
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
