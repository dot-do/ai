/**
 * onet.org.ai - O*NET Complete Database Meta-Package
 *
 * Unified access to all O*NET vocabularies:
 * - soc.org.ai - 923 occupations (SOC codes)
 * - tech.org.ai - 135 technologies
 * - tools.org.ai - Physical tools and equipment
 * - tasks.org.ai - 19,000+ occupational tasks
 * - jobs.org.ai - Job titles and alternate names
 *
 * Re-exports all types and data from O*NET packages
 */

// Re-export occupations
export * from 'soc.org.ai'
export type { Occupation, SOCCode, OccupationCategory } from 'soc.org.ai'

// Re-export technologies
export * from 'tech.org.ai'
export type { Technology, TechnologyCategory } from 'tech.org.ai'

// Re-export tools
export * from 'tools.org.ai'
export type { Tool, ToolCategory } from 'tools.org.ai'

// Re-export tasks
export * from 'tasks.org.ai'
export type { Task, TaskType } from 'tasks.org.ai'

// Re-export jobs
export * from 'jobs.org.ai'
export type { JobTitle, JobTitleType } from 'jobs.org.ai'

/**
 * Convenience namespaces for organized access
 */
export * as soc from 'soc.org.ai'
export * as tech from 'tech.org.ai'
export * as tools from 'tools.org.ai'
export * as tasks from 'tasks.org.ai'
export * as jobs from 'jobs.org.ai'
