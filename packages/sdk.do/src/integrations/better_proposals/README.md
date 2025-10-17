# Better proposals Integration

Better Proposals is a web-based proposal creation tool that enables users to send professionally designed proposals.

**Category**: productivity
**Service**: BetterProposals
**Base URL**: https://api.better_proposals.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/better_proposals](https://integrations.do/better_proposals)

## Installation

```bash
npm install @dotdo/integration-better_proposals
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-better_proposals
```

## Quick Start

```typescript
import { BetterProposalsClient } from '@dotdo/integration-better_proposals'

// Initialize client
const client = new BetterProposalsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BetterProposalsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Better proposals actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BetterProposalsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BetterProposalsError) {
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
