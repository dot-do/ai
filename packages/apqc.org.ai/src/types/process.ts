/**
 * Process type definitions for apqc.org.ai
 *
 * Based on APQC Process Classification Framework (PCF) v7.3.0
 */

import type { Thing, Ref } from './base.js'

/**
 * Process levels in APQC PCF hierarchy
 */
export type ProcessLevel = 1 | 2 | 3 | 4 | 5

/**
 * Process categories (Level 1)
 */
export type ProcessCategory =
  | 'Operating Processes'
  | 'Management and Support Processes'
  | string

/**
 * Process - Business process from APQC PCF
 *
 * Represents a process element from the APQC Process Classification Framework
 */
export interface Process extends Thing {
  $type: 'Process'

  // APQC identifiers
  processId: string // APQC process ID (e.g., "1.0", "1.1", "1.1.1")
  processName: string // Process name
  level: ProcessLevel // Hierarchy level (1-5)
  category?: ProcessCategory // Top-level category
  parentId?: string // Parent process ID

  // Optional properties
  definition?: string // Process definition/description
  industrySpecific?: boolean // Industry-specific vs cross-industry
  industry?: string // Industry (if specific)
  version?: string // PCF version (e.g., "7.3.0")

  // Semantic relationships (explicit predicates)
  hasSubprocess?: Ref[] // $.Process.hasSubprocess.Process
  partOf?: Ref // $.Process.partOf.Process
  relatedTo?: Ref[] // $.Process.relatedTo.Process
  enabledBy?: Ref[] // $.Process.enabledBy.Technology
  performedBy?: Ref[] // $.Process.performedBy.Occupation
}
