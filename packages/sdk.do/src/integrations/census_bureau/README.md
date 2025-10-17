# Census bureau Integration

The Census Bureau Data API provides developers with access to a wide range of statistical data collected by the U.S. Census Bureau, facilitating integration into applications and data visualizations.

**Category**: productivity
**Service**: CensusBureau
**Base URL**: https://api.census_bureau.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/census_bureau](https://integrations.do/census_bureau)

## Installation

```bash
npm install @dotdo/integration-census_bureau
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-census_bureau
```

## Quick Start

```typescript
import { CensusBureauClient } from '@dotdo/integration-census_bureau'

// Initialize client
const client = new CensusBureauClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CensusBureauClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Census bureau actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CensusBureauError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CensusBureauError) {
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
