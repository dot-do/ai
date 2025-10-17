/**
 * Database E2E Tests
 *
 * Comprehensive end-to-end tests for database operations including:
 * - CRUD operations (create, read, update, delete, list)
 * - Soft delete and hard delete
 * - Batch operations (createMany, updateMany, deleteMany)
 * - Transactions (multi-query atomic operations)
 * - Schema introspection
 * - Query with SQL parameters
 * - Namespace isolation
 * - Error handling (duplicate IDs, not found, etc.)
 * - Performance tests (batch inserts, large lists)
 * - Data integrity (references, constraints)
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from './runner'
import { getTimeout } from './config'

describe('Database E2E Tests', () => {
  let runner: E2ETestRunner

  beforeEach(() => {
    runner = new E2ETestRunner('database')
  })

  afterEach(async () => {
    await runner.teardown()
  })

  // ============================================================================
  // BASIC CRUD OPERATIONS
  // ============================================================================

  test(
    'should create and retrieve document',
    async () => {
      const namespace = await runner.createNamespace('users')
      const sdk = runner.getSDK()

      // Create user
      const user = await sdk.db.create(namespace, 'user_1', 'User', {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        age: 28,
        status: 'active',
      })

      expect(user).toMatchObject({
        id: 'user_1',
        namespace,
        type: 'User',
        data: {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          age: 28,
          status: 'active',
        },
      })
      expect(user.createdAt).toBeDefined()
      expect(user.updatedAt).toBeDefined()
      expect(user.deletedAt).toBeUndefined()

      // Retrieve user
      const retrieved = await sdk.db.read(namespace, 'user_1')
      expect(retrieved).toEqual(user)
    },
    getTimeout()
  )

  test(
    'should update document and track updatedAt',
    async () => {
      const namespace = await runner.createNamespace('products')
      const sdk = runner.getSDK()

      // Create product
      const product = await sdk.db.create(namespace, 'product_1', 'Product', {
        name: 'Laptop',
        price: 999.99,
        stock: 50,
      })

      // Wait a bit to ensure updatedAt differs
      await runner.wait(100)

      // Update product
      const updated = await sdk.db.update(namespace, 'product_1', {
        price: 899.99,
        stock: 45,
      })

      expect(updated).not.toBeNull()
      expect(updated!.data.price).toBe(899.99)
      expect(updated!.data.stock).toBe(45)
      expect(updated!.data.name).toBe('Laptop') // Name unchanged
      expect(updated!.updatedAt).not.toBe(product.updatedAt) // Timestamp updated
    },
    getTimeout()
  )

  test(
    'should list documents with filters and pagination',
    async () => {
      const namespace = await runner.createNamespace('orders')
      const sdk = runner.getSDK()

      // Create multiple orders
      const orders = [
        { id: 'order_1', type: 'Order', data: { customer: 'Alice', total: 100, status: 'pending' } },
        { id: 'order_2', type: 'Order', data: { customer: 'Bob', total: 200, status: 'completed' } },
        { id: 'order_3', type: 'Order', data: { customer: 'Charlie', total: 150, status: 'pending' } },
        { id: 'order_4', type: 'Order', data: { customer: 'David', total: 300, status: 'completed' } },
        { id: 'order_5', type: 'Order', data: { customer: 'Eve', total: 250, status: 'pending' } },
      ]

      for (const order of orders) {
        await sdk.db.create(namespace, order.id, order.type, order.data)
      }

      // List all orders
      const allOrders = await sdk.db.list(namespace, { limit: 100 })
      expect(allOrders.documents.length).toBe(5)
      expect(allOrders.total).toBe(5)

      // List with pagination
      const page1 = await sdk.db.list(namespace, { limit: 2, offset: 0, sort: 'createdAt', order: 'asc' })
      expect(page1.documents.length).toBe(2)
      expect(page1.total).toBe(5)

      const page2 = await sdk.db.list(namespace, { limit: 2, offset: 2, sort: 'createdAt', order: 'asc' })
      expect(page2.documents.length).toBe(2)
      expect(page2.total).toBe(5)

      // Verify no overlap
      const page1Ids = page1.documents.map((d) => d.id)
      const page2Ids = page2.documents.map((d) => d.id)
      expect(page1Ids).not.toEqual(expect.arrayContaining(page2Ids))
    },
    getTimeout()
  )

  test(
    'should delete document with soft and hard delete',
    async () => {
      const namespace = await runner.createNamespace('tasks')
      const sdk = runner.getSDK()

      // Create two tasks
      await sdk.db.create(namespace, 'task_1', 'Task', { title: 'Task 1', completed: false })
      await sdk.db.create(namespace, 'task_2', 'Task', { title: 'Task 2', completed: false })

      // Soft delete task_1
      const softDeleted = await sdk.db.delete(namespace, 'task_1', false)
      expect(softDeleted).toBe(true)

      // Verify task_1 still exists but is marked deleted
      const task1 = await sdk.db.read(namespace, 'task_1')
      expect(task1).not.toBeNull()
      expect(task1!.deletedAt).toBeDefined()

      // Hard delete task_2
      const hardDeleted = await sdk.db.delete(namespace, 'task_2', true)
      expect(hardDeleted).toBe(true)

      // Verify task_2 is completely gone
      const task2 = await sdk.db.read(namespace, 'task_2')
      expect(task2).toBeNull()
    },
    getTimeout()
  )

  // ============================================================================
  // BATCH OPERATIONS
  // ============================================================================

  test(
    'should batch create multiple documents',
    async () => {
      const namespace = await runner.createNamespace('employees')
      const sdk = runner.getSDK()

      const employees = [
        { id: 'emp_1', type: 'Employee', data: { name: 'Alice', department: 'Engineering', salary: 120000 } },
        { id: 'emp_2', type: 'Employee', data: { name: 'Bob', department: 'Sales', salary: 90000 } },
        { id: 'emp_3', type: 'Employee', data: { name: 'Charlie', department: 'Engineering', salary: 110000 } },
        { id: 'emp_4', type: 'Employee', data: { name: 'David', department: 'Marketing', salary: 95000 } },
        { id: 'emp_5', type: 'Employee', data: { name: 'Eve', department: 'Engineering', salary: 125000 } },
      ]

      const result = await sdk.db.batchCreate({
        namespace,
        documents: employees,
      })

      expect(result.successCount).toBe(5)
      expect(result.failureCount).toBe(0)
      expect(result.success.length).toBe(5)
      expect(result.failed.length).toBe(0)

      // Verify all created
      const list = await sdk.db.list(namespace, { limit: 100 })
      expect(list.documents.length).toBe(5)
    },
    getTimeout()
  )

  test(
    'should batch update multiple documents',
    async () => {
      const namespace = await runner.createNamespace('inventory')
      const sdk = runner.getSDK()

      // Create items
      const items = [
        { id: 'item_1', type: 'Item', data: { name: 'Widget', stock: 100 } },
        { id: 'item_2', type: 'Item', data: { name: 'Gadget', stock: 200 } },
        { id: 'item_3', type: 'Item', data: { name: 'Doohickey', stock: 150 } },
      ]

      await sdk.db.batchCreate({ namespace, documents: items })

      // Batch update stock levels
      const updates = [
        { id: 'item_1', data: { stock: 90 } },
        { id: 'item_2', data: { stock: 180 } },
        { id: 'item_3', data: { stock: 140 } },
      ]

      const result = await sdk.db.batchUpdate({
        namespace,
        updates,
      })

      expect(result.successCount).toBe(3)
      expect(result.failureCount).toBe(0)

      // Verify updates
      const item1 = await sdk.db.read(namespace, 'item_1')
      expect(item1!.data.stock).toBe(90)
      expect(item1!.data.name).toBe('Widget') // Name unchanged
    },
    getTimeout()
  )

  test(
    'should batch delete multiple documents',
    async () => {
      const namespace = await runner.createNamespace('notifications')
      const sdk = runner.getSDK()

      // Create notifications
      const notifications = [
        { id: 'notif_1', type: 'Notification', data: { message: 'Welcome!', read: false } },
        { id: 'notif_2', type: 'Notification', data: { message: 'Update available', read: true } },
        { id: 'notif_3', type: 'Notification', data: { message: 'New message', read: false } },
        { id: 'notif_4', type: 'Notification', data: { message: 'Reminder', read: true } },
      ]

      await sdk.db.batchCreate({ namespace, documents: notifications })

      // Batch delete read notifications
      const result = await sdk.db.batchDelete({
        namespace,
        ids: ['notif_2', 'notif_4'],
        hard: false, // Soft delete
      })

      expect(result.successCount).toBe(2)
      expect(result.failureCount).toBe(0)

      // Verify deletions
      const notif2 = await sdk.db.read(namespace, 'notif_2')
      expect(notif2!.deletedAt).toBeDefined()

      const notif1 = await sdk.db.read(namespace, 'notif_1')
      expect(notif1!.deletedAt).toBeUndefined()
    },
    getTimeout()
  )

  // ============================================================================
  // SEARCH & QUERIES
  // ============================================================================

  test(
    'should search documents with MongoDB-style queries',
    async () => {
      const namespace = await runner.createNamespace('books')
      const sdk = runner.getSDK()

      // Create books
      const books = [
        { id: 'book_1', type: 'Book', data: { title: 'JavaScript: The Good Parts', price: 29.99, rating: 4.5, inStock: true } },
        { id: 'book_2', type: 'Book', data: { title: 'Python Crash Course', price: 39.99, rating: 4.8, inStock: true } },
        { id: 'book_3', type: 'Book', data: { title: 'Clean Code', price: 44.99, rating: 4.7, inStock: false } },
        { id: 'book_4', type: 'Book', data: { title: 'The Pragmatic Programmer', price: 49.99, rating: 4.9, inStock: true } },
        { id: 'book_5', type: 'Book', data: { title: 'Design Patterns', price: 54.99, rating: 4.6, inStock: false } },
      ]

      await sdk.db.batchCreate({ namespace, documents: books })

      // Search: inStock books under $50
      const affordableInStock = await sdk.db.search(namespace, {
        inStock: { $eq: true },
        price: { $lt: 50 },
      })

      expect(affordableInStock.documents.length).toBe(2) // JavaScript, Python
      expect(affordableInStock.documents.every((d) => d.data.inStock && d.data.price < 50)).toBe(true)

      // Search: high rated books (>= 4.7)
      const highRated = await sdk.db.search(namespace, {
        rating: { $gte: 4.7 },
      })

      expect(highRated.documents.length).toBe(3) // Python, Clean Code, Pragmatic
      expect(highRated.documents.every((d) => d.data.rating >= 4.7)).toBe(true)

      // Search: price range
      const midPrice = await sdk.db.search(namespace, {
        price: { $gte: 40, $lte: 50 },
      })

      expect(midPrice.documents.length).toBe(2) // Clean Code, Pragmatic
      expect(midPrice.documents.every((d) => d.data.price >= 40 && d.data.price <= 50)).toBe(true)

      // Search: text contains
      const pythonBooks = await sdk.db.search(namespace, {
        title: { $contains: 'Python' },
      })

      expect(pythonBooks.documents.length).toBe(1)
      expect(pythonBooks.documents[0].data.title).toContain('Python')
    },
    getTimeout()
  )

  test(
    'should paginate with cursor-based pagination',
    async () => {
      const namespace = await runner.createNamespace('articles')
      const sdk = runner.getSDK()

      // Create 20 articles
      const articles = Array.from({ length: 20 }, (_, i) => ({
        id: `article_${i + 1}`,
        type: 'Article',
        data: { title: `Article ${i + 1}`, views: i * 10 },
      }))

      await sdk.db.batchCreate({ namespace, documents: articles })

      // Fetch first page
      const page1 = await sdk.db.listWithCursor(namespace, {
        limit: 5,
        sort: 'createdAt',
        order: 'asc',
      })

      expect(page1.documents.length).toBe(5)
      expect(page1.hasMore).toBe(true)
      expect(page1.nextCursor).toBeDefined()

      // Fetch second page
      const page2 = await sdk.db.listWithCursor(namespace, {
        limit: 5,
        cursor: page1.nextCursor,
      })

      expect(page2.documents.length).toBe(5)
      expect(page2.hasMore).toBe(true)
      expect(page2.nextCursor).toBeDefined()

      // Verify no overlap
      const page1Ids = page1.documents.map((d) => d.id)
      const page2Ids = page2.documents.map((d) => d.id)
      expect(page1Ids).not.toEqual(expect.arrayContaining(page2Ids))

      // Fetch all pages until end
      let currentCursor = page2.nextCursor
      let pageCount = 2

      while (currentCursor) {
        const nextPage = await sdk.db.listWithCursor(namespace, {
          limit: 5,
          cursor: currentCursor,
        })
        pageCount++
        currentCursor = nextPage.nextCursor

        if (!nextPage.hasMore) {
          break
        }
      }

      expect(pageCount).toBeGreaterThanOrEqual(4) // At least 4 pages for 20 items
    },
    getTimeout()
  )

  // ============================================================================
  // TRANSACTIONS
  // ============================================================================

  test(
    'should execute atomic transactions',
    async () => {
      const namespace = await runner.createNamespace('accounts')
      const sdk = runner.getSDK()

      // Create two accounts
      await sdk.db.create(namespace, 'account_1', 'Account', { balance: 1000 })
      await sdk.db.create(namespace, 'account_2', 'Account', { balance: 500 })

      // Transfer $200 from account_1 to account_2 (atomic)
      const transferAmount = 200

      const result = await sdk.db.transaction({
        queries: [
          {
            sql: `UPDATE documents SET data = json_set(data, '$.balance', json_extract(data, '$.balance') - ?) WHERE namespace = ? AND id = ?`,
            params: [transferAmount, namespace, 'account_1'],
          },
          {
            sql: `UPDATE documents SET data = json_set(data, '$.balance', json_extract(data, '$.balance') + ?) WHERE namespace = ? AND id = ?`,
            params: [transferAmount, namespace, 'account_2'],
          },
        ],
      })

      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()

      // Verify balances
      const account1 = await sdk.db.read(namespace, 'account_1')
      const account2 = await sdk.db.read(namespace, 'account_2')

      expect(account1!.data.balance).toBe(800)
      expect(account2!.data.balance).toBe(700)
    },
    getTimeout()
  )

  // ============================================================================
  // RELATIONSHIPS
  // ============================================================================

  test(
    'should create and query relationships',
    async () => {
      const usersNs = await runner.createNamespace('users')
      const ordersNs = await runner.createNamespace('orders')
      const sdk = runner.getSDK()

      // Create users and orders
      await sdk.db.create(usersNs, 'user_1', 'User', { name: 'Alice' })
      await sdk.db.create(usersNs, 'user_2', 'User', { name: 'Bob' })
      await sdk.db.create(ordersNs, 'order_1', 'Order', { total: 100 })
      await sdk.db.create(ordersNs, 'order_2', 'Order', { total: 200 })
      await sdk.db.create(ordersNs, 'order_3', 'Order', { total: 150 })

      // Create relationships
      await sdk.db.relate(usersNs, 'user_1', ordersNs, 'order_1', 'placed', {
        placedAt: new Date().toISOString(),
      })
      await sdk.db.relate(usersNs, 'user_1', ordersNs, 'order_2', 'placed', {
        placedAt: new Date().toISOString(),
      })
      await sdk.db.relate(usersNs, 'user_2', ordersNs, 'order_3', 'placed', {
        placedAt: new Date().toISOString(),
      })

      // Query relationships for user_1
      const user1Orders = await sdk.db.queryRelationships({
        fromNamespace: usersNs,
        fromId: 'user_1',
        type: 'placed',
      })

      expect(user1Orders.length).toBe(2)
      expect(user1Orders.map((r) => r.toId)).toEqual(expect.arrayContaining(['order_1', 'order_2']))

      // Query relationships for user_2
      const user2Orders = await sdk.db.queryRelationships({
        fromNamespace: usersNs,
        fromId: 'user_2',
        type: 'placed',
      })

      expect(user2Orders.length).toBe(1)
      expect(user2Orders[0].toId).toBe('order_3')

      // Unrelate user_1 from order_1
      await sdk.db.unrelate(usersNs, 'user_1', ordersNs, 'order_1', 'placed')

      // Verify relationship removed
      const updatedUser1Orders = await sdk.db.queryRelationships({
        fromNamespace: usersNs,
        fromId: 'user_1',
        type: 'placed',
      })

      expect(updatedUser1Orders.length).toBe(1)
      expect(updatedUser1Orders[0].toId).toBe('order_2')
    },
    getTimeout()
  )

  // ============================================================================
  // SCHEMA INTROSPECTION
  // ============================================================================

  test(
    'should introspect database schema',
    async () => {
      const sdk = runner.getSDK()

      const schema = await sdk.db.schema()

      expect(schema.tables).toBeDefined()
      expect(Array.isArray(schema.tables)).toBe(true)

      // Verify standard tables exist
      const tableNames = schema.tables.map((t) => t.name)
      expect(tableNames).toEqual(expect.arrayContaining(['documents', 'relationships']))

      // Check documents table structure
      const documentsTable = schema.tables.find((t) => t.name === 'documents')
      expect(documentsTable).toBeDefined()
      expect(documentsTable!.columns.length).toBeGreaterThan(0)

      const columnNames = documentsTable!.columns.map((c) => c.name)
      expect(columnNames).toEqual(expect.arrayContaining(['id', 'namespace', 'type', 'data', 'createdAt', 'updatedAt']))
    },
    getTimeout()
  )

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  test(
    'should handle duplicate ID errors',
    async () => {
      const namespace = await runner.createNamespace('duplicates')
      const sdk = runner.getSDK()

      // Create document
      await sdk.db.create(namespace, 'dup_1', 'Duplicate', { value: 'first' })

      // Attempt to create with same ID
      await expect(sdk.db.create(namespace, 'dup_1', 'Duplicate', { value: 'second' })).rejects.toThrow()
    },
    getTimeout()
  )

  test(
    'should handle not found errors gracefully',
    async () => {
      const namespace = await runner.createNamespace('notfound')
      const sdk = runner.getSDK()

      // Read non-existent document
      const result = await sdk.db.read(namespace, 'does_not_exist')
      expect(result).toBeNull()

      // Update non-existent document
      const updated = await sdk.db.update(namespace, 'does_not_exist', { value: 'test' })
      expect(updated).toBeNull()

      // Delete non-existent document
      const deleted = await sdk.db.delete(namespace, 'does_not_exist')
      expect(deleted).toBe(false)
    },
    getTimeout()
  )

  test(
    'should validate batch operation errors',
    async () => {
      const namespace = await runner.createNamespace('batch_errors')
      const sdk = runner.getSDK()

      // Create one valid document
      await sdk.db.create(namespace, 'valid_1', 'Valid', { value: 'test' })

      // Batch create with mix of valid and duplicate IDs
      const result = await sdk.db.batchCreate({
        namespace,
        documents: [
          { id: 'valid_2', type: 'Valid', data: { value: 'test2' } },
          { id: 'valid_1', type: 'Valid', data: { value: 'duplicate' } }, // Duplicate
          { id: 'valid_3', type: 'Valid', data: { value: 'test3' } },
        ],
      })

      expect(result.successCount).toBe(2)
      expect(result.failureCount).toBe(1)
      expect(result.failed.length).toBe(1)
      expect(result.failed[0].id).toBe('valid_1')
    },
    getTimeout()
  )

  // ============================================================================
  // NAMESPACE ISOLATION
  // ============================================================================

  test(
    'should isolate data between namespaces',
    async () => {
      const ns1 = await runner.createNamespace('products')
      const ns2 = await runner.createNamespace('orders')
      const sdk = runner.getSDK()

      // Create documents with same ID in different namespaces
      await sdk.db.create(ns1, 'item_1', 'Product', { name: 'Laptop' })
      await sdk.db.create(ns2, 'item_1', 'Order', { total: 999 })

      // Retrieve from each namespace
      const product = await sdk.db.read(ns1, 'item_1')
      const order = await sdk.db.read(ns2, 'item_1')

      expect(product!.type).toBe('Product')
      expect(product!.data.name).toBe('Laptop')

      expect(order!.type).toBe('Order')
      expect(order!.data.total).toBe(999)

      // List should only show documents from respective namespace
      const ns1List = await sdk.db.list(ns1, { limit: 100 })
      const ns2List = await sdk.db.list(ns2, { limit: 100 })

      expect(ns1List.documents.length).toBe(1)
      expect(ns1List.documents[0].type).toBe('Product')

      expect(ns2List.documents.length).toBe(1)
      expect(ns2List.documents[0].type).toBe('Order')
    },
    getTimeout()
  )

  // ============================================================================
  // PERFORMANCE & SCALE
  // ============================================================================

  test(
    'should handle large batch inserts efficiently',
    async () => {
      const namespace = await runner.createNamespace('performance')
      const sdk = runner.getSDK()

      // Create 100 documents in batches
      const batchSize = 50
      const totalDocs = 100

      const startTime = Date.now()

      for (let i = 0; i < totalDocs / batchSize; i++) {
        const batch = Array.from({ length: batchSize }, (_, j) => ({
          id: `perf_${i * batchSize + j + 1}`,
          type: 'PerfTest',
          data: { index: i * batchSize + j + 1, timestamp: new Date().toISOString() },
        }))

        await sdk.db.batchCreate({ namespace, documents: batch })
      }

      const endTime = Date.now()
      const duration = endTime - startTime

      // Verify all created
      const list = await sdk.db.list(namespace, { limit: 200 })
      expect(list.documents.length).toBe(100)
      expect(list.total).toBe(100)

      // Should complete reasonably fast (adjust threshold as needed)
      expect(duration).toBeLessThan(30000) // 30 seconds
    },
    getTimeout()
  )

  test(
    'should handle large result sets with pagination',
    async () => {
      const namespace = await runner.createNamespace('large_results')
      const sdk = runner.getSDK()

      // Create 200 documents
      const batches = 4
      const batchSize = 50

      for (let i = 0; i < batches; i++) {
        const batch = Array.from({ length: batchSize }, (_, j) => ({
          id: `large_${i * batchSize + j + 1}`,
          type: 'Large',
          data: { batch: i + 1, index: j + 1 },
        }))

        await sdk.db.batchCreate({ namespace, documents: batch })
      }

      // Fetch all with cursor pagination
      const allDocs: any[] = []
      let cursor: string | undefined

      do {
        const page = await sdk.db.listWithCursor(namespace, {
          limit: 25,
          cursor,
          sort: 'createdAt',
          order: 'asc',
        })

        allDocs.push(...page.documents)
        cursor = page.nextCursor
      } while (cursor)

      expect(allDocs.length).toBe(200)

      // Verify unique IDs
      const uniqueIds = new Set(allDocs.map((d) => d.id))
      expect(uniqueIds.size).toBe(200)
    },
    getTimeout()
  )

  // ============================================================================
  // DATA INTEGRITY
  // ============================================================================

  test(
    'should maintain data integrity with concurrent updates',
    async () => {
      const namespace = await runner.createNamespace('concurrent')
      const sdk = runner.getSDK()

      // Create document
      await sdk.db.create(namespace, 'counter_1', 'Counter', { value: 0 })

      // Perform concurrent updates
      const updates = Array.from({ length: 10 }, (_, i) => sdk.db.update(namespace, 'counter_1', { value: i + 1, updateId: `update_${i + 1}` }))

      await Promise.all(updates)

      // Read final state
      const final = await sdk.db.read(namespace, 'counter_1')

      // Should have one of the update values
      expect(final!.data.value).toBeGreaterThanOrEqual(1)
      expect(final!.data.value).toBeLessThanOrEqual(10)
      expect(final!.data.updateId).toMatch(/^update_\d+$/)
    },
    getTimeout()
  )

  test(
    'should preserve data types',
    async () => {
      const namespace = await runner.createNamespace('types')
      const sdk = runner.getSDK()

      const testData = {
        string: 'hello',
        number: 42,
        float: 3.14,
        boolean: true,
        null: null,
        array: [1, 2, 3],
        object: { nested: { deep: 'value' } },
        date: new Date().toISOString(),
      }

      await sdk.db.create(namespace, 'types_1', 'Types', testData)

      const retrieved = await sdk.db.read(namespace, 'types_1')

      expect(retrieved!.data).toEqual(testData)
      expect(typeof retrieved!.data.string).toBe('string')
      expect(typeof retrieved!.data.number).toBe('number')
      expect(typeof retrieved!.data.float).toBe('number')
      expect(typeof retrieved!.data.boolean).toBe('boolean')
      expect(retrieved!.data.null).toBeNull()
      expect(Array.isArray(retrieved!.data.array)).toBe(true)
      expect(typeof retrieved!.data.object).toBe('object')
    },
    getTimeout()
  )
})
