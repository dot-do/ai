# Lemlist Integration

lemlist is a prospecting tool that automates multichannel outreach, enabling users to find leads with valid contact information and reach them across email, LinkedIn, or calls with personalized messages.

**Category**: productivity
**Service**: Lemlist
**Base URL**: https://api.lemlist.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/lemlist](https://integrations.do/lemlist)

## Installation

```bash
npm install @dotdo/integration-lemlist
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-lemlist
```

## Quick Start

```typescript
import { LemlistClient } from '@dotdo/integration-lemlist'

// Initialize client
const client = new LemlistClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LemlistClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Lemlist actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LemlistError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LemlistError) {
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
