# `.do` Business-as-Code - AI & SDK

[![CI](https://github.com/dot-do/ai/actions/workflows/ci.yml/badge.svg)](https://github.com/dot-do/ai/actions/workflows/ci.yml)
[![Lint](https://github.com/dot-do/ai/actions/workflows/lint.yml/badge.svg)](https://github.com/dot-do/ai/actions/workflows/lint.yml)
[![Security](https://github.com/dot-do/ai/actions/workflows/security.yml/badge.svg)](https://github.com/dot-do/ai/actions/workflows/security.yml)
[![Publish](https://github.com/dot-do/ai/actions/workflows/publish.yml/badge.svg)](https://github.com/dot-do/ai/actions/workflows/publish.yml)

Open-source SDKs, packages, and tools for building autonomous Business-as-Code with semantic intent.

## Everything is a Semantic Function

The `.do` platform is built on a unifying principle: **everything is a semantic function**. Database operations, AI generation, event processing, workflows—all are functions with semantic meaning using `$.Subject.predicate.Object` patterns. The same function can be invoked through any protocol:

- **[sdk.do](packages/sdk.do/)** - TypeScript SDK for programmatic access
- **[cli.do](packages/cli.do/)** - Terminal commands for interactive use
- **[mcp.do](packages/mcp.do/)** - Model Context Protocol for AI assistants
- **REST API** - HTTP API for universal access

These protocols are just different interfaces to the same underlying semantic functions, creating a coherent, composable architecture for Business-as-Code.

## 🌟 Features

- **Semantic-First Architecture**: Express business logic using `$.Subject.predicate.Object` patterns
- **TypeScript SDK**: Type-safe access to 800+ Schema.org types, GS1 supply chain, and O\*NET occupations
- **Universal Protocols**: Same functions via SDK, CLI, MCP, or REST API
- **Event-Driven**: Listen and emit semantic events with `on` and `send`
- **AI-Native**: Generate content with semantic schemas and batch processing
- **MDX Database**: Query and manage MDX/Markdown files as a semantic database
- **Linked Data**: Connect content with `$id` and `$type` frontmatter
- **Tree-Shakeable**: All vocabulary packages are tree-shakeable for minimal bundle sizes

## Quick Start

### SDK.do - TypeScript SDK with Semantic `$` Proxy

```bash
pnpm install sdk.do
```

```typescript
import $, { ai, api, db, on, send, every, user } from 'sdk.do'

// Semantic event patterns using $.Subject.predicate.Object
on($.Order.created, async (order) => {
  await send($.Invoice.generate, { orderId: order.id })
})

// Semantic database queries
const businesses = await db.list($.Business)
const brands = await db.related(business, $.owns, $.Brand)

// AI with semantic types
const content = await ai.generate({
  prompt: 'Write a blog post about AI',
  schema: $.BlogPosting,
})

// Schedule with semantic context
every($.Daily, async () => {
  await send($.Report.generate, { type: 'daily' })
})
```

### CLI.do - Command Line Interface

```bash
pnpm install cli.do

# Use SDK functions from CLI
do db list Business
do ai generate "Write a haiku"
do send Order.created '{"id": "123"}'
```

### MCP.do - Model Context Protocol Server

```bash
pnpm install mcp.do

# Expose SDK as MCP server
mcp start

# Use the 'do' tool in Claude Desktop
# Securely executes TypeScript with access to sdk.do
```

## Packages

### .org.ai Semantic Data Packages

The platform includes 18+ semantic data packages providing structured, open-source knowledge:

#### Occupational Data (O*NET Database 30.0)

- **[onet.org.ai](packages/onet.org.ai/)** - Meta-package for all O*NET data (CC BY 4.0)
- **[soc.org.ai](packages/soc.org.ai/)** - 923 occupations with SOC codes
- **[tech.org.ai](packages/tech.org.ai/)** - 135 technologies (Python, JavaScript, React, TypeScript)
- **[tools.org.ai](packages/tools.org.ai/)** - Physical tools and equipment
- **[tasks.org.ai](packages/tasks.org.ai/)** - 19,000+ occupational task statements
- **[jobs.org.ai](packages/jobs.org.ai/)** - Job titles and alternate names

#### Business & Industry Data

- **[business.org.ai](packages/business.org.ai/)** - Universal business abstractions (enhanced GS1 CBV)
- **[process.org.ai](packages/process.org.ai/)** - Business processes (enhanced APQC)
- **[industries.org.ai](packages/industries.org.ai/)** - Industries with digital transformation analysis (enhanced NAICS)
- **[events.org.ai](packages/events.org.ai/)** - Business events using GS1 EPCIS 5W+H model

#### Organizational Data

- **[vc.org.ai](packages/vc.org.ai/)** - Crunchbase Open Data (companies, funding, investors)
- **[enterprises.org.ai](packages/enterprises.org.ai/)** - Large companies (Crunchbase + SEC EDGAR) [planned]
- **[startups.org.ai](packages/startups.org.ai/)** - AI startup patterns and abstractions
- **[wikipedia.org.ai](packages/wikipedia.org.ai/)** - Wikipedia canonical entity references

#### Platform & Content

- **[services.org.ai](packages/services.org.ai/)** - Services-as-Software abstractions
- **[markdown.org.ai](packages/markdown.org.ai/)** - Markdown ecosystem types

#### Source Data Packages

- **[naics.org.ai](packages/naics.org.ai/)** - NAICS industry classification codes
- **[gs1.org.ai](packages/gs1.org.ai/)** - GS1 standards and EPCIS
- **[apqc.org.ai](packages/apqc.org.ai/)** - APQC Process Classification Framework

**Key Features**:
- All packages use `$.Subject.predicate.Object` semantic patterns
- MDXLD files (CC-BY-4.0) in `ai/things/{package}.org.ai/`
- TypeScript types and import scripts in `ai/packages/{package}.org.ai/`
- Tree-shakeable exports for optimal bundle sizes

### Semantic Graph & Types

**[graphdl](packages/graphdl/)** - Semantic graph types with `$.Subject.predicate.Object` patterns

```typescript
import $ from 'graphdl'
import { graph, node, edge, createTriple } from 'graphdl'

// Create semantic paths
const path = $.Person.worksFor.Organization
console.log(String(path)) // "$.Person.worksFor.Organization"

// Build knowledge graphs
const myGraph = graph()
  .context('https://schema.org')
  .node(node('john', 'Person', { name: 'John Doe' }))
  .node(node('acme', 'Organization', { name: 'Acme Corp' }))
  .edge(edge('john', 'worksFor', 'acme'))
  .build()

// Create triples
const triple = createTriple('Person:john', 'worksFor', 'Organization:acme', {
  context: 'https://schema.org',
})
```

**[mdxld](packages/mdxld/)** - Linked data in MDX with `$id` and `$type` frontmatter

```mdx
---
$id: https://example.com/person/john
$type: Person
name: John Doe
jobTitle: Software Engineer
worksFor:
  $type: Organization
  $id: https://example.com/org/acme
  name: Acme Corp
---

# About John

John is a software engineer at Acme Corp.
```

### Schema.org Vocabularies

**[schema.org.ai](packages/schema.org.ai/)** - TypeScript types for all 800+ Schema.org types

```typescript
import type { Organization, Person, BlogPosting } from 'schema.org.ai'

const business: Organization = {
  $type: 'Organization',
  $id: 'acme-corp',
  name: 'Acme Corp',
  employee: [
    {
      $type: 'Person',
      $id: 'john-doe',
      name: 'John Doe',
    },
  ],
}
```

**[gs1.org.ai](packages/gs1.org.ai/)** - GS1 supply chain vocabulary (EPCIS, CBV)

```typescript
import type { ObjectEvent, Trade Item, Party } from 'gs1.org.ai'

// Supply chain semantic paths
$.Shipment.inTransit.Warehouse
$.Product.receiving.DistributionCenter
$.TradeItem.locatedAt.Location
```

**[soc.org.ai](packages/soc.org.ai/)** - O\*NET occupation types (45+ collections)

```typescript
import type { Occupation, Skill, Ability } from 'soc.org.ai'

// Occupation semantic paths
$.Person.hasOccupation.Occupation
$.Occupation.requiresSkill.Programming
$.SoftwareDeveloper.requiresAbility.CriticalThinking
```

### Edge & API Tools

**[edge-api](packages/edge-api/)** - Edge API utilities for Cloudflare Workers

**[buildercss](packages/buildercss/)** - CSS-in-JS for builder interfaces

## SDK.do API

### `$` - Semantic Context Proxy

The `$` proxy creates semantic paths using the `$.Subject.predicate.Object` pattern:

```typescript
import $ from 'sdk.do'

// Create semantic paths
$.Person.worksFor.Organization
$.Order.created.Customer
$.Invoice.paid.StripeCustomer
$.Business.owns.Brand

// Use in events
on($.Order.created, handler)
send($.Invoice.paid, data)

// Use in database queries
await db.list($.Business)
await db.get($.Person, 'john-doe')

// Access with brackets for dynamic keys
$.Person['john-doe'].worksFor.Organization['acme']
```

### `ai` - AI Services

```typescript
import { ai } from 'sdk.do'

// Generate text
const text = await ai.generate({
  prompt: 'Write a haiku about code',
  model: 'claude-3-5-sonnet',
})

// Generate with schema
const content = await ai.generate({
  prompt: 'Create a blog post',
  schema: $.BlogPosting,
})

// Create embeddings
const embeddings = await ai.embed('Hello world')

// Batch processing
const results = await ai.batch([{ prompt: 'Prompt 1' }, { prompt: 'Prompt 2' }])
```

### `db` - Semantic Database

```typescript
import { db } from 'sdk.do'

// List by semantic type
const businesses = await db.list($.Business)
const people = await db.list($.Person, {
  where: { jobTitle: 'Engineer' },
})

// Get by semantic type and ID
const business = await db.get($.Business, 'acme-corp')
const person = await db.get($.Person, 'john-doe')

// Create with semantic type
await db.create($.Blog, {
  $id: 'engineering-blog',
  $type: $.Blog,
  name: 'Engineering Blog',
  publisher: $.Brand['acme'],
})

// Update
await db.update($.Person, 'john-doe', {
  jobTitle: 'Senior Engineer',
})

// Delete
await db.delete($.Person, 'john-doe')

// Query relationships
const brands = await db.related(business, $.owns, $.Brand)
const employees = await db.related(business, $.employs, $.Person)

// Create relationships
await db.relate(business, $.owns, brand)
await db.relate(person, $.worksFor, organization)
```

### `on` - Event Listeners

```typescript
import { on } from 'sdk.do'

// Listen for semantic events
on($.Order.created, async (order) => {
  console.log('Order created:', order)
  await processOrder(order)
})

on($.Invoice.paid, async (invoice) => {
  console.log('Invoice paid:', invoice)
  await fulfillOrder(invoice.orderId)
})

// Pattern matching
on($.*.created, async (entity) => {
  console.log('Entity created:', entity.$type, entity.$id)
})

// Multiple event types
on([$.Order.created, $.Order.updated], async (order) => {
  await updateInventory(order)
})
```

### `send` - Event Publishing

```typescript
import { send } from 'sdk.do'

// Send semantic events
await send($.Order.created, {
  $type: $.Order,
  $id: 'order-123',
  customer: 'customer-456',
  total: 99.99,
})

await send($.Invoice.paid, {
  $type: $.Invoice,
  $id: 'invoice-789',
  orderId: 'order-123',
  amount: 99.99,
})

// Broadcast to multiple listeners
await send($.Customer.registered, {
  $type: $.Person,
  $id: 'customer-456',
  email: 'customer@example.com',
})
```

### `every` - Scheduled Workflows

```typescript
import { every } from 'sdk.do'

// Run on schedule
every($.Daily, async () => {
  await send($.Report.generate, { type: 'daily' })
})

every($.Hourly, async () => {
  await send($.Metrics.collect, { interval: 'hourly' })
})

every($.Weekly, async () => {
  await send($.Newsletter.send, { day: 'monday' })
})

// Custom cron expressions
every('0 0 * * *', async () => {
  await send($.Backup.create, { type: 'full' })
})
```

### `api` - External Integrations

```typescript
import { api } from 'sdk.do'

// Access external APIs with semantic context
const customer = await api.stripe.customers.create({
  email: 'customer@example.com',
  metadata: {
    $type: $.Person,
    $id: 'customer-123',
  },
})

// Call any API
const data = await api.fetch('https://api.example.com/data', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' }),
})
```

### `user` - User Context

```typescript
import { user } from 'sdk.do'

// Get current user
const currentUser = await user.current()

// Get session
const session = await user.session()

// Check permissions
const canEdit = await user.can('edit', $.Blog)
const canDelete = await user.can('delete', $.Blog, 'blog-123')

// Get user data
const userId = user.id
const userEmail = user.email
const userRoles = user.roles
```

## Semantic Patterns

### Business Relationships

```typescript
// Organization relationships
$.Organization.owns.Brand
$.Organization.employs.Person
$.Organization.provides.Service
$.Organization.locatedIn.Place

// Person relationships
$.Person.worksFor.Organization
$.Person.hasOccupation.Occupation
$.Person.knows.Person
$.Person.owns.Property

// Product relationships
$.Product.manufacturer.Organization
$.Product.brand.Brand
$.Product.category.Category
$.Product.soldBy.Seller
```

### Event Patterns

```typescript
// Lifecycle events
$.Entity.created
$.Entity.updated
$.Entity.deleted
$.Entity.archived

// Business events
$.Order.created
$.Order.confirmed
$.Order.shipped
$.Order.delivered
$.Order.cancelled

// Payment events
$.Invoice.generated
$.Invoice.sent
$.Invoice.paid
$.Invoice.overdue

// User events
$.User.registered
$.User.authenticated
$.User.verified
$.User.deactivated
```

### Workflow Patterns

```typescript
// Sequential workflow
on($.Order.created, async (order) => {
  await send($.Order.confirm, order)
})

on($.Order.confirmed, async (order) => {
  await send($.Inventory.reserve, order)
})

on($.Inventory.reserved, async (reservation) => {
  await send($.Shipment.create, reservation)
})

// Parallel workflow
on($.Customer.registered, async (customer) => {
  await Promise.all([send($.Email.welcome, customer), send($.Stripe.Customer.create, customer), send($.Analytics.track, { event: 'registration', customer })])
})

// Conditional workflow
on($.Order.created, async (order) => {
  if (order.total > 100) {
    await send($.Discount.apply, { order, discount: 0.1 })
  }
  await send($.Order.process, order)
})
```

## Architecture

The `.do` AI & SDK packages follow a semantic-first architecture:

```
ai/
├── packages/
│   ├── sdk.do/          # Core SDK with $ proxy
│   ├── cli.do/          # CLI interface
│   ├── mcp.do/          # MCP server
│   ├── graphdl/         # Semantic graphs
│   ├── mdxld/           # Linked data in MDX
│   ├── schema.org.ai/   # Schema.org types
│   ├── gs1.org.ai/      # GS1 supply chain
│   ├── soc.org.ai/      # O*NET occupations
│   ├── edge-api/        # Edge utilities
│   └── buildercss/      # CSS-in-JS
└── sdk/                 # SDK documentation
```

## Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/dot-do/ai.git
cd ai

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm typecheck

# Lint code
pnpm lint
pnpm lint:fix

# Format code
pnpm format
```

### Package Development

```bash
# Navigate to specific package
cd packages/sdk.do

# Build package
pnpm build

# Run tests
pnpm test

# Link for local development
pnpm link --global
```

### Creating a New Package

```bash
# Copy template
cp -r packages/.template packages/my-package

# Update package.json name and description
# Implement package in src/
# Add tests in test/
```

## Contributing

We welcome contributions! Here's how to get started:

### How to Contribute

1. **Fork the repository** on GitHub
2. **Clone your fork**: `git clone https://github.com/YOUR-USERNAME/ai.git`
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Make your changes** and add tests
5. **Run tests**: `pnpm test`
6. **Format code**: `pnpm format`
7. **Commit changes**: `git commit -m "feat: add your feature"`
8. **Push to your fork**: `git push origin feature/your-feature-name`
9. **Open a Pull Request** on GitHub

### Contribution Guidelines

- **Start with an issue**: Open an issue to discuss your proposed change before implementing
- **Write tests**: All new features and bug fixes should include tests
- **Follow conventions**: Use the existing code style (single quotes, 2 spaces, no semicolons)
- **Document changes**: Update README and add JSDoc comments
- **Keep PRs focused**: One feature or fix per PR
- **Add changeset**: Run `pnpm changeset` to describe your changes

### Code Standards

- **TypeScript**: All packages use TypeScript
- **Testing**: Vitest for unit tests
- **Formatting**: Prettier (pre-commit hook enforces)
- **Linting**: ESLint with strict rules
- **Commits**: Conventional commits format (`feat:`, `fix:`, `docs:`, etc.)

### Areas We Need Help

- 📚 **Documentation**: Improve examples and guides
- 🧪 **Testing**: Add more test coverage
- 🐛 **Bug Fixes**: Fix reported issues
- ✨ **Features**: Implement new semantic patterns
- 🌍 **Translations**: Translate documentation
- 📦 **New Packages**: Create new vocabulary packages

## Documentation

### Package Documentation

- **[sdk.do](packages/sdk.do/)** - SDK documentation and examples
- **[cli.do](packages/cli.do/)** - CLI commands and usage
- **[mcp.do](packages/mcp.do/)** - MCP server setup
- **[graphdl](packages/graphdl/)** - Semantic graph patterns
- **[mdxld](packages/mdxld/)** - Linked data in MDX
- **[schema.org.ai](packages/schema.org.ai/)** - Schema.org types
- **[gs1.org.ai](packages/gs1.org.ai/)** - GS1 supply chain vocabulary
- **[soc.org.ai](packages/soc.org.ai/)** - O\*NET occupation data

### Additional Resources

- **[Platform Documentation](https://github.com/dot-do/platform)** - Full platform architecture
- **[Examples](examples/)** - Example applications and use cases
- **[API Reference](https://docs.do)** - Complete API documentation
- **[Blog](https://blog.do)** - Articles and tutorials

## Community

### Get Help

- **[GitHub Issues](https://github.com/dot-do/ai/issues)** - Report bugs or request features
- **[GitHub Discussions](https://github.com/dot-do/ai/discussions)** - Ask questions and share ideas
- **[Discord Community](https://discord.gg/dotdo)** - Chat with the community (coming soon)
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/dotdo)** - Ask technical questions

### Stay Updated

- **[GitHub Releases](https://github.com/dot-do/ai/releases)** - Release notes and changelogs
- **[Twitter/X](https://x.com/dotdo_ai)** - Product updates and announcements
- **[Blog](https://blog.do)** - Technical articles and case studies
- **[Newsletter](https://do.inc/newsletter)** - Monthly updates and highlights

### Contributing

We follow a community-driven development model:

- **Open Issues**: Start discussions before implementing major changes
- **Code Reviews**: All PRs receive thorough review and feedback
- **Semantic Versioning**: We follow semver for all releases
- **Transparent Roadmap**: See our [project board](https://github.com/orgs/dot-do/projects) for upcoming features

## Related Projects

- **[`.do` Platform](https://github.com/dot-do/platform)** - Full Business-as-Code platform
- **[mdx](https://github.com/dot-do/mdx)** - MDX primitives and utilities
- **[Business-as-Code](https://business-as-code.org)** - Business-as-Code concepts
- **[Services-as-Software](https://services-as-software.org)** - Services-as-Software framework

## License

MIT License - see [LICENSE](LICENSE) for details

**Open Source**: This project is open source and available to everyone. We believe in transparent development and community-driven innovation.

## Acknowledgments

Built with ❤️ by the `.do` team and [contributors](https://github.com/dot-do/ai/graphs/contributors).

Special thanks to:

- [Schema.org](https://schema.org) for the semantic vocabulary
- [GS1](https://www.gs1.org) for supply chain standards
- [O\*NET](https://www.onetonline.org) for occupation data
- The open source community for inspiration and support

---

**Part of the [`.do` platform](https://github.com/dot-do/platform)** | **[Website](https://do.inc)** | **[Documentation](https://docs.do)**
