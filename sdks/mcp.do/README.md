# mcp.do SDK

TypeScript SDK for **mcp.do** - Model Context Protocol integration testing with database.do.

## Overview

This SDK provides utilities for testing MCP server integration with database.do, ensuring that the `do` tool exposed via MCP can properly interact with the Payload CMS Durable Objects database with full ACID compliance.

## Features

- ✅ **MCP Client** - Connect to MCP servers and execute tools
- ✅ **Tool Discovery** - List and inspect available tools, resources, prompts
- ✅ **TypeScript Execution** - Execute TypeScript code via the `do` tool
- ✅ **Database Integration** - Test database operations through MCP
- ✅ **ACID Compliance** - Verify transactions maintain ACID guarantees via MCP
- ✅ **Comprehensive Tests** - Full test suite for MCP/database integration

## Installation

```bash
pnpm add mcp.do @modelcontextprotocol/sdk
```

## Quick Start

```typescript
import { createClient } from 'mcp.do'

// Create MCP client
const mcp = createClient({
  command: 'node',
  args: ['path/to/mcp-server.js'],
  env: {
    DATABASE_URL: 'http://localhost:8788',
  },
})

// Connect to server
await mcp.connect()

// List available tools
const tools = await mcp.listTools()
console.log('Available tools:', tools)

// Execute TypeScript via the `do` tool
const result = await mcp.executeTypescript(`
  return await $.db.list('users', { limit: 10 })
`)

console.log('Users:', result)

// Disconnect
await mcp.disconnect()
```

## Database Operations via MCP

### Create Document

```typescript
const user = await mcp.executeTypescript(`
  return await $.db.create('users', {
    id: 'user1',
    name: 'Alice',
    email: 'alice@example.com',
    balance: 100,
    status: 'active',
    createdAt: new Date().toISOString(),
  })
`)
```

### Read Document

```typescript
const user = await mcp.executeTypescript(`
  return await $.db.get('users', 'user1')
`)
```

### Update Document

```typescript
const updated = await mcp.executeTypescript(`
  return await $.db.update('users', 'user1', {
    balance: 150,
  })
`)
```

### Delete Document

```typescript
await mcp.executeTypescript(`
  await $.db.delete('users', 'user1')
`)
```

### List Documents

```typescript
const users = await mcp.executeTypescript(`
  return await $.db.list('users', {
    limit: 10,
    offset: 0,
    sort: { createdAt: 'desc' },
  })
`)
```

## Transactions via MCP

### Atomic Transfer

```typescript
await mcp.executeTypescript(`
  await $.db.transaction(async (tx) => {
    const fromAccount = await tx.get('accounts', 'account1')
    const toAccount = await tx.get('accounts', 'account2')

    await tx.update('accounts', 'account1', {
      balance: fromAccount.balance - 100,
    })

    await tx.update('accounts', 'account2', {
      balance: toAccount.balance + 100,
    })
  })
`)
```

### Rollback on Error

```typescript
try {
  await mcp.executeTypescript(`
    await $.db.transaction(async (tx) => {
      await tx.create('orders', order1)
      await tx.create('orders', order2)
      throw new Error('Rollback!')
    })
  `)
} catch (error) {
  console.log('Transaction rolled back')
}
```

## Batch Operations via MCP

### Batch Create

```typescript
const result = await mcp.executeTypescript(`
  return await $.db.batchCreate('users', [
    { id: 'user1', name: 'Alice', email: 'alice@example.com', balance: 100, status: 'active', createdAt: new Date().toISOString() },
    { id: 'user2', name: 'Bob', email: 'bob@example.com', balance: 200, status: 'active', createdAt: new Date().toISOString() },
    { id: 'user3', name: 'Charlie', email: 'charlie@example.com', balance: 300, status: 'active', createdAt: new Date().toISOString() },
  ])
`)

console.log(`Created: ${result.success.length}, Errors: ${result.errors.length}`)
```

### Batch Update

```typescript
await mcp.executeTypescript(`
  await $.db.batchUpdate('users', [
    { id: 'user1', data: { balance: 150 } },
    { id: 'user2', data: { balance: 250 } },
  ])
`)
```

### Batch Delete

```typescript
await mcp.executeTypescript(`
  await $.db.batchDelete('users', ['user1', 'user2', 'user3'])
`)
```

## MCP Server Discovery

### List Tools

```typescript
const tools = await mcp.listTools()

tools.forEach((tool) => {
  console.log(`Tool: ${tool.name}`)
  console.log(`Description: ${tool.description}`)
})
```

### List Resources

```typescript
const resources = await mcp.listResources()

resources.forEach((resource) => {
  console.log(`Resource: ${resource.name} (${resource.uri})`)
})
```

### Health Check

```typescript
const health = await mcp.health()

console.log(`Status: ${health.status}`)
console.log(`Tools: ${health.tools}`)
console.log(`Resources: ${health.resources}`)
console.log(`Prompts: ${health.prompts}`)
```

## Testing

The SDK includes comprehensive integration tests for MCP/database.do:

```bash
# Run against local development
TEST_URL=http://localhost:8788 pnpm test:e2e

# Run against production
TEST_URL=https://database.do pnpm test:e2e

# Run only MCP integration tests
pnpm test:integration
```

### Test Coverage

The test suite verifies:

- **Server Discovery**: Tool, resource, and prompt listing
- **Database Operations**: Create, read, update, delete via TypeScript
- **Transactions**: Atomic commits and rollbacks via MCP
- **ACID Compliance**: Atomicity, consistency, isolation, durability via MCP
- **Batch Operations**: Bulk create, update, delete via MCP
- **Error Handling**: Graceful error handling for TypeScript and database errors
- **Performance**: Sequential operations and complex TypeScript logic

## API Reference

### McpClient

#### `connect(): Promise<void>`

Connect to the MCP server.

#### `disconnect(): Promise<void>`

Disconnect from the MCP server.

#### `listTools(): Promise<McpTool[]>`

List available tools.

#### `listResources(): Promise<McpResource[]>`

List available resources.

#### `listPrompts(): Promise<McpPrompt[]>`

List available prompts.

#### `readResource(uri: string): Promise<any>`

Read a resource by URI.

#### `getPrompt(name: string, args?: Record<string, string>): Promise<any>`

Get a prompt with optional arguments.

#### `executeTool(name: string, args: Record<string, any>): Promise<ExecuteToolResult>`

Execute a tool with arguments.

#### `executeTypescript(script: string): Promise<any>`

Execute TypeScript code via the `do` tool.

#### `health(): Promise<{status: string, tools: number, resources: number, prompts: number}>`

Get server health status.

## Architecture

### Integration Flow

```
Client (TypeScript)
  ↓
mcp.do SDK
  ↓
MCP Server (Model Context Protocol)
  ↓
`do` tool (TypeScript execution)
  ↓
$.db (Database SDK)
  ↓
database.do (Durable Objects)
  ↓
Payload CMS DO SQLite Adapter
  ↓
SQLite (Tenant-specific database)
```

### ACID Guarantees

All database operations via MCP maintain full ACID compliance:

- **Atomicity**: Transactions commit or rollback atomically
- **Consistency**: Database constraints enforced
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Committed data persists

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

- [MCP.do Documentation](https://mcp.do)
- [Database.do SDK](../database.do)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [GitHub Repository](https://github.com/dot-do/platform)
