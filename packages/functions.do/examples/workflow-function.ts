/**
 * Workflow Function Examples
 *
 * Workflows are Code Functions with durable execution via Cloudflare Workflows
 */

import { defineWorkflow, step, parallel, sequence } from '../src'
import { z } from 'zod'

// Simple sequential workflow
export const dataIngestionWorkflow = defineWorkflow({
  name: 'dataIngestion',
  description: 'Ingest data from source, transform, and load into database',
  input: z.object({
    source: z.string(),
    format: z.enum(['csv', 'json', 'xml']),
  }),
  output: z.object({
    recordsProcessed: z.number(),
    duration: z.number(),
  }),
  steps: [
    step('fetch', 'fn_fetch_data', { timeout: 30000 }),
    step('parse', 'fn_parse_data'),
    step('transform', 'fn_transform_data'),
    step('load', 'fn_load_to_db', { retries: 3 }),
  ],
  durable: true,
  engine: 'cloudflare',
  timeout: 300000, // 5 minutes total
})

// Parallel execution workflow
export const contentGenerationWorkflow = defineWorkflow({
  name: 'contentGeneration',
  description: 'Generate multiple content pieces in parallel',
  input: z.object({
    topic: z.string(),
    formats: z.array(z.enum(['blog', 'social', 'email', 'ad'])),
  }),
  output: z.object({
    content: z.record(z.string()),
  }),
  steps: [
    // Research step (sequential)
    step('research', 'fn_research_topic'),

    // Generate content in parallel
    ...parallel([
      step('generateBlog', 'fn_generate_blog'),
      step('generateSocial', 'fn_generate_social'),
      step('generateEmail', 'fn_generate_email'),
      step('generateAd', 'fn_generate_ad'),
    ]),

    // Review step (sequential)
    step('review', 'fn_review_content'),
  ],
  durable: true,
  engine: 'cloudflare',
})

// Complex workflow with error handling
export const orderFulfillmentWorkflow = defineWorkflow({
  name: 'orderFulfillment',
  description: 'Process and fulfill an e-commerce order',
  input: z.object({
    orderId: z.string(),
    items: z.array(
      z.object({
        sku: z.string(),
        quantity: z.number(),
      })
    ),
    shippingAddress: z.record(z.string()),
  }),
  output: z.object({
    status: z.enum(['fulfilled', 'failed', 'partial']),
    trackingNumber: z.string().optional(),
    errors: z.array(z.string()).optional(),
  }),
  steps: sequence([
    // Validate order
    step('validate', 'fn_validate_order', { timeout: 5000 }),

    // Check inventory (parallel for each item)
    step(
      'checkInventory',
      async (input, ctx) => {
        // Check all items in parallel
        return Promise.all(input.items.map((item: any) => ctx.env.INVENTORY.check(item.sku, item.quantity)))
      },
      { retries: 2 }
    ),

    // Reserve items
    step('reserve', 'fn_reserve_inventory', { timeout: 10000 }),

    // Process payment
    step('payment', 'fn_process_payment', {
      retries: 3,
      timeout: 15000,
    }),

    // Ship order
    step('ship', 'fn_create_shipment', { timeout: 30000 }),

    // Send confirmation
    step('notify', 'fn_send_confirmation'),
  ]),
  durable: true,
  engine: 'cloudflare',
  maxDuration: 600000, // 10 minutes
  onComplete: async (result, ctx) => {
    // Log successful fulfillment
    console.log(`Order ${ctx.workflowMetadata?.orderId} fulfilled:`, result)

    // Update analytics
    await ctx.env.ANALYTICS.track('order_fulfilled', {
      orderId: ctx.workflowMetadata?.orderId,
      status: result.status,
    })
  },
  onError: async (error, ctx) => {
    // Log error
    console.error(`Order ${ctx.workflowMetadata?.orderId} failed:`, error)

    // Send alert
    await ctx.env.ALERTS.send({
      type: 'workflow_error',
      workflow: 'orderFulfillment',
      orderId: ctx.workflowMetadata?.orderId,
      error: error.message,
    })

    // Attempt to refund if payment was processed
    if (ctx.stepOutputs['payment']?.success) {
      await ctx.env.PAYMENT.refund(ctx.workflowMetadata?.orderId)
    }
  },
})

// Data migration workflow
export const dataMigrationWorkflow = defineWorkflow({
  name: 'dataMigration',
  description: 'Migrate data from legacy system to new system',
  input: z.object({
    source: z.string(),
    destination: z.string(),
    collections: z.array(z.string()),
    batchSize: z.number().default(1000),
  }),
  output: z.object({
    totalRecords: z.number(),
    migratedRecords: z.number(),
    failedRecords: z.number(),
    duration: z.number(),
  }),
  steps: [
    // Extract data
    step('extract', 'fn_extract_data', { timeout: 120000 }),

    // Transform data
    step('transform', 'fn_transform_data', {
      inputTransform: (extracted) => ({
        records: extracted.records,
        mappings: extracted.schema.mappings,
      }),
    }),

    // Load data in batches
    step(
      'load',
      async (input, ctx) => {
        const results = { success: 0, failed: 0 }

        // Process in batches
        for (let i = 0; i < input.records.length; i += input.batchSize) {
          const batch = input.records.slice(i, i + input.batchSize)

          try {
            await ctx.env.DB.insertBatch(batch)
            results.success += batch.length
          } catch (error) {
            console.error('Batch failed:', error)
            results.failed += batch.length
          }

          // Wait between batches to avoid overwhelming the database
          if (i + input.batchSize < input.records.length) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }

        return results
      },
      {
        retries: 5,
        timeout: 300000, // 5 minutes per batch
      }
    ),

    // Verify migration
    step('verify', 'fn_verify_migration'),
  ],
  durable: true,
  engine: 'cloudflare',
  maxDuration: 3600000, // 1 hour
  tags: ['migration', 'data'],
})

// Scheduled workflow (runs via cron)
export const dailyReportWorkflow = defineWorkflow({
  name: 'dailyReport',
  description: 'Generate and send daily business report',
  input: z.object({
    date: z.string(),
    recipients: z.array(z.string().email()),
  }),
  output: z.object({
    reportGenerated: z.boolean(),
    emailsSent: z.number(),
  }),
  steps: [
    // Gather data
    ...parallel([
      step('fetchSales', 'fn_fetch_sales_data'),
      step('fetchUsers', 'fn_fetch_user_data'),
      step('fetchRevenue', 'fn_fetch_revenue_data'),
      step('fetchMetrics', 'fn_fetch_metrics_data'),
    ]),

    // Generate report
    step('generateReport', 'fn_generate_report', {
      inputTransform: (parallelOutputs) => ({
        sales: parallelOutputs[0],
        users: parallelOutputs[1],
        revenue: parallelOutputs[2],
        metrics: parallelOutputs[3],
      }),
    }),

    // Send emails
    step('sendEmails', 'fn_send_report_emails', { retries: 3 }),
  ],
  durable: true,
  engine: 'cloudflare',
  tags: ['scheduled', 'reporting'],
})

// Example usage
async function main() {
  // Execute data ingestion workflow
  const ingestion = await dataIngestionWorkflow.handler(
    {
      source: 'https://data.example.com/products.csv',
      format: 'csv',
    },
    {
      executionId: 'exec_123',
      functionName: 'dataIngestion',
      traceId: 'trace_abc',
    } as any
  )

  console.log('Ingestion result:', ingestion)

  // Execute content generation workflow
  const content = await contentGenerationWorkflow.handler(
    {
      topic: 'Serverless Computing Benefits',
      formats: ['blog', 'social', 'email'],
    },
    {
      executionId: 'exec_456',
      functionName: 'contentGeneration',
      traceId: 'trace_def',
    } as any
  )

  console.log('Content generated:', content)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
