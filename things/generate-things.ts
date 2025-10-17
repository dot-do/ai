/**
 * Generate all Thing MDX files for ai/things directory
 * This script creates the complete schema.org.ai ontology
 */
import { writeFileSync } from 'fs'
import { join } from 'path'
import schemaActions from '../../apps/platform.do/data/schema-actions.json'

const THINGS_DIR = __dirname

// Base types
const baseTypes = [
  {
    name: 'Thing',
    type: 'Noun',
    description: 'The most generic type of item',
    content: `The most generic type of item in the Schema.org vocabulary.

## Properties

All Schema.org types inherit from Thing and share these base properties:
- **name** - The name of the item
- **description** - A description of the item
- **url** - URL of the item
- **identifier** - The identifier property
- **sameAs** - URL of a reference Web page
- **alternateName** - An alias for the item

## Usage

\`\`\`typescript
import { $ } from 'sdk.do'

// Thing is the base type for all entities
const thing = await db.create($.Thing, {
  name: 'My Item',
  description: 'A generic thing'
})
\`\`\`

## Inheritance

All other types in Schema.org inherit from Thing, including:
- Person, Organization, Place
- Event, Product, CreativeWork
- And 800+ more types`,
  },
  {
    name: 'Noun',
    type: 'Noun',
    description: 'An entity or concept type',
    content: `Base type for all entity and concept types in the semantic system.

## Purpose

Nouns represent **things** in the world - entities, concepts, and types. They are the subjects and objects in semantic relationships.

## Examples

- **Person** - A person (alive, dead, undead, or fictional)
- **Organization** - A school, NGO, corporation, club, etc.
- **Place** - Entities with physical location
- **Product** - Offered products or services

## Usage

\`\`\`typescript
import { $ } from 'sdk.do'

// Create a new noun type
const customType = {
  $type: $.Noun,
  $id: 'https://example.org/CustomType',
  name: 'CustomType',
  description: 'A custom entity type'
}
\`\`\`

## vs. Verbs

- **Nouns** are things (subjects and objects)
- **Verbs** are relationships and actions (predicates)`,
  },
  {
    name: 'Verb',
    type: 'Verb',
    description: 'A relationship or action type',
    content: `Base type for all relationship and action types in the semantic system.

## Purpose

Verbs represent **relationships** between things - actions, properties, and connections. They are the predicates in semantic triples.

## Verb Forms

Action verbs have multiple conjugated forms:
- **Base** - achieve
- **Third person** - achieves
- **Past tense** - achieved
- **Object noun** - achievement
- **Opposite** - fail
- **Inverse** - achievedBy (for reverse/passive queries)

## Examples

### Action Verbs
- **achieve** - Accomplish something
- **create** - Deliberately produce something
- **buy** - Give money for goods/services

### Property Verbs
- **name** - The name of something
- **description** - A description
- **location** - Where something is located

## Usage

\`\`\`typescript
import { $ } from 'sdk.do'

// Use a verb to create a relationship
await db.relate(user, $.achieve, goal)

// Query using inverse (passive form)
const achievers = await db.related(goal, $.achievedBy, $.Person)
\`\`\`

## vs. Nouns

- **Nouns** are things (subjects and objects)
- **Verbs** are relationships and actions (predicates)`,
  },
]

// Schema.org core types
const coreTypes = [
  { name: 'Person', description: 'A person (alive, dead, undead, or fictional)' },
  { name: 'Organization', description: 'An organization such as a school, NGO, corporation, club, etc.' },
  { name: 'Place', description: 'Entities that have a physical location' },
  { name: 'Event', description: 'An event happening at a certain time and location' },
  { name: 'Product', description: 'Any offered product or service' },
  { name: 'CreativeWork', description: 'Creative works like articles, books, movies, etc.' },
]

// Schema.org core properties (as verbs)
const coreProperties = [
  { name: 'name', description: 'The name of the item' },
  { name: 'description', description: 'A description of the item' },
  { name: 'url', description: 'URL of the item' },
  { name: 'identifier', description: 'The identifier property' },
  { name: 'sameAs', description: 'URL of a reference Web page' },
  { name: 'alternateName', description: 'An alias for the item' },
  { name: 'requires', description: 'A required dependency or prerequisite' },
  { name: 'uses', description: 'Uses or utilizes this resource' },
  { name: 'involves', description: 'Involves or includes this element' },
  { name: 'isPartOf', description: 'Indicates a larger entity this is part of' },
  { name: 'hasPart', description: 'Indicates an item that is part of this item' },
  { name: 'location', description: 'The location of the event, organization or action' },
  { name: 'about', description: 'The subject matter of the content' },
  { name: 'subjectOf', description: 'A CreativeWork or Event about this Thing' },
]

function generateMDX(thing: {
  name: string
  type: string
  description: string
  category?: string
  content?: string
  conjugation?: any
  schemaUrl?: string
}): string {
  const id = `https://schema.org.ai/${thing.name}`

  let frontMatter = `---
$type: ${thing.type}
$id: ${id}
$context: https://schema.org
name: ${thing.name}
description: ${thing.description}
status: public
license: MIT
source: schema.org
schemaVersion: '14.0'`

  if (thing.category) {
    frontMatter += `\ncategory: ${thing.category}`
  }

  if (thing.conjugation) {
    frontMatter += `\nconjugation:\n`
    Object.entries(thing.conjugation).forEach(([key, value]) => {
      frontMatter += `  ${key}: ${value}\n`
    })
  }

  frontMatter += '\n---'

  let content = thing.content || `# ${thing.name}\n\n${thing.description}`

  if (thing.schemaUrl) {
    content += `\n\n## Schema.org Reference\n\n[${thing.name}](${thing.schemaUrl}) in Schema.org vocabulary.`
  }

  // Only add Usage section if content doesn't already have one
  if (!content.includes('## Usage')) {
    content += `\n\n## Usage\n\n\`\`\`typescript\nimport { $ } from 'sdk.do'\n\n// Use this type in your code\nconst result = await db.query({\n  subject: $.${thing.name}\n})\n\`\`\`\n`
  }

  return `${frontMatter}\n\n${content}`
}

function main() {
  console.log('Generating ai/things/ MDX files...\n')

  let count = 0

  // Generate base types
  console.log('Generating base types...')
  for (const baseType of baseTypes) {
    // Use appropriate schema.org URL for each base type
    const schemaUrl = baseType.name === 'Verb' ? 'https://schema.org/Action' : 'https://schema.org/Thing'

    const mdx = generateMDX({
      name: baseType.name,
      type: baseType.type,
      description: baseType.description,
      category: 'Base Types',
      content: baseType.content,
      schemaUrl,
    })
    writeFileSync(join(THINGS_DIR, `${baseType.name}.mdx`), mdx)
    count++
  }
  console.log(`✓ Generated ${baseTypes.length} base types`)

  // Generate core types
  console.log('\nGenerating Schema.org core types...')
  for (const coreType of coreTypes) {
    const mdx = generateMDX({
      name: coreType.name,
      type: 'Noun',
      description: coreType.description,
      category: 'Core Types',
      schemaUrl: `https://schema.org/${coreType.name}`,
    })
    writeFileSync(join(THINGS_DIR, `${coreType.name}.mdx`), mdx)
    count++
  }
  console.log(`✓ Generated ${coreTypes.length} core types`)

  // Generate core properties
  console.log('\nGenerating Schema.org core properties...')
  for (const prop of coreProperties) {
    const mdx = generateMDX({
      name: prop.name,
      type: 'Verb',
      description: prop.description,
      category: 'Property',
      schemaUrl: `https://schema.org/${prop.name}`,
    })
    writeFileSync(join(THINGS_DIR, `${prop.name}.mdx`), mdx)
    count++
  }
  console.log(`✓ Generated ${coreProperties.length} properties`)

  // Generate action verbs with conjugations
  console.log('\nGenerating Schema.org Actions with conjugations...')
  let actionCount = 0
  for (const action of schemaActions) {
    const conjugation = {
      base: action.conjugated.base,
      thirdPerson: action.conjugated.thirdPerson,
      past: action.conjugated.past,
      objectNoun: action.objectNoun,
      opposite: action.opposite,
      inverse: action.inverse,
    }

    // Base form
    const baseMdx = generateMDX({
      name: action.conjugated.base,
      type: 'Verb',
      description: action.comment,
      category: 'Action',
      conjugation,
      schemaUrl: action.url,
    })
    writeFileSync(join(THINGS_DIR, `${action.conjugated.base}.mdx`), baseMdx)
    count++

    // Third person (if different)
    if (action.conjugated.thirdPerson !== action.conjugated.base) {
      const thirdPersonMdx = generateMDX({
        name: action.conjugated.thirdPerson,
        type: 'Verb',
        description: `Third person: ${action.comment}`,
        category: 'Action',
        conjugation,
        schemaUrl: action.url,
      })
      writeFileSync(join(THINGS_DIR, `${action.conjugated.thirdPerson}.mdx`), thirdPersonMdx)
      count++
    }

    // Past tense (if different)
    if (action.conjugated.past !== action.conjugated.base) {
      const pastMdx = generateMDX({
        name: action.conjugated.past,
        type: 'Verb',
        description: `Past tense: ${action.comment}`,
        category: 'Action',
        conjugation,
        schemaUrl: action.url,
      })
      writeFileSync(join(THINGS_DIR, `${action.conjugated.past}.mdx`), pastMdx)
      count++
    }

    // Object noun
    const objectNounMdx = generateMDX({
      name: action.objectNoun,
      type: 'Noun',
      description: `Result of ${action.conjugated.base}`,
      category: 'Action Result',
      schemaUrl: action.url,
    })
    writeFileSync(join(THINGS_DIR, `${action.objectNoun}.mdx`), objectNounMdx)
    count++

    // Opposite verb
    const oppositeMdx = generateMDX({
      name: action.opposite,
      type: 'Verb',
      description: `Opposite of ${action.conjugated.base}`,
      category: 'Action',
      schemaUrl: action.url,
    })
    writeFileSync(join(THINGS_DIR, `${action.opposite}.mdx`), oppositeMdx)
    count++

    // Inverse/passive verb
    const inverseMdx = generateMDX({
      name: action.inverse,
      type: 'Verb',
      description: `Inverse of ${action.conjugated.base} (passive/reverse relationship)`,
      category: 'Action',
      schemaUrl: action.url,
    })
    writeFileSync(join(THINGS_DIR, `${action.inverse}.mdx`), inverseMdx)
    count++

    actionCount++
    if (actionCount % 10 === 0) {
      console.log(`  Progress: ${actionCount}/${schemaActions.length} actions`)
    }
  }
  console.log(`✓ Generated ${schemaActions.length} actions × 6 forms = ${schemaActions.length * 6} verb files`)

  console.log(`\n✅ Total: ${count} MDX files generated`)
  console.log(`\nBreakdown:`)
  console.log(`  - ${baseTypes.length} base types`)
  console.log(`  - ${coreTypes.length} core types`)
  console.log(`  - ${coreProperties.length} properties`)
  console.log(`  - ${schemaActions.length * 6} action verbs (${schemaActions.length} actions × 6 forms)`)
}

main()
