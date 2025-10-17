/**
 * Job type definitions for jobs.org.ai
 *
 * Based on O*NET Database 30.0 - Alternate Titles
 */

import type { Thing, Ref } from './base.js'

/**
 * Job - Job title or occupational role
 *
 * Represents a job title from the O*NET Alternate Titles dataset
 */
export interface Job extends Thing {
  $type: 'Job'

  // O*NET identifiers
  onetSocCode: string // O*NET-SOC occupation code
  alternateTitle: string // Alternative job title
  shortTitle?: string // Short title (if available)
  sources?: string[] // Sources for this title (O*NET, Career One Stop, etc.)

  // Semantic relationships (explicit predicates)
  isVariantOf?: Ref // $.Job.isVariantOf.Occupation
  relatedTo?: Ref[] // $.Job.relatedTo.Job
  requires?: Ref[] // $.Job.requires.Technology
  performs?: Ref[] // $.Job.performs.Task
}
