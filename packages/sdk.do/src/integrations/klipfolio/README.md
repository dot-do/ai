# Klipfolio Integration

Klipfolio is a cloud-based business intelligence platform that enables users to create and share real-time dashboards and reports.

**Category**: productivity
**Service**: Klipfolio
**Base URL**: https://api.klipfolio.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/klipfolio](https://integrations.do/klipfolio)

## Installation

```bash
npm install @dotdo/integration-klipfolio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-klipfolio
```

## Quick Start

```typescript
import { KlipfolioClient } from '@dotdo/integration-klipfolio'

// Initialize client
const client = new KlipfolioClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new KlipfolioClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Klipfolio actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `KlipfolioError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof KlipfolioError) {
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
