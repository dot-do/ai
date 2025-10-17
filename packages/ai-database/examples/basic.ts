/**
 * Basic example - CRUD operations with semantic entities
 */

import { db } from '../src/index.js'

async function main() {
  console.log('=== ai-database Basic Example ===\n')

  // 1. Create entities
  console.log('1. Creating entities...')

  const person = await db.create({
    type: 'Person',
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      jobTitle: 'Software Engineer',
    },
  })
  console.log('Created person:', db.formatThing(person))

  const organization = await db.create({
    type: 'Organization',
    data: {
      name: 'Acme Corp',
      url: 'https://acme.com',
    },
  })
  console.log('Created organization:', db.formatThing(organization))
  console.log()

  // 2. Create relationship
  console.log('2. Creating relationship...')
  const triple = await db.relate(person, 'worksFor', organization)
  console.log('Created triple:', `${db.formatThing(triple.subject)} → ${triple.predicate} → ${db.formatThing(triple.object)}`)
  console.log()

  // 3. Query entities
  console.log('3. Querying entities...')

  const retrievedPerson = await db.get(db.extractId(person))
  if (retrievedPerson) {
    console.log('Found person:', retrievedPerson.name)
  }

  const people = await db.list('Person')
  console.log('Total people:', people.total)
  console.log()

  // 4. Query relationships
  console.log('4. Querying relationships...')

  const relationships = await db.getRelationships({
    subject: person,
    predicate: 'worksFor',
  })
  console.log('Relationships found:', relationships.total)

  if (relationships.total > 0) {
    const rel = relationships.triples[0]
    console.log('Relationship:', `${rel.subject.name} works for ${rel.object.name}`)
  }
  console.log()

  // 5. Get related entities
  console.log('5. Getting related entities...')

  const orgs = await db.getRelated(person, 'worksFor')
  console.log('Organizations person works for:', orgs.length)
  orgs.forEach((org) => {
    console.log('-', org.name)
  })
  console.log()

  // 6. Update entity
  console.log('6. Updating entity...')

  const updated = await db.update({
    id: db.extractId(person),
    data: {
      jobTitle: 'Senior Software Engineer',
    },
  })

  if (updated) {
    console.log('Updated job title:', updated.jobTitle)
  }
  console.log()

  // 7. Count entities
  console.log('7. Counting entities...')

  const personCount = await db.count('Person')
  const orgCount = await db.count('Organization')
  console.log('People:', personCount)
  console.log('Organizations:', orgCount)
  console.log()

  // 8. Batch create
  console.log('8. Batch creating...')

  const morePeople = await db.batchCreate([
    {
      type: 'Person',
      data: { name: 'Jane Smith', email: 'jane@example.com' },
    },
    {
      type: 'Person',
      data: { name: 'Bob Johnson', email: 'bob@example.com' },
    },
  ])
  console.log('Created', morePeople.length, 'more people')
  console.log()

  // 9. List all people
  console.log('9. Listing all people...')

  const allPeople = await db.list('Person', {
    sortBy: 'name',
    sortOrder: 'asc',
  })
  console.log('All people:')
  allPeople.items.forEach((p) => {
    console.log(`- ${p.name} (${p.jobTitle ?? 'no title'})`)
  })
  console.log()

  console.log('=== Example Complete ===')
}

main().catch(console.error)
