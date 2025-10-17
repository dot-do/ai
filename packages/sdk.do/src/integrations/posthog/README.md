# Posthog Integration

PostHog is an open-source product analytics platform tracking user interactions and behaviors to help teams refine features, improve funnels, and reduce churn

**Category**: analytics
**Service**: Posthog
**Base URL**: https://api.posthog.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/posthog](https://integrations.do/posthog)

## Installation

```bash
npm install @dotdo/integration-posthog
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-posthog
```

## Quick Start

```typescript
import { PosthogClient } from '@dotdo/integration-posthog'

// Initialize client
const client = new PosthogClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PosthogClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Posthog actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PosthogError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PosthogError) {
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
