# ai-admin Package Rewrite Specification

**Status**: Planning
**Priority**: High
**Package**: `@dotdo/ai-admin`

## Vision

A comprehensive Payload CMS wrapper package for AI-powered applications with pre-configured collections, tasks, workflows, and AI functionality. This package provides a **batteries-included** admin interface for AI-native applications built on the `.do` platform.

## Purpose

The `@dotdo/ai-admin` package should be a **turnkey solution** for developers building AI applications, providing:

1. **Pre-configured Payload CMS** with AI-specific collections
2. **AI functionality** (generations, batches, embeddings, vector search)
3. **Generic semantic data model** (Things/Relationships collections)
4. **MCP integration** for AI assistant access
5. **Task queue and workflows** for async operations
6. **PostgreSQL + R2 + Vectorize** - production-ready storage

## Architecture

### Core Components

```
@dotdo/ai-admin/
├── collections/          # Payload CMS collections
│   ├── ai/              # AI-specific collections
│   │   ├── Generations.ts
│   │   ├── Batches.ts
│   │   ├── Models.ts
│   │   ├── Prompts.ts
│   │   └── Embeddings.ts
│   ├── semantic/        # Semantic graph collections
│   │   ├── Things.ts
│   │   ├── Relationships.ts
│   │   ├── Types.ts
│   │   └── Properties.ts
│   ├── core/            # Core collections
│   │   ├── Users.ts
│   │   ├── Media.ts
│   │   └── Settings.ts
│   └── index.ts
│
├── tasks/               # Job queue tasks
│   ├── generateTask.ts
│   ├── batchTask.ts
│   ├── embedTask.ts
│   └── index.ts
│
├── workflows/           # Multi-step workflows
│   ├── batchGeneration.ts
│   ├── vectorIndex.ts
│   └── index.ts
│
├── plugins/             # Payload plugins
│   ├── search.ts       # Vectorize search
│   ├── storage.ts      # R2 storage
│   └── index.ts
│
├── api/                 # API routes
│   ├── generations/
│   ├── batches/
│   ├── embeddings/
│   ├── search/
│   └── mcp/            # MCP endpoints
│
├── lib/                 # Utilities
│   ├── ai.ts           # AI operations
│   ├── semantic.ts     # Semantic graph
│   ├── vector.ts       # Vector operations
│   └── mcp.ts          # MCP server
│
├── config/              # Configuration
│   ├── default.ts      # Default config
│   ├── types.ts        # Config types
│   └── index.ts
│
└── src/
    ├── index.ts        # Main export
    ├── server.ts       # Payload server
    └── cli.ts          # CLI interface
```

## Collections

### AI Collections

#### 1. Generations Collection

```typescript
{
  slug: 'generations',
  fields: [
    { name: 'model', type: 'relationship', relationTo: 'models' },
    { name: 'prompt', type: 'relationship', relationTo: 'prompts' },
    { name: 'input', type: 'json' },
    { name: 'output', type: 'json' },
    { name: 'tokens', type: 'group', fields: [...] },
    { name: 'cost', type: 'number' },
    { name: 'latency', type: 'number' },
    { name: 'status', type: 'select', options: ['pending', 'processing', 'completed', 'failed'] },
    { name: 'error', type: 'textarea' },
    { name: 'metadata', type: 'json' },
    { name: 'business', type: 'relationship', relationTo: 'businesses' }, // Multi-tenant
  ]
}
```

#### 2. Batches Collection

```typescript
{
  slug: 'batches',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'model', type: 'relationship', relationTo: 'models' },
    { name: 'prompt', type: 'relationship', relationTo: 'prompts' },
    { name: 'inputs', type: 'array', fields: [{ name: 'input', type: 'json' }] },
    { name: 'status', type: 'select', options: ['pending', 'processing', 'completed', 'failed', 'partial'] },
    { name: 'progress', type: 'number', min: 0, max: 100 },
    { name: 'totalItems', type: 'number' },
    { name: 'completedItems', type: 'number' },
    { name: 'failedItems', type: 'number' },
    { name: 'generations', type: 'relationship', relationTo: 'generations', hasMany: true },
    { name: 'cost', type: 'number' },
    { name: 'business', type: 'relationship', relationTo: 'businesses' },
  ]
}
```

#### 3. Models Collection

```typescript
{
  slug: 'models',
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'provider', type: 'select', options: ['openai', 'anthropic', 'google', 'meta', 'xai'] },
    { name: 'modelId', type: 'text', required: true },
    { name: 'capabilities', type: 'select', hasMany: true, options: ['text', 'vision', 'audio', 'embeddings', 'function-calling'] },
    { name: 'contextWindow', type: 'number' },
    { name: 'maxOutput', type: 'number' },
    { name: 'pricing', type: 'group', fields: [
      { name: 'input', type: 'number' },  // per 1M tokens
      { name: 'output', type: 'number' }, // per 1M tokens
    ]},
    { name: 'enabled', type: 'checkbox', defaultValue: true },
    { name: 'metadata', type: 'json' },
  ]
}
```

#### 4. Prompts Collection

```typescript
{
  slug: 'prompts',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'template', type: 'code', required: true },
    { name: 'variables', type: 'array', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'type', type: 'select', options: ['string', 'number', 'boolean', 'object', 'array'] },
      { name: 'required', type: 'checkbox' },
      { name: 'defaultValue', type: 'text' },
    ]},
    { name: 'model', type: 'relationship', relationTo: 'models' },
    { name: 'temperature', type: 'number', min: 0, max: 2 },
    { name: 'maxTokens', type: 'number' },
    { name: 'version', type: 'number', defaultValue: 1 },
    { name: 'business', type: 'relationship', relationTo: 'businesses' },
  ]
}
```

#### 5. Embeddings Collection

```typescript
{
  slug: 'embeddings',
  fields: [
    { name: 'content', type: 'textarea', required: true },
    { name: 'model', type: 'relationship', relationTo: 'models' },
    { name: 'vector', type: 'json' }, // Array of numbers
    { name: 'dimensions', type: 'number' },
    { name: 'vectorizeId', type: 'text' }, // Cloudflare Vectorize ID
    { name: 'source', type: 'group', fields: [
      { name: 'collection', type: 'text' },
      { name: 'id', type: 'text' },
    ]},
    { name: 'metadata', type: 'json' },
    { name: 'business', type: 'relationship', relationTo: 'businesses' },
  ]
}
```

### Semantic Graph Collections

#### 6. Things Collection

```typescript
{
  slug: 'things',
  fields: [
    { name: 'id', type: 'text', required: true, unique: true }, // $.Subject format
    { name: 'type', type: 'relationship', relationTo: 'types', hasMany: true },
    { name: 'name', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'properties', type: 'json' }, // Flexible property bag
    { name: 'embedding', type: 'relationship', relationTo: 'embeddings' },
    { name: 'business', type: 'relationship', relationTo: 'businesses' },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Auto-generate embedding for semantic search
        if (operation === 'create' || operation === 'update') {
          await embedThing(doc, req)
        }
      }
    ]
  }
}
```

#### 7. Relationships Collection

```typescript
{
  slug: 'relationships',
  fields: [
    { name: 'subject', type: 'relationship', relationTo: 'things', required: true },
    { name: 'predicate', type: 'text', required: true }, // e.g., 'hasRole', 'worksFor'
    { name: 'object', type: 'relationship', relationTo: 'things', required: true },
    { name: 'weight', type: 'number', min: 0, max: 1 }, // Relationship strength
    { name: 'metadata', type: 'json' },
    { name: 'business', type: 'relationship', relationTo: 'businesses' },
  ],
  indexes: [
    { fields: ['subject', 'predicate'] },
    { fields: ['predicate', 'object'] },
  ]
}
```

#### 8. Types Collection

```typescript
{
  slug: 'types',
  fields: [
    { name: 'name', type: 'text', required: true, unique: true }, // e.g., 'Organization', 'Person'
    { name: 'namespace', type: 'select', options: ['schema.org', 'gs1.org', 'custom'] },
    { name: 'description', type: 'textarea' },
    { name: 'properties', type: 'relationship', relationTo: 'properties', hasMany: true },
    { name: 'parent', type: 'relationship', relationTo: 'types' }, // Inheritance
  ]
}
```

#### 9. Properties Collection

```typescript
{
  slug: 'properties',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'type', type: 'select', options: ['text', 'number', 'boolean', 'date', 'relationship', 'array', 'object'] },
    { name: 'description', type: 'textarea' },
    { name: 'required', type: 'checkbox' },
    { name: 'validation', type: 'json' },
  ]
}
```

## Tasks

### Generate Task

```typescript
export const generateTask = async (input: GenerateInput, job: Job) => {
  const { modelId, prompt, options } = input

  // Track progress
  await job.update({ status: 'processing', progress: 0 })

  // Generate with AI
  const result = await ai.generate({
    model: modelId,
    prompt,
    ...options,
  })

  // Save generation
  const generation = await payload.create({
    collection: 'generations',
    data: {
      model: modelId,
      input: prompt,
      output: result.content,
      tokens: result.usage,
      cost: calculateCost(result.usage, modelId),
      latency: result.latency,
      status: 'completed',
    },
  })

  await job.update({ status: 'completed', progress: 100, result: generation })

  return generation
}
```

### Batch Task

```typescript
export const batchTask = async (input: BatchInput, job: Job) => {
  const { batchId } = input
  const batch = await payload.findByID({ collection: 'batches', id: batchId })

  const results = []
  let completed = 0

  for (const item of batch.inputs) {
    try {
      // Queue individual generation
      const generation = await jobs.queue('generate', {
        modelId: batch.model,
        prompt: batch.prompt,
        input: item.input,
      })

      results.push(generation)
      completed++

      // Update batch progress
      await payload.update({
        collection: 'batches',
        id: batchId,
        data: {
          completedItems: completed,
          progress: (completed / batch.totalItems) * 100,
        },
      })
    } catch (error) {
      console.error('Batch item failed:', error)
    }
  }

  await payload.update({
    collection: 'batches',
    id: batchId,
    data: {
      status: 'completed',
      generations: results.map((r) => r.id),
    },
  })
}
```

### Embed Task

```typescript
export const embedTask = async (input: EmbedInput, job: Job) => {
  const { content, model, metadata } = input

  // Generate embedding
  const embedding = await ai.embed({
    model,
    input: content,
  })

  // Store in Vectorize
  const vectorizeId = await vectorize.upsert({
    id: crypto.randomUUID(),
    values: embedding.vector,
    metadata: {
      content,
      ...metadata,
    },
  })

  // Save to database
  return await payload.create({
    collection: 'embeddings',
    data: {
      content,
      model,
      vector: embedding.vector,
      dimensions: embedding.dimensions,
      vectorizeId,
      metadata,
    },
  })
}
```

## Workflows

### Batch Generation Workflow

```typescript
export const batchGenerationWorkflow = {
  name: 'batch-generation',
  steps: [
    {
      id: 'validate',
      task: 'validateBatchInput',
      onError: 'fail',
    },
    {
      id: 'split',
      task: 'splitBatchIntoJobs',
      onError: 'retry',
    },
    {
      id: 'process',
      task: 'processBatchJobs',
      parallel: true,
      onError: 'continue',
    },
    {
      id: 'aggregate',
      task: 'aggregateResults',
      onError: 'fail',
    },
    {
      id: 'notify',
      task: 'notifyCompletion',
      onError: 'log',
    },
  ],
}
```

### Vector Indexing Workflow

```typescript
export const vectorIndexWorkflow = {
  name: 'vector-index',
  steps: [
    {
      id: 'fetch',
      task: 'fetchUnindexedDocuments',
      onError: 'fail',
    },
    {
      id: 'embed',
      task: 'embedDocuments',
      parallel: true,
      batchSize: 100,
      onError: 'continue',
    },
    {
      id: 'index',
      task: 'indexVectors',
      onError: 'retry',
    },
  ],
}
```

## API Routes

### Generations API

```typescript
// POST /api/generations
export const createGeneration = async (req: Request) => {
  const { model, prompt, options } = await req.json()

  // Queue generation task
  const job = await jobs.queue('generate', {
    modelId: model,
    prompt,
    options,
  })

  return Response.json({ job: job.id })
}

// GET /api/generations/:id
export const getGeneration = async (req: Request, { id }) => {
  const generation = await payload.findByID({
    collection: 'generations',
    id,
  })

  return Response.json(generation)
}
```

### Search API

```typescript
// POST /api/search
export const semanticSearch = async (req: Request) => {
  const { query, limit = 10, filter } = await req.json()

  // Generate query embedding
  const queryEmbedding = await ai.embed({
    model: 'text-embedding-3-large',
    input: query,
  })

  // Search Vectorize
  const results = await vectorize.query({
    vector: queryEmbedding.vector,
    topK: limit,
    filter,
  })

  // Fetch full documents
  const documents = await Promise.all(
    results.matches.map((match) =>
      payload.findByID({
        collection: match.metadata.collection,
        id: match.metadata.id,
      })
    )
  )

  return Response.json({
    query,
    results: documents,
    scores: results.matches.map((m) => m.score),
  })
}
```

### MCP API

```typescript
// POST /api/mcp
export const mcpHandler = async (req: Request) => {
  const mcpRequest = await req.json()

  // Handle MCP protocol
  const response = await mcp.handle(mcpRequest, {
    tools: {
      'ai-admin.generate': generateTool,
      'ai-admin.batch': batchTool,
      'ai-admin.search': searchTool,
      'ai-admin.things.create': createThingTool,
      'ai-admin.things.relate': relateThingsTool,
    },
  })

  return Response.json(response)
}
```

## Configuration

### Default Config

```typescript
export const defaultConfig: AIAdminConfig = {
  // Database
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),

  // Collections
  collections: [...aiCollections, ...semanticCollections, ...coreCollections],

  // Plugins
  plugins: [
    searchPlugin({
      collections: ['things', 'generations', 'prompts'],
      vectorize: env.VECTORIZE,
    }),
    storagePlugin({
      collections: ['media'],
      bucket: env.R2,
    }),
  ],

  // Tasks
  tasks: [generateTask, batchTask, embedTask],

  // Workflows
  workflows: [batchGenerationWorkflow, vectorIndexWorkflow],

  // AI config
  ai: {
    defaultModel: 'gpt-5',
    providers: {
      openai: { apiKey: process.env.OPENAI_API_KEY },
      anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
    },
  },

  // MCP config
  mcp: {
    enabled: true,
    endpoint: '/api/mcp',
    auth: 'bearer', // or 'oauth'
  },
}
```

## Usage

### Basic Setup

```typescript
import { createAIAdmin } from '@dotdo/ai-admin'

const admin = await createAIAdmin({
  secret: process.env.PAYLOAD_SECRET,
  db: process.env.DATABASE_URL,
  ai: {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
  },
})

export default admin.handler
```

### Custom Collections

```typescript
import { createAIAdmin } from '@dotdo/ai-admin'
import { myCustomCollection } from './collections'

const admin = await createAIAdmin({
  collections: [
    myCustomCollection,
    // AI admin collections are included by default
  ],
})
```

### CLI

```bash
# Initialize new AI admin project
npx @dotdo/ai-admin init

# Run migrations
npx @dotdo/ai-admin migrate

# Seed data
npx @dotdo/ai-admin seed

# Start dev server
npx @dotdo/ai-admin dev
```

## Key Features

### 1. **Batteries Included**

- Pre-configured collections for common AI workflows
- Built-in task queue and workflows
- Vector search with Vectorize
- MCP integration for AI assistants

### 2. **Semantic Graph**

- Generic Things/Relationships model
- Type system with schema.org support
- Auto-embedding for semantic search
- Graph queries and traversal

### 3. **AI Operations**

- Generation tracking with cost/latency
- Batch processing with progress tracking
- Prompt management and versioning
- Model registry and configuration

### 4. **Multi-Tenant**

- Business relationship on all collections
- Row-level security
- Per-tenant configuration
- Isolated data access

### 5. **Production Ready**

- PostgreSQL for reliability
- R2 for media storage
- Vectorize for semantic search
- Job queue for async operations

## Migration from Old ai-admin

The old ai-admin package will be completely replaced:

- ❌ **Remove**: MongoDB configuration
- ❌ **Remove**: Outdated Payload 3.37.0 dependencies
- ❌ **Remove**: Duplicate collections
- ✅ **Add**: PostgreSQL support
- ✅ **Add**: Multi-tenancy
- ✅ **Add**: Semantic graph
- ✅ **Add**: Vector search
- ✅ **Add**: MCP integration

## Timeline

**Phase 1** (Week 1): Core Collections

- AI collections (Generations, Batches, Models, Prompts, Embeddings)
- Semantic collections (Things, Relationships, Types, Properties)
- Core collections (Users, Media, Settings)

**Phase 2** (Week 2): Tasks & Workflows

- Generate task
- Batch task
- Embed task
- Batch generation workflow
- Vector indexing workflow

**Phase 3** (Week 3): API Routes

- Generations API
- Batches API
- Search API
- MCP API

**Phase 4** (Week 4): CLI & Documentation

- CLI tooling
- Comprehensive documentation
- Example projects
- Migration guide

## Success Criteria

- ✅ All collections use PostgreSQL
- ✅ Multi-tenant architecture
- ✅ Vector search operational
- ✅ MCP integration working
- ✅ 80%+ test coverage
- ✅ Complete documentation
- ✅ Example application
- ✅ Migration path from old version

## References

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [platform/collections](../../platform/collections/) - Existing collection patterns
- [workers/admin](../../workers/admin/) - Current admin implementation
- [ai/packages/sdk.do](../sdk.do/) - SDK integration patterns
