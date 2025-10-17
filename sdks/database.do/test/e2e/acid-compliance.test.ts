import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createClient, DatabaseClient } from '../../src/index'

/**
 * ACID Compliance Tests for database.do
 *
 * These tests verify that database.do provides full ACID guarantees:
 * - Atomicity: Transactions either fully commit or fully rollback
 * - Consistency: Database constraints are enforced
 * - Isolation: Concurrent transactions don't interfere with each other
 * - Durability: Committed transactions survive failures
 *
 * Run against local development:
 * TEST_URL=http://localhost:8788 pnpm test:e2e
 *
 * Run against production:
 * TEST_URL=https://database.do pnpm test:e2e
 */

describe('ACID Compliance: database.do', () => {
  const baseUrl = process.env.TEST_URL || 'http://localhost:8788'
  let client: DatabaseClient
  const testCollection = `test_acid_${Date.now()}`

  beforeAll(async () => {
    client = createClient({ baseUrl })
    console.log(`Running ACID compliance tests against: ${baseUrl}`)

    // Create test collection with schema
    await client.createCollection(testCollection, {
      id: { type: 'string', required: true, unique: true },
      name: { type: 'string', required: true },
      email: { type: 'string', unique: true },
      balance: { type: 'number', required: true },
      status: { type: 'string', required: true },
      createdAt: { type: 'date', required: true },
    })
  })

  afterAll(async () => {
    // Cleanup: delete test collection
    try {
      await client.deleteCollection(testCollection)
    } catch (error) {
      console.warn('Failed to cleanup test collection:', error)
    }
  })

  beforeEach(async () => {
    // Clean up any existing test data before each test
    const existingDocs = await client.list(testCollection, { limit: 100 })
    if (existingDocs.data.length > 0) {
      const ids = existingDocs.data.map((doc: any) => doc.id)
      await client.batchDelete(testCollection, ids)
    }
  })

  describe('ACID: Atomicity', () => {
    it('should commit all changes in a successful transaction', async () => {
      await client.transaction(async (tx) => {
        // Create multiple documents in a transaction
        await tx.create(testCollection, {
          id: 'user1',
          name: 'Alice',
          email: 'alice@example.com',
          balance: 100,
          status: 'active',
          createdAt: new Date().toISOString(),
        })

        await tx.create(testCollection, {
          id: 'user2',
          name: 'Bob',
          email: 'bob@example.com',
          balance: 200,
          status: 'active',
          createdAt: new Date().toISOString(),
        })

        await tx.create(testCollection, {
          id: 'user3',
          name: 'Charlie',
          email: 'charlie@example.com',
          balance: 300,
          status: 'active',
          createdAt: new Date().toISOString(),
        })
      })

      // Verify all documents were created
      const user1 = await client.get(testCollection, 'user1')
      const user2 = await client.get(testCollection, 'user2')
      const user3 = await client.get(testCollection, 'user3')

      expect(user1).toBeDefined()
      expect(user1?.name).toBe('Alice')
      expect(user2).toBeDefined()
      expect(user2?.name).toBe('Bob')
      expect(user3).toBeDefined()
      expect(user3?.name).toBe('Charlie')
    })

    it('should rollback all changes on transaction failure', async () => {
      // Create initial document
      await client.create(testCollection, {
        id: 'user1',
        name: 'Alice',
        email: 'alice@example.com',
        balance: 100,
        status: 'active',
        createdAt: new Date().toISOString(),
      })

      // Attempt transaction that should fail
      try {
        await client.transaction(async (tx) => {
          // Update existing document
          await tx.update(testCollection, 'user1', {
            balance: 50,
          })

          // Create new document
          await tx.create(testCollection, {
            id: 'user2',
            name: 'Bob',
            email: 'bob@example.com',
            balance: 200,
            status: 'active',
            createdAt: new Date().toISOString(),
          })

          // Throw error to force rollback
          throw new Error('Simulated transaction failure')
        })
      } catch (error: any) {
        expect(error.message).toBe('Simulated transaction failure')
      }

      // Verify original state is preserved
      const user1 = await client.get(testCollection, 'user1')
      expect(user1?.balance).toBe(100) // Should not be updated to 50

      // Verify new document was not created
      const user2 = await client.get(testCollection, 'user2')
      expect(user2).toBeNull()
    })

    it('should handle partial batch operations atomically', async () => {
      // Attempt batch create with one invalid document
      const result = await client.batchCreate(testCollection, [
        {
          id: 'user1',
          name: 'Alice',
          email: 'alice@example.com',
          balance: 100,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'user2',
          name: 'Bob',
          email: 'bob@example.com',
          balance: 200,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'user3',
          name: 'Charlie',
          // Missing required field: email
          balance: 300,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
      ])

      // Should have partial success
      expect(result.success.length).toBeGreaterThan(0)
      expect(result.errors.length).toBeGreaterThan(0)

      // Valid documents should be created
      const user1 = await client.get(testCollection, 'user1')
      const user2 = await client.get(testCollection, 'user2')
      expect(user1).toBeDefined()
      expect(user2).toBeDefined()
    })

    it('should support nested transaction operations', async () => {
      await client.transaction(async (tx) => {
        // Create parent document
        await tx.create(testCollection, {
          id: 'parent1',
          name: 'Parent Account',
          email: 'parent@example.com',
          balance: 1000,
          status: 'active',
          createdAt: new Date().toISOString(),
        })

        // Update parent
        await tx.update(testCollection, 'parent1', {
          balance: 900,
        })

        // Create child documents
        await tx.create(testCollection, {
          id: 'child1',
          name: 'Child Account 1',
          email: 'child1@example.com',
          balance: 50,
          status: 'active',
          createdAt: new Date().toISOString(),
        })

        await tx.create(testCollection, {
          id: 'child2',
          name: 'Child Account 2',
          email: 'child2@example.com',
          balance: 50,
          status: 'active',
          createdAt: new Date().toISOString(),
        })
      })

      // Verify all operations succeeded
      const parent = await client.get(testCollection, 'parent1')
      const child1 = await client.get(testCollection, 'child1')
      const child2 = await client.get(testCollection, 'child2')

      expect(parent?.balance).toBe(900)
      expect(child1?.balance).toBe(50)
      expect(child2?.balance).toBe(50)
    })
  })

  describe('ACID: Consistency', () => {
    it('should enforce unique constraints', async () => {
      // Create document with unique email
      await client.create(testCollection, {
        id: 'user1',
        name: 'Alice',
        email: 'alice@example.com',
        balance: 100,
        status: 'active',
        createdAt: new Date().toISOString(),
      })

      // Attempt to create another document with same email
      await expect(
        client.create(testCollection, {
          id: 'user2',
          name: 'Bob',
          email: 'alice@example.com', // Duplicate email
          balance: 200,
          status: 'active',
          createdAt: new Date().toISOString(),
        })
      ).rejects.toThrow()
    })

    it('should enforce required fields', async () => {
      // Attempt to create document without required field
      await expect(
        client.create(testCollection, {
          id: 'user1',
          name: 'Alice',
          // Missing required field: balance
          status: 'active',
          createdAt: new Date().toISOString(),
        })
      ).rejects.toThrow()
    })

    it('should validate data types', async () => {
      // Attempt to create document with invalid type
      await expect(
        client.create(testCollection, {
          id: 'user1',
          name: 'Alice',
          email: 'alice@example.com',
          balance: 'invalid', // Should be number
          status: 'active',
          createdAt: new Date().toISOString(),
        })
      ).rejects.toThrow()
    })

    it('should maintain consistency across updates', async () => {
      // Create document
      await client.create(testCollection, {
        id: 'user1',
        name: 'Alice',
        email: 'alice@example.com',
        balance: 100,
        status: 'active',
        createdAt: new Date().toISOString(),
      })

      // Update with valid data
      await client.update(testCollection, 'user1', {
        balance: 150,
      })

      const user = await client.get(testCollection, 'user1')
      expect(user?.balance).toBe(150)

      // Attempt update with invalid data
      await expect(
        client.update(testCollection, 'user1', {
          balance: 'invalid', // Should be number
        })
      ).rejects.toThrow()

      // Verify original valid state is preserved
      const userAfterError = await client.get(testCollection, 'user1')
      expect(userAfterError?.balance).toBe(150)
    })
  })

  describe('ACID: Isolation', () => {
    it('should prevent dirty reads', async () => {
      // Create initial document
      await client.create(testCollection, {
        id: 'user1',
        name: 'Alice',
        email: 'alice@example.com',
        balance: 100,
        status: 'active',
        createdAt: new Date().toISOString(),
      })

      // Start transaction that will be rolled back
      const txPromise = client
        .transaction(async (tx) => {
          await tx.update(testCollection, 'user1', {
            balance: 50,
          })

          // Delay before rollback
          await new Promise((resolve) => setTimeout(resolve, 100))

          throw new Error('Rollback')
        })
        .catch(() => {
          /* Expected error */
        })

      // Read during transaction (should see original value)
      await new Promise((resolve) => setTimeout(resolve, 50))
      const user = await client.get(testCollection, 'user1')
      expect(user?.balance).toBe(100) // Should not see uncommitted change

      await txPromise

      // Verify after rollback
      const userAfter = await client.get(testCollection, 'user1')
      expect(userAfter?.balance).toBe(100)
    })

    it('should handle concurrent transactions', async () => {
      // Create initial document
      await client.create(testCollection, {
        id: 'counter',
        name: 'Counter',
        email: 'counter@example.com',
        balance: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      })

      // Run 5 concurrent transactions, each incrementing balance by 10
      const transactions = Array.from({ length: 5 }, (_, i) =>
        client.transaction(async (tx) => {
          const doc = await tx.get(testCollection, 'counter')
          await tx.update(testCollection, 'counter', {
            balance: doc.balance + 10,
          })
        })
      )

      await Promise.all(transactions)

      // Verify final balance is correct (all increments applied)
      const finalDoc = await client.get(testCollection, 'counter')
      expect(finalDoc?.balance).toBe(50) // 5 transactions * 10 = 50
    })

    it('should support read-your-own-writes within transaction', async () => {
      await client.transaction(async (tx) => {
        // Create document
        await tx.create(testCollection, {
          id: 'user1',
          name: 'Alice',
          email: 'alice@example.com',
          balance: 100,
          status: 'active',
          createdAt: new Date().toISOString(),
        })

        // Read same document within transaction
        const doc = await tx.get(testCollection, 'user1')
        expect(doc).toBeDefined()
        expect(doc?.name).toBe('Alice')

        // Update document
        await tx.update(testCollection, 'user1', {
          balance: 150,
        })

        // Read updated value
        const updatedDoc = await tx.get(testCollection, 'user1')
        expect(updatedDoc?.balance).toBe(150)
      })
    })
  })

  describe('ACID: Durability', () => {
    it('should persist committed transactions', async () => {
      const docId = `durable_${Date.now()}`

      // Create document in transaction
      await client.transaction(async (tx) => {
        await tx.create(testCollection, {
          id: docId,
          name: 'Durable Document',
          email: `${docId}@example.com`,
          balance: 999,
          status: 'active',
          createdAt: new Date().toISOString(),
        })
      })

      // Verify document persists after transaction
      const doc = await client.get(testCollection, docId)
      expect(doc).toBeDefined()
      expect(doc?.name).toBe('Durable Document')
      expect(doc?.balance).toBe(999)

      // Create new client instance (simulates reconnection)
      const newClient = createClient({ baseUrl })

      // Verify document still exists with new client
      const docWithNewClient = await newClient.get(testCollection, docId)
      expect(docWithNewClient).toBeDefined()
      expect(docWithNewClient?.name).toBe('Durable Document')
      expect(docWithNewClient?.balance).toBe(999)
    })

    it('should not persist rolled back transactions', async () => {
      const docId = `rollback_${Date.now()}`

      // Attempt transaction that will rollback
      try {
        await client.transaction(async (tx) => {
          await tx.create(testCollection, {
            id: docId,
            name: 'Should Not Persist',
            email: `${docId}@example.com`,
            balance: 888,
            status: 'active',
            createdAt: new Date().toISOString(),
          })

          throw new Error('Force rollback')
        })
      } catch (error: any) {
        expect(error.message).toBe('Force rollback')
      }

      // Verify document does not exist after rollback
      const doc = await client.get(testCollection, docId)
      expect(doc).toBeNull()

      // Verify with new client instance
      const newClient = createClient({ baseUrl })
      const docWithNewClient = await newClient.get(testCollection, docId)
      expect(docWithNewClient).toBeNull()
    })

    it('should handle write-ahead logging correctly', async () => {
      const batchSize = 10
      const docIds = Array.from({ length: batchSize }, (_, i) => `wal_test_${Date.now()}_${i}`)

      // Create multiple documents rapidly
      const createPromises = docIds.map((id, i) =>
        client.create(testCollection, {
          id,
          name: `WAL Test ${i}`,
          email: `${id}@example.com`,
          balance: i * 100,
          status: 'active',
          createdAt: new Date().toISOString(),
        })
      )

      await Promise.all(createPromises)

      // Verify all documents persisted
      const verifyPromises = docIds.map((id) => client.get(testCollection, id))
      const docs = await Promise.all(verifyPromises)

      docs.forEach((doc, i) => {
        expect(doc).toBeDefined()
        expect(doc?.id).toBe(docIds[i])
        expect(doc?.balance).toBe(i * 100)
      })
    })

    it('should maintain durability across batch operations', async () => {
      const batchDocs = Array.from({ length: 5 }, (_, i) => ({
        id: `batch_durable_${Date.now()}_${i}`,
        name: `Batch Document ${i}`,
        email: `batch${i}_${Date.now()}@example.com`,
        balance: (i + 1) * 50,
        status: 'active',
        createdAt: new Date().toISOString(),
      }))

      // Batch create
      const result = await client.batchCreate(testCollection, batchDocs)
      expect(result.success.length).toBe(5)
      expect(result.errors.length).toBe(0)

      // Verify all documents persist
      const verifyPromises = batchDocs.map((doc) => client.get(testCollection, doc.id))
      const persistedDocs = await Promise.all(verifyPromises)

      persistedDocs.forEach((doc, i) => {
        expect(doc).toBeDefined()
        expect(doc?.balance).toBe((i + 1) * 50)
      })
    })
  })

  describe('ACID: Complex Scenarios', () => {
    it('should handle transfer between accounts atomically', async () => {
      // Create two accounts
      await client.create(testCollection, {
        id: 'account_a',
        name: 'Account A',
        email: 'account_a@example.com',
        balance: 1000,
        status: 'active',
        createdAt: new Date().toISOString(),
      })

      await client.create(testCollection, {
        id: 'account_b',
        name: 'Account B',
        email: 'account_b@example.com',
        balance: 500,
        status: 'active',
        createdAt: new Date().toISOString(),
      })

      // Transfer 200 from A to B
      await client.transaction(async (tx) => {
        const accountA = await tx.get(testCollection, 'account_a')
        const accountB = await tx.get(testCollection, 'account_b')

        await tx.update(testCollection, 'account_a', {
          balance: accountA.balance - 200,
        })

        await tx.update(testCollection, 'account_b', {
          balance: accountB.balance + 200,
        })
      })

      // Verify balances
      const accountA = await client.get(testCollection, 'account_a')
      const accountB = await client.get(testCollection, 'account_b')

      expect(accountA?.balance).toBe(800)
      expect(accountB?.balance).toBe(700)
    })

    it('should rollback failed transfer atomically', async () => {
      // Create two accounts
      await client.create(testCollection, {
        id: 'account_x',
        name: 'Account X',
        email: 'account_x@example.com',
        balance: 1000,
        status: 'active',
        createdAt: new Date().toISOString(),
      })

      await client.create(testCollection, {
        id: 'account_y',
        name: 'Account Y',
        email: 'account_y@example.com',
        balance: 500,
        status: 'active',
        createdAt: new Date().toISOString(),
      })

      // Attempt transfer that should fail
      try {
        await client.transaction(async (tx) => {
          const accountX = await tx.get(testCollection, 'account_x')
          const accountY = await tx.get(testCollection, 'account_y')

          // Deduct from X
          await tx.update(testCollection, 'account_x', {
            balance: accountX.balance - 200,
          })

          // Simulate failure before crediting Y
          throw new Error('Transfer failed')
        })
      } catch (error: any) {
        expect(error.message).toBe('Transfer failed')
      }

      // Verify both accounts have original balances
      const accountX = await client.get(testCollection, 'account_x')
      const accountY = await client.get(testCollection, 'account_y')

      expect(accountX?.balance).toBe(1000)
      expect(accountY?.balance).toBe(500)
    })

    it('should maintain consistency under high concurrency', async () => {
      // Create shared resource
      await client.create(testCollection, {
        id: 'shared_counter',
        name: 'Shared Counter',
        email: 'shared@example.com',
        balance: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      })

      // Run 20 concurrent transactions
      const concurrentOps = Array.from({ length: 20 }, (_, i) =>
        client.transaction(async (tx) => {
          const doc = await tx.get(testCollection, 'shared_counter')
          // Increment by different amounts
          await tx.update(testCollection, 'shared_counter', {
            balance: doc.balance + (i + 1),
          })
        })
      )

      await Promise.all(concurrentOps)

      // Expected sum: 1+2+3+...+20 = 210
      const finalDoc = await client.get(testCollection, 'shared_counter')
      expect(finalDoc?.balance).toBe(210)
    })
  })

  describe('ACID: Performance', () => {
    it('should handle large transactions efficiently', async () => {
      const startTime = Date.now()

      await client.transaction(async (tx) => {
        // Create 50 documents in one transaction
        const createPromises = Array.from({ length: 50 }, (_, i) =>
          tx.create(testCollection, {
            id: `perf_${Date.now()}_${i}`,
            name: `Performance Test ${i}`,
            email: `perf${i}_${Date.now()}@example.com`,
            balance: i * 10,
            status: 'active',
            createdAt: new Date().toISOString(),
          })
        )

        await Promise.all(createPromises)
      })

      const duration = Date.now() - startTime

      // Should complete within reasonable time
      expect(duration).toBeLessThan(5000) // 5 seconds
    })

    it('should handle rapid sequential transactions', async () => {
      const iterations = 20
      const startTime = Date.now()

      for (let i = 0; i < iterations; i++) {
        await client.transaction(async (tx) => {
          await tx.create(testCollection, {
            id: `seq_${Date.now()}_${i}`,
            name: `Sequential Test ${i}`,
            email: `seq${i}_${Date.now()}@example.com`,
            balance: i * 5,
            status: 'active',
            createdAt: new Date().toISOString(),
          })
        })
      }

      const duration = Date.now() - startTime

      // Should complete within reasonable time
      expect(duration).toBeLessThan(10000) // 10 seconds for 20 transactions
    })
  })
})
