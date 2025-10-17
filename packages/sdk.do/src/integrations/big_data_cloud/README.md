# Big data cloud Integration

BigDataCloud offers a suite of APIs providing geolocation, reverse geocoding, and data validation services.

**Category**: productivity
**Service**: BigDataCloud
**Base URL**: https://api.big_data_cloud.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/big_data_cloud](https://integrations.do/big_data_cloud)

## Installation

```bash
npm install @dotdo/integration-big_data_cloud
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-big_data_cloud
```

## Quick Start

```typescript
import { BigDataCloudClient } from '@dotdo/integration-big_data_cloud'

// Initialize client
const client = new BigDataCloudClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BigDataCloudClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Big data cloud actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BigDataCloudError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BigDataCloudError) {
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
