# ai-database

Semantic database operations with `$.Subject.predicate.Object` patterns for Business-as-Code with AI-delivered Services-as-Software.

## Overview

`ai-database` provides an open-source implementation of the [database.do](https://database.do) SDK interface, enabling:

- **Semantic CRUD**: Create, read, update, delete with Schema.org types
- **Relationship Management**: Semantic triples using `$.Subject.predicate.Object` patterns
- **Graph Queries**: Query entities and traverse relationships
- **Type Safety**: Full TypeScript types with Zod validation
- **Batch Operations**: Efficient bulk create/update/delete

## Installation

```bash
pnpm add @dotdo/ai-database
```

## Usage

### Create Entities

```typescript
import { db } from '@dotdo/ai-database'

// Create a Person
const person = await db.create({
  type: 'Person',
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    jobTitle: 'Software Engineer',
  },
})

// Create an Organization
const org = await db.create({
  type: 'Organization',
  data: {
    name: 'Acme Corp',
    url: 'https://acme.com',
  },
})
```

### Create Relationships

```typescript
// Create semantic triple: $.Person.worksFor.Organization
await db.relate(person, 'worksFor', org)

// Or with IDs:
await db.relate('person-123', 'worksFor', 'org-456')

// Create multiple relationships
await db.batchRelate([
  { subject: person, predicate: 'knows', object: anotherPerson },
  { subject: person, predicate: 'memberOf', object: team },
])
```

### Query Entities

```typescript
// Get by ID
const person = await db.get('person-123')

// List all of a type
const people = await db.list('Person', {
  limit: 10,
  offset: 0,
  sortBy: 'name',
  sortOrder: 'asc',
})

// Filter with where clause
const engineers = await db.list('Person', {
  where: { jobTitle: 'Software Engineer' },
})

// Count entities
const count = await db.count('Person')
```

### Query Relationships

```typescript
// Get all relationships for a subject
const rels = await db.getRelationships({
  subject: 'person-123',
})

// Get specific relationship type
const worksFor = await db.getRelationships({
  subject: 'person-123',
  predicate: 'worksFor',
})

// Get all who work for an organization
const employees = await db.getRelatedBy('org-456', 'worksFor')

// Get related entities
const organizations = await db.getRelated('person-123', 'worksFor')
```

### Update Entities

```typescript
// Update data
await db.update({
  id: 'person-123',
  data: {
    jobTitle: 'Senior Software Engineer',
  },
})

// Add relationships during update
await db.update({
  id: 'person-123',
  data: { status: 'active' },
  addRelations: [{ predicate: 'knows', object: 'person-456' }],
  removeRelations: [{ predicate: 'worksFor', object: 'org-old' }],
})
```

### Delete Entities

```typescript
// Hard delete
await db.delete('person-123')

// Soft delete (mark as deleted)
await db.delete('person-123', { soft: true })

// Cascade delete (also delete relationships)
await db.delete('person-123', { cascade: true })
```

### Batch Operations

```typescript
// Batch create
const people = await db.batchCreate([
  { type: 'Person', data: { name: 'John' } },
  { type: 'Person', data: { name: 'Jane' } },
])

// Batch update
await db.batchUpdate([
  { id: 'person-1', data: { status: 'active' } },
  { id: 'person-2', data: { status: 'active' } },
])

// Batch delete
await db.batchDelete(['person-1', 'person-2'])
```

## Core Foundation

This package follows the `.do` platform's three-tier architecture:

1. **SDK Interface**: Defined in `ai/sdks/database.do/`
2. **Open-Source Implementation**: This package (`ai-database`)
3. **Worker Runtime**: Implemented in `workers/database/` and `workers/db/`

### Required Dependencies

All `ai-*` packages MUST use:

- **graphdl**: Core SDK interfaces ($, db, on, send, every)
- **business-as-code**: Business abstractions and patterns
- **services-as-software**: Service-oriented architecture patterns
- **schema.org.ai**: Schema.org type definitions

## API

### CRUD Operations

- `create(input)` - Create entity with optional relationships
- `get(id, options)` - Get entity by ID
- `list(type, options)` - List entities with filters
- `update(input)` - Update entity and relationships
- `delete(id, options)` - Delete entity (hard/soft/cascade)
- `exists(id)` - Check if entity exists
- `count(type, options)` - Count entities by type

### Relationship Operations

- `relate(subject, predicate, object)` - Create semantic triple
- `getRelationships(query)` - Query relationships
- `relationshipExists(subject, predicate, object)` - Check if relationship exists
- `deleteRelationships(query)` - Delete matching relationships
- `getOutgoing(subject, predicate)` - Get outgoing relationships
- `getIncoming(object, predicate)` - Get incoming relationships
- `getRelated(subject, predicate)` - Follow relationship to objects
- `getRelatedBy(object, predicate)` - Follow relationship from subjects
- `countRelationships(query)` - Count relationships

### Batch Operations

- `batchCreate(inputs)` - Create multiple entities
- `batchUpdate(inputs)` - Update multiple entities
- `batchDelete(ids, options)` - Delete multiple entities
- `batchRelate(relationships)` - Create multiple relationships

### Utility Functions

- `generateId(type)` - Generate unique entity ID
- `validateThing(thing)` - Validate entity
- `extractId(thing)` - Extract ID from Thing or string
- `normalizeType(type)` - Normalize type name
- `isThing(value)` - Check if value is a Thing
- `cloneThing(thing)` - Deep copy entity
- `mergeThings(base, updates)` - Merge entities
- `areThingsEqual(a, b)` - Compare entities by ID
- `getType(thing)` - Get entity type
- `isType(thing, type)` - Check entity type
- `formatThing(thing)` - Format entity for display

## Types

See `src/types.ts` for complete type definitions:

- `Thing` - Base entity type (Schema.org Thing)
- `Triple` - Semantic relationship ($.Subject.predicate.Object)
- `QueryOptions` - Query filters, pagination, sorting
- `QueryResult` - Query results with pagination
- `CreateInput` - Create operation input
- `UpdateInput` - Update operation input
- `DeleteOptions` - Delete operation options
- `RelationshipQuery` - Relationship query filters
- `RelationshipResult` - Relationship query results

## Semantic Patterns

### $.Subject.predicate.Object

All relationships follow the semantic triple pattern:

```typescript
// $.Person.worksFor.Organization
await db.relate(person, 'worksFor', organization)

// $.Person.knows.Person
await db.relate(person, 'knows', anotherPerson)

// $.Product.hasCategory.Category
await db.relate(product, 'hasCategory', category)
```

### Schema.org Types

Entities use Schema.org types:

```typescript
// Person (https://schema.org/Person)
const person = await db.create({
  type: 'Person',
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    jobTitle: 'Engineer',
  },
})

// Organization (https://schema.org/Organization)
const org = await db.create({
  type: 'Organization',
  data: {
    name: 'Acme Corp',
    url: 'https://acme.com',
  },
})
```

## Examples

See `examples/` directory for complete examples:

- `basic.ts` - Basic CRUD operations
- `relationships.ts` - Semantic relationship examples
- `queries.ts` - Advanced query examples
- `batch.ts` - Batch operation examples

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## Architecture

### Entity Storage

Entities are stored with:

- Unique ID (`@id` or `identifier`)
- Type (`@type`) following Schema.org
- Data fields (name, email, etc.)
- Metadata (timestamps, etc.)

### Triple Store

Relationships are stored as semantic triples:

- **Subject**: Source entity (Thing)
- **Predicate**: Relationship name (string)
- **Object**: Target entity (Thing)
- **Metadata**: Created timestamp, source, confidence

**Note**: The current implementation uses in-memory storage. In production, this would be backed by Postgres/Hyperdrive for entities and a graph database or triple store for relationships, with Vectorize for semantic search.

## Related Packages

- **graphdl**: Core SDK interfaces
- **schema.org.ai**: Schema.org type definitions
- **business-as-code**: Business abstractions
- **ai-functions**: Function execution
- **ai-workflows**: Workflow orchestration

## Workers

This package is used by:

- **workers/database** - database.do runtime
- **workers/db** - Direct database access
- **workers/workflows** - Workflow data storage

## License

MIT

## Links

- **Homepage**: https://database.do
- **Repository**: https://github.com/dot-do/platform
- **Documentation**: https://database.do/docs
