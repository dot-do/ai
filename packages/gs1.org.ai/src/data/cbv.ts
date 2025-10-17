import type { BizStep, Disposition, BizTransactionType, SourceDestType, ErrorReason, SensorMeasurementType, CBVVocabulary } from '../types/cbv.js'

/**
 * GS1 CBV Standard Vocabularies
 */

export const bizSteps: BizStep[] = [
  'accepting',
  'arriving',
  'assembling',
  'collecting',
  'commissioning',
  'consigning',
  'creatingClassInstance',
  'cycleCounting',
  'decommissioning',
  'departing',
  'destroying',
  'disassembling',
  'dispensing',
  'encoding',
  'enteringExiting',
  'holding',
  'inspecting',
  'installing',
  'killing',
  'loading',
  'other',
  'packing',
  'picking',
  'receiving',
  'removing',
  'repackaging',
  'repairing',
  'replacing',
  'reserving',
  'retailSelling',
  'shipping',
  'stagingOutbound',
  'stockTaking',
  'stocking',
  'storing',
  'transforming',
  'transporting',
  'unloading',
  'unpacking',
  'voidShipping',
]

export const dispositions: Disposition[] = [
  'active',
  'available',
  'completenessInferred',
  'completenessVerified',
  'conformant',
  'containerClosed',
  'containerOpen',
  'damaged',
  'destroyed',
  'dispensed',
  'disposed',
  'encoded',
  'expired',
  'inProgress',
  'inTransit',
  'inactive',
  'mismatchClass',
  'mismatchInstance',
  'mismatchQuantity',
  'noPedigreeMatch',
  'nonConformant',
  'nonSellableOther',
  'partiallyDispensed',
  'recalled',
  'reserved',
  'retailSold',
  'returned',
  'sellableAccessible',
  'sellableNotAccessible',
  'stolen',
  'unknown',
]

export const bizTransactionTypes: BizTransactionType[] = ['bol', 'desadv', 'inv', 'pedigree', 'po', 'poc', 'prodorder', 'recadv', 'rma', 'testprd', 'upk']

export const sourceDestTypes: SourceDestType[] = ['owningParty', 'possessingParty', 'location']

export const errorReasons: ErrorReason[] = ['didNotOccur', 'incorrectData']

export const sensorMeasurementTypes: SensorMeasurementType[] = [
  'Temperature',
  'Humidity',
  'Pressure',
  'Speed',
  'Illuminance',
  'Length',
  'Area',
  'Volume',
  'Mass',
  'Time',
  'AbsoluteHumidity',
  'Acceleration',
  'Altitude',
  'Angle',
  'Count',
  'Density',
  'Energy',
  'Force',
  'Molar',
  'Power',
  'Resistance',
  'Voltage',
]

export const cbvVocabulary: CBVVocabulary = {
  bizSteps,
  dispositions,
  bizTransactionTypes,
  sourceDestTypes,
  errorReasons,
  sensorMeasurementTypes,
}

// Tree-shakeable getters
export function getBizSteps(): BizStep[] {
  return bizSteps
}

export function getDispositions(): Disposition[] {
  return dispositions
}

export function getBizTransactionTypes(): BizTransactionType[] {
  return bizTransactionTypes
}

export function getSourceDestTypes(): SourceDestType[] {
  return sourceDestTypes
}

export function getErrorReasons(): ErrorReason[] {
  return errorReasons
}

export function getSensorMeasurementTypes(): SensorMeasurementType[] {
  return sensorMeasurementTypes
}

export function getCBVVocabulary(): CBVVocabulary {
  return cbvVocabulary
}
