/**
 * UN/EDIFACT Document Types Modernization
 *
 * Maps traditional UN/EDIFACT message types to modern API and event streaming patterns
 * following the $.Subject.predicate.Object semantic pattern.
 *
 * @see https://unece.org/trade/uncefact/introducing-unedifact
 */

/**
 * UN/EDIFACT Message Types
 * Standard message types from UN/EDIFACT Message Directory
 */
export type EDIMessageType =
  | 'ORDERS' // Purchase Order
  | 'INVOIC' // Invoice
  | 'DESADV' // Despatch Advice (ASN)
  | 'RECADV' // Receiving Advice
  | 'ORDRSP' // Order Response
  | 'ORDCHG' // Order Change
  | 'SLSRPT' // Sales Report
  | 'INVRPT' // Inventory Report
  | 'PARTIN' // Party Information
  | 'PRICAT' // Price Catalog
  | 'PRODAT' // Product Data
  | 'QUOTES' // Quote
  | 'REMADV' // Remittance Advice

/**
 * Base EDI Document
 * Common structure for all EDI message types
 */
export interface EDIDocument {
  $type: 'EDIDocument'
  $id: string
  messageType: EDIMessageType
  sender: Party
  receiver: Party
  documentDate: string
  documentNumber: string
  version?: string
  testIndicator?: boolean
}

/**
 * Party (Trading Partner)
 */
export interface Party {
  $type: 'Party'
  $id?: string
  identifier: string
  identifierType?: 'GLN' | 'DUNS' | 'EAN' | 'UPC' | 'Custom'
  name?: string
  address?: Address
  contact?: Contact
}

/**
 * Address
 */
export interface Address {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country: string
}

/**
 * Contact Information
 */
export interface Contact {
  name?: string
  email?: string
  phone?: string
  fax?: string
}

/**
 * ORDERS - Purchase Order
 * Maps to $.PurchaseOrder.created
 */
export interface PurchaseOrderEDI extends EDIDocument {
  messageType: 'ORDERS'
  orderNumber: string
  orderDate: string
  deliveryDate?: string
  buyer: Party
  seller: Party
  shipTo?: Party
  billTo?: Party
  items: OrderLineItem[]
  totalAmount?: MonetaryAmount
  currency?: string
  terms?: PaymentTerms
  notes?: string
}

/**
 * Order Line Item
 */
export interface OrderLineItem {
  lineNumber: string
  productCode: string
  productCodeType?: 'GTIN' | 'SKU' | 'UPC' | 'EAN' | 'Custom'
  description?: string
  quantity: Quantity
  unitPrice?: MonetaryAmount
  lineAmount?: MonetaryAmount
  deliveryDate?: string
}

/**
 * Quantity with Unit of Measure
 */
export interface Quantity {
  value: number
  unit: string // e.g., 'EA', 'CS', 'KG', 'LB'
}

/**
 * Monetary Amount
 */
export interface MonetaryAmount {
  value: number
  currency?: string
}

/**
 * Payment Terms
 */
export interface PaymentTerms {
  code?: string
  description?: string
  dueDate?: string
  discountPercent?: number
  discountDays?: number
}

/**
 * INVOIC - Invoice
 * Maps to $.Invoice.sent
 */
export interface InvoiceEDI extends EDIDocument {
  messageType: 'INVOIC'
  invoiceNumber: string
  invoiceDate: string
  orderReference?: string
  buyer: Party
  seller: Party
  billTo?: Party
  items: InvoiceLineItem[]
  subtotal?: MonetaryAmount
  tax?: TaxAmount
  total: MonetaryAmount
  currency: string
  terms?: PaymentTerms
  dueDate?: string
}

/**
 * Invoice Line Item
 */
export interface InvoiceLineItem extends OrderLineItem {
  taxAmount?: MonetaryAmount
  taxRate?: number
}

/**
 * Tax Amount
 */
export interface TaxAmount extends MonetaryAmount {
  taxType?: string
  taxRate?: number
  taxableAmount?: MonetaryAmount
}

/**
 * DESADV - Despatch Advice (ASN)
 * Maps to $.ShippingNotice.sent
 */
export interface DespatchAdviceEDI extends EDIDocument {
  messageType: 'DESADV'
  shipmentNumber: string
  shipmentDate: string
  orderReference?: string
  deliveryDate?: string
  shipper: Party
  consignee: Party
  shipTo?: Party
  carrier?: Carrier
  packages: Package[]
  items: ShipmentLineItem[]
}

/**
 * Carrier Information
 */
export interface Carrier {
  name: string
  scac?: string // Standard Carrier Alpha Code
  trackingNumber?: string
  serviceLevel?: string
}

/**
 * Package Information
 */
export interface Package {
  packageNumber: string
  packageType?: string // e.g., 'CTN', 'PLT', 'BOX'
  sscc?: string // Serial Shipping Container Code
  weight?: Measurement
  dimensions?: Dimensions
  items?: string[] // Line numbers contained in package
}

/**
 * Measurement
 */
export interface Measurement {
  value: number
  unit: string // e.g., 'KG', 'LB', 'G'
}

/**
 * Dimensions
 */
export interface Dimensions {
  length?: Measurement
  width?: Measurement
  height?: Measurement
}

/**
 * Shipment Line Item
 */
export interface ShipmentLineItem extends OrderLineItem {
  shippedQuantity: Quantity
  packageNumbers?: string[]
}

/**
 * RECADV - Receiving Advice
 * Maps to $.Receipt.confirmed
 */
export interface ReceivingAdviceEDI extends EDIDocument {
  messageType: 'RECADV'
  receiptNumber: string
  receiptDate: string
  orderReference?: string
  shipmentReference?: string
  receiver: Party
  supplier: Party
  items: ReceivedLineItem[]
}

/**
 * Received Line Item
 */
export interface ReceivedLineItem extends OrderLineItem {
  receivedQuantity: Quantity
  acceptedQuantity?: Quantity
  rejectedQuantity?: Quantity
  discrepancyCode?: string
  discrepancyReason?: string
}

/**
 * ORDRSP - Order Response
 * Maps to $.OrderResponse.received
 */
export interface OrderResponseEDI extends EDIDocument {
  messageType: 'ORDRSP'
  responseNumber: string
  responseDate: string
  orderReference: string
  responseCode: 'ACCEPTED' | 'REJECTED' | 'MODIFIED' | 'ACKNOWLEDGED'
  buyer: Party
  seller: Party
  items: OrderResponseLineItem[]
  notes?: string
}

/**
 * Order Response Line Item
 */
export interface OrderResponseLineItem extends OrderLineItem {
  lineStatus: 'ACCEPTED' | 'REJECTED' | 'MODIFIED' | 'BACKORDERED'
  confirmedQuantity?: Quantity
  confirmedPrice?: MonetaryAmount
  confirmedDeliveryDate?: string
  rejectionReason?: string
}

/**
 * ORDCHG - Order Change
 * Maps to $.PurchaseOrder.updated
 */
export interface OrderChangeEDI extends Omit<PurchaseOrderEDI, 'messageType'> {
  messageType: 'ORDCHG'
  originalOrderNumber: string
  changeReason?: string
}

/**
 * SLSRPT - Sales Report
 * Maps to $.SalesReport.generated
 */
export interface SalesReportEDI extends EDIDocument {
  messageType: 'SLSRPT'
  reportNumber: string
  reportDate: string
  reportPeriodStart: string
  reportPeriodEnd: string
  reporter: Party
  recipient: Party
  items: SalesLineItem[]
  totalSales?: MonetaryAmount
}

/**
 * Sales Line Item
 */
export interface SalesLineItem {
  productCode: string
  productCodeType?: string
  description?: string
  quantitySold: Quantity
  salesAmount: MonetaryAmount
  location?: string
}

/**
 * INVRPT - Inventory Report
 * Maps to $.InventoryReport.generated
 */
export interface InventoryReportEDI extends EDIDocument {
  messageType: 'INVRPT'
  reportNumber: string
  reportDate: string
  reporter: Party
  recipient: Party
  location?: string
  items: InventoryLineItem[]
}

/**
 * Inventory Line Item
 */
export interface InventoryLineItem {
  productCode: string
  productCodeType?: string
  description?: string
  quantityOnHand: Quantity
  quantityAvailable?: Quantity
  quantityReserved?: Quantity
  location?: string
  lastUpdated?: string
}

/**
 * PARTIN - Party Information
 * Maps to $.Party.registered
 */
export interface PartyInformationEDI extends EDIDocument {
  messageType: 'PARTIN'
  party: Party
  operationType: 'CREATE' | 'UPDATE' | 'DELETE'
  effectiveDate?: string
  expiryDate?: string
}

/**
 * PRICAT - Price Catalog
 * Maps to $.Catalog.published
 */
export interface PriceCatalogEDI extends EDIDocument {
  messageType: 'PRICAT'
  catalogNumber: string
  catalogDate: string
  effectiveDate?: string
  expiryDate?: string
  supplier: Party
  buyer?: Party
  currency: string
  items: CatalogLineItem[]
}

/**
 * Catalog Line Item
 */
export interface CatalogLineItem {
  productCode: string
  productCodeType?: string
  description?: string
  category?: string
  unitPrice: MonetaryAmount
  minimumOrderQuantity?: Quantity
  leadTime?: number // days
  availabilityDate?: string
}

/**
 * PRODAT - Product Data
 * Maps to $.Product.published
 */
export interface ProductDataEDI extends EDIDocument {
  messageType: 'PRODAT'
  productCode: string
  productCodeType?: string
  productName: string
  description?: string
  supplier: Party
  category?: string
  specifications?: ProductSpecification[]
  packaging?: PackagingInfo
  operationType: 'CREATE' | 'UPDATE' | 'DELETE'
}

/**
 * Product Specification
 */
export interface ProductSpecification {
  attribute: string
  value: string
  unit?: string
}

/**
 * Packaging Information
 */
export interface PackagingInfo {
  packageType?: string
  unitsPerPackage?: number
  packagesPerCase?: number
  weight?: Measurement
  dimensions?: Dimensions
}

/**
 * QUOTES - Quote
 * Maps to $.Quote.sent
 */
export interface QuoteEDI extends EDIDocument {
  messageType: 'QUOTES'
  quoteNumber: string
  quoteDate: string
  validUntil?: string
  requestReference?: string
  supplier: Party
  buyer: Party
  items: QuoteLineItem[]
  totalAmount?: MonetaryAmount
  currency: string
  terms?: PaymentTerms
}

/**
 * Quote Line Item
 */
export interface QuoteLineItem extends OrderLineItem {
  leadTime?: number
  validUntil?: string
}

/**
 * REMADV - Remittance Advice
 * Maps to $.Payment.remitted
 */
export interface RemittanceAdviceEDI extends EDIDocument {
  messageType: 'REMADV'
  remittanceNumber: string
  remittanceDate: string
  payer: Party
  payee: Party
  paymentMethod?: string
  paymentReference?: string
  totalAmount: MonetaryAmount
  currency: string
  invoices: RemittanceLineItem[]
}

/**
 * Remittance Line Item
 */
export interface RemittanceLineItem {
  invoiceNumber: string
  invoiceDate?: string
  invoiceAmount?: MonetaryAmount
  paidAmount: MonetaryAmount
  discountAmount?: MonetaryAmount
  adjustmentAmount?: MonetaryAmount
}

/**
 * EDI Message to Modern Event Mapping
 * Maps UN/EDIFACT message types to semantic event patterns
 */
export const EDI_TO_EVENT_MAP: Record<EDIMessageType, string> = {
  ORDERS: '$.PurchaseOrder.created',
  INVOIC: '$.Invoice.sent',
  DESADV: '$.ShippingNotice.sent',
  RECADV: '$.Receipt.confirmed',
  ORDRSP: '$.OrderResponse.received',
  ORDCHG: '$.PurchaseOrder.updated',
  SLSRPT: '$.SalesReport.generated',
  INVRPT: '$.InventoryReport.generated',
  PARTIN: '$.Party.registered',
  PRICAT: '$.Catalog.published',
  PRODAT: '$.Product.published',
  QUOTES: '$.Quote.sent',
  REMADV: '$.Payment.remitted',
}

/**
 * Modern Event to EDI Message Mapping
 * Reverse mapping for generating EDI from events
 */
export const EVENT_TO_EDI_MAP: Record<string, EDIMessageType> = {
  '$.PurchaseOrder.created': 'ORDERS',
  '$.Invoice.sent': 'INVOIC',
  '$.ShippingNotice.sent': 'DESADV',
  '$.Receipt.confirmed': 'RECADV',
  '$.OrderResponse.received': 'ORDRSP',
  '$.PurchaseOrder.updated': 'ORDCHG',
  '$.SalesReport.generated': 'SLSRPT',
  '$.InventoryReport.generated': 'INVRPT',
  '$.Party.registered': 'PARTIN',
  '$.Catalog.published': 'PRICAT',
  '$.Product.published': 'PRODAT',
  '$.Quote.sent': 'QUOTES',
  '$.Payment.remitted': 'REMADV',
}

/**
 * EDI Message Type Union
 * All possible EDI message types
 */
export type EDIMessage =
  | PurchaseOrderEDI
  | InvoiceEDI
  | DespatchAdviceEDI
  | ReceivingAdviceEDI
  | OrderResponseEDI
  | OrderChangeEDI
  | SalesReportEDI
  | InventoryReportEDI
  | PartyInformationEDI
  | PriceCatalogEDI
  | ProductDataEDI
  | QuoteEDI
  | RemittanceAdviceEDI

/**
 * EDI Transformation Error Codes
 */
export type EDIErrorCode = 'UNSUPPORTED_TYPE' | 'INVALID_DATA' | 'TRANSFORMATION_ERROR' | 'VALIDATION_ERROR' | 'MISSING_REQUIRED_FIELD'

/**
 * EDI Transformation Result
 */
export interface EDITransformResult<T = any> {
  success: boolean
  data?: T
  error?: string
  errorCode?: EDIErrorCode
  warnings?: string[]
}

/**
 * EDI Validation Result
 */
export interface EDIValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

/**
 * Validation Error
 */
export interface ValidationError {
  field: string
  message: string
  code?: string
}

/**
 * Validation Warning
 */
export interface ValidationWarning {
  field: string
  message: string
  code?: string
}

/**
 * EDI Transmission Options
 */
export interface EDITransmissionOptions {
  protocol?: 'AS2' | 'SFTP' | 'HTTPS' | 'FTPS'
  encoding?: 'UTF-8' | 'ISO-8859-1' | 'ASCII'
  compression?: boolean
  encryption?: boolean
  acknowledgment?: boolean
}

/**
 * EDI Acknowledgment (CONTRL)
 */
export interface EDIAcknowledgment {
  $type: 'EDIAcknowledgment'
  $id: string
  messageReference: string
  status: 'ACCEPTED' | 'REJECTED' | 'PARTIALLY_ACCEPTED'
  timestamp: string
  errors?: ValidationError[]
}

// ============================================================================
// Input Type Interfaces (for type-safe transformations)
// ============================================================================

/**
 * Purchase Order Input (for toEDI transformation)
 */
export interface PurchaseOrderInput {
  $id?: string
  orderNumber: string
  orderDate: string
  deliveryDate?: string
  buyer: Party
  seller: Party
  shipTo?: Party
  billTo?: Party
  items: OrderLineItem[]
  totalAmount?: MonetaryAmount
  currency?: string
  terms?: PaymentTerms
  notes?: string
}

/**
 * Invoice Input (for toEDI transformation)
 */
export interface InvoiceInput {
  $id?: string
  invoiceNumber: string
  invoiceDate: string
  orderReference?: string
  buyer: Party
  seller: Party
  billTo?: Party
  items: InvoiceLineItem[]
  subtotal?: MonetaryAmount
  tax?: TaxAmount
  total: MonetaryAmount
  currency: string
  terms?: PaymentTerms
  dueDate?: string
}

/**
 * Despatch Advice Input (for toEDI transformation)
 */
export interface DespatchAdviceInput {
  $id?: string
  shipmentNumber: string
  shipmentDate: string
  orderReference?: string
  deliveryDate?: string
  shipper: Party
  consignee: Party
  shipTo?: Party
  carrier?: Carrier
  packages: Package[]
  items: ShipmentLineItem[]
}

/**
 * Receiving Advice Input (for toEDI transformation)
 */
export interface ReceivingAdviceInput {
  $id?: string
  receiptNumber: string
  receiptDate: string
  orderReference?: string
  shipmentReference?: string
  receiver: Party
  supplier: Party
  items: ReceivedLineItem[]
}

/**
 * Order Response Input (for toEDI transformation)
 */
export interface OrderResponseInput {
  $id?: string
  responseNumber: string
  responseDate: string
  orderReference: string
  responseCode: 'ACCEPTED' | 'REJECTED' | 'MODIFIED' | 'ACKNOWLEDGED'
  buyer: Party
  seller: Party
  items: OrderResponseLineItem[]
  notes?: string
}

/**
 * Order Change Input (for toEDI transformation)
 */
export interface OrderChangeInput extends PurchaseOrderInput {
  originalOrderNumber: string
  changeReason?: string
}

/**
 * Sales Report Input (for toEDI transformation)
 */
export interface SalesReportInput {
  $id?: string
  reportNumber: string
  reportDate: string
  reportPeriodStart: string
  reportPeriodEnd: string
  reporter: Party
  recipient: Party
  items: SalesLineItem[]
  totalSales?: MonetaryAmount
}

/**
 * Inventory Report Input (for toEDI transformation)
 */
export interface InventoryReportInput {
  $id?: string
  reportNumber: string
  reportDate: string
  reporter: Party
  recipient: Party
  location?: string
  items: InventoryLineItem[]
}

/**
 * Party Information Input (for toEDI transformation)
 */
export interface PartyInformationInput {
  $id?: string
  party: Party
  operationType: 'CREATE' | 'UPDATE' | 'DELETE'
  effectiveDate?: string
  expiryDate?: string
  sender: Party
  receiver: Party
  documentDate: string
  documentNumber: string
}

/**
 * Price Catalog Input (for toEDI transformation)
 */
export interface PriceCatalogInput {
  $id?: string
  catalogNumber: string
  catalogDate: string
  effectiveDate?: string
  expiryDate?: string
  supplier: Party
  buyer?: Party
  currency: string
  items: CatalogLineItem[]
}

/**
 * Product Data Input (for toEDI transformation)
 */
export interface ProductDataInput {
  $id?: string
  productCode: string
  productCodeType?: string
  productName: string
  description?: string
  supplier: Party
  category?: string
  specifications?: ProductSpecification[]
  packaging?: PackagingInfo
  operationType: 'CREATE' | 'UPDATE' | 'DELETE'
  receiver: Party
  documentDate: string
  documentNumber: string
}

/**
 * Quote Input (for toEDI transformation)
 */
export interface QuoteInput {
  $id?: string
  quoteNumber: string
  quoteDate: string
  validUntil?: string
  requestReference?: string
  supplier: Party
  buyer: Party
  items: QuoteLineItem[]
  totalAmount?: MonetaryAmount
  currency: string
  terms?: PaymentTerms
}

/**
 * Remittance Advice Input (for toEDI transformation)
 */
export interface RemittanceAdviceInput {
  $id?: string
  remittanceNumber: string
  remittanceDate: string
  payer: Party
  payee: Party
  paymentMethod?: string
  paymentReference?: string
  totalAmount: MonetaryAmount
  currency: string
  invoices: RemittanceLineItem[]
}
