/**
 * Send Service Example
 *
 * Demonstrates semantic event publishing using send.[Object].[action] pattern
 */

import { $ } from '../src/index'

/**
 * Example: E-commerce event publishing
 */
async function ecommerceEvents() {
  // Customer events - using past tense verbs
  await $.send.Customer.created({
    customerId: 'cus_123',
    email: 'user@example.com',
    name: 'John Doe',
  })

  await $.send.Customer.subscribed({
    customerId: 'cus_123',
    plan: 'pro',
    billingCycle: 'monthly',
  })

  await $.send.Customer.updated({
    customerId: 'cus_123',
    changes: { email: 'newemail@example.com' },
  })

  // Order events
  await $.send.Order.created({
    orderId: 'ord_456',
    customerId: 'cus_123',
    items: [
      { productId: 'prod_789', quantity: 2, price: 49.99 },
      { productId: 'prod_012', quantity: 1, price: 99.99 },
    ],
    total: 199.97,
  })

  await $.send.Order.confirmed({
    orderId: 'ord_456',
    confirmationNumber: 'CONF-123456',
    estimatedDelivery: '2025-10-15',
  })

  await $.send.Order.shipped({
    orderId: 'ord_456',
    trackingNumber: 'TRACK-789012',
    carrier: 'UPS',
  })

  await $.send.Order.delivered({
    orderId: 'ord_456',
    deliveredAt: '2025-10-14T10:30:00Z',
    signature: 'J. Doe',
  })

  // Payment events
  await $.send.Payment.processed({
    paymentId: 'pay_345',
    orderId: 'ord_456',
    amount: 199.97,
    method: 'credit_card',
    status: 'completed',
  })

  await $.send.Payment.refunded({
    paymentId: 'pay_345',
    refundId: 'ref_678',
    amount: 199.97,
    reason: 'customer_request',
  })

  // Invoice events
  await $.send.Invoice.sent({
    invoiceId: 'inv_901',
    orderId: 'ord_456',
    customerId: 'cus_123',
    amount: 199.97,
    dueDate: '2025-10-30',
  })

  await $.send.Invoice.paid({
    invoiceId: 'inv_901',
    paymentId: 'pay_345',
    paidAt: '2025-10-12T14:20:00Z',
  })

  // Product events
  await $.send.Product.created({
    productId: 'prod_234',
    name: 'Premium Widget',
    price: 149.99,
    category: 'widgets',
  })

  await $.send.Product.updated({
    productId: 'prod_234',
    changes: { price: 139.99 },
  })

  await $.send.Product.deleted({
    productId: 'prod_234',
    reason: 'discontinued',
  })
}

/**
 * Example: Warehouse and inventory events
 */
async function warehouseEvents() {
  await $.send.Shipment.prepared({
    shipmentId: 'shp_123',
    orderId: 'ord_456',
    warehouse: 'WH-NYC',
    items: [
      { sku: 'SKU-001', quantity: 2 },
      { sku: 'SKU-002', quantity: 1 },
    ],
  })

  await $.send.Inventory.updated({
    sku: 'SKU-001',
    warehouse: 'WH-NYC',
    quantity: 48,
    previousQuantity: 50,
  })

  await $.send.Inventory.depleted({
    sku: 'SKU-003',
    warehouse: 'WH-NYC',
    quantity: 0,
    alertLevel: 'critical',
  })
}

/**
 * Example: Irregular past tense verbs (from graphdl/src/types/semantics.ts)
 */
async function irregularVerbEvents() {
  // send -> sent (irregular)
  await $.send.Email.sent({
    emailId: 'email_123',
    to: 'customer@example.com',
    subject: 'Order Confirmation',
    sentAt: '2025-10-10T10:00:00Z',
  })

  // build -> built (irregular)
  await $.send.Report.built({
    reportId: 'rpt_456',
    type: 'sales',
    period: '2025-Q3',
    generatedAt: '2025-10-10T09:00:00Z',
  })

  // find -> found (irregular)
  await $.send.Match.found({
    searchId: 'search_789',
    query: 'premium widgets',
    results: 42,
  })

  // make -> made (irregular)
  await $.send.Decision.made({
    decisionId: 'dec_012',
    type: 'approval',
    outcome: 'approved',
    madeBy: 'manager_345',
  })
}

/**
 * Example: EDI integration events
 */
async function ediEvents() {
  await $.send.EDI.transmitted({
    messageId: 'edi_123',
    messageType: 'ORDERS',
    recipient: 'PARTNER-001',
    protocol: 'AS2',
  })

  await $.send.EDI.received({
    messageId: 'edi_456',
    messageType: 'INVOIC',
    sender: 'PARTNER-002',
    receivedAt: '2025-10-10T11:00:00Z',
  })

  await $.send.EDI.acknowledged({
    messageId: 'edi_123',
    acknowledgmentType: 'CONTRL',
    status: 'ACCEPTED',
  })
}

// Run examples
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check for required environment variable
  if (!process.env.DO_TOKEN) {
    console.error('❌ Error: DO_TOKEN environment variable required')
    console.log('Set with: export DO_TOKEN=your-token-here')
    process.exit(1)
  }

  console.log('✨ Running send service examples...\n')

  try {
    await ecommerceEvents()
    console.log('✅ E-commerce events completed')

    await warehouseEvents()
    console.log('✅ Warehouse events completed')

    await irregularVerbEvents()
    console.log('✅ Irregular verb events completed')

    await ediEvents()
    console.log('✅ EDI events completed')

    console.log('\n✅ All examples completed successfully')
  } catch (error) {
    console.error('\n❌ Error running examples:', error)
    process.exit(1)
  }
}
