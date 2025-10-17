# NAICS - North American Industry Classification System

The North American Industry Classification System (NAICS) is the standard used by Federal statistical agencies in classifying business establishments for the purpose of collecting, analyzing, and publishing statistical data related to the U.S. business economy.

## Data Schema

Each NAICS classification is stored as an MDX file with the following frontmatter schema:

```yaml
$id: naics:{code} # Semantic identifier (e.g., naics:51)
$type: IndustryClassification # Schema.org type
code: string # NAICS code (e.g., "51", "31-33")
title: string # Industry title
description: string # Industry description
parent: string | null # Parent code (null for top-level sectors)
children: string[] # Array of child codes
level: number # Classification level (1-5)
```

## Classification Levels

1. **Sector** (2-digit): 20 broad sectors (e.g., "51" Information)
2. **Subsector** (3-digit): More detailed industry groups (e.g., "511" Publishing Industries)
3. **Industry Group** (4-digit): Specific industry groupings (e.g., "5111" Newspaper Publishers)
4. **NAICS Industry** (5-digit): National industry level (e.g., "51111" Newspaper Publishers)
5. **National Industry** (6-digit): Most detailed U.S. specific industries (e.g., "511110" Newspaper Publishers)

## Current Coverage

- **Level 1 (Sectors)**: 20 records
- **Level 2-5**: Available for expansion via Census API

## File Naming Convention

Files are named using the NAICS code with `.mdx` extension:

- `11.mdx` - Agriculture, Forestry, Fishing and Hunting
- `51.mdx` - Information
- `31-33.mdx` - Manufacturing

## Usage Examples

### Import in TypeScript

```typescript
import { db } from 'sdk.do'

// List all NAICS codes
const codes = await db.list('NAICS')

// Get specific industry
const info = await db.get('NAICS', '51')

// Search by description
const results = await db.search('NAICS', { description: 'information' })
```

### Semantic Queries

```typescript
// Using semantic identifiers
const industry = await db.get('naics:51')

// Create relationship
await db.relate('naics:51', 'includes', 'naics:511')
```

## Data Source

- **Official Site**: https://www.census.gov/naics/
- **API**: https://api.census.gov/data
- **Last Updated**: 2022 NAICS Codes
- **Update Frequency**: Every 5 years

## Related Standards

- **SIC (Standard Industrial Classification)**: Predecessor to NAICS
- **ISIC (International Standard Industrial Classification)**: UN classification system
- **NACE (Statistical Classification of Economic Activities)**: European equivalent

## License

NAICS codes are published by the U.S. Census Bureau and are in the public domain.
