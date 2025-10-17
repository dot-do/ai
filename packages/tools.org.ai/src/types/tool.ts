/**
 * Tool type definitions for tools.org.ai
 *
 * Based on O*NET Database 30.0 - Tools and Technology
 */

import type { Thing, Ref } from './base.js'

/**
 * Tool categories based on O*NET classification
 */
export type ToolCategory =
  | 'Hand Tool'
  | 'Power Tool'
  | 'Measuring Tool'
  | 'Safety Equipment'
  | 'Medical Equipment'
  | 'Scientific Equipment'
  | 'Construction Equipment'
  | 'Agricultural Equipment'
  | 'Manufacturing Equipment'
  | 'Computer Hardware'
  | 'Vehicle'
  | 'Machinery'
  | 'Instrument'
  | 'Office Equipment'
  | 'Other'
  | string // Allow any string for uncategorized tools

/**
 * Tool - Physical tool, equipment, or instrument
 *
 * Represents a physical tool or equipment from the O*NET Tools and Technology dataset
 */
export interface Tool extends Thing {
  $type: 'Tool'

  // O*NET identifiers
  commodityCode: string // T2 code (Tools & Technology)
  commodityTitle: string // Tool name
  category: ToolCategory

  // Optional properties
  vendor?: string // Manufacturer/vendor
  example?: string // Specific example/model
  examples?: string[] // Multiple examples

  // Semantic relationships (explicit predicates)
  usedBy?: Ref[] // $.Tool.usedBy.Occupation
  requiredFor?: Ref[] // $.Tool.requiredFor.Task
  relatedTo?: Ref[] // $.Tool.relatedTo.Tool
}
