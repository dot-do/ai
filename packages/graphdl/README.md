# graphdl

Semantic graph types with `$.Subject.predicate.Object` patterns from Schema.org, GS1, and O\*NET.

## Installation

```bash
pnpm add graphdl
```

## Usage

### Semantic Paths with `$`

The primary way to use graphdl is with the `$` proxy:

```typescript
import $ from 'graphdl'

// Create semantic paths using property access
const path1 = $.Person.worksFor.Organization
const path2 = $.John.hasSkill.TypeScript
const path3 = $.Product.locatedAt.Warehouse

// Convert to string
console.log(String($.Person.hasOccupation.Occupation))
// "$.Person.hasOccupation.Occupation"

// Use in real scenarios
const johnWorksForAcme = $.John.worksFor.Acme
console.log(String(johnWorksForAcme)) // "$.John.worksFor.Acme"
```

### Creating Triples

```typescript
import { triple, createTriple, path } from 'graphdl'

// Using builder pattern
const t1 = triple('Person:john').predicate('worksFor').object('Organization:acme').context('https://schema.org').build()

// Using function
const t2 = createTriple('Person:john', 'hasSkill', 'Skill:typescript', {
  context: 'https://schema.org',
  metadata: { confidence: 0.95 },
})

// Creating semantic paths
const semanticPath = path('Person', 'hasOccupation', 'Occupation')
// Returns: "$.Person.hasOccupation.Occupation"
```

### Building Graphs

```typescript
import { graph, node, edge } from 'graphdl'

// Create a semantic graph
const myGraph = graph()
  .context('https://schema.org')
  .node(
    node('john', 'Person', {
      name: 'John Doe',
      email: 'john@example.com',
    })
  )
  .node(
    node('acme', 'Organization', {
      name: 'Acme Corp',
    })
  )
  .edge(edge('john', 'worksFor', 'acme'))
  .metadata({
    created: new Date().toISOString(),
    source: 'user-input',
  })
  .build()

// Export as JSON-LD (with $ prefix)
const jsonld = graph()
  .context('https://schema.org')
  .nodes([node('john', 'Person', { name: 'John Doe' }), node('acme', 'Organization', { name: 'Acme Corp' })])
  .edge(edge('john', 'worksFor', 'acme'))
  .toJSONLD()
// Results in:
// {
//   $context: 'https://schema.org',
//   $graph: [
//     { $id: 'john', $type: 'Person', name: 'John Doe' },
//     { $id: 'acme', $type: 'Organization', name: 'Acme Corp' }
//   ]
// }
```

### Using with Schema.org, GS1, and O\*NET

```typescript
import $ from 'graphdl'
import type { Thing } from 'schema.org.ai'
import type { ObjectEvent } from 'gs1.org.ai'
import type { Occupation } from 'soc.org.ai'
import { createTriple, graph, node, edge } from 'graphdl'

// Use $ for semantic paths
const personOccupationPath = $.Person.hasOccupation.Occupation
const occupationSkillPath = $.Occupation.requiresSkill.Skill

// Create a person with occupation
const person: Thing = {
  $type: 'Person',
  $id: 'https://example.com/person/john',
  name: 'John Doe',
}

const occupation: Occupation = {
  onetCode: '15-1252.00',
  title: 'Software Developers',
}

// Link them with a triple
const personOccupation = createTriple(person.$id, 'hasOccupation', occupation.onetCode, { context: 'https://schema.org' })

// Build a graph connecting all three vocabularies
const knowledgeGraph = graph()
  .context({
    $vocab: 'https://schema.org/',
    gs1: 'https://gs1.org/voc/',
    onet: 'https://www.onetonline.org/',
  })
  .node(node(person.$id!, 'Person', person))
  .node(node(occupation.onetCode, 'Occupation', occupation))
  .edge(edge(person.$id!, 'hasOccupation', occupation.onetCode))
  .build()

// Use semantic paths with type safety
console.log(String($.John.worksFor.Acme)) // "$.John.worksFor.Acme"

// GS1 supply chain paths (camelCase)
const shipmentPath = $.Shipment.inTransit.Warehouse
const productPath = $.Product.receiving.DistributionCenter

// O*NET occupation paths
const skillPath = $.Occupation.requiresSkill.Programming
const abilityPath = $.SoftwareDeveloper.requiresAbility.CriticalThinking
```

### Semantic Path Patterns

```typescript
import $ from 'graphdl'
import { parsePath } from 'graphdl'

// Create semantic paths using the $.Subject.predicate.Object pattern
const paths = [
  $.Person.hasOccupation.Occupation,
  $.Occupation.requiresSkill.Skill,
  $.Occupation.requiresAbility.Ability,
  $.Organization.owns.Product,
  $.Product.locatedAt.Location,
]

// Use the paths
console.log(String($.John.worksFor.Acme))
// "$.John.worksFor.Acme"

// With GS1 dispositions (now camelCase)
$.Shipment.inTransit.Container // "$.Shipment.inTransit.Container"
$.Product.inProgress.Manufacturing // "$.Product.inProgress.Manufacturing"

// With business steps
$.Order.shipping.Customer // "$.Order.shipping.Customer"
$.Inventory.receiving.Warehouse // "$.Inventory.receiving.Warehouse"

// Parse paths back to components
const parsed = parsePath(String($.Person.hasOccupation.Occupation))
console.log(parsed)
// { subject: 'Person', predicate: 'hasOccupation', object: 'Occupation' }
```

## Types

### Triple

```typescript
interface Triple<S, P, O> {
  subject: S
  predicate: P
  object: O
  context?: string
  metadata?: TripleMetadata
}
```

### Graph

```typescript
interface Graph {
  '@context'?: string | Record<string, any>
  nodes: Node[]
  edges: Edge[]
  metadata?: GraphMetadata
}
```

### Predicates

Built-in predicates from:

- Schema.org: `hasOccupation`, `worksFor`, `memberOf`, etc.
- GS1/EPCIS: `containedIn`, `transformedFrom`, `locatedAt`, etc.
- O\*NET: `requiresSkill`, `requiresAbility`, `performsActivity`, etc.
- Universal: `is`, `has`, `partOf`, `relatedTo`, etc.

## Data Ingestion

GraphDL includes data ingestion scripts for importing industry standard taxonomies and datasets into MDX format with semantic frontmatter.

### Running Ingestion Scripts

```bash
# Run all ingestion scripts in parallel
pnpm ingest

# Run individual ingestion scripts
pnpm ingest:naics    # NAICS industry classifications
pnpm ingest:apqc     # APQC process framework
pnpm ingest:unedi    # UN/EDIFACT message types
pnpm ingest:zapier   # Zapier app integrations
```

### Available Data Sources

- **NAICS** - North American Industry Classification System (20 industry sectors)
  - Output: `.db/NAICS/`
  - Format: MDX with `$id: naics:XX` and `$type: IndustryClassification`

- **APQC** - American Productivity & Quality Center Process Framework (13 categories)
  - Output: `.db/APQC/`
  - Format: MDX with `$id: apqc:X.X` and `$type: BusinessProcess`

- **UN/EDIFACT** - UN Electronic Data Interchange For Administration, Commerce and Transport (15 message types)
  - Output: `.db/UNEDI/`
  - Format: MDX with `$id: unedi:XXXXX` and `$type: EDIMessage`

- **Zapier** - Popular app integrations (15 apps)
  - Output: `.db/Zapier/`
  - Format: MDX with `$id: zapier:app-key` and `$type: Integration`

### Ingestion Features

- **Idempotent** - Safe to run multiple times, overwrites existing files
- **Parallel Execution** - All sources run in parallel for maximum efficiency
- **Error Handling** - Comprehensive error tracking with summary statistics
- **Semantic Frontmatter** - All files include `$id` and `$type` for linked data
- **MDX Format** - Human-readable markdown with structured frontmatter

### Example Output

Each ingestion creates MDX files with semantic frontmatter:

```mdx
---
$id: 'naics:51'
$type: 'IndustryClassification'
code: '51'
title: 'Information'
description: 'Industries engaged in producing and distributing information...'
level: 1
---

# Information (NAICS 51)

Industries engaged in producing and distributing information and cultural products...
```

## API

### Semantic Path Proxy

- `$` - Proxy for creating semantic paths using property access
  ```typescript
  $.Subject.predicate.Object
  $.John.worksFor.Acme
  $.Product.locatedAt.Warehouse
  ```

### Builders

- `triple(subject?)` - Create a triple builder
- `createTriple(subject, predicate, object, options?)` - Create a triple directly
- `graph()` - Create a graph builder
- `node(id, type, properties?)` - Create a node
- `edge(source, predicate, target, properties?)` - Create an edge

### Utilities

- `path(subject, predicate, object)` - Create a semantic path string
- `parsePath(pathString)` - Parse a semantic path back to components

## Troubleshooting

### pnpm install failures with "ENOENT: no such file or directory"

**Error:**

```
WARN Moving // that was installed by a different package manager to "node_modules/.ignored"
ENOENT: no such file or directory, stat '.../ai/packages/graphdl/node_modules/'
```

**Cause:** An empty `node_modules/` directory exists in the graphdl package. This can happen if:

- You ran npm or yarn by accident in this directory
- A previous pnpm install failed mid-process
- The directory was manually created

**Solution:**

```bash
# From repository root
rm -rf ai/packages/graphdl/node_modules
pnpm install
```

**Note:** graphdl has zero runtime dependencies (only peer dependencies), so it should never have its own `node_modules/` directory when installed via pnpm workspace.

### Module not found errors

If you see errors like `Cannot find module 'graphdl'` or import errors:

1. **Verify installation:**

   ```bash
   pnpm list graphdl
   ```

2. **Check peer dependencies are installed:**

   ```bash
   pnpm add schema.org.ai gs1.org.ai soc.org.ai
   ```

3. **Rebuild if needed:**
   ```bash
   cd ai/packages/graphdl
   pnpm build
   ```

### TypeScript errors with imported types

If you see TypeScript errors when importing types from graphdl:

1. **Ensure peer dependencies are installed** (see package.json `peerDependencies`)
2. **Check your tsconfig.json includes:**
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true,
       "skipLibCheck": true
     }
   }
   ```

## License

MIT
