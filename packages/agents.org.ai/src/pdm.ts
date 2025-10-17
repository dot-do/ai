/**
 * Product Manager (pdm) Agent Implementation
 * Based on OpenAI AgentKit primitives
 */

import type { Agent, AgentTool, AgentTrigger, AgentHandoff, AgentGuardrail, EscalationRule, PrioritizationRule, PRMetadata } from './types.js'

/**
 * Product Manager Agent configuration
 * Named agent: Dara
 */
export const pdmAgent: Agent = {
  $type: 'Agent',
  $id: 'https://platform.do/agents/pdm',
  name: 'pdm',
  version: '1.0.0',
  description:
    'Product Manager agent (Dara) that manages the implementation of the roadmap, reviews PRs, and coordinates with the team through GitHub and multi-channel communication.',
  model: 'gpt-5',
  agent: 'Dara',
  role: 'Product Manager',

  capabilities: [
    'Review and manage pull requests',
    'Coordinate roadmap implementation',
    'Triage and clarify issues',
    'Make merge/close decisions on PRs',
    'Communicate with team via GitHub, text, email, and voice',
    'Monitor code review completions',
    'Escalate blocking issues',
  ],

  tools: [
    {
      name: 'github_repos',
      description: 'Access and manage GitHub repositories',
      type: 'integration',
      enabled: true,
    },
    {
      name: 'github_issues',
      description: 'Create, update, and triage GitHub issues',
      type: 'integration',
      enabled: true,
    },
    {
      name: 'github_projects',
      description: 'Manage GitHub project boards',
      type: 'integration',
      enabled: true,
    },
    {
      name: 'github_pull_requests',
      description: 'Review and merge pull requests',
      type: 'integration',
      enabled: true,
    },
    {
      name: 'vapi_phone',
      description: 'Make voice calls via Vapi',
      type: 'integration',
      enabled: true,
    },
    {
      name: 'vapi_sms',
      description: 'Send SMS messages via Vapi',
      type: 'integration',
      enabled: true,
    },
    {
      name: 'vapi_email',
      description: 'Send emails via Vapi',
      type: 'integration',
      enabled: true,
    },
  ],

  triggers: [
    {
      event: 'claude_code_review_complete',
      action: 'review_pr_and_decide',
      priority: 'high',
      enabled: true,
    },
    {
      event: 'issue_needs_clarification',
      action: 'request_clarification',
      priority: 'medium',
      enabled: true,
    },
    {
      event: 'blocking_issue_detected',
      action: 'escalate_via_sms',
      priority: 'high',
      enabled: true,
    },
  ],

  handoffs: [
    {
      toAgent: 'claude',
      condition: 'issue_ready_for_implementation',
      context: ['issue_description', 'requirements', 'acceptance_criteria'],
      priority: 'medium',
    },
  ],

  guardrails: [
    {
      type: 'output',
      rule: 'never_merge_pr_without_passing_ci',
      action: 'block',
      message: 'Cannot merge PR: CI/CD checks must pass',
    },
    {
      type: 'output',
      rule: 'never_merge_pr_without_code_review',
      action: 'block',
      message: 'Cannot merge PR: Code review must be completed',
    },
    {
      type: 'output',
      rule: 'limit_sms_escalations',
      action: 'warn',
      message: 'SMS escalation rate limit approaching (10/hour)',
    },
  ],

  sessions: true,

  metadata: {
    personality: 'Professional, efficient, communicative, decisive',
    communication_style: 'Clear, concise, action-oriented',
    decision_framework: 'Data-driven with human escalation for critical decisions',
  },
}

/**
 * Escalation rules for the pdm agent
 */
export const escalationRules: EscalationRule[] = [
  {
    condition: 'priority_p0_issue_created',
    channel: 'vapi_sms',
    threshold: 0, // Immediate
    message: '🚨 P0 issue detected',
  },
  {
    condition: 'pr_blocked_for_24_hours',
    channel: 'vapi_sms',
    threshold: 24,
    message: '⚠️ PR blocked for 24+ hours',
  },
  {
    condition: 'multiple_ci_failures',
    channel: 'vapi_sms',
    threshold: 6,
    message: '🔥 CI/CD pipeline failing for 6+ hours',
  },
  {
    condition: 'security_vulnerability_detected',
    channel: 'vapi_phone',
    threshold: 0, // Immediate
    message: '🔐 Security vulnerability requires immediate attention',
  },
  {
    condition: 'weekly_summary',
    channel: 'vapi_email',
    message: '📊 Weekly roadmap summary',
  },
]

/**
 * Prioritization rules for issue triage
 */
export const prioritizationRules: PrioritizationRule[] = [
  {
    condition: 'label_contains_security OR title_contains_vulnerability',
    priority: 'P0',
    labels: ['security', 'urgent'],
  },
  {
    condition: 'blocks_production OR label_contains_critical',
    priority: 'P0',
    labels: ['critical', 'production'],
  },
  {
    condition: 'blocks_roadmap_milestone',
    priority: 'P1',
    labels: ['roadmap', 'blocker'],
  },
  {
    condition: 'type_feature AND milestone_set',
    priority: 'P2',
    labels: ['feature', 'planned'],
  },
  {
    condition: 'type_enhancement OR label_contains_nice-to-have',
    priority: 'P3',
    labels: ['enhancement'],
  },
]

/**
 * PR merge criteria checker
 */
export interface MergeCriteria {
  ciPassing: boolean
  codeReviewComplete: boolean
  testsIncluded: boolean
  documentationUpdated: boolean
  noUnresolvedComments: boolean
  alignedWithRoadmap: boolean
}

/**
 * Check if PR meets merge criteria
 * @throws {TypeError} If criteria is not an object or missing required properties
 */
export function canMergePR(criteria: MergeCriteria): { canMerge: boolean; reasons: string[] } {
  if (!criteria || typeof criteria !== 'object') {
    throw new TypeError('criteria must be an object')
  }

  const requiredKeys: (keyof MergeCriteria)[] = [
    'ciPassing',
    'codeReviewComplete',
    'testsIncluded',
    'documentationUpdated',
    'noUnresolvedComments',
    'alignedWithRoadmap',
  ]

  for (const key of requiredKeys) {
    if (typeof criteria[key] !== 'boolean') {
      throw new TypeError(`criteria.${key} must be a boolean`)
    }
  }

  const reasons: string[] = []

  if (!criteria.ciPassing) reasons.push('CI/CD checks must pass')
  if (!criteria.codeReviewComplete) reasons.push('Code review must be completed')
  if (!criteria.testsIncluded) reasons.push('Tests must be included')
  if (!criteria.documentationUpdated) reasons.push('Documentation must be updated')
  if (!criteria.noUnresolvedComments) reasons.push('All comments must be resolved')
  if (!criteria.alignedWithRoadmap) reasons.push('Must align with roadmap goals')

  return {
    canMerge: reasons.length === 0,
    reasons,
  }
}

/**
 * Determine if PR should be auto-merged
 * @throws {TypeError} If pr is not an object or missing required properties
 */
export function shouldAutoMerge(pr: PRMetadata): boolean {
  if (!pr || typeof pr !== 'object') {
    throw new TypeError('pr must be an object')
  }

  if (typeof pr.title !== 'string') {
    throw new TypeError('pr.title must be a string')
  }

  if (!Array.isArray(pr.files)) {
    throw new TypeError('pr.files must be an array')
  }

  if (!Array.isArray(pr.labels)) {
    throw new TypeError('pr.labels must be an array')
  }

  // Dependency updates
  if (pr.title.includes('chore(deps)') || pr.labels.includes('dependencies')) {
    return true
  }

  // Documentation-only changes
  const allDocsFiles = pr.files.every((file: string) => typeof file === 'string' && (file.endsWith('.md') || file.endsWith('.mdx')))
  if (allDocsFiles && pr.files.length > 0) {
    return true
  }

  // Minor bug fixes with tests
  if (pr.title.includes('fix:') && pr.labels.includes('bug') && pr.labels.includes('has-tests')) {
    return true
  }

  return false
}

/**
 * Determine if PR requires human review
 * @throws {TypeError} If pr is not an object or missing required properties
 */
export function requiresHumanReview(pr: PRMetadata): boolean {
  if (!pr || typeof pr !== 'object') {
    throw new TypeError('pr must be an object')
  }

  if (typeof pr.title !== 'string') {
    throw new TypeError('pr.title must be a string')
  }

  if (!Array.isArray(pr.files)) {
    throw new TypeError('pr.files must be an array')
  }

  if (!Array.isArray(pr.labels)) {
    throw new TypeError('pr.labels must be an array')
  }

  // Breaking changes
  if (pr.title.includes('BREAKING') || pr.labels.includes('breaking-change')) {
    return true
  }

  // Architecture modifications
  if (pr.files.some((file: string) => typeof file === 'string' && (file.includes('architecture') || file.includes('config')))) {
    return true
  }

  // Security-sensitive changes
  if (pr.labels.includes('security') || pr.files.some((file: string) => typeof file === 'string' && (file.includes('auth') || file.includes('security')))) {
    return true
  }

  // Major features
  if (pr.labels.includes('major-feature') || pr.files.length > 20) {
    return true
  }

  return false
}

/**
 * Sanitize user input to prevent injection attacks
 * Removes or escapes characters that could be used for markdown injection, XSS, or other attacks
 *
 * Security measures:
 * - Removes HTML/XML tags (< and >)
 * - Removes brackets and parentheses to prevent link injection
 * - Removes markdown formatting characters (backticks, asterisks, underscores, hashtags, tildes)
 * - Replaces newlines with spaces to prevent formatting abuse
 * - Limits length to 500 characters to prevent abuse
 * - Trims whitespace
 */
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  return input
    .replace(/[<>]/g, '') // Remove HTML/XML tags
    .replace(/[\[\]()]/g, '') // Remove brackets and parens entirely (prevents link injection)
    .replace(/[`*_#~]/g, '') // Remove markdown formatting chars
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim()
    .slice(0, 500) // Limit length to prevent abuse
}

/**
 * Generate PR review comment
 * @param pr - Pull request details
 * @param reviewOwner - GitHub username to cc for human review (defaults to process.env.GITHUB_REVIEW_OWNER or 'nathanclevenger')
 * @throws {TypeError} If pr is not an object or missing required properties
 */
export function generatePRReviewComment(
  pr: {
    number: number
    author: string
    title: string
    canMerge: boolean
    reasons?: string[]
    autoMerge: boolean
    requiresHumanReview: boolean
  },
  reviewOwner?: string
): string {
  if (!pr || typeof pr !== 'object') {
    throw new TypeError('pr must be an object')
  }

  if (typeof pr.number !== 'number') {
    throw new TypeError('pr.number must be a number')
  }

  if (typeof pr.author !== 'string') {
    throw new TypeError('pr.author must be a string')
  }

  if (typeof pr.title !== 'string') {
    throw new TypeError('pr.title must be a string')
  }

  if (typeof pr.canMerge !== 'boolean') {
    throw new TypeError('pr.canMerge must be a boolean')
  }

  if (typeof pr.autoMerge !== 'boolean') {
    throw new TypeError('pr.autoMerge must be a boolean')
  }

  if (typeof pr.requiresHumanReview !== 'boolean') {
    throw new TypeError('pr.requiresHumanReview must be a boolean')
  }

  const sanitizedAuthor = sanitizeInput(pr.author)
  const owner = reviewOwner || process.env.GITHUB_REVIEW_OWNER || 'nathanclevenger'

  if (pr.requiresHumanReview) {
    return `@${sanitizedAuthor} This PR requires human review due to its scope or sensitivity.

I've completed my automated review, but a team member should review before merging.

cc: @${owner}`
  }

  if (pr.canMerge && pr.autoMerge) {
    return `@${sanitizedAuthor} This PR looks great! All checks passing and code review complete.

✅ Auto-merging now. Thanks for the contribution!`
  }

  if (pr.canMerge) {
    return `@${sanitizedAuthor} This PR is ready to merge!

✅ All criteria met:
- CI/CD checks passing
- Code review completed
- Tests included
- Documentation updated

Merging now. Great work!`
  }

  const reasonsList = pr.reasons?.map((r) => `- ${sanitizeInput(r)}`).join('\n') || ''
  return `@${sanitizedAuthor} This PR needs attention before it can be merged:

${reasonsList}

Please address these items and I'll review again. Let me know if you need any help!`
}

/**
 * Generate issue clarification comment
 * @throws {TypeError} If issue is not an object or missing required properties
 */
export function generateClarificationComment(issue: { author: string; title: string; missingInfo: string[] }): string {
  if (!issue || typeof issue !== 'object') {
    throw new TypeError('issue must be an object')
  }

  if (typeof issue.author !== 'string') {
    throw new TypeError('issue.author must be a string')
  }

  if (typeof issue.title !== 'string') {
    throw new TypeError('issue.title must be a string')
  }

  if (!Array.isArray(issue.missingInfo)) {
    throw new TypeError('issue.missingInfo must be an array')
  }

  const sanitizedAuthor = sanitizeInput(issue.author)
  const infoList = issue.missingInfo.map((info) => `- ${sanitizeInput(String(info))}`).join('\n')

  return `@${sanitizedAuthor} Thanks for opening this issue! To help implement this feature, could you provide:

${infoList}

Once we have these details, I'll assign this to @claude for implementation.`
}

/**
 * Generate blocking issue SMS
 * @param issue - Issue details
 * @param repoUrl - Repository URL (defaults to process.env.GITHUB_REPO_URL or 'https://github.com/dot-do/platform')
 * @throws {TypeError} If issue is not an object or missing required properties
 */
export function generateBlockingSMS(issue: { number: number; title: string; duration: string }, repoUrl?: string): string {
  if (!issue || typeof issue !== 'object') {
    throw new TypeError('issue must be an object')
  }

  if (typeof issue.number !== 'number') {
    throw new TypeError('issue.number must be a number')
  }

  if (typeof issue.title !== 'string') {
    throw new TypeError('issue.title must be a string')
  }

  if (typeof issue.duration !== 'string') {
    throw new TypeError('issue.duration must be a string')
  }

  const sanitizedTitle = sanitizeInput(issue.title)
  const sanitizedDuration = sanitizeInput(issue.duration)
  const baseUrl = repoUrl || process.env.GITHUB_REPO_URL || 'https://github.com/dot-do/platform'

  return `🚨 BLOCKING: ${sanitizedTitle}
Duration: ${sanitizedDuration}
${baseUrl}/issues/${issue.number}`
}

/**
 * Export all pdm agent utilities
 */
export default {
  agent: pdmAgent,
  escalationRules,
  prioritizationRules,
  canMergePR,
  shouldAutoMerge,
  requiresHumanReview,
  generatePRReviewComment,
  generateClarificationComment,
  generateBlockingSMS,
}
