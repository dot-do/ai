/**
 * Agent type definitions based on OpenAI AgentKit
 * Implements the Agent schema for the .do platform
 */

/**
 * Core Agent interface following OpenAI AgentKit primitives
 */
export interface Agent {
  $type: 'Agent'
  $id?: string
  name: string
  version?: string
  description: string
  model: 'gpt-5' | 'gpt-5-mini' | 'gpt-5-nano' | 'gpt-5-codex' | 'claude-sonnet-4.5'
  agent?: string // Named agent identity (e.g., "Dara")
  role?: string // Agent role (e.g., "Product Manager")
  instructions?: string
  systemPrompt?: string
  capabilities?: string[]
  tools?: AgentTool[]
  triggers?: AgentTrigger[]
  handoffs?: AgentHandoff[]
  guardrails?: AgentGuardrail[]
  sessions?: boolean
  metadata?: Record<string, any>
}

/**
 * Tool definition for agent capabilities
 */
export interface AgentTool {
  name: string
  description: string
  type?: 'function' | 'api' | 'integration'
  parameters?: Record<string, any>
  enabled?: boolean
  config?: Record<string, any>
}

/**
 * Trigger definition for workflow automation
 */
export interface AgentTrigger {
  event: string
  action: string
  condition?: string
  priority?: 'high' | 'medium' | 'low'
  enabled?: boolean
}

/**
 * Handoff definition for agent delegation
 */
export interface AgentHandoff {
  toAgent: string
  condition?: string
  context?: string[]
  priority?: 'high' | 'medium' | 'low'
}

/**
 * Guardrail definition for input/output validation
 */
export interface AgentGuardrail {
  type: 'input' | 'output'
  rule: string
  action: 'block' | 'warn' | 'log'
  message?: string
}

/**
 * Communication channel configuration
 */
export interface CommunicationChannel {
  type: 'github' | 'vapi_phone' | 'vapi_sms' | 'vapi_email' | 'slack' | 'discord'
  enabled: boolean
  config?: Record<string, any>
  escalationRules?: EscalationRule[]
}

/**
 * Escalation rule for urgent notifications
 */
export interface EscalationRule {
  condition: string
  channel: 'vapi_sms' | 'vapi_phone' | 'vapi_email'
  threshold?: number // Time in hours before escalation
  recipients?: string[]
  message?: string
}

/**
 * Prioritization rule for issue triage
 */
export interface PrioritizationRule {
  condition: string
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  labels?: string[]
  assignee?: string
}

/**
 * Workflow trigger configuration
 */
export interface WorkflowTrigger {
  event: string
  source: 'github' | 'internal' | 'external'
  action: string
  config?: Record<string, any>
}

/**
 * Session configuration for conversation history
 */
export interface SessionConfig {
  enabled: boolean
  maxHistory?: number
  persistenceType?: 'memory' | 'database' | 'file'
  ttl?: number // Time to live in seconds
}

/**
 * GitHub integration configuration
 */
export interface GitHubConfig {
  token?: string
  repos?: string[]
  permissions: {
    contents?: 'read' | 'write'
    issues?: 'read' | 'write'
    pullRequests?: 'read' | 'write'
    projects?: 'read' | 'write'
    actions?: 'read' | 'write'
  }
}

/**
 * Vapi integration configuration
 *
 * Rate Limiting:
 * Rate limits are defined here but must be enforced at the integration layer
 * (webhook handlers, API middleware, etc.). The agent configuration provides
 * the limits, but enforcement should happen in:
 *
 * - Phase 2: GitHub webhook handlers should track and enforce rate limits
 * - Phase 3: Vapi integration middleware should implement rate limiting
 * - Recommended: Use a rate limiting library (e.g., @upstash/ratelimit) or
 *   Redis-based rate limiting for distributed enforcement
 *
 * Example enforcement pattern:
 * ```typescript
 * import { Ratelimit } from '@upstash/ratelimit'
 * import { Redis } from '@upstash/redis'
 *
 * const ratelimit = new Ratelimit({
 *   redis: Redis.fromEnv(),
 *   limiter: Ratelimit.slidingWindow(
 *     vapiConfig.rateLimits?.smsPerHour ?? 10,
 *     '1 h'
 *   )
 * })
 *
 * // Before sending SMS
 * const { success } = await ratelimit.limit(agentId)
 * if (!success) throw new Error('Rate limit exceeded')
 * ```
 *
 * Default Rate Limits:
 * - smsPerHour: 10 (prevents spam, allows urgent notifications)
 * - callsPerDay: 5 (voice calls are more intrusive, limit accordingly)
 */
export interface VapiConfig {
  apiKey?: string
  phoneNumber?: string
  assistantId?: string
  capabilities: {
    phone?: boolean
    sms?: boolean
    email?: boolean
  }
  rateLimits?: {
    /** Maximum SMS messages per hour (default: 10) */
    smsPerHour?: number
    /** Maximum voice calls per day (default: 5) */
    callsPerDay?: number
  }
}

/**
 * Agent context for runtime execution
 */
export interface AgentContext {
  agent: Agent
  session?: SessionConfig
  github?: GitHubConfig
  vapi?: VapiConfig
  env?: Record<string, string>
}

/**
 * Agent execution result
 */
export interface AgentResult {
  success: boolean
  action: string
  message?: string
  data?: any
  error?: Error
  timestamp: string
}

/**
 * Pull Request metadata for agent operations
 */
export interface PRMetadata {
  title: string
  files: string[]
  labels: string[]
}

/**
 * Issue metadata for agent operations
 */
export interface IssueMetadata {
  title: string
  body: string
  labels: string[]
  author: string
}
