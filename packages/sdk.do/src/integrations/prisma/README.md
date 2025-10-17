# Prisma Integration

Prisma Data Platform provides database tools including Accelerate (global database cache), Optimize (AI-driven query analysis), and Prisma Postgres (managed PostgreSQL). Manage workspaces, projects, environments, and API keys programmatically.

**Category**: productivity
**Service**: Prisma
**Base URL**: https://api.prisma.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/prisma](https://integrations.do/prisma)

## Installation

```bash
npm install @dotdo/integration-prisma
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-prisma
```

## Quick Start

```typescript
import { PrismaClient } from '@dotdo/integration-prisma'

// Initialize client
const client = new PrismaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PrismaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Prisma actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PrismaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PrismaError) {
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
