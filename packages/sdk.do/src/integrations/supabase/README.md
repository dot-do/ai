# Supabase Integration

Supabase is an open-source backend-as-a-service providing a Postgres database, authentication, storage, and real-time subscription APIs for building modern applications

**Category**: developer-tools
**Service**: Supabase
**Base URL**: https://api.supabase.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/supabase](https://integrations.do/supabase)

## Installation

```bash
npm install @dotdo/integration-supabase
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-supabase
```

## Quick Start

```typescript
import { SupabaseClient } from '@dotdo/integration-supabase'

// Initialize client
const client = new SupabaseClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SupabaseClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Supabase actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SupabaseError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SupabaseError) {
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
