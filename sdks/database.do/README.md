# database.do SDK

TypeScript SDK for **database.do** - Tenant-specific ACID-compliant database with Payload CMS integration on Cloudflare Durable Objects.

## Features

- ✅ **ACID Compliant** - Full Atomicity, Consistency, Isolation, Durability guarantees
- ✅ **Tenant Isolation** - Each tenant gets their own Durable Object with isolated SQLite database
- ✅ **Payload CMS Integration** - Uses @payloadcms/db-do-sqlite adapter with Drizzle ORM
- ✅ **Type-Safe** - Full TypeScript support with type inference
- ✅ **Transactions** - Multi-operation atomic transactions with rollback support
- ✅ **Batch Operations** - Efficient bulk create, update, delete
- ✅ **Schema Management** - Dynamic collection creation with validation
- ✅ **Location-Based Routing** - Automatic routing to nearest Durable Object

## Installation

```bash
pnpm add database.do
```

## Quick Start

```typescript
import { createClient } from 'database.do'

// Create client
const db = createClient({
  baseUrl: 'https://database.do', // or http://localhost:8788 for dev
})

// Create a collection
await db.createCollection('users', {
  id: { type: 'string', required: true, unique: true },
  name: { type: 'string', required: true },
  email: { type: 'string', unique: true },
  balance: { type: 'number', required: true },
})

// Create document
const user = await db.create('users', {
  id: 'user1',
  name: 'Alice',
  email: 'alice@example.com',
  balance: 100,
})

// Get document
const retrieved = await db.get('users', 'user1')

// Update document
await db.update('users', 'user1', {
  balance: 150,
})

// List documents
const users = await db.list('users', {
  limit: 10,
  offset: 0,
  sort: { createdAt: 'desc' },
})

// Delete document
await db.delete('users', 'user1')
```

## Transactions

```typescript
// Atomic money transfer
await db.transaction(async (tx) => {
  const fromAccount = await tx.get('accounts', 'account1')
  const toAccount = await tx.get('accounts', 'account2')

  await tx.update('accounts', 'account1', {
    balance: fromAccount.balance - 100,
  })

  await tx.update('accounts', 'account2', {
    balance: toAccount.balance + 100,
  })

  // Automatically commits if successful
  // Automatically rolls back on error
})
```

## Batch Operations

```typescript
// Batch create
const result = await db.batchCreate('users', [
  { id: 'user1', name: 'Alice', email: 'alice@example.com', balance: 100 },
  { id: 'user2', name: 'Bob', email: 'bob@example.com', balance: 200 },
  { id: 'user3', name: 'Charlie', email: 'charlie@example.com', balance: 300 },
])

console.log(`Created: ${result.success.length}, Errors: ${result.errors.length}`)

// Batch update
await db.batchUpdate('users', [
  { id: 'user1', data: { balance: 150 } },
  { id: 'user2', data: { balance: 250 } },
])

// Batch delete
await db.batchDelete('users', ['user1', 'user2', 'user3'])
```

## Schema Management

```typescript
// Create collection with schema
await db.createCollection('products', {
  id: { type: 'string', required: true, unique: true },
  name: { type: 'string', required: true },
  price: { type: 'number', required: true },
  inStock: { type: 'boolean', required: true },
  tags: { type: 'array' },
  metadata: { type: 'object' },
  createdAt: { type: 'date', required: true },
})

// List all collections
const collections = await db.collections()

// Delete collection
await db.deleteCollection('products')
```

## ACID Compliance

This SDK provides full ACID guarantees:

### Atomicity

Transactions either fully commit or fully rollback. No partial states.

```typescript
try {
  await db.transaction(async (tx) => {
    await tx.create('orders', order1)
    await tx.create('orders', order2)
    throw new Error('Rollback!')
  })
} catch (error) {
  // Both creates are rolled back
}
```

### Consistency

Database constraints are enforced:

```typescript
// Unique constraint violation
await db.create('users', { id: 'user1', email: 'alice@example.com' })
await db.create('users', { id: 'user2', email: 'alice@example.com' }) // ❌ Error

// Required field validation
await db.create('users', { id: 'user3' }) // ❌ Error: missing required fields

// Type validation
await db.create('users', { id: 'user4', balance: 'invalid' }) // ❌ Error: invalid type
```

### Isolation

Concurrent transactions don't interfere:

```typescript
// 10 concurrent transactions incrementing a counter
await Promise.all(
  Array.from({ length: 10 }, () =>
    db.transaction(async (tx) => {
      const doc = await tx.get('counters', 'counter1')
      await tx.update('counters', 'counter1', {
        value: doc.value + 1,
      })
    })
  )
)

// Counter correctly incremented by 10
```

### Durability

Committed transactions survive failures:

```typescript
await db.transaction(async (tx) => {
  await tx.create('users', user)
  // Transaction committed
})

// Data persists even after reconnection
const newClient = createClient({ baseUrl: 'https://database.do' })
const user = await newClient.get('users', 'user1') // ✅ Still exists
```

## Testing

The SDK includes comprehensive ACID compliance tests:

```bash
# Run against local development
TEST_URL=http://localhost:8788 pnpm test:e2e

# Run against production
TEST_URL=https://database.do pnpm test:e2e

# Run only ACID tests
pnpm test:acid
```

## API Reference

### Client Methods

#### `get<T>(collection: string, id: string): Promise<T | null>`

Get a document by ID.

#### `list<T>(collection: string, options?: QueryOptions): Promise<PaginatedResponse<T>>`

List documents with pagination and filtering.

#### `create<T>(collection: string, data: any): Promise<T>`

Create a new document.

#### `update<T>(collection: string, id: string, data: any): Promise<T>`

Update an existing document.

#### `delete(collection: string, id: string): Promise<void>`

Delete a document.

#### `batchCreate<T>(collection: string, documents: any[]): Promise<BatchResult<T>>`

Batch create multiple documents.

#### `batchUpdate<T>(collection: string, updates: Array<{id: string, data: any}>): Promise<BatchResult<T>>`

Batch update multiple documents.

#### `batchDelete(collection: string, ids: string[]): Promise<void>`

Batch delete multiple documents.

#### `transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>`

Execute operations in an atomic transaction.

#### `collections(): Promise<Collection[]>`

List all collections.

#### `createCollection(name: string, schema?: CollectionSchema): Promise<Collection>`

Create a new collection with optional schema.

#### `deleteCollection(name: string): Promise<void>`

Delete a collection.

#### `health(): Promise<{status: string, timestamp: number}>`

Check database health.

## Architecture

### Tenant Isolation

Each authenticated user gets their own Durable Object instance with an isolated SQLite database:

```
User A (tenantId: user-123)
  ↓
database.do (routes by tenantId)
  ↓
Durable Object: DO-user-123
  ↓
SQLite Database (isolated to user-123)
```

### Payload CMS Integration

Uses [@payloadcms/db-do-sqlite](../../packages/payload-fork/packages/db-do-sqlite) adapter:

- **Drizzle ORM** - Type-safe migrations with drizzle-orm/durable-sqlite
- **Atomic Migrations** - Migrations execute within `ctx.blockConcurrencyWhile()`
- **Schema Management** - Full Payload collection support

### Location-Based Routing

Durable Objects automatically route to the nearest Cloudflare data center:

```typescript
// Request from US → Routes to US Durable Object
// Request from EU → Routes to EU Durable Object
// Strong consistency within each region
```

## Development

```bash
# Install dependencies
pnpm install

# Build SDK
pnpm build

# Run tests
pnpm test

# Run e2e tests locally
pnpm test:e2e:local
```

## License

MIT © dot-do

## Links

- [Database.do Documentation](https://database.do)
- [Payload CMS DO Adapter](../../packages/payload-fork/packages/db-do-sqlite)
- [GitHub Repository](https://github.com/dot-do/platform)
