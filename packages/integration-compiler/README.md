# @dotdo/integration-compiler

Compile MDXLD Integration definitions into TypeScript code.

## Overview

The Integration Compiler transforms declarative MDXLD Integration definitions (MDX files with YAML frontmatter) into production-ready TypeScript integration clients. This enables developers to define Integrations once and automatically generate:

- TypeScript client classes with full type safety
- Error handling with custom error classes
- Webhook verification and event routing
- Comprehensive E2E tests
- Complete documentation

## Features

- **Type-Safe Clients**: Generate fully typed TypeScript clients from Integration definitions
- **Error Handling**: Automatic error mapping and classification
- **Webhook Support**: Signature verification, event parsing, and routing
- **Test Generation**: Auto-generate E2E tests with cleanup logic
- **Documentation**: Generate README with examples and API reference
- **Validation**: Runtime validation of Integration schemas with Zod
- **Formatting**: Auto-format generated code with Prettier

## Installation

```bash
pnpm add @dotdo/integration-compiler
```

## CLI Usage

### Compile Single Integration

```bash
integration-compiler compile integrations/stripe.mdx --output src/integrations/stripe
```

### Compile All Integrations

```bash
integration-compiler compile-all integrations/ --output src/integrations/
```

### Validate Integration

```bash
integration-compiler validate integrations/stripe.mdx
```

## Programmatic Usage

```typescript
import { IntegrationCompiler } from '@dotdo/integration-compiler'

const compiler = new IntegrationCompiler()

// Compile single Integration
const result = await compiler.compile('integrations/stripe.mdx', 'src/integrations/stripe')

console.log(`Generated ${result.filesGenerated.length} files`)
console.log(`Total LOC: ${result.linesOfCode}`)

// Compile all Integrations
const results = await compiler.compileAll('integrations/', 'src/integrations/')

// Print report
IntegrationCompiler.printReport(results)
```

## Integration Definition

Define Integrations in MDX files with YAML frontmatter:

```mdx
---
$id: https://integrations.do/stripe
$type: Integration
name: Stripe
service: Stripe
category: payments
description: Payment processing and subscription management
baseUrl: https://api.stripe.com/v1
sdkPackage: stripe

auth:
  type: api-key
  location: header
  headerName: Authorization
  scheme: Bearer

resources:
  - name: Customer
    endpoint: /customers
    operations:
      - type: create
        method: POST
        path: /customers
        params:
          - name: email
            type: string
            required: true
          - name: name
            type: string

      - type: list
        method: GET
        path: /customers
        pagination:
          type: cursor
          limitParam: limit
          cursorParam: starting_after

webhooks:
  enabled: true
  signatureHeader: Stripe-Signature
  signatureAlgorithm: sha256
  events:
    - name: customer_created
      type: customer.created
      description: Triggered when a customer is created

tests:
  enabled: true
  cleanup: true
  scenarios:
    - name: Customer Lifecycle
      steps:
        - action: create
          resource: Customer
          params:
            email: test@example.com
---

# Stripe Integration

Documentation content goes here...
```

## Generated Files

For each Integration, the compiler generates:

- **types.ts** - TypeScript interfaces and types
- **client.ts** - Main client class
- **errors.ts** - Custom error class with error mapping
- **webhooks.ts** - Webhook handler and event router (if enabled)
- **index.ts** - Barrel exports
- **README.md** - Complete documentation
- **{service}.test.ts** - E2E tests (if enabled)

## Architecture

### Parsing Layer

- **MDXParser**: Parse MDX files and extract frontmatter
- **FrontmatterParser**: Extract and validate Integration definitions

### Validation Layer

- **Zod Schemas**: Runtime validation of Integration structure
- **Type Inference**: Full TypeScript type safety

### Generation Layer

- **TypesGenerator**: Generate TypeScript types
- **ClientGenerator**: Generate client class
- **ErrorsGenerator**: Generate error handling
- **WebhooksGenerator**: Generate webhook handling
- **IndexGenerator**: Generate barrel exports
- **ReadmeGenerator**: Generate documentation
- **TestsGenerator**: Generate E2E tests

### Compilation Layer

- **IntegrationCompiler**: Orchestrate parsing, generation, and writing
- **FileWriter**: Write files with Prettier formatting

## API Reference

### IntegrationCompiler

```typescript
class IntegrationCompiler {
  compile(mdxPath: string, outputDir: string): Promise<CompileResult>
  compileAll(integrationsDir: string, outputDir: string): Promise<CompileResult[]>
  validate(mdxPath: string): Promise<ValidationResult>
  getSummary(mdxPath: string): Promise<IntegrationSummary>
}
```

### Generators

All generators implement:

```typescript
interface Generator {
  generate(integration: Integration): string | null
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test
```

## License

MIT
