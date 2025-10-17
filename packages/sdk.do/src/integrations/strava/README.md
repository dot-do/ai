# Strava Integration

Strava is a social fitness network and app designed for cyclists and runners.

**Category**: social-media
**Service**: Strava
**Base URL**: https://api.strava.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/strava](https://integrations.do/strava)

## Installation

```bash
npm install @dotdo/integration-strava
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-strava
```

## Quick Start

```typescript
import { StravaClient } from '@dotdo/integration-strava'

// Initialize client
const client = new StravaClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new StravaClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Strava actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `StravaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof StravaError) {
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
