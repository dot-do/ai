# Spotify Integration

Spotify is a digital music and podcast streaming service with millions of tracks, personalized playlists, and social sharing features

**Category**: social-media
**Service**: Spotify
**Base URL**: https://api.spotify.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/spotify](https://integrations.do/spotify)

## Installation

```bash
npm install @dotdo/integration-spotify
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-spotify
```

## Quick Start

```typescript
import { SpotifyClient } from '@dotdo/integration-spotify'

// Initialize client
const client = new SpotifyClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SpotifyClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Spotify actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SpotifyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SpotifyError) {
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
import { SpotifyWebhookHandler, WebhookEventRouter } from '@dotdo/integration-spotify'

// Initialize webhook handler
const handler = new SpotifyWebhookHandler(process.env.WEBHOOK_SECRET)

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
