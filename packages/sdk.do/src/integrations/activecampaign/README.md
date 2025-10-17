# ActiveCampaign Integration

Marketing automation and CRM platform

**Category**: marketing
**Service**: Activecampaign
**Base URL**: https://youraccountname.api-us1.com/api/3

This Integration is auto-generated from MDXLD definition: [https://integrations.do/activecampaign](https://integrations.do/activecampaign)

## Installation

```bash
npm install @dotdo/integration-activecampaign
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-activecampaign
```

## Quick Start

```typescript
import { ActivecampaignClient } from '@dotdo/integration-activecampaign'

// Initialize client
const client = new ActivecampaignClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ActivecampaignClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Contact

Manage email contacts

#### `contact.create()`

```typescript
const result = await client.contact.create({
  email: 'example', // Contact email
  firstName: 'example', // First name
  lastName: 'example', // Last name
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
  email: 'example', // Updated email
})
```

#### `contact.delete()`

```typescript
const result = await client.contact.delete({
  contact_id: 'example', // Contact ID
})
```

#### `contact.list()`

```typescript
const result = await client.contact.list({
  limit: 123, // Results per page
})
```

### Campaign

Manage email campaigns

#### `campaign.create()`

```typescript
const result = await client.campaign.create({
  name: 'example', // Campaign name
  type: 'example', // Campaign type
})
```

#### `campaign.get()`

```typescript
const result = await client.campaign.get({
  campaign_id: 'example', // Campaign ID
})
```

#### `campaign.list()`

```typescript
const result = await client.campaign.list()
```

### List

Manage contact lists

#### `list.create()`

```typescript
const result = await client.list.create({
  name: 'example', // List name
})
```

#### `list.get()`

```typescript
const result = await client.list.get({
  list_id: 'example', // List ID
})
```

#### `list.list()`

```typescript
const result = await client.list.list()
```

## Error Handling

All errors are thrown as `ActivecampaignError` instances with additional metadata:

```typescript
try {
  const result = await client.contact.list()
} catch (error) {
  if (error instanceof ActivecampaignError) {
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
import { ActivecampaignWebhookHandler, WebhookEventRouter } from '@dotdo/integration-activecampaign'

// Initialize webhook handler
const handler = new ActivecampaignWebhookHandler(process.env.WEBHOOK_SECRET)

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

- `subscribe` - Contact subscribed
- `unsubscribe` - Contact unsubscribed

## License

MIT
