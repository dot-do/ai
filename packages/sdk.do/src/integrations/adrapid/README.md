# Adrapid Integration

Adrapid is a tool designed for efficient creation of digital marketing visuals, including banners, images, videos, and HTML5 content, utilizing reusable templates and offering automation through a REST API.

**Category**: productivity
**Service**: Adrapid
**Base URL**: https://api.adrapid.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/adrapid](https://integrations.do/adrapid)

## Installation

```bash
npm install @dotdo/integration-adrapid
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-adrapid
```

## Quick Start

```typescript
import { AdrapidClient } from '@dotdo/integration-adrapid'

// Initialize client
const client = new AdrapidClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AdrapidClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Adrapid actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AdrapidError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AdrapidError) {
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
