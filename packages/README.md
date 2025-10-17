# Packages

Open-source npm packages for building autonomous Business-as-Code applications.

## Overview

This folder contains all reusable packages that make up the `.do` platform's open-source ecosystem. Each package is independently published to npm and can be used standalone or as part of the complete SDK.

## Package Categories

### Core Framework Packages

**[graphdl](./graphdl/)** - Semantic graph types with `$.Subject.predicate.Object` patterns

- Purpose: Build knowledge graphs with semantic triples
- Key Features: `$` proxy, graph construction, triple creation
- Install: `pnpm add graphdl`

**[mdxld](./mdxld/)** - Linked data in MDX with `$id` and `$type` frontmatter

- Purpose: Enable semantic MDX with linked data support
- Key Features: Frontmatter parsing, `$id`/`$type` support, JSON-LD compatibility
- Install: `pnpm add mdxld`

**[mdxai](./mdxai/)** - AI-powered MDX development tools

- Purpose: Generate, edit, and enrich MDX content with AI
- Key Features: Content generation, semantic enhancement, validation
- Install: `pnpm add mdxai`

### Vocabulary Packages

**[schema.org.ai](./schema.org.ai/)** - TypeScript types for 817 Schema.org types

- Purpose: Type-safe Schema.org vocabulary for AI applications
- Key Features: 817 types, 1,518 properties, full Schema.org coverage
- Install: `pnpm add schema.org.ai`

**[gs1.org.ai](./gs1.org.ai/)** - GS1 supply chain vocabulary (EPCIS, CBV)

- Purpose: Supply chain semantic types and event tracking
- Key Features: EPCIS 2.0, CBV vocabulary, supply chain predicates
- Install: `pnpm add gs1.org.ai`

**[soc.org.ai](./soc.org.ai/)** - O\*NET occupation types (1,016 occupations)

- Purpose: Occupation data and skill taxonomies
- Key Features: 1,016 SOC codes, 45+ collections, abilities/skills/knowledge
- Install: `pnpm add soc.org.ai`

### AI Implementation Packages

**[ai-functions](./ai-functions/)** - Function registry, execution, and management

- Purpose: Register and execute functions with semantic patterns
- Key Features: Function versioning, sandbox execution, discovery, deployment
- Install: `pnpm add ai-functions`

**[ai-database](./ai-database/)** - Semantic database operations with triples

- Purpose: CRUD operations with `$.Subject.predicate.Object` patterns
- Key Features: Semantic queries, relationship management, vector search
- Install: `pnpm add ai-database`

**[ai-workflows](./ai-workflows/)** - Workflow orchestration and execution

- Purpose: Define and execute multi-step workflows
- Key Features: Event/schedule triggers, error handling, state management
- Install: `pnpm add ai-workflows`

**[ai-sandbox](./ai-sandbox/)** - Isolated code execution sandboxes

- Purpose: Execute untrusted code safely in isolated environments
- Key Features: Cloudflare Worker Loaders, security boundaries, resource limits
- Install: `pnpm add ai-sandbox`

### Concept Packages

**[business-as-code](./business-as-code/)** - Business-as-Code patterns and principles

- Purpose: Define autonomous business workflows as code
- Key Features: Patterns, examples, best practices
- Install: `pnpm add business-as-code`

**[services-as-software](./services-as-software/)** - Services-as-Software framework

- Purpose: Build AI-delivered services as software
- Key Features: Service patterns, deployment models, examples
- Install: `pnpm add services-as-software`

**[agents](./agents/)** - Agent framework for autonomous digital workers

- Purpose: Build and deploy autonomous agents
- Key Features: Agent patterns, personas, orchestration
- Install: `pnpm add @do/agents`

### Industry & Domain Packages

**[do.industries](./do.industries/)** - Domain catalog and industry classifications

- Purpose: Comprehensive catalog of .do domains and industries
- Key Features: 105+ domains, 24 categories, semantic grouping
- Install: `pnpm add do.industries`

### Utility Packages

**[edge-api](./edge-api/)** - Edge API utilities for Cloudflare Workers

- Purpose: Helper functions for edge computing
- Key Features: Worker utilities, API helpers, type definitions
- Install: `pnpm add edge-api`

**[buildercss](./buildercss/)** - CSS-in-JS for builder interfaces

- Purpose: Styling utilities for UI builders
- Key Features: CSS-in-JS, theme support, responsive utilities
- Install: `pnpm add buildercss`

## Package Structure

Each package follows this structure:

```
{package}/
├── src/             → Source code
│   ├── index.ts    → Main entry point
│   └── *.ts        → Implementation files
├── tests/          → Test files
├── README.md       → Package documentation
├── package.json    → Package manifest
└── tsconfig.json   → TypeScript configuration
```

## Development

### Install Dependencies

```bash
pnpm install
```

### Build All Packages

```bash
pnpm build
```

### Test All Packages

```bash
pnpm test
```

### Publish Package

```bash
cd packages/{package}
pnpm publish
```

## Adding a New Package

1. **Create package folder**: `mkdir packages/{package}`
2. **Initialize package**: `cd packages/{package} && pnpm init`
3. **Add source code**: Create `src/index.ts` with exports
4. **Write README**: Document purpose, installation, usage
5. **Add tests**: Create test files in `tests/`
6. **Update this README**: Add package to appropriate category above

## Package Naming Conventions

### NPM Namespace Strategy

Most packages use **standalone names** (no `@dotdo/` prefix) for maximum discoverability:

- ✅ **Standalone packages** (majority): Published as top-level names
  - Examples: `graphdl`, `mdxld`, `mdxai`, `schema.org.ai`, `business-as-code`, `services-as-software`
  - Benefit: Better npm search/discovery, no namespace confusion
  - Use for: Framework packages, vocabulary packages, concept packages

- 🔧 **Namespaced packages** (`@dotdo/*`) (config/utility only): Limited to platform-specific utilities
  - Examples: `@dotdo/eslint-config`, `@dotdo/tsconfig`, `@dotdo/platform`
  - Use for: Configuration packages, internal utilities, platform-specific tools
  - Avoid for: Public-facing SDKs and frameworks

### Naming Patterns by Type

- **Vocabulary packages**: Use `.org.ai` suffix (e.g., `schema.org.ai`, `gs1.org.ai`, `soc.org.ai`)
- **Framework packages**: Use descriptive compound names (e.g., `graphdl`, `mdxld`, `mdxai`)
- **Concept packages**: Use kebab-case phrases (e.g., `business-as-code`, `services-as-software`, `autonomous-agents`)
- **Domain packages**: Use `.do` TLD (e.g., `do.industries`, `sdk.do`, `mcp.do`)
- **Config packages**: Use `@dotdo/` namespace (e.g., `@dotdo/eslint-config`, `@dotdo/tsconfig`)
- **Platform packages**: Use `@dotdo/` namespace (e.g., `@dotdo/platform`)

### Why Standalone Names?

1. **Discoverability**: `mdxai` ranks higher in npm search than `@dotdo/mdxai`
2. **Branding**: Memorable package names become brands (like `next`, `react`, `vite`)
3. **Adoption**: Users more likely to try well-named standalone packages
4. **Ecosystem**: Each package can grow its own community/ecosystem
5. **Simplicity**: No namespace confusion or organization setup needed

**Exception**: Use `@dotdo/` namespace only for:

- Configuration packages (eslint-config, tsconfig)
- Internal platform utilities
- Packages tightly coupled to .do platform infrastructure

## Semantic Patterns

All packages should follow these semantic principles:

1. **Use `$` prefix for linked data**: Objects with `$id` and `$type`
2. **Follow `$.Subject.predicate.Object` patterns**: For relationships
3. **Integrate with vocabularies**: Schema.org, GS1, O\*NET
4. **Export TypeScript types**: Full type safety
5. **Include examples**: Real-world usage patterns

## License

MIT (Open Source)

All packages in this folder are open-source and free to use, modify, and distribute.

---

Part of the [`.do` platform](https://github.com/dot-do/platform) open-source ecosystem.
