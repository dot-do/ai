/**
 * Modern API Endpoints for EDI Integration
 *
 * RESTful API and webhook endpoints for UN/EDIFACT message processing
 *
 * NOTE: This example requires Express. To use this example, install Express:
 * ```bash
 * pnpm add express
 * pnpm add -D @types/express
 * ```
 */

import { Router } from 'express'
import { toEDI, fromEDI, validateEDI, getEventPattern, getMessageType } from '../src/index.js'
import type { Request, Response } from 'express'

const router = Router()

// ============================================================================
// Outbound EDI Endpoints (Send EDI Messages)
// ============================================================================

/**
 * POST /api/edi/orders
 * Send purchase order (ORDERS message)
 */
router.post('/api/edi/orders', async (req: Request, res: Response) => {
  try {
    // Transform to EDI
    const result = toEDI('ORDERS', req.body)

    if (!result.success) {
      return res.status(400).json({
        error: 'Transformation failed',
        details: result.error,
      })
    }

    // Validate
    const validation = validateEDI(result.data)
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        errors: validation.errors,
        warnings: validation.warnings,
      })
    }

    // Transmit (implementation depends on EDI network provider)
    const transmissionId = await transmitEDI(result.data, {
      protocol: 'AS2',
      recipient: req.body.seller?.identifier,
    })

    res.json({
      success: true,
      messageId: result.data.$id,
      transmissionId,
      messageType: 'ORDERS',
    })
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
    })
  }
})

/**
 * POST /api/edi/invoice
 * Send invoice (INVOIC message)
 */
router.post('/api/edi/invoice', async (req: Request, res: Response) => {
  try {
    const result = toEDI('INVOIC', req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    const validation = validateEDI(result.data)
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors })
    }

    const transmissionId = await transmitEDI(result.data)

    res.json({
      success: true,
      messageId: result.data.$id,
      transmissionId,
    })
  } catch (error) {
    res.status(500).json({ error: String(error) })
  }
})

/**
 * POST /api/edi/asn
 * Send advance ship notice (DESADV message)
 */
router.post('/api/edi/asn', async (req: Request, res: Response) => {
  try {
    const result = toEDI('DESADV', req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    const validation = validateEDI(result.data)
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors })
    }

    const transmissionId = await transmitEDI(result.data)

    res.json({
      success: true,
      messageId: result.data.$id,
      transmissionId,
      trackingUrl: `/api/edi/messages/${result.data.$id}`,
    })
  } catch (error) {
    res.status(500).json({ error: String(error) })
  }
})

/**
 * POST /api/edi/quote
 * Send quote (QUOTES message)
 */
router.post('/api/edi/quote', async (req: Request, res: Response) => {
  try {
    const result = toEDI('QUOTES', req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    const transmissionId = await transmitEDI(result.data)

    res.json({
      success: true,
      messageId: result.data.$id,
      transmissionId,
    })
  } catch (error) {
    res.status(500).json({ error: String(error) })
  }
})

// ============================================================================
// Inbound EDI Webhooks (Receive EDI Messages)
// ============================================================================

/**
 * POST /webhook/edi/orders
 * Receive purchase order (ORDERS message)
 */
router.post('/webhook/edi/orders', async (req: Request, res: Response) => {
  try {
    const ediMessage = req.body

    // Validate
    const validation = validateEDI(ediMessage)
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        errors: validation.errors,
      })
    }

    // Transform
    const result = fromEDI(ediMessage)
    if (!result.success) {
      return res.status(400).json({
        error: 'Transformation failed',
        details: result.error,
      })
    }

    // Store in database
    const order = await db.PurchaseOrder.create(result.data)

    // Emit business event
    await eventBus.emit('$.PurchaseOrder.created', order)

    // Send acknowledgment
    res.json({
      success: true,
      orderId: order.$id,
      acknowledgment: {
        status: 'ACCEPTED',
        messageReference: ediMessage.$id,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    res.status(500).json({ error: String(error) })
  }
})

/**
 * POST /webhook/edi/invoice
 * Receive invoice (INVOIC message)
 */
router.post('/webhook/edi/invoice', async (req: Request, res: Response) => {
  try {
    const ediMessage = req.body
    const validation = validateEDI(ediMessage)

    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors })
    }

    const result = fromEDI(ediMessage)
    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    const invoice = await db.Invoice.create(result.data)
    await eventBus.emit('$.Invoice.received', invoice)

    res.json({
      success: true,
      invoiceId: invoice.$id,
      acknowledgment: { status: 'ACCEPTED' },
    })
  } catch (error) {
    res.status(500).json({ error: String(error) })
  }
})

/**
 * POST /webhook/edi/asn
 * Receive advance ship notice (DESADV message)
 */
router.post('/webhook/edi/asn', async (req: Request, res: Response) => {
  try {
    const ediMessage = req.body
    const validation = validateEDI(ediMessage)

    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors })
    }

    const result = fromEDI(ediMessage)
    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    const shipment = await db.Shipment.create(result.data)
    await eventBus.emit('$.Shipment.notified', shipment)

    res.json({
      success: true,
      shipmentId: shipment.$id,
      acknowledgment: { status: 'ACCEPTED' },
    })
  } catch (error) {
    res.status(500).json({ error: String(error) })
  }
})

/**
 * POST /webhook/edi/response
 * Receive order response (ORDRSP message)
 */
router.post('/webhook/edi/response', async (req: Request, res: Response) => {
  try {
    const ediMessage = req.body
    const result = fromEDI(ediMessage)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    const response = result.data

    // Update original order
    await db.PurchaseOrder.update(response.orderReference, {
      status: response.responseCode === 'ACCEPTED' ? 'confirmed' : 'rejected',
      supplierResponse: response,
      respondedAt: new Date().toISOString(),
    })

    await eventBus.emit('$.OrderResponse.received', response)

    res.json({
      success: true,
      orderReference: response.orderReference,
      acknowledgment: { status: 'ACCEPTED' },
    })
  } catch (error) {
    res.status(500).json({ error: String(error) })
  }
})

// ============================================================================
// Query and Management Endpoints
// ============================================================================

/**
 * GET /api/edi/messages
 * List EDI messages with filtering
 */
router.get('/api/edi/messages', async (req: Request, res: Response) => {
  try {
    const { messageType, sender, receiver, dateFrom, dateTo, limit = '50', offset = '0' } = req.query

    const filters: any = {}
    if (messageType) filters.messageType = messageType
    if (sender) filters['sender.identifier'] = sender
    if (receiver) filters['receiver.identifier'] = receiver
    if (dateFrom) filters.documentDate = { $gte: dateFrom }
    if (dateTo) filters.documentDate = { ...filters.documentDate, $lte: dateTo }

    const messages = await db.EDIMessage.list({
      filters,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      sort: { documentDate: -1 },
    })

    res.json({
      messages: messages.items,
      total: messages.total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error) {
    res.status(500).json({ error: String(error) })
  }
})

/**
 * GET /api/edi/messages/:id
 * Get specific EDI message
 */
router.get('/api/edi/messages/:id', async (req: Request, res: Response) => {
  try {
    const message = await db.EDIMessage.get(req.params.id)

    if (!message) {
      return res.status(404).json({
        error: 'Message not found',
        messageId: req.params.id,
      })
    }

    // Get associated business object
    const eventPattern = getEventPattern(message.messageType)
    const businessObject = await db[eventPattern.split('.')[1]].get(message.documentNumber)

    res.json({
      message,
      businessObject,
      eventPattern,
    })
  } catch (error) {
    res.status(500).json({ error: String(error) })
  }
})

/**
 * GET /api/edi/mappings
 * Get EDI to event mappings
 */
router.get('/api/edi/mappings', async (req: Request, res: Response) => {
  const mappings = [
    { ediType: 'ORDERS', eventPattern: '$.PurchaseOrder.created' },
    { ediType: 'INVOIC', eventPattern: '$.Invoice.sent' },
    { ediType: 'DESADV', eventPattern: '$.ShippingNotice.sent' },
    { ediType: 'RECADV', eventPattern: '$.Receipt.confirmed' },
    { ediType: 'ORDRSP', eventPattern: '$.OrderResponse.received' },
    { ediType: 'ORDCHG', eventPattern: '$.PurchaseOrder.updated' },
    { ediType: 'SLSRPT', eventPattern: '$.SalesReport.generated' },
    { ediType: 'INVRPT', eventPattern: '$.InventoryReport.generated' },
    { ediType: 'PARTIN', eventPattern: '$.Party.registered' },
    { ediType: 'PRICAT', eventPattern: '$.Catalog.published' },
    { ediType: 'PRODAT', eventPattern: '$.Product.published' },
    { ediType: 'QUOTES', eventPattern: '$.Quote.sent' },
    { ediType: 'REMADV', eventPattern: '$.Payment.remitted' },
  ]

  res.json({ mappings })
})

/**
 * POST /api/edi/validate
 * Validate EDI message without sending
 */
router.post('/api/edi/validate', async (req: Request, res: Response) => {
  try {
    const validation = validateEDI(req.body)

    res.json({
      valid: validation.valid,
      errors: validation.errors,
      warnings: validation.warnings,
    })
  } catch (error) {
    res.status(500).json({ error: String(error) })
  }
})

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * EDI Transmission Options
 */
interface TransmissionOptions {
  protocol?: 'AS2' | 'SFTP' | 'HTTPS' | 'FTPS'
  recipient?: string
  encoding?: 'UTF-8' | 'ISO-8859-1' | 'ASCII'
  compression?: boolean
  encryption?: boolean
}

/**
 * Transmit EDI message to trading partner
 * NOTE: This is a mock implementation. In production, integrate with your EDI network provider
 * (e.g., AS2 gateway, VAN provider, SFTP server, etc.)
 */
async function transmitEDI(message: any, options?: TransmissionOptions): Promise<string> {
  // NOTE: Placeholder implementation - replace with actual EDI network integration
  // Implementers should integrate with their EDI network provider:
  // - Connect to AS2 gateway / VAN provider / SFTP server
  // - Apply encryption and compression if specified
  // - Handle acknowledgments (CONTRL messages)
  // - Implement retry logic for failed transmissions
  //
  // Example integrations:
  // - AS2: Use AS2 client library (e.g., @node-a2, as2-lib)
  // - SFTP: Use ssh2-sftp-client or similar
  // - VAN: Use provider-specific SDK (e.g., Sterling B2B, TrueCommerce)
  console.log('Transmitting EDI:', message.messageType, message.$id, options)
  return `tx-${Date.now()}`
}

// ============================================================================
// Type-Safe Database and Event Bus Interfaces
// ============================================================================

/**
 * Database interface for storing business objects
 * NOTE: This is a mock interface. In production, integrate with sdk.do's db functions
 */
interface Database {
  PurchaseOrder: DatabaseCollection
  Invoice: DatabaseCollection
  Shipment: DatabaseCollection
  EDIMessage: DatabaseCollection
  [key: string]: DatabaseCollection
}

interface DatabaseCollection {
  create(data: any): Promise<any>
  get(id: string): Promise<any>
  update(id: string, data: any): Promise<any>
  list(options: any): Promise<{ items: any[]; total: number }>
}

/**
 * Event bus interface for publishing events
 * NOTE: This is a mock interface. In production, integrate with sdk.do's send function
 */
interface EventBus {
  emit(event: string, data: any): Promise<void>
}

/**
 * Mock database implementation
 * Replace with actual sdk.do db integration:
 * ```typescript
 * import { db } from 'sdk.do'
 * // Use db.PurchaseOrder.create(), db.Invoice.get(), etc.
 * ```
 */
const db: Database = {
  PurchaseOrder: createMockCollection(),
  Invoice: createMockCollection(),
  Shipment: createMockCollection(),
  EDIMessage: createMockCollection(),
}

/**
 * Mock event bus implementation
 * Replace with actual sdk.do send function:
 * ```typescript
 * import { send } from 'sdk.do'
 * // Use send('$.PurchaseOrder.created', order)
 * ```
 */
const eventBus: EventBus = {
  emit: async (event: string, data: any) => {
    console.log('Event emitted:', event, data.$id || data.id)
  },
}

function createMockCollection(): DatabaseCollection {
  const storage = new Map<string, any>()
  return {
    create: async (data: any) => {
      const id = data.$id || `${Date.now()}`
      storage.set(id, { ...data, $id: id })
      return storage.get(id)
    },
    get: async (id: string) => storage.get(id),
    update: async (id: string, data: any) => {
      const existing = storage.get(id)
      if (!existing) throw new Error(`Record not found: ${id}`)
      const updated = { ...existing, ...data }
      storage.set(id, updated)
      return updated
    },
    list: async (options: any) => {
      const items = Array.from(storage.values())
      return { items, total: items.length }
    },
  }
}

export default router
