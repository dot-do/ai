/**
 * Zod Validation Examples for Business-as-Code
 *
 * This example demonstrates how to use Zod schemas for runtime validation
 * with the sdk.do BusinessContext, ensuring type safety at both compile-time
 * and runtime.
 */

import { z } from 'zod'
import { type BusinessContext } from '../src/index.js'

/**
 * Define Zod schemas for your business entities
 * These provide runtime validation and TypeScript type inference
 */

// Order schema with nested items
const OrderSchema = z.object({
  $type: z.literal('Order'),
  $id: z.string().min(1),
  customerId: z.string().min(1),
  total: z.number().positive(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Customer schema
const CustomerSchema = z.object({
  $type: z.literal('Customer'),
  $id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  plan: z.enum(['free', 'pro', 'enterprise']),
  metadata: z.record(z.unknown()).optional(),
})

// Invoice schema
const InvoiceSchema = z.object({
  $type: z.literal('Invoice'),
  $id: z.string().min(1),
  customerId: z.string().min(1),
  amount: z.number().positive(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']),
  dueDate: z.string().datetime(),
  items: z.array(
    z.object({
      description: z.string(),
      amount: z.number(),
    })
  ),
})

// Infer TypeScript types from Zod schemas
type Order = z.infer<typeof OrderSchema>
type Customer = z.infer<typeof CustomerSchema>
type Invoice = z.infer<typeof InvoiceSchema>

/**
 * Example: Event listeners with Zod validation
 */
export default (ctx: BusinessContext) => {
  const { $, ai, db, on, send, every, user } = ctx

  // Order created event with validation
  on($.Order.created, async (event) => {
    try {
      // Validate the event payload at runtime
      const order = OrderSchema.parse(event.what)

      // Now order is fully typed and validated
      console.log(`Processing order ${order.$id} for customer ${order.customerId}`)
      console.log(`Total: $${order.total}, Status: ${order.status}`)

      // Calculate total to verify order integrity
      const calculatedTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      if (Math.abs(calculatedTotal - order.total) > 0.01) {
        throw new Error(`Order total mismatch: expected ${calculatedTotal}, got ${order.total}`)
      }

      // Send confirmation email
      await ai.generateText(`Send order confirmation for order ${order.$id}`)

      // Emit order validated event
      await send.Order.validated({ orderId: order.$id })
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        console.error('Order validation failed:', error.errors)
        await send.Order.validationFailed({
          orderId: event.what?.$id,
          errors: error.errors,
        })
      } else {
        throw error
      }
    }
  })

  // Customer subscribed event with validation
  on($.Customer.subscribed, async (event) => {
    try {
      const customer = CustomerSchema.parse(event.what)

      console.log(`Customer ${customer.name} (${customer.email}) subscribed to ${customer.plan}`)

      // Send welcome email based on plan
      const welcomeMessage = await ai.generateText(`Welcome email for ${customer.plan} plan subscriber`)

      await send.Email.sent({
        to: customer.email,
        subject: `Welcome to ${customer.plan} plan`,
        body: welcomeMessage,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Customer validation failed:', error.errors)
      } else {
        throw error
      }
    }
  })

  // Invoice sent event with validation
  on($.Invoice.sent, async (event) => {
    try {
      const invoice = InvoiceSchema.parse(event.what)

      console.log(`Invoice ${invoice.$id} sent to customer ${invoice.customerId}`)
      console.log(`Amount: $${invoice.amount}, Due: ${invoice.dueDate}`)

      // Schedule payment reminder
      const dueDate = new Date(invoice.dueDate)
      const reminderDate = new Date(dueDate)
      reminderDate.setDate(reminderDate.getDate() - 3) // 3 days before due date

      every.day(async () => {
        const now = new Date()
        if (now >= reminderDate && invoice.status !== 'paid') {
          await send.Invoice.reminderSent({ invoiceId: invoice.$id })
        }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Invoice validation failed:', error.errors)
      } else {
        throw error
      }
    }
  })
}

/**
 * Example: Validating database queries
 */
export async function validateDatabaseQueries($: BusinessContext) {
  const { db } = $

  // Fetch orders and validate them
  const rawOrders = await db.list('orders')

  const validatedOrders: Order[] = []
  const invalidOrders: Array<{ data: unknown; errors: z.ZodError }> = []

  for (const rawOrder of rawOrders) {
    const result = OrderSchema.safeParse(rawOrder)
    if (result.success) {
      validatedOrders.push(result.data)
    } else {
      invalidOrders.push({ data: rawOrder, errors: result.error })
    }
  }

  console.log(`Valid orders: ${validatedOrders.length}`)
  console.log(`Invalid orders: ${invalidOrders.length}`)

  return { validatedOrders, invalidOrders }
}

/**
 * Example: Partial validation for updates
 */
export const PartialOrderSchema = OrderSchema.partial().required({ $id: true })

export async function updateOrder($: BusinessContext, orderId: string, updates: Partial<Order>) {
  const { db } = $

  // Validate that the update has required fields and valid data
  const validatedUpdate = PartialOrderSchema.parse({
    $id: orderId,
    ...updates,
  })

  // Update in database
  await db.upsert('orders', orderId, validatedUpdate)

  return validatedUpdate
}

/**
 * Example: Custom validation with refinements
 */
const FutureOrderSchema = OrderSchema.refine(
  (order) => {
    const createdAt = new Date(order.createdAt)
    const now = new Date()
    return createdAt <= now
  },
  {
    message: 'Order createdAt cannot be in the future',
  }
).refine(
  (order) => {
    // Ensure at least one item
    return order.items.length > 0
  },
  {
    message: 'Order must have at least one item',
  }
)

export async function createOrder($: BusinessContext, orderData: unknown) {
  const { db, send } = $

  // Validate with custom refinements
  const order = FutureOrderSchema.parse(orderData)

  // Save to database
  await db.upsert('orders', order.$id, order)

  // Emit event
  await send.Order.created(order)

  return order
}
