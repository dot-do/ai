# CLAUDE.md - ai/things/ Directory

Guidelines for Claude Code when working with the `ai/things/` directory.

## Overview

The `ai/things/` directory contains **public and open-source content** that is part of the `.do` platform SDK. This is a subset of the root `things/` directory (which contains private/proprietary content).

## Directory Philosophy

Things are organized in **namespace directories** by their source vocabulary to prevent collisions and provide clear provenance:

```
ai/things/
├── tech.org.ai/       # O*NET Technology Skills (135 technologies)
│   ├── Python.mdx
│   ├── JavaScript.mdx
│   └── React.mdx
├── tools.org.ai/      # O*NET Tools & Technology (physical tools)
│   └── Hammer.mdx
├── tasks.org.ai/      # O*NET Task Statements (19,000+ tasks)
├── jobs.org.ai/       # O*NET Job Titles (alternate titles)
├── soc.org.ai/        # O*NET Occupations (923 SOC codes)
├── process.org.ai/    # Business processes (APQC enhanced)
│   └── CustomerOnboarding.mdx
├── industries.org.ai/ # Industries (NAICS enhanced)
│   └── ArtificialIntelligence.mdx
├── events.org.ai/     # Business events (GS1 EPCIS)
│   └── OrderShipped.mdx
├── vc.org.ai/         # Crunchbase VC data
├── wikipedia.org.ai/  # Wikipedia canonical entities
├── services.org.ai/   # Services-as-Software abstractions
├── startups.org.ai/   # AI Startup abstractions
├── markdown.org.ai/   # Markdown ecosystem types
├── business.org.ai/   # Business-as-Code foundational abstractions
├── Thing.mdx          # Base Thing type definition (legacy flat file)
├── Noun.mdx           # Base Noun type definition (legacy flat file)
├── Verb.mdx           # Base Verb type definition (legacy flat file)
└── [legacy].mdx       # Other legacy flat files (to be migrated)
```

### Why Namespaces?

Namespaces prevent collisions and provide clear provenance:

**Without Namespaces (Problems)**:
```
ai/things/
├── Python.mdx          # Is this the language or the snake?
├── React.mdx           # Is this the framework or the chemical reaction?
├── Hammer.mdx          # Is this a tool or a design pattern?
```

**With Namespaces (Clear)**:
```
ai/things/
├── tech.org.ai/Python.mdx      # Programming language
├── schema.org.ai/Python.mdx    # Python snake (if we add it)
├── tools.org.ai/Hammer.mdx     # Physical tool
└── patterns.org.ai/Hammer.mdx  # Design pattern (if we add it)
```

## Front Matter Standards

### Required Format

All Thing files **MUST** use this exact front matter structure:

```mdx
---
$type: ThingType
$id: https://schema.org.ai/ThingName
$context: https://schema.org
name: Human Readable Name
description: Clear description of what this thing represents
status: public
license: MIT
source: schema.org
---
```

### Field Definitions

#### Core MDXLD Fields (Required)

- **`$type`**: The type of this Thing
  - Use `Noun` for **base type definitions** (e.g., Thing.mdx, Person.mdx)
  - Use `Verb` for **actions and relationships** (e.g., achieve.mdx, name.mdx)
  - Use the type name for **instances** (e.g., `Person` for AlbertEinstein.mdx)
- **`$id`**: Unique identifier, must be a URL
  - Schema.org vocabulary: `https://schema.org.ai/[name]`
  - GS1 vocabulary: `https://gs1.org.ai/[name]`
- **`$context`**: Vocabulary context
  - Schema.org: `https://schema.org`
  - GS1: `https://gs1.org`

#### Metadata Fields (Required)

- **`name`**: Human-readable name (use camelCase for verbs, TitleCase for nouns)
- **`description`**: Clear, concise description (1-2 sentences)
- **`status`**: Must be `public` for all items in this directory
- **`license`**: License for the Thing
  - Use `CC-BY-4.0` (Creative Commons) for all *.org.ai Things
  - Legacy schema.org/gs1.org flat files may use `MIT`
- **`source`**: Original vocabulary source
  - `onetonline.org` for O*NET vocabulary (tech, tools, tasks, jobs, soc)
  - `apqc.org` for APQC vocabulary (process)
  - `naics.com` for NAICS vocabulary (industries)
  - `gs1.org` for GS1 vocabulary (events)
  - `crunchbase.com` for Crunchbase vocabulary (vc, enterprises)
  - `wikipedia.org` for Wikipedia vocabulary
  - `schema.org` for Schema.org vocabulary
  - `platform.do` for custom `.do` vocabulary

#### Optional Fields

- **`category`**: Organizational category
- **`tags`**: Array of tags for search/filtering
- **`created`**: ISO 8601 date created
- **`updated`**: ISO 8601 date last updated
- **`version`**: Semantic version number
- **`schemaVersion`**: Schema.org version (e.g., `14.0`)
- **`conjugation`**: For verbs - related conjugated forms
- Any other Schema.org or GS1 properties relevant to the type

### Examples

#### Base Type Definition (Thing.mdx)

````mdx
---
$type: Noun
$id: https://schema.org.ai/Thing
$context: https://schema.org
name: Thing
description: The most generic type of item
status: public
license: MIT
source: schema.org
schemaVersion: '14.0'
---

# Thing

The most generic type of item in the Schema.org vocabulary.

## Properties

All Schema.org types inherit from Thing and share these properties:

- name
- description
- url
- identifier
- sameAs

## Usage

```typescript
import { $ } from 'sdk.do'

// Thing is the base type for all entities
const thing = await db.create($.Thing, {
  name: 'My Item',
  description: 'A generic thing',
})
```
````

````

#### Action Verb (achieve.mdx)

```mdx
---
$type: Verb
$id: https://schema.org.ai/achieve
$context: https://schema.org
name: achieve
description: The act of accomplishing something via previous efforts
status: public
license: MIT
source: schema.org
schemaVersion: '14.0'
category: Action
conjugation:
  base: achieve
  thirdPerson: achieves
  past: achieved
  objectNoun: achievement
  opposite: fail
  inverse: achievedBy
---

# achieve

The act of accomplishing something via previous efforts. It is an instantaneous action rather than an ongoing process.

## Schema.org Definition

From [AchieveAction](https://schema.org/AchieveAction) in Schema.org vocabulary.

## Conjugations

- **Base**: achieve
- **Third person**: achieves
- **Past tense**: achieved
- **Object noun**: achievement
- **Opposite**: fail
- **Inverse/Passive**: achievedBy

## Usage

```typescript
import { $ } from 'sdk.do'

// Create a relationship using the verb
await db.relate(user, $.achieve, goal)

// Query who achieved something (inverse)
const achievers = await db.related(goal, $.achievedBy, $.Person)
````

## Related Actions

- **activate** - Start or turn on something
- **complete** - Finish something
- **succeed** - Achieve success

````

#### Core Type (Person.mdx)

```mdx
---
$type: Noun
$id: https://schema.org.ai/Person
$context: https://schema.org
name: Person
description: A person (alive, dead, undead, or fictional)
status: public
license: MIT
source: schema.org
schemaVersion: '14.0'
category: Core Types
---

# Person

A person (alive, dead, undead, or fictional) in the Schema.org vocabulary.

## Properties

Inherits all Thing properties, plus:
- givenName
- familyName
- email
- telephone
- address
- birthDate
- worksFor
- knows

## Usage

```typescript
import { $ } from 'sdk.do'

const person = await db.create($.Person, {
  name: 'Ada Lovelace',
  givenName: 'Ada',
  familyName: 'Lovelace',
  description: 'First computer programmer'
})
````

```

## File Naming Conventions

### Pattern

- Use **camelCase** for verbs: `achieve.mdx`, `achieves.mdx`, `achieved.mdx`
- Use **TitleCase** for nouns: `Thing.mdx`, `Person.mdx`, `Organization.mdx`
- Match the Schema.org type name when possible
- For verb conjugations, use the exact conjugated form as the filename

### Examples

✅ **Good**:
- `Thing.mdx` - Base type (TitleCase)
- `Person.mdx` - Schema.org type (TitleCase)
- `achieve.mdx` - Base verb form (camelCase)
- `achieves.mdx` - Third person verb (camelCase)
- `achieved.mdx` - Past tense verb (camelCase)
- `achievement.mdx` - Object noun (camelCase)
- `achievedBy.mdx` - Inverse verb (camelCase)

❌ **Bad**:
- `achieve-action.mdx` - Don't use hyphens
- `Achieve.mdx` - Don't use TitleCase for verbs
- `person.mdx` - Don't use lowercase for nouns
- `PERSON.mdx` - Don't use UPPERCASE

## Working with Things

### Creating a New Thing

1. Determine the source vocabulary (Schema.org, GS1, or custom)
2. Check if a base type definition exists (e.g., `Thing.mdx`, `Verb.mdx`)
3. Create the file following the naming convention
4. Use the correct front matter structure with `status: public` and license
5. Provide detailed description and usage examples
6. Include references to source vocabulary

### Creating Verb Conjugations

When adding a new Action verb from Schema.org, create **all 6 forms**:

1. **Base form** - `achieve.mdx`
2. **Third person** - `achieves.mdx` (if different from base)
3. **Past tense** - `achieved.mdx` (if different from base)
4. **Object noun** - `achievement.mdx`
5. **Opposite** - `fail.mdx`
6. **Inverse** - `achievedBy.mdx`

Each file should cross-reference the others in the "Related" section.

### Modifying Things

1. Always read the file first to understand existing structure
2. Preserve all front matter fields
3. Update the `updated` field with current ISO 8601 date
4. Maintain consistent formatting
5. Update version if making breaking changes

### Deleting Things

⚠️ **Caution**: Deleting public Things can break existing code.

1. Mark as deprecated first by adding `deprecated: true` to front matter
2. Wait at least one major version before removing
3. Document the reason in commit message
4. Update all references in documentation

## Vocabulary Integration

### Schema.org Actions

Schema.org defines 83 Action types. Each becomes a verb with conjugations:

```

AchieveAction → achieve.mdx, achieves.mdx, achieved.mdx, achievement.mdx, fail.mdx, achievedBy.mdx
ActivateAction → activate.mdx, activates.mdx, activated.mdx, activation.mdx, deactivate.mdx, activatedBy.mdx
...

````

This creates ~498 verb forms (83 actions × 6 forms each).

### GS1 Vocabulary

GS1 provides product identification and supply chain standards:

- GTIN (Global Trade Item Number)
- GLN (Global Location Number)
- SSCC (Serial Shipping Container Code)
- Product attributes and classifications

### Custom .do Vocabulary

Platform-specific types not in Schema.org or GS1:

- Agent types for AI agents
- Integration types for third-party connections
- Workflow types for automation

## Best Practices

### Documentation

- **Always include clear descriptions**
- **Provide usage examples with sdk.do**
- **Document relationships to other Things**
- **Reference source vocabulary with links**

### Organization

- **Use consistent naming (camelCase for verbs, TitleCase for nouns)**
- **Group related Things with `category` field**
- **Use `tags` for cross-cutting concerns**
- **Maintain the flat structure (no subdirectories)**

### Maintenance

- **Review and update regularly with new Schema.org releases**
- **Mark deprecated Things rather than deleting**
- **Keep the README up to date**
- **Bump version numbers on changes**

## Integration with Platform

### Referencing Things

Things can be referenced by their `$id`:

```typescript
import { $ } from 'sdk.do'

// Reference by semantic name
const person = $.Person

// Reference by $id
const person = $.resolve('https://schema.org.ai/Person')

// Query Things by type
const people = await db.list($.Person)
````

### Semantic Queries

```typescript
// Find who achieved something (using inverse)
const achievers = await db.related(goal, $.achievedBy, $.Person)

// Find what someone achieved
const achievements = await db.related(person, $.achieve, $.Thing)

// Complex queries
const results = await db.query({
  subject: $.Person,
  predicate: $.achieve,
  object: { $type: $.Goal, status: 'completed' },
})
```

## Common Patterns

### Base Type Definition (Noun)

Create a base definition for each major category using `$type: Noun`:

```mdx
---
$type: Noun
$id: https://schema.org.ai/Person
$context: https://schema.org
name: Person
description: A person (alive, dead, undead, or fictional)
status: public
license: MIT
source: schema.org
---

# Person

Base type definition and documentation...
```

### Action Verb with Conjugations

Create the base verb with all conjugated forms referenced:

```mdx
---
$type: Verb
$id: https://schema.org.ai/achieve
$context: https://schema.org
name: achieve
description: The act of accomplishing something
status: public
license: MIT
source: schema.org
conjugation:
  base: achieve
  thirdPerson: achieves
  past: achieved
  objectNoun: achievement
  opposite: fail
  inverse: achievedBy
---

# achieve

Implementation and usage...
```

### Property Verb

Properties are verbs that express relationships:

```mdx
---
$type: Verb
$id: https://schema.org.ai/name
$context: https://schema.org
name: name
description: The name of the item
status: public
license: MIT
source: schema.org
category: Property
---

# name

The name property relates a Thing to its name value.
```

## Summary

- **Structure**: Flat, root-level files following schema.org pattern
- **Front Matter**: `$type`, `$id`, `$context` required; use MDXLD syntax
- **Naming**: camelCase for verbs, TitleCase for nouns
- **Verbs**: Create all 6 conjugated forms for Action verbs
- **Status**: Always `public` with open-source license
- **Source**: Reference original vocabulary (schema.org, gs1.org)
- **Organization**: Use categories and tags; maintain flat structure
