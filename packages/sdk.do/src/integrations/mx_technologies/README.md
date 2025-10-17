# Mx technologies Integration

MX Technologies provides a comprehensive API platform for aggregating and enhancing financial data, enabling seamless connections to numerous financial institutions.

**Category**: productivity
**Service**: MxTechnologies
**Base URL**: https://api.mx_technologies.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mx_technologies](https://integrations.do/mx_technologies)

## Installation

```bash
npm install @dotdo/integration-mx_technologies
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mx_technologies
```

## Quick Start

```typescript
import { MxTechnologiesClient } from '@dotdo/integration-mx_technologies'

// Initialize client
const client = new MxTechnologiesClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MxTechnologiesClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mx technologies actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MxTechnologiesError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MxTechnologiesError) {
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
