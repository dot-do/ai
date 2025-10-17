# Dovetail Integration

Dovetail is an Australian software company that provides tools for transcription analysis, coding interpretation of interviews, survey responses, and feedback, enabling users to create summarized insights from their research analysis.

**Category**: productivity
**Service**: Dovetail
**Base URL**: https://api.dovetail.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dovetail](https://integrations.do/dovetail)

## Installation

```bash
npm install @dotdo/integration-dovetail
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dovetail
```

## Quick Start

```typescript
import { DovetailClient } from '@dotdo/integration-dovetail'

// Initialize client
const client = new DovetailClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DovetailClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dovetail actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DovetailError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DovetailError) {
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
