# Contentful Integration

Contentful is a headless CMS allowing developers to create, manage, and distribute content across multiple channels and devices with an API-first approach

**Category**: developer-tools
**Service**: Contentful
**Base URL**: https://api.contentful.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/contentful](https://integrations.do/contentful)

## Installation

```bash
npm install @dotdo/integration-contentful
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-contentful
```

## Quick Start

```typescript
import { ContentfulClient } from '@dotdo/integration-contentful'

// Initialize client
const client = new ContentfulClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ContentfulClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Contentful actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ContentfulError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ContentfulError) {
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
