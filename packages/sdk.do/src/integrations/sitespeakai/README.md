# Sitespeakai Integration

SiteSpeakAI enables businesses to automate customer support by creating custom-trained, embeddable GPT chatbots that provide real-time answers about products and services, reducing support tickets.

**Category**: productivity
**Service**: Sitespeakai
**Base URL**: https://api.sitespeakai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sitespeakai](https://integrations.do/sitespeakai)

## Installation

```bash
npm install @dotdo/integration-sitespeakai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sitespeakai
```

## Quick Start

```typescript
import { SitespeakaiClient } from '@dotdo/integration-sitespeakai'

// Initialize client
const client = new SitespeakaiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SitespeakaiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Sitespeakai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SitespeakaiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SitespeakaiError) {
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
