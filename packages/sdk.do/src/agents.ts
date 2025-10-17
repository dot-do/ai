/**
 * agents.do SDK - Define, deploy, and execute AI agents
 *
 * Provides a simple API for creating and managing autonomous AI agents
 * on the Cloudflare agents framework.
 *
 * @example
 * ```typescript
 * import { defineAgent } from 'sdk.do'
 *
 * const agent = defineAgent({
 *   name: 'customer-support',
 *   description: 'Handles customer support queries',
 *   autonomyLevel: 'supervised',
 *   tools: [customerDb, emailSender],
 *   model: 'claude-sonnet-4.5',
 *   systemPrompt: 'You are a helpful customer support agent...'
 * })
 *
 * // Deploy the agent
 * await agent.deploy({
 *   apiKey: process.env.DO_API_KEY,
 *   environment: 'production'
 * })
 *
 * // Execute the agent
 * const result = await agent.execute({
 *   input: 'Help me reset my password',
 *   context: { userId: 'user_123' }
 * })
 * ```
 */

/**
 * Autonomy levels define how much independence an agent has
 *
 * - supervised: Requires human approval for all actions
 * - semi-autonomous: Auto-executes safe actions, asks for dangerous ones
 * - autonomous: Executes all actions without human intervention
 */
export type AutonomyLevel = 'supervised' | 'semi-autonomous' | 'autonomous'

/**
 * Agent state during execution
 */
export type AgentState = 'idle' | 'running' | 'paused' | 'stopped' | 'error'

/**
 * Tool definition for agent capabilities
 */
export interface AgentTool {
  /** Unique identifier for the tool */
  name: string
  /** Human-readable description of what the tool does */
  description: string
  /** JSON schema for tool parameters */
  parameters?: Record<string, any>
  /** Is this tool safe to execute without approval? (only for semi-autonomous) */
  requiresApproval?: boolean
  /** Optional function to execute the tool (if running locally) */
  execute?: (params: any) => Promise<any>
}

/**
 * Agent configuration
 */
export interface AgentConfig {
  /** Unique name for the agent (kebab-case) */
  name: string
  /** Human-readable description */
  description: string
  /** How much autonomy the agent has */
  autonomyLevel: AutonomyLevel
  /** Available tools the agent can use */
  tools: AgentTool[]
  /** AI model to use */
  model?: string
  /** System prompt that defines agent behavior */
  systemPrompt?: string
  /** Temperature for AI responses (0-1) */
  temperature?: number
  /** Maximum tokens for responses */
  maxTokens?: number
  /** Custom metadata */
  metadata?: Record<string, any>
  /** Rate limits */
  rateLimits?: {
    /** Max executions per minute */
    perMinute?: number
    /** Max executions per hour */
    perHour?: number
    /** Max executions per day */
    perDay?: number
  }
}

/**
 * Deployment options
 */
export interface DeployOptions {
  /** API key for authentication */
  apiKey?: string
  /** Deployment environment */
  environment?: 'development' | 'staging' | 'production'
  /** Base URL for agents.do API */
  baseUrl?: string
  /** Custom domain for the agent */
  customDomain?: string
  /** Enable logging */
  logging?: boolean
}

/**
 * Execution options
 */
export interface ExecuteOptions {
  /** User input or prompt */
  input: string
  /** Additional context for the execution */
  context?: Record<string, any>
  /** Maximum execution time in seconds */
  timeout?: number
  /** Stream responses */
  stream?: boolean
  /** Callback for streaming responses */
  onStream?: (chunk: string) => void
  /** Callback for approval requests (supervised/semi-autonomous) */
  onApprovalRequired?: (action: PendingAction) => Promise<boolean>
}

/**
 * Action pending approval
 */
export interface PendingAction {
  /** Action ID */
  id: string
  /** Tool being executed */
  tool: string
  /** Parameters for the tool */
  parameters: Record<string, any>
  /** AI's reasoning for this action */
  reasoning: string
  /** Risk level: low, medium, high */
  risk: 'low' | 'medium' | 'high'
}

/**
 * Execution result
 */
export interface ExecuteResult {
  /** Execution ID */
  id: string
  /** Agent response */
  response: string
  /** Actions taken during execution */
  actions: ExecutedAction[]
  /** Execution metadata */
  metadata: {
    /** Start time (ISO 8601) */
    startTime: string
    /** End time (ISO 8601) */
    endTime: string
    /** Duration in milliseconds */
    duration: number
    /** Tokens used */
    tokensUsed: number
    /** Cost in USD */
    cost: number
  }
  /** Any errors encountered */
  errors?: Array<{
    message: string
    code?: string
    tool?: string
  }>
}

/**
 * Executed action
 */
export interface ExecutedAction {
  /** Action ID */
  id: string
  /** Tool executed */
  tool: string
  /** Parameters used */
  parameters: Record<string, any>
  /** Result from the tool */
  result: any
  /** Whether approval was required */
  approved?: boolean
  /** Timestamp (ISO 8601) */
  timestamp: string
}

/**
 * Agent status
 */
export interface AgentStatus {
  /** Current state */
  state: AgentState
  /** Total executions */
  executions: number
  /** Failed executions */
  errors: number
  /** Agent uptime */
  uptime: string
  /** Last execution time (ISO 8601) */
  lastExecution?: string
  /** Deployed version */
  version: string
  /** Deployment environment */
  environment: string
}

/**
 * Agent metrics
 */
export interface AgentMetrics {
  /** Average response time in milliseconds */
  avgResponseTime: number
  /** Success rate (0-1) */
  successRate: number
  /** Total executions */
  totalExecutions: number
  /** Executions in last 24 hours */
  executions24h: number
  /** Total tokens used */
  totalTokens: number
  /** Total cost in USD */
  totalCost: number
  /** Most used tools */
  topTools: Array<{ tool: string; count: number }>
  /** Error breakdown */
  errors: Array<{ type: string; count: number }>
  /** Uptime percentage (0-100) */
  uptimePercentage: number
}

/**
 * Agent client for interacting with deployed agents
 */
export class Agent {
  private config: AgentConfig
  private deploymentId?: string
  private baseUrl: string
  private apiKey?: string

  constructor(config: AgentConfig, options?: { baseUrl?: string; apiKey?: string }) {
    this.config = config
    this.baseUrl = options?.baseUrl || 'https://agents.do'
    this.apiKey = options?.apiKey || process.env.DO_API_KEY
  }

  /**
   * Deploy the agent to agents.do
   */
  async deploy(options: DeployOptions = {}): Promise<{ id: string; url: string }> {
    const apiKey = options.apiKey || this.apiKey
    if (!apiKey) {
      throw new Error('API key is required for deployment. Provide it via options.apiKey or DO_API_KEY environment variable.')
    }

    const baseUrl = options.baseUrl || this.baseUrl
    const response = await fetch(`${baseUrl}/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...this.config,
        environment: options.environment || 'production',
        customDomain: options.customDomain,
        logging: options.logging ?? true,
      }),
    })

    if (!response.ok) {
      const error = (await response.json().catch(() => ({ message: response.statusText }))) as { message?: string }
      throw new Error(`Deployment failed: ${error.message || response.statusText}`)
    }

    const result = (await response.json()) as { id: string; url: string }
    this.deploymentId = result.id

    return {
      id: result.id,
      url: result.url,
    }
  }

  /**
   * Execute the agent with given input
   */
  async execute(options: ExecuteOptions): Promise<ExecuteResult> {
    if (!this.deploymentId && !this.apiKey) {
      throw new Error('Agent must be deployed before execution, or provide an API key')
    }

    const response = await fetch(`${this.baseUrl}/execute/${this.deploymentId || this.config.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({
        input: options.input,
        context: options.context,
        timeout: options.timeout,
        stream: options.stream,
      }),
    })

    if (!response.ok) {
      const error = (await response.json().catch(() => ({ message: response.statusText }))) as { message?: string }
      throw new Error(`Execution failed: ${error.message || response.statusText}`)
    }

    // Handle streaming responses
    if (options.stream && options.onStream) {
      return this.handleStreamingResponse(response, options.onStream, options.onApprovalRequired)
    }

    const result = (await response.json()) as ExecuteResult & { pendingActions?: PendingAction[] }

    // Handle approval requests for supervised/semi-autonomous agents
    if (result.pendingActions && options.onApprovalRequired) {
      for (const action of result.pendingActions) {
        const approved = await options.onApprovalRequired(action)
        if (!approved) {
          throw new Error(`Action ${action.tool} was rejected by user`)
        }
      }
    }

    return result
  }

  /**
   * Get current agent status
   */
  async status(): Promise<AgentStatus> {
    const response = await fetch(`${this.baseUrl}/status/${this.deploymentId || this.config.name}`, {
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    })

    if (!response.ok) {
      const error = (await response.json().catch(() => ({ message: response.statusText }))) as { message?: string }
      throw new Error(`Failed to get status: ${error.message || response.statusText}`)
    }

    return response.json() as Promise<AgentStatus>
  }

  /**
   * Get agent metrics
   */
  async metrics(period?: '24h' | '7d' | '30d' | '90d'): Promise<AgentMetrics> {
    const url = new URL(`${this.baseUrl}/metrics/${this.deploymentId || this.config.name}`)
    if (period) url.searchParams.set('period', period)

    const response = await fetch(url.toString(), {
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    })

    if (!response.ok) {
      const error = (await response.json().catch(() => ({ message: response.statusText }))) as { message?: string }
      throw new Error(`Failed to get metrics: ${error.message || response.statusText}`)
    }

    return response.json() as Promise<AgentMetrics>
  }

  /**
   * Update agent configuration
   */
  async update(updates: Partial<AgentConfig>): Promise<void> {
    if (!this.deploymentId) {
      throw new Error('Agent must be deployed before updating')
    }

    const response = await fetch(`${this.baseUrl}/update/${this.deploymentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = (await response.json().catch(() => ({ message: response.statusText }))) as { message?: string }
      throw new Error(`Update failed: ${error.message || response.statusText}`)
    }

    // Update local config
    this.config = { ...this.config, ...updates }
  }

  /**
   * Pause agent execution
   */
  async pause(): Promise<void> {
    await this.updateState('paused')
  }

  /**
   * Resume agent execution
   */
  async resume(): Promise<void> {
    await this.updateState('running')
  }

  /**
   * Stop agent execution
   */
  async stop(): Promise<void> {
    await this.updateState('stopped')
  }

  /**
   * Delete the agent
   */
  async delete(): Promise<void> {
    if (!this.deploymentId) {
      throw new Error('Agent must be deployed before deletion')
    }

    const response = await fetch(`${this.baseUrl}/delete/${this.deploymentId}`, {
      method: 'DELETE',
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    })

    if (!response.ok) {
      const error = (await response.json().catch(() => ({ message: response.statusText }))) as { message?: string }
      throw new Error(`Deletion failed: ${error.message || response.statusText}`)
    }

    this.deploymentId = undefined
  }

  /**
   * Get agent configuration
   */
  getConfig(): Readonly<AgentConfig> {
    return { ...this.config }
  }

  /**
   * Get deployment ID
   */
  getDeploymentId(): string | undefined {
    return this.deploymentId
  }

  /**
   * Internal: Handle streaming responses
   */
  private async handleStreamingResponse(
    response: Response,
    onStream: (chunk: string) => void,
    onApprovalRequired?: (action: PendingAction) => Promise<boolean>
  ): Promise<ExecuteResult> {
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Response body is not readable')
    }

    const decoder = new TextDecoder()
    let buffer = ''
    let fullResponse = ''
    const actions: ExecutedAction[] = []
    const errors: Array<{ message: string; code?: string; tool?: string }> = []
    const startTime = new Date().toISOString()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue

          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const event = JSON.parse(data)

            if (event.type === 'chunk') {
              fullResponse += event.content
              onStream(event.content)
            } else if (event.type === 'action') {
              actions.push(event.action)
            } else if (event.type === 'approval_required' && onApprovalRequired) {
              const approved = await onApprovalRequired(event.action)
              if (!approved) {
                throw new Error(`Action ${event.action.tool} was rejected by user`)
              }
            } else if (event.type === 'error') {
              errors.push(event.error)
            }
          } catch (e) {
            console.error('Failed to parse SSE event:', e)
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    const endTime = new Date().toISOString()
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime()

    return {
      id: crypto.randomUUID(),
      response: fullResponse,
      actions,
      metadata: {
        startTime,
        endTime,
        duration,
        tokensUsed: 0, // Would be populated by actual API
        cost: 0, // Would be populated by actual API
      },
      errors: errors.length > 0 ? errors : undefined,
    }
  }

  /**
   * Internal: Update agent state
   */
  private async updateState(state: AgentState): Promise<void> {
    if (!this.deploymentId) {
      throw new Error('Agent must be deployed before state changes')
    }

    const response = await fetch(`${this.baseUrl}/state/${this.deploymentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({ state }),
    })

    if (!response.ok) {
      const error = (await response.json().catch(() => ({ message: response.statusText }))) as { message?: string }
      throw new Error(`State update failed: ${error.message || response.statusText}`)
    }
  }
}

/**
 * Define and create an agent
 *
 * @example
 * ```typescript
 * const agent = defineAgent({
 *   name: 'sales-assistant',
 *   description: 'Helps qualify and route sales leads',
 *   autonomyLevel: 'semi-autonomous',
 *   tools: [
 *     {
 *       name: 'check_crm',
 *       description: 'Look up customer information in CRM',
 *       requiresApproval: false
 *     },
 *     {
 *       name: 'send_contract',
 *       description: 'Send contract to customer',
 *       requiresApproval: true
 *     }
 *   ],
 *   model: 'gpt-5',
 *   systemPrompt: 'You are a sales assistant who helps qualify leads...'
 * })
 * ```
 */
export function defineAgent(config: AgentConfig): Agent {
  // Validate config
  validateAgentConfig(config)

  return new Agent(config)
}

/**
 * Validate agent configuration
 */
function validateAgentConfig(config: AgentConfig): void {
  if (!config.name) {
    throw new Error('Agent name is required')
  }

  if (!/^[a-z0-9-]+$/.test(config.name)) {
    throw new Error('Agent name must be kebab-case (lowercase letters, numbers, and hyphens only)')
  }

  if (!config.description) {
    throw new Error('Agent description is required')
  }

  if (!['supervised', 'semi-autonomous', 'autonomous'].includes(config.autonomyLevel)) {
    throw new Error('Invalid autonomy level. Must be: supervised, semi-autonomous, or autonomous')
  }

  if (!Array.isArray(config.tools)) {
    throw new Error('Tools must be an array')
  }

  for (const tool of config.tools) {
    if (!tool.name) {
      throw new Error('Tool name is required')
    }
    if (!tool.description) {
      throw new Error(`Tool ${tool.name} requires a description`)
    }
  }

  if (config.temperature !== undefined && (config.temperature < 0 || config.temperature > 1)) {
    throw new Error('Temperature must be between 0 and 1')
  }

  if (config.maxTokens !== undefined && config.maxTokens < 1) {
    throw new Error('maxTokens must be greater than 0')
  }
}

/**
 * List all deployed agents
 */
export async function listAgents(options?: { apiKey?: string; baseUrl?: string }): Promise<
  Array<{
    id: string
    name: string
    environment: string
    state: AgentState
    url: string
  }>
> {
  const apiKey = options?.apiKey || process.env.DO_API_KEY
  if (!apiKey) {
    throw new Error('API key is required. Provide it via options.apiKey or DO_API_KEY environment variable.')
  }

  const baseUrl = options?.baseUrl || 'https://agents.do'
  const response = await fetch(`${baseUrl}/list`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => ({ message: response.statusText }))) as { message?: string }
    throw new Error(`Failed to list agents: ${error.message || response.statusText}`)
  }

  return response.json() as Promise<Array<{ id: string; name: string; environment: string; state: AgentState; url: string }>>
}

/**
 * Get an existing agent by ID or name
 */
export async function getAgent(idOrName: string, options?: { apiKey?: string; baseUrl?: string }): Promise<{ agent: Agent; status: AgentStatus }> {
  const apiKey = options?.apiKey || process.env.DO_API_KEY
  if (!apiKey) {
    throw new Error('API key is required. Provide it via options.apiKey or DO_API_KEY environment variable.')
  }

  const baseUrl = options?.baseUrl || 'https://agents.do'
  const response = await fetch(`${baseUrl}/get/${idOrName}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => ({ message: response.statusText }))) as { message?: string }
    throw new Error(`Failed to get agent: ${error.message || response.statusText}`)
  }

  const data = (await response.json()) as { id: string; config: AgentConfig; status: AgentStatus }
  const agent = new Agent(data.config, { baseUrl, apiKey })
  ;(agent as any).deploymentId = data.id

  return {
    agent,
    status: data.status,
  }
}
