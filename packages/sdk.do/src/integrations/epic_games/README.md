# Epic games Integration

Epic Games is a video game developer and publisher known for titles like Fortnite and the Unreal Engine, offering an online store and platform

**Category**: social-media
**Service**: EpicGames
**Base URL**: https://api.epic_games.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/epic_games](https://integrations.do/epic_games)

## Installation

```bash
npm install @dotdo/integration-epic_games
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-epic_games
```

## Quick Start

```typescript
import { EpicGamesClient } from '@dotdo/integration-epic_games'

// Initialize client
const client = new EpicGamesClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new EpicGamesClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Epic games actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EpicGamesError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EpicGamesError) {
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
