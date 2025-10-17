# Intercom Integration

Customer messaging platform for sales, marketing, and support

**Category**: communication
**Service**: Intercom
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/intercom](https://integrations.do/intercom)

## Installation

```bash
npm install @dotdo/integration-intercom
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-intercom
```

## Quick Start

```typescript
import { IntercomClient } from '@dotdo/integration-intercom'

// Initialize client
const client = new IntercomClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new IntercomClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Contact

Manage customer contacts

#### `contact.create()`

```typescript
const result = await client.contact.create({
  email: 'example', // Contact email
  phone: 'example', // Contact phone number
  name: 'example', // Contact name
  custom_attributes: {}, // Custom contact attributes
})
```

#### `contact.get()`

```typescript
const result = await client.contact.get({
  id: 'example', // Contact ID
})
```

#### `contact.update()`

```typescript
const result = await client.contact.update({
  id: 'example', // Contact ID
  email: 'example', // Updated email
  name: 'example', // Updated name
  custom_attributes: {}, // Updated custom attributes
})
```

#### `contact.delete()`

```typescript
const result = await client.contact.delete({
  id: 'example', // Contact ID
})
```

#### `contact.list()`

```typescript
const result = await client.contact.list({
  per_page: 123, // Results per page
})
```

### Conversation

Manage customer conversations

#### `conversation.create()`

```typescript
const result = await client.conversation.create({
  from: {}, // From user/contact
  body: 'example', // Message body
})
```

#### `conversation.get()`

```typescript
const result = await client.conversation.get({
  id: 'example', // Conversation ID
})
```

#### `conversation.reply()`

```typescript
const result = await client.conversation.reply({
  id: 'example', // Conversation ID
  message_type: 'example', // Message type (comment, note)
  body: 'example', // Reply body
})
```

#### `conversation.list()`

```typescript
const result = await client.conversation.list({
  per_page: 123, // Results per page
})
```

### Message

Send messages to contacts

#### `message.create()`

```typescript
const result = await client.message.create({
  message_type: 'example', // Message type (in_app, email)
  from: {}, // From admin
  to: {}, // To user/contact
  body: 'example', // Message body
  subject: 'example', // Email subject (for email messages)
})
```

### Tag

Manage conversation and contact tags

#### `tag.create()`

```typescript
const result = await client.tag.create({
  name: 'example', // Tag name
})
```

#### `tag.get()`

```typescript
const result = await client.tag.get({
  id: 'example', // Tag ID
})
```

#### `tag.list()`

```typescript
const result = await client.tag.list()
```

#### `tag.delete()`

```typescript
const result = await client.tag.delete({
  id: 'example', // Tag ID
})
```

### Article

Manage help center articles

#### `article.create()`

```typescript
const result = await client.article.create({
  title: 'example', // Article title
  body: 'example', // Article body (HTML)
  author_id: 'example', // Author admin ID
})
```

#### `article.get()`

```typescript
const result = await client.article.get({
  id: 'example', // Article ID
})
```

#### `article.update()`

```typescript
const result = await client.article.update({
  id: 'example', // Article ID
  title: 'example', // Updated title
  body: 'example', // Updated body
})
```

#### `article.list()`

```typescript
const result = await client.article.list({
  per_page: 123, // Results per page
})
```

## Error Handling

All errors are thrown as `IntercomError` instances with additional metadata:

```typescript
try {
  const result = await client.contact.list()
} catch (error) {
  if (error instanceof IntercomError) {
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
import { IntercomWebhookHandler, WebhookEventRouter } from '@dotdo/integration-intercom'

// Initialize webhook handler
const handler = new IntercomWebhookHandler(process.env.WEBHOOK_SECRET)

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
- `conversation.admin.replied` - Admin replied to conversation
- `conversation.user.replied` - User replied to conversation
- `conversation.closed` - Conversation was closed
- `conversation.opened` - Conversation was opened
- `contact.created` - New contact created
- `contact.updated` - Contact was updated
- `contact.deleted` - Contact was deleted
- `contact.tag.created` - Tag added to contact
- `contact.tag.deleted` - Tag removed from contact

## License

MIT
