# Notion Integration

All-in-one workspace for notes, wikis, projects, and databases

**Category**: productivity
**Service**: Notion
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/notion](https://integrations.do/notion)

## Installation

```bash
npm install @dotdo/integration-notion
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-notion
```

## Quick Start

```typescript
import { NotionClient } from '@dotdo/integration-notion'

// Initialize client
const client = new NotionClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new NotionClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

**OAuth2 Configuration:**

- Authorization URL: https://api.notion.com/v1/oauth/authorize
- Token URL: https://api.notion.com/v1/oauth/token
- Scopes:

## Resources

### Page

Notion pages with properties and content

#### `page.create()`

```typescript
const result = await client.page.create({
  params: value, // Page creation parameters (parent, properties, children)
})
```

#### `page.get()`

```typescript
const result = await client.page.get({
  pageId: 'example', // Page ID
})
```

#### `page.update()`

```typescript
const result = await client.page.update({
  pageId: 'example', // Page ID
  params: value, // Page update parameters (properties, archived, icon, cover)
})
```

#### `page.archive()`

```typescript
const result = await client.page.archive({
  pageId: 'example', // Page ID
})
```

#### `page.list()`

```typescript
const result = await client.page.list({
  options: value, // List options (pagination)
})
```

#### `page.search()`

```typescript
const result = await client.page.search({
  query: 'example', // Search query text
  options: value, // Search options (filter, sort, pagination)
})
```

### Database

Notion databases with schema and entries

#### `database.create()`

```typescript
const result = await client.database.create({
  params: value, // Database creation parameters (parent, title, properties)
})
```

#### `database.get()`

```typescript
const result = await client.database.get({
  databaseId: 'example', // Database ID
})
```

#### `database.update()`

```typescript
const result = await client.database.update({
  databaseId: 'example', // Database ID
  params: value, // Database update parameters (title, description, properties)
})
```

#### `database.query()`

```typescript
const result = await client.database.query({
  databaseId: 'example', // Database ID
  params: value, // Query parameters (filter, sorts, pagination)
})
```

#### `database.archive()`

```typescript
const result = await client.database.archive({
  databaseId: 'example', // Database ID
})
```

### Block

Content blocks within pages (paragraphs, headings, lists, etc.)

#### `block.get()`

```typescript
const result = await client.block.get({
  blockId: 'example', // Block ID
})
```

#### `block.update()`

```typescript
const result = await client.block.update({
  blockId: 'example', // Block ID
  params: value, // Block update parameters
})
```

#### `block.delete()`

```typescript
const result = await client.block.delete({
  blockId: 'example', // Block ID
})
```

#### `block.append()`

```typescript
const result = await client.block.append({
  blockId: 'example', // Parent block or page ID
  params: value, // Blocks to append (children array)
})
```

#### `block.getChildren()`

```typescript
const result = await client.block.getChildren({
  blockId: 'example', // Parent block ID
  options: value, // List options (pagination)
})
```

### User

Users and bots in the workspace

#### `user.get()`

```typescript
const result = await client.user.get({
  userId: 'example', // User ID
})
```

#### `user.list()`

```typescript
const result = await client.user.list({
  options: value, // List options (pagination)
})
```

#### `user.getMe()`

```typescript
const result = await client.user.getMe()
```

### Comment

Comments on pages and discussions

#### `comment.create()`

```typescript
const result = await client.comment.create({
  params: value, // Comment creation parameters (parent, rich_text)
})
```

#### `comment.list()`

```typescript
const result = await client.comment.list({
  blockId: 'example', // Page or discussion ID
  options: value, // List options (pagination)
})
```

### Search

Universal search across pages and databases

#### `search.query()`

```typescript
const result = await client.search.query({
  options: value, // Search options (query, filter, sort, pagination)
})
```

## Error Handling

All errors are thrown as `NotionError` instances with additional metadata:

```typescript
try {
  const result = await client.page.list()
} catch (error) {
  if (error instanceof NotionError) {
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
import { NotionWebhookHandler, WebhookEventRouter } from '@dotdo/integration-notion'

// Initialize webhook handler
const handler = new NotionWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onPageCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `page.created` - Occurs when a new page is created
- `page.updated` - Occurs when a page is updated
- `page.deleted` - Occurs when a page is deleted or archived
- `database.created` - Occurs when a new database is created
- `database.updated` - Occurs when a database is updated
- `database.deleted` - Occurs when a database is deleted or archived
- `block.created` - Occurs when a new block is created
- `block.updated` - Occurs when a block is updated
- `block.deleted` - Occurs when a block is deleted
- `comment.created` - Occurs when a new comment is created

## Rate Limits

This Integration enforces the following rate limits:

- **Per Second**: 3 requests

**Burst Size**: 10 requests

## License

MIT
