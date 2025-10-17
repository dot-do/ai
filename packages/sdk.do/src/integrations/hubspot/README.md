# HubSpot Integration

CRM platform for inbound marketing, sales, and customer service

**Category**: crm
**Service**: Hubspot
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/hubspot](https://integrations.do/hubspot)

## Installation

```bash
npm install @dotdo/integration-hubspot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-hubspot
```

## Quick Start

```typescript
import { HubspotClient } from '@dotdo/integration-hubspot'

// Initialize client
const client = new HubspotClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new HubspotClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

**OAuth2 Configuration:**

- Authorization URL: https://app.hubspot.com/oauth/authorize
- Token URL: https://api.hubapi.com/oauth/v1/token
- Scopes: crm.objects.contacts.read, crm.objects.contacts.write, crm.objects.companies.read, crm.objects.companies.write, crm.objects.deals.read, crm.objects.deals.write, crm.objects.tickets.read, crm.objects.tickets.write, crm.schemas.contacts.read, crm.schemas.companies.read, crm.schemas.deals.read

## Resources

### Contact

Manage contacts in HubSpot CRM

#### `contact.create()`

```typescript
const result = await client.contact.create({
  params: value, // Contact creation parameters (email, firstname, lastname, etc.)
})
```

#### `contact.get()`

```typescript
const result = await client.contact.get({
  id: 'example', // Contact ID
  properties: value, // Properties to retrieve
})
```

#### `contact.update()`

```typescript
const result = await client.contact.update({
  id: 'example', // Contact ID
  params: value, // Contact update parameters
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
  limit: 123, // Number of results per page
  after: 'example', // Cursor for pagination
  properties: value, // Properties to retrieve
  propertiesWithHistory: value, // Properties with historical values
  associations: value, // Associated objects to retrieve
  archived: true, // Include archived contacts
})
```

#### `contact.search()`

```typescript
const result = await client.contact.search({
  options: value, // Search criteria (filterGroups, sorts, properties)
})
```

#### `contact.batchCreate()`

```typescript
const result = await client.contact.batchCreate({
  contacts: value, // Array of contact creation parameters
})
```

### Company

Manage companies in HubSpot CRM

#### `company.create()`

```typescript
const result = await client.company.create({
  params: value, // Company creation parameters (name, domain, industry, etc.)
})
```

#### `company.get()`

```typescript
const result = await client.company.get({
  id: 'example', // Company ID
  properties: value, // Properties to retrieve
})
```

#### `company.update()`

```typescript
const result = await client.company.update({
  id: 'example', // Company ID
  params: value, // Company update parameters
})
```

#### `company.delete()`

```typescript
const result = await client.company.delete({
  id: 'example', // Company ID
})
```

#### `company.list()`

```typescript
const result = await client.company.list({
  limit: 123, // Number of results per page
  after: 'example', // Cursor for pagination
  properties: value, // Properties to retrieve
  propertiesWithHistory: value, // Properties with historical values
  associations: value, // Associated objects to retrieve
  archived: true, // Include archived companies
})
```

#### `company.search()`

```typescript
const result = await client.company.search({
  options: value, // Search criteria (filterGroups, sorts, properties)
})
```

### Deal

Manage deals in HubSpot CRM

#### `deal.create()`

```typescript
const result = await client.deal.create({
  params: value, // Deal creation parameters (dealname, dealstage, pipeline, amount)
})
```

#### `deal.get()`

```typescript
const result = await client.deal.get({
  id: 'example', // Deal ID
  properties: value, // Properties to retrieve
})
```

#### `deal.update()`

```typescript
const result = await client.deal.update({
  id: 'example', // Deal ID
  params: value, // Deal update parameters
})
```

#### `deal.delete()`

```typescript
const result = await client.deal.delete({
  id: 'example', // Deal ID
})
```

#### `deal.list()`

```typescript
const result = await client.deal.list({
  limit: 123, // Number of results per page
  after: 'example', // Cursor for pagination
  properties: value, // Properties to retrieve
  propertiesWithHistory: value, // Properties with historical values
  associations: value, // Associated objects to retrieve
  archived: true, // Include archived deals
})
```

#### `deal.search()`

```typescript
const result = await client.deal.search({
  options: value, // Search criteria (filterGroups, sorts, properties)
})
```

#### `deal.associate()`

```typescript
const result = await client.deal.associate({
  dealId: 'example', // Deal ID
  options: value, // Association parameters (toObjectType, toObjectId, associationType)
})
```

### Ticket

Manage support tickets in HubSpot CRM

#### `ticket.create()`

```typescript
const result = await client.ticket.create({
  params: value, // Ticket creation parameters (subject, content, priority, pipeline)
})
```

#### `ticket.get()`

```typescript
const result = await client.ticket.get({
  id: 'example', // Ticket ID
  properties: value, // Properties to retrieve
})
```

#### `ticket.update()`

```typescript
const result = await client.ticket.update({
  id: 'example', // Ticket ID
  params: value, // Ticket update parameters
})
```

#### `ticket.delete()`

```typescript
const result = await client.ticket.delete({
  id: 'example', // Ticket ID
})
```

#### `ticket.list()`

```typescript
const result = await client.ticket.list({
  limit: 123, // Number of results per page
  after: 'example', // Cursor for pagination
  properties: value, // Properties to retrieve
  propertiesWithHistory: value, // Properties with historical values
  associations: value, // Associated objects to retrieve
  archived: true, // Include archived tickets
})
```

### Note

Create note engagements for contacts, companies, and deals

#### `note.create()`

```typescript
const result = await client.note.create({
  params: value, // Note creation parameters (hs_note_body, hs_timestamp, associations)
})
```

### Email

Create email engagements

#### `email.create()`

```typescript
const result = await client.email.create({
  params: value, // Email creation parameters (hs_email_subject, hs_email_text, associations)
})
```

### Call

Create call engagements

#### `call.create()`

```typescript
const result = await client.call.create({
  params: value, // Call creation parameters (hs_call_title, hs_call_duration, associations)
})
```

### Meeting

Create meeting engagements

#### `meeting.create()`

```typescript
const result = await client.meeting.create({
  params: value, // Meeting creation parameters (hs_meeting_title, hs_meeting_start_time, associations)
})
```

### Task

Create task engagements

#### `task.create()`

```typescript
const result = await client.task.create({
  params: value, // Task creation parameters (hs_task_subject, hs_task_status, associations)
})
```

### Property

Manage custom properties for CRM objects

#### `property.getAll()`

```typescript
const result = await client.property.getAll({
  objectType: 'example', // Object type (contacts, companies, deals, tickets)
})
```

#### `property.create()`

```typescript
const result = await client.property.create({
  objectType: 'example', // Object type (contacts, companies, deals, tickets)
  options: value, // Property creation parameters (name, label, type, fieldType)
})
```

### Workflow

Manage automation workflows

#### `workflow.list()`

```typescript
const result = await client.workflow.list({
  limit: 123, // Number of results per page
  after: 'example', // Cursor for pagination
})
```

## Error Handling

All errors are thrown as `HubspotError` instances with additional metadata:

```typescript
try {
  const result = await client.contact.list()
} catch (error) {
  if (error instanceof HubspotError) {
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
import { HubspotWebhookHandler, WebhookEventRouter } from '@dotdo/integration-hubspot'

// Initialize webhook handler
const handler = new HubspotWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onContactCreation(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `contact.creation` - Occurs when a new contact is created
- `contact.propertyChange` - Occurs when a contact property is updated
- `contact.deletion` - Occurs when a contact is deleted
- `contact.merge` - Occurs when contacts are merged
- `contact.restore` - Occurs when a contact is restored from deletion
- `contact.privacyDeletion` - Occurs when a contact is permanently deleted for privacy compliance
- `company.creation` - Occurs when a new company is created
- `company.propertyChange` - Occurs when a company property is updated
- `company.deletion` - Occurs when a company is deleted
- `company.merge` - Occurs when companies are merged
- `company.restore` - Occurs when a company is restored from deletion
- `deal.creation` - Occurs when a new deal is created
- `deal.propertyChange` - Occurs when a deal property is updated
- `deal.deletion` - Occurs when a deal is deleted
- `deal.merge` - Occurs when deals are merged
- `deal.restore` - Occurs when a deal is restored from deletion
- `ticket.creation` - Occurs when a new ticket is created
- `ticket.propertyChange` - Occurs when a ticket property is updated
- `ticket.deletion` - Occurs when a ticket is deleted
- `note.creation` - Occurs when a note engagement is created
- `email.creation` - Occurs when an email engagement is created
- `call.creation` - Occurs when a call engagement is created
- `meeting.creation` - Occurs when a meeting engagement is created
- `task.creation` - Occurs when a task engagement is created
- `form.submission` - Occurs when a form is submitted
- `contact.listMembership.added` - Occurs when a contact is added to a list
- `contact.listMembership.removed` - Occurs when a contact is removed from a list
- `workflow.enrollment` - Occurs when a contact is enrolled in a workflow
- `workflow.unenrollment` - Occurs when a contact is unenrolled from a workflow
- `conversation.creation` - Occurs when a conversation is created
- `conversation.propertyChange` - Occurs when a conversation property is updated
- `conversation.deletion` - Occurs when a conversation is deleted

## License

MIT
