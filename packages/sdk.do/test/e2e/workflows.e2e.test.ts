/**
 * Cross-Service Workflow E2E Tests
 *
 * Tests realistic end-to-end workflows that span multiple services
 * to ensure proper integration and data flow across the platform.
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from './runner'
import { getTimeout } from './config'

describe('Cross-Service Workflow E2E Tests', () => {
  let runner: E2ETestRunner

  beforeEach(() => {
    runner = new E2ETestRunner('workflows')
  })

  afterEach(async () => {
    await runner.teardown()
  })

  test(
    'should complete order processing workflow',
    async () => {
      const namespace = await runner.createNamespace('orders')
      const storageKey = runner.createStorageKey('receipt', 'txt')
      const cacheKey = runner.createCacheKey('order')
      const sdk = runner.getSDK()

      // 1. Create order in database
      const orderId = `order_${Date.now()}`
      const orderData = {
        items: [
          { product: 'Widget Pro', quantity: 2, price: 29.99 },
          { product: 'Gadget Plus', quantity: 1, price: 49.99 },
        ],
        subtotal: 109.97,
        tax: 9.9,
        total: 119.87,
        status: 'pending',
        customerId: 'customer_123',
        createdAt: new Date().toISOString(),
      }

      const order = await sdk.db.create(namespace, orderId, 'Order', orderData)
      expect(order).toBeDefined()
      expect(order.id).toBe(orderId)
      expect(order.data.status).toBe('pending')

      // 2. Validate order with AI
      const validationPrompt = `Validate this e-commerce order and check for any issues:

Order ID: ${order.id}
Items: ${JSON.stringify(order.data.items)}
Subtotal: $${order.data.subtotal}
Tax: $${order.data.tax}
Total: $${order.data.total}

Return JSON with: valid (boolean), issues (array of strings), riskScore (number 0-1)`

      const validation = await sdk.ai.generate({
        model: 'gpt-5-mini',
        prompt: validationPrompt,
        schema: {
          type: 'object',
          properties: {
            valid: { type: 'boolean' },
            issues: { type: 'array', items: { type: 'string' } },
            riskScore: { type: 'number', minimum: 0, maximum: 1 },
          },
          required: ['valid', 'issues', 'riskScore'],
        },
      })

      expect(validation.data).toBeDefined()
      expect(typeof validation.data.valid).toBe('boolean')
      expect(Array.isArray(validation.data.issues)).toBe(true)
      expect(typeof validation.data.riskScore).toBe('number')

      // 3. Generate and store receipt in storage
      const receiptText = `
========================================
           ORDER RECEIPT
========================================
Order ID: ${order.id}
Date: ${order.data.createdAt}
Customer: ${order.data.customerId}

ITEMS:
${order.data.items.map((item: any) => `  ${item.quantity}x ${item.product} @ $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`).join('\n')}

----------------------------------------
Subtotal:                    $${order.data.subtotal.toFixed(2)}
Tax:                         $${order.data.tax.toFixed(2)}
----------------------------------------
TOTAL:                       $${order.data.total.toFixed(2)}
========================================

Validation: ${validation.data.valid ? 'PASSED' : 'FAILED'}
Risk Score: ${(validation.data.riskScore * 100).toFixed(1)}%
${validation.data.issues.length > 0 ? '\nIssues:\n' + validation.data.issues.map((issue: string) => `  - ${issue}`).join('\n') : ''}
`

      await sdk.storage.put(storageKey, receiptText, {
        contentType: 'text/plain',
        metadata: {
          orderId: order.id,
          customerId: order.data.customerId,
          total: order.data.total.toString(),
        },
      })

      // Verify receipt was stored
      const storedReceipt = await sdk.storage.get(storageKey)
      expect(storedReceipt).toBeDefined()
      expect(storedReceipt.text).toContain(order.id)

      // 4. Send order confirmation to queue
      await sdk.queue.publish('order-confirmations', {
        orderId: order.id,
        customerId: order.data.customerId,
        email: 'customer@example.com',
        total: order.data.total,
        receiptUrl: storageKey,
        timestamp: new Date().toISOString(),
      })

      // 5. Update order status in database
      const updatedOrder = await sdk.db.update(namespace, order.id, {
        status: 'confirmed',
        confirmedAt: new Date().toISOString(),
        receiptUrl: storageKey,
        validationResult: validation.data,
      })

      expect(updatedOrder.data.status).toBe('confirmed')
      expect(updatedOrder.data.receiptUrl).toBe(storageKey)

      // 6. Cache order data for fast retrieval
      await sdk.cache.set(cacheKey, updatedOrder, { ttl: 3600 })

      // Verify complete workflow
      const cachedOrder = await sdk.cache.get(cacheKey)
      expect(cachedOrder).toBeDefined()
      expect(cachedOrder.id).toBe(order.id)
      expect(cachedOrder.data.status).toBe('confirmed')
      expect(cachedOrder.data.validationResult).toEqual(validation.data)
    },
    getTimeout()
  )

  test(
    'should complete document enrichment workflow',
    async () => {
      const namespace = await runner.createNamespace('documents')
      const storageKey = runner.createStorageKey('document', 'txt')
      const cacheKey = runner.createCacheKey('enriched_doc')
      const sdk = runner.getSDK()

      // 1. Upload document to storage
      const documentContent = `
# Technical Specification: Widget Pro 2024

## Overview
The Widget Pro 2024 is our flagship product featuring advanced automation,
AI-powered insights, and seamless integration with existing systems.

## Key Features
- Advanced machine learning algorithms
- Real-time data processing
- Cloud-native architecture
- Scalable microservices design
- Enterprise-grade security

## Technical Requirements
- Node.js 18+
- PostgreSQL 14+
- Redis for caching
- Cloudflare Workers for edge computing

## Performance Metrics
- Response time: <100ms
- Throughput: 10,000 req/s
- Uptime: 99.99%
`

      await sdk.storage.put(storageKey, documentContent, {
        contentType: 'text/plain',
        metadata: {
          type: 'technical-spec',
          product: 'Widget Pro 2024',
        },
      })

      // 2. Extract and analyze text with AI
      const analysis = await sdk.ai.generate({
        model: 'gpt-5',
        prompt: `Analyze this technical document and extract key information:

${documentContent}

Return JSON with:
- summary (brief overview)
- keyFeatures (array of main features)
- technicalRequirements (array)
- tags (array of relevant tags for search)
- category (product category)`,
        schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            keyFeatures: { type: 'array', items: { type: 'string' } },
            technicalRequirements: { type: 'array', items: { type: 'string' } },
            tags: { type: 'array', items: { type: 'string' } },
            category: { type: 'string' },
          },
          required: ['summary', 'keyFeatures', 'tags'],
        },
      })

      expect(analysis.data.summary).toBeDefined()
      expect(analysis.data.keyFeatures.length).toBeGreaterThan(0)
      expect(analysis.data.tags.length).toBeGreaterThan(0)

      // 3. Generate embeddings for semantic search
      const embedding = await sdk.ai.embed({
        model: 'text-embedding-3-small',
        input: documentContent,
      })

      expect(embedding.data).toBeDefined()
      expect(Array.isArray(embedding.data)).toBe(true)
      expect(embedding.data.length).toBeGreaterThan(0)

      // 4. Store enriched document in database
      const docId = `doc_${Date.now()}`
      const enrichedDoc = await sdk.db.create(namespace, docId, 'Document', {
        title: 'Technical Specification: Widget Pro 2024',
        content: documentContent,
        storageUrl: storageKey,
        analysis: analysis.data,
        embedding: embedding.data,
        metadata: {
          type: 'technical-spec',
          product: 'Widget Pro 2024',
          indexed: true,
        },
        createdAt: new Date().toISOString(),
      })

      expect(enrichedDoc).toBeDefined()
      expect(enrichedDoc.data.analysis).toEqual(analysis.data)

      // 5. Cache frequently accessed documents
      await sdk.cache.set(cacheKey, enrichedDoc, { ttl: 7200 })

      // Verify workflow
      const cachedDoc = await sdk.cache.get(cacheKey)
      expect(cachedDoc).toBeDefined()
      expect(cachedDoc.data.analysis.summary).toBe(analysis.data.summary)
      expect(cachedDoc.data.embedding).toEqual(embedding.data)
    },
    getTimeout()
  )

  test(
    'should complete user onboarding workflow',
    async () => {
      const namespace = await runner.createNamespace('users')
      const storageKey = runner.createStorageKey('avatar', 'svg')
      const cacheKey = runner.createCacheKey('user_profile')
      const sdk = runner.getSDK()

      const userId = `user_${Date.now()}`
      const userData = {
        email: 'newuser@example.com',
        name: 'Jane Doe',
        role: 'developer',
        preferences: {
          theme: 'dark',
          notifications: true,
        },
      }

      // 1. Create user in database
      const user = await sdk.db.create(namespace, userId, 'User', {
        ...userData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      })

      expect(user).toBeDefined()
      expect(user.data.status).toBe('pending')

      // 2. Generate personalized welcome email with AI
      const welcomeEmail = await sdk.ai.generate({
        model: 'gpt-5-mini',
        prompt: `Generate a personalized welcome email for a new user:

Name: ${userData.name}
Role: ${userData.role}
Email: ${userData.email}

The email should:
- Be warm and welcoming
- Highlight key features relevant to their role
- Include 3-5 getting started tips
- Be professional but friendly

Return JSON with: subject, body, ctaText, ctaUrl`,
        schema: {
          type: 'object',
          properties: {
            subject: { type: 'string' },
            body: { type: 'string' },
            ctaText: { type: 'string' },
            ctaUrl: { type: 'string' },
          },
          required: ['subject', 'body'],
        },
      })

      expect(welcomeEmail.data.subject).toBeDefined()
      expect(welcomeEmail.data.body).toBeDefined()
      expect(welcomeEmail.data.body).toContain(userData.name)

      // 3. Generate and store default avatar
      const avatarSVG = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#6366f1"/>
  <text x="50" y="50" font-size="40" text-anchor="middle" dy=".3em" fill="white" font-family="Arial">
    ${userData.name
      .split(' ')
      .map((n) => n[0])
      .join('')}
  </text>
</svg>`

      await sdk.storage.put(storageKey, avatarSVG, {
        contentType: 'image/svg+xml',
        metadata: {
          userId: user.id,
          type: 'avatar',
        },
      })

      // 4. Send welcome message to queue
      await sdk.queue.publish('user-onboarding', {
        userId: user.id,
        email: userData.email,
        name: userData.name,
        welcomeEmail: welcomeEmail.data,
        avatarUrl: storageKey,
        timestamp: new Date().toISOString(),
      })

      // 5. Update user status and profile
      const activatedUser = await sdk.db.update(namespace, user.id, {
        status: 'active',
        activatedAt: new Date().toISOString(),
        avatarUrl: storageKey,
        onboardingCompleted: true,
      })

      expect(activatedUser.data.status).toBe('active')
      expect(activatedUser.data.onboardingCompleted).toBe(true)

      // 6. Cache user profile for fast access
      await sdk.cache.set(cacheKey, activatedUser, { ttl: 1800 })

      // Verify workflow
      const cachedUser = await sdk.cache.get(cacheKey)
      expect(cachedUser).toBeDefined()
      expect(cachedUser.data.status).toBe('active')
      expect(cachedUser.data.avatarUrl).toBe(storageKey)
    },
    getTimeout()
  )

  test(
    'should complete content pipeline workflow',
    async () => {
      const namespace = await runner.createNamespace('content')
      const storageKey = runner.createStorageKey('thumbnail', 'json')
      const cacheKey = runner.createCacheKey('content_item')
      const sdk = runner.getSDK()

      // 1. Simulate fetching data from external API
      const externalData = {
        title: 'Understanding Cloudflare Workers',
        author: 'Tech Writer',
        published: '2024-01-15',
        rawContent: `
Cloudflare Workers is a serverless execution environment that allows you to create
entirely new applications or augment existing ones without configuring or maintaining
infrastructure. Workers run on Cloudflare's global network, providing low-latency
responses to users worldwide.
`,
      }

      // 2. Transform and enrich with AI
      const enrichedContent = await sdk.ai.generate({
        model: 'gpt-5',
        prompt: `Transform this raw content into a structured article:

Title: ${externalData.title}
Author: ${externalData.author}
Content: ${externalData.rawContent}

Return JSON with:
- headline (engaging headline)
- excerpt (2-3 sentence summary)
- tags (array of relevant tags)
- readingTime (estimated minutes)
- seoTitle (optimized for search)
- seoDescription (meta description)`,
        schema: {
          type: 'object',
          properties: {
            headline: { type: 'string' },
            excerpt: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            readingTime: { type: 'number' },
            seoTitle: { type: 'string' },
            seoDescription: { type: 'string' },
          },
          required: ['headline', 'excerpt', 'tags'],
        },
      })

      expect(enrichedContent.data.headline).toBeDefined()
      expect(enrichedContent.data.tags.length).toBeGreaterThan(0)

      // 3. Store in database
      const contentId = `content_${Date.now()}`
      const content = await sdk.db.create(namespace, contentId, 'Article', {
        ...externalData,
        ...enrichedContent.data,
        status: 'published',
        publishedAt: new Date().toISOString(),
      })

      expect(content).toBeDefined()
      expect(content.data.headline).toBe(enrichedContent.data.headline)

      // 4. Generate thumbnail metadata
      const thumbnailData = {
        contentId: content.id,
        title: enrichedContent.data.headline,
        type: 'article',
        generatedAt: new Date().toISOString(),
      }

      await sdk.storage.put(storageKey, JSON.stringify(thumbnailData), {
        contentType: 'application/json',
        metadata: {
          contentId: content.id,
        },
      })

      // 5. Invalidate related cache entries
      // First, set a cache entry
      await sdk.cache.set(cacheKey, content, { ttl: 3600 })

      // Verify it exists
      let cachedContent = await sdk.cache.get(cacheKey)
      expect(cachedContent).toBeDefined()

      // Simulate cache invalidation after update
      await sdk.cache.delete(cacheKey)

      // Cache should now be empty
      cachedContent = await sdk.cache.get(cacheKey)
      expect(cachedContent).toBeNull()

      // Re-cache with updated data
      const finalContent = await sdk.db.update(namespace, content.id, {
        thumbnailUrl: storageKey,
        cacheInvalidatedAt: new Date().toISOString(),
      })

      await sdk.cache.set(cacheKey, finalContent, { ttl: 3600 })

      // Verify workflow
      const newCachedContent = await sdk.cache.get(cacheKey)
      expect(newCachedContent).toBeDefined()
      expect(newCachedContent.data.thumbnailUrl).toBe(storageKey)
    },
    getTimeout()
  )

  test(
    'should complete analytics workflow',
    async () => {
      const namespace = await runner.createNamespace('analytics')
      const cacheKey = runner.createCacheKey('analytics_results')
      const sdk = runner.getSDK()

      // 1. Simulate batch processing events from queue
      const events = [
        { type: 'page_view', path: '/home', userId: 'user_1', timestamp: Date.now() - 3600000 },
        { type: 'page_view', path: '/products', userId: 'user_1', timestamp: Date.now() - 3000000 },
        { type: 'click', element: 'buy-button', userId: 'user_1', timestamp: Date.now() - 2400000 },
        { type: 'page_view', path: '/home', userId: 'user_2', timestamp: Date.now() - 2000000 },
        { type: 'page_view', path: '/about', userId: 'user_2', timestamp: Date.now() - 1000000 },
        { type: 'conversion', value: 99.99, userId: 'user_1', timestamp: Date.now() - 500000 },
      ]

      // Publish events to queue
      for (const event of events) {
        await sdk.queue.publish('analytics-events', event)
      }

      // 2. Aggregate in database
      const sessionId = `session_${Date.now()}`
      const aggregatedData = {
        totalEvents: events.length,
        uniqueUsers: new Set(events.map((e) => e.userId)).size,
        pageViews: events.filter((e) => e.type === 'page_view').length,
        clicks: events.filter((e) => e.type === 'click').length,
        conversions: events.filter((e) => e.type === 'conversion').length,
        revenue: events.filter((e) => e.type === 'conversion').reduce((sum, e) => sum + (e.value || 0), 0),
      }

      const analyticsSession = await sdk.db.create(namespace, sessionId, 'AnalyticsSession', {
        ...aggregatedData,
        events: events,
        startTime: Math.min(...events.map((e) => e.timestamp)),
        endTime: Math.max(...events.map((e) => e.timestamp)),
        createdAt: new Date().toISOString(),
      })

      expect(analyticsSession).toBeDefined()
      expect(analyticsSession.data.totalEvents).toBe(events.length)

      // 3. Generate insights with AI
      const insights = await sdk.ai.generate({
        model: 'gpt-5-mini',
        prompt: `Analyze these analytics and provide insights:

Total Events: ${aggregatedData.totalEvents}
Unique Users: ${aggregatedData.uniqueUsers}
Page Views: ${aggregatedData.pageViews}
Clicks: ${aggregatedData.clicks}
Conversions: ${aggregatedData.conversions}
Revenue: $${aggregatedData.revenue}

Return JSON with:
- summary (brief overview)
- topInsights (array of key insights)
- recommendations (array of actionable recommendations)
- conversionRate (as percentage)`,
        schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            topInsights: { type: 'array', items: { type: 'string' } },
            recommendations: { type: 'array', items: { type: 'string' } },
            conversionRate: { type: 'number' },
          },
          required: ['summary', 'topInsights', 'recommendations'],
        },
      })

      expect(insights.data.summary).toBeDefined()
      expect(insights.data.topInsights.length).toBeGreaterThan(0)

      // Update session with insights
      const updatedSession = await sdk.db.update(namespace, sessionId, {
        insights: insights.data,
        analyzed: true,
      })

      expect(updatedSession.data.insights).toEqual(insights.data)

      // 4. Cache results for dashboard
      await sdk.cache.set(cacheKey, updatedSession, { ttl: 1800 })

      // Verify workflow
      const cachedResults = await sdk.cache.get(cacheKey)
      expect(cachedResults).toBeDefined()
      expect(cachedResults.data.insights).toEqual(insights.data)
      expect(cachedResults.data.analyzed).toBe(true)
    },
    getTimeout()
  )

  test(
    'should handle error recovery workflow',
    async () => {
      const namespace = await runner.createNamespace('error_recovery')
      const cacheKey = runner.createCacheKey('retry_state')
      const sdk = runner.getSDK()

      let attemptCount = 0
      const maxRetries = 3

      // 1. Simulate service failure with retry logic
      const simulateOperation = async (): Promise<any> => {
        attemptCount++

        if (attemptCount < 3) {
          throw new Error(`Simulated failure on attempt ${attemptCount}`)
        }

        return {
          success: true,
          attempts: attemptCount,
          recoveredAt: new Date().toISOString(),
        }
      }

      // 2. Implement retry with exponential backoff
      let lastError: Error | null = null
      let result: any = null

      for (let i = 0; i < maxRetries; i++) {
        try {
          result = await simulateOperation()
          break
        } catch (error) {
          lastError = error as Error

          // Store retry state in cache
          await sdk.cache.set(
            cacheKey,
            {
              attempt: i + 1,
              maxRetries,
              lastError: lastError.message,
              timestamp: new Date().toISOString(),
            },
            { ttl: 300 }
          )

          // Exponential backoff: 100ms, 200ms, 400ms
          if (i < maxRetries - 1) {
            await runner.wait(100 * Math.pow(2, i))
          }
        }
      }

      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.attempts).toBe(3)

      // 3. Log recovery in database
      const recoveryId = `recovery_${Date.now()}`
      const recoveryLog = await sdk.db.create(namespace, recoveryId, 'RecoveryLog', {
        operation: 'simulated_operation',
        attempts: attemptCount,
        succeeded: true,
        errors: Array.from({ length: attemptCount - 1 }, (_, i) => `Simulated failure on attempt ${i + 1}`),
        recoveredAt: result.recoveredAt,
        duration: attemptCount * 100,
      })

      expect(recoveryLog).toBeDefined()
      expect(recoveryLog.data.succeeded).toBe(true)
      expect(recoveryLog.data.attempts).toBe(3)

      // 4. Verify eventual consistency
      const storedLog = await sdk.db.get(namespace, recoveryId)
      expect(storedLog).toBeDefined()
      expect(storedLog?.data.recoveredAt).toBe(result.recoveredAt)

      // Clean up retry state from cache
      await sdk.cache.delete(cacheKey)
    },
    getTimeout()
  )

  test(
    'should handle performance test workflow',
    async () => {
      const namespace = await runner.createNamespace('performance')
      const sdk = runner.getSDK()

      const startTime = Date.now()
      const operationCount = 10

      // 1. Execute parallel operations across multiple services
      const operations = Array.from({ length: operationCount }, async (_, i) => {
        const docId = `perf_test_${Date.now()}_${i}`

        // Create document
        const doc = await sdk.db.create(namespace, docId, 'PerformanceTest', {
          index: i,
          timestamp: Date.now(),
        })

        // Store in cache
        const cacheKey = runner.createCacheKey(`perf_${i}`)
        await sdk.cache.set(cacheKey, doc, { ttl: 600 })

        // Generate with AI (small operation)
        const result = await sdk.ai.generate({
          model: 'gpt-5-mini',
          prompt: `Generate a single word for index ${i}`,
          schema: {
            type: 'object',
            properties: {
              word: { type: 'string' },
            },
            required: ['word'],
          },
        })

        return {
          docId,
          cacheKey,
          aiResult: result.data,
          duration: Date.now() - startTime,
        }
      })

      // 2. Measure end-to-end latency
      const results = await Promise.all(operations)
      const endTime = Date.now()
      const totalDuration = endTime - startTime

      // 3. Verify all operations completed
      expect(results.length).toBe(operationCount)
      results.forEach((result, i) => {
        expect(result.docId).toContain('perf_test_')
        expect(result.aiResult.word).toBeDefined()
      })

      // 4. Store performance metrics
      const perfId = `perf_metrics_${Date.now()}`
      const metrics = await sdk.db.create(namespace, perfId, 'PerformanceMetrics', {
        operationCount,
        totalDuration,
        averageDuration: totalDuration / operationCount,
        parallelExecution: true,
        timestamp: new Date().toISOString(),
        operations: results.map((r) => ({
          docId: r.docId,
          duration: r.duration,
        })),
      })

      expect(metrics).toBeDefined()
      expect(metrics.data.operationCount).toBe(operationCount)

      // Performance should complete in reasonable time (adjust as needed)
      expect(totalDuration).toBeLessThan(60000) // 60 seconds max
    },
    getTimeout()
  )

  test(
    'should complete integration test workflow',
    async () => {
      const namespace = await runner.createNamespace('integration')
      const storageKey = runner.createStorageKey('integration_data', 'json')
      const cacheKey = runner.createCacheKey('integration')
      const sdk = runner.getSDK()

      // Multi-step business process simulating a complete customer journey

      // Step 1: Customer registration
      const customerId = `customer_${Date.now()}`
      const customer = await sdk.db.create(namespace, customerId, 'Customer', {
        email: 'integration@example.com',
        name: 'Integration Test User',
        registeredAt: new Date().toISOString(),
        status: 'new',
      })

      expect(customer).toBeDefined()

      // Step 2: Generate personalized recommendation with AI
      const recommendation = await sdk.ai.generate({
        model: 'gpt-5-mini',
        prompt: `Generate product recommendations for a new customer in the technology space.
Return JSON with: products (array of 3 product names), reasoning (why these products)`,
        schema: {
          type: 'object',
          properties: {
            products: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 3 },
            reasoning: { type: 'string' },
          },
          required: ['products', 'reasoning'],
        },
      })

      expect(recommendation.data.products.length).toBe(3)

      // Step 3: Create order
      const orderId = `order_${Date.now()}`
      const order = await sdk.db.create(namespace, orderId, 'Order', {
        customerId: customer.id,
        products: recommendation.data.products,
        total: 149.97,
        status: 'pending',
        createdAt: new Date().toISOString(),
      })

      // Step 4: Store transaction data
      const transactionData = {
        customerId: customer.id,
        orderId: order.id,
        products: recommendation.data.products,
        reasoning: recommendation.data.reasoning,
        timestamp: new Date().toISOString(),
      }

      await sdk.storage.put(storageKey, JSON.stringify(transactionData, null, 2), {
        contentType: 'application/json',
      })

      // Step 5: Publish event for downstream processing
      await sdk.queue.publish('order-processing', {
        orderId: order.id,
        customerId: customer.id,
        action: 'process',
      })

      // Step 6: Update customer with order history
      const updatedCustomer = await sdk.db.update(namespace, customer.id, {
        status: 'active',
        lastOrderId: order.id,
        lastOrderAt: new Date().toISOString(),
      })

      // Step 7: Cache customer profile
      await sdk.cache.set(cacheKey, updatedCustomer, { ttl: 3600 })

      // Verify complete integration
      const cachedCustomer = await sdk.cache.get(cacheKey)
      expect(cachedCustomer).toBeDefined()
      expect(cachedCustomer.data.status).toBe('active')
      expect(cachedCustomer.data.lastOrderId).toBe(order.id)

      // Verify data consistency across services
      const storedTransaction = await sdk.storage.get(storageKey)
      expect(storedTransaction).toBeDefined()
      const parsedTransaction = JSON.parse(storedTransaction.text)
      expect(parsedTransaction.orderId).toBe(order.id)
      expect(parsedTransaction.customerId).toBe(customer.id)
    },
    getTimeout()
  )

  test(
    'should handle complex event-driven workflow',
    async () => {
      const namespace = await runner.createNamespace('events')
      const sdk = runner.getSDK()

      // Simulate event-driven architecture with multiple event types

      const workflowId = `workflow_${Date.now()}`
      const events: any[] = []

      // Event 1: User action
      const userEvent = {
        type: 'user.action',
        workflowId,
        action: 'submit_form',
        data: { formId: 'contact', fields: { email: 'user@example.com', message: 'Hello' } },
        timestamp: Date.now(),
      }
      events.push(userEvent)
      await sdk.queue.publish('workflow-events', userEvent)

      // Event 2: Validation
      const validationEvent = {
        type: 'validation.complete',
        workflowId,
        valid: true,
        timestamp: Date.now(),
      }
      events.push(validationEvent)
      await sdk.queue.publish('workflow-events', validationEvent)

      // Event 3: AI Processing
      const aiResponse = await sdk.ai.generate({
        model: 'gpt-5-mini',
        prompt: `Generate an automated response to: "${userEvent.data.fields.message}"`,
        schema: {
          type: 'object',
          properties: {
            response: { type: 'string' },
            sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
          },
          required: ['response', 'sentiment'],
        },
      })

      const aiEvent = {
        type: 'ai.processed',
        workflowId,
        result: aiResponse.data,
        timestamp: Date.now(),
      }
      events.push(aiEvent)
      await sdk.queue.publish('workflow-events', aiEvent)

      // Event 4: Storage
      const storageKey = runner.createStorageKey(`workflow_${workflowId}`, 'json')
      await sdk.storage.put(storageKey, JSON.stringify(events, null, 2), {
        contentType: 'application/json',
      })

      const storageEvent = {
        type: 'storage.saved',
        workflowId,
        key: storageKey,
        timestamp: Date.now(),
      }
      events.push(storageEvent)
      await sdk.queue.publish('workflow-events', storageEvent)

      // Event 5: Completion
      const completionEvent = {
        type: 'workflow.complete',
        workflowId,
        totalEvents: events.length,
        duration: Date.now() - events[0].timestamp,
        timestamp: Date.now(),
      }
      events.push(completionEvent)
      await sdk.queue.publish('workflow-events', completionEvent)

      // Store workflow state in database
      const workflow = await sdk.db.create(namespace, workflowId, 'EventWorkflow', {
        events,
        status: 'completed',
        startedAt: new Date(events[0].timestamp).toISOString(),
        completedAt: new Date().toISOString(),
        aiResponse: aiResponse.data,
      })

      expect(workflow).toBeDefined()
      expect(workflow.data.status).toBe('completed')
      expect(workflow.data.events.length).toBe(5)
      expect(workflow.data.aiResponse).toEqual(aiResponse.data)

      // Verify event data is consistent
      expect(workflow.data.events[0].type).toBe('user.action')
      expect(workflow.data.events[4].type).toBe('workflow.complete')
    },
    getTimeout()
  )
})
