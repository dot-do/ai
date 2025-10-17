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

keywords: [quickstart, tutorial, first-app, hello-world]

learningResourceType: Tutorial
educationalLevel: Beginner
timeRequired: PT5M

about:
  $type: SoftwareApplication
  $id: https://sdk.do
  name: sdk.do
  applicationCategory: SDK

mentions:
  - $type: HowTo
    $id: https://sdk.do/wiki/getting-started/installation
    name: Installation Guide

isPartOf:
  $type: CollectionPage
  $id: https://sdk.do/wiki/getting-started
  name: Getting Started

step:
  - $type: HowToStep
    position: 1
    name: Install SDK
    text: Run pnpm add sdk.do to install the SDK
  - $type: HowToStep
    position: 2
    name: Create Your First Business
    text: Use db.create to create a semantic Business entity
  - $type: HowToStep
    position: 3
    name: Query with GraphDL
    text: Query your business data using semantic patterns

license:
  $type: CreativeWork
  name: MIT
  url: https://opensource.org/licenses/MIT

inLanguage: en-US
---

# Quick Start Guide

Build your first Business-as-Code application in 5 minutes.

## Prerequisites

Make sure you've completed the [[Installation Guide]] before starting.

## Step 1: Install SDK

```bash
pnpm add sdk.do
```

## Step 2: Create Your First Business

Create a new TypeScript file and import the SDK:

```typescript
import { $, db } from 'sdk.do'

// Create a business entity using semantic types
const business = await db.create($.Organization, {
  name: 'Acme Corp',
  email: 'hello@acme.com',
  description: 'Building the future with Business-as-Code',
})

console.log(`Created business: ${business.name}`)
```

## Step 3: Query with GraphDL

Query your business data using semantic patterns:

```typescript
// List all organizations
const orgs = await db.list($.Organization)

// Query with GraphDL patterns
const results = await db.query`
  $.Organization[name = "Acme Corp"]
    .name
    .email
    .description
`

console.log(results)
```

## What You've Learned

- ✅ How to install and import `sdk.do`
- ✅ How to create entities with semantic types (`$.Organization`)
- ✅ How to query data with GraphDL patterns
- ✅ The basics of Business-as-Code

## Next Steps

- [[Build Your First AI Agent]] - Create an autonomous AI agent
- [[Core Concepts]] - Understand semantic graphs and GraphDL
- [[SDK Reference]] - Explore the complete SDK API

## Related Concepts

Learn more about the foundational concepts:

- [[Semantic Graphs]] - Understanding `$.Subject.predicate.Object` patterns
- [[GraphDL]] - Graph query language
- [[Schema.org Types]] - Standard vocabularies for business entities
