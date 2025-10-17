# UN/EDIFACT Document Types Modernization

## Overview

This module provides modern, type-safe integration with UN/EDIFACT (United Nations Electronic Data Interchange For Administration, Commerce and Transport) standards. It maps traditional EDI message types to semantic event patterns following the `$.Subject.predicate.Object` convention.

## Message Type Mappings

| EDIFACT Message | Description           | Modern Event Pattern          |
| --------------- | --------------------- | ----------------------------- |
| **ORDERS**      | Purchase Order        | `$.PurchaseOrder.created`     |
| **INVOIC**      | Invoice               | `$.Invoice.sent`              |
| **DESADV**      | Despatch Advice (ASN) | `$.ShippingNotice.sent`       |
| **RECADV**      | Receiving Advice      | `$.Receipt.confirmed`         |
| **ORDRSP**      | Order Response        | `$.OrderResponse.received`    |
| **ORDCHG**      | Order Change          | `$.PurchaseOrder.updated`     |
| **SLSRPT**      | Sales Report          | `$.SalesReport.generated`     |
| **INVRPT**      | Inventory Report      | `$.InventoryReport.generated` |
| **PARTIN**      | Party Information     | `$.Party.registered`          |
| **PRICAT**      | Price Catalog         | `$.Catalog.published`         |
| **PRODAT**      | Product Data          | `$.Product.published`         |
| **QUOTES**      | Quote                 | `$.Quote.sent`                |
| **REMADV**      | Remittance Advice     | `$.Payment.remitted`          |

## Type Definitions

### EDI Document Types

```typescript
import type { EDIMessage, PurchaseOrderEDI, InvoiceEDI, DespatchAdviceEDI, Party, OrderLineItem } from 'graphdl'

// All EDI messages extend EDIDocument
interface EDIDocument {
  $type: 'EDIDocument'
  $id: string
  messageType: EDIMessageType
  sender: Party
  receiver: Party
  documentDate: string
  documentNumber: string
}
```

### Trading Partners

```typescript
const supplier: Party = {
  $type: 'Party',
  identifier: '1234567890123', // GLN
  identifierType: 'GLN',
  name: 'Acme Corporation',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US',
  },
  contact: {
    email: 'orders@acme.com',
    phone: '+1-555-0100',
  },
}
```

## Transformation Utilities

### Convert Business Object to EDI

```typescript
import { toEDI } from 'graphdl'

// Create purchase order
const purchaseOrder = {
  orderNumber: 'PO-2024-001',
  orderDate: '2024-10-10',
  deliveryDate: '2024-10-20',
  buyer: buyerParty,
  seller: sellerParty,
  items: [
    {
      lineNumber: '1',
      productCode: '00012345678905',
      productCodeType: 'GTIN',
      description: 'Widget Pro',
      quantity: { value: 100, unit: 'EA' },
      unitPrice: { value: 25.5, currency: 'USD' },
    },
  ],
  currency: 'USD',
}

// Convert to EDI ORDERS message
const result = toEDI('ORDERS', purchaseOrder)
if (result.success) {
  console.log('EDI Message:', result.data)
  // Send via EDI network
}
```

### Convert EDI to Business Object

```typescript
import { fromEDI } from 'graphdl'
import type { PurchaseOrder } from './types'

// Receive EDI message
const ediMessage: PurchaseOrderEDI = {
  $type: 'EDIDocument',
  $id: 'edi:orders:PO-2024-001',
  messageType: 'ORDERS',
  // ... full message data
}

// Parse to business object
const result = fromEDI<PurchaseOrder>(ediMessage)
if (result.success) {
  const order = result.data
  // Store in database
  await db.PurchaseOrder.create(order)
}
```

### Validation

```typescript
import { validateEDI } from 'graphdl'

const validation = validateEDI(ediMessage)
if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
  console.warn('Warnings:', validation.warnings)
} else {
  // Process message
}
```

## Stream-Based Integration

### Event-Driven EDI Processing

```typescript
import { toEDI, fromEDI, getEventPattern } from 'graphdl'

export default ($: BusinessContext) => {
  const { on, send, db } = $

  // When purchase order created, send EDI ORDERS
  on.PurchaseOrder.created(async (order) => {
    const result = toEDI('ORDERS', order)

    if (result.success) {
      await send.EDI.transmit({
        message: result.data,
        recipient: order.seller.identifier,
        protocol: 'AS2',
      })

      console.log(`Sent ORDERS for ${order.orderNumber}`)
    }
  })

  // When EDI INVOIC received, create invoice
  on.EDI.received(async (transmission) => {
    const { message } = transmission

    if (message.messageType === 'INVOIC') {
      const result = fromEDI(message)

      if (result.success) {
        const invoice = result.data
        await db.Invoice.create(invoice)

        // Emit invoice event
        const eventPattern = getEventPattern('INVOIC')
        await send[eventPattern](invoice)

        console.log(`Created invoice ${invoice.invoiceNumber}`)
      }
    }
  })

  // When shipment ready, send EDI DESADV (ASN)
  on.Shipment.ready(async (shipment) => {
    const result = toEDI('DESADV', shipment)

    if (result.success) {
      await send.EDI.transmit({
        message: result.data,
        recipient: shipment.consignee.identifier,
        protocol: 'AS2',
      })

      console.log(`Sent ASN for ${shipment.shipmentNumber}`)
    }
  })
}
```

### Bidirectional EDI Integration

```typescript
export default ($: BusinessContext) => {
  const { on, send, db } = $

  // Outbound: Business events → EDI messages
  const outboundMappings = {
    'PurchaseOrder.created': 'ORDERS',
    'Invoice.sent': 'INVOIC',
    'ShippingNotice.sent': 'DESADV',
    'Payment.remitted': 'REMADV',
  }

  for (const [event, messageType] of Object.entries(outboundMappings)) {
    on[event](async (data) => {
      const result = toEDI(messageType as any, data)
      if (result.success) {
        await send.EDI.transmit(result.data)
      }
    })
  }

  // Inbound: EDI messages → Business events
  on.EDI.received(async (transmission) => {
    const result = fromEDI(transmission.message)

    if (result.success) {
      const eventPattern = getEventPattern(transmission.message.messageType)
      await send[eventPattern](result.data)
    }
  })
}
```

## Modern API Endpoints

### REST API for EDI Messages

```typescript
import { Router } from 'express'
import { toEDI, fromEDI, validateEDI } from 'graphdl'

const router = Router()

// Send purchase order
router.post('/api/edi/orders', async (req, res) => {
  const result = toEDI('ORDERS', req.body)

  if (!result.success) {
    return res.status(400).json({ error: result.error })
  }

  const validation = validateEDI(result.data)
  if (!validation.valid) {
    return res.status(400).json({ errors: validation.errors })
  }

  // Transmit via EDI network
  await ediTransmitter.send(result.data)

  res.json({ success: true, messageId: result.data.$id })
})

// Send invoice
router.post('/api/edi/invoice', async (req, res) => {
  const result = toEDI('INVOIC', req.body)

  if (result.success) {
    await ediTransmitter.send(result.data)
    res.json({ success: true, messageId: result.data.$id })
  } else {
    res.status(400).json({ error: result.error })
  }
})

// Send ASN (Advance Ship Notice)
router.post('/api/edi/asn', async (req, res) => {
  const result = toEDI('DESADV', req.body)

  if (result.success) {
    await ediTransmitter.send(result.data)
    res.json({ success: true, messageId: result.data.$id })
  } else {
    res.status(400).json({ error: result.error })
  }
})

// List EDI messages
router.get('/api/edi/messages', async (req, res) => {
  const messages = await db.EDIMessage.list({
    limit: parseInt(req.query.limit as string) || 50,
    offset: parseInt(req.query.offset as string) || 0,
  })

  res.json(messages)
})

// Get specific message
router.get('/api/edi/messages/:id', async (req, res) => {
  const message = await db.EDIMessage.get(req.params.id)

  if (!message) {
    return res.status(404).json({ error: 'Message not found' })
  }

  res.json(message)
})

export default router
```

### Webhook Endpoints for Incoming EDI

```typescript
// Receive EDI ORDERS (Purchase Order)
router.post('/webhook/edi/orders', async (req, res) => {
  const ediMessage = req.body

  // Validate
  const validation = validateEDI(ediMessage)
  if (!validation.valid) {
    return res.status(400).json({ errors: validation.errors })
  }

  // Transform to business object
  const result = fromEDI(ediMessage)
  if (!result.success) {
    return res.status(400).json({ error: result.error })
  }

  // Store and emit event
  const order = await db.PurchaseOrder.create(result.data)
  await send.PurchaseOrder.created(order)

  res.json({ success: true, orderId: order.$id })
})

// Receive EDI INVOIC (Invoice)
router.post('/webhook/edi/invoice', async (req, res) => {
  const ediMessage = req.body
  const result = fromEDI(ediMessage)

  if (result.success) {
    const invoice = await db.Invoice.create(result.data)
    await send.Invoice.received(invoice)
    res.json({ success: true, invoiceId: invoice.$id })
  } else {
    res.status(400).json({ error: result.error })
  }
})

// Receive EDI DESADV (ASN)
router.post('/webhook/edi/asn', async (req, res) => {
  const ediMessage = req.body
  const result = fromEDI(ediMessage)

  if (result.success) {
    const shipment = await db.Shipment.create(result.data)
    await send.Shipment.notified(shipment)
    res.json({ success: true, shipmentId: shipment.$id })
  } else {
    res.status(400).json({ error: result.error })
  }
})
```

## Complete Example

### B2B Order Processing with EDI

```typescript
import { toEDI, fromEDI, validateEDI } from 'graphdl'

export default ($: BusinessContext) => {
  const { on, send, db } = $

  // 1. Customer creates order → Send ORDERS to supplier
  on.Order.created(async (order) => {
    // Transform to EDI
    const ediResult = toEDI('ORDERS', {
      orderNumber: order.id,
      orderDate: order.createdAt,
      deliveryDate: order.requestedDeliveryDate,
      buyer: order.customer,
      seller: order.supplier,
      items: order.items,
      currency: 'USD',
    })

    if (ediResult.success) {
      // Validate before sending
      const validation = validateEDI(ediResult.data)
      if (validation.valid) {
        await send.EDI.transmit({
          message: ediResult.data,
          recipient: order.supplier.identifier,
          protocol: 'AS2',
        })
      }
    }
  })

  // 2. Receive ORDRSP (Order Response) from supplier
  on.EDI.received(async (transmission) => {
    if (transmission.message.messageType === 'ORDRSP') {
      const result = fromEDI(transmission.message)

      if (result.success) {
        const response = result.data

        // Update order status
        await db.Order.update(response.orderReference, {
          status: response.responseCode === 'ACCEPTED' ? 'confirmed' : 'rejected',
          supplierResponse: response,
        })

        // Notify customer
        await send.Order.statusChanged({
          orderId: response.orderReference,
          newStatus: response.responseCode,
        })
      }
    }
  })

  // 3. Receive DESADV (ASN) from supplier
  on.EDI.received(async (transmission) => {
    if (transmission.message.messageType === 'DESADV') {
      const result = fromEDI(transmission.message)

      if (result.success) {
        const asn = result.data

        // Create shipment record
        await db.Shipment.create({
          ...asn,
          status: 'in_transit',
        })

        // Notify warehouse
        await send.Shipment.incoming(asn)
      }
    }
  })

  // 4. Goods received → Send RECADV to supplier
  on.Receipt.completed(async (receipt) => {
    const ediResult = toEDI('RECADV', {
      receiptNumber: receipt.id,
      receiptDate: receipt.completedAt,
      orderReference: receipt.orderId,
      shipmentReference: receipt.shipmentId,
      receiver: receipt.warehouse,
      supplier: receipt.supplier,
      items: receipt.items,
    })

    if (ediResult.success) {
      await send.EDI.transmit({
        message: ediResult.data,
        recipient: receipt.supplier.identifier,
      })
    }
  })

  // 5. Receive INVOIC from supplier
  on.EDI.received(async (transmission) => {
    if (transmission.message.messageType === 'INVOIC') {
      const result = fromEDI(transmission.message)

      if (result.success) {
        const invoice = result.data

        // Create invoice record
        await db.Invoice.create(invoice)

        // Submit for approval
        await send.Invoice.pendingApproval(invoice)
      }
    }
  })

  // 6. Payment processed → Send REMADV to supplier
  on.Payment.completed(async (payment) => {
    const ediResult = toEDI('REMADV', {
      remittanceNumber: payment.id,
      remittanceDate: payment.completedAt,
      payer: payment.payer,
      payee: payment.payee,
      totalAmount: payment.amount,
      currency: payment.currency,
      invoices: payment.invoices,
    })

    if (ediResult.success) {
      await send.EDI.transmit({
        message: ediResult.data,
        recipient: payment.payee.identifier,
      })
    }
  })
}
```

## Testing

```typescript
import { describe, it, expect } from 'vitest'
import { toEDI, fromEDI, validateEDI } from 'graphdl'

describe('EDI Transformations', () => {
  it('should transform purchase order to ORDERS', () => {
    const order = {
      orderNumber: 'PO-001',
      orderDate: '2024-10-10',
      buyer: { identifier: '1234567890123' },
      seller: { identifier: '9876543210987' },
      items: [
        {
          lineNumber: '1',
          productCode: '00012345678905',
          quantity: { value: 100, unit: 'EA' },
        },
      ],
    }

    const result = toEDI('ORDERS', order)

    expect(result.success).toBe(true)
    expect(result.data?.messageType).toBe('ORDERS')
    expect(result.data?.orderNumber).toBe('PO-001')
  })

  it('should parse ORDERS to purchase order', () => {
    const ediMessage = {
      $type: 'EDIDocument',
      $id: 'edi:orders:PO-001',
      messageType: 'ORDERS',
      orderNumber: 'PO-001',
      // ... full message
    }

    const result = fromEDI(ediMessage)

    expect(result.success).toBe(true)
    expect(result.data.$type).toBe('PurchaseOrder')
  })

  it('should validate EDI message', () => {
    const ediMessage = {
      $type: 'EDIDocument',
      $id: 'edi:orders:PO-001',
      messageType: 'ORDERS',
      // Missing required fields
    }

    const validation = validateEDI(ediMessage as any)

    expect(validation.valid).toBe(false)
    expect(validation.errors.length).toBeGreaterThan(0)
  })
})
```

## EDI Network Integration

### Overview

While this module handles EDI message transformation and validation, you'll need to integrate with an EDI network provider for actual message transmission. This section covers common integration patterns.

### EDI Network Protocols

#### AS2 (Applicability Statement 2)

**Best for**: Direct trading partner connections over HTTPS

```typescript
import { toEDI, validateEDI } from 'graphdl'
import { AS2Client } from '@your-org/as2-client' // Example library

async function sendViaAS2(messageType: string, data: any) {
  // Transform to EDI
  const result = toEDI(messageType, data)
  if (!result.success) throw new Error(result.error)

  // Validate
  const validation = validateEDI(result.data)
  if (!validation.valid) throw new Error('Validation failed')

  // Send via AS2
  const as2Client = new AS2Client({
    url: 'https://partner.example.com/as2',
    certificate: process.env.AS2_CERT,
    privateKey: process.env.AS2_KEY,
  })

  const response = await as2Client.send({
    message: JSON.stringify(result.data), // Or serialize to X12/EDIFACT format
    contentType: 'application/json',
    messageId: result.data.$id,
    as2From: 'YOUR-AS2-ID',
    as2To: 'PARTNER-AS2-ID',
  })

  return response.mdn // Message Disposition Notification
}
```

#### SFTP (Secure File Transfer Protocol)

**Best for**: Batch processing with periodic file exchanges

```typescript
import { toEDI } from 'graphdl'
import { SFTPClient } from 'ssh2-sftp-client'

async function sendViaSFTP(messages: any[]) {
  const sftp = new SFTPClient()

  try {
    await sftp.connect({
      host: process.env.SFTP_HOST,
      port: 22,
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS,
    })

    // Transform messages
    const ediMessages = messages.map((msg) => toEDI(msg.type, msg.data))

    // Create batch file
    const batchContent = ediMessages
      .filter((r) => r.success)
      .map((r) => JSON.stringify(r.data))
      .join('\n')

    // Upload to SFTP
    const fileName = `EDI_BATCH_${Date.now()}.json`
    await sftp.put(Buffer.from(batchContent), `/outbound/${fileName}`)

    return fileName
  } finally {
    await sftp.end()
  }
}
```

#### VAN (Value-Added Network)

**Best for**: Multiple trading partners with managed service

```typescript
import { toEDI } from 'graphdl'
import axios from 'axios'

async function sendViaVAN(messageType: string, data: any, recipient: string) {
  const result = toEDI(messageType, data)
  if (!result.success) throw new Error(result.error)

  // Send to VAN provider (e.g., TrueCommerce, SPS Commerce, OpenText)
  const response = await axios.post(
    'https://api.van-provider.com/messages',
    {
      message: result.data,
      sender: process.env.VAN_SENDER_ID,
      receiver: recipient,
      messageType: messageType,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.VAN_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data.transmissionId
}
```

### Error Recovery Strategies

#### Acknowledgment Handling

```typescript
import { toEDI, fromEDI } from 'graphdl'

// Send message and wait for CONTRL (acknowledgment)
async function sendWithAcknowledgment(messageType: string, data: any) {
  const result = toEDI(messageType, data)
  if (!result.success) throw new Error(result.error)

  // Send message
  const transmissionId = await transmitEDI(result.data)

  // Store pending acknowledgment
  await db.EDITransmission.create({
    transmissionId,
    messageId: result.data.$id,
    status: 'pending',
    sentAt: new Date().toISOString(),
    retryCount: 0,
  })

  return transmissionId
}

// Handle incoming CONTRL acknowledgment
on.EDI.acknowledgmentReceived(async (ack) => {
  const transmission = await db.EDITransmission.get(ack.messageReference)

  if (ack.status === 'ACCEPTED') {
    await db.EDITransmission.update(ack.messageReference, {
      status: 'acknowledged',
      acknowledgedAt: new Date().toISOString(),
    })
  } else {
    // Handle rejection
    await db.EDITransmission.update(ack.messageReference, {
      status: 'rejected',
      errors: ack.errors,
    })

    // Trigger retry or manual review
    await send.EDI.transmissionFailed({
      transmissionId: ack.messageReference,
      errors: ack.errors,
    })
  }
})
```

#### Retry Logic

```typescript
import { toEDI } from 'graphdl'

async function sendWithRetry(messageType: string, data: any, maxRetries = 3): Promise<string> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = toEDI(messageType, data)
      if (!result.success) throw new Error(result.error)

      const transmissionId = await transmitEDI(result.data)

      // Log successful transmission
      await db.EDITransmission.create({
        transmissionId,
        messageId: result.data.$id,
        status: 'sent',
        attempt,
      })

      return transmissionId
    } catch (error) {
      lastError = error as Error

      if (attempt < maxRetries) {
        // Exponential backoff
        const delayMs = Math.pow(2, attempt) * 1000
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message}`)
}
```

### Performance Considerations

#### Bulk Processing

For high-volume EDI operations, batch process messages:

```typescript
import { toEDI } from 'graphdl'

async function processBatch(orders: any[]) {
  const batchSize = 100
  const results = []

  for (let i = 0; i < orders.length; i += batchSize) {
    const batch = orders.slice(i, i + batchSize)

    // Transform in parallel
    const ediResults = await Promise.all(batch.map((order) => toEDI('ORDERS', order)))

    // Send valid messages
    const validMessages = ediResults.filter((r) => r.success)
    const transmissions = await Promise.all(validMessages.map((r) => transmitEDI(r.data)))

    results.push(...transmissions)
  }

  return results
}
```

#### Rate Limiting

Respect trading partner rate limits:

```typescript
class RateLimiter {
  private queue: Array<() => Promise<any>> = []
  private running = 0

  constructor(
    private maxConcurrent: number,
    private delayMs: number
  ) {}

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.process()
    })
  }

  private async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return
    }

    this.running++
    const fn = this.queue.shift()!

    await fn()
    await new Promise((resolve) => setTimeout(resolve, this.delayMs))

    this.running--
    this.process()
  }
}

// Usage
const limiter = new RateLimiter(5, 200) // 5 concurrent, 200ms delay

async function sendOrders(orders: any[]) {
  return Promise.all(orders.map((order) => limiter.add(() => sendEDIMessage('ORDERS', order))))
}
```

### Testing EDI Integrations

#### Mock EDI Network

```typescript
class MockEDINetwork {
  private messages: Map<string, any> = new Map()

  async send(message: any): Promise<string> {
    const id = `tx-${Date.now()}`
    this.messages.set(id, message)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    return id
  }

  async receive(transmissionId: string): Promise<any> {
    return this.messages.get(transmissionId)
  }
}

// In tests
describe('EDI Integration', () => {
  const mockNetwork = new MockEDINetwork()

  it('should send and receive EDI message', async () => {
    const order = {
      /* ... */
    }
    const result = toEDI('ORDERS', order)

    const txId = await mockNetwork.send(result.data)
    const received = await mockNetwork.receive(txId)

    expect(received.messageType).toBe('ORDERS')
  })
})
```

### Security Best Practices

1. **Encryption**: Always use TLS/SSL for transmission
2. **Authentication**: Use certificates (AS2) or API keys (VAN)
3. **Validation**: Validate all incoming messages before processing
4. **Audit Trail**: Log all transmissions and acknowledgments
5. **Access Control**: Restrict EDI endpoints to authorized partners
6. **Data Retention**: Follow compliance requirements for EDI archives

## Resources

- [UN/EDIFACT Standards](https://unece.org/trade/uncefact/introducing-unedifact)
- [Message Directory](https://unece.org/trade/uncefact/unedifact-directories)
- [Implementation Guidelines](https://unece.org/trade/uncefact/implementation)
- [UN/CEFACT](https://unece.org/trade/uncefact)
- [AS2 Protocol](https://datatracker.ietf.org/doc/html/rfc4130)
- [SFTP Best Practices](https://tools.ietf.org/html/draft-ietf-secsh-filexfer-13)

## Contributing

To add support for additional message types:

1. Define the TypeScript interface in `src/types/edi.ts`
2. Add transformation functions in `src/utils/edi.ts`
3. Update the event mapping constants
4. Add tests and documentation
5. Submit a pull request
