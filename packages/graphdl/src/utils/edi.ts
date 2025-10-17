/**
 * UN/EDIFACT Transformation Utilities
 *
 * Provides functions to transform between UN/EDIFACT messages and modern business objects
 * following semantic patterns ($.Subject.predicate.Object)
 */

import type {
  EDIMessage,
  EDIMessageType,
  EDITransformResult,
  EDIValidationResult,
  EDIErrorCode,
  PurchaseOrderEDI,
  InvoiceEDI,
  DespatchAdviceEDI,
  ReceivingAdviceEDI,
  OrderResponseEDI,
  OrderChangeEDI,
  SalesReportEDI,
  InventoryReportEDI,
  PartyInformationEDI,
  PriceCatalogEDI,
  ProductDataEDI,
  QuoteEDI,
  RemittanceAdviceEDI,
  PurchaseOrderInput,
  InvoiceInput,
  DespatchAdviceInput,
  ReceivingAdviceInput,
  OrderResponseInput,
  OrderChangeInput,
  SalesReportInput,
  InventoryReportInput,
  PartyInformationInput,
  PriceCatalogInput,
  ProductDataInput,
  QuoteInput,
  RemittanceAdviceInput,
} from '../types/edi.js'
import { EDI_TO_EVENT_MAP, EVENT_TO_EDI_MAP } from '../types/edi.js'

// ============================================================================
// EDI Validation Utilities
// ============================================================================

/**
 * Validation message structure for errors and warnings
 */
interface ValidationMessage {
  field: string
  message: string
  code?: string
}

// ============================================================================
// Main Transformation Functions
// ============================================================================

/**
 * Convert business object to EDI message
 *
 * @param messageType - The UN/EDIFACT message type to generate
 * @param data - The business object to transform
 * @returns EDI transformation result
 *
 * @example
 * const result = toEDI('ORDERS', purchaseOrder)
 * if (result.success) {
 *   console.log('EDI message:', result.data)
 * }
 */
export function toEDI<T = any>(messageType: EDIMessageType, data: T): EDITransformResult<EDIMessage> {
  try {
    let ediMessage: EDIMessage

    switch (messageType) {
      case 'ORDERS':
        ediMessage = transformToORDERS(data as PurchaseOrderInput)
        break
      case 'INVOIC':
        ediMessage = transformToINVOIC(data as InvoiceInput)
        break
      case 'DESADV':
        ediMessage = transformToDESADV(data as DespatchAdviceInput)
        break
      case 'RECADV':
        ediMessage = transformToRECADV(data as ReceivingAdviceInput)
        break
      case 'ORDRSP':
        ediMessage = transformToORDRSP(data as OrderResponseInput)
        break
      case 'ORDCHG':
        ediMessage = transformToORDCHG(data as OrderChangeInput)
        break
      case 'SLSRPT':
        ediMessage = transformToSLSRPT(data as SalesReportInput)
        break
      case 'INVRPT':
        ediMessage = transformToINVRPT(data as InventoryReportInput)
        break
      case 'PARTIN':
        ediMessage = transformToPARTIN(data as PartyInformationInput)
        break
      case 'PRICAT':
        ediMessage = transformToPRICAT(data as PriceCatalogInput)
        break
      case 'PRODAT':
        ediMessage = transformToPRODAT(data as ProductDataInput)
        break
      case 'QUOTES':
        ediMessage = transformToQUOTES(data as QuoteInput)
        break
      case 'REMADV':
        ediMessage = transformToREMADV(data as RemittanceAdviceInput)
        break
      default:
        return {
          success: false,
          error: `Unsupported message type: ${messageType}`,
          errorCode: 'UNSUPPORTED_TYPE',
        }
    }

    return {
      success: true,
      data: ediMessage,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error)
    return {
      success: false,
      error: errorMessage,
      errorCode: 'TRANSFORMATION_ERROR',
    }
  }
}

/**
 * Convert EDI message to business object
 *
 * @param message - The EDI message to transform
 * @returns Transformation result with business object
 *
 * @example
 * const result = fromEDI<PurchaseOrder>(ediMessage)
 * if (result.success) {
 *   await db.PurchaseOrder.create(result.data)
 * }
 */
export function fromEDI<T = any>(message: EDIMessage): EDITransformResult<T> {
  try {
    let businessObject: any

    switch (message.messageType) {
      case 'ORDERS':
        businessObject = parseORDERS(message as PurchaseOrderEDI)
        break
      case 'INVOIC':
        businessObject = parseINVOIC(message as InvoiceEDI)
        break
      case 'DESADV':
        businessObject = parseDESADV(message as DespatchAdviceEDI)
        break
      case 'RECADV':
        businessObject = parseRECADV(message as ReceivingAdviceEDI)
        break
      case 'ORDRSP':
        businessObject = parseORDRSP(message as OrderResponseEDI)
        break
      case 'ORDCHG':
        businessObject = parseORDCHG(message as OrderChangeEDI)
        break
      case 'SLSRPT':
        businessObject = parseSLSRPT(message as SalesReportEDI)
        break
      case 'INVRPT':
        businessObject = parseINVRPT(message as InventoryReportEDI)
        break
      case 'PARTIN':
        businessObject = parsePARTIN(message as PartyInformationEDI)
        break
      case 'PRICAT':
        businessObject = parsePRICAT(message as PriceCatalogEDI)
        break
      case 'PRODAT':
        businessObject = parsePRODAT(message as ProductDataEDI)
        break
      case 'QUOTES':
        businessObject = parseQUOTES(message as QuoteEDI)
        break
      case 'REMADV':
        businessObject = parseREMADV(message as RemittanceAdviceEDI)
        break
      default:
        return {
          success: false,
          error: `Unsupported message type: ${(message as EDIMessage).messageType}`,
          errorCode: 'UNSUPPORTED_TYPE',
        }
    }

    return {
      success: true,
      data: businessObject as T,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error)
    return {
      success: false,
      error: errorMessage,
      errorCode: 'TRANSFORMATION_ERROR',
    }
  }
}

/**
 * Validate EDI message structure
 *
 * @param message - The EDI message to validate
 * @returns Validation result
 */
export function validateEDI(message: EDIMessage): EDIValidationResult {
  const errors: ValidationMessage[] = []
  const warnings: ValidationMessage[] = []

  // Required base fields
  if (!message.$type || message.$type !== 'EDIDocument') {
    errors.push({ field: '$type', message: 'Must be "EDIDocument"', code: 'INVALID_TYPE' })
  }
  if (!message.$id) {
    errors.push({ field: '$id', message: 'Document ID is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.messageType) {
    errors.push({ field: 'messageType', message: 'Message type is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.sender) {
    errors.push({ field: 'sender', message: 'Sender is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.receiver) {
    errors.push({ field: 'receiver', message: 'Receiver is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.documentDate) {
    errors.push({ field: 'documentDate', message: 'Document date is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.documentNumber) {
    errors.push({ field: 'documentNumber', message: 'Document number is required', code: 'MISSING_REQUIRED_FIELD' })
  }

  // Validate parties
  if (message.sender && !message.sender.identifier) {
    errors.push({ field: 'sender.identifier', message: 'Sender identifier is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (message.receiver && !message.receiver.identifier) {
    errors.push({ field: 'receiver.identifier', message: 'Receiver identifier is required', code: 'MISSING_REQUIRED_FIELD' })
  }

  // Message-specific validation
  switch (message.messageType) {
    case 'ORDERS':
      validatePurchaseOrder(message as PurchaseOrderEDI, errors, warnings)
      break
    case 'INVOIC':
      validateInvoice(message as InvoiceEDI, errors, warnings)
      break
    case 'DESADV':
      validateDespatchAdvice(message as DespatchAdviceEDI, errors, warnings)
      break
    case 'RECADV':
      validateReceivingAdvice(message as ReceivingAdviceEDI, errors, warnings)
      break
    case 'ORDRSP':
      validateOrderResponse(message as OrderResponseEDI, errors, warnings)
      break
    case 'ORDCHG':
      validateOrderChange(message as OrderChangeEDI, errors, warnings)
      break
    case 'SLSRPT':
      validateSalesReport(message as SalesReportEDI, errors, warnings)
      break
    case 'INVRPT':
      validateInventoryReport(message as InventoryReportEDI, errors, warnings)
      break
    case 'PARTIN':
      validatePartyInformation(message as PartyInformationEDI, errors, warnings)
      break
    case 'PRICAT':
      validatePriceCatalog(message as PriceCatalogEDI, errors, warnings)
      break
    case 'PRODAT':
      validateProductData(message as ProductDataEDI, errors, warnings)
      break
    case 'QUOTES':
      validateQuote(message as QuoteEDI, errors, warnings)
      break
    case 'REMADV':
      validateRemittanceAdvice(message as RemittanceAdviceEDI, errors, warnings)
      break
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Get event pattern for EDI message type
 *
 * @param messageType - The EDI message type
 * @returns Semantic event pattern (e.g., '$.PurchaseOrder.created')
 */
export function getEventPattern(messageType: EDIMessageType): string {
  return EDI_TO_EVENT_MAP[messageType]
}

/**
 * Get EDI message type for event pattern
 *
 * @param eventPattern - The semantic event pattern
 * @returns EDI message type or undefined
 */
export function getMessageType(eventPattern: string): EDIMessageType | undefined {
  return EVENT_TO_EDI_MAP[eventPattern]
}

// ============================================================================
// Transformation Functions - ORDERS (Purchase Order)
// ============================================================================

function transformToORDERS(data: PurchaseOrderInput): PurchaseOrderEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:orders:${data.orderNumber}`,
    messageType: 'ORDERS',
    sender: data.buyer,
    receiver: data.seller,
    documentDate: data.orderDate,
    documentNumber: data.orderNumber,
    orderNumber: data.orderNumber,
    orderDate: data.orderDate,
    deliveryDate: data.deliveryDate,
    buyer: data.buyer,
    seller: data.seller,
    shipTo: data.shipTo,
    billTo: data.billTo,
    items: data.items,
    totalAmount: data.totalAmount,
    currency: data.currency,
    terms: data.terms,
    notes: data.notes,
  }
}

function parseORDERS(message: PurchaseOrderEDI): any {
  return {
    $type: 'PurchaseOrder',
    $id: message.$id,
    orderNumber: message.orderNumber,
    orderDate: message.orderDate,
    deliveryDate: message.deliveryDate,
    buyer: message.buyer,
    seller: message.seller,
    shipTo: message.shipTo,
    billTo: message.billTo,
    items: message.items,
    totalAmount: message.totalAmount,
    currency: message.currency,
    terms: message.terms,
    notes: message.notes,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Transformation Functions - INVOIC (Invoice)
// ============================================================================

function transformToINVOIC(data: InvoiceInput): InvoiceEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:invoic:${data.invoiceNumber}`,
    messageType: 'INVOIC',
    sender: data.seller,
    receiver: data.buyer,
    documentDate: data.invoiceDate,
    documentNumber: data.invoiceNumber,
    invoiceNumber: data.invoiceNumber,
    invoiceDate: data.invoiceDate,
    orderReference: data.orderReference,
    buyer: data.buyer,
    seller: data.seller,
    billTo: data.billTo,
    items: data.items,
    subtotal: data.subtotal,
    tax: data.tax,
    total: data.total,
    currency: data.currency,
    terms: data.terms,
    dueDate: data.dueDate,
  }
}

function parseINVOIC(message: InvoiceEDI): any {
  return {
    $type: 'Invoice',
    $id: message.$id,
    invoiceNumber: message.invoiceNumber,
    invoiceDate: message.invoiceDate,
    orderReference: message.orderReference,
    buyer: message.buyer,
    seller: message.seller,
    billTo: message.billTo,
    items: message.items,
    subtotal: message.subtotal,
    tax: message.tax,
    total: message.total,
    currency: message.currency,
    terms: message.terms,
    dueDate: message.dueDate,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Transformation Functions - DESADV (Despatch Advice)
// ============================================================================

function transformToDESADV(data: DespatchAdviceInput): DespatchAdviceEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:desadv:${data.shipmentNumber}`,
    messageType: 'DESADV',
    sender: data.shipper,
    receiver: data.consignee,
    documentDate: data.shipmentDate,
    documentNumber: data.shipmentNumber,
    shipmentNumber: data.shipmentNumber,
    shipmentDate: data.shipmentDate,
    orderReference: data.orderReference,
    deliveryDate: data.deliveryDate,
    shipper: data.shipper,
    consignee: data.consignee,
    shipTo: data.shipTo,
    carrier: data.carrier,
    packages: data.packages,
    items: data.items,
  }
}

function parseDESADV(message: DespatchAdviceEDI): any {
  return {
    $type: 'ShippingNotice',
    $id: message.$id,
    shipmentNumber: message.shipmentNumber,
    shipmentDate: message.shipmentDate,
    orderReference: message.orderReference,
    deliveryDate: message.deliveryDate,
    shipper: message.shipper,
    consignee: message.consignee,
    shipTo: message.shipTo,
    carrier: message.carrier,
    packages: message.packages,
    items: message.items,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Transformation Functions - RECADV (Receiving Advice)
// ============================================================================

function transformToRECADV(data: ReceivingAdviceInput): ReceivingAdviceEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:recadv:${data.receiptNumber}`,
    messageType: 'RECADV',
    sender: data.receiver,
    receiver: data.supplier,
    documentDate: data.receiptDate,
    documentNumber: data.receiptNumber,
    receiptNumber: data.receiptNumber,
    receiptDate: data.receiptDate,
    orderReference: data.orderReference,
    shipmentReference: data.shipmentReference,
    supplier: data.supplier,
    items: data.items,
  }
}

function parseRECADV(message: ReceivingAdviceEDI): any {
  return {
    $type: 'Receipt',
    $id: message.$id,
    receiptNumber: message.receiptNumber,
    receiptDate: message.receiptDate,
    orderReference: message.orderReference,
    shipmentReference: message.shipmentReference,
    receiver: message.receiver,
    supplier: message.supplier,
    items: message.items,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Transformation Functions - ORDRSP (Order Response)
// ============================================================================

function transformToORDRSP(data: OrderResponseInput): OrderResponseEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:ordrsp:${data.responseNumber}`,
    messageType: 'ORDRSP',
    sender: data.seller,
    receiver: data.buyer,
    documentDate: data.responseDate,
    documentNumber: data.responseNumber,
    responseNumber: data.responseNumber,
    responseDate: data.responseDate,
    orderReference: data.orderReference,
    responseCode: data.responseCode,
    buyer: data.buyer,
    seller: data.seller,
    items: data.items,
    notes: data.notes,
  }
}

function parseORDRSP(message: OrderResponseEDI): any {
  return {
    $type: 'OrderResponse',
    $id: message.$id,
    responseNumber: message.responseNumber,
    responseDate: message.responseDate,
    orderReference: message.orderReference,
    responseCode: message.responseCode,
    buyer: message.buyer,
    seller: message.seller,
    items: message.items,
    notes: message.notes,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Transformation Functions - ORDCHG (Order Change)
// ============================================================================

function transformToORDCHG(data: OrderChangeInput): OrderChangeEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:ordchg:${data.orderNumber}`,
    messageType: 'ORDCHG',
    sender: data.buyer,
    receiver: data.seller,
    documentDate: data.orderDate,
    documentNumber: data.orderNumber,
    orderNumber: data.orderNumber,
    orderDate: data.orderDate,
    deliveryDate: data.deliveryDate,
    buyer: data.buyer,
    seller: data.seller,
    shipTo: data.shipTo,
    billTo: data.billTo,
    items: data.items,
    totalAmount: data.totalAmount,
    currency: data.currency,
    terms: data.terms,
    notes: data.notes,
    originalOrderNumber: data.originalOrderNumber,
    changeReason: data.changeReason,
  }
}

function parseORDCHG(message: OrderChangeEDI): any {
  return {
    $type: 'PurchaseOrder',
    $id: message.$id,
    orderNumber: message.orderNumber,
    orderDate: message.orderDate,
    deliveryDate: message.deliveryDate,
    buyer: message.buyer,
    seller: message.seller,
    shipTo: message.shipTo,
    billTo: message.billTo,
    items: message.items,
    totalAmount: message.totalAmount,
    currency: message.currency,
    terms: message.terms,
    notes: message.notes,
    originalOrderNumber: message.originalOrderNumber,
    changeReason: message.changeReason,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Transformation Functions - SLSRPT (Sales Report)
// ============================================================================

function transformToSLSRPT(data: SalesReportInput): SalesReportEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:slsrpt:${data.reportNumber}`,
    messageType: 'SLSRPT',
    sender: data.reporter,
    receiver: data.recipient,
    documentDate: data.reportDate,
    documentNumber: data.reportNumber,
    reportNumber: data.reportNumber,
    reportDate: data.reportDate,
    reportPeriodStart: data.reportPeriodStart,
    reportPeriodEnd: data.reportPeriodEnd,
    reporter: data.reporter,
    recipient: data.recipient,
    items: data.items,
    totalSales: data.totalSales,
  }
}

function parseSLSRPT(message: SalesReportEDI): any {
  return {
    $type: 'SalesReport',
    $id: message.$id,
    reportNumber: message.reportNumber,
    reportDate: message.reportDate,
    reportPeriodStart: message.reportPeriodStart,
    reportPeriodEnd: message.reportPeriodEnd,
    reporter: message.reporter,
    recipient: message.recipient,
    items: message.items,
    totalSales: message.totalSales,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Transformation Functions - INVRPT (Inventory Report)
// ============================================================================

function transformToINVRPT(data: InventoryReportInput): InventoryReportEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:invrpt:${data.reportNumber}`,
    messageType: 'INVRPT',
    sender: data.reporter,
    receiver: data.recipient,
    documentDate: data.reportDate,
    documentNumber: data.reportNumber,
    reportNumber: data.reportNumber,
    reportDate: data.reportDate,
    reporter: data.reporter,
    recipient: data.recipient,
    location: data.location,
    items: data.items,
  }
}

function parseINVRPT(message: InventoryReportEDI): any {
  return {
    $type: 'InventoryReport',
    $id: message.$id,
    reportNumber: message.reportNumber,
    reportDate: message.reportDate,
    reporter: message.reporter,
    recipient: message.recipient,
    location: message.location,
    items: message.items,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Transformation Functions - PARTIN (Party Information)
// ============================================================================

function transformToPARTIN(data: PartyInformationInput): PartyInformationEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:partin:${data.party.identifier}`,
    messageType: 'PARTIN',
    sender: data.sender,
    receiver: data.receiver,
    documentDate: data.documentDate,
    documentNumber: data.documentNumber,
    party: data.party,
    operationType: data.operationType,
    effectiveDate: data.effectiveDate,
    expiryDate: data.expiryDate,
  }
}

function parsePARTIN(message: PartyInformationEDI): any {
  return {
    $type: 'Party',
    $id: message.$id,
    party: message.party,
    operationType: message.operationType,
    effectiveDate: message.effectiveDate,
    expiryDate: message.expiryDate,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Transformation Functions - PRICAT (Price Catalog)
// ============================================================================

function transformToPRICAT(data: PriceCatalogInput): PriceCatalogEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:pricat:${data.catalogNumber}`,
    messageType: 'PRICAT',
    sender: data.supplier,
    receiver: data.buyer || data.supplier,
    documentDate: data.catalogDate,
    documentNumber: data.catalogNumber,
    catalogNumber: data.catalogNumber,
    catalogDate: data.catalogDate,
    effectiveDate: data.effectiveDate,
    expiryDate: data.expiryDate,
    supplier: data.supplier,
    buyer: data.buyer,
    currency: data.currency,
    items: data.items,
  }
}

function parsePRICAT(message: PriceCatalogEDI): any {
  return {
    $type: 'Catalog',
    $id: message.$id,
    catalogNumber: message.catalogNumber,
    catalogDate: message.catalogDate,
    effectiveDate: message.effectiveDate,
    expiryDate: message.expiryDate,
    supplier: message.supplier,
    buyer: message.buyer,
    currency: message.currency,
    items: message.items,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Transformation Functions - PRODAT (Product Data)
// ============================================================================

function transformToPRODAT(data: ProductDataInput): ProductDataEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:prodat:${data.productCode}`,
    messageType: 'PRODAT',
    sender: data.supplier,
    receiver: data.receiver,
    documentDate: data.documentDate,
    documentNumber: data.documentNumber,
    productCode: data.productCode,
    productCodeType: data.productCodeType,
    productName: data.productName,
    description: data.description,
    supplier: data.supplier,
    category: data.category,
    specifications: data.specifications,
    packaging: data.packaging,
    operationType: data.operationType,
  }
}

function parsePRODAT(message: ProductDataEDI): any {
  return {
    $type: 'Product',
    $id: message.$id,
    productCode: message.productCode,
    productCodeType: message.productCodeType,
    productName: message.productName,
    description: message.description,
    supplier: message.supplier,
    category: message.category,
    specifications: message.specifications,
    packaging: message.packaging,
    operationType: message.operationType,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Transformation Functions - QUOTES (Quote)
// ============================================================================

function transformToQUOTES(data: QuoteInput): QuoteEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:quotes:${data.quoteNumber}`,
    messageType: 'QUOTES',
    sender: data.supplier,
    receiver: data.buyer,
    documentDate: data.quoteDate,
    documentNumber: data.quoteNumber,
    quoteNumber: data.quoteNumber,
    quoteDate: data.quoteDate,
    validUntil: data.validUntil,
    requestReference: data.requestReference,
    supplier: data.supplier,
    buyer: data.buyer,
    items: data.items,
    totalAmount: data.totalAmount,
    currency: data.currency,
    terms: data.terms,
  }
}

function parseQUOTES(message: QuoteEDI): any {
  return {
    $type: 'Quote',
    $id: message.$id,
    quoteNumber: message.quoteNumber,
    quoteDate: message.quoteDate,
    validUntil: message.validUntil,
    requestReference: message.requestReference,
    supplier: message.supplier,
    buyer: message.buyer,
    items: message.items,
    totalAmount: message.totalAmount,
    currency: message.currency,
    terms: message.terms,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Transformation Functions - REMADV (Remittance Advice)
// ============================================================================

function transformToREMADV(data: RemittanceAdviceInput): RemittanceAdviceEDI {
  return {
    $type: 'EDIDocument',
    $id: data.$id || `edi:remadv:${data.remittanceNumber}`,
    messageType: 'REMADV',
    sender: data.payer,
    receiver: data.payee,
    documentDate: data.remittanceDate,
    documentNumber: data.remittanceNumber,
    remittanceNumber: data.remittanceNumber,
    remittanceDate: data.remittanceDate,
    payer: data.payer,
    payee: data.payee,
    paymentMethod: data.paymentMethod,
    paymentReference: data.paymentReference,
    totalAmount: data.totalAmount,
    currency: data.currency,
    invoices: data.invoices,
  }
}

function parseREMADV(message: RemittanceAdviceEDI): any {
  return {
    $type: 'Payment',
    $id: message.$id,
    remittanceNumber: message.remittanceNumber,
    remittanceDate: message.remittanceDate,
    payer: message.payer,
    payee: message.payee,
    paymentMethod: message.paymentMethod,
    paymentReference: message.paymentReference,
    totalAmount: message.totalAmount,
    currency: message.currency,
    invoices: message.invoices,
    ediMetadata: {
      messageType: message.messageType,
      documentNumber: message.documentNumber,
      documentDate: message.documentDate,
    },
  }
}

// ============================================================================
// Validation Functions
// ============================================================================

function validatePurchaseOrder(message: PurchaseOrderEDI | OrderChangeEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  if (!message.orderNumber) {
    errors.push({ field: 'orderNumber', message: 'Order number is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.orderDate) {
    errors.push({ field: 'orderDate', message: 'Order date is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.buyer) {
    errors.push({ field: 'buyer', message: 'Buyer is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.seller) {
    errors.push({ field: 'seller', message: 'Seller is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.items || message.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.currency) {
    warnings.push({ field: 'currency', message: 'Currency not specified', code: 'MISSING_OPTIONAL_FIELD' })
  }
}

function validateInvoice(message: InvoiceEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  if (!message.invoiceNumber) {
    errors.push({ field: 'invoiceNumber', message: 'Invoice number is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.invoiceDate) {
    errors.push({ field: 'invoiceDate', message: 'Invoice date is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.buyer) {
    errors.push({ field: 'buyer', message: 'Buyer is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.seller) {
    errors.push({ field: 'seller', message: 'Seller is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.total) {
    errors.push({ field: 'total', message: 'Total amount is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.currency) {
    errors.push({ field: 'currency', message: 'Currency is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.items || message.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required', code: 'MISSING_REQUIRED_FIELD' })
  }
}

function validateDespatchAdvice(message: DespatchAdviceEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  if (!message.shipmentNumber) {
    errors.push({ field: 'shipmentNumber', message: 'Shipment number is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.shipmentDate) {
    errors.push({ field: 'shipmentDate', message: 'Shipment date is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.shipper) {
    errors.push({ field: 'shipper', message: 'Shipper is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.consignee) {
    errors.push({ field: 'consignee', message: 'Consignee is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.items || message.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required', code: 'MISSING_REQUIRED_FIELD' })
  }
}

function validateReceivingAdvice(message: ReceivingAdviceEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  if (!message.receiptNumber) {
    errors.push({ field: 'receiptNumber', message: 'Receipt number is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.receiptDate) {
    errors.push({ field: 'receiptDate', message: 'Receipt date is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.receiver) {
    errors.push({ field: 'receiver', message: 'Receiver is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.supplier) {
    errors.push({ field: 'supplier', message: 'Supplier is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.items || message.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required', code: 'MISSING_REQUIRED_FIELD' })
  }
}

function validateOrderResponse(message: OrderResponseEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  if (!message.responseNumber) {
    errors.push({ field: 'responseNumber', message: 'Response number is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.responseDate) {
    errors.push({ field: 'responseDate', message: 'Response date is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.orderReference) {
    errors.push({ field: 'orderReference', message: 'Order reference is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.responseCode) {
    errors.push({ field: 'responseCode', message: 'Response code is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.items || message.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required', code: 'MISSING_REQUIRED_FIELD' })
  }
}

function validateOrderChange(message: OrderChangeEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  validatePurchaseOrder(message, errors, warnings)
  if (!message.originalOrderNumber) {
    errors.push({ field: 'originalOrderNumber', message: 'Original order number is required', code: 'MISSING_REQUIRED_FIELD' })
  }
}

function validateSalesReport(message: SalesReportEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  if (!message.reportNumber) {
    errors.push({ field: 'reportNumber', message: 'Report number is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.reportDate) {
    errors.push({ field: 'reportDate', message: 'Report date is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.reportPeriodStart) {
    errors.push({ field: 'reportPeriodStart', message: 'Report period start is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.reportPeriodEnd) {
    errors.push({ field: 'reportPeriodEnd', message: 'Report period end is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.items || message.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required', code: 'MISSING_REQUIRED_FIELD' })
  }
}

function validateInventoryReport(message: InventoryReportEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  if (!message.reportNumber) {
    errors.push({ field: 'reportNumber', message: 'Report number is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.reportDate) {
    errors.push({ field: 'reportDate', message: 'Report date is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.items || message.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required', code: 'MISSING_REQUIRED_FIELD' })
  }
}

function validatePartyInformation(message: PartyInformationEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  if (!message.party) {
    errors.push({ field: 'party', message: 'Party information is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.operationType) {
    errors.push({ field: 'operationType', message: 'Operation type is required', code: 'MISSING_REQUIRED_FIELD' })
  }
}

function validatePriceCatalog(message: PriceCatalogEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  if (!message.catalogNumber) {
    errors.push({ field: 'catalogNumber', message: 'Catalog number is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.catalogDate) {
    errors.push({ field: 'catalogDate', message: 'Catalog date is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.currency) {
    errors.push({ field: 'currency', message: 'Currency is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.items || message.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required', code: 'MISSING_REQUIRED_FIELD' })
  }
}

function validateProductData(message: ProductDataEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  if (!message.productCode) {
    errors.push({ field: 'productCode', message: 'Product code is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.productName) {
    errors.push({ field: 'productName', message: 'Product name is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.operationType) {
    errors.push({ field: 'operationType', message: 'Operation type is required', code: 'MISSING_REQUIRED_FIELD' })
  }
}

function validateQuote(message: QuoteEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  if (!message.quoteNumber) {
    errors.push({ field: 'quoteNumber', message: 'Quote number is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.quoteDate) {
    errors.push({ field: 'quoteDate', message: 'Quote date is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.currency) {
    errors.push({ field: 'currency', message: 'Currency is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.items || message.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required', code: 'MISSING_REQUIRED_FIELD' })
  }
}

function validateRemittanceAdvice(message: RemittanceAdviceEDI, errors: ValidationMessage[], warnings: ValidationMessage[]): void {
  if (!message.remittanceNumber) {
    errors.push({ field: 'remittanceNumber', message: 'Remittance number is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.remittanceDate) {
    errors.push({ field: 'remittanceDate', message: 'Remittance date is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.payer) {
    errors.push({ field: 'payer', message: 'Payer is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.payee) {
    errors.push({ field: 'payee', message: 'Payee is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.totalAmount) {
    errors.push({ field: 'totalAmount', message: 'Total amount is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.currency) {
    errors.push({ field: 'currency', message: 'Currency is required', code: 'MISSING_REQUIRED_FIELD' })
  }
  if (!message.invoices || message.invoices.length === 0) {
    errors.push({ field: 'invoices', message: 'At least one invoice is required', code: 'MISSING_REQUIRED_FIELD' })
  }
}

// ============================================================================
// Type Guard Functions
// ============================================================================

/**
 * Type guard to check if message is a Purchase Order EDI
 */
export function isPurchaseOrderEDI(msg: EDIMessage): msg is PurchaseOrderEDI {
  return msg.messageType === 'ORDERS'
}

/**
 * Type guard to check if message is an Invoice EDI
 */
export function isInvoiceEDI(msg: EDIMessage): msg is InvoiceEDI {
  return msg.messageType === 'INVOIC'
}

/**
 * Type guard to check if message is a Despatch Advice EDI
 */
export function isDespatchAdviceEDI(msg: EDIMessage): msg is DespatchAdviceEDI {
  return msg.messageType === 'DESADV'
}

/**
 * Type guard to check if message is a Receiving Advice EDI
 */
export function isReceivingAdviceEDI(msg: EDIMessage): msg is ReceivingAdviceEDI {
  return msg.messageType === 'RECADV'
}

/**
 * Type guard to check if message is an Order Response EDI
 */
export function isOrderResponseEDI(msg: EDIMessage): msg is OrderResponseEDI {
  return msg.messageType === 'ORDRSP'
}

/**
 * Type guard to check if message is an Order Change EDI
 */
export function isOrderChangeEDI(msg: EDIMessage): msg is OrderChangeEDI {
  return msg.messageType === 'ORDCHG'
}

/**
 * Type guard to check if message is a Sales Report EDI
 */
export function isSalesReportEDI(msg: EDIMessage): msg is SalesReportEDI {
  return msg.messageType === 'SLSRPT'
}

/**
 * Type guard to check if message is an Inventory Report EDI
 */
export function isInventoryReportEDI(msg: EDIMessage): msg is InventoryReportEDI {
  return msg.messageType === 'INVRPT'
}

/**
 * Type guard to check if message is a Party Information EDI
 */
export function isPartyInformationEDI(msg: EDIMessage): msg is PartyInformationEDI {
  return msg.messageType === 'PARTIN'
}

/**
 * Type guard to check if message is a Price Catalog EDI
 */
export function isPriceCatalogEDI(msg: EDIMessage): msg is PriceCatalogEDI {
  return msg.messageType === 'PRICAT'
}

/**
 * Type guard to check if message is a Product Data EDI
 */
export function isProductDataEDI(msg: EDIMessage): msg is ProductDataEDI {
  return msg.messageType === 'PRODAT'
}

/**
 * Type guard to check if message is a Quote EDI
 */
export function isQuoteEDI(msg: EDIMessage): msg is QuoteEDI {
  return msg.messageType === 'QUOTES'
}

/**
 * Type guard to check if message is a Remittance Advice EDI
 */
export function isRemittanceAdviceEDI(msg: EDIMessage): msg is RemittanceAdviceEDI {
  return msg.messageType === 'REMADV'
}
