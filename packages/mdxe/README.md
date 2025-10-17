# mdxe - MDX Execution Engine

Execute MDXLD Workers with wrangler integration.

## Overview

`mdxe` enables you to define Cloudflare Workers as MDXLD files (MDX with Linked Data), combining worker configuration, code, and documentation in a single, semantic format.

## Features

- **MDXLD Worker Format**: Define workers with `$type: Worker` and wrangler config in YAML frontmatter
- **Wrangler Integration**: Seamlessly delegate to wrangler CLI for dev/build/deploy
- **Schema Validation**: Validate worker configuration against wrangler schema
- **Documentation as Code**: Keep worker docs alongside config and code

## Installation

```bash
pnpm add mdxe
```

## MDXLD Worker Format

Create a worker as an `.mdx` file with YAML frontmatter:

```mdx
---
$type: Worker
$id: https://workers.do/example
name: example
main: src/index.ts
compatibility_date: 2025-10-14
compatibility_flags:
  - nodejs_compat
observability:
  enabled: true
services:
  - binding: API
    service: api
---

# Example Worker

This worker does amazing things.

## Features

- Feature 1
- Feature 2

## Architecture

[Diagram or explanation]
```

## CLI Usage

### Authentication

Authenticate with the .do platform:

```bash
# Login with OAuth
mdxe auth login

# Check authentication status
mdxe auth status

# Validate token
mdxe auth validate

# Set API key
mdxe auth set-token <token>

# Set admin token
mdxe auth set-admin-token <token>

# Logout
mdxe auth logout
```

Or set environment variables:

```bash
export DO_TOKEN=sk_xxx
export DO_ADMIN_TOKEN=sk_admin_xxx
```

### Development

Start development server:

```bash
mdxe dev workers/example/worker.mdx
```

### Build

Build worker (validates configuration):

```bash
mdxe build workers/example/worker.mdx
```

### Deploy

Deploy worker to Cloudflare:

```bash
mdxe deploy workers/example/worker.mdx
```

Deploy to specific environment:

```bash
mdxe deploy workers/example/worker.mdx --env staging
```

### Test

Run tests:

```bash
mdxe test workers/example/worker.mdx
```

### Validate

Validate worker configuration:

```bash
mdxe validate workers/example/worker.mdx
```

## Programmatic Usage

```typescript
import { parseWorker, validateWorkerConfig, runWrangler } from 'mdxe'

// Parse MDXLD worker
const worker = await parseWorker('workers/example/worker.mdx')

// Validate configuration
const validation = validateWorkerConfig(worker.frontmatter)
if (!validation.valid) {
  console.error('Invalid configuration:', validation.errors)
}

// Run wrangler command
const result = await runWrangler('dev', worker, { verbose: true })
```

## Configuration

The YAML frontmatter supports all wrangler.jsonc properties:

### Core Configuration

- `name` - Worker name (required)
- `main` - Entry point file (required)
- `compatibility_date` - Compatibility date (required)
- `compatibility_flags` - Compatibility flags array
- `account_id` - Cloudflare account ID

### Bindings

- `services` - Service bindings to other workers
- `durable_objects` - Durable Object bindings
- `kv_namespaces` - KV namespace bindings
- `r2_buckets` - R2 bucket bindings
- `d1_databases` - D1 database bindings
- `vectorize` - Vectorize index bindings
- `ai` - AI binding
- `worker_loaders` - Worker Loader bindings

### Observability

- `observability` - Observability configuration
- `tail_consumers` - Tail consumer bindings

### Advanced

- `migrations` - Durable Object migrations
- `routes` - Route configuration
- `vars` - Environment variables
- `queues` - Queue producers and consumers
- `pipelines` - Pipeline bindings
- `env` - Environment-specific configuration

## Linked Data Properties

In addition to wrangler config, you can add linked data properties:

- `$type: Worker` - Required type identifier
- `$id` - Unique identifier (e.g., `https://workers.do/example`)
- `$context` - JSON-LD context for semantic interpretation

## How It Works

1. **Parse**: mdxe parses the MDXLD file using the `mdxld` library
2. **Validate**: Validates `$type: Worker` and required fields
3. **Extract**: Extracts wrangler configuration from frontmatter
4. **Generate**: Creates temporary `wrangler.jsonc` file
5. **Delegate**: Runs wrangler CLI command with generated config
6. **Cleanup**: Removes temporary config file

## Benefits

### Documentation as Code

Workers become self-documenting with Markdown content explaining architecture, features, and usage.

### Type Safety

JSON Schema validation ensures configuration correctness before deployment.

### Semantic Metadata

`$type`, `$id`, and `$context` enable tooling, discovery, and integration with Business-as-Code platform.

### Human Readable

YAML frontmatter + Markdown is more readable than JSON configuration.

### Unified Format

Same MDXLD format used across the platform for all entities.

## Migrating from wrangler.jsonc

To migrate an existing worker:

1. Create `worker.mdx` file in worker directory
2. Copy wrangler.jsonc contents to YAML frontmatter
3. Add `$type: Worker` at the top of frontmatter
4. Add Markdown documentation below frontmatter
5. Update scripts to use `mdxe` instead of `wrangler`

Example migration:

**Before** (`wrangler.jsonc`):

```jsonc
{
  "name": "example",
  "main": "src/index.ts",
  "compatibility_date": "2025-10-14",
}
```

**After** (`worker.mdx`):

```mdx
---
$type: Worker
name: example
main: src/index.ts
compatibility_date: 2025-10-14
---

# Example Worker

Documentation here...
```

## Development

```bash
# Build package
pnpm build

# Run tests
pnpm test

# Watch mode
pnpm dev
```

## License

MIT

## Related Packages

- [mdxld](../mdxld) - MDX with Linked Data parser
- [graphdl](../graphdl) - Graph Definition Language
- [sdk.do](../sdk.do) - Platform SDK
