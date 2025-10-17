/**
 * EDI Transformation Tests
 */

import { describe, it, expect } from 'vitest'
import { toEDI, fromEDI, validateEDI, getEventPattern, getMessageType } from './edi.js'
import type {
  Party,
  PurchaseOrderEDI,
  InvoiceEDI,
  ReceivingAdviceEDI,
  OrderResponseEDI,
  SalesReportEDI,
  InventoryReportEDI,
  QuoteEDI,
  RemittanceAdviceEDI,
} from '../types/edi.js'

describe('EDI Transformations', () => {
  const buyerParty: Party = {
    $type: 'Party',
    identifier: '1234567890123',
    identifierType: 'GLN',
    name: 'Buyer Corp',
  }

  const sellerParty: Party = {
    $type: 'Party',
    identifier: '9876543210987',
    identifierType: 'GLN',
    name: 'Seller Inc',
  }

  describe('toEDI', () => {
    it('should transform purchase order to ORDERS', () => {
      const order = {
        orderNumber: 'PO-001',
        orderDate: '2024-10-10',
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

      const result = toEDI('ORDERS', order)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.messageType).toBe('ORDERS')
      expect(result.data?.$type).toBe('EDIDocument')
      expect((result.data as PurchaseOrderEDI)?.orderNumber).toBe('PO-001')
      expect((result.data as PurchaseOrderEDI)?.buyer).toEqual(buyerParty)
    })

    it('should transform invoice to INVOIC', () => {
      const invoice = {
        invoiceNumber: 'INV-001',
        invoiceDate: '2024-10-10',
        buyer: buyerParty,
        seller: sellerParty,
        items: [
          {
            lineNumber: '1',
            productCode: '00012345678905',
            quantity: { value: 100, unit: 'EA' },
            unitPrice: { value: 25.5, currency: 'USD' },
            lineAmount: { value: 2550, currency: 'USD' },
          },
        ],
        total: { value: 2550, currency: 'USD' },
        currency: 'USD',
      }

      const result = toEDI('INVOIC', invoice)

      expect(result.success).toBe(true)
      expect(result.data?.messageType).toBe('INVOIC')
      expect((result.data as InvoiceEDI)?.invoiceNumber).toBe('INV-001')
    })

    it('should transform shipment to DESADV', () => {
      const shipment = {
        shipmentNumber: 'SHP-001',
        shipmentDate: '2024-10-10',
        shipper: sellerParty,
        consignee: buyerParty,
        items: [],
        packages: [],
      }

      const result = toEDI('DESADV', shipment)

      expect(result.success).toBe(true)
      expect(result.data?.messageType).toBe('DESADV')
    })

    it('should handle unsupported message type', () => {
      const result = toEDI('INVALID' as any, {})

      expect(result.success).toBe(false)
      expect(result.error).toContain('Unsupported message type')
    })
  })

  describe('fromEDI', () => {
    it('should parse ORDERS to purchase order', () => {
      const ediMessage: PurchaseOrderEDI = {
        $type: 'EDIDocument',
        $id: 'edi:orders:PO-001',
        messageType: 'ORDERS',
        sender: buyerParty,
        receiver: sellerParty,
        documentDate: '2024-10-10',
        documentNumber: 'PO-001',
        orderNumber: 'PO-001',
        orderDate: '2024-10-10',
        buyer: buyerParty,
        seller: sellerParty,
        items: [
          {
            lineNumber: '1',
            productCode: '00012345678905',
            quantity: { value: 100, unit: 'EA' },
          },
        ],
      }

      const result = fromEDI(ediMessage)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data.$type).toBe('PurchaseOrder')
      expect(result.data.orderNumber).toBe('PO-001')
    })

    it('should parse INVOIC to invoice', () => {
      const ediMessage: InvoiceEDI = {
        $type: 'EDIDocument',
        $id: 'edi:invoic:INV-001',
        messageType: 'INVOIC',
        sender: sellerParty,
        receiver: buyerParty,
        documentDate: '2024-10-10',
        documentNumber: 'INV-001',
        invoiceNumber: 'INV-001',
        invoiceDate: '2024-10-10',
        buyer: buyerParty,
        seller: sellerParty,
        items: [],
        total: { value: 2550, currency: 'USD' },
        currency: 'USD',
      }

      const result = fromEDI(ediMessage)

      expect(result.success).toBe(true)
      expect(result.data.$type).toBe('Invoice')
      expect(result.data.invoiceNumber).toBe('INV-001')
    })
  })

  describe('validateEDI', () => {
    it('should validate valid EDI message', () => {
      const ediMessage: PurchaseOrderEDI = {
        $type: 'EDIDocument',
        $id: 'edi:orders:PO-001',
        messageType: 'ORDERS',
        sender: buyerParty,
        receiver: sellerParty,
        documentDate: '2024-10-10',
        documentNumber: 'PO-001',
        orderNumber: 'PO-001',
        orderDate: '2024-10-10',
        buyer: buyerParty,
        seller: sellerParty,
        items: [
          {
            lineNumber: '1',
            productCode: '00012345678905',
            quantity: { value: 100, unit: 'EA' },
          },
        ],
        currency: 'USD',
      }

      const validation = validateEDI(ediMessage)

      expect(validation.valid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should detect missing required fields', () => {
      const ediMessage = {
        $type: 'EDIDocument',
        messageType: 'ORDERS',
        // Missing required fields
      }

      const validation = validateEDI(ediMessage as any)

      expect(validation.valid).toBe(false)
      expect(validation.errors.length).toBeGreaterThan(0)
    })

    it('should detect invalid $type', () => {
      const ediMessage = {
        $type: 'Invalid',
        $id: 'test',
        messageType: 'ORDERS',
        sender: buyerParty,
        receiver: sellerParty,
        documentDate: '2024-10-10',
        documentNumber: 'PO-001',
      }

      const validation = validateEDI(ediMessage as any)

      expect(validation.valid).toBe(false)
      expect(validation.errors.some((e) => e.field === '$type')).toBe(true)
    })

    it('should detect missing party identifiers', () => {
      const invalidParty = { $type: 'Party' as const }

      const ediMessage = {
        $type: 'EDIDocument',
        $id: 'test',
        messageType: 'ORDERS',
        sender: invalidParty,
        receiver: invalidParty,
        documentDate: '2024-10-10',
        documentNumber: 'PO-001',
      }

      const validation = validateEDI(ediMessage as any)

      expect(validation.valid).toBe(false)
      expect(validation.errors.some((e) => e.field.includes('identifier'))).toBe(true)
    })
  })

  describe('Event Pattern Mappings', () => {
    it('should get event pattern for message type', () => {
      expect(getEventPattern('ORDERS')).toBe('$.PurchaseOrder.created')
      expect(getEventPattern('INVOIC')).toBe('$.Invoice.sent')
      expect(getEventPattern('DESADV')).toBe('$.ShippingNotice.sent')
      expect(getEventPattern('RECADV')).toBe('$.Receipt.confirmed')
    })

    it('should get message type for event pattern', () => {
      expect(getMessageType('$.PurchaseOrder.created')).toBe('ORDERS')
      expect(getMessageType('$.Invoice.sent')).toBe('INVOIC')
      expect(getMessageType('$.ShippingNotice.sent')).toBe('DESADV')
      expect(getMessageType('$.Receipt.confirmed')).toBe('RECADV')
    })

    it('should return undefined for unknown event pattern', () => {
      expect(getMessageType('$.Unknown.event')).toBeUndefined()
    })
  })

  describe('Round-trip Transformation', () => {
    it('should preserve data through round-trip transformation', () => {
      const originalOrder = {
        orderNumber: 'PO-001',
        orderDate: '2024-10-10',
        buyer: buyerParty,
        seller: sellerParty,
        items: [
          {
            lineNumber: '1',
            productCode: '00012345678905',
            quantity: { value: 100, unit: 'EA' },
            unitPrice: { value: 25.5, currency: 'USD' },
          },
        ],
        currency: 'USD',
      }

      // To EDI
      const ediResult = toEDI('ORDERS', originalOrder)
      expect(ediResult.success).toBe(true)

      // From EDI
      const businessResult = fromEDI(ediResult.data!)
      expect(businessResult.success).toBe(true)

      // Verify key data preserved
      expect(businessResult.data.orderNumber).toBe(originalOrder.orderNumber)
      expect(businessResult.data.orderDate).toBe(originalOrder.orderDate)
      expect(businessResult.data.items).toHaveLength(1)
    })
  })

  describe('New Message Types - RECADV', () => {
    it('should transform receiving advice to RECADV', () => {
      const receipt = {
        receiptNumber: 'RCV-001',
        receiptDate: '2024-10-10',
        orderReference: 'PO-001',
        receiver: buyerParty,
        supplier: sellerParty,
        items: [
          {
            lineNumber: '1',
            productCode: '00012345678905',
            quantity: { value: 100, unit: 'EA' },
            receivedQuantity: { value: 98, unit: 'EA' },
            acceptedQuantity: { value: 95, unit: 'EA' },
            rejectedQuantity: { value: 3, unit: 'EA' },
          },
        ],
      }

      const result = toEDI('RECADV', receipt)

      expect(result.success).toBe(true)
      expect(result.data?.messageType).toBe('RECADV')
      expect((result.data as ReceivingAdviceEDI)?.receiptNumber).toBe('RCV-001')
    })

    it('should validate RECADV message', () => {
      const ediMessage: ReceivingAdviceEDI = {
        $type: 'EDIDocument',
        $id: 'edi:recadv:RCV-001',
        messageType: 'RECADV',
        sender: buyerParty,
        documentDate: '2024-10-10',
        documentNumber: 'RCV-001',
        receiptNumber: 'RCV-001',
        receiptDate: '2024-10-10',
        receiver: buyerParty,
        supplier: sellerParty,
        items: [
          {
            lineNumber: '1',
            productCode: '00012345678905',
            quantity: { value: 100, unit: 'EA' },
            receivedQuantity: { value: 100, unit: 'EA' },
          },
        ],
      }

      const validation = validateEDI(ediMessage)
      expect(validation.valid).toBe(true)
    })
  })

  describe('New Message Types - ORDRSP', () => {
    it('should transform order response to ORDRSP', () => {
      const response = {
        responseNumber: 'RSP-001',
        responseDate: '2024-10-10',
        orderReference: 'PO-001',
        responseCode: 'ACCEPTED' as const,
        buyer: buyerParty,
        seller: sellerParty,
        items: [
          {
            lineNumber: '1',
            productCode: '00012345678905',
            quantity: { value: 100, unit: 'EA' },
            lineStatus: 'ACCEPTED' as const,
          },
        ],
      }

      const result = toEDI('ORDRSP', response)

      expect(result.success).toBe(true)
      expect(result.data?.messageType).toBe('ORDRSP')
      expect((result.data as OrderResponseEDI)?.responseCode).toBe('ACCEPTED')
    })
  })

  describe('New Message Types - ORDCHG', () => {
    it('should transform order change to ORDCHG', () => {
      const change = {
        orderNumber: 'PO-001-REV2',
        orderDate: '2024-10-10',
        originalOrderNumber: 'PO-001',
        changeReason: 'Quantity adjustment',
        buyer: buyerParty,
        seller: sellerParty,
        items: [
          {
            lineNumber: '1',
            productCode: '00012345678905',
            quantity: { value: 150, unit: 'EA' },
          },
        ],
      }

      const result = toEDI('ORDCHG', change)

      expect(result.success).toBe(true)
      expect(result.data?.messageType).toBe('ORDCHG')
    })
  })

  describe('New Message Types - SLSRPT', () => {
    it('should transform sales report to SLSRPT', () => {
      const report = {
        reportNumber: 'SLS-2024-10',
        reportDate: '2024-10-10',
        reportPeriodStart: '2024-10-01',
        reportPeriodEnd: '2024-10-31',
        reporter: sellerParty,
        recipient: buyerParty,
        items: [
          {
            productCode: '00012345678905',
            quantitySold: { value: 500, unit: 'EA' },
            salesAmount: { value: 12750, currency: 'USD' },
          },
        ],
      }

      const result = toEDI('SLSRPT', report)

      expect(result.success).toBe(true)
      expect(result.data?.messageType).toBe('SLSRPT')
      expect((result.data as SalesReportEDI)?.reportNumber).toBe('SLS-2024-10')
    })

    it('should validate SLSRPT message', () => {
      const ediMessage: SalesReportEDI = {
        $type: 'EDIDocument',
        $id: 'edi:slsrpt:SLS-001',
        messageType: 'SLSRPT',
        sender: sellerParty,
        receiver: buyerParty,
        documentDate: '2024-10-10',
        documentNumber: 'SLS-001',
        reportNumber: 'SLS-001',
        reportDate: '2024-10-10',
        reportPeriodStart: '2024-10-01',
        reportPeriodEnd: '2024-10-31',
        reporter: sellerParty,
        recipient: buyerParty,
        items: [],
      }

      const validation = validateEDI(ediMessage)
      expect(validation.valid).toBe(false) // Should fail: items array is empty
      expect(validation.errors.some((e) => e.field === 'items')).toBe(true)
    })
  })

  describe('New Message Types - INVRPT', () => {
    it('should transform inventory report to INVRPT', () => {
      const report = {
        reportNumber: 'INV-2024-10',
        reportDate: '2024-10-10',
        reporter: sellerParty,
        recipient: buyerParty,
        location: 'Warehouse A',
        items: [
          {
            productCode: '00012345678905',
            quantityOnHand: { value: 1000, unit: 'EA' },
            quantityAvailable: { value: 800, unit: 'EA' },
            quantityReserved: { value: 200, unit: 'EA' },
          },
        ],
      }

      const result = toEDI('INVRPT', report)

      expect(result.success).toBe(true)
      expect(result.data?.messageType).toBe('INVRPT')
      expect((result.data as InventoryReportEDI)?.location).toBe('Warehouse A')
    })
  })

  describe('New Message Types - PARTIN', () => {
    it('should transform party information to PARTIN', () => {
      const partyInfo = {
        party: buyerParty,
        operationType: 'CREATE' as const,
        effectiveDate: '2024-10-10',
        sender: sellerParty,
        receiver: buyerParty,
        documentDate: '2024-10-10',
        documentNumber: 'PTY-001',
      }

      const result = toEDI('PARTIN', partyInfo)

      expect(result.success).toBe(true)
      expect(result.data?.messageType).toBe('PARTIN')
    })
  })

  describe('New Message Types - PRICAT', () => {
    it('should transform price catalog to PRICAT', () => {
      const catalog = {
        catalogNumber: 'CAT-2024-Q4',
        catalogDate: '2024-10-01',
        supplier: sellerParty,
        buyer: buyerParty,
        currency: 'USD',
        items: [
          {
            productCode: '00012345678905',
            description: 'Widget Pro',
            unitPrice: { value: 25.5, currency: 'USD' },
          },
        ],
      }

      const result = toEDI('PRICAT', catalog)

      expect(result.success).toBe(true)
      expect(result.data?.messageType).toBe('PRICAT')
    })
  })

  describe('New Message Types - PRODAT', () => {
    it('should transform product data to PRODAT', () => {
      const product = {
        productCode: '00012345678905',
        productName: 'Widget Pro',
        description: 'High-quality widget',
        supplier: sellerParty,
        operationType: 'CREATE' as const,
        receiver: buyerParty,
        documentDate: '2024-10-10',
        documentNumber: 'PRD-001',
      }

      const result = toEDI('PRODAT', product)

      expect(result.success).toBe(true)
      expect(result.data?.messageType).toBe('PRODAT')
    })
  })

  describe('New Message Types - QUOTES', () => {
    it('should transform quote to QUOTES', () => {
      const quote = {
        quoteNumber: 'QTE-001',
        quoteDate: '2024-10-10',
        validUntil: '2024-10-31',
        supplier: sellerParty,
        buyer: buyerParty,
        currency: 'USD',
        items: [
          {
            lineNumber: '1',
            productCode: '00012345678905',
            quantity: { value: 1000, unit: 'EA' },
            unitPrice: { value: 22.5, currency: 'USD' },
            leadTime: 14,
          },
        ],
      }

      const result = toEDI('QUOTES', quote)

      expect(result.success).toBe(true)
      expect(result.data?.messageType).toBe('QUOTES')
      expect((result.data as QuoteEDI)?.quoteNumber).toBe('QTE-001')
    })

    it('should validate QUOTES message', () => {
      const ediMessage: QuoteEDI = {
        $type: 'EDIDocument',
        $id: 'edi:quotes:QTE-001',
        messageType: 'QUOTES',
        sender: sellerParty,
        receiver: buyerParty,
        documentDate: '2024-10-10',
        documentNumber: 'QTE-001',
        quoteNumber: 'QTE-001',
        quoteDate: '2024-10-10',
        supplier: sellerParty,
        buyer: buyerParty,
        currency: 'USD',
        items: [
          {
            lineNumber: '1',
            productCode: '00012345678905',
            quantity: { value: 100, unit: 'EA' },
          },
        ],
      }

      const validation = validateEDI(ediMessage)
      expect(validation.valid).toBe(true)
    })
  })

  describe('New Message Types - REMADV', () => {
    it('should transform remittance advice to REMADV', () => {
      const remittance = {
        remittanceNumber: 'REM-001',
        remittanceDate: '2024-10-10',
        payer: buyerParty,
        payee: sellerParty,
        paymentMethod: 'ACH',
        totalAmount: { value: 2550, currency: 'USD' },
        currency: 'USD',
        invoices: [
          {
            invoiceNumber: 'INV-001',
            invoiceDate: '2024-09-30',
            paidAmount: { value: 2550, currency: 'USD' },
          },
        ],
      }

      const result = toEDI('REMADV', remittance)

      expect(result.success).toBe(true)
      expect(result.data?.messageType).toBe('REMADV')
      expect((result.data as RemittanceAdviceEDI)?.remittanceNumber).toBe('REM-001')
    })

    it('should validate REMADV message', () => {
      const ediMessage: RemittanceAdviceEDI = {
        $type: 'EDIDocument',
        $id: 'edi:remadv:REM-001',
        messageType: 'REMADV',
        sender: buyerParty,
        receiver: sellerParty,
        documentDate: '2024-10-10',
        documentNumber: 'REM-001',
        remittanceNumber: 'REM-001',
        remittanceDate: '2024-10-10',
        payer: buyerParty,
        payee: sellerParty,
        totalAmount: { value: 2550, currency: 'USD' },
        currency: 'USD',
        invoices: [
          {
            invoiceNumber: 'INV-001',
            paidAmount: { value: 2550, currency: 'USD' },
          },
        ],
      }

      const validation = validateEDI(ediMessage)
      expect(validation.valid).toBe(true)
    })
  })

  describe('Error Codes', () => {
    it('should include error codes for unsupported types', () => {
      const result = toEDI('INVALID' as any, {})

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('UNSUPPORTED_TYPE')
    })

    it('should include error codes in validation errors', () => {
      const ediMessage = {
        $type: 'EDIDocument',
        messageType: 'ORDERS',
      } as any

      const validation = validateEDI(ediMessage)

      expect(validation.valid).toBe(false)
      expect(validation.errors.every((e) => e.code)).toBe(true)
    })
  })

  describe('Type Guard Functions', () => {
    const purchaseOrderEDI: PurchaseOrderEDI = {
      $type: 'EDIDocument',
      $id: 'edi:orders:PO-001',
      messageType: 'ORDERS',
      sender: buyerParty,
      receiver: sellerParty,
      documentDate: '2024-10-10',
      documentNumber: 'PO-001',
      orderNumber: 'PO-001',
      orderDate: '2024-10-10',
      buyer: buyerParty,
      seller: sellerParty,
      items: [],
    }

    const invoiceEDI: InvoiceEDI = {
      $type: 'EDIDocument',
      $id: 'edi:invoic:INV-001',
      messageType: 'INVOIC',
      sender: sellerParty,
      receiver: buyerParty,
      documentDate: '2024-10-10',
      documentNumber: 'INV-001',
      invoiceNumber: 'INV-001',
      invoiceDate: '2024-10-10',
      buyer: buyerParty,
      seller: sellerParty,
      items: [],
      total: { value: 0, currency: 'USD' },
      currency: 'USD',
    }

    it('should identify purchase order EDI messages', async () => {
      const { isPurchaseOrderEDI } = await import('./edi.js')
      expect(isPurchaseOrderEDI(purchaseOrderEDI)).toBe(true)
      expect(isPurchaseOrderEDI(invoiceEDI)).toBe(false)
    })

    it('should identify invoice EDI messages', async () => {
      const { isInvoiceEDI } = await import('./edi.js')
      expect(isInvoiceEDI(invoiceEDI)).toBe(true)
      expect(isInvoiceEDI(purchaseOrderEDI)).toBe(false)
    })

    it('should identify despatch advice EDI messages', async () => {
      const { isDespatchAdviceEDI } = await import('./edi.js')
      const despatchEDI = { ...purchaseOrderEDI, messageType: 'DESADV' as const }
      expect(isDespatchAdviceEDI(despatchEDI)).toBe(true)
      expect(isDespatchAdviceEDI(purchaseOrderEDI)).toBe(false)
    })

    it('should identify receiving advice EDI messages', async () => {
      const { isReceivingAdviceEDI } = await import('./edi.js')
      const receivingEDI = { ...purchaseOrderEDI, messageType: 'RECADV' as const }
      expect(isReceivingAdviceEDI(receivingEDI)).toBe(true)
      expect(isReceivingAdviceEDI(purchaseOrderEDI)).toBe(false)
    })

    it('should identify order response EDI messages', async () => {
      const { isOrderResponseEDI } = await import('./edi.js')
      const responseEDI = { ...purchaseOrderEDI, messageType: 'ORDRSP' as const }
      expect(isOrderResponseEDI(responseEDI)).toBe(true)
      expect(isOrderResponseEDI(purchaseOrderEDI)).toBe(false)
    })

    it('should identify order change EDI messages', async () => {
      const { isOrderChangeEDI } = await import('./edi.js')
      const changeEDI = { ...purchaseOrderEDI, messageType: 'ORDCHG' as const }
      expect(isOrderChangeEDI(changeEDI)).toBe(true)
      expect(isOrderChangeEDI(purchaseOrderEDI)).toBe(false)
    })

    it('should identify sales report EDI messages', async () => {
      const { isSalesReportEDI } = await import('./edi.js')
      const salesEDI = { ...purchaseOrderEDI, messageType: 'SLSRPT' as const }
      expect(isSalesReportEDI(salesEDI)).toBe(true)
      expect(isSalesReportEDI(purchaseOrderEDI)).toBe(false)
    })

    it('should identify inventory report EDI messages', async () => {
      const { isInventoryReportEDI } = await import('./edi.js')
      const inventoryEDI = { ...purchaseOrderEDI, messageType: 'INVRPT' as const }
      expect(isInventoryReportEDI(inventoryEDI)).toBe(true)
      expect(isInventoryReportEDI(purchaseOrderEDI)).toBe(false)
    })

    it('should identify party information EDI messages', async () => {
      const { isPartyInformationEDI } = await import('./edi.js')
      const partyEDI = { ...purchaseOrderEDI, messageType: 'PARTIN' as const }
      expect(isPartyInformationEDI(partyEDI)).toBe(true)
      expect(isPartyInformationEDI(purchaseOrderEDI)).toBe(false)
    })

    it('should identify price catalog EDI messages', async () => {
      const { isPriceCatalogEDI } = await import('./edi.js')
      const catalogEDI = { ...purchaseOrderEDI, messageType: 'PRICAT' as const }
      expect(isPriceCatalogEDI(catalogEDI)).toBe(true)
      expect(isPriceCatalogEDI(purchaseOrderEDI)).toBe(false)
    })

    it('should identify product data EDI messages', async () => {
      const { isProductDataEDI } = await import('./edi.js')
      const productEDI = { ...purchaseOrderEDI, messageType: 'PRODAT' as const }
      expect(isProductDataEDI(productEDI)).toBe(true)
      expect(isProductDataEDI(purchaseOrderEDI)).toBe(false)
    })

    it('should identify quote EDI messages', async () => {
      const { isQuoteEDI } = await import('./edi.js')
      const quoteEDI = { ...purchaseOrderEDI, messageType: 'QUOTES' as const }
      expect(isQuoteEDI(quoteEDI)).toBe(true)
      expect(isQuoteEDI(purchaseOrderEDI)).toBe(false)
    })

    it('should identify remittance advice EDI messages', async () => {
      const { isRemittanceAdviceEDI } = await import('./edi.js')
      const remittanceEDI = { ...purchaseOrderEDI, messageType: 'REMADV' as const }
      expect(isRemittanceAdviceEDI(remittanceEDI)).toBe(true)
      expect(isRemittanceAdviceEDI(purchaseOrderEDI)).toBe(false)
    })
  })
})
