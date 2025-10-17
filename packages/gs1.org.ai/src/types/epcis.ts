/**
 * EPCIS (Electronic Product Code Information Services) Types
 */

export type EventType = 'ObjectEvent' | 'AggregationEvent' | 'TransactionEvent' | 'TransformationEvent' | 'AssociationEvent'

export type Action = 'ADD' | 'OBSERVE' | 'DELETE'

/**
 * Base EPCIS Event
 * Uses $ prefix for consistency with linked data
 */
export interface EPCISEvent {
  $context?: string | string[]
  type: EventType
  eventTime: string
  eventTimeZoneOffset: string
  recordTime?: string
  eventID?: string
  errorDeclaration?: ErrorDeclaration
  certificationInfo?: string
  [key: string]: any
}

/**
 * Object Event - captures information about an event that happened to one or more objects
 */
export interface ObjectEvent extends EPCISEvent {
  type: 'ObjectEvent'
  epcList?: string[]
  action: Action
  bizStep?: string
  disposition?: string
  readPoint?: ReadPoint
  bizLocation?: BizLocation
  bizTransactionList?: BizTransaction[]
  quantityList?: QuantityElement[]
  sourceList?: Source[]
  destinationList?: Destination[]
  ilmd?: Record<string, any>
  persistentDisposition?: PersistentDisposition
  sensorElementList?: SensorElement[]
}

/**
 * Aggregation Event - captures information about aggregation/disaggregation
 */
export interface AggregationEvent extends EPCISEvent {
  type: 'AggregationEvent'
  parentID?: string
  childEPCs?: string[]
  action: Action
  bizStep?: string
  disposition?: string
  readPoint?: ReadPoint
  bizLocation?: BizLocation
  bizTransactionList?: BizTransaction[]
  childQuantityList?: QuantityElement[]
  sourceList?: Source[]
  destinationList?: Destination[]
  persistentDisposition?: PersistentDisposition
  sensorElementList?: SensorElement[]
}

/**
 * Transaction Event - captures business transaction information
 */
export interface TransactionEvent extends EPCISEvent {
  type: 'TransactionEvent'
  bizTransactionList: BizTransaction[]
  parentID?: string
  epcList?: string[]
  action: Action
  bizStep?: string
  disposition?: string
  readPoint?: ReadPoint
  bizLocation?: BizLocation
  quantityList?: QuantityElement[]
  sourceList?: Source[]
  destinationList?: Destination[]
  persistentDisposition?: PersistentDisposition
  sensorElementList?: SensorElement[]
}

/**
 * Transformation Event - captures input/output transformation
 */
export interface TransformationEvent extends EPCISEvent {
  type: 'TransformationEvent'
  inputEPCList?: string[]
  inputQuantityList?: QuantityElement[]
  outputEPCList?: string[]
  outputQuantityList?: QuantityElement[]
  transformationID?: string
  bizStep?: string
  disposition?: string
  readPoint?: ReadPoint
  bizLocation?: BizLocation
  bizTransactionList?: BizTransaction[]
  sourceList?: Source[]
  destinationList?: Destination[]
  ilmd?: Record<string, any>
  persistentDisposition?: PersistentDisposition
  sensorElementList?: SensorElement[]
}

/**
 * Association Event - captures associations between objects
 */
export interface AssociationEvent extends EPCISEvent {
  type: 'AssociationEvent'
  parentID?: string
  childEPCs?: string[]
  action: Action
  bizStep?: string
  disposition?: string
  readPoint?: ReadPoint
  bizLocation?: BizLocation
  bizTransactionList?: BizTransaction[]
  childQuantityList?: QuantityElement[]
  sourceList?: Source[]
  destinationList?: Destination[]
  persistentDisposition?: PersistentDisposition
  sensorElementList?: SensorElement[]
}

/**
 * Supporting Types
 */

export interface ReadPoint {
  id: string
  [key: string]: any
}

export interface BizLocation {
  id: string
  [key: string]: any
}

export interface BizTransaction {
  type: string
  bizTransaction: string
}

export interface QuantityElement {
  epcClass: string
  quantity?: number
  uom?: string
}

export interface Source {
  type: string
  source: string
}

export interface Destination {
  type: string
  destination: string
}

export interface ErrorDeclaration {
  declarationTime: string
  reason?: string
  correctiveEventIDs?: string[]
  [key: string]: any
}

export interface PersistentDisposition {
  set?: string[]
  unset?: string[]
}

export interface SensorElement {
  sensorMetadata?: SensorMetadata
  sensorReport: SensorReport[]
}

export interface SensorMetadata {
  time?: string
  startTime?: string
  endTime?: string
  deviceID?: string
  deviceMetadata?: string
  rawData?: string
  dataProcessingMethod?: string
  bizRules?: string
}

export interface SensorReport {
  type: string
  value?: number
  stringValue?: string
  booleanValue?: boolean
  hexBinaryValue?: string
  uriValue?: string
  component?: string
  uom?: string
  minValue?: number
  maxValue?: number
  meanValue?: number
  sDev?: number
  percRank?: number
  percValue?: number
  deviceID?: string
  deviceMetadata?: string
  rawData?: string
  time?: string
  microorganism?: string
  chemicalSubstance?: string
  coordinateReferenceSystem?: string
}
