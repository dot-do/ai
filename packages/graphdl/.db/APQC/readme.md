# APQC Process Classification Framework (PCF)

The APQC Process Classification Framework (PCF) is a taxonomy of business processes that allows organizations to objectively track and compare their performance internally and externally with organizations from any industry.

## Data Schema

Each APQC process is stored as an MDX file with the following frontmatter schema:

```yaml
$id: apqc:{id} # Semantic identifier (e.g., apqc:1.0)
$type: BusinessProcess # Schema.org type
id: string # Process ID (e.g., "1.0")
code: string # Process code (same as id)
title: string # Process title
description: string # Process description
category: string # Category (Operating/Management & Support)
parent: string | null # Parent process ID
children: string[] # Array of child process IDs
level: number # Process hierarchy level (1-5)
```

## Process Hierarchy

### Operating Processes (1.0-6.0)

1. **Develop Vision and Strategy** (1.0)
2. **Develop and Manage Products and Services** (2.0)
3. **Market and Sell Products and Services** (3.0)
4. **Deliver Physical Products** (4.0)
5. **Deliver Services** (5.0)
6. **Manage Customer Service** (6.0)

### Management and Support Processes (7.0-13.0)

7. **Develop and Manage Human Capital** (7.0)
8. **Manage Information Technology** (8.0)
9. **Manage Financial Resources** (9.0)
10. **Acquire, Construct and Manage Assets** (10.0)
11. **Manage Enterprise Risk, Compliance and Governance** (11.0)
12. **Manage External Relationships** (12.0)
13. **Develop and Manage Business Capabilities** (13.0)

## Current Coverage

- **Level 1 (Categories)**: 13 records
- **Level 2-5**: Available for expansion via APQC membership

## File Naming Convention

Files are named using the process ID with `.mdx` extension:

- `1-0.mdx` - Develop Vision and Strategy
- `7-0.mdx` - Develop and Manage Human Capital
- `13-0.mdx` - Develop and Manage Business Capabilities

## Usage Examples

### Import in TypeScript

```typescript
import { db } from 'sdk.do'

// List all APQC processes
const processes = await db.list('APQC')

// Get specific process
const strategy = await db.get('APQC', '1-0')

// Find by category
const operating = await db.search('APQC', { category: 'Operating Processes' })
```

### Semantic Queries

```typescript
// Using semantic identifiers
const process = await db.get('apqc:1.0')

// Create workflow relationships
await db.relate('apqc:1.0', 'feeds', 'apqc:2.0')
await db.relate('apqc:3.0', 'depends_on', 'apqc:2.0')
```

## Integration with Business-as-Code

APQC processes map directly to Business-as-Code workflows:

```typescript
import { $, every, on, send } from 'sdk.do'

// Process 3.1: Understand markets, customers, and capabilities
on($.Customer.created, async (customer) => {
  // Analyze customer data
  const analysis = await $.ai.generate({
    prompt: 'Analyze customer segment and needs',
    context: customer,
  })

  // Send to next process
  await send($.Market.analyzed, { customer, analysis })
})

// Process 3.2: Develop marketing strategy
on($.Market.analyzed, async (data) => {
  // Generate marketing strategy
  const strategy = await $.ai.generate({
    prompt: 'Create targeted marketing strategy',
    context: data,
  })

  await $.db.create('MarketingStrategy', strategy)
})
```

## Data Source

- **Official Site**: https://www.apqc.org/
- **PCF**: https://www.apqc.org/process-frameworks
- **License**: APQC membership required for full framework
- **This Dataset**: Top-level categories (publicly available)

## Related Frameworks

- **ITIL**: IT service management processes
- **COBIT**: IT governance and management
- **SCOR**: Supply chain operations
- **TOGAF**: Enterprise architecture

## License

APQC Process Classification Framework is copyrighted by APQC. This dataset contains only the publicly available top-level process categories. Full framework access requires APQC membership.
