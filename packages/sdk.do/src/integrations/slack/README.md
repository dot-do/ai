# Slack Integration

Team collaboration and messaging platform

**Category**: communication
**Service**: Slack
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/slack](https://integrations.do/slack)

## Installation

```bash
npm install @dotdo/integration-slack
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-slack
```

## Quick Start

```typescript
import { SlackClient } from '@dotdo/integration-slack'

// Initialize client
const client = new SlackClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SlackClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Message

Send, update, delete, and schedule messages

#### `message.post()`

```typescript
const result = await client.message.post({
  channel: 'example', // Channel ID or name (e.g., C1234567890 or
  text: 'example', // Message text (required for fallback)
  blocks: [], // Block Kit blocks for rich formatting
  attachments: [], // Legacy attachments
  thread_ts: 'example', // Thread timestamp to reply in a thread
  reply_broadcast: true, // Reply to thread and broadcast to channel
  username: 'example', // Custom username to display
  icon_emoji: 'example', // Emoji to use as the icon
  icon_url: 'example', // URL to an image for the icon
  metadata: {}, // Message metadata for app features
})
```

#### `message.update()`

```typescript
const result = await client.message.update({
  channel: 'example', // Channel ID
  ts: 'example', // Message timestamp
  text: 'example', // New message text
  blocks: [], // Updated blocks
  attachments: [], // Updated attachments
})
```

#### `message.delete()`

```typescript
const result = await client.message.delete({
  channel: 'example', // Channel ID
  ts: 'example', // Message timestamp
})
```

#### `message.scheduleMessage()`

```typescript
const result = await client.message.scheduleMessage({
  channel: 'example', // Channel ID
  text: 'example', // Message text
  post_at: 123, // Unix timestamp when to post
  blocks: [], // Block Kit blocks
  thread_ts: 'example', // Thread timestamp
})
```

#### `message.getPermalink()`

```typescript
const result = await client.message.getPermalink({
  channel: 'example', // Channel ID
  message_ts: 'example', // Message timestamp
})
```

### Channel

Create, manage, and archive channels

#### `channel.list()`

```typescript
const result = await client.channel.list({
  limit: 100, // Maximum number of channels to return
  cursor: 'example', // Pagination cursor
  exclude_archived: false, // Exclude archived channels
  types: 'public_channel,private_channel', // Comma-separated list of types (public_channel, private_channel, mpim, im)
})
```

#### `channel.get()`

```typescript
const result = await client.channel.get({
  channel: 'example', // Channel ID
})
```

#### `channel.create()`

```typescript
const result = await client.channel.create({
  name: 'example', // Channel name (lowercase, no spaces, max 80 chars)
  is_private: false, // Create a private channel
  team_id: 'example', // Team ID for Enterprise Grid
})
```

#### `channel.archive()`

```typescript
const result = await client.channel.archive({
  channel: 'example', // Channel ID
})
```

#### `channel.unarchive()`

```typescript
const result = await client.channel.unarchive({
  channel: 'example', // Channel ID
})
```

#### `channel.invite()`

```typescript
const result = await client.channel.invite({
  channel: 'example', // Channel ID
  users: 'example', // Comma-separated user IDs
})
```

#### `channel.kick()`

```typescript
const result = await client.channel.kick({
  channel: 'example', // Channel ID
  user: 'example', // User ID to remove
})
```

#### `channel.history()`

```typescript
const result = await client.channel.history({
  channel: 'example', // Channel ID
  latest: 'example', // End of time range (timestamp)
  oldest: 'example', // Start of time range (timestamp)
  limit: 100, // Number of messages to return
  cursor: 'example', // Pagination cursor
})
```

#### `channel.replies()`

```typescript
const result = await client.channel.replies({
  channel: 'example', // Channel ID
  ts: 'example', // Thread parent message timestamp
})
```

#### `channel.open()`

```typescript
const result = await client.channel.open({
  users: 'example', // Comma-separated user IDs
})
```

### User

Get information about workspace users

#### `user.list()`

```typescript
const result = await client.user.list({
  limit: 100, // Maximum number of users to return
  cursor: 'example', // Pagination cursor
  team_id: 'example', // Team ID for Enterprise Grid
  include_locale: true, // Include locale information
})
```

#### `user.get()`

```typescript
const result = await client.user.get({
  user: 'example', // User ID
})
```

#### `user.lookupByEmail()`

```typescript
const result = await client.user.lookupByEmail({
  email: 'example', // User email address
})
```

#### `user.setPresence()`

```typescript
const result = await client.user.setPresence({
  presence: 'auto', // Presence status (auto or away)
})
```

### File

Upload, share, and manage files

#### `file.upload()`

```typescript
const result = await client.file.upload({
  content: value, // File content
  file: 'example', // File path (alternative to content)
  filename: 'example', // Filename
  filetype: 'example', // File type identifier
  title: 'example', // Title of the file
  initial_comment: 'example', // Initial comment
  channel_id: 'example', // Channel to share the file in
  thread_ts: 'example', // Thread timestamp
})
```

#### `file.get()`

```typescript
const result = await client.file.get({
  file: 'example', // File ID
})
```

#### `file.delete()`

```typescript
const result = await client.file.delete({
  file: 'example', // File ID
})
```

### Reaction

Add and remove emoji reactions

#### `reaction.add()`

```typescript
const result = await client.reaction.add({
  channel: 'example', // Channel ID
  timestamp: 'example', // Message timestamp
  name: 'example', // Emoji name (without colons, e.g., thumbsup)
})
```

#### `reaction.remove()`

```typescript
const result = await client.reaction.remove({
  channel: 'example', // Channel ID
  timestamp: 'example', // Message timestamp
  name: 'example', // Emoji name (without colons, e.g., thumbsup)
})
```

## Error Handling

All errors are thrown as `SlackError` instances with additional metadata:

```typescript
try {
  const result = await client.message.list()
} catch (error) {
  if (error instanceof SlackError) {
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
import { SlackWebhookHandler, WebhookEventRouter } from '@dotdo/integration-slack'

// Initialize webhook handler
const handler = new SlackWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onUrlVerification(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `url_verification` - URL verification challenge for initial webhook setup
- `event_callback` - Wrapper event for all workspace events
- `message` - A message was sent to a channel
- `message.channels` - A message was posted to a channel
- `message.groups` - A message was posted to a private channel
- `message.im` - A message was posted in a direct message
- `message.mpim` - A message was posted in a multi-person direct message
- `app_mention` - App was mentioned in a message
- `channel_created` - A channel was created
- `channel_deleted` - A channel was deleted
- `channel_rename` - A channel was renamed
- `channel_archive` - A channel was archived
- `channel_unarchive` - A channel was unarchived
- `member_joined_channel` - A user joined a channel
- `member_left_channel` - A user left a channel
- `team_join` - A new user joined the workspace
- `user_change` - A user's profile or settings changed
- `reaction_added` - A reaction was added to a message
- `reaction_removed` - A reaction was removed from a message
- `file_shared` - A file was shared
- `file_public` - A file was made public
- `file_deleted` - A file was deleted
- `app_home_opened` - User opened the App Home
- `app_uninstalled` - App was uninstalled

## License

MIT
