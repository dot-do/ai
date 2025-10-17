/**
 * Basic usage example for ai-database
 *
 * This example demonstrates:
 * - Creating entities with semantic types
 * - Managing relationships (triples)
 * - Querying and filtering data
 * - Using $.Subject.predicate.Object patterns
 */

import { create, relate, list, get, findRelations, update, remove, count } from 'ai-database'
import type { Entity } from 'ai-database'

// Define entity types
interface Person extends Entity {
  name: string
  email: string
  role?: string
}

interface Organization extends Entity {
  name: string
  industry?: string
}

async function main() {
  console.log('=== ai-database Basic Usage Example ===\n')

  // 1. Create entities
  console.log('1. Creating entities...')
  const john = await create<Person>('Person', {
    $id: '$.Person.John',
    $type: 'Person',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Software Engineer',
  })

  const jane = await create<Person>('Person', {
    $id: '$.Person.Jane',
    $type: 'Person',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Product Manager',
  })

  const acme = await create<Organization>('Organization', {
    $id: '$.Organization.Acme',
    $type: 'Organization',
    name: 'Acme Corp',
    industry: 'Technology',
  })

  console.log(`   Created: ${john.name}, ${jane.name}, ${acme.name}\n`)

  // 2. Create relationships using semantic patterns
  console.log('2. Creating relationships...')
  await relate(john.$id, 'worksFor', acme.$id)
  await relate(jane.$id, 'worksFor', acme.$id)
  await relate(john.$id, 'knows', jane.$id)

  console.log('   Relationships created: John works for Acme, Jane works for Acme, John knows Jane\n')

  // 3. Query entities
  console.log('3. Listing all people...')
  const people = await list<Person>('Person')
  console.log(`   Found ${people.total} people:`)
  people.data.forEach((p) => console.log(`   - ${p.name} (${p.role})`))
  console.log()

  // 4. Filter entities
  console.log('4. Filtering by role...')
  const engineers = await list<Person>('Person', {
    where: { role: 'Software Engineer' },
  })
  console.log(`   Found ${engineers.total} software engineers`)
  console.log()

  // 5. Find relationships
  console.log('5. Finding relationships...')
  const johnRelations = await findRelations(john.$id)
  console.log(`   John has ${johnRelations.length} relationships:`)
  johnRelations.forEach((r) => console.log(`   - ${r.predicate} → ${r.object}`))
  console.log()

  // Filter by specific predicate
  const workRelations = await findRelations(john.$id, 'worksFor')
  console.log(`   John works for ${workRelations.length} organization(s)`)
  console.log()

  // 6. Update entities
  console.log('6. Updating entity...')
  await update<Person>(john.$id, {
    role: 'Senior Software Engineer',
  })
  console.log('   Updated John to Senior Software Engineer\n')

  // 7. Get single entity
  console.log('7. Retrieving entity...')
  const updatedJohn = await get<Person>(john.$id)
  console.log(`   Retrieved: ${updatedJohn?.name} - ${updatedJohn?.role}\n`)

  // 8. Count entities
  console.log('8. Counting entities...')
  const personCount = await count('Person')
  const orgCount = await count('Organization')
  console.log(`   Total people: ${personCount}`)
  console.log(`   Total organizations: ${orgCount}\n`)

  // 9. Paginated query
  console.log('9. Paginated query...')
  const page1 = await list<Person>('Person', {
    limit: 1,
    offset: 0,
    orderBy: { field: 'name', direction: 'asc' },
  })
  console.log(`   Page 1: ${page1.data[0]?.name}`)
  console.log(`   Has more: ${page1.pagination.hasMore}\n`)

  // 10. Delete entity
  console.log('10. Cleaning up...')
  await remove(john.$id)
  await remove(jane.$id)
  await remove(acme.$id)
  console.log('   Deleted all entities\n')

  console.log('=== Example Complete ===')
}

main().catch(console.error)
