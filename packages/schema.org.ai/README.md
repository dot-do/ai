# schema.org.ai

Schema.org types and data with tree-shakeable exports.

## Installation

```bash
pnpm add schema.org.ai
```

## Usage

```typescript
// Import specific types (tree-shakeable)
import { getType, getProperty } from 'schema.org.ai'

// Get a specific type
const personType = getType('Person')
console.log(personType)

// Get a specific property
const nameProperty = getProperty('name')
console.log(nameProperty)

// Import type definitions
import type { Thing, Person, Organization } from 'schema.org.ai/types'

// Use in your code (note: uses $ prefix)
const person: Thing = {
  $type: 'Person',
  $id: 'https://example.com/person/john',
  name: 'John Doe',
  description: 'Software engineer',
}
```

## Tree-Shaking

This package is designed to be tree-shakeable, allowing you to import only the types and data you need:

```typescript
// Only imports the getType function and Person type data
import { getType } from 'schema.org.ai'
const person = getType('Person')

// Import type definitions separately
import type { Person } from 'schema.org.ai/types'
```

## Data Import

To update the Schema.org data:

```bash
pnpm import
```

This will fetch the latest Schema.org data and generate the type definitions and data exports.

## API

### Types

- `getType(name: string): Type | undefined` - Get a specific type by name
- `getAllTypes(): Type[]` - Get all types
- `getTypesBySubType(subType: string): Type[]` - Get types that inherit from a specific type

### Properties

- `getProperty(name: string): Property | undefined` - Get a specific property by name
- `getAllProperties(): Property[]` - Get all properties
- `getPropertiesByDomain(domain: string): Property[]` - Get properties for a specific domain
- `getPropertiesByRange(range: string): Property[]` - Get properties with a specific range

## License

MIT
