import { describe, it, expect, beforeEach } from 'vitest'
import { create, get, list, update, deleteEntity, exists, count, batchCreate, batchUpdate, batchDelete, clearEntities } from '../crud.js'
import {
  createRelationship,
  getRelationships,
  relationshipExists,
  deleteRelationships,
  getOutgoingRelationships,
  getIncomingRelationships,
  clearRelationships,
} from '../relationships.js'
import type { Thing, CreateInput, UpdateInput } from '../types.js'

// Clear the in-memory stores before each test
beforeEach(async () => {
  clearEntities()
  clearRelationships()
})

describe('CRUD Operations', () => {
  describe('create', () => {
    it('should create an entity with generated ID', async () => {
      const input: CreateInput = {
        type: 'Person',
        data: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      }

      const person = await create<Thing>(input)

      expect(person['@type']).toBe('Person')
      expect(person['@id']).toBeDefined()
      expect(person.identifier).toBeDefined()
      expect(person.name).toBe('John Doe')
      expect(person.email).toBe('john@example.com')
    })

    it('should create an entity with provided ID', async () => {
      const input: CreateInput = {
        type: 'Person',
        data: {
          '@id': 'person-123',
          name: 'Jane Doe',
        },
      }

      const person = await create<Thing>(input)

      expect(person['@id']).toBe('person-123')
      expect(person.identifier).toBe('person-123')
    })

    it('should create entity with relationships', async () => {
      const org = await create<Thing>({
        type: 'Organization',
        data: { name: 'Acme Inc' },
      })

      const orgId = org['@id'] as string

      const person = await create<Thing>({
        type: 'Person',
        data: { name: 'John Doe' },
        relate: [{ predicate: 'worksFor', object: orgId }],
      })

      expect(person).toBeDefined()
      const rels = await getRelationships({ subject: person })
      expect(rels.triples.length).toBeGreaterThan(0)
    })
  })

  describe('get', () => {
    it('should get an entity by ID', async () => {
      const created = await create<Thing>({
        type: 'Person',
        data: { name: 'John Doe' },
      })

      const retrieved = await get(created['@id']!)

      expect(retrieved).toBeDefined()
      expect(retrieved?.['@id']).toBe(created['@id'])
      expect(retrieved?.name).toBe('John Doe')
    })

    it('should return null for non-existent ID', async () => {
      const result = await get('non-existent-id')
      expect(result).toBeNull()
    })
  })

  describe('list', () => {
    it('should list entities by type', async () => {
      await create<Thing>({ type: 'Person', data: { name: 'John' } })
      await create<Thing>({ type: 'Person', data: { name: 'Jane' } })
      await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })

      const results = await list('Person')

      expect(results.items.length).toBeGreaterThanOrEqual(2)
      expect(results.items.every((item) => item['@type'] === 'Person')).toBe(true)
    })

    it('should filter entities with where clause', async () => {
      await create<Thing>({ type: 'Person', data: { name: 'John', role: 'engineer' } })
      await create<Thing>({ type: 'Person', data: { name: 'Jane', role: 'designer' } })

      const results = await list('Person', { where: { role: 'engineer' } })

      expect(results.items.length).toBeGreaterThanOrEqual(1)
      expect(results.items.every((item) => item.role === 'engineer')).toBe(true)
    })

    it('should sort entities', async () => {
      await create<Thing>({ type: 'Person', data: { name: 'Charlie' } })
      await create<Thing>({ type: 'Person', data: { name: 'Alice' } })
      await create<Thing>({ type: 'Person', data: { name: 'Bob' } })

      const results = await list('Person', { sortBy: 'name', sortOrder: 'asc' })

      const names = results.items.map((item) => item.name as string)
      expect(names[0]).toBe('Alice')
    })

    it('should paginate results', async () => {
      for (let i = 0; i < 15; i++) {
        await create<Thing>({ type: 'Person', data: { name: `Person ${i}` } })
      }

      const page1 = await list('Person', { limit: 5, offset: 0 })
      const page2 = await list('Person', { limit: 5, offset: 5 })

      expect(page1.items.length).toBe(5)
      expect(page2.items.length).toBe(5)
      expect(page1.items[0]['@id']).not.toBe(page2.items[0]['@id'])
    })
  })

  describe('update', () => {
    it('should update an entity', async () => {
      const person = await create<Thing>({
        type: 'Person',
        data: { name: 'John Doe', email: 'john@example.com' },
      })

      const input: UpdateInput = {
        id: person['@id']!,
        data: { email: 'john.doe@example.com' },
      }

      const updated = await update(input)

      expect(updated).toBeDefined()
      expect(updated?.email).toBe('john.doe@example.com')
      expect(updated?.name).toBe('John Doe') // Should preserve unchanged fields
    })

    it('should return null for non-existent entity', async () => {
      const result = await update({
        id: 'non-existent',
        data: { name: 'Test' },
      })

      expect(result).toBeNull()
    })

    it('should preserve @type and @id on update', async () => {
      const person = await create<Thing>({
        type: 'Person',
        data: { name: 'John' },
      })

      const updated = await update({
        id: person['@id']!,
        data: { '@type': 'Organization', '@id': 'new-id' },
      })

      expect(updated?.['@type']).toBe('Person') // Should not change
      expect(updated?.['@id']).toBe(person['@id']) // Should not change
    })
  })

  describe('deleteEntity', () => {
    it('should delete an entity', async () => {
      const person = await create<Thing>({
        type: 'Person',
        data: { name: 'John Doe' },
      })

      const deleted = await deleteEntity(person['@id']!)
      expect(deleted).toBe(true)

      const retrieved = await get(person['@id']!)
      expect(retrieved).toBeNull()
    })

    it('should return false for non-existent entity', async () => {
      const result = await deleteEntity('non-existent')
      expect(result).toBe(false)
    })

    it('should soft delete when option is set', async () => {
      const person = await create<Thing>({
        type: 'Person',
        data: { name: 'John' },
      })

      await deleteEntity(person['@id']!, { soft: true })

      const retrieved = await get(person['@id']!)
      expect(retrieved).toBeDefined()
      expect(retrieved?.deleted).toBe(true)
    })
  })

  describe('exists', () => {
    it('should return true for existing entity', async () => {
      const person = await create<Thing>({
        type: 'Person',
        data: { name: 'John' },
      })

      const result = await exists(person['@id']!)
      expect(result).toBe(true)
    })

    it('should return false for non-existent entity', async () => {
      const result = await exists('non-existent')
      expect(result).toBe(false)
    })
  })

  describe('count', () => {
    it('should count entities by type', async () => {
      await create<Thing>({ type: 'Person', data: { name: 'John' } })
      await create<Thing>({ type: 'Person', data: { name: 'Jane' } })
      await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })

      const personCount = await count('Person')
      expect(personCount).toBeGreaterThanOrEqual(2)
    })

    it('should count with filters', async () => {
      await create<Thing>({ type: 'Person', data: { name: 'John', role: 'engineer' } })
      await create<Thing>({ type: 'Person', data: { name: 'Jane', role: 'designer' } })

      const engineerCount = await count('Person', { where: { role: 'engineer' } })
      expect(engineerCount).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Batch Operations', () => {
    it('should batch create entities', async () => {
      const inputs: CreateInput[] = [
        { type: 'Person', data: { name: 'John' } },
        { type: 'Person', data: { name: 'Jane' } },
        { type: 'Person', data: { name: 'Bob' } },
      ]

      const results = await batchCreate(inputs)

      expect(results.length).toBe(3)
      expect(results.every((item) => item['@id'])).toBe(true)
    })

    it('should batch update entities', async () => {
      const person1 = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const person2 = await create<Thing>({ type: 'Person', data: { name: 'Jane' } })

      const updates: UpdateInput[] = [
        { id: person1['@id']!, data: { status: 'active' } },
        { id: person2['@id']!, data: { status: 'active' } },
      ]

      const results = await batchUpdate(updates)

      expect(results.length).toBe(2)
      expect(results.every((item) => item?.status === 'active')).toBe(true)
    })

    it('should batch delete entities', async () => {
      const person1 = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const person2 = await create<Thing>({ type: 'Person', data: { name: 'Jane' } })

      const results = await batchDelete([person1['@id']!, person2['@id']!])

      expect(results.length).toBe(2)
      expect(results.every((success) => success === true)).toBe(true)
    })

    it('should continue on error in batch operations', async () => {
      const person = await create<Thing>({ type: 'Person', data: { name: 'John' } })

      const updates: UpdateInput[] = [
        { id: person['@id']!, data: { name: 'Updated' } },
        { id: 'non-existent', data: { name: 'Will fail' } },
      ]

      const results = await batchUpdate(updates)

      expect(results.length).toBe(2)
      expect(results[0]).toBeDefined()
      expect(results[1]).toBeNull()
    })
  })
})

describe('Relationship Operations', () => {
  describe('createRelationship', () => {
    it('should create a relationship between entities', async () => {
      const person = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const org = await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })

      const triple = await createRelationship(person, 'worksFor', org)

      expect(triple.subject['@id']).toBe(person['@id'])
      expect(triple.predicate).toBe('worksFor')
      expect(triple.object['@id']).toBe(org['@id'])
    })

    it('should support string IDs', async () => {
      const person = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const person2 = await create<Thing>({ type: 'Person', data: { '@id': 'person-456', name: 'Jane' } })

      const triple = await createRelationship(person['@id']!, 'knows', 'person-456')

      expect(triple.subject['@id']).toBe(person['@id'])
      expect(triple.object['@id']).toBe('person-456')
    })

    it('should include metadata', async () => {
      const person = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const org = await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })

      const triple = await createRelationship(person, 'worksFor', org, {
        createdAt: new Date().toISOString(),
        createdBy: 'test',
        confidence: 0.95,
      })

      expect(triple.metadata).toBeDefined()
      expect(triple.metadata?.createdBy).toBe('test')
      expect(triple.metadata?.confidence).toBe(0.95)
    })
  })

  describe('getRelationships', () => {
    it('should find relationships by subject', async () => {
      const person = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const org1 = await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })
      const org2 = await create<Thing>({ type: 'Organization', data: { name: 'Corp' } })

      await createRelationship(person, 'worksFor', org1)
      await createRelationship(person, 'worksFor', org2)

      const result = await getRelationships({ subject: person })

      expect(result.triples.length).toBeGreaterThanOrEqual(2)
    })

    it('should find relationships by predicate', async () => {
      const person1 = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const person2 = await create<Thing>({ type: 'Person', data: { name: 'Jane' } })
      const org = await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })

      await createRelationship(person1, 'worksFor', org)
      await createRelationship(person2, 'worksFor', org)

      const result = await getRelationships({ predicate: 'worksFor' })

      expect(result.triples.length).toBeGreaterThanOrEqual(2)
    })

    it('should find relationships by object', async () => {
      const person1 = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const person2 = await create<Thing>({ type: 'Person', data: { name: 'Jane' } })
      const org = await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })

      await createRelationship(person1, 'worksFor', org)
      await createRelationship(person2, 'worksFor', org)

      const result = await getRelationships({ object: org })

      expect(result.triples.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('relationshipExists', () => {
    it('should return true for existing relationship', async () => {
      const person = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const org = await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })

      await createRelationship(person, 'worksFor', org)

      const result = await relationshipExists(person, 'worksFor', org)
      expect(result).toBe(true)
    })

    it('should return false for non-existent relationship', async () => {
      const person = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const org = await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })

      const result = await relationshipExists(person, 'worksFor', org)
      expect(result).toBe(false)
    })
  })

  describe('deleteRelationships', () => {
    it('should delete specific relationships', async () => {
      const person = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const org = await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })

      await createRelationship(person, 'worksFor', org)

      await deleteRelationships({ subject: person, predicate: 'worksFor', object: org })

      const result = await relationshipExists(person, 'worksFor', org)
      expect(result).toBe(false)
    })

    it('should delete all relationships for subject', async () => {
      const person = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const org1 = await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })
      const org2 = await create<Thing>({ type: 'Organization', data: { name: 'Corp' } })

      await createRelationship(person, 'worksFor', org1)
      await createRelationship(person, 'worksFor', org2)

      await deleteRelationships({ subject: person })

      const result = await getRelationships({ subject: person })
      expect(result.triples.length).toBe(0)
    })
  })

  describe('getOutgoingRelationships', () => {
    it('should get outgoing relationships from subject', async () => {
      const person = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const org = await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })

      await createRelationship(person, 'worksFor', org)

      const result = await getOutgoingRelationships(person)

      expect(result.length).toBeGreaterThan(0)
      expect(result.every((t) => t.subject['@id'] === person['@id'])).toBe(true)
    })
  })

  describe('getIncomingRelationships', () => {
    it('should get incoming relationships to object', async () => {
      const person = await create<Thing>({ type: 'Person', data: { name: 'John' } })
      const org = await create<Thing>({ type: 'Organization', data: { name: 'Acme' } })

      await createRelationship(person, 'worksFor', org)

      const result = await getIncomingRelationships(org)

      expect(result.length).toBeGreaterThan(0)
      expect(result.every((t) => t.object['@id'] === org['@id'])).toBe(true)
    })
  })
})
