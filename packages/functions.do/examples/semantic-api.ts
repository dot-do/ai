/**
 * Semantic Fluent API Examples
 *
 * Beautiful, declarative syntax for function composition
 *
 * Accessible via RPC at:
 * - rpc.do/db.forEach.Occupation.tasks(ifAICapableOfDelivering.generateService)
 * - 入.io/db.forEach.Occupation.tasks(ifAICapableOfDelivering.generateService)
 */

import { chain, db, ifAICapableOfDelivering, ifHighValue, ifActiveUser, generateService, enrichData } from '../src'

/**
 * Example 1: db.forEach.Occupation.tasks(ifAICapableOfDelivering.generateService)
 *
 * For each Occupation in the database, check if AI is capable of delivering
 * each task, and if so, generate a service definition.
 */
export async function generateServicesForOccupations() {
  const result = await db.forEach.Occupation.tasks(ifAICapableOfDelivering.then(generateService)).execute({})

  console.log('Generated services:', result)
  return result
}

/**
 * Example 2: Chain operations with filtering
 *
 * Get all users, filter active ones, enrich their data, and send notifications
 */
export async function notifyActiveUsers() {
  const result = await chain('fn_db_list_users')
    .filter((user: any) => user.status === 'active')
    .map(enrichData)
    .map('fn_send_notification')
    .parallel()
    .execute({})

  console.log('Notifications sent:', result)
  return result
}

/**
 * Example 3: Conditional logic with when/then/else
 *
 * Process orders differently based on value
 */
export async function processOrders() {
  const result = await chain('fn_fetch_orders')
    .map(
      chain((order: any) => order)
        .when((order: any) => order.total > 1000)
        .then('fn_premium_processing')
        .else('fn_standard_processing')
    )
    .execute({})

  console.log('Orders processed:', result)
  return result
}

/**
 * Example 4: Complex data pipeline with parallel processing
 *
 * Fetch data, transform it, process in parallel, and aggregate results
 */
export async function dataAnalysisPipeline() {
  const result = await chain('fn_fetch_analytics_data')
    .then('fn_clean_data')
    .map(
      chain((record: any) => record)
        .then('fn_calculate_metrics')
        .then('fn_generate_insights')
    )
    .parallel()
    .reduce(
      (acc: any, insight: any) => ({
        totalInsights: acc.totalInsights + 1,
        insights: [...acc.insights, insight],
      }),
      { totalInsights: 0, insights: [] }
    )
    .execute({})

  console.log('Analysis complete:', result)
  return result
}

/**
 * Example 5: Retry and timeout for resilient operations
 *
 * Fetch external data with retries and timeout protection
 */
export async function fetchExternalDataResilient() {
  const result = await chain('fn_fetch_external_api')
    .retry(3, 1000) // Retry 3 times with 1s delay
    .timeout(30000) // 30 second timeout
    .then('fn_validate_data')
    .then('fn_store_data')
    .execute({ apiUrl: 'https://api.example.com/data' })

  console.log('Data fetched:', result)
  return result
}

/**
 * Example 6: Database operations with semantic syntax
 */
export async function semanticDatabaseOperations() {
  // Get a user by email
  const user = await db.get.User({ email: 'user@example.com' }).then('fn_enrich_profile').execute({})

  // List all products
  const products = await db.list
    .Product({ category: 'electronics' })
    .filter((p: any) => p.inStock)
    .execute({})

  // Create a new order
  const order = await db.create
    .Order({
      userId: user.id,
      items: products.slice(0, 3),
    })
    .then('fn_process_payment')
    .then('fn_send_confirmation')
    .execute({})

  return { user, products, order }
}

/**
 * Example 7: Content generation workflow
 *
 * Generate multiple content pieces with AI
 */
export async function generateMarketingContent() {
  const result = await chain('fn_research_topic')
    .then((research: any) => ({
      topic: research.topic,
      keywords: research.keywords,
      audience: research.targetAudience,
    }))
    .then(
      chain((input: any) => input).then((data: any) =>
        Promise.all([
          chain('fn_generate_blog_post').execute(data),
          chain('fn_generate_social_posts').execute(data),
          chain('fn_generate_email_campaign').execute(data),
          chain('fn_generate_ad_copy').execute(data),
        ])
      )
    )
    .execute({ topic: 'AI-Powered Business Automation' })

  console.log('Content generated:', result)
  return result
}

/**
 * Example 8: Real-time data processing
 *
 * Process streaming data with transformations
 */
export async function processStreamingData() {
  const result = await chain('fn_connect_to_stream')
    .map('fn_parse_event')
    .filter((event: any) => event.type === 'important')
    .map('fn_enrich_event')
    .map('fn_store_event')
    .parallel()
    .execute({ streamUrl: 'wss://stream.example.com' })

  console.log('Stream processed:', result)
  return result
}

/**
 * Example 9: Multi-step validation and transformation
 */
export async function validateAndTransformData() {
  const result = await chain('fn_fetch_raw_data')
    .then('fn_validate_schema')
    .when((valid: any) => valid.isValid)
    .then('fn_transform_data')
    .else((invalid: any) => {
      throw new Error(`Validation failed: ${invalid.errors.join(', ')}`)
    })
    .then('fn_store_transformed_data')
    .execute({})

  console.log('Data validated and stored:', result)
  return result
}

/**
 * Example 10: Complex business logic with semantic API
 *
 * Process leads based on score and engagement
 */
export async function processLeads() {
  const result = await db.list
    .Lead({ status: 'new' })
    .map(
      chain((lead: any) => lead)
        .then('fn_calculate_lead_score')
        .when((scored: any) => scored.score > 80)
        .then('fn_assign_to_sales')
        .else(
          chain((scored: any) => scored)
            .when((s: any) => s.score > 50)
            .then('fn_add_to_nurture_campaign')
            .else('fn_mark_low_priority')
        )
    )
    .parallel()
    .execute({})

  console.log('Leads processed:', result)
  return result
}

/**
 * Example 11: AI-powered service generation
 *
 * The signature example: db.forEach.Occupation.tasks(ifAICapableOfDelivering.generateService)
 */
export async function generateAIServices() {
  // For each occupation, check each task to see if AI can deliver it
  // If yes, generate a service definition
  const services = await db.forEach.Occupation.tasks(ifAICapableOfDelivering.then(generateService)).execute({})

  console.log(`Generated ${services.length} AI-powered services`)

  // Filter high-value services
  const highValueServices = services.filter((s: any) => s.estimatedValue > 10000)

  console.log(`Found ${highValueServices.length} high-value services`)

  return { allServices: services, highValueServices }
}

/**
 * Example 12: Chaining database operations
 */
export async function chainedDatabaseOperations() {
  // Get user, check subscription, upgrade if eligible
  const result = await db.get
    .User({ id: 'user_123' })
    .then('fn_check_subscription_status')
    .when((sub: any) => sub.eligible)
    .then('fn_upgrade_to_premium')
    .else('fn_send_upgrade_offer')
    .execute({})

  console.log('Subscription updated:', result)
  return result
}

// Example usage
async function main() {
  console.log('=== Semantic API Examples ===\n')

  // Run examples
  await generateServicesForOccupations()
  await notifyActiveUsers()
  await processOrders()
  await dataAnalysisPipeline()
  await fetchExternalDataResilient()
  await semanticDatabaseOperations()
  await generateMarketingContent()
  await processStreamingData()
  await validateAndTransformData()
  await processLeads()
  await generateAIServices()
  await chainedDatabaseOperations()

  console.log('\n=== All examples completed ===')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
