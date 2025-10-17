/**
 * Technology types for tech.org.ai
 *
 * Software technologies, programming languages, frameworks, databases, and development tools
 */

import type { Thing, Ref } from './base.js'

/**
 * Technology - Software, programming language, framework, database, or development tool
 *
 * Semantic triples:
 * - $.Technology.usedBy.Occupation
 * - $.Technology.requiredFor.Task
 * - $.Technology.extends.Technology (e.g., TypeScript extends JavaScript)
 * - $.Technology.integrates.Technology
 */
export interface Technology extends Thing {
  $type: 'Technology'
  commodityCode: string        // O*NET commodity code
  commodityTitle: string        // Technology name (e.g., "Python", "React")
  category: TechnologyCategory  // Type of technology
  hotTechnology?: boolean       // O*NET hot technology flag (emerging/in-demand)

  // Vendor/product information
  vendor?: string               // Vendor/maintainer (e.g., "Python Software Foundation")
  example?: string              // Specific example (e.g., "Python 3.11")
  examples?: string[]           // Multiple examples

  // Semantic relationships (explicit predicates)
  usedBy?: Ref[]                // Occupations that use this technology
  requiredFor?: Ref[]           // Tasks that require this technology

  // Technology relationships
  extends?: Ref                 // Parent technology (inheritance)
  integrates?: Ref[]            // Technologies this integrates with
}

/**
 * Technology Category - Type of technology
 *
 * Using string union type instead of enum for flexibility
 */
export type TechnologyCategory =
  | 'Programming Language'
  | 'Framework'
  | 'Library'
  | 'Database'
  | 'Operating System'
  | 'Development Tool'
  | 'Business Application'
  | 'Cloud Platform'
  | 'Web Server'
  | 'Other'
  | string // Allow any string for uncategorized technologies

/**
 * Technology Stack - Collection of technologies used together
 *
 * Semantic triples:
 * - $.TechnologyStack.includes.Technology
 */
export interface TechnologyStack extends Thing {
  $type: 'TechnologyStack'
  name: string                  // Stack name (e.g., "MERN", "LAMP", "JAMstack")
  includes: Ref[]               // Technologies in this stack
}
