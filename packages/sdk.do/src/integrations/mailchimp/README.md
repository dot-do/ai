# Mailchimp Integration

Email marketing platform for campaigns and audience management

**Category**: marketing
**Service**: Mailchimp
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mailchimp](https://integrations.do/mailchimp)

## Installation

```bash
npm install @dotdo/integration-mailchimp
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mailchimp
```

## Quick Start

```typescript
import { MailchimpClient } from '@dotdo/integration-mailchimp'

// Initialize client
const client = new MailchimpClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MailchimpClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Campaign

Create and manage email campaigns

#### `campaign.create()`

```typescript
const result = await client.campaign.create({
  type: 'example', // Campaign type (regular, plaintext, absplit, rss, variate)
  recipients: {}, // List recipients
  settings: {}, // Campaign settings (subject_line, from_name, reply_to)
})
```

#### `campaign.get()`

```typescript
const result = await client.campaign.get({
  campaign_id: 'example', // Campaign ID
})
```

#### `campaign.update()`

```typescript
const result = await client.campaign.update({
  campaign_id: 'example', // Campaign ID
  settings: {}, // Updated campaign settings
})
```

#### `campaign.delete()`

```typescript
const result = await client.campaign.delete({
  campaign_id: 'example', // Campaign ID
})
```

#### `campaign.list()`

```typescript
const result = await client.campaign.list({
  count: 123, // Number of campaigns to return
  offset: 123, // Number of records to skip
})
```

### List

Manage audience lists

#### `list.create()`

```typescript
const result = await client.list.create({
  name: 'example', // List name
  contact: {}, // Contact information for the list
  permission_reminder: 'example', // Permission reminder for subscribers
  campaign_defaults: {}, // Default values for campaigns
  email_type_option: true, // Whether the list supports multiple formats
})
```

#### `list.get()`

```typescript
const result = await client.list.get({
  list_id: 'example', // List ID
})
```

#### `list.update()`

```typescript
const result = await client.list.update({
  list_id: 'example', // List ID
  name: 'example', // Updated list name
})
```

#### `list.delete()`

```typescript
const result = await client.list.delete({
  list_id: 'example', // List ID
})
```

#### `list.list()`

```typescript
const result = await client.list.list({
  count: 123, // Number of lists to return
})
```

### Member

Manage list members (subscribers)

#### `member.create()`

```typescript
const result = await client.member.create({
  list_id: 'example', // List ID
  email_address: 'example', // Member email address
  status: 'example', // Subscription status (subscribed, unsubscribed, cleaned, pending)
  merge_fields: {}, // Merge field values (FNAME, LNAME, etc.)
  tags: [], // Member tags
})
```

#### `member.get()`

```typescript
const result = await client.member.get({
  list_id: 'example', // List ID
  subscriber_hash: 'example', // MD5 hash of lowercase email
})
```

#### `member.update()`

```typescript
const result = await client.member.update({
  list_id: 'example', // List ID
  subscriber_hash: 'example', // MD5 hash of lowercase email
  status: 'example', // Updated subscription status
  merge_fields: {}, // Updated merge fields
})
```

#### `member.delete()`

```typescript
const result = await client.member.delete({
  list_id: 'example', // List ID
  subscriber_hash: 'example', // MD5 hash of lowercase email
})
```

#### `member.list()`

```typescript
const result = await client.member.list({
  list_id: 'example', // List ID
  count: 123, // Number of members to return
})
```

### Template

Manage email templates

#### `template.create()`

```typescript
const result = await client.template.create({
  name: 'example', // Template name
  html: 'example', // Template HTML content
})
```

#### `template.get()`

```typescript
const result = await client.template.get({
  template_id: 'example', // Template ID
})
```

#### `template.update()`

```typescript
const result = await client.template.update({
  template_id: 'example', // Template ID
  name: 'example', // Updated template name
  html: 'example', // Updated HTML content
})
```

#### `template.delete()`

```typescript
const result = await client.template.delete({
  template_id: 'example', // Template ID
})
```

#### `template.list()`

```typescript
const result = await client.template.list({
  count: 123, // Number of templates to return
})
```

## Error Handling

All errors are thrown as `MailchimpError` instances with additional metadata:

```typescript
try {
  const result = await client.campaign.list()
} catch (error) {
  if (error instanceof MailchimpError) {
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
import { MailchimpWebhookHandler, WebhookEventRouter } from '@dotdo/integration-mailchimp'

// Initialize webhook handler
const handler = new MailchimpWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onSubscribe(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `subscribe` - User subscribed to list
- `unsubscribe` - User unsubscribed from list
- `profile` - Profile information updated
- `cleaned` - Email address cleaned
- `upemail` - Email address changed
- `campaign` - Campaign sent to list

## License

MIT
