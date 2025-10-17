# Zendesk Integration

Customer support and ticketing platform

**Category**: support
**Service**: Zendesk
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zendesk](https://integrations.do/zendesk)

## Installation

```bash
npm install @dotdo/integration-zendesk
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zendesk
```

## Quick Start

```typescript
import { ZendeskClient } from '@dotdo/integration-zendesk'

// Initialize client
const client = new ZendeskClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ZendeskClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Ticket

Manage support tickets

#### `ticket.create()`

```typescript
const result = await client.ticket.create({
  subject: 'example', // Ticket subject
  comment: {}, // Initial comment with body
  priority: 'example', // Ticket priority (low, normal, high, urgent)
  status: 'example', // Ticket status (new, open, pending, hold, solved, closed)
  type: 'example', // Ticket type (problem, incident, question, task)
  tags: [], // Ticket tags
  requester_id: 123, // Requester user ID
  assignee_id: 123, // Assignee user ID
  group_id: 123, // Group ID
})
```

#### `ticket.get()`

```typescript
const result = await client.ticket.get({
  id: 123, // Ticket ID
})
```

#### `ticket.update()`

```typescript
const result = await client.ticket.update({
  id: 123, // Ticket ID
  subject: 'example', // Updated subject
  comment: {}, // Add comment
  status: 'example', // Updated status
  priority: 'example', // Updated priority
})
```

#### `ticket.delete()`

```typescript
const result = await client.ticket.delete({
  id: 123, // Ticket ID
})
```

#### `ticket.list()`

```typescript
const result = await client.ticket.list({
  page: 123, // Page number
  per_page: 123, // Results per page
})
```

### User

Manage users (customers, agents, admins)

#### `user.create()`

```typescript
const result = await client.user.create({
  name: 'example', // User name
  email: 'example', // User email
  role: 'example', // User role (end-user, agent, admin)
  organization_id: 123, // Organization ID
})
```

#### `user.get()`

```typescript
const result = await client.user.get({
  id: 123, // User ID
})
```

#### `user.update()`

```typescript
const result = await client.user.update({
  id: 123, // User ID
  name: 'example', // Updated name
  email: 'example', // Updated email
})
```

#### `user.list()`

```typescript
const result = await client.user.list({
  role: 'example', // Filter by role
  page: 123, // Page number
})
```

### Organization

Manage customer organizations

#### `organization.create()`

```typescript
const result = await client.organization.create({
  name: 'example', // Organization name
  domain_names: [], // Domain names for auto-assignment
  details: 'example', // Organization details
})
```

#### `organization.get()`

```typescript
const result = await client.organization.get({
  id: 123, // Organization ID
})
```

#### `organization.update()`

```typescript
const result = await client.organization.update({
  id: 123, // Organization ID
  name: 'example', // Updated name
})
```

#### `organization.list()`

```typescript
const result = await client.organization.list({
  page: 123, // Page number
})
```

### Comment

Manage ticket comments

#### `comment.list()`

```typescript
const result = await client.comment.list({
  ticket_id: 123, // Ticket ID
})
```

## Error Handling

All errors are thrown as `ZendeskError` instances with additional metadata:

```typescript
try {
  const result = await client.ticket.list()
} catch (error) {
  if (error instanceof ZendeskError) {
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
import { ZendeskWebhookHandler, WebhookEventRouter } from '@dotdo/integration-zendesk'

// Initialize webhook handler
const handler = new ZendeskWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onTicketCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `zen:event-type:ticket.created` - Ticket was created
- `zen:event-type:ticket.updated` - Ticket was updated
- `zen:event-type:ticket.solved` - Ticket was solved
- `zen:event-type:ticket.comment.created` - Comment was added to ticket
- `zen:event-type:user.created` - User was created
- `zen:event-type:organization.created` - Organization was created

## License

MIT
