# Youtube Integration

YouTube is a video-sharing platform with user-generated content, live streaming, and monetization opportunities, widely used for marketing, education, and entertainment

**Category**: social-media
**Service**: Youtube
**Base URL**: https://api.youtube.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/youtube](https://integrations.do/youtube)

## Installation

```bash
npm install @dotdo/integration-youtube
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-youtube
```

## Quick Start

```typescript
import { YoutubeClient } from '@dotdo/integration-youtube'

// Initialize client
const client = new YoutubeClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new YoutubeClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Youtube actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `YoutubeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof YoutubeError) {
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

## Webhooks

This Integration supports webhooks for real-time event notifications.

```typescript
import { YoutubeWebhookHandler, WebhookEventRouter } from '@dotdo/integration-youtube'

// Initialize webhook handler
const handler = new YoutubeWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onGenericTrigger(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `trigger` - Generic webhook trigger

## License

MIT
