# Publishing graphdl@1.0.0 to NPM

## Prerequisites

1. **NPM Account**: You need an NPM account with publish access
2. **Authentication**: Run `npm login` to authenticate
3. **2FA**: Enable two-factor authentication on your NPM account

## Pre-Publish Checklist

The `prepublishOnly` script will automatically run these checks:

```bash
pnpm prepublishOnly
```

This runs:

- `pnpm build` - Compiles TypeScript to JavaScript
- `pnpm test` - Runs test suite
- `pnpm typecheck` - Validates TypeScript types

### Build Verification

The `prepublishOnly` script ensures all checks pass before publishing:

- All TypeScript type errors have been resolved
- Build completes successfully
- Test suite passes
- Tree-shakeable exports are properly configured

## Manual Pre-Publish Steps

1. **Review Changes**

   ```bash
   git diff main...HEAD
   ```

2. **Build Package**

   ```bash
   cd ai/packages/graphdl
   pnpm build
   ```

3. **Run Tests**

   ```bash
   pnpm test
   ```

4. **Type Check**

   ```bash
   pnpm typecheck
   ```

5. **Lint**
   ```bash
   cd ../../.. # Go to root
   pnpm lint
   ```

## Publishing to NPM

### Option 1: Using pnpm (Recommended)

```bash
cd ai/packages/graphdl
pnpm publish --access public
```

### Option 2: Using npm

```bash
cd ai/packages/graphdl
npm publish --access public
```

## Post-Publish Verification

1. **Check NPM Package Page**

   ```
   https://www.npmjs.com/package/graphdl
   ```

2. **Test Installation**

   ```bash
   mkdir /tmp/test-graphdl
   cd /tmp/test-graphdl
   npm init -y
   npm install graphdl
   ```

3. **Verify Types**

   ```typescript
   // test.ts
   import $, { EntityType, TypedPathProxy } from 'graphdl'
   import type { SchemaEntity, EPCISEntity } from 'graphdl/types/complete'

   // Test $ proxy
   const path = $.Person.worksFor.Organization
   console.log(String(path)) // "$.Person.worksFor.Organization"

   // Test tree-shakeable imports
   import { isSchemaEntity } from 'graphdl/types/complete'
   console.log(isSchemaEntity('Person')) // true
   ```

4. **Check Package Contents**

   ```bash
   npm pack
   tar -tzf graphdl-1.0.0.tgz
   ```

   Expected output:

   ```
   package/package.json
   package/README.md
   package/LICENSE
   package/PUBLISHING.md
   package/dist/index.js
   package/dist/index.d.ts
   package/dist/types/index.js
   package/dist/types/index.d.ts
   package/dist/types/complete.js
   package/dist/types/complete.d.ts
   package/dist/types/graph.js
   package/dist/types/graph.d.ts
   package/dist/types/predicates.js
   package/dist/types/predicates.d.ts
   package/dist/types/paths.js
   package/dist/types/paths.d.ts
   package/dist/types/semantics.js
   package/dist/types/semantics.d.ts
   package/dist/types/edi.js
   package/dist/types/edi.d.ts
   package/dist/types/integrations.js
   package/dist/types/integrations.d.ts
   package/dist/builders/index.js
   package/dist/builders/index.d.ts
   package/dist/utils/index.js
   package/dist/utils/index.d.ts
   package/dist/utils/edi.js
   package/dist/utils/edi.d.ts
   ```

   Package size should be approximately 50-100KB (compressed).

## Dependencies

### Runtime Dependencies

**None** - The published package has zero runtime dependencies for maximum compatibility and minimal bundle size.

The core type definitions in `complete.ts` and the `$` proxy in `index.ts` are self-contained with no external dependencies.

### Dev Dependencies

Development dependencies are only used for:

- **nanoid** - Used in `events.ts` (currently excluded from build)
- **openai** - Used in enrichment scripts (`scripts/enrich/`)
- **zod** - Used in `events.ts` for schema validation (currently excluded from build)
- **typescript** - Build tool
- **vitest** - Test runner
- **tsx** - TypeScript execution for scripts

### Optional Peer Dependencies

Peer dependencies provide additional vocabulary types but are completely optional:

```json
{
  "schema.org.ai": "workspace:*", // 800+ Schema.org types
  "gs1.org.ai": "workspace:*", // GS1/EPCIS supply chain types
  "soc.org.ai": "workspace:*", // O*NET occupation types
  "do.industries": "workspace:*", // NAICS industry types
  "business-as-code": "workspace:*", // Business-as-Code patterns
  "services-as-software": "workspace:*", // Services-as-Software framework
  "mdx.org.ai": "workspace:*" // MDX content types
}
```

All peer dependencies are marked as optional and are not required for basic usage.

### Why No Runtime Dependencies?

The v1.0.0 type generation focuses on providing:

- Core entity types from 7 ontologies
- Tree-shakeable type guards
- Zero-dependency `$` proxy builder

This ensures:

- ✅ Minimal bundle size impact
- ✅ No version conflicts with consuming applications
- ✅ Fast installation and build times
- ✅ Maximum compatibility

Future features that require external dependencies (like `events.ts` with zod/nanoid) will be added as optional exports with conditional dependencies.

## Package Contents

The published package should include:

```
dist/
├── index.js
├── index.d.ts
├── types/
│   ├── index.js
│   ├── index.d.ts
│   ├── complete.js
│   ├── complete.d.ts
│   ├── graph.js
│   ├── predicates.js
│   ├── paths.js
│   ├── semantics.js
│   ├── edi.js
│   └── events.js
├── builders/
│   ├── index.js
│   └── index.d.ts
└── utils/
    ├── index.js
    └── index.d.ts
```

## Tree-Shakeable Exports

The package uses ESM with proper exports configuration:

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./types": {
      "import": "./dist/types/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./types/complete": {
      "import": "./dist/types/complete.js",
      "types": "./dist/types/complete.d.ts"
    },
    "./builders": {
      "import": "./dist/builders/index.js",
      "types": "./dist/builders/index.d.ts"
    }
  },
  "sideEffects": false
}
```

This ensures:

- Only imported code is included in bundles
- Full TypeScript support
- ESM-first with proper module resolution

## Usage Examples

### Basic Usage

```typescript
import $ from 'graphdl'

// Create semantic paths
const personPath = $.Person.worksFor.Organization
const productPath = $.Product.locatedAt.Warehouse
const occupationPath = $.SoftwareDeveloper.requiresSkill.TypeScript

console.log(String(personPath)) // "$.Person.worksFor.Organization"
```

### Tree-Shakeable Entity Checks

```typescript
import { isSchemaEntity, isEPCISEntity, isOnetEntity } from 'graphdl/types/complete'

// Only the functions you import are included in your bundle
isSchemaEntity('Person') // true
isEPCISEntity('Shipment') // true
isOnetEntity('Occupation') // true
```

### Full Type Definitions

```typescript
import type { EntityType, SchemaEntity, EPCISEntity, OnetEntity, NAICSEntity, APQCEntity, EDIEntity, ZapierEntity } from 'graphdl/types/complete'

// Use types for type-safe code
const entity: SchemaEntity = 'Person'
const allEntities: EntityType[] = ['Person', 'Shipment', 'Occupation']
```

## Troubleshooting

### Error: "You must be logged in to publish packages"

```bash
npm login
```

### Error: "You do not have permission to publish"

Ensure you're logged in with an account that has publish access to the `graphdl` package, or that you're publishing to a new package name.

### Error: "Cannot publish over existing version"

The version in package.json must be updated. Current version is 1.0.0.

### Build Errors

If you encounter build errors, ensure all dependencies are installed:

```bash
pnpm install
```

## Entity Overlaps and Semantic Context

Some entity names exist in multiple ontologies. This is intentional and reflects how different domains use the same terms with different semantic meanings.

### Known Overlapping Entities

| Entity           | Ontologies         | Semantic Distinction                                                                                                       |
| ---------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **Product**      | Schema.org, EPCIS  | Schema.org: Abstract product type (e.g., "iPhone 15")<br>EPCIS: Physical product instance (e.g., specific serialized unit) |
| **Store**        | Schema.org, EPCIS  | Schema.org: Retail business location<br>EPCIS: Storage location in supply chain                                            |
| **Organization** | Schema.org, EPCIS  | Schema.org: General organizational entity<br>EPCIS: Supply chain party (supplier, manufacturer, etc.)                      |
| **Event**        | Schema.org, EPCIS  | Schema.org: Scheduled occurrence or happening<br>EPCIS: Supply chain event (observation, aggregation, transformation)      |
| **Occupation**   | Schema.org, O\*NET | Schema.org: Job or profession type<br>O\*NET: Detailed occupation with requirements and characteristics                    |

### Type Guard Behavior

Type guards for overlapping entities will return `true` for both ontologies:

```typescript
import { isSchemaEntity, isEPCISEntity } from 'graphdl/types/complete'

// Both return true for 'Product'
isSchemaEntity('Product') // true
isEPCISEntity('Product') // true
```

### Context-Specific Usage

Choose the appropriate ontology based on your use case:

**Schema.org Context** (web content, SEO, general information):

```typescript
const product = $.Product.manufacturer.Organization // Schema.org semantics
```

**EPCIS Context** (supply chain, logistics, tracking):

```typescript
const product = $.Product.locatedAt.Warehouse // EPCIS/GS1 semantics
```

**O\*NET Context** (workforce, skills, job requirements):

```typescript
const occupation = $.Occupation.requires.Skill // O*NET semantics
```

### Namespace Consideration

For explicit disambiguation, consider prefixing entity types in your application:

```typescript
type SchemaProduct = `schema:Product`
type EPCISProduct = `epcis:Product`

// Or use context objects
const context = {
  schema: 'https://schema.org/',
  epcis: 'https://gs1.org/voc/epcis/',
}
```

This is optional and not currently implemented in graphdl, but can be added in future versions if needed.

### Performance Optimization

All type guards use Set-based lookups for O(1) performance:

```typescript
// Fast O(1) lookup
isSchemaEntity('Person') // Set.has() under the hood
```

This ensures efficient runtime type checking even with 200+ entity types across 7 ontologies.

## Support

For issues or questions:

- GitHub Issues: https://github.com/dot-do/platform/issues
- Package Issues: Tag with `graphdl` label
