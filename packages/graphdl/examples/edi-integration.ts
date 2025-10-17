/**
 * Stream-Based EDI Integration Example
 *
 * Demonstrates how to integrate UN/EDIFACT messages with modern event streams
 * using semantic patterns ($.Subject.predicate.Object)
 */

import { toEDI, fromEDI, getEventPattern, validateEDI } from '../src/index.js'
import type { BusinessContext } from './types.js'

export default ($: BusinessContext) => {
  const { on, send, db } = $

  // ============================================================================
  // Outbound EDI: Business Events → EDI Messages
  // ============================================================================

  // When purchase order created, send EDI ORDERS
  on.PurchaseOrder.created(async (order) => {
    console.log(`[EDI] Generating ORDERS for ${order.orderNumber}`)

    const result = toEDI('ORDERS', order)

    if (!result.success) {
      console.error(`[EDI] Failed to generate ORDERS: ${result.error}`)
      return
    }

    // Validate before sending
    const validation = validateEDI(result.data)
    if (!validation.valid) {
      console.error('[EDI] Validation failed:', validation.errors)
      return
    }

    // Transmit via EDI network
    await send.EDI.transmit({
      message: result.data,
      recipient: order.seller.identifier,
      protocol: 'AS2',
      acknowledgment: true,
    })

    console.log(`[EDI] Sent ORDERS for ${order.orderNumber}`)
  })

  // When invoice sent, generate EDI INVOIC
  on.Invoice.sent(async (invoice) => {
    console.log(`[EDI] Generating INVOIC for ${invoice.invoiceNumber}`)

    const result = toEDI('INVOIC', invoice)

    if (result.success) {
      await send.EDI.transmit({
        message: result.data,
        recipient: invoice.buyer.identifier,
        protocol: 'AS2',
      })

      console.log(`[EDI] Sent INVOIC for ${invoice.invoiceNumber}`)
    }
  })

  // When shipment ready, send EDI DESADV (ASN)
  on.Shipment.ready(async (shipment) => {
    console.log(`[EDI] Generating DESADV for ${shipment.shipmentNumber}`)

    const result = toEDI('DESADV', shipment)

    if (result.success) {
      await send.EDI.transmit({
        message: result.data,
        recipient: shipment.consignee.identifier,
        protocol: 'AS2',
      })

      console.log(`[EDI] Sent DESADV for ${shipment.shipmentNumber}`)
    }
  })

  // When payment remitted, send REMADV
  on.Payment.remitted(async (payment) => {
    console.log(`[EDI] Generating REMADV for payment ${payment.id}`)

    const result = toEDI('REMADV', payment)

    if (result.success) {
      await send.EDI.transmit({
        message: result.data,
        recipient: payment.payee.identifier,
        protocol: 'AS2',
      })

      console.log(`[EDI] Sent REMADV for payment ${payment.id}`)
    }
  })

  // ============================================================================
  // Inbound EDI: EDI Messages → Business Events
  // ============================================================================

  // When EDI message received, process based on type
  on.EDI.received(async (transmission) => {
    const { message } = transmission

    console.log(`[EDI] Received ${message.messageType} from ${message.sender.identifier}`)

    // Validate message
    const validation = validateEDI(message)
    if (!validation.valid) {
      console.error('[EDI] Validation failed:', validation.errors)
      await send.EDI.acknowledgment({
        messageReference: message.$id,
        status: 'REJECTED',
        errors: validation.errors,
      })
      return
    }

    // Transform to business object
    const result = fromEDI(message)
    if (!result.success) {
      console.error('[EDI] Transformation failed:', result.error)
      await send.EDI.acknowledgment({
        messageReference: message.$id,
        status: 'REJECTED',
        errors: [{ field: 'message', message: result.error }],
      })
      return
    }

    // Get semantic event pattern
    const eventPattern = getEventPattern(message.messageType)
    console.log(`[EDI] Emitting event: ${eventPattern}`)

    // Emit business event
    await send[eventPattern](result.data)

    // Send acknowledgment
    await send.EDI.acknowledgment({
      messageReference: message.$id,
      status: 'ACCEPTED',
      timestamp: new Date().toISOString(),
    })

    console.log(`[EDI] Processed ${message.messageType} successfully`)
  })

  // ============================================================================
  // Specific Message Type Handlers
  // ============================================================================

  // Handle incoming purchase orders
  on.EDI.received(async (transmission) => {
    if (transmission.message.messageType === 'ORDERS') {
      const result = fromEDI(transmission.message)

      if (result.success) {
        const order = result.data

        // Store in database
        await db.PurchaseOrder.create(order)

        // Send order response
        setTimeout(async () => {
          const response = toEDI('ORDRSP', {
            responseNumber: `RSP-${order.orderNumber}`,
            responseDate: new Date().toISOString(),
            orderReference: order.orderNumber,
            responseCode: 'ACCEPTED',
            buyer: order.buyer,
            seller: order.seller,
            items: order.items.map((item) => ({
              ...item,
              lineStatus: 'ACCEPTED',
              confirmedQuantity: item.quantity,
              confirmedPrice: item.unitPrice,
            })),
          })

          if (response.success) {
            await send.EDI.transmit({
              message: response.data,
              recipient: order.buyer.identifier,
            })
          }
        }, 1000)
      }
    }
  })

  // Handle incoming invoices
  on.EDI.received(async (transmission) => {
    if (transmission.message.messageType === 'INVOIC') {
      const result = fromEDI(transmission.message)

      if (result.success) {
        const invoice = result.data

        // Store invoice
        await db.Invoice.create(invoice)

        // Submit for approval workflow
        await send.Invoice.pendingApproval({
          ...invoice,
          approvalRequired: invoice.total.value > 10000,
        })
      }
    }
  })

  // Handle incoming ASNs
  on.EDI.received(async (transmission) => {
    if (transmission.message.messageType === 'DESADV') {
      const result = fromEDI(transmission.message)

      if (result.success) {
        const asn = result.data

        // Create shipment record
        await db.Shipment.create({
          ...asn,
          status: 'in_transit',
          expectedArrival: asn.deliveryDate,
        })

        // Notify warehouse to prepare for receiving
        await send.Warehouse.prepareReceiving({
          shipmentNumber: asn.shipmentNumber,
          expectedDate: asn.deliveryDate,
          items: asn.items,
        })
      }
    }
  })

  // ============================================================================
  // Error Handling and Monitoring
  // ============================================================================

  // Log EDI transmission failures
  on.EDI.transmissionFailed(async (failure) => {
    console.error('[EDI] Transmission failed:', {
      messageId: failure.messageId,
      messageType: failure.messageType,
      recipient: failure.recipient,
      error: failure.error,
    })

    // Retry logic
    if (failure.retryCount < 3) {
      await send.EDI.retry({
        ...failure,
        retryCount: failure.retryCount + 1,
        nextRetry: new Date(Date.now() + 60000).toISOString(), // Retry in 1 minute
      })
    }
  })

  // Monitor EDI acknowledgments
  on.EDI.acknowledgment(async (ack) => {
    console.log('[EDI] Acknowledgment received:', {
      messageReference: ack.messageReference,
      status: ack.status,
    })

    if (ack.status === 'REJECTED') {
      console.error('[EDI] Message rejected:', ack.errors)
    }
  })
}
