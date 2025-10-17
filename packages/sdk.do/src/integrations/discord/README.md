# Discord Integration

Voice, video, and text communication platform for communities

**Category**: communication
**Service**: Discord
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/discord](https://integrations.do/discord)

## Installation

```bash
npm install @dotdo/integration-discord
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-discord
```

## Quick Start

```typescript
import { DiscordClient } from '@dotdo/integration-discord'

// Initialize client
const client = new DiscordClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DiscordClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Message

Send, edit, and delete messages in channels

#### `message.send()`

```typescript
const result = await client.message.send({
  channelId: 'example', // Channel ID where message will be sent
  content: 'example', // Message text content
  embeds: [], // Rich embed objects for formatted messages
  components: [], // Interactive components (buttons, select menus)
  files: [], // File attachments
  reply: {}, // Message reference for replies
  tts: true, // Text-to-speech enabled
})
```

#### `message.edit()`

```typescript
const result = await client.message.edit({
  messageId: 'example', // Message ID to edit
  content: 'example', // New message content
  embeds: [], // Updated embeds
  components: [], // Updated components
})
```

#### `message.delete()`

```typescript
const result = await client.message.delete({
  messageId: 'example', // Message ID to delete
})
```

#### `message.get()`

```typescript
const result = await client.message.get({
  messageId: 'example', // Message ID to retrieve
})
```

### Channel

Manage text, voice, and category channels

#### `channel.create()`

```typescript
const result = await client.channel.create({
  guildId: 'example', // Guild (server) ID
  name: 'example', // Channel name (2-100 characters)
  type: 123, // Channel type (0=text, 2=voice, 4=category)
  topic: 'example', // Channel topic (text channels only)
  nsfw: true, // Mark channel as NSFW
  parentId: 'example', // Parent category ID
})
```

#### `channel.get()`

```typescript
const result = await client.channel.get({
  channelId: 'example', // Channel ID
})
```

#### `channel.update()`

```typescript
const result = await client.channel.update({
  channelId: 'example', // Channel ID
  name: 'example', // New channel name
  topic: 'example', // New channel topic
  nsfw: true, // Update NSFW status
})
```

#### `channel.delete()`

```typescript
const result = await client.channel.delete({
  channelId: 'example', // Channel ID
})
```

#### `channel.list()`

```typescript
const result = await client.channel.list({
  guildId: 'example', // Guild (server) ID
})
```

### Guild

Manage Discord servers (guilds)

#### `guild.get()`

```typescript
const result = await client.guild.get({
  guildId: 'example', // Guild ID
})
```

#### `guild.list()`

```typescript
const result = await client.guild.list()
```

#### `guild.update()`

```typescript
const result = await client.guild.update({
  guildId: 'example', // Guild ID
  name: 'example', // New guild name
  icon: 'example', // Base64 encoded icon image
  region: 'example', // Voice region
})
```

### Member

Manage guild members

#### `member.get()`

```typescript
const result = await client.member.get({
  guildId: 'example', // Guild ID
  userId: 'example', // User ID
})
```

#### `member.list()`

```typescript
const result = await client.member.list({
  guildId: 'example', // Guild ID
  limit: 123, // Max members to return (1-1000)
})
```

#### `member.kick()`

```typescript
const result = await client.member.kick({
  guildId: 'example', // Guild ID
  userId: 'example', // User ID to kick
  reason: 'example', // Reason for kick
})
```

#### `member.ban()`

```typescript
const result = await client.member.ban({
  guildId: 'example', // Guild ID
  userId: 'example', // User ID to ban
  reason: 'example', // Reason for ban
  deleteMessageDays: 123, // Days of message history to delete (0-7)
})
```

### Role

Manage guild roles and permissions

#### `role.create()`

```typescript
const result = await client.role.create({
  guildId: 'example', // Guild ID
  name: 'example', // Role name
  permissions: 'example', // Bitwise permission value
  color: 123, // RGB color value
  hoist: true, // Display separately in member list
  mentionable: true, // Allow role to be mentioned
})
```

#### `role.update()`

```typescript
const result = await client.role.update({
  roleId: 'example', // Role ID
  name: 'example', // New role name
  permissions: 'example', // New permissions
  color: 123, // New color
})
```

#### `role.delete()`

```typescript
const result = await client.role.delete({
  roleId: 'example', // Role ID
})
```

#### `role.list()`

```typescript
const result = await client.role.list({
  guildId: 'example', // Guild ID
})
```

## Error Handling

All errors are thrown as `DiscordError` instances with additional metadata:

```typescript
try {
  const result = await client.message.list()
} catch (error) {
  if (error instanceof DiscordError) {
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
import { DiscordWebhookHandler, WebhookEventRouter } from '@dotdo/integration-discord'

// Initialize webhook handler
const handler = new DiscordWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onMessageCreate(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `MESSAGE_CREATE` - A message was created
- `MESSAGE_UPDATE` - A message was updated
- `MESSAGE_DELETE` - A message was deleted
- `CHANNEL_CREATE` - A channel was created
- `CHANNEL_UPDATE` - A channel was updated
- `CHANNEL_DELETE` - A channel was deleted
- `GUILD_CREATE` - Bot joined a guild
- `GUILD_UPDATE` - Guild was updated
- `GUILD_DELETE` - Bot left a guild
- `GUILD_MEMBER_ADD` - New member joined guild
- `GUILD_MEMBER_REMOVE` - Member left guild
- `GUILD_MEMBER_UPDATE` - Member was updated
- `GUILD_ROLE_CREATE` - Role was created
- `GUILD_ROLE_UPDATE` - Role was updated
- `GUILD_ROLE_DELETE` - Role was deleted

## License

MIT
