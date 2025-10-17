# Centralstationcrm Integration

CentralStationCRM is an easy-to-use CRM software focusing on collaboration and long-term customer relationships.

**Category**: productivity
**Service**: Centralstationcrm
**Base URL**: https://api.centralstationcrm.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/centralstationcrm](https://integrations.do/centralstationcrm)

## Installation

```bash
npm install @dotdo/integration-centralstationcrm
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-centralstationcrm
```

## Quick Start

```typescript
import { CentralstationcrmClient } from '@dotdo/integration-centralstationcrm'

// Initialize client
const client = new CentralstationcrmClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CentralstationcrmClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Centralstationcrm actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CentralstationcrmError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CentralstationcrmError) {
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
