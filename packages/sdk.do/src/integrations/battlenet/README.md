# Battlenet Integration

Battle.net is a gaming platform by Blizzard Entertainment that hosts titles like World of Warcraft and Overwatch, providing account management, social features, and online matchmaking

**Category**: social-media
**Service**: Battlenet
**Base URL**: https://api.battlenet.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/battlenet](https://integrations.do/battlenet)

## Installation

```bash
npm install @dotdo/integration-battlenet
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-battlenet
```

## Quick Start

```typescript
import { BattlenetClient } from '@dotdo/integration-battlenet'

// Initialize client
const client = new BattlenetClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new BattlenetClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Battlenet actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BattlenetError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BattlenetError) {
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
