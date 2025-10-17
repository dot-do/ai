# Botsonic Integration

Botsonic is a no-code AI chatbot builder that enables users to create and integrate AI chatbots into their websites without any coding knowledge.

**Category**: productivity
**Service**: Botsonic
**Base URL**: https://api.botsonic.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/botsonic](https://integrations.do/botsonic)

## Installation

```bash
npm install @dotdo/integration-botsonic
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-botsonic
```

## Quick Start

```typescript
import { BotsonicClient } from '@dotdo/integration-botsonic'

// Initialize client
const client = new BotsonicClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BotsonicClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Botsonic actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BotsonicError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BotsonicError) {
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
