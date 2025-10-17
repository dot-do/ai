# Gigasheet Integration

Gigasheet is a big data automation platform that offers a spreadsheet-like interface for analyzing and managing large datasets, enabling users to automate tasks, integrate with various data sources, and streamline data workflows.

**Category**: productivity
**Service**: Gigasheet
**Base URL**: https://api.gigasheet.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gigasheet](https://integrations.do/gigasheet)

## Installation

```bash
npm install @dotdo/integration-gigasheet
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gigasheet
```

## Quick Start

```typescript
import { GigasheetClient } from '@dotdo/integration-gigasheet'

// Initialize client
const client = new GigasheetClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GigasheetClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Gigasheet actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GigasheetError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GigasheetError) {
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
