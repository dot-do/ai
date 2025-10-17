/**
 * GS1 Core Business Vocabulary (CBV) Types
 */

/**
 * Business Step Vocabulary (camelCase)
 * From GS1 Core Business Vocabulary (CBV)
 */
export type BizStep =
  | 'accepting'
  | 'arriving'
  | 'assembling'
  | 'collecting'
  | 'commissioning'
  | 'consigning'
  | 'creating'
  | 'creatingClassInstance'
  | 'cycleCounting'
  | 'decommissioning'
  | 'departing'
  | 'destroying'
  | 'disassembling'
  | 'dispensing'
  | 'encoding'
  | 'entering'
  | 'enteringExiting'
  | 'exiting'
  | 'holding'
  | 'inspecting'
  | 'installing'
  | 'killing'
  | 'leaving'
  | 'loading'
  | 'observing'
  | 'other'
  | 'packing'
  | 'picking'
  | 'receiving'
  | 'removing'
  | 'repackaging'
  | 'repairing'
  | 'replacing'
  | 'reserving'
  | 'retailSelling'
  | 'shipping'
  | 'staging'
  | 'stagingOutbound'
  | 'stockTaking'
  | 'stocking'
  | 'storing'
  | 'transforming'
  | 'transporting'
  | 'unloading'
  | 'unpacking'
  | 'voidShipping'

/**
 * Disposition Vocabulary (camelCase)
 * From GS1 Core Business Vocabulary (CBV)
 */
export type Disposition =
  | 'active'
  | 'available'
  | 'completenessInferred'
  | 'completenessVerified'
  | 'conformant'
  | 'containerClosed'
  | 'containerOpen'
  | 'damaged'
  | 'destroyed'
  | 'dispensed'
  | 'disposed'
  | 'encoded'
  | 'expired'
  | 'inProgress'
  | 'inTransit'
  | 'inactive'
  | 'installed'
  | 'mismatchClass'
  | 'mismatchInstance'
  | 'mismatchQuantity'
  | 'noPedigreeMatch'
  | 'nonConformant'
  | 'nonSellableOther'
  | 'partiallyDispensed'
  | 'recalled'
  | 'reserved'
  | 'retailSold'
  | 'returned'
  | 'sellableAccessible'
  | 'sellableNotAccessible'
  | 'stolen'
  | 'unknown'

/**
 * Business Transaction Type Vocabulary
 */
export type BizTransactionType = 'bol' | 'desadv' | 'inv' | 'pedigree' | 'po' | 'poc' | 'prodorder' | 'recadv' | 'rma' | 'testprd' | 'upk'

/**
 * Source/Destination Type Vocabulary
 */
export type SourceDestType = 'owningParty' | 'possessingParty' | 'location'

/**
 * Error Reason Vocabulary
 */
export type ErrorReason = 'didNotOccur' | 'incorrectData'

/**
 * Sensor Measurement Type
 */
export type SensorMeasurementType =
  | 'Temperature'
  | 'Humidity'
  | 'Pressure'
  | 'Speed'
  | 'Illuminance'
  | 'Length'
  | 'Area'
  | 'Volume'
  | 'Mass'
  | 'Time'
  | 'AbsoluteHumidity'
  | 'Acceleration'
  | 'Altitude'
  | 'Angle'
  | 'Count'
  | 'Density'
  | 'Energy'
  | 'Force'
  | 'Molar'
  | 'Power'
  | 'Resistance'
  | 'Voltage'

/**
 * CBV Standard Values
 */
export interface CBVVocabulary {
  bizSteps: BizStep[]
  dispositions: Disposition[]
  bizTransactionTypes: BizTransactionType[]
  sourceDestTypes: SourceDestType[]
  errorReasons: ErrorReason[]
  sensorMeasurementTypes: SensorMeasurementType[]
}
