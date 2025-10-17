# Microsoft Teams Integration

Business communication and collaboration platform integrated with Microsoft 365

**Category**: communication
**Service**: Teams
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/teams](https://integrations.do/teams)

## Installation

```bash
npm install @dotdo/integration-teams
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-teams
```

## Quick Start

```typescript
import { TeamsClient } from '@dotdo/integration-teams'

// Initialize client
const client = new TeamsClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new TeamsClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Message

Send and manage messages in channels

#### `message.send()`

```typescript
const result = await client.message.send({
  teamId: 'example', // Team ID
  channelId: 'example', // Channel ID
  body: {}, // Message body with content and contentType
  attachments: [], // Message attachments
  mentions: [], // User mentions
})
```

#### `message.get()`

```typescript
const result = await client.message.get({
  teamId: 'example', // Team ID
  channelId: 'example', // Channel ID
  messageId: 'example', // Message ID
})
```

#### `message.list()`

```typescript
const result = await client.message.list({
  teamId: 'example', // Team ID
  channelId: 'example', // Channel ID
  top: 123, // Number of messages to return
})
```

#### `message.update()`

```typescript
const result = await client.message.update({
  teamId: 'example', // Team ID
  channelId: 'example', // Channel ID
  messageId: 'example', // Message ID
  body: {}, // Updated message body
})
```

### Channel

Manage team channels

#### `channel.create()`

```typescript
const result = await client.channel.create({
  teamId: 'example', // Team ID
  displayName: 'example', // Channel display name
  description: 'example', // Channel description
  membershipType: 'example', // Channel type (standard or private)
})
```

#### `channel.get()`

```typescript
const result = await client.channel.get({
  teamId: 'example', // Team ID
  channelId: 'example', // Channel ID
})
```

#### `channel.list()`

```typescript
const result = await client.channel.list({
  teamId: 'example', // Team ID
})
```

#### `channel.update()`

```typescript
const result = await client.channel.update({
  teamId: 'example', // Team ID
  channelId: 'example', // Channel ID
  displayName: 'example', // New display name
  description: 'example', // New description
})
```

#### `channel.delete()`

```typescript
const result = await client.channel.delete({
  teamId: 'example', // Team ID
  channelId: 'example', // Channel ID
})
```

### Team

Manage Microsoft Teams

#### `team.create()`

```typescript
const result = await client.team.create({
  displayName: 'example', // Team display name
  description: 'example', // Team description
  visibility: 'example', // Team visibility (public or private)
})
```

#### `team.get()`

```typescript
const result = await client.team.get({
  teamId: 'example', // Team ID
})
```

#### `team.list()`

```typescript
const result = await client.team.list()
```

#### `team.update()`

```typescript
const result = await client.team.update({
  teamId: 'example', // Team ID
  displayName: 'example', // New display name
  description: 'example', // New description
})
```

### Member

Manage team members

#### `member.add()`

```typescript
const result = await client.member.add({
  teamId: 'example', // Team ID
  userId: 'example', // User ID to add
  roles: [], // Member roles
})
```

#### `member.get()`

```typescript
const result = await client.member.get({
  teamId: 'example', // Team ID
  membershipId: 'example', // Membership ID
})
```

#### `member.list()`

```typescript
const result = await client.member.list({
  teamId: 'example', // Team ID
})
```

#### `member.remove()`

```typescript
const result = await client.member.remove({
  teamId: 'example', // Team ID
  membershipId: 'example', // Membership ID
})
```

## Error Handling

All errors are thrown as `TeamsError` instances with additional metadata:

```typescript
try {
  const result = await client.message.list()
} catch (error) {
  if (error instanceof TeamsError) {
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
import { TeamsWebhookHandler, WebhookEventRouter } from '@dotdo/integration-teams'

// Initialize webhook handler
const handler = new TeamsWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onMessageCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `chatMessage/created` - New message created in channel
- `chatMessage/updated` - Message updated in channel
- `chatMessage/deleted` - Message deleted from channel
- `channel/created` - New channel created
- `channel/updated` - Channel updated
- `channel/deleted` - Channel deleted
- `team/created` - New team created
- `team/updated` - Team updated
- `team/deleted` - Team deleted
- `conversationMember/added` - Member added to team
- `conversationMember/removed` - Member removed from team

## License

MIT
