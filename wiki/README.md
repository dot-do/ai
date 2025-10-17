# SDK Wiki

Welcome to the `.do` platform SDK wiki. This is the public documentation for developers building with Business-as-Code and Services-as-Software.

## Structure

```
ai/wiki/
├── index.md              # Wiki home page
├── getting-started/      # Quick start guides
├── concepts/             # Core concepts
├── sdk/                  # SDK reference
├── packages/             # Package documentation
└── examples/             # Code examples
```

## MDXLD Standards

All wiki pages must follow these MDXLD standards for semantic web compatibility and AI comprehension.

### Required Frontmatter

Every page must include:

```yaml
---
$id: https://sdk.do/wiki/[category]/[page-name]
$type: [TechArticle|HowTo|CollectionPage|FAQPage]
$context: https://schema.org
name: Human Readable Title
description: Brief one-sentence description

author:
  $type: Organization
  $id: https://platform.do/team
  name: .do Team

dateCreated: '2025-10-12'
dateModified: '2025-10-12'
datePublished: '2025-10-12'

keywords: [keyword1, keyword2, keyword3]

isPartOf:
  $type: CollectionPage
  $id: https://sdk.do/wiki/[parent-category]
  name: Parent Category

license:
  $type: CreativeWork
  name: MIT
  url: https://opensource.org/licenses/MIT

inLanguage: en-US
---
```

### Schema.org Types

Use these Schema.org types for `$type`:

| Page Type                 | `$type`              | Use Case                                 |
| ------------------------- | -------------------- | ---------------------------------------- |
| **Getting Started Guide** | `HowTo`              | Step-by-step tutorials with instructions |
| **Concept Explanation**   | `TechArticle`        | Technical articles explaining concepts   |
| **API Reference**         | `TechArticle`        | API documentation and references         |
| **Code Example**          | `SoftwareSourceCode` | Example code and snippets                |
| **Category/Index**        | `CollectionPage`     | Section indexes and category pages       |
| **FAQ**                   | `FAQPage`            | Frequently asked questions               |

### Semantic Properties

Use Schema.org properties for relationships:

```yaml
# What the page is about
about:
  - $type: SoftwareApplication
    $id: https://sdk.do
    name: sdk.do
    applicationCategory: SDK

# Related pages mentioned
mentions:
  - $type: TechArticle
    $id: https://sdk.do/wiki/concepts/graphdl
    name: GraphDL Concepts

# Hierarchical parent
isPartOf:
  $type: CollectionPage
  $id: https://sdk.do/wiki/getting-started
  name: Getting Started

# Child pages (for index pages)
hasPart:
  - $type: HowTo
    $id: https://sdk.do/wiki/getting-started/quickstart
    name: Quick Start Guide
```

### Educational Metadata

For guides and tutorials, include:

```yaml
learningResourceType: [Tutorial|Reference|Explanation|Example]
educationalLevel: [Beginner|Intermediate|Advanced]
timeRequired: PT15M # ISO 8601 duration format (15 minutes)
```

Example durations:

- `PT5M` = 5 minutes
- `PT15M` = 15 minutes
- `PT1H` = 1 hour
- `PT2H30M` = 2 hours 30 minutes

### For HowTo Articles

Include structured steps:

```yaml
$type: HowTo
step:
  - $type: HowToStep
    position: 1
    name: Install SDK
    text: Run pnpm add sdk.do to install the SDK
  - $type: HowToStep
    position: 2
    name: Import and Use
    text: Import the $ proxy and start building
```

### Absolute URIs

All `$id` values must be absolute URIs:

- ✅ `$id: https://sdk.do/wiki/getting-started/quickstart`
- ❌ `$id: /wiki/getting-started/quickstart`
- ❌ `$id: getting-started/quickstart`

### Author Attribution

Always structure author as an object:

```yaml
# ✅ Correct
author:
  $type: Organization
  $id: https://platform.do/team
  name: .do Team

# Or for individual authors
author:
  $type: Person
  $id: https://platform.do/team/alice
  name: Alice Johnson
  email: alice@platform.do

# ❌ Incorrect
author: .do Team
```

## Writing Guidelines

### Use [[Wiki Links]]

In page content, use Obsidian-style wiki links for cross-references:

```markdown
See [[GraphDL Concepts]] and [[Runtime Context]] for more details.
```

These will be transformed to proper semantic links at build time.

### Keep Frontmatter Semantic

In frontmatter, use structured references with `$id`:

```yaml
mentions:
  - $type: TechArticle
    $id: https://sdk.do/wiki/concepts/graphdl
    name: GraphDL Concepts
```

### Example Pages

#### Tutorial Example

```markdown
---
$id: https://sdk.do/wiki/getting-started/quickstart
$type: HowTo
$context: https://schema.org
name: Quick Start Guide
description: Build your first Business-as-Code application in 5 minutes

author:
  $type: Organization
  $id: https://platform.do/team
  name: .do Team

dateCreated: '2025-10-12'
dateModified: '2025-10-12'
datePublished: '2025-10-12'

keywords: [quickstart, tutorial, first-app]

learningResourceType: Tutorial
educationalLevel: Beginner
timeRequired: PT5M

about:
  $type: SoftwareApplication
  $id: https://sdk.do
  name: sdk.do

isPartOf:
  $type: CollectionPage
  $id: https://sdk.do/wiki/getting-started
  name: Getting Started

step:
  - $type: HowToStep
    position: 1
    name: Install SDK
    text: Run pnpm add sdk.do
  - $type: HowToStep
    position: 2
    name: Create Business Entity
    text: Use db.create with semantic types

license:
  $type: CreativeWork
  name: MIT
  url: https://opensource.org/licenses/MIT

inLanguage: en-US
---

# Quick Start Guide

Build your first application in 5 minutes...
```

#### Concept Article Example

```markdown
---
$id: https://sdk.do/wiki/concepts/graphdl
$type: TechArticle
$context: https://schema.org
name: GraphDL Concepts
description: Understanding semantic graph queries with GraphDL

author:
  $type: Organization
  $id: https://platform.do/team
  name: .do Team

dateCreated: '2025-10-12'
dateModified: '2025-10-12'
datePublished: '2025-10-12'

keywords: [graphdl, semantic, queries, graph]

learningResourceType: Explanation
educationalLevel: Intermediate

about:
  - $type: SoftwareApplication
    $id: https://graphdl.do
    name: GraphDL

mentions:
  - $type: TechArticle
    $id: https://sdk.do/wiki/concepts/semantic-triples
    name: Semantic Triples

isPartOf:
  $type: CollectionPage
  $id: https://sdk.do/wiki/concepts
  name: Core Concepts

license:
  $type: CreativeWork
  name: MIT
  url: https://opensource.org/licenses/MIT

inLanguage: en-US
---

# GraphDL Concepts

GraphDL enables semantic graph queries...
```

## Validation

Validate your wiki pages before committing:

```bash
# Run validation (coming soon)
pnpm validate:wiki

# Lint wiki content
pnpm lint:wiki
```

## Best Practices

1. **Start with templates** - Copy frontmatter from existing pages
2. **Use absolute URIs** - Always include full domain in `$id`
3. **Schema.org properties** - Use standard names (`dateCreated`, `isPartOf`)
4. **Structure objects** - All entities should have `$type` and ideally `$id`
5. **Update dates** - Always update `dateModified` when editing
6. **Add keywords** - Include 3-5 relevant keywords for discoverability
7. **Educational metadata** - Help users find content at their level
8. **Link generously** - Use [[Wiki Links]] to connect related concepts
9. **Think semantic** - Consider how AI will understand relationships

## Standalone Policy

This wiki is **standalone** and **open source**:

- ✅ Self-contained documentation
- ✅ No dependencies on internal platform wiki
- ✅ MIT licensed
- ✅ Uses `https://sdk.do/wiki/*` URIs
- ❌ No references to internal platform documentation
- ❌ No proprietary information

The internal platform wiki at `wiki/` can reference this wiki, but not vice versa.

## Contributing

We welcome contributions! Please:

1. Follow the MDXLD standards above
2. Use Schema.org types and properties
3. Include educational metadata
4. Add [[Wiki Links]] for navigation
5. Test your changes locally
6. Submit a PR with clear description

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for general contribution guidelines.

## Questions?

- [SDK Documentation](https://sdk.do)
- [GitHub Issues](https://github.com/dot-do/ai/issues)
- [Discussions](https://github.com/dot-do/ai/discussions)
