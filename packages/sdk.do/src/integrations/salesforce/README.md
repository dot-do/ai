# Salesforce Integration

Customer relationship management platform for sales, service, marketing, and commerce

**Category**: crm
**Service**: Salesforce
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/salesforce](https://integrations.do/salesforce)

## Installation

```bash
npm install @dotdo/integration-salesforce
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-salesforce
```

## Quick Start

```typescript
import { SalesforceClient } from '@dotdo/integration-salesforce'

// Initialize client
const client = new SalesforceClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SalesforceClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

**OAuth2 Configuration:**

- Authorization URL: https://login.salesforce.com/services/oauth2/authorize
- Token URL: https://login.salesforce.com/services/oauth2/token
- Scopes: api, refresh_token, full

## Resources

### Account

Business account records

#### `account.create()`

```typescript
const result = await client.account.create({
  params: {}, // Account creation parameters (Name, Type, Industry, etc.)
})
```

#### `account.get()`

```typescript
const result = await client.account.get({
  id: 'example', // Account ID (18-character Salesforce ID)
})
```

#### `account.update()`

```typescript
const result = await client.account.update({
  id: 'example', // Account ID
  params: {}, // Update parameters
})
```

#### `account.delete()`

```typescript
const result = await client.account.delete({
  id: 'example', // Account ID
})
```

#### `account.list()`

```typescript
const result = await client.account.list({
  options: {}, // List options (type, industry, limit, orderBy, etc.)
})
```

#### `account.search()`

```typescript
const result = await client.account.search({
  searchTerm: 'example', // Search term for SOSL query
})
```

### Contact

Individual contact records

#### `contact.create()`

```typescript
const result = await client.contact.create({
  params: {}, // Contact creation parameters (FirstName, LastName, Email, AccountId, etc.)
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
  params: {}, // Update parameters
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
  options: {}, // List options (accountId, limit, orderBy, etc.)
})
```

#### `contact.search()`

```typescript
const result = await client.contact.search({
  searchTerm: 'example', // Search term for SOSL query
})
```

### Lead

Lead records for prospective customers

#### `lead.create()`

```typescript
const result = await client.lead.create({
  params: {}, // Lead creation parameters (FirstName, LastName, Company, Status, etc.)
})
```

#### `lead.get()`

```typescript
const result = await client.lead.get({
  id: 'example', // Lead ID
})
```

#### `lead.update()`

```typescript
const result = await client.lead.update({
  id: 'example', // Lead ID
  params: {}, // Update parameters
})
```

#### `lead.delete()`

```typescript
const result = await client.lead.delete({
  id: 'example', // Lead ID
})
```

#### `lead.convert()`

```typescript
const result = await client.lead.convert({
  options: {}, // Lead conversion options (leadId, convertedStatus, doNotCreateOpportunity, etc.)
})
```

#### `lead.list()`

```typescript
const result = await client.lead.list({
  options: {}, // List options (status, rating, limit, orderBy, etc.)
})
```

### Opportunity

Sales opportunity records

#### `opportunity.create()`

```typescript
const result = await client.opportunity.create({
  params: {}, // Opportunity creation parameters (Name, AccountId, StageName, CloseDate, Amount, etc.)
})
```

#### `opportunity.get()`

```typescript
const result = await client.opportunity.get({
  id: 'example', // Opportunity ID
})
```

#### `opportunity.update()`

```typescript
const result = await client.opportunity.update({
  id: 'example', // Opportunity ID
  params: {}, // Update parameters
})
```

#### `opportunity.delete()`

```typescript
const result = await client.opportunity.delete({
  id: 'example', // Opportunity ID
})
```

#### `opportunity.list()`

```typescript
const result = await client.opportunity.list({
  options: {}, // List options (accountId, stageName, limit, orderBy, etc.)
})
```

### Case

Customer service case records

#### `case.create()`

```typescript
const result = await client.case.create({
  params: {}, // Case creation parameters (Subject, Description, Status, Priority, AccountId, etc.)
})
```

#### `case.get()`

```typescript
const result = await client.case.get({
  id: 'example', // Case ID
})
```

#### `case.update()`

```typescript
const result = await client.case.update({
  id: 'example', // Case ID
  params: {}, // Update parameters
})
```

#### `case.delete()`

```typescript
const result = await client.case.delete({
  id: 'example', // Case ID
})
```

#### `case.list()`

```typescript
const result = await client.case.list({
  options: {}, // List options (accountId, status, priority, limit, orderBy, etc.)
})
```

### Task

Activity task records

#### `task.create()`

```typescript
const result = await client.task.create({
  params: {}, // Task creation parameters (Subject, Status, Priority, ActivityDate, WhoId, WhatId, etc.)
})
```

#### `task.get()`

```typescript
const result = await client.task.get({
  id: 'example', // Task ID
})
```

#### `task.update()`

```typescript
const result = await client.task.update({
  id: 'example', // Task ID
  params: {}, // Update parameters
})
```

#### `task.delete()`

```typescript
const result = await client.task.delete({
  id: 'example', // Task ID
})
```

#### `task.list()`

```typescript
const result = await client.task.list({
  options: {}, // List options (status, priority, limit, orderBy, etc.)
})
```

### CustomObject

Generic custom object operations

#### `customObject.create()`

```typescript
const result = await client.customObject.create({
  objectType: 'example', // Custom object API name (e.g., 'CustomObject__c')
  params: {}, // Record data
})
```

#### `customObject.get()`

```typescript
const result = await client.customObject.get({
  objectType: 'example', // Custom object API name
  id: 'example', // Record ID
})
```

#### `customObject.update()`

```typescript
const result = await client.customObject.update({
  objectType: 'example', // Custom object API name
  id: 'example', // Record ID
  params: {}, // Record data
})
```

#### `customObject.delete()`

```typescript
const result = await client.customObject.delete({
  objectType: 'example', // Custom object API name
  id: 'example', // Record ID
})
```

### Query

SOQL query execution

#### `query.execute()`

```typescript
const result = await client.query.execute({
  soql: 'example', // SOQL query string
})
```

#### `query.queryMore()`

```typescript
const result = await client.query.queryMore({
  nextRecordsUrl: 'example', // Next records URL from previous query result
})
```

### Search

SOSL search execution

#### `search.execute()`

```typescript
const result = await client.search.execute({
  sosl: 'example', // SOSL search string
})
```

### Bulk

Bulk API operations for large datasets

#### `bulk.insert()`

```typescript
const result = await client.bulk.insert({
  objectType: 'example', // Object type
  records: [], // Array of records to insert (up to 10,000)
})
```

#### `bulk.update()`

```typescript
const result = await client.bulk.update({
  objectType: 'example', // Object type
  records: [], // Array of records to update
})
```

#### `bulk.delete()`

```typescript
const result = await client.bulk.delete({
  objectType: 'example', // Object type
  records: [], // Array of records with IDs to delete
})
```

### Metadata

Object and field metadata introspection

#### `metadata.describeObject()`

```typescript
const result = await client.metadata.describeObject({
  objectType: 'example', // Object type to describe
})
```

#### `metadata.describeGlobal()`

```typescript
const result = await client.metadata.describeGlobal()
```

## Error Handling

All errors are thrown as `SalesforceError` instances with additional metadata:

```typescript
try {
  const result = await client.account.list()
} catch (error) {
  if (error instanceof SalesforceError) {
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
import { SalesforceWebhookHandler, WebhookEventRouter } from '@dotdo/integration-salesforce'

// Initialize webhook handler
const handler = new SalesforceWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onAccountCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `Account:created` - Occurs when a new account is created
- `Account:updated` - Occurs when an account is updated
- `Account:deleted` - Occurs when an account is deleted
- `Contact:created` - Occurs when a new contact is created
- `Contact:updated` - Occurs when a contact is updated
- `Contact:deleted` - Occurs when a contact is deleted
- `Lead:created` - Occurs when a new lead is created
- `Lead:updated` - Occurs when a lead is updated
- `Lead:deleted` - Occurs when a lead is deleted
- `Lead:converted` - Occurs when a lead is converted to account, contact, and opportunity
- `Opportunity:created` - Occurs when a new opportunity is created
- `Opportunity:updated` - Occurs when an opportunity is updated
- `Opportunity:deleted` - Occurs when an opportunity is deleted
- `Case:created` - Occurs when a new case is created
- `Case:updated` - Occurs when a case is updated
- `Case:deleted` - Occurs when a case is deleted
- `Task:created` - Occurs when a new task is created
- `Task:updated` - Occurs when a task is updated
- `Task:deleted` - Occurs when a task is deleted
- `platform_event` - Custom platform event
- `change_data_capture` - Change data capture event for real-time updates

## License

MIT
