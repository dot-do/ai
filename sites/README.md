# Sites

Documentation sites for all `.do` platform domains and vocabularies.

## Overview

This folder contains documentation sites for every domain in the `.do` ecosystem. Each site provides comprehensive documentation, examples, API references, and integration guides for a specific domain or package.

## Site Categories

### Existing Documentation Sites

**[schema.org.ai](./schema.org.ai/)** - Schema.org AI vocabulary documentation

- 817 Schema.org types with AI-native patterns
- TypeScript type definitions and examples
- Semantic relationship patterns

**[gs1.org.ai](./gs1.org.ai/)** - GS1 supply chain vocabulary

- EPCIS 2.0 event types and examples
- CBV vocabulary documentation
- Supply chain semantic patterns

**[soc.org.ai](./soc.org.ai/)** - O\*NET occupation data

- 1,016 SOC occupation codes
- Skills, abilities, and knowledge taxonomies
- Occupation semantic patterns

**[mdx.org.ai](./mdx.org.ai/)** - MDX documentation

- MDX syntax and features
- AI-powered MDX tools
- Content generation patterns

**[mdxld.org](./mdxld.org/)** - MDXLD documentation

- Linked data in MDX with `$id` and `$type`
- JSON-LD integration
- Semantic MDX patterns

**[actions.org.ai](./actions.org.ai/)** - Actions documentation

- Action patterns and examples
- Task automation workflows
- Semantic action types

**[agents.org.ai](./agents.org.ai/)** - Agents documentation

- Agent framework and patterns
- Autonomous worker examples
- Agent orchestration

**[agents.do](./agents.do/)** - Agent framework guide

- Building autonomous digital workers
- Agent personas and capabilities
- Multi-agent systems and collaboration
- SDR/BDR agent examples

**[agents.mdx.do](./agents.mdx.do/)** - MDX-based agent examples

- Agent personas in MDX
- Interactive agent documentation
- Agent workflow examples

**[searches.org.ai](./searches.org.ai/)** - Search patterns

- Semantic search patterns
- Query examples and templates
- Search integration guides

**[triggers.org.ai](./triggers.org.ai/)** - Trigger patterns

- Event trigger patterns
- Workflow automation
- Trigger integration examples

### Planned Documentation Sites

Sites needed for core SDK domains:

- `sdk.do` - Core SDK documentation
- `cli.do` - CLI usage and commands
- `mcp.do` - MCP server setup and usage
- `apis.do` - API gateway documentation
- `database.do` - Database operations guide
- `events.do` - Event system documentation
- `functions.do` - Function execution guide
- `rpc.do` - RPC communication patterns
- `services.do` - Service deployment guide
- `workflows.do` - Workflow orchestration

Sites needed for SDK function domains:

- `ai.do` - AI services documentation
- `api.do` - External API integration
- `db.do` - Database operations
- `on.do` - Event listeners
- `send.do` - Event publishing
- `every.do` - Scheduled workflows
- `user.do` - User context and auth
- `graphdl.do` - GraphDL semantic patterns

Sites needed for framework packages:

- `graphdl` - GraphDL framework
- `mdxld` - MDXLD framework
- `mdxai` - MDX AI tools
- `business-as-code` - Business-as-Code patterns
- `services-as-software` - Services-as-Software patterns
- `agents` - Agent framework
- `do.industries` - Domain catalog

## Site Structure

Each site follows this structure:

```
{domain}/
├── readme.mdx           → Main landing page
├── docs/
│   ├── getting-started.mdx
│   ├── installation.mdx
│   ├── quickstart.mdx
│   ├── api-reference.mdx
│   └── *.mdx           → Additional guides
├── examples/
│   ├── basic.mdx
│   ├── advanced.mdx
│   └── *.mdx           → Code examples
├── api/
│   ├── index.mdx       → API overview
│   ├── functions.mdx   → Function reference
│   ├── types.mdx       → Type definitions
│   └── *.mdx           → API docs
├── guides/
│   └── *.mdx           → Tutorial guides
└── integrations/
    └── *.mdx           → Integration guides
```

## Documentation Standards

### MDX Frontmatter

All documentation files should include semantic frontmatter:

```mdx
---
$id: https://{domain}/docs/{slug}
$type: TechArticle
title: Document Title
description: Brief description
keywords: [keyword1, keyword2, keyword3]
author:
  $type: Organization
  name: .do Platform
---

# Document Title

Content goes here...
```

### Required Sections

Every domain site should include:

1. **Overview** - What is this domain/package?
2. **Installation** - How to install and set up
3. **Quick Start** - Get started in 5 minutes
4. **Core Concepts** - Key concepts and terminology
5. **API Reference** - Complete API documentation
6. **Examples** - 5-10 practical examples
7. **Semantic Patterns** - `$.Subject.predicate.Object` usage
8. **Integration** - How to use with other domains
9. **Best Practices** - Recommended patterns
10. **Troubleshooting** - Common issues and solutions

### Code Examples

All code examples should be:

- **Tested**: Actually run and work
- **Complete**: Include all necessary imports
- **Semantic**: Show `$.Subject.predicate.Object` patterns
- **Practical**: Real-world use cases

```typescript
import $, { db } from 'sdk.do'

// Example showing semantic pattern
const businesses = await db.list($.Business, {
  where: { industry: 'Technology' },
})

// Example showing relationships
const brands = await db.related(business, $.owns, $.Brand)
```

## Development

### Preview Site Locally

```bash
cd sites/{domain}
pnpm dev
```

### Build Site

```bash
cd sites/{domain}
pnpm build
```

### Deploy Site

Sites are automatically deployed on push to main:

- `.org.ai` sites → Hosted on Cloudflare Pages
- `.do` sites → Hosted on platform infrastructure

## Adding a New Site

1. **Create site folder**: `mkdir sites/{domain}`
2. **Create readme.mdx**: Main landing page with frontmatter
3. **Create docs/ folder**: Add documentation pages
4. **Create examples/ folder**: Add code examples
5. **Create api/ folder**: Add API reference docs
6. **Add navigation**: Create `_nav.mdx` for site navigation
7. **Test locally**: Run `pnpm dev` to preview
8. **Update this README**: Add site to appropriate category

## Site Templates

Use these templates for consistency:

### Main readme.mdx Template

````mdx
---
$id: https://{domain}
$type: WebSite
title: {Domain} - {Brief Description}
description: {Longer description}
keywords: [{keywords}]
---

# {Domain}

{One-line description}

## Quick Start

```bash
pnpm add {package-name}
```
````

```typescript
import { feature } from '{package-name}'

// Basic usage example
```

## Features

- Feature 1
- Feature 2
- Feature 3

## Documentation

- [Getting Started](./docs/getting-started)
- [API Reference](./api/)
- [Examples](./examples/)
- [Integration Guides](./integrations/)

## Semantic Patterns

{Show $.Subject.predicate.Object patterns}

## License

MIT (Open Source)

````

### API Reference Template

```mdx
---
$id: https://{domain}/api
$type: APIReference
title: API Reference
---

# API Reference

## Functions

### functionName()

{Description}

**Signature**:
```typescript
function functionName(params: Params): Promise<Result>
````

**Parameters**:

- `param1` - Description
- `param2` - Description

**Returns**: Description

**Example**:

```typescript
const result = await functionName({ param1: 'value' })
```

## Types

### TypeName

{Description}

```typescript
interface TypeName {
  $id?: string
  $type: string
  // ...properties
}
```

````

### Example Template

```mdx
---
$id: https://{domain}/examples/{slug}
$type: HowTo
title: Example Title
---

# Example Title

{Brief description of what this example demonstrates}

## Overview

{Explain the use case}

## Code

```typescript
import { feature } from '{package}'

// Complete, working example
const result = await feature({
  // ...
})
````

## Explanation

{Step-by-step explanation}

## See Also

- [Related Example](./related)
- [API Reference](../api/)

````

## Cross-Linking

Sites should link to related domains:

```mdx
This domain integrates with:
- [`sdk.do`](https://sdk.do) - Core SDK
- [`schema.org.ai`](https://schema.org.ai) - Schema.org types
- [`graphdl`](https://graphdl.do) - Semantic graphs
````

## License

MIT (Open Source)

All documentation in this folder is open-source and free to use, modify, and distribute.

---

Part of the [`.do` platform](https://github.com/dot-do/platform) open-source ecosystem.
