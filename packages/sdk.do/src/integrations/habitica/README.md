# Habitica Integration

Habitica is an open-source task management application that gamifies productivity by turning tasks into role-playing game elements.

**Category**: productivity
**Service**: Habitica
**Base URL**: https://api.habitica.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/habitica](https://integrations.do/habitica)

## Installation

```bash
npm install @dotdo/integration-habitica
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-habitica
```

## Quick Start

```typescript
import { HabiticaClient } from '@dotdo/integration-habitica'

// Initialize client
const client = new HabiticaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new HabiticaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Habitica actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HabiticaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HabiticaError) {
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
