/**
 * Industry type definitions for industries.org.ai
 *
 * Enhanced industry classification building on NAICS
 * This is the significantly enhanced superset (like tech.org.ai to O*NET)
 */

import type { Thing, Ref } from './base.js'

/**
 * Industry maturity stages
 */
export type IndustryMaturity = 'Emerging' | 'Growth' | 'Mature' | 'Declining' | 'Transforming'

/**
 * Digital transformation readiness
 */
export type DigitalReadiness = 'Low' | 'Medium' | 'High' | 'Very High' | 'Digital Native'

/**
 * Industry disruption risk
 */
export type DisruptionRisk = 'Low' | 'Medium' | 'High' | 'Critical'

/**
 * Industry - Enhanced industry classification
 *
 * Significantly enhanced industry definition combining NAICS with:
 * - Digital transformation and AI adoption patterns
 * - Disruption risk and competitive dynamics
 * - Regulatory environment
 * - Technology stack and process requirements
 */
export interface Industry extends Thing {
  $type: 'Industry'

  // Core identifiers
  industryId: string // Unique industry ID
  industryName: string // Industry name

  // NAICS mapping (if derived from NAICS)
  naicsCode?: string // Reference to naics.org.ai code
  naicsLevel?: number // NAICS hierarchy level (2, 3, 4, 5, or 6 digit)

  // Enhanced metadata
  maturity?: IndustryMaturity
  digitalReadiness?: DigitalReadiness
  disruptionRisk?: DisruptionRisk
  aiAdoption?: 'Early' | 'Mainstream' | 'Laggard'
  description?: string

  // Market characteristics
  marketSize?: string // e.g., "$500B", "50M businesses"
  growthRate?: number // Annual growth rate percentage
  concentration?: 'Fragmented' | 'Consolidated' | 'Oligopoly' | 'Monopoly'
  barriers?: string[] // Entry barriers

  // Regulatory environment
  regulated?: boolean
  regulations?: string[] // Key regulations (e.g., "HIPAA", "SOX", "GDPR")
  compliance?: string[] // Compliance requirements

  // Technology & innovation
  keyTechnologies?: string[] // Critical technologies
  innovationRate?: 'Slow' | 'Moderate' | 'Fast' | 'Rapid'
  disruptors?: string[] // Disruptive forces/companies

  // Business model patterns
  businessModels?: string[] // Common models (B2B, B2C, SaaS, etc.)
  revenueModels?: string[] // Revenue models (subscription, transaction, etc.)

  // Semantic relationships (explicit predicates)
  partOf?: Ref // $.Industry.partOf.Industry (parent industry)
  hasSubindustry?: Ref[] // $.Industry.hasSubindustry.Industry
  requires?: Ref[] // $.Industry.requires.Technology
  employs?: Ref[] // $.Industry.employs.Occupation
  uses?: Ref[] // $.Industry.uses.BusinessProcess
  disruptedBy?: Ref[] // $.Industry.disruptedBy.Technology
  regulatedBy?: Ref[] // $.Industry.regulatedBy.Authority
  relatedTo?: Ref[] // $.Industry.relatedTo.Industry
  transformedBy?: Ref[] // $.Industry.transformedBy.Service
}
