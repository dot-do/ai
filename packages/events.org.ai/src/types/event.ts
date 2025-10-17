/**
 * Event type definitions for events.org.ai
 *
 * Enhanced business event types building on GS1 EPCIS
 * Based on 5W+H model (What, When, Where, Who, Why, How)
 * This is the significantly enhanced superset (like tech.org.ai to O*NET)
 */

import type { Thing, Ref } from './base.js'

/**
 * Event types from GS1 EPCIS + extensions
 */
export type EventType =
  // GS1 EPCIS core events
  | 'ObjectEvent' // What happened to objects
  | 'AggregationEvent' // Objects aggregated/disaggregated
  | 'TransactionEvent' // Business transaction
  | 'TransformationEvent' // Objects transformed
  | 'AssociationEvent' // Objects associated
  // Enhanced event types
  | 'StateChangeEvent' // State/status change
  | 'LocationEvent' // Location/movement
  | 'OwnershipEvent' // Ownership transfer
  | 'QualityEvent' // Quality/compliance
  | 'ProcessEvent' // Process execution
  | 'CustomEvent' // Custom business event
  | string

/**
 * Business step types (Why - business context)
 */
export type BusinessStep =
  | 'commissioning'
  | 'decommissioning'
  | 'shipping'
  | 'receiving'
  | 'accepting'
  | 'inspecting'
  | 'packing'
  | 'unpacking'
  | 'storing'
  | 'picking'
  | 'loading'
  | 'unloading'
  | 'installing'
  | 'destroying'
  | 'repairing'
  | 'recycling'
  | string

/**
 * Disposition types (Why - business state)
 */
export type Disposition =
  | 'active'
  | 'inactive'
  | 'in_progress'
  | 'in_transit'
  | 'available'
  | 'unavailable'
  | 'damaged'
  | 'expired'
  | 'recalled'
  | 'reserved'
  | 'sold'
  | 'returned'
  | string

/**
 * BusinessEvent - Enhanced business event
 *
 * Based on GS1 EPCIS 5W+H model with significant enhancements:
 * - What: Objects/entities involved
 * - When: Timestamp and duration
 * - Where: Location (physical/virtual)
 * - Who: Actors and roles
 * - Why: Business context (step + disposition)
 * - How: Process and technology
 */
export interface BusinessEvent extends Thing {
  $type: 'BusinessEvent'

  // Core identifiers
  eventId: string // Unique event ID
  eventType: EventType
  eventTime: string // ISO 8601 timestamp

  // What (Objects/Entities)
  objects?: Ref[] // What objects are involved
  quantity?: number // How many
  uom?: string // Unit of measure

  // When (Temporal)
  eventTimeZone?: string // Timezone offset
  recordTime?: string // When recorded (vs when occurred)
  duration?: number // Event duration in seconds

  // Where (Location)
  readPoint?: Ref // Physical location where event occurred
  bizLocation?: Ref // Business location
  sourceLocation?: Ref // Source location (for movements)
  destinationLocation?: Ref // Destination location

  // Who (Actors)
  actor?: Ref // Who performed the action
  owner?: Ref // Who owns the objects
  custodian?: Ref // Who has custody
  organization?: Ref // Organizing entity

  // Why (Business Context)
  businessStep?: BusinessStep // What business process step
  disposition?: Disposition // What is the business state
  businessTransaction?: Ref // Associated transaction
  purpose?: string // Purpose/reason

  // How (Process & Technology)
  process?: Ref // Business process
  technology?: Ref // Technology used
  method?: string // Method/procedure

  // GS1 EPCIS compatibility
  epcisEventType?: string // Original EPCIS event type
  action?: 'ADD' | 'OBSERVE' | 'DELETE' // EPCIS action
  bizStep?: string // GS1 business step URI
  readPointId?: string // GS1 read point ID
  bizLocationId?: string // GS1 business location ID

  // Enhanced metadata
  severity?: 'Low' | 'Medium' | 'High' | 'Critical'
  automated?: boolean // Was event automated
  validated?: boolean // Was event validated
  source?: string // Event source system
  metadata?: Record<string, any> // Additional metadata

  // Semantic relationships (explicit predicates)
  triggeredBy?: Ref // $.BusinessEvent.triggeredBy.BusinessEvent
  triggers?: Ref[] // $.BusinessEvent.triggers.BusinessEvent
  partOfProcess?: Ref // $.BusinessEvent.partOfProcess.BusinessProcess
  involves?: Ref[] // $.BusinessEvent.involves.Thing
  relatedTo?: Ref[] // $.BusinessEvent.relatedTo.BusinessEvent
}
