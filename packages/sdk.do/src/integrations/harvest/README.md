# Harvest Integration

Harvest is a time-tracking and invoicing tool designed for teams and freelancers, helping them log billable hours, manage projects, and streamline payments

**Category**: productivity
**Service**: Harvest
**Base URL**: https://api.harvest.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/harvest](https://integrations.do/harvest)

## Installation

```bash
npm install @dotdo/integration-harvest
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-harvest
```

## Quick Start

```typescript
import { HarvestClient } from '@dotdo/integration-harvest'

// Initialize client
const client = new HarvestClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new HarvestClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Harvest actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HarvestError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HarvestError) {
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
