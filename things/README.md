# ai/things/

The `ai/things/` directory contains all **public and open-source** semantic Things that are part of the `.do` platform SDK and publicly available.

## Purpose

This directory is a **subset** of the root `things/` directory (which contains private/proprietary content). Everything here is:

- Public and open-source
- Part of the `.do` platform SDK
- Available for community use and contribution
- Licensed under Creative Commons (CC-BY-4.0) for all .org.ai Things

## Structure

Things are organized in **namespace directories** by their source vocabulary to prevent collisions and provide clear provenance:

```
ai/things/
├── README.md           # This file
├── CLAUDE.md           # Guidelines for Claude Code
├── tech.org.ai/        # O*NET Technology Skills (135 technologies)
│   ├── Python.mdx
│   ├── JavaScript.mdx
│   ├── React.mdx
│   └── TypeScript.mdx
├── tools.org.ai/       # O*NET Tools & Technology (physical tools)
├── tasks.org.ai/       # O*NET Task Statements (19,000+ tasks)
├── jobs.org.ai/        # O*NET Job Titles (alternate titles)
├── services.org.ai/    # Services-as-Software abstractions
├── startups.org.ai/    # AI Startup abstractions
├── markdown.org.ai/    # Markdown ecosystem types
├── business.org.ai/    # Business-as-Code foundational abstractions
├── wikipedia.org.ai/   # Wikipedia canonical entity references
├── Thing.mdx           # Base Thing type definition (legacy flat file)
├── Noun.mdx            # Base Noun type definition (legacy flat file)
├── Verb.mdx            # Base Verb type definition (legacy flat file)
└── [legacy].mdx        # Other legacy flat files (to be migrated)
```

### Why Namespaces?

Namespaces prevent collisions and provide clear provenance:

**Without Namespaces (Problems):**
```
ai/things/
├── Python.mdx          # Is this the language or the snake?
├── React.mdx           # Is this the framework or the chemical reaction?
├── Hammer.mdx          # Is this a tool or a design pattern?
```

**With Namespaces (Clear):**
```
ai/things/
├── tech.org.ai/Python.mdx      # Programming language
├── schema.org.ai/Python.mdx    # Python snake (if we add it)
├── tools.org.ai/Hammer.mdx     # Physical tool
└── patterns.org.ai/Hammer.mdx  # Design pattern (if we add it)
```

## Categories

### 1. Base Types

Foundation types for the semantic system:

- **Thing** - The most generic type
- **Noun** - Entity and concept types
- **Verb** - Relationship and action types

### 2. Schema.org Core Types (Nouns)

From schema.org vocabulary:

- **Person** - A person (alive, dead, undead, or fictional)
- **Organization** - Schools, NGOs, corporations, clubs, etc.
- **Place** - Entities with physical location
- **Event** - Events at specific time and location
- **Product** - Offered products or services
- **CreativeWork** - Articles, books, movies, etc.

### 3. Schema.org Properties (Verbs)

Relationship properties from schema.org:

- name, description, url, identifier
- sameAs, alternateName
- requires, uses, involves
- isPartOf, hasPart
- location, about, subjectOf

### 4. Schema.org Actions (Verbs with Conjugations)

83 Action types, each with 6 forms (498 total verb forms):

- Base form (achieve, activate, add...)
- Third person (achieves, activates, adds...)
- Past tense (achieved, activated, added...)
- Object noun (achievement, activation, addition...)
- Opposite (fail, deactivate, remove...)
- Inverse/passive (achievedBy, activatedBy, addedBy...)

### 5. GS1 Vocabulary

From gs1.org standards:

- Product identifiers (GTIN, GLN, SSCC)
- Supply chain concepts
- Product attributes and classifications

## Front Matter Syntax

All Thing files use MDXLD front matter with `$type`, `$id`, and `$context` fields:

````mdx
---
$type: Verb
$id: https://schema.org.ai/achieve
$context: https://schema.org
name: achieve
description: The act of accomplishing something via previous efforts
status: public
license: MIT
source: schema.org
---

# achieve

The act of accomplishing something via previous efforts. It is an instantaneous action rather than an ongoing process.

## Usage

```typescript
import { $ } from 'sdk.do'

// Use in semantic queries
const achievements = await db.query({
  subject: user,
  predicate: $.achieve,
  object: goal,
})
```
````

## Related Verbs

- **Third person**: achieves
- **Past tense**: achieved
- **Object noun**: achievement
- **Opposite**: fail
- **Inverse**: achievedBy

```

### Required Fields

- `$type`: The type of this Thing
  - Use `Noun` for base type definitions (Thing.mdx, Person.mdx)
  - Use `Verb` for actions and relationships
  - Use the type name for instances
- `$id`: Unique identifier (URL format: `https://schema.org.ai/[name]` or `https://gs1.org.ai/[name]`)
- `$context`: The vocabulary context (`https://schema.org` or `https://gs1.org`)
- `name`: Human-readable name
- `description`: Clear description
- `status`: `public` for all items in this directory
- `license`: CC-BY-4.0 (Creative Commons for all .org.ai Things)
- `source`: Original vocabulary source (schema.org, gs1.org, onetonline.org)

### Optional Fields

- `category`: Category for organization
- `tags`: Array of tags
- `created`: Creation date (ISO 8601)
- `updated`: Last update date (ISO 8601)
- `version`: Semantic version number
- Any other Schema.org or GS1 properties for the type

## Relationship to Root `things/`

```

things/ # Private superset (root directory)
├── [Private content] # Not publicly associated with .do
└── [Internal things] # Not ready for open source

ai/things/ # Public subset (this directory)
├── [Open source content] # Published and public
└── [SDK things] # Part of the open SDK

```

## Migration Path

### Legacy Flat Files → Namespaces

Existing flat files in `ai/things/` (not in namespace directories) should be migrated:

1. **Identify source vocabulary**
   - Schema.org → `schema.org.ai/`
   - GS1 → `gs1.org.ai/`
   - O*NET → `tech.org.ai/`, `tools.org.ai/`, `tasks.org.ai/`, `jobs.org.ai/`
   - Platform → `services.org.ai/`, `startups.org.ai/`, `markdown.org.ai/`, `business.org.ai/`

2. **Move to namespace directory**
   ```bash
   # Example: Python.mdx → tech.org.ai/Python.mdx
   mv ai/things/Python.mdx ai/things/tech.org.ai/Python.mdx
   ```

3. **Update $id to include namespace**
   ```yaml
   # Before
   $id: https://schema.org.ai/Python

   # After
   $id: https://tech.org.ai/Python
   ```

4. **Update cross-references**
   - Find all files referencing the old path
   - Update to new namespace path

5. **Deprecate old location**
   - Add deprecation notice to old file if still needed
   - Or remove if fully migrated

**Timeline**: Phase 4 of package scaffolding

### Private → Public Migration

When private content in `things/` is ready to be made public:

1. Review for sensitive information
2. Move the file from `things/` to appropriate `ai/things/{namespace}/` directory
3. Update the `status` field to `public`
4. Update the `$id` to point to the public location (include namespace)
5. Add appropriate open-source license
6. Update documentation references

## Security

✅ **This directory is public** - Everything here is:
- Open source and publicly available
- Safe to commit to public repositories
- Part of the published SDK
- Licensed for community use

## Usage

Thing files can be:

- Referenced in platform code via their `$id`
- Queried through the platform's semantic layer
- Used in SDK, CLI, MCP, and RPC interfaces
- Extended by the community

## Examples

See the base type definitions in this directory:
- `Thing.mdx` - Base Thing definition
- `Noun.mdx` - Base Noun (entity) type
- `Verb.mdx` - Base Verb (relationship) type
- `Person.mdx` - Schema.org Person type
- `achieve.mdx` - Schema.org Action verb

## Contributing

### Creating New Things in Namespaces

When adding new Things, always use namespaces:

1. **Determine the correct namespace**
   - O*NET data → `tech.org.ai/`, `tools.org.ai/`, `tasks.org.ai/`, `jobs.org.ai/`
   - Schema.org → `schema.org.ai/` (if not in another namespace)
   - GS1 → `gs1.org.ai/`
   - Platform → `services.org.ai/`, `startups.org.ai/`, `markdown.org.ai/`, `business.org.ai/`

2. **Create file with proper naming**
   ```bash
   # TitleCase for nouns
   ai/things/tech.org.ai/Python.mdx
   ai/things/services.org.ai/CRMService.mdx

   # camelCase for verbs
   ai/things/tasks.org.ai/analyzeData.mdx
   ```

3. **Use correct frontmatter with namespace**
   ```yaml
   ---
   $type: Technology
   $id: https://tech.org.ai/Python  # Include namespace in URL
   $context: https://schema.org
   name: Python
   description: High-level, interpreted programming language
   status: public
   license: CC-BY-4.0  # Creative Commons for all .org.ai Things
   source: schema.org
   ---
   ```

4. **Document semantic relationships**
   ```markdown
   ## Semantic Relationships

   ### Used By Occupations
   - Software Developers ($.Occupation:15-1252.00)

   ### Integrates With
   - JavaScript ($.Technology:JavaScript)
   ```

5. **Provide examples and documentation**
   - Include code examples where relevant
   - Add usage patterns with sdk.do
   - Reference related Things

### General Guidelines

1. Use the appropriate base type as a template
2. Follow the front matter syntax exactly
3. Provide clear, detailed descriptions
4. Include usage examples where helpful
5. Set `status: public` and add license field
6. Reference the source vocabulary
7. **Always use namespaces** - Never create new flat files

## Vocabulary Sources

### Schema.org
- **URL**: https://schema.org
- **Our extension**: https://schema.org.ai
- **Content**: Core types, properties, and 83 Actions with full conjugations
- **Namespace**: `schema.org.ai/` (for Things not in other namespaces)

### GS1
- **URL**: https://gs1.org
- **Our extension**: https://gs1.org.ai
- **Content**: Product identifiers, supply chain vocabulary
- **Namespace**: `gs1.org.ai/`

### O*NET Database 30.0 (CC BY 4.0)

**Source**: U.S. Department of Labor, Employment and Training Administration (USDOL/ETA)
**Website**: https://www.onetonline.org
**License**: Creative Commons Attribution 4.0 International License
**Attribution**: This page includes information from the O*NET 30.0 Database by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA). Used under the CC BY 4.0 license. O*NET® is a trademark of USDOL/ETA.

#### tech.org.ai
- **Source**: O*NET Technology Skills dataset
- **Count**: 135 technologies (deduplicated from 32,681 records)
- **Types**: Programming languages, frameworks, databases, development tools
- **Namespace**: `tech.org.ai/`
- **Examples**: `Python.mdx`, `JavaScript.mdx`, `React.mdx`, `TypeScript.mdx`

#### tools.org.ai
- **Source**: O*NET Tools and Technology dataset
- **Types**: Physical tools, equipment, machinery
- **Namespace**: `tools.org.ai/`
- **Status**: To be implemented

#### tasks.org.ai
- **Source**: O*NET Task Statements dataset
- **Count**: 19,000+ task statements
- **Types**: Occupational tasks, work activities
- **Namespace**: `tasks.org.ai/`
- **Status**: To be implemented

#### jobs.org.ai
- **Source**: O*NET Alternate Titles dataset
- **Types**: Job titles, occupational roles
- **Namespace**: `jobs.org.ai/`
- **Status**: To be implemented

### Platform.do Vocabularies

#### services.org.ai
- **Source**: Platform.do - Services-as-Software
- **License**: CC-BY-4.0
- **Types**: Service abstractions, capabilities, interfaces
- **Purpose**: Foundational abstractions for Services-as-Software pattern
- **Namespace**: `services.org.ai/`
- **Status**: To be implemented

#### startups.org.ai
- **Source**: Platform.do - AI Startups
- **License**: CC-BY-4.0
- **Types**: AI startup abstractions, patterns, archetypes
- **Purpose**: Abstractions specifically for AI-first startups
- **Namespace**: `startups.org.ai/`
- **Status**: To be implemented

#### markdown.org.ai
- **Source**: Platform.do - Markdown Ecosystem
- **License**: CC-BY-4.0
- **Types**: Markdown types, MDXLD patterns, MDX components
- **Namespace**: `markdown.org.ai/`
- **Status**: To be implemented

#### business.org.ai
- **Source**: Platform.do - Business-as-Code
- **License**: CC-BY-4.0
- **Types**: Business entity abstractions, organizational patterns
- **Purpose**: Foundational abstractions for Business-as-Code pattern
- **Namespace**: `business.org.ai/`
- **Status**: To be implemented

#### wikipedia.org.ai
- **Source**: Wikipedia (Wikimedia Foundation)
- **License**: CC-BY-SA 3.0 (Wikipedia content) / MIT (package code)
- **Types**: Wikipedia articles, canonical entity references
- **Purpose**: Provide canonical URLs for entities (e.g., `https://wikipedia.org.ai/Anthropic`)
- **Namespace**: `wikipedia.org.ai/`
- **Data**: Structured data extracted via `dumpster-dive` and `wtf_wikipedia`
- **Status**: Package implemented, full pipeline requires Cloudflare setup

## Questions?

See `CLAUDE.md` in this directory for detailed guidelines on working with Things.
```
