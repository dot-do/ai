# Composio Client

Enhanced TypeScript client for [Composio](https://composio.dev) with built-in retry logic, error handling, and full type safety.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions for all methods
- ✅ **Automatic Retry Logic** - Exponential backoff with jitter for transient failures
- ✅ **Error Handling** - Custom error classes for different failure scenarios
- ✅ **Rate Limit Management** - Automatic handling of rate limits with retry
- ✅ **Environment Configuration** - API key from environment variable or config
- ✅ **Zero Config** - Works out of the box with sensible defaults
- ✅ **Edge Compatible** - Works in Cloudflare Workers, Deno, Node.js

## Installation

```bash
# npm
npm install composio

# pnpm
pnpm add composio

# yarn
yarn add composio
```

## Quick Start

```typescript
import { ComposioClient } from 'composio'

// Initialize client (uses COMPOSIO_API_KEY from environment)
const client = new ComposioClient()

// Or provide API key explicitly
const client = new ComposioClient({
  apiKey: 'your-api-key',
  maxRetries: 3,
  retryDelay: 1000,
})
```

## Usage Examples

### List Available Integrations

```typescript
// List all apps
const apps = await client.listApps({ pageSize: 100 })

console.log(`Total apps: ${apps.pageInfo.total}`)
apps.items.forEach((app) => {
  console.log(`${app.name} - ${app.description}`)
})

// Search for specific apps
const calendarApps = await client.listApps({ search: 'calendar' })
```

### Execute Actions

```typescript
// Create GitHub issue
const issue = await client.executeAction({
  actionName: 'GITHUB_CREATE_ISSUE',
  userId: 'user-123',
  params: {
    title: 'Bug: Login not working',
    body: 'Users are unable to login from mobile devices',
    owner: 'myorg',
    repo: 'myapp',
    labels: ['bug', 'urgent'],
  },
})

console.log(`Created issue: ${issue.url}`)

// Send Slack message
await client.executeAction({
  actionName: 'SLACK_SEND_MESSAGE',
  userId: 'user-123',
  params: {
    channel: 'C01234567',
    text: 'Hello from Composio!',
  },
})
```

### Setup Triggers

```typescript
// Setup Slack message trigger
const trigger = await client.setupTrigger({
  userId: 'user-123',
  triggerName: 'SLACK_RECEIVE_MESSAGE',
  config: {
    channelId: 'C01234567',
    keywords: ['help', 'support'],
  },
})

console.log(`Trigger ID: ${trigger.id}`)
```

### User Authentication (OAuth)

```typescript
// Initiate OAuth flow
const connection = await client.initiateConnection({
  userId: 'user-123',
  authConfigId: 'github_oauth_config',
  redirectUrl: 'https://myapp.com/auth/callback',
})

// Redirect user to OAuth page
console.log(`Redirect to: ${connection.redirectUrl}`)

// After OAuth callback, check connection status
const connectedAccount = await client.getConnection(connection.connectionId)

if (connectedAccount.status === 'ACTIVE') {
  console.log('Connection successful!')
}
```

### List Connected Accounts

```typescript
// Get user's connected accounts
const connections = await client.listConnections({
  userId: 'user-123',
  appName: 'github',
})

connections.forEach((conn) => {
  console.log(`${conn.appName}: ${conn.status}`)
})
```

### Error Handling

The client includes custom error classes for different scenarios:

```typescript
import { ComposioAuthError, ComposioRateLimitError, ComposioNotFoundError } from 'composio'

try {
  await client.executeAction({
    actionName: 'GITHUB_CREATE_ISSUE',
    userId: 'user-123',
    params: {
      /* ... */
    },
  })
} catch (error) {
  if (error instanceof ComposioAuthError) {
    console.error('Authentication failed. Please reconnect your account.')
  } else if (error instanceof ComposioRateLimitError) {
    console.error(`Rate limited. Retry after ${error.retryAfter} seconds`)
  } else if (error instanceof ComposioNotFoundError) {
    console.error('Resource not found')
  } else {
    console.error('Unknown error:', error)
  }
}
```

### Webhook Handling

```typescript
import { verifyWebhookSignature } from 'composio/examples/webhook-handler'

// Verify webhook signature
const signature = request.headers.get('x-composio-signature')
const payload = await request.text()
const isValid = verifyWebhookSignature(payload, signature, process.env.COMPOSIO_WEBHOOK_SECRET)

if (!isValid) {
  return new Response('Invalid signature', { status: 401 })
}

// Process webhook
const event = JSON.parse(payload)

if (event.trigger_name === 'SLACK_RECEIVE_MESSAGE') {
  console.log('New Slack message:', event.payload.text)
}
```

## Configuration Options

```typescript
interface ComposioConfig {
  // API key (can also use COMPOSIO_API_KEY env var)
  apiKey?: string

  // Base URL (defaults to https://backend.composio.dev/api/v3)
  baseUrl?: string

  // Max retry attempts for failed requests (default: 3)
  maxRetries?: number

  // Base delay in ms for exponential backoff (default: 1000)
  retryDelay?: number

  // Request timeout in ms (default: 30000)
  timeout?: number
}
```

## Available Methods

### Apps/Integrations

- `listApps(filters?)` - List all available apps
- `getApp(appKey)` - Get specific app details

### Actions/Tools

- `listActions(filters?)` - List all actions
- `getAction(actionName)` - Get specific action details
- `executeAction(options)` - Execute an action

### Triggers/Events

- `listTriggers(filters?)` - List all triggers
- `setupTrigger(options)` - Setup a new trigger

### Connections

- `listConnections(filters?)` - List user connections
- `initiateConnection(options)` - Start OAuth flow
- `getConnection(connectionId)` - Get connection details
- `deleteConnection(connectionId)` - Remove connection

## Error Classes

- `ComposioError` - Base error class
- `ComposioAuthError` - Authentication failures (401)
- `ComposioRateLimitError` - Rate limit exceeded (429)
- `ComposioNotFoundError` - Resource not found (404)
- `ComposioValidationError` - Invalid parameters (400)
- `ComposioNetworkError` - Network failures
- `ComposioTimeoutError` - Request timeout
- `ComposioServiceError` - Server errors (5xx)

## Retry Logic

The client automatically retries failed requests with exponential backoff:

- **Retryable errors**: Network failures, 5xx errors, rate limits, timeouts
- **Non-retryable errors**: 4xx errors (except rate limits)
- **Backoff strategy**: Exponential with jitter (1s → 2s → 4s → 8s)
- **Max retries**: Configurable (default: 3)

## Cloudflare Workers Example

```typescript
import { ComposioClient } from 'composio'

interface Env {
  COMPOSIO_API_KEY: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const client = new ComposioClient({
      apiKey: env.COMPOSIO_API_KEY,
    })

    const apps = await client.listApps()

    return Response.json(apps)
  },
}
```

## Environment Variables

```bash
# Required
COMPOSIO_API_KEY=your-api-key

# Optional (for webhooks)
COMPOSIO_WEBHOOK_SECRET=your-webhook-secret
```

## TypeScript Support

All methods are fully typed with detailed interfaces:

```typescript
import type { ComposioApp, ComposioAction, ComposioTrigger, ExecuteActionOptions, ListResponse } from 'composio'

const apps: ListResponse<ComposioApp> = await client.listApps()
const action: ComposioAction = await client.getAction('GITHUB_CREATE_ISSUE')
```

## Advanced Usage

### Access Underlying SDK

```typescript
// Get the @composio/core SDK instance for advanced usage
const sdk = client.getSDK()
```

### Custom Retry Logic

```typescript
import { retry } from 'composio'

const result = await retry(
  async () => {
    // Your async operation
    return await someApiCall()
  },
  {
    maxRetries: 5,
    baseDelay: 2000,
    onRetry: (error, attempt) => {
      console.log(`Retry attempt ${attempt} due to:`, error.message)
    },
  }
)
```

## Resources

- [Composio Documentation](https://docs.composio.dev)
- [Integration Catalog](https://app.composio.dev/apps)
- [API Reference](https://docs.composio.dev/api-reference)
- [GitHub Repository](https://github.com/ComposioHQ/composio)

## License

MIT
