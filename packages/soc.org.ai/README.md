# soc.org.ai

O\*NET/SOC (Standard Occupational Classification) types and data with tree-shakeable exports.

## Installation

```bash
pnpm add soc.org.ai
```

## Usage

```typescript
// Import occupation data
import { getOccupation, getOccupationsByTitle } from 'soc.org.ai'

// Get a specific occupation by O*NET code
const softwareDev = getOccupation('15-1252.00')
console.log(softwareDev?.title) // Software Developers

// Search by title
const nurses = getOccupationsByTitle('nurse')

// Import types
import type { Occupation, OccupationDetail, Skill, Ability } from 'soc.org.ai'

// Import specific data modules (tree-shakeable)
import { getSkill } from 'soc.org.ai/skills'
import { getAbility } from 'soc.org.ai/abilities'
import { getKnowledge } from 'soc.org.ai/knowledge'
```

## Tree-Shaking

This package is designed to be tree-shakeable, allowing you to import only the data you need:

```typescript
// Only imports occupation data and functions
import { getOccupation } from 'soc.org.ai/occupations'

// Only imports skill data
import { getSkill, getAllSkills } from 'soc.org.ai/skills'

// Import only types (compile-time, zero runtime cost)
import type { Occupation, Skill } from 'soc.org.ai/types'
```

## Data Categories

### Occupations

- **O\*NET Codes**: Standardized occupation codes (e.g., `15-1252.00`)
- **Titles**: Official occupation titles
- **Descriptions**: Detailed occupation descriptions
- **Alternative Titles**: Common alternative job titles
- **Tasks**: Key tasks performed in the occupation

### Abilities

Physical and cognitive abilities required for occupations.

### Skills

Developed capacities that facilitate learning or performance.

### Knowledge

Organized sets of principles and facts applying to general domains.

### Work Activities

Types of job behaviors occurring on multiple jobs.

### Work Context

Physical and social factors that influence the work environment.

## API

### Occupations

```typescript
getOccupation(onetCode: string): Occupation | undefined
getAllOccupations(): Occupation[]
getOccupationsByTitle(title: string): Occupation[]
getOccupationsByJobZone(jobZone: number): Occupation[]
getOccupationsByCodePrefix(prefix: string): Occupation[]
```

### Abilities

```typescript
getAbility(elementId: string): Ability | undefined
getAllAbilities(): Ability[]
```

### Skills

```typescript
getSkill(elementId: string): Skill | undefined
getAllSkills(): Skill[]
```

### Knowledge

```typescript
getKnowledge(elementId: string): Knowledge | undefined
getAllKnowledge(): Knowledge[]
```

## Data Import

To update the O\*NET data:

```bash
pnpm import
```

This will fetch the latest O\*NET data and generate the type definitions and data exports.

## License

MIT

## Data Source

O\*NET data is provided by the U.S. Department of Labor, Employment and Training Administration.
https://www.onetcenter.org/
