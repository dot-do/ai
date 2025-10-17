/**
 * Process type definitions for process.org.ai
 *
 * Enhanced business process types building on APQC PCF
 * This is the significantly enhanced superset (like tech.org.ai to O*NET)
 */

import type { Thing, Ref } from './base.js'

/**
 * Process maturity levels
 */
export type ProcessMaturity = 'Initial' | 'Managed' | 'Defined' | 'Quantitatively Managed' | 'Optimizing'

/**
 * Process automation potential
 */
export type AutomationPotential = 'Low' | 'Medium' | 'High' | 'Very High'

/**
 * Process categories
 */
export type ProcessCategory =
  | 'Core Business'
  | 'Support'
  | 'Management'
  | 'Innovation'
  | 'Customer-Facing'
  | 'Back Office'
  | string

/**
 * BusinessProcess - Enhanced business process
 *
 * Significantly enhanced process definition combining APQC PCF with:
 * - Semantic relationships to technologies, occupations, tasks
 * - Automation potential and AI readiness
 * - Industry applicability
 * - Best practices and patterns
 */
export interface BusinessProcess extends Thing {
  $type: 'BusinessProcess'

  // Core identifiers
  processId: string // Unique process ID
  processName: string // Process name
  category: ProcessCategory

  // APQC mapping (if derived from APQC)
  apqcId?: string // Reference to apqc.org.ai process
  apqcLevel?: number // APQC hierarchy level

  // Enhanced metadata
  maturity?: ProcessMaturity
  automationPotential?: AutomationPotential
  aiReady?: boolean // Can be automated with AI
  description?: string
  objectives?: string[] // Process objectives
  kpis?: string[] // Key performance indicators
  bestPractices?: string[] // Best practices
  commonPitfalls?: string[] // Common mistakes

  // Industry applicability
  industries?: string[] // Industries where applicable
  crossIndustry?: boolean // Applicable across industries

  // Semantic relationships (explicit predicates)
  hasSubprocess?: Ref[] // $.BusinessProcess.hasSubprocess.BusinessProcess
  partOf?: Ref // $.BusinessProcess.partOf.BusinessProcess
  requires?: Ref[] // $.BusinessProcess.requires.Technology
  enabledBy?: Ref[] // $.BusinessProcess.enabledBy.Technology
  performedBy?: Ref[] // $.BusinessProcess.performedBy.Occupation
  involves?: Ref[] // $.BusinessProcess.involves.Task
  produces?: Ref[] // $.BusinessProcess.produces.Output
  consumes?: Ref[] // $.BusinessProcess.consumes.Input
  relatedTo?: Ref[] // $.BusinessProcess.relatedTo.BusinessProcess
  optimizedBy?: Ref[] // $.BusinessProcess.optimizedBy.Service
}
