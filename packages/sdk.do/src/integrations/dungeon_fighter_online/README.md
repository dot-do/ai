# Dungeon fighter online Integration

Dungeon Fighter Online (DFO) is an arcade-style, side-scrolling action game with RPG elements, offering players a dynamic combat experience.

**Category**: social-media
**Service**: DungeonFighterOnline
**Base URL**: https://api.dungeon_fighter_online.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dungeon_fighter_online](https://integrations.do/dungeon_fighter_online)

## Installation

```bash
npm install @dotdo/integration-dungeon_fighter_online
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dungeon_fighter_online
```

## Quick Start

```typescript
import { DungeonFighterOnlineClient } from '@dotdo/integration-dungeon_fighter_online'

// Initialize client
const client = new DungeonFighterOnlineClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DungeonFighterOnlineClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dungeon fighter online actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DungeonFighterOnlineError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DungeonFighterOnlineError) {
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
