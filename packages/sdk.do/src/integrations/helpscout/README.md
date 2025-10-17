# Help Scout Integration

Customer support platform with shared inbox and knowledge base

**Category**: support
**Service**: Helpscout
**Base URL**: https://api.helpscout.net/v2

This Integration is auto-generated from MDXLD definition: [https://integrations.do/helpscout](https://integrations.do/helpscout)

## Installation

```bash
npm install @dotdo/integration-helpscout
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-helpscout
```

## Quick Start

```typescript
import { HelpscoutClient } from '@dotdo/integration-helpscout'

// Initialize client
const client = new HelpscoutClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new HelpscoutClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Conversation

Manage customer conversations

#### `conversation.create()`

```typescript
const result = await client.conversation.create({
  subject: 'example', // Conversation subject
  type: 'example', // Conversation type (email, chat, phone)
  mailboxId: 123, // Mailbox ID
  customer: {}, // Customer object
  threads: [], // Initial thread(s)
  status: 'example', // Conversation status (active, pending, closed)
})
```

#### `conversation.get()`

```typescript
const result = await client.conversation.get({
  id: 123, // Conversation ID
})
```

#### `conversation.list()`

```typescript
const result = await client.conversation.list({
  mailbox: 123, // Filter by mailbox ID
  status: 'example', // Filter by status
  page: 123, // Page number
})
```

#### `conversation.update()`

```typescript
const result = await client.conversation.update({
  id: 123, // Conversation ID
  status: 'example', // Updated status
  subject: 'example', // Updated subject
})
```

### Customer

Manage customer profiles

#### `customer.create()`

```typescript
const result = await client.customer.create({
  firstName: 'example', // Customer first name
  lastName: 'example', // Customer last name
  emails: [], // Email addresses
  phones: [], // Phone numbers
})
```

#### `customer.get()`

```typescript
const result = await client.customer.get({
  id: 123, // Customer ID
})
```

#### `customer.update()`

```typescript
const result = await client.customer.update({
  id: 123, // Customer ID
  firstName: 'example', // Updated first name
  lastName: 'example', // Updated last name
})
```

#### `customer.list()`

```typescript
const result = await client.customer.list({
  query: 'example', // Search query
  page: 123, // Page number
})
```

### Mailbox

Manage mailboxes

#### `mailbox.get()`

```typescript
const result = await client.mailbox.get({
  id: 123, // Mailbox ID
})
```

#### `mailbox.list()`

```typescript
const result = await client.mailbox.list({
  page: 123, // Page number
})
```

### Tag

Manage conversation tags

#### `tag.list()`

```typescript
const result = await client.tag.list({
  page: 123, // Page number
})
```

## Error Handling

All errors are thrown as `HelpscoutError` instances with additional metadata:

```typescript
try {
  const result = await client.conversation.list()
} catch (error) {
  if (error instanceof HelpscoutError) {
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
import { HelpscoutWebhookHandler, WebhookEventRouter } from '@dotdo/integration-helpscout'

// Initialize webhook handler
const handler = new HelpscoutWebhookHandler(process.env.WEBHOOK_SECRET)

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

- `convo.created` - Conversation was created
- `convo.updated` - Conversation was updated
- `convo.deleted` - Conversation was deleted
- `convo.status` - Conversation status changed
- `convo.assigned` - Conversation was assigned
- `convo.moved` - Conversation moved to different mailbox
- `customer.created` - Customer was created
- `customer.updated` - Customer was updated

## License

MIT
