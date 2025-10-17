import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createClient, McpClient } from '../../src/index'

/**
 * MCP Integration Tests for database.do
 *
 * These tests verify that the Model Context Protocol server (mcp.do) can properly
 * integrate with database.do, ensuring the `do` tool can execute database operations
 * via TypeScript code with full ACID compliance.
 *
 * Prerequisites:
 * - MCP server running with `do` tool available
 * - Database worker accessible at TEST_URL
 *
 * Run tests:
 * TEST_URL=http://localhost:8788 pnpm test:e2e
 */

describe('MCP Integration: database.do', () => {
  const baseUrl = process.env.TEST_URL || 'http://localhost:8788'
  let mcpClient: McpClient
  const testCollection = `test_mcp_${Date.now()}`

  beforeAll(async () => {
    // Create MCP client
    mcpClient = createClient({
      command: 'node',
      args: ['workers/mcp/dist/index.js'],
      env: {
        ...process.env,
        DATABASE_URL: baseUrl,
      },
    })

    await mcpClient.connect()
    console.log(`MCP client connected to: ${baseUrl}`)
  })

  afterAll(async () => {
    // Cleanup: delete test collection via MCP
    try {
      await mcpClient.executeTypescript(`
        await $.db.deleteCollection('${testCollection}')
      `)
    } catch (error) {
      console.warn('Failed to cleanup test collection:', error)
    }

    await mcpClient.disconnect()
  })

  beforeEach(async () => {
    // Clean up any existing test data
    try {
      const existingDocs = await mcpClient.executeTypescript(`
        return await $.db.list('${testCollection}', { limit: 100 })
      `)

      if (existingDocs?.data?.length > 0) {
        const ids = existingDocs.data.map((doc: any) => doc.id)
        await mcpClient.executeTypescript(`
          await $.db.batchDelete('${testCollection}', ${JSON.stringify(ids)})
        `)
      }
    } catch (error) {
      // Collection might not exist yet, ignore error
    }
  })

  describe('MCP: Server Discovery', () => {
    it('should list available tools', async () => {
      const tools = await mcpClient.listTools()

      expect(tools).toBeDefined()
      expect(Array.isArray(tools)).toBe(true)

      // Should include the `do` tool
      const doTool = tools.find((tool) => tool.name === 'do')
      expect(doTool).toBeDefined()
      expect(doTool?.description).toContain('TypeScript')
    })

    it('should list available resources', async () => {
      const resources = await mcpClient.listResources()

      expect(resources).toBeDefined()
      expect(Array.isArray(resources)).toBe(true)
    })

    it('should report healthy status', async () => {
      const health = await mcpClient.health()

      expect(health.status).toBe('healthy')
      expect(health.tools).toBeGreaterThan(0)
    })
  })

  describe('MCP: Database Operations via TypeScript', () => {
    it('should create collection via MCP', async () => {
      const result = await mcpClient.executeTypescript(`
        return await $.db.createCollection('${testCollection}', {
          id: { type: 'string', required: true, unique: true },
          name: { type: 'string', required: true },
          email: { type: 'string', unique: true },
          balance: { type: 'number', required: true },
          status: { type: 'string', required: true },
          createdAt: { type: 'date', required: true },
        })
      `)

      expect(result).toBeDefined()
      expect(result.name).toBe(testCollection)
    })

    it('should create document via MCP', async () => {
      const result = await mcpClient.executeTypescript(`
        return await $.db.create('${testCollection}', {
          id: 'user1',
          name: 'Alice',
          email: 'alice@example.com',
          balance: 100,
          status: 'active',
          createdAt: new Date().toISOString(),
        })
      `)

      expect(result).toBeDefined()
      expect(result.id).toBe('user1')
      expect(result.name).toBe('Alice')
      expect(result.balance).toBe(100)
    })

    it('should get document via MCP', async () => {
      // Create document first
      await mcpClient.executeTypescript(`
        await $.db.create('${testCollection}', {
          id: 'user2',
          name: 'Bob',
          email: 'bob@example.com',
          balance: 200,
          status: 'active',
          createdAt: new Date().toISOString(),
        })
      `)

      // Get document
      const result = await mcpClient.executeTypescript(`
        return await $.db.get('${testCollection}', 'user2')
      `)

      expect(result).toBeDefined()
      expect(result.id).toBe('user2')
      expect(result.name).toBe('Bob')
      expect(result.balance).toBe(200)
    })

    it('should list documents via MCP', async () => {
      // Create multiple documents
      await mcpClient.executeTypescript(`
        await $.db.batchCreate('${testCollection}', [
          { id: 'user3', name: 'Charlie', email: 'charlie@example.com', balance: 300, status: 'active', createdAt: new Date().toISOString() },
          { id: 'user4', name: 'David', email: 'david@example.com', balance: 400, status: 'active', createdAt: new Date().toISOString() },
          { id: 'user5', name: 'Eve', email: 'eve@example.com', balance: 500, status: 'active', createdAt: new Date().toISOString() },
        ])
      `)

      // List documents
      const result = await mcpClient.executeTypescript(`
        return await $.db.list('${testCollection}', { limit: 10 })
      `)

      expect(result).toBeDefined()
      expect(result.data).toBeDefined()
      expect(result.data.length).toBeGreaterThanOrEqual(3)
      expect(result.total).toBeGreaterThanOrEqual(3)
    })

    it('should update document via MCP', async () => {
      // Create document
      await mcpClient.executeTypescript(`
        await $.db.create('${testCollection}', {
          id: 'user6',
          name: 'Frank',
          email: 'frank@example.com',
          balance: 600,
          status: 'active',
          createdAt: new Date().toISOString(),
        })
      `)

      // Update document
      const result = await mcpClient.executeTypescript(`
        return await $.db.update('${testCollection}', 'user6', {
          balance: 650,
          status: 'premium',
        })
      `)

      expect(result).toBeDefined()
      expect(result.balance).toBe(650)
      expect(result.status).toBe('premium')
    })

    it('should delete document via MCP', async () => {
      // Create document
      await mcpClient.executeTypescript(`
        await $.db.create('${testCollection}', {
          id: 'user7',
          name: 'Grace',
          email: 'grace@example.com',
          balance: 700,
          status: 'active',
          createdAt: new Date().toISOString(),
        })
      `)

      // Delete document
      await mcpClient.executeTypescript(`
        await $.db.delete('${testCollection}', 'user7')
      `)

      // Verify document deleted
      const result = await mcpClient.executeTypescript(`
        return await $.db.get('${testCollection}', 'user7')
      `)

      expect(result).toBeNull()
    })
  })

  describe('MCP: Transactions via TypeScript', () => {
    it('should execute successful transaction via MCP', async () => {
      const result = await mcpClient.executeTypescript(`
        return await $.db.transaction(async (tx) => {
          await tx.create('${testCollection}', {
            id: 'tx_user1',
            name: 'Transaction User 1',
            email: 'tx1@example.com',
            balance: 1000,
            status: 'active',
            createdAt: new Date().toISOString(),
          })

          await tx.create('${testCollection}', {
            id: 'tx_user2',
            name: 'Transaction User 2',
            email: 'tx2@example.com',
            balance: 2000,
            status: 'active',
            createdAt: new Date().toISOString(),
          })

          return { success: true, count: 2 }
        })
      `)

      expect(result.success).toBe(true)
      expect(result.count).toBe(2)

      // Verify both documents created
      const user1 = await mcpClient.executeTypescript(`
        return await $.db.get('${testCollection}', 'tx_user1')
      `)
      const user2 = await mcpClient.executeTypescript(`
        return await $.db.get('${testCollection}', 'tx_user2')
      `)

      expect(user1).toBeDefined()
      expect(user2).toBeDefined()
    })

    it('should rollback failed transaction via MCP', async () => {
      // Create initial document
      await mcpClient.executeTypescript(`
        await $.db.create('${testCollection}', {
          id: 'rollback_test',
          name: 'Rollback Test',
          email: 'rollback@example.com',
          balance: 5000,
          status: 'active',
          createdAt: new Date().toISOString(),
        })
      `)

      // Attempt transaction that should fail
      try {
        await mcpClient.executeTypescript(`
          await $.db.transaction(async (tx) => {
            await tx.update('${testCollection}', 'rollback_test', {
              balance: 6000,
            })

            await tx.create('${testCollection}', {
              id: 'should_not_exist',
              name: 'Should Not Exist',
              email: 'nope@example.com',
              balance: 9999,
              status: 'active',
              createdAt: new Date().toISOString(),
            })

            throw new Error('Simulated failure')
          })
        `)

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('Simulated failure')
      }

      // Verify original state preserved
      const original = await mcpClient.executeTypescript(`
        return await $.db.get('${testCollection}', 'rollback_test')
      `)
      expect(original.balance).toBe(5000)

      // Verify new document not created
      const shouldNotExist = await mcpClient.executeTypescript(`
        return await $.db.get('${testCollection}', 'should_not_exist')
      `)
      expect(shouldNotExist).toBeNull()
    })

    it('should handle atomic transfer via MCP', async () => {
      // Create two accounts
      await mcpClient.executeTypescript(`
        await $.db.batchCreate('${testCollection}', [
          { id: 'account_a', name: 'Account A', email: 'a@example.com', balance: 1000, status: 'active', createdAt: new Date().toISOString() },
          { id: 'account_b', name: 'Account B', email: 'b@example.com', balance: 500, status: 'active', createdAt: new Date().toISOString() },
        ])
      `)

      // Transfer 200 from A to B
      await mcpClient.executeTypescript(`
        await $.db.transaction(async (tx) => {
          const accountA = await tx.get('${testCollection}', 'account_a')
          const accountB = await tx.get('${testCollection}', 'account_b')

          await tx.update('${testCollection}', 'account_a', {
            balance: accountA.balance - 200,
          })

          await tx.update('${testCollection}', 'account_b', {
            balance: accountB.balance + 200,
          })
        })
      `)

      // Verify balances
      const accountA = await mcpClient.executeTypescript(`
        return await $.db.get('${testCollection}', 'account_a')
      `)
      const accountB = await mcpClient.executeTypescript(`
        return await $.db.get('${testCollection}', 'account_b')
      `)

      expect(accountA.balance).toBe(800)
      expect(accountB.balance).toBe(700)
    })
  })

  describe('MCP: ACID Compliance via TypeScript', () => {
    it('should maintain atomicity via MCP', async () => {
      const atomicityTest = await mcpClient.executeTypescript(`
        let createSuccess = false
        let rollbackSuccess = false

        // Test successful commit
        try {
          await $.db.transaction(async (tx) => {
            await tx.create('${testCollection}', {
              id: 'atomic_1',
              name: 'Atomic Test 1',
              email: 'atomic1@example.com',
              balance: 100,
              status: 'active',
              createdAt: new Date().toISOString(),
            })
          })
          createSuccess = true
        } catch (error) {
          createSuccess = false
        }

        // Test rollback
        try {
          await $.db.transaction(async (tx) => {
            await tx.create('${testCollection}', {
              id: 'atomic_2',
              name: 'Atomic Test 2',
              email: 'atomic2@example.com',
              balance: 200,
              status: 'active',
              createdAt: new Date().toISOString(),
            })
            throw new Error('Force rollback')
          })
        } catch (error) {
          rollbackSuccess = true
        }

        // Verify states
        const doc1 = await $.db.get('${testCollection}', 'atomic_1')
        const doc2 = await $.db.get('${testCollection}', 'atomic_2')

        return {
          createSuccess,
          rollbackSuccess,
          doc1Exists: doc1 !== null,
          doc2Exists: doc2 !== null,
        }
      `)

      expect(atomicityTest.createSuccess).toBe(true)
      expect(atomicityTest.rollbackSuccess).toBe(true)
      expect(atomicityTest.doc1Exists).toBe(true)
      expect(atomicityTest.doc2Exists).toBe(false)
    })

    it('should maintain consistency via MCP', async () => {
      const consistencyTest = await mcpClient.executeTypescript(`
        let uniqueViolation = false
        let requiredFieldViolation = false

        // Test unique constraint
        try {
          await $.db.create('${testCollection}', {
            id: 'consistency_1',
            name: 'Consistency Test 1',
            email: 'consistency@example.com',
            balance: 100,
            status: 'active',
            createdAt: new Date().toISOString(),
          })

          await $.db.create('${testCollection}', {
            id: 'consistency_2',
            name: 'Consistency Test 2',
            email: 'consistency@example.com', // Duplicate email
            balance: 200,
            status: 'active',
            createdAt: new Date().toISOString(),
          })
        } catch (error) {
          uniqueViolation = true
        }

        // Test required field
        try {
          await $.db.create('${testCollection}', {
            id: 'consistency_3',
            name: 'Consistency Test 3',
            // Missing required field: balance
            status: 'active',
            createdAt: new Date().toISOString(),
          })
        } catch (error) {
          requiredFieldViolation = true
        }

        return {
          uniqueViolation,
          requiredFieldViolation,
        }
      `)

      expect(consistencyTest.uniqueViolation).toBe(true)
      expect(consistencyTest.requiredFieldViolation).toBe(true)
    })

    it('should maintain durability via MCP', async () => {
      // Create document
      await mcpClient.executeTypescript(`
        await $.db.transaction(async (tx) => {
          await tx.create('${testCollection}', {
            id: 'durable_1',
            name: 'Durable Test',
            email: 'durable@example.com',
            balance: 999,
            status: 'active',
            createdAt: new Date().toISOString(),
          })
        })
      `)

      // Verify persistence (simulating reconnection by reading again)
      const result1 = await mcpClient.executeTypescript(`
        return await $.db.get('${testCollection}', 'durable_1')
      `)

      expect(result1).toBeDefined()
      expect(result1.balance).toBe(999)

      // Read again to verify durability
      const result2 = await mcpClient.executeTypescript(`
        return await $.db.get('${testCollection}', 'durable_1')
      `)

      expect(result2).toBeDefined()
      expect(result2.balance).toBe(999)
    })
  })

  describe('MCP: Batch Operations via TypeScript', () => {
    it('should handle batch create via MCP', async () => {
      const result = await mcpClient.executeTypescript(`
        return await $.db.batchCreate('${testCollection}', [
          { id: 'batch_1', name: 'Batch 1', email: 'batch1@example.com', balance: 100, status: 'active', createdAt: new Date().toISOString() },
          { id: 'batch_2', name: 'Batch 2', email: 'batch2@example.com', balance: 200, status: 'active', createdAt: new Date().toISOString() },
          { id: 'batch_3', name: 'Batch 3', email: 'batch3@example.com', balance: 300, status: 'active', createdAt: new Date().toISOString() },
        ])
      `)

      expect(result.success).toBeDefined()
      expect(result.success.length).toBe(3)
      expect(result.errors.length).toBe(0)
    })

    it('should handle batch update via MCP', async () => {
      // Create documents first
      await mcpClient.executeTypescript(`
        await $.db.batchCreate('${testCollection}', [
          { id: 'update_1', name: 'Update 1', email: 'update1@example.com', balance: 100, status: 'active', createdAt: new Date().toISOString() },
          { id: 'update_2', name: 'Update 2', email: 'update2@example.com', balance: 200, status: 'active', createdAt: new Date().toISOString() },
        ])
      `)

      // Batch update
      await mcpClient.executeTypescript(`
        await $.db.batchUpdate('${testCollection}', [
          { id: 'update_1', data: { balance: 150 } },
          { id: 'update_2', data: { balance: 250 } },
        ])
      `)

      // Verify updates
      const doc1 = await mcpClient.executeTypescript(`
        return await $.db.get('${testCollection}', 'update_1')
      `)
      const doc2 = await mcpClient.executeTypescript(`
        return await $.db.get('${testCollection}', 'update_2')
      `)

      expect(doc1.balance).toBe(150)
      expect(doc2.balance).toBe(250)
    })
  })

  describe('MCP: Error Handling', () => {
    it('should handle TypeScript errors gracefully', async () => {
      try {
        await mcpClient.executeTypescript(`
          throw new Error('Test error')
        `)

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error.message).toContain('Test error')
      }
    })

    it('should handle database errors via MCP', async () => {
      try {
        await mcpClient.executeTypescript(`
          await $.db.get('nonexistent_collection', 'nonexistent_id')
        `)

        // May return null or throw error depending on implementation
      } catch (error) {
        // Error is expected
        expect(error).toBeDefined()
      }
    })

    it('should handle invalid TypeScript syntax', async () => {
      try {
        await mcpClient.executeTypescript(`
          this is not valid TypeScript code {{{
        `)

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('MCP: Performance', () => {
    it('should handle multiple sequential operations efficiently', async () => {
      const startTime = Date.now()

      for (let i = 0; i < 10; i++) {
        await mcpClient.executeTypescript(`
          await $.db.create('${testCollection}', {
            id: 'perf_${i}_${Date.now()}',
            name: 'Performance Test ${i}',
            email: 'perf${i}_${Date.now()}@example.com',
            balance: ${i * 100},
            status: 'active',
            createdAt: new Date().toISOString(),
          })
        `)
      }

      const duration = Date.now() - startTime

      // Should complete within reasonable time (10 operations)
      expect(duration).toBeLessThan(15000) // 15 seconds
    })

    it('should handle complex TypeScript logic', async () => {
      const result = await mcpClient.executeTypescript(`
        const users = []

        for (let i = 0; i < 5; i++) {
          const user = await $.db.create('${testCollection}', {
            id: \`complex_\${Date.now()}_\${i}\`,
            name: \`Complex User \${i}\`,
            email: \`complex\${i}_\${Date.now()}@example.com\`,
            balance: i * 50,
            status: 'active',
            createdAt: new Date().toISOString(),
          })
          users.push(user)
        }

        return {
          count: users.length,
          totalBalance: users.reduce((sum, u) => sum + u.balance, 0),
        }
      `)

      expect(result.count).toBe(5)
      expect(result.totalBalance).toBe(0 + 50 + 100 + 150 + 200) // 500
    })
  })
})
