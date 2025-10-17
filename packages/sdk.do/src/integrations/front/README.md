# Front Integration

Customer communication hub for teams managing shared inboxes

**Category**: communication
**Service**: Front
**Base URL**: https://api2.frontapp.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/front](https://integrations.do/front)

## Installation

```bash
npm install @dotdo/integration-front
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-front
```

## Quick Start

```typescript
import { FrontClient } from '@dotdo/integration-front'

// Initialize client
const client = new FrontClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FrontClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Message

Send and manage messages in conversations

#### `message.send()`

```typescript
const result = await client.message.send({
  channel_id: 'example', // Channel ID
  to: [], // Recipient email addresses
  subject: 'example', // Email subject
  body: 'example', // Message body (plain text or HTML)
  text: 'example', // Plain text version
  attachments: [], // File attachments
})
```

#### `message.get()`

```typescript
const result = await client.message.get({
  message_id: 'example', // Message ID
})
```

#### `message.list()`

```typescript
const result = await client.message.list({
  conversation_id: 'example', // Conversation ID
})
```

### Conversation

Manage customer conversations

#### `conversation.get()`

```typescript
const result = await client.conversation.get({
  conversation_id: 'example', // Conversation ID
})
```

#### `conversation.list()`

```typescript
const result = await client.conversation.list({
  q: 'example', // Search query
  limit: 123, // Results per page
})
```

#### `conversation.update()`

```typescript
const result = await client.conversation.update({
  conversation_id: 'example', // Conversation ID
  assignee_id: 'example', // Teammate ID to assign
  status: 'example', // Conversation status (archived, deleted, open, spam)
  tag_ids: [], // Tag IDs to apply
})
```

### Contact

Manage customer contacts

#### `contact.create()`

```typescript
const result = await client.contact.create({
  name: 'example', // Contact name
  handles: [], // Contact handles (email, phone, etc.)
  custom_fields: {}, // Custom field values
})
```

#### `contact.get()`

```typescript
const result = await client.contact.get({
  contact_id: 'example', // Contact ID
})
```

#### `contact.update()`

```typescript
const result = await client.contact.update({
  contact_id: 'example', // Contact ID
  name: 'example', // Updated name
  custom_fields: {}, // Updated custom fields
})
```

#### `contact.list()`

```typescript
const result = await client.contact.list({
  q: 'example', // Search query
  limit: 123, // Results per page
})
```

### Tag

Manage conversation tags

#### `tag.create()`

```typescript
const result = await client.tag.create({
  name: 'example', // Tag name
  description: 'example', // Tag description
})
```

#### `tag.get()`

```typescript
const result = await client.tag.get({
  tag_id: 'example', // Tag ID
})
```

#### `tag.list()`

```typescript
const result = await client.tag.list()
```

#### `tag.delete()`

```typescript
const result = await client.tag.delete({
  tag_id: 'example', // Tag ID
})
```

### Comment

Add comments to conversations

#### `comment.create()`

```typescript
const result = await client.comment.create({
  conversation_id: 'example', // Conversation ID
  body: 'example', // Comment body
  author_id: 'example', // Teammate ID
})
```

#### `comment.list()`

```typescript
const result = await client.comment.list({
  conversation_id: 'example', // Conversation ID
})
```

## Error Handling

All errors are thrown as `FrontError` instances with additional metadata:

```typescript
try {
  const result = await client.message.list()
} catch (error) {
  if (error instanceof FrontError) {
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
import { FrontWebhookHandler, WebhookEventRouter } from '@dotdo/integration-front'

// Initialize webhook handler
const handler = new FrontWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onConversationCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `conversation.created` - New conversation created
- `conversation.updated` - Conversation was updated
- `conversation.archived` - Conversation was archived
- `conversation.assigned` - Conversation was assigned
- `conversation.tag.added` - Tag added to conversation
- `conversation.tag.removed` - Tag removed from conversation
- `message.received` - New message received
- `message.sent` - Message was sent
- `comment.created` - Comment was added

## License

MIT
