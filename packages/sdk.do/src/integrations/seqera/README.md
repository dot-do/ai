# Seqera Integration

Seqera Platform is an intuitive, centralized command post that enables data analysis at scale, allowing users to launch, manage, and monitor scalable Nextflow pipelines and compute environments on-premises or across cloud providers.

**Category**: productivity
**Service**: Seqera
**Base URL**: https://api.seqera.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/seqera](https://integrations.do/seqera)

## Installation

```bash
npm install @dotdo/integration-seqera
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-seqera
```

## Quick Start

```typescript
import { SeqeraClient } from '@dotdo/integration-seqera'

// Initialize client
const client = new SeqeraClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SeqeraClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Seqera actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SeqeraError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SeqeraError) {
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
