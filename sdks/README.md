# SDKs

SDK implementations for all `.do` platform domains.

## Overview

This folder contains SDK implementations for each `.do` domain. Each SDK provides a TypeScript interface to interact with a specific platform service or capability.

## Core SDK Domains

### Platform Services

**[sdk.do](./sdk.do/)** - Core TypeScript SDK with semantic `$` proxy

- Purpose: Main SDK with all core functions (`ai`, `api`, `db`, `on`, `send`, `every`, `user`)
- Status: ✅ Implemented
- Install: `pnpm add sdk.do`

**[mcp.do](./mcp.do/)** - Model Context Protocol server

- Purpose: Expose SDK as MCP server for AI assistants
- Status: ✅ Implemented
- Install: `pnpm add mcp.do`

**[apis.do](./apis.do/)** - Unified API gateway

- Purpose: External API integration with semantic context
- Status: ✅ SDK exists (needs site)
- Install: Part of `sdk.do`

**[database.do](./database.do/)** - Semantic database operations

- Purpose: Database layer with semantic types and relationships
- Status: ✅ SDK exists (needs site)
- Install: Part of `sdk.do`

**[events.do](./events.do/)** - Event system (on/send)

- Purpose: Publish/subscribe event system with semantic patterns
- Status: ✅ SDK exists (needs site)
- Install: Part of `sdk.do`

**[functions.do](./functions.do/)** - Function execution

- Purpose: Serverless function execution and management
- Status: ✅ SDK exists (needs site)
- Install: Part of `sdk.do`

**[rpc.do](./rpc.do/)** - RPC communication

- Purpose: Inter-service RPC communication
- Status: ✅ SDK exists (needs site)
- Install: Part of `sdk.do`

**[services.do](./services.do/)** - Service deployment

- Purpose: Deploy and manage platform services
- Status: ✅ SDK exists (needs site)
- Install: Part of `sdk.do`

**[workflows.do](./workflows.do/)** - Workflow orchestration

- Purpose: Build and execute business workflows
- Status: ✅ SDK exists (needs site)
- Install: Part of `sdk.do`

**[agents.do](./agents.do/)** - Agent framework

- Purpose: Build and deploy autonomous agents
- Status: ✅ SDK exists (needs site)
- Install: Part of `sdk.do`

### SDK Function Domains

**[ai.do](./ai.do/)** - AI services

- Purpose: AI generation, embeddings, batch processing
- Status: 🚧 Planned
- Will provide: `ai.generate()`, `ai.embed()`, `ai.batch()`

**[api.do](./api.do/)** - External API integration

- Purpose: Call external APIs with semantic context
- Status: 🚧 Planned
- Will provide: `api.fetch()`, `api.stripe.*`, `api.openai.*`

**[db.do](./db.do/)** - Database operations

- Purpose: CRUD operations with semantic types
- Status: 🚧 Planned
- Will provide: `db.list()`, `db.get()`, `db.create()`, `db.update()`, `db.delete()`

## CLI Tools

**[cli.do](./cli.do/)** - Command-line interface

- Purpose: Execute SDK functions from terminal
- Status: 🚧 Planned
- Examples: `do db list Business`, `do ai generate "..."`

## SDK Structure

Each SDK follows this structure:

```
{domain}.do/
├── src/
│   ├── index.ts        → Main entry point
│   ├── types.ts        → TypeScript type definitions
│   ├── client.ts       → Client implementation
│   └── *.ts            → Additional modules
├── tests/
│   └── *.test.ts       → Unit tests
├── examples/
│   └── *.ts            → Usage examples
├── README.md           → SDK documentation
├── package.json        → Package manifest
└── tsconfig.json       → TypeScript config
```

## Development

### Install Dependencies

```bash
pnpm install
```

### Build All SDKs

```bash
pnpm build
```

### Test All SDKs

```bash
pnpm test
```

### Run Examples

```bash
cd sdks/{domain}.do
pnpm tsx examples/basic.ts
```

## Adding a New SDK

1. **Create SDK folder**: `mkdir sdks/{domain}.do`
2. **Initialize package**: `cd sdks/{domain}.do && pnpm init`
3. **Create source files**:
   - `src/index.ts` - Main exports
   - `src/types.ts` - Type definitions
   - `src/client.ts` - Client implementation
4. **Write README**: Document purpose, installation, API
5. **Add tests**: Create test files in `tests/`
6. **Add examples**: Create example files in `examples/`
7. **Create site**: Add documentation in `../sites/{domain}/`
8. **Update this README**: Add SDK to appropriate category

## SDK Naming Conventions

- **Core domains**: Use descriptive `.do` names (e.g., `database.do`, `functions.do`)
- **Function domains**: Mirror SDK function names (e.g., `ai.do` → `ai`, `db.do` → `db`)
- **Tool domains**: Use action-oriented names (e.g., `cli.do`)

## Semantic Patterns

All SDKs should follow these principles:

1. **Use semantic types**: Integrate with `$.Subject.predicate.Object` patterns
2. **Support Schema.org**: Accept and return Schema.org types
3. **Provide type safety**: Full TypeScript types for all APIs
4. **Include examples**: Real-world usage for each function
5. **Document semantic patterns**: Show how to use with vocabularies

## Integration with SDK.do

Most SDK domains are part of the main `sdk.do` package:

```typescript
import $, { ai, api, db, on, send, every, user } from 'sdk.do'

// All SDK functions available from single import
await ai.generate({ prompt: '...' })
await db.list($.Business)
on($.Order.created, handler)
```

Separate SDK packages (like `cli.do`, `mcp.do`) provide alternative interfaces to the same functionality.

## License

MIT (Open Source)

---

Part of the [`.do` platform](https://github.com/dot-do/platform) open-source ecosystem.
