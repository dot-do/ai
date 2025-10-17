# SendGrid Integration

Email delivery and marketing platform for transactional and marketing emails

**Category**: communication
**Service**: Sendgrid
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sendgrid](https://integrations.do/sendgrid)

## Installation

```bash
npm install @dotdo/integration-sendgrid
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sendgrid
```

## Quick Start

```typescript
import { SendgridClient } from '@dotdo/integration-sendgrid'

// Initialize client
const client = new SendgridClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SendgridClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Email

#### `email.send()`

```typescript
const result = await client.email.send({
  options: value, // Email sending options including from, to, subject, and content
})
```

#### `email.sendBulk()`

```typescript
const result = await client.email.sendBulk({
  options: value, // Bulk email with multiple personalizations
})
```

#### `email.sendTemplate()`

```typescript
const result = await client.email.sendTemplate({
  options: value, // Template email with dynamic template data
})
```

#### `email.sendDynamicTemplate()`

```typescript
const result = await client.email.sendDynamicTemplate({
  options: value, // Dynamic template email with personalizations
})
```

#### `email.validate()`

```typescript
const result = await client.email.validate({
  email: 'example', // Email address to validate
})
```

### Contact

#### `contact.create()`

```typescript
const result = await client.contact.create({
  options: value, // Contacts to create or update
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
  options: value, // Contacts to update
})
```

#### `contact.delete()`

```typescript
const result = await client.contact.delete({
  ids: value, // Array of contact IDs to delete
})
```

#### `contact.list()`

```typescript
const result = await client.contact.list({
  options: value, // List pagination options
})
```

#### `contact.search()`

```typescript
const result = await client.contact.search({
  options: value, // Search query and pagination
})
```

### List

#### `list.create()`

```typescript
const result = await client.list.create({
  options: value, // List name
})
```

#### `list.get()`

```typescript
const result = await client.list.get({
  id: 'example', // List ID
})
```

#### `list.update()`

```typescript
const result = await client.list.update({
  id: 'example', // List ID
  options: value, // Updated list properties
})
```

#### `list.delete()`

```typescript
const result = await client.list.delete({
  id: 'example', // List ID
})
```

#### `list.list()`

```typescript
const result = await client.list.list()
```

#### `list.addContacts()`

```typescript
const result = await client.list.addContacts({
  listId: 'example', // List ID
  contactIds: value, // Array of contact IDs to add
})
```

#### `list.removeContacts()`

```typescript
const result = await client.list.removeContacts({
  listId: 'example', // List ID
  contactIds: value, // Array of contact IDs to remove
})
```

### Segment

#### `segment.create()`

```typescript
const result = await client.segment.create({
  options: value, // Segment name and query DSL
})
```

#### `segment.get()`

```typescript
const result = await client.segment.get({
  id: 'example', // Segment ID
})
```

#### `segment.update()`

```typescript
const result = await client.segment.update({
  id: 'example', // Segment ID
  options: value, // Updated segment properties
})
```

#### `segment.delete()`

```typescript
const result = await client.segment.delete({
  id: 'example', // Segment ID
})
```

#### `segment.list()`

```typescript
const result = await client.segment.list()
```

### Template

#### `template.create()`

```typescript
const result = await client.template.create({
  options: value, // Template name and generation type
})
```

#### `template.get()`

```typescript
const result = await client.template.get({
  id: 'example', // Template ID
})
```

#### `template.update()`

```typescript
const result = await client.template.update({
  id: 'example', // Template ID
  options: value, // Updated template properties
})
```

#### `template.delete()`

```typescript
const result = await client.template.delete({
  id: 'example', // Template ID
})
```

#### `template.list()`

```typescript
const result = await client.template.list()
```

### Campaign

#### `campaign.create()`

```typescript
const result = await client.campaign.create({
  options: value, // Campaign configuration
})
```

#### `campaign.get()`

```typescript
const result = await client.campaign.get({
  id: 'example', // Campaign ID
})
```

#### `campaign.update()`

```typescript
const result = await client.campaign.update({
  id: 'example', // Campaign ID
  options: value, // Updated campaign properties
})
```

#### `campaign.delete()`

```typescript
const result = await client.campaign.delete({
  id: 'example', // Campaign ID
})
```

#### `campaign.list()`

```typescript
const result = await client.campaign.list()
```

#### `campaign.send()`

```typescript
const result = await client.campaign.send({
  id: 'example', // Campaign ID
})
```

#### `campaign.schedule()`

```typescript
const result = await client.campaign.schedule({
  id: 'example', // Campaign ID
  options: value, // Schedule timestamp
})
```

### Suppression

#### `suppression.addToGroup()`

```typescript
const result = await client.suppression.addToGroup({
  groupId: 123, // Suppression group ID
  emails: value, // Array of email addresses to suppress
})
```

#### `suppression.removeFromGroup()`

```typescript
const result = await client.suppression.removeFromGroup({
  groupId: 123, // Suppression group ID
  emails: value, // Array of email addresses to remove
})
```

#### `suppression.listGroups()`

```typescript
const result = await client.suppression.listGroups()
```

### Stats

#### `stats.get()`

```typescript
const result = await client.stats.get({
  options: value, // Date range and aggregation options
})
```

#### `stats.getGlobal()`

```typescript
const result = await client.stats.getGlobal({
  options: value, // Date range and aggregation options
})
```

#### `stats.getCategory()`

```typescript
const result = await client.stats.getCategory({
  options: value, // Date range, categories, and aggregation options
})
```

## Error Handling

All errors are thrown as `SendgridError` instances with additional metadata:

```typescript
try {
  const result = await client.email.list()
} catch (error) {
  if (error instanceof SendgridError) {
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
import { SendgridWebhookHandler, WebhookEventRouter } from '@dotdo/integration-sendgrid'

// Initialize webhook handler
const handler = new SendgridWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onProcessed(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `processed` - Message has been received and is ready to be delivered
- `dropped` - Message has been dropped and will not be delivered
- `delivered` - Message has been successfully delivered to the receiving server
- `deferred` - Receiving server temporarily rejected the message
- `bounce` - Receiving server could not or would not accept the message
- `open` - Recipient has opened the HTML message
- `click` - Recipient clicked on a link within the message
- `spam_report` - Recipient marked the message as spam
- `unsubscribe` - Recipient clicked on the unsubscribe link
- `group_unsubscribe` - Recipient unsubscribed from a specific group
- `group_resubscribe` - Recipient resubscribed to a specific group

## License

MIT
