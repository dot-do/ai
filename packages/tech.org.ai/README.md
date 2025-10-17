# tech.org.ai

> O*NET Technology Skills vocabulary - software, programming languages, frameworks, databases, and development tools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

`tech.org.ai` provides a comprehensive, semantically-structured vocabulary of software technologies from the O*NET Database. This package enables AI-native applications to understand, query, and reason about technologies used in various occupations.

**Data Source**: [O*NET Database 30.0](https://www.onetcenter.org/) - Technology Skills

## What's Included

- **~2,000+ Technologies** from O*NET Technology Skills dataset
- **Technology Categories**: Programming Languages, Frameworks, Databases, Cloud Platforms, Development Tools, Operating Systems, Business Applications, Web Servers
- **Hot Technology Flags**: Identifies emerging/in-demand technologies
- **Vendor/Product Examples**: Specific implementations (e.g., "Python 3.11", "React 18")
- **Semantic Relationships**: Technologies linked to occupations, tasks, and other technologies

## Installation

```bash
pnpm add tech.org.ai
```

## Usage

### Basic Queries

```typescript
import {
  getTechnology,
  getAllTechnologies,
  getTechnologiesByCategory,
  getHotTechnologies,
  searchTechnologies,
} from 'tech.org.ai'

// Get specific technology
const python = getTechnology('2021-10-01')  // Commodity code
console.log(python)
// {
//   $type: 'Technology',
//   $id: 'tech.org.ai:2021-10-01',
//   commodityCode: '2021-10-01',
//   commodityTitle: 'Python',
//   category: 'Programming Language',
//   hotTechnology: true,
//   examples: ['Python 3.11', 'CPython', 'PyPy']
// }

// Get all technologies
const allTech = getAllTechnologies()
console.log(`Total technologies: ${allTech.length}`)

// Filter by category
const languages = getTechnologiesByCategory('Programming Language')
console.log(`Programming languages: ${languages.length}`)

// Get hot (emerging) technologies
const hotTech = getHotTechnologies()
console.log(`Hot technologies: ${hotTech.length}`)

// Search by name
const reactTech = searchTechnologies('react')
console.log(reactTech)
```

### Type Definitions

```typescript
import type { Technology, TechnologyCategory, TechnologyStack } from 'tech.org.ai'

// Technology interface
const technology: Technology = {
  $type: 'Technology',
  $id: 'tech.org.ai:code',
  commodityCode: 'code',
  commodityTitle: 'Technology Name',
  category: 'Programming Language',
  hotTechnology: true,
  vendor: 'Vendor Name',
  examples: ['Example 1', 'Example 2'],

  // Semantic relationships
  usedBy: [{ $id: 'soc.org.ai:15-1252.00', $type: 'Occupation' }],
  requiredFor: [{ $id: 'tasks.org.ai:T123', $type: 'Task' }],
  extends: { $id: 'tech.org.ai:parent-code', $type: 'Technology' },
  integrates: [{ $id: 'tech.org.ai:integration-code', $type: 'Technology' }],
}

// Technology categories
const categories: TechnologyCategory[] = [
  'Programming Language',
  'Framework',
  'Library',
  'Database',
  'Operating System',
  'Development Tool',
  'Business Application',
  'Cloud Platform',
  'Web Server',
  'Other'
]
```

### Semantic Triple Patterns

`tech.org.ai` follows explicit semantic triple patterns (`$.Subject.predicate.Object`):

```typescript
// Semantic relationships
$.Technology.usedBy.Occupation         // Technologies used by occupations
$.Technology.requiredFor.Task          // Technologies required for tasks
$.Technology.extends.Technology        // Technology inheritance (e.g., TypeScript extends JavaScript)
$.Technology.integrates.Technology     // Technology integrations
$.Occupation.uses.Technology           // Inverse relationship
$.Task.uses.Technology                 // Inverse relationship
```

## Data Generation

To regenerate data from O*NET source:

```bash
cd ai/packages/tech.org.ai
pnpm install
pnpm import
```

This fetches the latest Technology Skills data from O*NET Center and generates `src/data/technologies.ts`.

## Technology Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Programming Language** | Programming and scripting languages | Python, JavaScript, TypeScript, Java, C++, Go, Rust |
| **Framework** | Application frameworks | React, Angular, Vue, Django, Flask, Spring |
| **Library** | Software libraries and packages | NumPy, Lodash, jQuery |
| **Database** | Database management systems | PostgreSQL, MongoDB, MySQL, Redis |
| **Operating System** | Operating systems | Linux, Windows, macOS, Unix |
| **Development Tool** | Development and debugging tools | Git, Docker, VS Code, Kubernetes |
| **Business Application** | Enterprise software | Salesforce, SAP, Microsoft Dynamics |
| **Cloud Platform** | Cloud computing platforms | AWS, Azure, Google Cloud, Heroku |
| **Web Server** | Web server software | Apache, Nginx, IIS |
| **Other** | Other technologies | Miscellaneous |

## Hot Technologies

O*NET flags emerging/in-demand technologies with the `hotTechnology` field:

```typescript
const hotTech = getHotTechnologies()

// Example hot technologies (as of O*NET 30.0):
// - React, Vue, Angular (Frontend frameworks)
// - Docker, Kubernetes (Containerization)
// - TensorFlow, PyTorch (Machine learning)
// - AWS, Azure (Cloud platforms)
```

## Integration with Platform

### RPC Access (via Payload)

```typescript
// workers/*/src/index.ts
const response = await env.API.fetch(
  new Request('https://api.do/technologies/2021-10-01')
)
const technology = await response.json()
```

### Semantic Queries (via sdk.do)

```typescript
import { $ } from 'sdk.do'

// Get technologies used by an occupation
const occupation = await $.Occupation.get('15-1252.00')
const technologies = await occupation.uses.Technologies()

// Get tasks that require a technology
const technology = await $.Technology.get('2021-10-01')
const tasks = await technology.requiredFor.Tasks()
```

## Relationships to Other Packages

- **tech.org.ai → soc.org.ai**: Technologies used by occupations
- **tech.org.ai → tasks.org.ai**: Technologies required for tasks
- **tech.org.ai ↔ tools.org.ai**: Software (tech) vs. physical tools (tools)
- **tech.org.ai → services.org.ai**: Technologies power services

## Development

```bash
# Install dependencies
pnpm install

# Build package
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Import O*NET data
pnpm import
```

## Data Source & License

**Data Source**: [O*NET Database 30.0](https://www.onetcenter.org/database.html)
**Data License**: Public Domain (U.S. Department of Labor/Employment and Training Administration)
**Package License**: MIT

## Contributing

See [CLAUDE.md](../../CLAUDE.md) for development guidelines.

## Related Packages

- [`soc.org.ai`](../soc.org.ai) - O*NET occupations (SOC codes)
- [`tasks.org.ai`](../tasks.org.ai) - O*NET work tasks
- [`tools.org.ai`](../tools.org.ai) - Physical tools and equipment
- [`onet.org.ai`](../onet.org.ai) - Complete O*NET meta-package
- [`schema.org.ai`](../schema.org.ai) - Schema.org vocabulary

## Issue Tracking

GitHub Issue: [#3437 - `tech.org.ai` Software technologies and frameworks](https://github.com/dot-do/platform/issues/3437)

---

**Generated with [Claude Code](https://claude.ai/code)**
