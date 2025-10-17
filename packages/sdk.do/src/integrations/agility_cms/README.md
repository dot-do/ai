# Agility cms Integration

Agility CMS is a headless content management system that allows developers to build and manage digital experiences across various platforms.

**Category**: productivity
**Service**: AgilityCms
**Base URL**: https://api.agility_cms.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/agility_cms](https://integrations.do/agility_cms)

## Installation

```bash
npm install @dotdo/integration-agility_cms
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-agility_cms
```

## Quick Start

```typescript
import { AgilityCmsClient } from '@dotdo/integration-agility_cms'

// Initialize client
const client = new AgilityCmsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AgilityCmsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Agility cms actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AgilityCmsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AgilityCmsError) {
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
