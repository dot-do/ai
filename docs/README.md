---
title: Documentation Overview
description: Technical documentation for all packages, SDKs, APIs, CLIs, MCP servers, and RPC services
keywords: [documentation, sdk, api, technical reference]
author: .do Team
lastUpdated: 2025-10-12
readingTime: 5 min
---

# Docs

Technical documentation for all packages, SDKs, APIs, CLIs, MCP servers, and RPC services.

## Overview

This folder contains in-depth technical documentation for developers working with the `.do` platform. Unlike the `sites/` folder (which contains user-facing documentation websites), this folder contains technical references, API specifications, architecture documents, and developer guides.

## Documentation Categories

### SDK Documentation

**[sdk.do](./sdk.do/)** - Core SDK technical reference

- API specifications
- Type definitions
- Implementation details
- Internal architecture

### Package Documentation

**[graphdl](./graphdl/)** - GraphDL technical reference

- Graph construction algorithms
- Proxy implementation details
- Performance characteristics
- Extension points

**[mdxld](./mdxld/)** - MDXLD technical reference

- Parser implementation
- Frontmatter processing
- JSON-LD transformation
- Schema validation

**[schema.org.ai](./schema.org.ai/)** - Schema.org types documentation

- Type generation process
- Coverage analysis
- Vocabulary mappings
- Extension mechanisms

**[gs1.org.ai](./gs1.org.ai/)** - GS1 vocabulary documentation

- EPCIS 2.0 specification
- CBV implementation
- Event processing
- Supply chain patterns

**[soc.org.ai](./soc.org.ai/)** - O\*NET types documentation

- SOC code structure
- Data ingestion process
- Type generation
- Occupation taxonomies

### Protocol Documentation

**[mcp](./mcp/)** - Model Context Protocol

- MCP server implementation
- Tool definitions
- Security model
- Integration patterns

**[rpc](./rpc/)** - RPC communication

- RPC protocol specification
- Service bindings
- Type safety guarantees
- Error handling

### CLI Documentation

**[cli](./cli/)** - Command-line interface

- Command reference
- Argument parsing
- Configuration
- Plugin system

## Documentation Structure

Each documentation set follows this structure:

```
{topic}/
├── README.md           → Overview and quick reference
├── architecture.md     → System architecture
├── api-spec.md         → API specification
├── types.md            → Type definitions
├── implementation.md   → Implementation details
├── performance.md      → Performance characteristics
├── security.md         → Security considerations
├── testing.md          → Testing strategies
└── examples/           → Advanced technical examples
    ├── advanced.md
    └── edge-cases.md
```

## Documentation Standards

### Target Audience

Technical documentation is written for:

- **SDK developers**: Building the platform
- **Integration developers**: Integrating with the platform
- **Advanced users**: Understanding internals
- **Contributors**: Contributing to open-source packages

### Content Guidelines

1. **Be precise**: Use exact technical terminology
2. **Show implementation**: Include code samples from actual implementation
3. **Document edge cases**: Cover error conditions and boundaries
4. **Include diagrams**: Use architecture and sequence diagrams
5. **Reference specs**: Link to relevant specifications (JSON-LD, Schema.org, etc.)
6. **Explain tradeoffs**: Document design decisions and alternatives considered

### Code Examples

Technical documentation should include:

- **Implementation examples**: How it's built
- **Integration examples**: How to integrate
- **Performance examples**: Optimization techniques
- **Testing examples**: Test strategies and fixtures

```typescript
// Implementation detail example
class SemanticProxy {
  constructor(private context: ProxyContext) {}

  get(target: object, prop: string): any {
    // Implementation showing internal logic
    return new Proxy(
      {},
      {
        get: (_, nextProp) => this.buildPath(prop, nextProp),
      }
    )
  }

  private buildPath(subject: string, predicate: string): string {
    return `$.${subject}.${predicate}.Object`
  }
}
```

## Development

### Local Preview

```bash
cd docs/{topic}
mdcat README.md  # Preview in terminal
# or
npx serve .      # Serve as HTML
```

### Link Checking

```bash
pnpm check-links
```

### Diagram Generation

```bash
cd docs/{topic}
mmdc -i architecture.mmd -o architecture.png
```

## Adding New Documentation

1. **Create topic folder**: `mkdir docs/{topic}`
2. **Create README.md**: Overview and table of contents
3. **Add detailed docs**: Create specific documentation files
4. **Add diagrams**: Include architecture and sequence diagrams
5. **Add examples**: Create examples/ folder with code samples
6. **Link from main README**: Update this file with new topic
7. **Cross-link**: Link to related documentation

## Documentation Types

### Architecture Documents

Explain system design, components, and interactions:

```markdown
# Architecture

## Overview

{High-level system description}

## Components

### Component Name

{Component purpose and responsibilities}

## Data Flow

{How data moves through the system}

## Design Decisions

{Why certain choices were made}
```

### API Specifications

Complete API reference with all functions, parameters, and return types:

````markdown
# API Specification

## Functions

### functionName

**Purpose**: {What it does}

**Signature**:

```typescript
function functionName<T>(param1: Type1, param2: Type2): Promise<Result<T>>
```
````

**Type Parameters**:

- `T` - {Description}

**Parameters**:

- `param1` - {Detailed description}
- `param2` - {Detailed description}

**Returns**: {Detailed return description}

**Throws**:

- `Error1` - {When this error occurs}
- `Error2` - {When this error occurs}

**Example**:

```typescript
const result = await functionName(arg1, arg2)
```

**Implementation Notes**: {Internal details}

````

### Type Definitions

Complete type definitions with explanations:

```markdown
# Type Definitions

## Core Types

### TypeName

**Purpose**: {What this type represents}

**Definition**:
```typescript
interface TypeName {
  /** Property description */
  property1: Type1

  /** Property description */
  property2?: Type2

  /** Semantic identifier */
  $id?: string

  /** Semantic type */
  $type: string
}
````

**Properties**:

- `property1` - {Detailed property description}
- `property2` - {Detailed property description}

**Usage**:

```typescript
const example: TypeName = {
  property1: value1,
  property2: value2,
  $id: 'identifier',
  $type: 'TypeName',
}
```

**Related Types**: {Link to related types}

````

### Performance Documentation

Performance characteristics and optimization guides:

```markdown
# Performance

## Benchmarks

| Operation | Time | Memory | Notes |
|-----------|------|--------|-------|
| Operation1 | 1ms | 10KB | {Context} |
| Operation2 | 5ms | 50KB | {Context} |

## Optimization Strategies

### Strategy Name

{Description of optimization}

**Before**:
```typescript
// Slow code
````

**After**:

```typescript
// Fast code
```

**Impact**: {Performance improvement}

## Profiling

{How to profile this code}

````

### Security Documentation

Security model and best practices:

```markdown
# Security

## Threat Model

{What threats are considered}

## Security Features

### Feature Name

{How this feature protects the system}

## Best Practices

1. **Practice 1**: {Description}
2. **Practice 2**: {Description}

## Known Limitations

{Security limitations and mitigations}
````

## Difference: docs/ vs sites/

| Aspect       | `docs/` (Technical)           | `sites/` (User-Facing)      |
| ------------ | ----------------------------- | --------------------------- |
| **Audience** | Developers, contributors      | End users, beginners        |
| **Format**   | Markdown (.md)                | MDX (.mdx) with components  |
| **Content**  | Implementation details, specs | Tutorials, guides, examples |
| **Tone**     | Technical, precise            | Friendly, educational       |
| **Examples** | Internal code, edge cases     | User-facing examples        |
| **Purpose**  | Reference documentation       | Learning documentation      |

## License

MIT (Open Source)

All documentation in this folder is open-source and free to use, modify, and distribute.

---

Part of the [`.do` platform](https://github.com/dot-do/platform) open-source ecosystem.
