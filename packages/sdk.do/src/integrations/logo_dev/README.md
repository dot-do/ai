# Logo dev Integration

Logo.dev provides a high-quality logo API and company brand database, enabling developers to retrieve official high-resolution logos from any domain without scraping or manual effort.

**Category**: productivity
**Service**: LogoDev
**Base URL**: https://api.logo_dev.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/logo_dev](https://integrations.do/logo_dev)

## Installation

```bash
npm install @dotdo/integration-logo_dev
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-logo_dev
```

## Quick Start

```typescript
import { LogoDevClient } from '@dotdo/integration-logo_dev'

// Initialize client
const client = new LogoDevClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LogoDevClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Logo dev actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LogoDevError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LogoDevError) {
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
